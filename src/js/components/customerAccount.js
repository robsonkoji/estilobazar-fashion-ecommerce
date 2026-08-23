import { openOrdersModal } from './ordersModal.js';
import { getCart, getFavorites, addToCart } from '../utils/storage.js';

let activeAccountTab = 'pedidos'; // 'pedidos' | 'consignacao' | 'favoritos' | 'dados'
let isAuthModeLogin = true;

// Estado local do usuário cliente
function getCustomerUser() {
  const data = localStorage.getItem('estilobazar_customer_user');
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
}

function setCustomerUser(userObj) {
  if (!userObj) {
    localStorage.removeItem('estilobazar_customer_user');
  } else {
    localStorage.setItem('estilobazar_customer_user', JSON.stringify(userObj));
  }
}

// Dados de simulação inspirados no Portal do Cliente do Brechó Capricho à Toa
const sampleConsignmentItems = [
  { id: 'cs-1', title: 'Casaco Sobretudo Lã Batida', brand: 'Zara', price: 220.00, status: 'Em Exposição na Loja', commission: 'R$ 132,00 (60%)', date: '18/08/2026', image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80' },
  { id: 'cs-2', title: 'Bolsa Couro Legítimo Vintage', brand: 'Arezzo', price: 180.00, status: 'Vendida ✨', commission: 'R$ 108,00 (60%)', date: '10/08/2026', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80' },
  { id: 'cs-3', title: 'Vestido Seda Estampada', brand: 'Farm', price: 195.00, status: 'Em Avaliação Curatorial', commission: 'Aguardando', date: '21/08/2026', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80' }
];

const sampleCustomerOrders = [
  {
    id: 'EB-9842',
    date: '20/08/2026',
    status: 'Em Higienização & Embalagem Sustentável 🌿',
    statusColor: '#D97706',
    total: 199.80,
    paymentMethod: 'PIX (5% OFF Aplicado)',
    trackingCode: 'BR849204918SP',
    items: [
      { title: 'Blusa Cetim Bege', brand: 'Baje', price: 50.00, size: '40', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80' },
      { title: 'Vestido Floral Vintage', brand: 'Eloíse', price: 149.80, size: 'P', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80' }
    ]
  }
];

export function renderCustomerAccount() {
  const customer = getCustomerUser();

  // Se não estiver logado, exibe tela elegante de Acesso do Cliente (Login / Cadastro)
  if (!customer) {
    return renderAuthView();
  }

  // Se estiver logado, exibe a Área do Cliente Completa
  return renderAccountDashboard(customer);
}

function renderAuthView() {
  return `
    <section class="customer-auth-section container" style="padding: 3rem 1.5rem; max-width: 900px; margin: 0 auto;">
      <div class="glass-panel" style="padding: 2.5rem; border-radius: var(--radius-lg); border: var(--glass-border); box-shadow: var(--shadow-lg);">
        
        <div style="text-align: center; margin-bottom: 2rem;">
          <span class="badge-curated" style="margin-bottom: 0.5rem;">Área do Cliente EstiloBazar</span>
          <h2 class="title-section" style="font-size: 2rem;">Acesse Sua Conta & Consignações</h2>
          <p style="font-size: 0.9rem; color: var(--c-text-muted); max-width: 550px; margin: 0.5rem auto 0;">
            Acompanhe seus pedidos, rastreie entregas e gerencie o saldo das suas peças consignadas à venda.
          </p>
        </div>

        <!-- Abas Login / Cadastro -->
        <div style="display: flex; gap: 1rem; border-bottom: 2px solid rgba(196, 230, 197, 0.4); margin-bottom: 2rem;">
          <button id="tab-login-btn" style="flex: 1; padding: 0.8rem; font-weight: 700; font-size: 0.95rem; background: none; border: none; cursor: pointer; border-bottom: 3px solid ${isAuthModeLogin ? 'var(--c-pink-dark)' : 'transparent'}; color: ${isAuthModeLogin ? 'var(--c-text-main)' : 'var(--c-text-muted)'};">
            🔑 Já Tenho Conta (Entrar)
          </button>
          <button id="tab-register-btn" style="flex: 1; padding: 0.8rem; font-weight: 700; font-size: 0.95rem; background: none; border: none; cursor: pointer; border-bottom: 3px solid ${!isAuthModeLogin ? 'var(--c-pink-dark)' : 'transparent'}; color: ${!isAuthModeLogin ? 'var(--c-text-main)' : 'var(--c-text-muted)'};">
            ✨ Criar Minha Conta VIP
          </button>
        </div>

        ${isAuthModeLogin ? `
          <!-- Formulário de Login -->
          <form id="customer-login-form" style="max-width: 480px; margin: 0 auto;">
            <div style="margin-bottom: 1.2rem;">
              <label style="display: block; font-size: 0.82rem; font-weight: 700; margin-bottom: 0.4rem;">E-mail Cadastrado *</label>
              <input type="email" id="c-login-email" class="search-input" style="width: 100%;" required placeholder="seuemail@dominio.com.br" />
            </div>

            <div style="margin-bottom: 1.5rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                <label style="font-size: 0.82rem; font-weight: 700;">Sua Senha *</label>
                <a href="javascript:void(0)" id="forgot-password-link" style="font-size: 0.78rem; color: var(--c-pink-dark); text-decoration: underline;">Esqueceu a senha?</a>
              </div>
              <input type="password" id="c-login-password" class="search-input" style="width: 100%;" required placeholder="••••••••" />
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; padding: 0.85rem; font-size: 1rem;">
              🔑 Entrar na Minha Conta
            </button>
          </form>
        ` : `
          <!-- Formulário de Cadastro -->
          <form id="customer-register-form" style="max-width: 580px; margin: 0 auto;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.2rem;">
              <div style="grid-column: 1 / -1;">
                <label style="display: block; font-size: 0.82rem; font-weight: 700; margin-bottom: 0.4rem;">Nome Completo *</label>
                <input type="text" id="c-reg-name" class="search-input" style="width: 100%;" required placeholder="Maria da Silva" />
              </div>

              <div>
                <label style="display: block; font-size: 0.82rem; font-weight: 700; margin-bottom: 0.4rem;">E-mail *</label>
                <input type="email" id="c-reg-email" class="search-input" style="width: 100%;" required placeholder="seuemail@dominio.com.br" />
              </div>

              <div>
                <label style="display: block; font-size: 0.82rem; font-weight: 700; margin-bottom: 0.4rem;">WhatsApp / Telefone *</label>
                <input type="tel" id="c-reg-phone" class="search-input" style="width: 100%;" required placeholder="(11) 99999-8888" />
              </div>

              <div>
                <label style="display: block; font-size: 0.82rem; font-weight: 700; margin-bottom: 0.4rem;">CPF (para NFe e Saques) *</label>
                <input type="text" id="c-reg-cpf" class="search-input" style="width: 100%;" required placeholder="000.000.000-00" />
              </div>

              <div>
                <label style="display: block; font-size: 0.82rem; font-weight: 700; margin-bottom: 0.4rem;">Senha de Acesso *</label>
                <input type="password" id="c-reg-password" class="search-input" style="width: 100%;" required placeholder="Crie uma senha segura" />
              </div>
            </div>

            <div style="background: var(--c-mint-light); border: 1px solid var(--c-mint-dark); padding: 0.8rem 1rem; border-radius: var(--radius-md); margin-bottom: 1.5rem; font-size: 0.82rem; color: #2C302E;">
              🎉 <strong>Bônus VIP:</strong> Ao criar sua conta você ganha <strong>10% OFF no primeiro garimpo</strong> e acesso ao Portal do Consignador para vender suas peças!
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; padding: 0.85rem; font-size: 1rem;">
              ✨ Criar Minha Conta VIP
            </button>
          </form>
        `}

      </div>
    </section>
  `;
}

function renderAccountDashboard(customer) {
  const favorites = getFavorites();

  return `
    <section class="customer-dashboard-section container" style="padding: 2.5rem 1.5rem;">
      
      <!-- Banner de Boas-Vindas -->
      <div class="glass-panel" style="padding: 1.8rem 2rem; margin-bottom: 2rem; border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1.2rem; background: linear-gradient(135deg, var(--bg-surface) 0%, var(--c-pink-light) 100%);">
        <div style="display: flex; align-items: center; gap: 1.2rem;">
          <div style="width: 60px; height: 60px; border-radius: 50%; background: var(--c-pink-dark); color: #FFF; font-size: 1.5rem; font-weight: 700; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(228, 161, 161, 0.4);">
            ${customer.name ? customer.name.charAt(0).toUpperCase() : 'C'}
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <h2 style="font-size: 1.5rem; font-family: var(--font-heading); margin: 0;">Olá, ${customer.name || 'Cliente'}!</h2>
              <span class="badge-curated" style="font-size: 0.72rem; padding: 0.15rem 0.6rem;">Membro VIP EstiloBazar 🌟</span>
            </div>
            <p style="font-size: 0.85rem; color: var(--c-text-muted); margin-top: 0.2rem;">
              E-mail: <strong>${customer.email}</strong> • WhatsApp: <strong>${customer.phone || 'Cadastrado'}</strong>
            </p>
          </div>
        </div>

        <button id="customer-logout-btn" class="btn btn-outline" style="font-size: 0.82rem; padding: 0.45rem 0.9rem; border-color: #E05252; color: #C62828;">
          🚪 Sair da Conta
        </button>
      </div>

      <!-- Abas de Navegação do Cliente -->
      <div style="display: flex; gap: 0.8rem; overflow-x: auto; padding-bottom: 0.5rem; margin-bottom: 2rem; border-bottom: 2px solid rgba(196, 230, 197, 0.4);">
        <button class="account-nav-tab ${activeAccountTab === 'pedidos' ? 'active' : ''}" data-tab="pedidos" style="padding: 0.75rem 1.4rem; font-weight: 700; font-size: 0.9rem; border: none; background: ${activeAccountTab === 'pedidos' ? 'var(--c-pink-dark)' : 'var(--bg-surface)'}; color: ${activeAccountTab === 'pedidos' ? '#FFF' : 'var(--c-text-main)'}; border-radius: var(--radius-md) var(--radius-md) 0 0; cursor: pointer; transition: all 0.2s;">
          📦 Meus Pedidos (${sampleCustomerOrders.length})
        </button>

        <button class="account-nav-tab ${activeAccountTab === 'consignacao' ? 'active' : ''}" data-tab="consignacao" style="padding: 0.75rem 1.4rem; font-weight: 700; font-size: 0.9rem; border: none; background: ${activeAccountTab === 'consignacao' ? 'var(--c-pink-dark)' : 'var(--bg-surface)'}; color: ${activeAccountTab === 'consignacao' ? '#FFF' : 'var(--c-text-main)'}; border-radius: var(--radius-md) var(--radius-md) 0 0; cursor: pointer; transition: all 0.2s;">
          🏷️ Peças à Venda / Consignação (${sampleConsignmentItems.length})
        </button>

        <button class="account-nav-tab ${activeAccountTab === 'favoritos' ? 'active' : ''}" data-tab="favoritos" style="padding: 0.75rem 1.4rem; font-weight: 700; font-size: 0.9rem; border: none; background: ${activeAccountTab === 'favoritos' ? 'var(--c-pink-dark)' : 'var(--bg-surface)'}; color: ${activeAccountTab === 'favoritos' ? '#FFF' : 'var(--c-text-main)'}; border-radius: var(--radius-md) var(--radius-md) 0 0; cursor: pointer; transition: all 0.2s;">
          ❤️ Favoritos (${favorites.length})
        </button>

        <button class="account-nav-tab ${activeAccountTab === 'dados' ? 'active' : ''}" data-tab="dados" style="padding: 0.75rem 1.4rem; font-weight: 700; font-size: 0.9rem; border: none; background: ${activeAccountTab === 'dados' ? 'var(--c-pink-dark)' : 'var(--bg-surface)'}; color: ${activeAccountTab === 'dados' ? '#FFF' : 'var(--c-text-main)'}; border-radius: var(--radius-md) var(--radius-md) 0 0; cursor: pointer; transition: all 0.2s;">
          👤 Meus Dados & Endereço
        </button>
      </div>

      <!-- Conteúdo da Aba Ativa -->
      <div id="account-tab-content">
        ${renderTabContent(customer)}
      </div>

    </section>
  `;
}

function renderTabContent(customer) {
  const favorites = getFavorites();

  switch (activeAccountTab) {
    case 'pedidos':
      return `
        <div class="glass-panel" style="padding: 1.5rem; border-radius: var(--radius-lg);">
          <h3 style="font-size: 1.2rem; font-family: var(--font-heading); margin-bottom: 1.2rem;">Histórico de Compras</h3>

          ${sampleCustomerOrders.length === 0 ? `
            <p style="text-align: center; color: var(--c-text-muted); padding: 2rem;">Você ainda não possui pedidos realizados.</p>
          ` : sampleCustomerOrders.map(order => `
            <div style="border: 1px solid var(--c-mint); border-radius: var(--radius-md); padding: 1.2rem; margin-bottom: 1rem; background: var(--bg-base);">
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.8rem; border-bottom: 1px dashed var(--c-mint); padding-bottom: 0.6rem;">
                <div>
                  <strong style="font-size: 1.05rem;">Pedido #${order.id}</strong>
                  <span style="font-size: 0.82rem; color: var(--c-text-muted); margin-left: 0.8rem;">Data: ${order.date}</span>
                </div>
                <span style="background: ${order.statusColor}; color: #FFF; font-size: 0.78rem; font-weight: 700; padding: 0.25rem 0.75rem; border-radius: var(--radius-full);">
                  ${order.status}
                </span>
              </div>

              <div style="display: flex; gap: 1rem; flex-direction: column; margin-bottom: 1rem;">
                ${order.items.map(item => `
                  <div style="display: flex; align-items: center; gap: 1rem;">
                    <img src="${item.image}" alt="${item.title}" style="width: 50px; height: 65px; object-fit: cover; border-radius: var(--radius-sm);" />
                    <div>
                      <div style="font-weight: 700; font-size: 0.92rem;">${item.title}</div>
                      <div style="font-size: 0.8rem; color: var(--c-text-muted);">Marca: ${item.brand} • Tam: ${item.size}</div>
                      <div style="font-size: 0.85rem; font-weight: 700; color: var(--c-text-main);">R$ ${item.price.toFixed(2).replace('.', ',')}</div>
                    </div>
                  </div>
                `).join('')}
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.8rem; background: #FFF; padding: 0.8rem 1rem; border-radius: var(--radius-sm);">
                <div>
                  <span style="font-size: 0.82rem; color: var(--c-text-muted);">Pagamento: <strong>${order.paymentMethod}</strong></span>
                  ${order.trackingCode ? `<div style="font-size: 0.82rem; color: var(--c-text-muted); margin-top: 0.2rem;">Rastreio Correios: <strong style="color: var(--c-pink-dark);">${order.trackingCode}</strong></div>` : ''}
                </div>
                <div style="display: flex; align-items: center; gap: 1rem;">
                  <span style="font-size: 1.1rem; font-weight: 700;">Total: R$ ${order.total.toFixed(2).replace('.', ',')}</span>
                  <button class="btn btn-outline btn-track-order-action" style="font-size: 0.8rem; padding: 0.4rem 0.8rem;">
                    🚚 Rastrear Pedido
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;

    case 'consignacao':
      return `
        <div class="glass-panel" style="padding: 1.5rem; border-radius: var(--radius-lg);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.2rem;">
            <div>
              <h3 style="font-size: 1.2rem; font-family: var(--font-heading); margin: 0;">Portal do Consignador / Suas Peças à Venda</h3>
              <p style="font-size: 0.82rem; color: var(--c-text-muted); margin-top: 0.2rem;">Inspirado no modelo de repasse do Brechó Capricho à Toa (60% da venda é seu via PIX).</p>
            </div>

            <div style="background: var(--c-mint-light); border: 1px solid var(--c-mint-dark); padding: 0.6rem 1.2rem; border-radius: var(--radius-md); text-align: right;">
              <span style="font-size: 0.78rem; color: var(--c-text-muted); display: block;">Saldo Disponível para Saque:</span>
              <strong style="font-size: 1.2rem; color: var(--c-text-main);">R$ 108,00</strong>
              <button id="btn-request-payout" class="btn btn-primary" style="margin-top: 0.4rem; font-size: 0.78rem; padding: 0.3rem 0.7rem; width: 100%;">
                💰 Solicitar Saque via PIX
              </button>
            </div>
          </div>

          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem;">
              <thead>
                <tr style="border-bottom: 2px solid var(--c-mint); text-align: left;">
                  <th style="padding: 0.7rem;">Peça</th>
                  <th style="padding: 0.7rem;">Marca</th>
                  <th style="padding: 0.7rem;">Preço de Venda</th>
                  <th style="padding: 0.7rem;">Sua Comissão</th>
                  <th style="padding: 0.7rem;">Status</th>
                </tr>
              </thead>
              <tbody>
                ${sampleConsignmentItems.map(item => `
                  <tr style="border-bottom: 1px solid rgba(196, 230, 197, 0.4);">
                    <td style="padding: 0.7rem; display: flex; align-items: center; gap: 0.8rem;">
                      <img src="${item.image}" alt="${item.title}" style="width: 40px; height: 50px; object-fit: cover; border-radius: var(--radius-sm);" />
                      <span style="font-weight: 600;">${item.title}</span>
                    </td>
                    <td style="padding: 0.7rem; color: var(--c-text-muted);">${item.brand}</td>
                    <td style="padding: 0.7rem; font-weight: 700;">R$ ${item.price.toFixed(2).replace('.', ',')}</td>
                    <td style="padding: 0.7rem; color: var(--c-text-main); font-weight: 700;">${item.commission}</td>
                    <td style="padding: 0.7rem;">
                      <span class="badge-curated" style="font-size: 0.75rem; padding: 0.2rem 0.6rem;">${item.status}</span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;

    case 'favoritos':
      return `
        <div class="glass-panel" style="padding: 1.5rem; border-radius: var(--radius-lg);">
          <h3 style="font-size: 1.2rem; font-family: var(--font-heading); margin-bottom: 1.2rem;">Sua Lista de Desejos</h3>

          ${favorites.length === 0 ? `
            <p style="text-align: center; color: var(--c-text-muted); padding: 2rem;">Você ainda não salvou nenhum garimpo nos favoritos.</p>
          ` : `
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.2rem;">
              ${favorites.map(item => `
                <div style="border: 1px solid var(--c-mint); border-radius: var(--radius-md); overflow: hidden; background: #FFF; padding: 0.8rem;">
                  <img src="${item.image}" alt="${item.title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: var(--radius-sm); margin-bottom: 0.6rem;" />
                  <div style="font-weight: 700; font-size: 0.9rem; margin-bottom: 0.3rem;">${item.title}</div>
                  <div style="font-size: 0.8rem; color: var(--c-text-muted); margin-bottom: 0.5rem;">Tam: ${item.size} • ${item.brand}</div>
                  <div style="font-size: 1.1rem; font-weight: 700; color: var(--c-text-main); margin-bottom: 0.6rem;">R$ ${item.price.toFixed(2).replace('.', ',')}</div>
                  <button class="btn btn-primary btn-fav-to-cart" data-id="${item.id}" style="width: 100%; font-size: 0.82rem; padding: 0.45rem;">
                    🛒 Adicionar ao Carrinho
                  </button>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      `;

    case 'dados':
      return `
        <div class="glass-panel" style="padding: 1.5rem; border-radius: var(--radius-lg); max-width: 650px;">
          <h3 style="font-size: 1.2rem; font-family: var(--font-heading); margin-bottom: 1.2rem;">Seus Dados Cadastrais & Endereço</h3>

          <form id="customer-profile-form">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.2rem;">
              <div style="grid-column: 1 / -1;">
                <label style="display: block; font-size: 0.82rem; font-weight: 700; margin-bottom: 0.3rem;">Nome Completo</label>
                <input type="text" id="prof-name" class="search-input" style="width: 100%;" value="${customer.name || ''}" required />
              </div>

              <div>
                <label style="display: block; font-size: 0.82rem; font-weight: 700; margin-bottom: 0.3rem;">E-mail</label>
                <input type="email" id="prof-email" class="search-input" style="width: 100%;" value="${customer.email || ''}" required readonly />
              </div>

              <div>
                <label style="display: block; font-size: 0.82rem; font-weight: 700; margin-bottom: 0.3rem;">WhatsApp</label>
                <input type="tel" id="prof-phone" class="search-input" style="width: 100%;" value="${customer.phone || ''}" required />
              </div>

              <div>
                <label style="display: block; font-size: 0.82rem; font-weight: 700; margin-bottom: 0.3rem;">CPF</label>
                <input type="text" id="prof-cpf" class="search-input" style="width: 100%;" value="${customer.cpf || ''}" placeholder="000.000.000-00" />
              </div>

              <div>
                <label style="display: block; font-size: 0.82rem; font-weight: 700; margin-bottom: 0.3rem;">CEP de Entrega</label>
                <input type="text" id="prof-cep" class="search-input" style="width: 100%;" value="${customer.cep || ''}" placeholder="00000-000" />
              </div>

              <div style="grid-column: 1 / -1;">
                <label style="display: block; font-size: 0.82rem; font-weight: 700; margin-bottom: 0.3rem;">Endereço Completo</label>
                <input type="text" id="prof-address" class="search-input" style="width: 100%;" value="${customer.address || ''}" placeholder="Rua, Número, Bairro, Cidade - UF" />
              </div>
            </div>

            <button type="submit" class="btn btn-primary" style="padding: 0.7rem 1.4rem; font-size: 0.9rem;">
              💾 Atualizar Meus Dados
            </button>
          </form>
        </div>
      `;
  }
}

export function setupCustomerAccountListeners(onAuthSuccess) {
  // Alternar abas Login / Cadastro
  const loginTabBtn = document.getElementById('tab-login-btn');
  const regTabBtn = document.getElementById('tab-register-btn');

  if (loginTabBtn && regTabBtn) {
    loginTabBtn.addEventListener('click', () => {
      isAuthModeLogin = true;
      const view = document.getElementById('main-content-view');
      if (view) view.innerHTML = renderCustomerAccount();
      setupCustomerAccountListeners(onAuthSuccess);
    });

    regTabBtn.addEventListener('click', () => {
      isAuthModeLogin = false;
      const view = document.getElementById('main-content-view');
      if (view) view.innerHTML = renderCustomerAccount();
      setupCustomerAccountListeners(onAuthSuccess);
    });
  }

  // Submit Login
  const loginForm = document.getElementById('customer-login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('c-login-email').value.trim();
      const name = email.split('@')[0];
      const user = {
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email: email,
        phone: '(11) 98765-4321',
        cpf: '123.456.789-00'
      };
      setCustomerUser(user);
      if (onAuthSuccess) onAuthSuccess();
    });
  }

  // Submit Cadastro
  const regForm = document.getElementById('customer-register-form');
  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = {
        name: document.getElementById('c-reg-name').value.trim(),
        email: document.getElementById('c-reg-email').value.trim(),
        phone: document.getElementById('c-reg-phone').value.trim(),
        cpf: document.getElementById('c-reg-cpf').value.trim()
      };
      setCustomerUser(user);
      alert('🎉 Conta VIP criada com sucesso! Você ganhou 10% OFF no seu primeiro garimpo.');
      if (onAuthSuccess) onAuthSuccess();
    });
  }

  // Logout
  const logoutBtn = document.getElementById('customer-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      setCustomerUser(null);
      if (onAuthSuccess) onAuthSuccess();
    });
  }

  // Navegação por Abas da Área do Cliente
  document.querySelectorAll('.account-nav-tab').forEach(tabBtn => {
    tabBtn.addEventListener('click', () => {
      activeAccountTab = tabBtn.getAttribute('data-tab');
      const view = document.getElementById('main-content-view');
      if (view) view.innerHTML = renderCustomerAccount();
      setupCustomerAccountListeners(onAuthSuccess);
    });
  });

  // Ação de Rastreio nos Pedidos
  document.querySelectorAll('.btn-track-order-action').forEach(btn => {
    btn.addEventListener('click', () => {
      openOrdersModal();
    });
  });

  // Solicitar Saque PIX na Consignação
  const payoutBtn = document.getElementById('btn-request-payout');
  if (payoutBtn) {
    payoutBtn.addEventListener('click', () => {
      alert('✅ Solicitação de Saque de R$ 108,00 recebida com sucesso! O valor será transferido para sua chave PIX vinculada em até 24h úteis.');
    });
  }

  // Salvar Dados do Perfil
  const profileForm = document.getElementById('customer-profile-form');
  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const current = getCustomerUser() || {};
      const updated = {
        ...current,
        name: document.getElementById('prof-name').value.trim(),
        phone: document.getElementById('prof-phone').value.trim(),
        cpf: document.getElementById('prof-cpf').value.trim(),
        cep: document.getElementById('prof-cep').value.trim(),
        address: document.getElementById('prof-address').value.trim()
      };
      setCustomerUser(updated);
      alert('✅ Seus dados cadastrais foram atualizados com sucesso!');
    });
  }
}
