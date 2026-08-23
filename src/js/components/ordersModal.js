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
      
      <div style="text-align: center; margin-bottom: 1.8rem;">
        <span class="badge-curated" style="margin-bottom: 0.4rem;">Minhas Compras</span>
        <h2 class="title-section" style="font-size: 1.8rem;">Rastreamento de Pedidos</h2>
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
                Código de Rastreamento Correios: <strong style="color: var(--c-text-main);">${order.trackingCode}</strong>
              </div>

              <div style="display: flex; gap: 0.6rem; overflow-x: auto; padding-bottom: 0.5rem;">
                ${order.items.map(item => `
                  <img src="${item.image}" title="${item.title}" alt="${item.title}" style="width: 50px; height: 65px; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid var(--c-mint);">
                `).join('')}
              </div>

              <div style="text-align: right; font-weight: 700; font-size: 1.1rem; margin-top: 0.5rem;">
                Total: R$ ${order.total.toFixed(2).replace('.', ',')}
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;

  document.body.appendChild(modal);

  const closeBtn = modal.querySelector('#orders-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', () => modal.remove());

  const goStoreBtn = modal.querySelector('#orders-empty-go-store');
  if (goStoreBtn) goStoreBtn.addEventListener('click', () => modal.remove());
}
