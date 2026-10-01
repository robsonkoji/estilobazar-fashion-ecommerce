import { showToast } from '../utils/storage.js';

export function openOrdersModal() {
  const existing = document.getElementById('orders-modal');
  if (existing) existing.remove();

  const orders = JSON.parse(localStorage.getItem('estilobazar_orders') || '[]');

  const modal = document.createElement('div');
  modal.className = 'modal-overlay active';
  modal.id = 'orders-modal';

  modal.innerHTML = `
    <div class="modal-container" style="max-width: 720px;">
      <button class="modal-close" id="orders-close-btn">&times;</button>
      
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <span class="badge-curated" style="margin-bottom: 0.4rem;">Minhas Compras</span>
        <h2 class="title-section" style="font-size: 1.8rem; margin-bottom: 0.8rem;">Rastreamento de Pedidos</h2>
        <div style="max-width: 420px; margin: 0 auto; display: flex; gap: 0.5rem;">
          <input type="text" id="orders-search-input" class="search-input" placeholder="Digite o nº do seu pedido (ex: #EB-2902)..." style="flex: 1; font-size: 0.85rem;" />
        </div>
      </div>

      ${orders.length === 0 ? `
        <div class="glass-panel" style="text-align: center; padding: 3rem 1.5rem;">
          <div style="font-size: 3rem; margin-bottom: 0.8rem;">📦</div>
          <h3 style="font-size: 1.2rem; margin-bottom: 0.4rem;">Nenhum pedido encontrado</h3>
          <p style="font-size: 0.9rem; color: var(--c-text-muted); margin-bottom: 1.5rem;">
            Você ainda não realizou compras nesta sessão. Garimpe peças incríveis na nossa loja!
          </p>
          <a href="#loja" class="btn btn-primary" id="orders-empty-go-store">Ver Peças Disponíveis</a>
        </div>
      ` : `
        <div style="display: flex; flex-direction: column; gap: 1.2rem;" class="orders-list">
          ${orders.map(order => `
            <div class="glass-panel" style="padding: 1.5rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed rgba(196,230,197,0.6); padding-bottom: 0.8rem; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
                <div>
                  <strong style="font-size: 1.1rem; color: var(--c-pink-dark);">#${order.id}</strong>
                  <span style="font-size: 0.82rem; color: var(--c-text-muted); margin-left: 0.5rem;">• ${order.date}</span>
                </div>
                <span class="security-badge" style="font-size: 0.8rem;">${order.status}</span>
              </div>

              <!-- Order Timeline -->
              <div class="order-timeline-bar" style="margin-bottom: 1.2rem;">
                <div class="timeline-step active">
                  <div class="timeline-dot">✓</div>
                  <span>Pedido Criado</span>
                </div>
                <div class="timeline-line active"></div>
                <div class="timeline-step ${order.step >= 2 ? 'active' : ''}">
                  <div class="timeline-dot">${order.step >= 2 ? '✓' : '2'}</div>
                  <span>Em Separação</span>
                </div>
                <div class="timeline-line ${order.step >= 3 ? 'active' : ''}"></div>
                <div class="timeline-step ${order.step >= 3 ? 'active' : ''}">
                  <div class="timeline-dot">${order.step >= 3 ? '✓' : '3'}</div>
                  <span>Enviado</span>
                </div>
              </div>

              <div style="font-size: 0.85rem; color: var(--c-text-muted); margin-bottom: 0.8rem;">
                ${order.trackingCode ? `
                  Código de Rastreamento: <strong style="color: var(--c-pink-dark); font-size: 0.95rem;">${order.trackingCode}</strong>
                  <a href="https://rastreamento.correios.com.br/app/index.php?codigo=${order.trackingCode}" target="_blank" class="btn btn-outline" style="font-size: 0.72rem; padding: 0.2rem 0.6rem; margin-left: 0.5rem; text-decoration: none; display: inline-flex; align-items: center; gap: 0.2rem;">
                    🔗 Acompanhar nos Correios
                  </a>
                ` : `
                  Código de Rastreamento: <span style="color: #D97706; font-weight: 600;">⏳ Aguardando Postagem (Até 24h úteis)</span>
                `}
              </div>

              <div style="display: flex; gap: 0.6rem; overflow-x: auto; padding-bottom: 0.5rem;">
                ${order.items.map(item => `
                  <img src="${item.image}" title="${item.title}" alt="${item.title}" style="width: 50px; height: 65px; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid var(--c-mint);">
                `).join('')}
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.8rem; margin-top: 0.8rem; pt-0.5rem; border-top: 1px solid rgba(0,0,0,0.06);">
                ${order.step < 2 ? `
                  <button class="btn btn-outline btn-modal-confirm-pix" data-id="${order.id}" style="font-size: 0.78rem; padding: 0.35rem 0.75rem; background: #DCFCE7; color: #15803D; border-color: #8EC490; font-weight: 700;">
                    ✅ Já Paguei o PIX (Confirmar)
                  </button>
                ` : `<span></span>`}
                <div style="font-weight: 700; font-size: 1.1rem;">
                  Total: R$ ${order.total.toFixed(2).replace('.', ',')}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelectorAll('.btn-modal-confirm-pix').forEach(btn => {
    btn.addEventListener('click', () => {
      const orderId = btn.getAttribute('data-id');
      try {
        const ordersList = JSON.parse(localStorage.getItem('estilobazar_orders') || '[]');
        const idx = ordersList.findIndex(o => String(o.id) === String(orderId));
        if (idx !== -1) {
          ordersList[idx].status = 'Pagamento Aprovado';
          ordersList[idx].step = 2; // Em Separação
          localStorage.setItem('estilobazar_orders', JSON.stringify(ordersList));
        }
      } catch (e) { console.error(e); }
      showToast(`✅ Pagamento do Pedido #${orderId} confirmado com sucesso!`);
      modal.remove();
      openOrdersModal();
    });
  });

  const closeBtn = modal.querySelector('#orders-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', () => modal.remove());

  const goStoreBtn = modal.querySelector('#orders-empty-go-store');
  if (goStoreBtn) goStoreBtn.addEventListener('click', () => modal.remove());
}
