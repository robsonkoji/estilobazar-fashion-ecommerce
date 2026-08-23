import { getCart, clearCart, showToast } from '../utils/storage.js';

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
  let shippingCost = isFreeShipping ? 0 : 18.90;

  const modal = document.createElement('div');
  modal.className = 'modal-overlay active';
  modal.id = 'checkout-modal';

  let currentStep = 1;
  let paymentMethod = 'pix'; // 'pix' | 'card'

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
            <div class="form-group" style="flex: 0 0 140px;">
              <label class="form-label">CEP *</label>
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
    const pixDiscount = subtotal * 0.05;
    const pixTotal = subtotal - pixDiscount + shippingCost;
    const cardTotal = subtotal + shippingCost;

    return `
      <div class="checkout-step-content">
        <h3 class="checkout-step-title">2. Frete &amp; Forma de Pagamento</h3>
        
        <!-- Frete Selection -->
        <div class="checkout-block-title">Selecione a opção de frete:</div>
        <div class="shipping-options" style="display: flex; flex-direction: column; gap: 0.8rem; margin-bottom: 1.5rem;">
          <label class="shipping-option-card ${isFreeShipping ? 'active' : ''}">
            <input type="radio" name="shipping-choice" value="0" ${isFreeShipping ? 'checked' : ''}>
            <div class="shipping-option-info">
              <strong>${isFreeShipping ? '🚚 Frete Grátis Correios PAC' : '📦 Correios PAC Nacional'}</strong>
              <span>Previsão: 3 a 6 dias úteis</span>
            </div>
            <div class="shipping-price">${isFreeShipping ? 'GRÁTIS' : 'R$ 18,90'}</div>
          </label>

          <label class="shipping-option-card">
            <input type="radio" name="shipping-choice" value="28.90">
            <div class="shipping-option-info">
              <strong>⚡ Correios SEDEX Expresso</strong>
              <span>Previsão: 1 a 2 dias úteis</span>
            </div>
            <div class="shipping-price">R$ 28,90</div>
          </label>
        </div>

        <!-- Payment Method Selection -->
        <div class="checkout-block-title">Forma de Pagamento:</div>
        <div class="payment-tabs">
          <button type="button" class="payment-tab ${paymentMethod === 'pix' ? 'active' : ''}" id="pay-tab-pix">
            <span>✨ PIX</span>
            <span class="badge-discount">-5% OFF</span>
          </button>
          <button type="button" class="payment-tab ${paymentMethod === 'card' ? 'active' : ''}" id="pay-tab-card">
            <span>💳 Cartão de Crédito</span>
            <span class="badge-sub">Até 6x</span>
          </button>
        </div>

        <!-- PIX Form / Details -->
        <div id="payment-pix-details" style="display: ${paymentMethod === 'pix' ? 'block' : 'none'};" class="payment-box">
          <div class="pix-summary-box">
            <div style="font-size: 0.9rem; color: var(--c-text-muted);">Total com 5% de desconto no PIX:</div>
            <div class="pix-total-price">R$ ${pixTotal.toFixed(2).replace('.', ',')}</div>
            <p style="font-size: 0.82rem; color: var(--c-mint-dark); font-weight: 600; margin-top: 0.3rem;">
              ✓ O QR Code e a chave Copia e Cola serão gerados ao clicar em Finalizar Pedido.
            </p>
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

  function renderStep3(orderId, orderTotal) {
    const pixCopyKey = `00020126580014br.gov.bcb.pix0136estilobazar-${orderId}-pix5504000053039865802BR5920EstiloBazar%20Moda6009Sao%20Paulo62070503***6304C8A9`;

    return `
      <div class="checkout-step-content" style="text-align: center;">
        <div style="font-size: 3.5rem; margin-bottom: 0.5rem;">🎉</div>
        <span class="badge-curated" style="background: var(--c-mint-light); color: #2E7D32; margin-bottom: 0.8rem;">Pedido Realizado com Sucesso!</span>
        
        <h3 class="title-section" style="font-size: 1.8rem; margin-bottom: 0.4rem;">Obrigada por garimpar conosco!</h3>
        <p style="font-size: 0.95rem; color: var(--c-text-muted); margin-bottom: 1.5rem;">
          Número do seu pedido: <strong style="color: var(--c-pink-dark); font-size: 1.1rem;" id="created-order-id">#${orderId}</strong>
        </p>

        ${paymentMethod === 'pix' ? `
          <div class="glass-panel" style="padding: 1.8rem; max-width: 440px; margin: 0 auto 1.5rem auto; text-align: center;">
            <div style="font-weight: 700; font-size: 1.05rem; margin-bottom: 0.6rem;">Pagamento via PIX (5% OFF Aplicado)</div>
            <div style="font-size: 1.6rem; font-weight: 700; color: var(--c-text-main); margin-bottom: 1rem;">
              Total: R$ ${orderTotal.toFixed(2).replace('.', ',')}
            </div>

            <div style="background: white; padding: 1rem; border-radius: var(--radius-md); display: inline-block; border: 1px solid var(--c-mint); margin-bottom: 1rem;">
              <!-- Simulated QR Code SVG -->
              <svg width="150" height="150" viewBox="0 0 100 100" fill="none">
                <rect width="100" height="100" fill="#FFFFFF"/>
                <rect x="10" y="10" width="30" height="30" fill="#2C302E"/>
                <rect x="15" y="15" width="20" height="20" fill="#FFFFFF"/>
                <rect x="20" y="20" width="10" height="10" fill="#2C302E"/>
                <rect x="60" y="10" width="30" height="30" fill="#2C302E"/>
                <rect x="65" y="15" width="20" height="20" fill="#FFFFFF"/>
                <rect x="70" y="20" width="10" height="10" fill="#2C302E"/>
                <rect x="10" y="60" width="30" height="30" fill="#2C302E"/>
                <rect x="15" y="65" width="20" height="20" fill="#FFFFFF"/>
                <rect x="20" y="70" width="10" height="10" fill="#2C302E"/>
                <rect x="50" y="50" width="15" height="15" fill="#2C302E"/>
                <rect x="70" y="50" width="20" height="10" fill="#2C302E"/>
                <rect x="50" y="75" width="25" height="15" fill="#2C302E"/>
                <rect x="80" y="70" width="10" height="20" fill="#2C302E"/>
              </svg>
            </div>

            <div style="font-size: 0.84rem; color: var(--c-text-muted); margin-bottom: 0.8rem;">
              Escaneie o QR Code acima no seu aplicativo bancário ou use a chave abaixo:
            </div>

            <button class="btn btn-primary" id="copy-pix-key-btn" style="width: 100%; font-size: 0.9rem;">
              📋 Copiar Chave PIX Copia e Cola
            </button>
          </div>
        ` : `
          <div class="glass-panel" style="padding: 1.8rem; max-width: 440px; margin: 0 auto 1.5rem auto;">
            <div style="font-weight: 700; font-size: 1.05rem; color: #2E7D32; margin-bottom: 0.4rem;">
              ✓ Pagamento Aprovado no Cartão!
            </div>
            <p style="font-size: 0.88rem; color: var(--c-text-muted);">
              Enviamos a confirmação e a nota fiscal para o seu e-mail. Seu pedido já entrou na fila de higienização e embalagem!
            </p>
          </div>
        `}

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
    const form1 = modal.querySelector('#checkout-step1-form');
    if (form1) {
      form1.addEventListener('submit', (e) => {
        e.preventDefault();
        currentStep = 2;
        modal.innerHTML = renderModalContent();
        attachStep2Listeners();
        attachGeneralListeners();
      });
    }
  }

  function attachStep2Listeners() {
    const tabPix = modal.querySelector('#pay-tab-pix');
    const tabCard = modal.querySelector('#pay-tab-card');
    const pixBox = modal.querySelector('#payment-pix-details');
    const cardBox = modal.querySelector('#payment-card-details');

    if (tabPix && tabCard) {
      tabPix.addEventListener('click', () => {
        paymentMethod = 'pix';
        tabPix.classList.add('active');
        tabCard.classList.remove('active');
        if (pixBox) pixBox.style.display = 'block';
        if (cardBox) cardBox.style.display = 'none';
      });

      tabCard.addEventListener('click', () => {
        paymentMethod = 'card';
        tabCard.classList.add('active');
        tabPix.classList.remove('active');
        if (cardBox) cardBox.style.display = 'block';
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
      finishBtn.addEventListener('click', () => {
        const orderId = 'EB-' + Math.floor(1000 + Math.random() * 9000);
        const pixDiscount = paymentMethod === 'pix' ? subtotal * 0.05 : 0;
        const finalTotal = subtotal - pixDiscount + shippingCost;

        // Save order to localStorage
        const orderObj = {
          id: orderId,
          date: new Date().toLocaleDateString('pt-BR'),
          total: finalTotal,
          items: [...cart],
          status: 'Pagamento Pendente / Aprovado',
          step: 2, // 1: Criado, 2: Em Separação, 3: Enviado
          trackingCode: 'BR' + Math.floor(100000000 + Math.random() * 900000000) + 'SP'
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
          stepBody.innerHTML = renderStep3(orderId, finalTotal);
        }

        // Attach step 3 listeners
        const copyPixBtn = modal.querySelector('#copy-pix-key-btn');
        if (copyPixBtn) {
          copyPixBtn.addEventListener('click', () => {
            showToast('Chave PIX Copia e Cola copiada! Cole no app do seu banco. 📱');
            copyPixBtn.textContent = '✓ Chave Copiada!';
          });
        }

        const closeFinishBtn = modal.querySelector('#checkout-finish-close');
        if (closeFinishBtn) {
          closeFinishBtn.addEventListener('click', () => modal.remove());
        }

        const trackBtn = modal.querySelector('#checkout-track-btn');
        if (trackBtn) {
          trackBtn.addEventListener('click', () => {
            modal.remove();
          });
        }
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
