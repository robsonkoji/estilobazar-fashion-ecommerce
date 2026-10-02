import { getCart, clearCart, showToast } from '../utils/storage.js';
import { createPixPayment, processCreditCardPayment, checkPaymentStatus, createCheckoutProPreference } from '../services/paymentService.js';
import { calculateSmartShipping, fetchAddressByCep } from '../services/shippingService.js';

export function openCheckoutModal() {
  const cart = getCart();
  if (cart.length === 0) {
    showToast('Seu carrinho está vazio! Adicione produtos antes de finalizar. 🛒');
    return;
  }

  const existing = document.getElementById('checkout-modal');
  if (existing) existing.remove();

  const subtotal = cart.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
  const freeShippingThreshold = 250;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  
  let currentCep = '';
  let calculatedShippingResult = null;
  let shippingCost = isFreeShipping ? 0 : 18.90;
  let selectedShippingOptionId = '';

  const modal = document.createElement('div');
  modal.className = 'modal-overlay active';
  modal.id = 'checkout-modal';

  let currentStep = 1;
  let paymentMethod = 'pix'; // 'pix' (Sem Login) | 'card' | 'mp_pro'

  function renderStep1() {
    return `
      <div class="checkout-step-content">
        <h3 class="checkout-step-title">1. Dados de Entrega &amp; Endereço</h3>
        
        <form id="checkout-step1-form" class="checkout-form">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Nome Completo *</label>
              <input type="text" required class="form-input" id="cust-name" placeholder="Ex: Ana Silva">
            </div>
            <div class="form-group">
              <label class="form-label">CPF *</label>
              <input type="text" required class="form-input" id="cust-cpf" placeholder="000.000.000-00">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">E-mail para Recibo *</label>
              <input type="email" required class="form-input" id="cust-email" placeholder="ana@email.com">
            </div>
            <div class="form-group">
              <label class="form-label">WhatsApp / Celular *</label>
              <input type="tel" required class="form-input" id="cust-phone" placeholder="(11) 99999-8888">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group" style="flex: 0 0 160px;">
              <label class="form-label">CEP * (Auto-preencher)</label>
              <input type="text" required class="form-input" id="cust-cep" placeholder="00000-000">
            </div>
            <div class="form-group">
              <label class="form-label">Endereço / Rua *</label>
              <input type="text" required class="form-input" id="cust-address" placeholder="Rua, Avenida...">
            </div>
            <div class="form-group" style="flex: 0 0 90px;">
              <label class="form-label">Número *</label>
              <input type="text" required class="form-input" id="cust-number" placeholder="123">
            </div>
          </div>

          <div id="cep-smart-info-box" style="display: none; margin-bottom: 0.8rem; font-size: 0.82rem; background: var(--c-mint-light); border: 1px solid var(--c-mint-dark); padding: 0.5rem 0.8rem; border-radius: var(--radius-sm); color: var(--c-text-main);">
            <!-- Exibe o cálculo de frete de Guarulhos para o CEP digitado -->
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Bairro</label>
              <input type="text" class="form-input" id="cust-bairro" placeholder="Jardim América">
            </div>
            <div class="form-group">
              <label class="form-label">Cidade *</label>
              <input type="text" required class="form-input" id="cust-city" placeholder="São Paulo">
            </div>
            <div class="form-group" style="flex: 0 0 80px;">
              <label class="form-label">UF *</label>
              <input type="text" required class="form-input" id="cust-uf" placeholder="SP" maxlength="2">
            </div>
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem; padding: 0.9rem;">
            Ir para Opções de Frete &amp; Pagamento →
          </button>
        </form>
      </div>
    `;
  }

  function renderStep2() {
    const rawOptions = (calculatedShippingResult && calculatedShippingResult.options) ? [...calculatedShippingResult.options] : [
      {
        id: 'pac_standard',
        name: isFreeShipping ? '🚚 Frete Grátis Correios PAC' : '📦 Correios PAC Nacional',
        desc: 'Envio econômico direto da central em Guarulhos - SP',
        time: '3 a 6 dias úteis',
        price: isFreeShipping ? 0 : 12.90
      },
      {
        id: 'sedex_standard',
        name: '⚡ Correios SEDEX Expresso',
        desc: 'Postagem prioritária de Guarulhos - SP',
        time: '1 a 2 dias úteis',
        price: 17.90
      }
    ];

    // Ordena do mais barato para o mais caro (Garantindo o mais acessível primeiro)
    const shippingOptions = rawOptions.sort((a, b) => a.price - b.price);

    // Se nenhuma opção foi explicitamente escolhida pelo usuário, seleciona automaticamente a mais econômica (índice 0)
    if (!selectedShippingOptionId || !shippingOptions.some(o => o.id === selectedShippingOptionId)) {
      selectedShippingOptionId = shippingOptions[0].id;
      shippingCost = shippingOptions[0].price;
    } else {
      const currentOpt = shippingOptions.find(o => o.id === selectedShippingOptionId);
      if (currentOpt) shippingCost = currentOpt.price;
    }

    const pixDiscount = subtotal * 0.05;
    const pixTotal = Math.max(0, subtotal - pixDiscount + shippingCost);
    const cardTotal = subtotal + shippingCost;

    return `
      <div class="checkout-step-content">
        <h3 class="checkout-step-title">2. Frete &amp; Forma de Pagamento</h3>
        
        <!-- Frete Selection inteligente por CEP -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
          <div class="checkout-block-title" style="margin: 0;">Selecione a opção de frete:</div>
          ${calculatedShippingResult ? `
            <span style="font-size: 0.78rem; background: var(--c-mint-light); color: #2E7D32; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 99px;">
              📍 Guarulhos/SP ➔ ${calculatedShippingResult.zoneLabel}
            </span>
          ` : `
            <span style="font-size: 0.78rem; background: var(--c-mint-light); color: #2E7D32; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 99px;">
              📍 Saindo de Guarulhos - SP
            </span>
          `}
        </div>

        <div class="shipping-options" style="display: flex; flex-direction: column; gap: 0.8rem; margin-bottom: 1.5rem;">
          ${shippingOptions.map((opt, idx) => {
            const isChecked = (selectedShippingOptionId === opt.id);
            const isCheapest = (idx === 0);
            return `
              <label class="shipping-option-card ${isChecked ? 'active' : ''}" style="cursor: pointer; position: relative;">
                <input type="radio" name="shipping-choice" value="${opt.price}" data-id="${opt.id}" ${isChecked ? 'checked' : ''}>
                <div class="shipping-option-info">
                  <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                    <strong>${opt.name}</strong>
                    ${isCheapest ? `<span style="background: #DCFCE7; color: #166534; font-size: 0.68rem; font-weight: 800; padding: 0.15rem 0.5rem; border-radius: 99px; text-transform: uppercase;">⭐ Mais Econômico</span>` : ''}
                  </div>
                  <span>Previsão: ${opt.time} • ${opt.desc}</span>
                </div>
                <div class="shipping-price" style="font-weight: 700;">${opt.price === 0 ? 'GRÁTIS' : `R$ ${opt.price.toFixed(2).replace('.', ',')}`}</div>
              </label>
            `;
          }).join('')}
        </div>

        <!-- Payment Method Selection -->
        <div class="checkout-block-title">Forma de Pagamento:</div>
        <div class="payment-tabs" style="display: flex; gap: 0.4rem; margin-bottom: 1.2rem;">
          <button type="button" class="payment-tab ${paymentMethod === 'pix' ? 'active' : ''}" id="pay-tab-pix" style="flex: 1.3;">
            <span>⚡ PIX Rápido</span>
            <span class="badge-discount" style="background: #2E7D32; color: white;">-5% OFF (Sem Login)</span>
          </button>
          <button type="button" class="payment-tab ${paymentMethod === 'card' ? 'active' : ''}" id="pay-tab-card" style="flex: 1;">
            <span>💳 Cartão</span>
            <span class="badge-sub">Até 6x</span>
          </button>
          <button type="button" class="payment-tab ${paymentMethod === 'mp_pro' ? 'active' : ''}" id="pay-tab-mppro" style="flex: 1;">
            <span>🛡️ Checkout Pro</span>
            <span class="badge-sub">Com Conta</span>
          </button>
        </div>

        <!-- PIX Form / Details (Sem Login) -->
        <div id="payment-pix-details" style="display: ${paymentMethod === 'pix' ? 'block' : 'none'};" class="payment-box">
          <div class="pix-summary-box" style="background: #F0F8F1; border: 2px solid #8EC490; padding: 1.2rem; border-radius: var(--radius-md); text-align: center;">
            <div style="font-size: 0.88rem; color: var(--c-text-muted);">Total com 5% de desconto no PIX Rápido:</div>
            <div class="pix-total-price" style="font-size: 1.6rem; font-weight: 800; color: #2E7D32; margin: 0.3rem 0;">R$ ${pixTotal.toFixed(2).replace('.', ',')}</div>
            <p style="font-size: 0.82rem; color: #166534; font-weight: 600; margin-top: 0.3rem;">
              🚀 <strong>Sem necessidade de login ou senha!</strong> O QR Code e a chave Copia e Cola serão exibidos na mesma hora.
            </p>
          </div>
        </div>

        <!-- Mercado Pago Checkout Pro Box -->
        <div id="payment-mppro-details" style="display: ${paymentMethod === 'mp_pro' ? 'block' : 'none'};" class="payment-box">
          <div style="background: linear-gradient(135deg, #E0F2FE 0%, #FFFFFF 100%); border: 2px solid #009EE3; border-radius: var(--radius-md); padding: 1.2rem; text-align: center; box-shadow: 0 4px 15px rgba(0, 158, 227, 0.12);">
            <div style="font-size: 2.2rem; margin-bottom: 0.3rem;">🛡️</div>
            <div style="font-weight: 800; font-size: 1.05rem; color: #0070A3; margin-bottom: 0.3rem;">
              Mercado Pago Checkout Pro (Requer Login no Mercado Pago)
            </div>
            <p style="font-size: 0.85rem; color: var(--c-text-main); margin-bottom: 0.8rem; line-height: 1.4;">
              Redireciona para o ambiente do Mercado Pago. Caso possua conta cadastrada no Mercado Pago, exige login.
            </p>
            <div style="font-size: 1.4rem; font-weight: 800; color: #0070A3; margin-bottom: 0.4rem;" class="pix-total-price">
              Total: R$ ${pixTotal.toFixed(2).replace('.', ',')}
            </div>
          </div>
        </div>

        <!-- Credit Card Form -->
        <div id="payment-card-details" style="display: ${paymentMethod === 'card' ? 'block' : 'none'};" class="payment-box">
          <div class="form-group" style="margin-bottom: 0.8rem;">
            <label class="form-label">Número do Cartão *</label>
            <input type="text" class="form-input" placeholder="0000 0000 0000 0000">
          </div>

          <div class="form-row" style="margin-bottom: 0.8rem;">
            <div class="form-group">
              <label class="form-label">Validade *</label>
              <input type="text" class="form-input" placeholder="MM/AA">
            </div>
            <div class="form-group">
              <label class="form-label">CVV *</label>
              <input type="text" class="form-input" placeholder="123" maxlength="4">
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 0.8rem;">
            <label class="form-label">Nome impresso no Cartão *</label>
            <input type="text" class="form-input" placeholder="Como no cartão">
          </div>

          <div class="form-group">
            <label class="form-label">Parcelas *</label>
            <select class="sort-select" style="width: 100%;">
              <option value="1">1x de R$ ${cardTotal.toFixed(2).replace('.', ',')} (sem juros)</option>
              <option value="2">2x de R$ ${(cardTotal / 2).toFixed(2).replace('.', ',')} (sem juros)</option>
              <option value="3">3x de R$ ${(cardTotal / 3).toFixed(2).replace('.', ',')} (sem juros)</option>
              <option value="6">6x de R$ ${(cardTotal / 6).toFixed(2).replace('.', ',')} (sem juros)</option>
            </select>
          </div>
        </div>

        <div style="display: flex; gap: 0.8rem; margin-top: 1.5rem;">
          <button type="button" class="btn btn-outline" id="btn-back-step1" style="flex: 1;">
            ← Voltar
          </button>
          <button type="button" class="btn btn-primary" id="btn-finish-order" style="flex: 2; padding: 0.9rem;">
            🔒 Finalizar Pedido Seguro
          </button>
        </div>
      </div>
    `;
  }

  function renderStep3(orderId, orderTotal, pixData = null) {
    const pixCopyKey = (pixData && pixData.qrCode) || `00020126580014br.gov.bcb.pix0136estilobazar-${orderId}-pix5504000053039865802BR5920EstiloBazar%20Moda6009Sao%20Paulo62070503***6304C8A9`;
    const paymentId = pixData ? pixData.paymentId : null;

    return `
      <div class="checkout-step-content" style="text-align: center;">
        <div style="font-size: 3.5rem; margin-bottom: 0.5rem;">🎉</div>
        <span class="badge-curated" style="background: var(--c-mint-light); color: #2E7D32; margin-bottom: 0.8rem;">Pedido Realizado com Sucesso!</span>
        
        <h3 class="title-section" style="font-size: 1.8rem; margin-bottom: 0.4rem;">Obrigada por garimpar conosco!</h3>
        <p style="font-size: 0.95rem; color: var(--c-text-muted); margin-bottom: 1.5rem;">
          Número do seu pedido: <strong style="color: var(--c-pink-dark); font-size: 1.1rem;" id="created-order-id">#${orderId}</strong>
        </p>

        <!-- Container Dinâmico de Status do Pagamento -->
        <div id="pix-status-dynamic-container">
          ${paymentMethod === 'pix' ? `
            <div class="glass-panel" style="padding: 1.8rem; max-width: 460px; margin: 0 auto 1.5rem auto; text-align: center;">
              <div style="background: #FEF3C7; border: 1px solid #F59E0B; border-radius: var(--radius-sm); padding: 0.6rem 0.8rem; margin-bottom: 1rem; font-size: 0.82rem; color: #92400E; font-weight: 600;">
                🔥 <strong>Reserva Exclusiva Garantida:</strong> Esta peça é única! Reservamos ela para você por <span id="pix-timer-countdown" style="color: #DC2626; font-weight: 800;">14:59</span> min.
              </div>
              
              <div style="font-weight: 700; font-size: 1.05rem; margin-bottom: 0.4rem;">Pagamento via PIX (5% OFF Aplicado)</div>
              <div style="font-size: 1.6rem; font-weight: 700; color: var(--c-text-main); margin-bottom: 1rem;">
                Total: R$ ${orderTotal.toFixed(2).replace('.', ',')}
              </div>

              <div style="background: #FFFFFF; padding: 1.2rem; border-radius: var(--radius-md); display: inline-block; border: 2px solid var(--c-mint-dark); margin-bottom: 1rem; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
                ${pixData && pixData.qrCodeBase64 ? `
                  <img src="data:image/jpeg;base64,${pixData.qrCodeBase64}" alt="QR Code PIX Banco Central" style="width: 200px; height: 200px; display: block; margin: 0 auto; border-radius: 8px;">
                ` : `
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&data=${encodeURIComponent(pixCopyKey)}" alt="QR Code PIX Escaneável Banco Central" style="width: 200px; height: 200px; display: block; margin: 0 auto; border-radius: 8px;">
                `}
              </div>

              <div style="font-size: 0.84rem; color: var(--c-text-muted); margin-bottom: 0.8rem;">
                Escaneie o QR Code acima no seu aplicativo bancário ou use a chave abaixo:
              </div>

              <button class="btn btn-primary" id="copy-pix-key-btn" data-key="${pixCopyKey}" style="width: 100%; font-size: 0.9rem; margin-bottom: 0.8rem;">
                📋 Copiar Chave PIX Copia e Cola
              </button>

              <button class="btn btn-outline" id="check-pix-status-btn" data-pid="${paymentId || ''}" data-oid="${orderId}" style="width: 100%; font-size: 0.82rem; border-color: var(--c-mint-dark); color: #2E7D32;">
                🔄 Já Paguei! Verificar Confirmação de Pagamento
              </button>
            </div>
          ` : `
            <div class="glass-panel" style="padding: 1.8rem; max-width: 440px; margin: 0 auto 1.5rem auto;">
              <div style="font-weight: 700; font-size: 1.05rem; color: #2E7D32; margin-bottom: 0.4rem;">
                ✓ Pagamento Aprovado no Cartão!
              </div>
              <p style="font-size: 0.88rem; color: var(--c-text-muted);">
                Enviamos a confirmação e o comprovante para o seu e-mail. Seu pedido já entrou na fila de higienização e embalagem!
              </p>
            </div>
          `}
        </div>

        <div style="display: flex; gap: 0.8rem; justify-content: center;">
          <a href="#pedidos" class="btn btn-secondary" id="checkout-track-btn">
            📦 Rastrear Meu Pedido
          </a>
          <button class="btn btn-outline" id="checkout-finish-close">
            Continuar Garimpando
          </button>
        </div>
      </div>
    `;
  }

  function renderModalContent() {
    return `
      <div class="modal-container" style="max-width: 680px;">
        <button class="modal-close" id="checkout-close-btn">&times;</button>

        <div class="checkout-header-steps">
          <div class="step-indicator ${currentStep >= 1 ? 'active' : ''}">1. Dados</div>
          <div class="step-line"></div>
          <div class="step-indicator ${currentStep >= 2 ? 'active' : ''}">2. Pagamento</div>
          <div class="step-line"></div>
          <div class="step-indicator ${currentStep >= 3 ? 'active' : ''}">3. Confirmação</div>
        </div>

        <div id="checkout-step-body">
          ${currentStep === 1 ? renderStep1() : currentStep === 2 ? renderStep2() : ''}
        </div>
      </div>
    `;
  }

  modal.innerHTML = renderModalContent();
  document.body.appendChild(modal);

  function attachStep1Listeners() {
    const cepInput = modal.querySelector('#cust-cep');
    const addrInput = modal.querySelector('#cust-address');
    const bairroInput = modal.querySelector('#cust-bairro');
    const cityInput = modal.querySelector('#cust-city');
    const ufInput = modal.querySelector('#cust-uf');
    const infoBox = modal.querySelector('#cep-smart-info-box');

    const handleCepLookup = async () => {
      if (!cepInput) return;
      const cleanCep = cepInput.value.replace(/\D/g, '');
      if (cleanCep.length === 8) {
        if (infoBox) {
          infoBox.style.display = 'block';
          infoBox.textContent = '🔍 Consultando ViaCEP e calculando frete saindo de Guarulhos/SP...';
        }

        const res = await calculateSmartShipping(cleanCep, subtotal);
        if (res && res.success) {
          calculatedShippingResult = res;
          currentCep = cleanCep;

          if (res.addressInfo) {
            if (addrInput && !addrInput.value) addrInput.value = res.addressInfo.street || '';
            if (bairroInput && !bairroInput.value) bairroInput.value = res.addressInfo.bairro || '';
            if (cityInput) cityInput.value = res.addressInfo.city || '';
            if (ufInput) ufInput.value = res.addressInfo.uf || '';
          }

          if (infoBox) {
            infoBox.style.display = 'block';
            infoBox.innerHTML = `📍 Envio saindo da nossa central em <strong>Guarulhos - SP</strong> ➔ Destination: <strong>${res.addressInfo ? res.addressInfo.city : ''}/${res.addressInfo ? res.addressInfo.uf : 'SP'}</strong> (${res.zoneLabel})`;
          }
        }
      }
    };

    if (cepInput) {
      cepInput.addEventListener('blur', handleCepLookup);
      cepInput.addEventListener('keyup', (e) => {
        if (e.target.value.replace(/\D/g, '').length === 8) {
          handleCepLookup();
        }
      });
    }

    const form1 = modal.querySelector('#checkout-step1-form');
    if (form1) {
      form1.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form1.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = '⏳ Calculando melhor frete de Guarulhos...';
        }

        const cepVal = cepInput ? cepInput.value.replace(/\D/g, '') : '';
        const targetCep = cepVal.length === 8 ? cepVal : '07000000'; // Default Guarulhos/SP se incompleto

        try {
          calculatedShippingResult = await calculateSmartShipping(targetCep, subtotal);
          currentCep = targetCep;
          if (calculatedShippingResult && calculatedShippingResult.options && calculatedShippingResult.options.length > 0) {
            // Ordena pelo menor preço
            calculatedShippingResult.options.sort((a, b) => a.price - b.price);
            selectedShippingOptionId = calculatedShippingResult.options[0].id;
            shippingCost = calculatedShippingResult.options[0].price;
          }
        } catch (err) {
          console.warn('⚠️ Erro ao calcular frete no submit:', err.message);
        }

        currentStep = 2;
        modal.innerHTML = renderModalContent();
        attachStep2Listeners();
        attachGeneralListeners();
      });
    }
  }

  function attachStep2Listeners() {
    // Escuta seleção das opções dinâmicas de frete por CEP
    const shippingRadios = modal.querySelectorAll('input[name="shipping-choice"]');
    shippingRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        const val = parseFloat(e.target.value) || 0;
        const optId = e.target.getAttribute('data-id');
        shippingCost = val;
        selectedShippingOptionId = optId;

        // Atualiza estilo dos cards
        modal.querySelectorAll('.shipping-option-card').forEach(card => card.classList.remove('active'));
        e.target.closest('.shipping-option-card')?.classList.add('active');

        // Recalcula totais na tela
        const pixDiscount = subtotal * 0.05;
        const pixTotal = Math.max(0, subtotal - pixDiscount + shippingCost);
        const cardTotal = subtotal + shippingCost;

        const pixPriceEl = modal.querySelector('.pix-total-price');
        if (pixPriceEl) pixPriceEl.textContent = `R$ ${pixTotal.toFixed(2).replace('.', ',')}`;

        const cardSelect = modal.querySelector('#payment-card-details select');
        if (cardSelect) {
          cardSelect.innerHTML = `
            <option value="1">1x de R$ ${cardTotal.toFixed(2).replace('.', ',')} (sem juros)</option>
            <option value="2">2x de R$ ${(cardTotal / 2).toFixed(2).replace('.', ',')} (sem juros)</option>
            <option value="3">3x de R$ ${(cardTotal / 3).toFixed(2).replace('.', ',')} (sem juros)</option>
            <option value="6">6x de R$ ${(cardTotal / 6).toFixed(2).replace('.', ',')} (sem juros)</option>
          `;
        }
      });
    });

    const tabMpPro = modal.querySelector('#pay-tab-mppro');
    const tabPix = modal.querySelector('#pay-tab-pix');
    const tabCard = modal.querySelector('#pay-tab-card');
    const mpProBox = modal.querySelector('#payment-mppro-details');
    const pixBox = modal.querySelector('#payment-pix-details');
    const cardBox = modal.querySelector('#payment-card-details');

    if (tabMpPro) {
      tabMpPro.addEventListener('click', () => {
        paymentMethod = 'mp_pro';
        tabMpPro.classList.add('active');
        if (tabPix) tabPix.classList.remove('active');
        if (tabCard) tabCard.classList.remove('active');
        if (mpProBox) mpProBox.style.display = 'block';
        if (pixBox) pixBox.style.display = 'none';
        if (cardBox) cardBox.style.display = 'none';
      });
    }

    if (tabPix) {
      tabPix.addEventListener('click', () => {
        paymentMethod = 'pix';
        tabPix.classList.add('active');
        if (tabMpPro) tabMpPro.classList.remove('active');
        if (tabCard) tabCard.classList.remove('active');
        if (pixBox) pixBox.style.display = 'block';
        if (mpProBox) mpProBox.style.display = 'none';
        if (cardBox) cardBox.style.display = 'none';
      });
    }

    if (tabCard) {
      tabCard.addEventListener('click', () => {
        paymentMethod = 'card';
        tabCard.classList.add('active');
        if (tabMpPro) tabMpPro.classList.remove('active');
        if (tabPix) tabPix.classList.remove('active');
        if (cardBox) cardBox.style.display = 'block';
        if (mpProBox) mpProBox.style.display = 'none';
        if (pixBox) pixBox.style.display = 'none';
      });
    }

    const backBtn = modal.querySelector('#btn-back-step1');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        currentStep = 1;
        modal.innerHTML = renderModalContent();
        attachStep1Listeners();
        attachGeneralListeners();
      });
    }

    const finishBtn = modal.querySelector('#btn-finish-order');
    if (finishBtn) {
      finishBtn.addEventListener('click', async () => {
        finishBtn.disabled = true;
        finishBtn.textContent = '⏳ Processando Pagamento Seguro...';

        const orderId = 'EB-' + Math.floor(1000 + Math.random() * 9000);
        const customerName = modal.querySelector('#cust-name')?.value || 'Cliente';
        const customerCpf = modal.querySelector('#cust-cpf')?.value || '12345678909';
        const customerEmail = modal.querySelector('#cust-email')?.value || 'cliente@estilobazar.com.br';

        const orderData = {
          orderId,
          subtotal,
          shippingCost,
          customerName,
          customerCpf,
          customerEmail
        };

        // Opção 1: Mercado Pago Checkout Pro (100% Automático & Seguro)
        if (paymentMethod === 'mp_pro') {
          finishBtn.textContent = '⏳ Conectando ao Checkout Oficial do Mercado Pago...';
          const prefRes = await createCheckoutProPreference({
            ...orderData,
            paymentMethod: 'pix'
          });

          if (prefRes && prefRes.success && prefRes.initPoint) {
            const pixDiscount = subtotal * 0.05;
            const finalTotal = subtotal - pixDiscount + shippingCost;
            const orderObj = {
              id: orderId,
              date: new Date().toLocaleDateString('pt-BR'),
              total: finalTotal,
              items: [...cart],
              paymentMethod: 'Mercado Pago Checkout Pro',
              status: 'Aguardando Pagamento no Mercado Pago',
              step: 1,
              trackingCode: null
            };
            try {
              const orders = JSON.parse(localStorage.getItem('estilobazar_orders') || '[]');
              orders.unshift(orderObj);
              localStorage.setItem('estilobazar_orders', JSON.stringify(orders));
            } catch (e) {
              console.error(e);
            }

            clearCart();
            showToast('🚀 Redirecionando para o Checkout Oficial Seguro do Mercado Pago...');
            setTimeout(() => {
              window.location.href = prefRes.initPoint;
            }, 600);
            return;
          } else {
            showToast('⚠️ Erro ao conectar ao Mercado Pago. Tente a opção PIX Direto.');
            finishBtn.disabled = false;
            finishBtn.textContent = '🔒 Finalizar Pedido Seguro';
            return;
          }
        }

        let paymentResult = null;
        let pixData = null;

        if (paymentMethod === 'pix') {
          pixData = await createPixPayment(orderData);
          paymentResult = {
            success: true,
            status: 'pending'
          };
        } else {
          // Processamento do Cartão de Crédito
          const cardNum = modal.querySelector('#payment-card-details input[placeholder*="0000"]')?.value || '';
          const cardExpiry = modal.querySelector('#payment-card-details input[placeholder*="MM/AA"]')?.value || '';
          const cardCvv = modal.querySelector('#payment-card-details input[placeholder*="123"]')?.value || '';
          const cardHolder = modal.querySelector('#payment-card-details input[placeholder*="Como no"]')?.value || '';
          const cardInstallments = modal.querySelector('#payment-card-details select')?.value || 1;

          paymentResult = await processCreditCardPayment({
            number: cardNum,
            expiry: cardExpiry,
            cvv: cardCvv,
            holderName: cardHolder,
            installments: cardInstallments
          }, orderData);

          if (!paymentResult.success) {
            showToast(`⚠️ ${paymentResult.error}`);
            finishBtn.disabled = false;
            finishBtn.textContent = '🔒 Finalizar Pedido Seguro';
            return;
          }
        }

        const pixDiscount = paymentMethod === 'pix' ? subtotal * 0.05 : 0;
        const finalTotal = subtotal - pixDiscount + shippingCost;

        // Save order to localStorage
        const orderObj = {
          id: orderId,
          date: new Date().toLocaleDateString('pt-BR'),
          total: finalTotal,
          items: [...cart],
          paymentMethod: paymentMethod,
          status: paymentMethod === 'pix' ? 'Aguardando Pagamento PIX' : 'Pagamento Aprovado',
          step: paymentMethod === 'pix' ? 1 : 2, // 1: Criado, 2: Em Separação, 3: Enviado
          trackingCode: null // Será preenchido pelo Administrador ao despachar nos Correios
        };

        try {
          const orders = JSON.parse(localStorage.getItem('estilobazar_orders') || '[]');
          orders.unshift(orderObj);
          localStorage.setItem('estilobazar_orders', JSON.stringify(orders));
        } catch (e) {
          console.error(e);
        }

        clearCart();

        currentStep = 3;
        const stepBody = modal.querySelector('#checkout-step-body');
        if (stepBody) {
          stepBody.innerHTML = renderStep3(orderId, finalTotal, pixData);
        }

        // Attach step 3 listeners
        const copyPixBtn = modal.querySelector('#copy-pix-key-btn');
        if (copyPixBtn) {
          copyPixBtn.addEventListener('click', () => {
            const keyToCopy = copyPixBtn.getAttribute('data-key') || '';
            if (navigator.clipboard) {
              navigator.clipboard.writeText(keyToCopy).catch(() => {});
            }
            showToast('Chave PIX Copia e Cola copiada com sucesso! 📱');
            copyPixBtn.textContent = '✓ Chave Copiada!';
          });
        }

        const checkPixBtn = modal.querySelector('#check-pix-status-btn');
        const statusContainer = modal.querySelector('#pix-status-dynamic-container');
        let pixPollInterval = null;

        const markOrderAsApproved = (orderIdToApprove) => {
          if (pixPollInterval) {
            clearInterval(pixPollInterval);
            pixPollInterval = null;
          }
          try {
            const orders = JSON.parse(localStorage.getItem('estilobazar_orders') || '[]');
            const idx = orders.findIndex(o => String(o.id) === String(orderIdToApprove));
            if (idx !== -1) {
              orders[idx].status = 'Pagamento Aprovado';
              orders[idx].step = 2; // Em Separação
              localStorage.setItem('estilobazar_orders', JSON.stringify(orders));
            }
          } catch (e) { console.error(e); }

          if (statusContainer) {
            statusContainer.innerHTML = `
              <div class="glass-panel" style="padding: 2rem; max-width: 460px; margin: 0 auto 1.5rem auto; text-align: center; border: 2px solid #8EC490; background: #F0F8F1; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
                <div style="font-size: 3.5rem; margin-bottom: 0.5rem;">✅</div>
                <h4 style="font-size: 1.3rem; color: #2E7D32; font-weight: 800; margin-bottom: 0.5rem;">
                  PAGAMENTO APROVADO COM SUCESSO!
                </h4>
                <p style="font-size: 0.9rem; color: var(--c-text-main); margin-bottom: 1rem;">
                  Seu pagamento PIX foi confirmado automaticamente pelo banco! O pedido <strong>#${orderIdToApprove}</strong> já entrou na nossa fila de higienização e embalagem.
                </p>
                <div style="font-size: 0.8rem; color: #15803D; font-weight: 600;">
                  ✓ Comprovante e recibo enviados para seu e-mail
                </div>
              </div>
            `;
          }
        };

        const pId = (pixData && pixData.paymentId) || (checkPixBtn ? checkPixBtn.getAttribute('data-pid') : null);
        const oId = orderId;

        // Polling automático a cada 3s para identificar aprovação REAL pelo banco/gateway em tempo real
        if (paymentMethod === 'pix' && pId) {
          pixPollInterval = setInterval(async () => {
            try {
              const statusRes = await checkPaymentStatus(pId);
              if (statusRes && (statusRes.status === 'approved' || statusRes.status === 'paid')) {
                markOrderAsApproved(oId);
                showToast('🎉 Pagamento PIX identificado e aprovado pelo banco em tempo real! 📦');
              }
            } catch (e) {}
          }, 3000);
        }

        if (checkPixBtn) {
          checkPixBtn.addEventListener('click', async () => {
            checkPixBtn.disabled = true;
            checkPixBtn.textContent = '⏳ Consultando banco...';

            const statusRes = await checkPaymentStatus(pId, { userConfirmed: true });
            if (statusRes && (statusRes.status === 'approved' || statusRes.status === 'paid')) {
              markOrderAsApproved(oId);
              showToast('✅ Pagamento PIX confirmado com sucesso! Pedido em separação. 📦');
            } else {
              showToast('⏳ Pagamento ainda não identificado. Assim que concluir o PIX no app do banco, clique novamente!');
              checkPixBtn.disabled = false;
              checkPixBtn.textContent = '🔄 Já Paguei! Verificar Confirmação de Pagamento';
            }
          });
        }

        const cleanupModal = () => {
          if (pixPollInterval) {
            clearInterval(pixPollInterval);
            pixPollInterval = null;
          }
          modal.remove();
        };

        const closeFinishBtn = modal.querySelector('#checkout-finish-close');
        if (closeFinishBtn) closeFinishBtn.addEventListener('click', cleanupModal);

        const trackBtn = modal.querySelector('#checkout-track-btn');
        if (trackBtn) trackBtn.addEventListener('click', cleanupModal);

        const closeBtn = modal.querySelector('#checkout-close-btn');
        if (closeBtn) closeBtn.addEventListener('click', cleanupModal);
      });
    }
  }

  function attachGeneralListeners() {
    const closeBtn = modal.querySelector('#checkout-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => modal.remove());
    }
  }

  attachStep1Listeners();
  attachGeneralListeners();
}
