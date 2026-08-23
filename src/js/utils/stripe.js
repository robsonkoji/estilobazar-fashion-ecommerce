import { getCart, clearCart, showToast } from './storage.js';

export function openCheckoutModal() {
  const cart = getCart();
  if (cart.length === 0) {
    showToast('Seu carrinho está vazio.');
    return;
  }

  const subtotal = cart.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay active';
  overlay.id = 'checkout-modal';

  overlay.innerHTML = `
    <div class="modal-container" style="max-width: 580px; padding: 2.2rem;">
      <button class="modal-close" id="checkout-close-btn">&times;</button>
      
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <div style="display: inline-flex; align-items: center; justify-content: center; width: 50px; height: 50px; background: var(--c-pink-light); border-radius: 50%; color: var(--c-pink-dark); margin-bottom: 0.5rem;">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
        </div>
        <h2 style="font-size: 1.6rem; font-weight: 700;">Finalizar Pedido Segurado</h2>
        <p style="font-size: 0.9rem; color: var(--c-text-muted);">EstiloBazar • Curadoria Sustentável</p>
      </div>

      <div style="background: var(--bg-base); border: 1px solid var(--c-mint); border-radius: var(--radius-md); padding: 1.2rem; margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem; font-size: 0.95rem;">
          <span>Subtotal (${cart.length} itens):</span>
          <strong>R$ ${subtotal.toFixed(2).replace('.', ',')}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem; font-size: 0.95rem; color: #388e3c;">
          <span>Frete Ecológico:</span>
          <strong>GRÁTIS</strong>
        </div>
        <div style="display: flex; justify-content: space-between; border-top: 1.5px dashed var(--c-mint); padding-top: 0.6rem; margin-top: 0.6rem; font-size: 1.2rem; font-weight: 700;">
          <span>Total:</span>
          <span style="color: var(--c-text-main);">R$ ${subtotal.toFixed(2).replace('.', ',')}</span>
        </div>
      </div>

      <form id="checkout-form" style="display: flex; flex-direction: column; gap: 1rem;">
        <div>
          <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.3rem;">Nome Completo</label>
          <input type="text" id="chk-name" required placeholder="Sua nome completo" style="width:100%; padding:0.7rem 1rem; border:1.5px solid var(--c-mint); border-radius:var(--radius-md); background:var(--bg-base);">
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.3rem;">E-mail</label>
            <input type="email" id="chk-email" required placeholder="seu@email.com" style="width:100%; padding:0.7rem 1rem; border:1.5px solid var(--c-mint); border-radius:var(--radius-md); background:var(--bg-base);">
          </div>
          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.3rem;">CPF / Telefone</label>
            <input type="text" id="chk-cpf" required placeholder="000.000.000-00" style="width:100%; padding:0.7rem 1rem; border:1.5px solid var(--c-mint); border-radius:var(--radius-md); background:var(--bg-base);">
          </div>
        </div>

        <div>
          <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.3rem;">Forma de Pagamento</label>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem;">
            <label style="display: flex; align-items: center; gap: 0.5rem; border: 1.5px solid var(--c-mint); padding: 0.7rem 1rem; border-radius: var(--radius-md); cursor: pointer; background: var(--bg-base);">
              <input type="radio" name="payment" value="pix" checked>
              <strong>PIX (5% desc.)</strong>
            </label>
            <label style="display: flex; align-items: center; gap: 0.5rem; border: 1.5px solid var(--c-mint); padding: 0.7rem 1rem; border-radius: var(--radius-md); cursor: pointer; background: var(--bg-base);">
              <input type="radio" name="payment" value="card">
              <strong>Cartão de Crédito</strong>
            </label>
          </div>
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%; padding: 1rem; font-size: 1.05rem; margin-top: 0.5rem; background: var(--c-pink-dark); color: white;">
          🔒 Confirmar Pedido Seguro
        </button>
      </form>
    </div>
  `;

  document.body.appendChild(overlay);

  const closeBtn = overlay.querySelector('#checkout-close-btn');
  closeBtn.addEventListener('click', () => overlay.remove());

  const form = overlay.querySelector('#checkout-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    overlay.querySelector('.modal-container').innerHTML = `
      <div style="text-align: center; padding: 2.5rem 1rem;">
        <div style="width: 70px; height: 70px; background: var(--c-mint-light); border-radius: 50%; color: var(--c-mint-dark); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem auto;">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        </div>
        <h2 style="font-size: 2rem; font-weight: 700; margin-bottom: 0.8rem;">Pedido Confirmado! 🎉</h2>
        <p style="font-size: 1.05rem; color: var(--c-text-muted); max-width: 440px; margin: 0 auto 1.5rem auto;">
          Obrigado por escolher a moda sustentável! Enviamos o comprovante e os detalhes da curadoria para o seu e-mail.
        </p>
        <div style="background: var(--bg-base); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--c-mint); margin-bottom: 2rem;">
          <strong>Código do Pedido: #EB-${Math.floor(100000 + Math.random() * 900000)}</strong>
        </div>
        <button id="success-close-btn" class="btn btn-primary">Voltar à Loja</button>
      </div>
    `;

    clearCart();
    overlay.querySelector('#success-close-btn').addEventListener('click', () => overlay.remove());
  });
}
