import { getCart, removeFromCart, getFavorites, toggleFavorite, addToCart } from '../utils/storage.js';
import { openCheckoutModal } from './checkoutModal.js';

export function renderDrawers() {
  return `
    <!-- Cart Drawer -->
    <div class="drawer" id="cart-drawer">
      <div class="drawer-header">
        <div class="drawer-title">
          <span>🛍️</span> Meu Carrinho
        </div>
        <button class="modal-close" id="cart-close-btn">&times;</button>
      </div>

      <div class="drawer-body" id="cart-drawer-items">
        <!-- Renderizado dinamicamente -->
      </div>

      <div class="drawer-footer" id="cart-drawer-footer">
        <!-- Renderizado dinamicamente -->
      </div>
    </div>

    <!-- Favorites Drawer -->
    <div class="drawer" id="fav-drawer">
      <div class="drawer-header">
        <div class="drawer-title">
          <span>💖</span> Meus Favoritos
        </div>
        <button class="modal-close" id="fav-close-btn">&times;</button>
      </div>

      <div class="drawer-body" id="fav-drawer-items">
        <!-- Renderizado dinamicamente -->
      </div>
    </div>
  `;
}

export function updateCartDrawer() {
  const container = document.getElementById('cart-drawer-items');
  const footer = document.getElementById('cart-drawer-footer');
  if (!container || !footer) return;

  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem; color: var(--c-text-muted);">
        <div style="font-size: 3rem; margin-bottom: 0.8rem;">🛍️</div>
        <h4 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.4rem;">Seu carrinho está vazio</h4>
        <p style="font-size: 0.88rem;">Explore nossos garimpos curados e encontre peças únicas para você!</p>
      </div>
    `;
    footer.innerHTML = '';
    return;
  }

  const subtotal = cart.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
  const freeThreshold = 250;
  const remainingForFree = freeThreshold - subtotal;
  const freeProgress = Math.min(100, (subtotal / freeThreshold) * 100);

  const freeShippingBarHTML = `
    <div class="cart-free-shipping-box" style="background: var(--c-mint-light); border: 1px solid var(--c-mint); padding: 0.8rem 1rem; border-radius: var(--radius-md); margin-bottom: 1rem;">
      <div style="font-size: 0.82rem; font-weight: 600; color: var(--c-text-main); margin-bottom: 0.4rem;">
        ${remainingForFree <= 0
          ? '🎉 Parabéns! Você ganhou **FRETE GRÁTIS**!'
          : `🚚 Faltam **R$ ${remainingForFree.toFixed(2).replace('.', ',')}** para você ganhar FRETE GRÁTIS!`}
      </div>
      <div style="height: 6px; background: rgba(0,0,0,0.08); border-radius: 999px; overflow: hidden;">
        <div style="height: 100%; width: ${freeProgress}%; background: var(--c-mint-dark); transition: width 0.3s ease;"></div>
      </div>
    </div>
  `;

  container.innerHTML = freeShippingBarHTML + cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.title}" class="cart-item-img">
      <div class="cart-item-details">
        <div class="cart-item-title">${item.title}</div>
        <div style="font-size: 0.78rem; color: var(--c-text-light);">Tam: ${item.size} • ${item.brand}</div>
        <div class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</div>
      </div>
      <button class="cart-item-remove" data-id="${item.id}" title="Remover item">&times;</button>
    </div>
  `).join('');

  footer.innerHTML = `
    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.95rem;">
      <span>Subtotal:</span>
      <strong>R$ ${subtotal.toFixed(2).replace('.', ',')}</strong>
    </div>
    <div style="display: flex; justify-content: space-between; margin-bottom: 1.2rem; font-size: 0.85rem; color: #388e3c;">
      <span>Frete:</span>
      <span>${remainingForFree <= 0 ? 'GRÁTIS' : 'Calculado no Checkout'}</span>
    </div>
    <button id="checkout-start-btn" class="btn btn-primary" style="width: 100%; padding: 0.9rem; font-size: 1rem;">
      Finalizar Compra Segura 🔒
    </button>
  `;

  container.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      removeFromCart(id);
      updateCartDrawer();
    });
  });

  const checkoutBtn = footer.querySelector('#checkout-start-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      document.getElementById('cart-drawer').classList.remove('active');
      openCheckoutModal();
    });
  }
}

export function updateFavDrawer() {
  const container = document.getElementById('fav-drawer-items');
  if (!container) return;

  const favs = getFavorites();

  if (favs.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem; color: var(--c-text-muted);">
        <div style="font-size: 3rem; margin-bottom: 0.8rem;">💖</div>
        <h4 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.4rem;">Nenhum favorito salvo</h4>
        <p style="font-size: 0.88rem;">Clique no coração dos cards de produto para salvar suas peças desejadas aqui!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = favs.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.title}" class="cart-item-img">
      <div class="cart-item-details">
        <div class="cart-item-title">${item.title}</div>
        <div style="font-size: 0.78rem; color: var(--c-text-light);">Tam: ${item.size}</div>
        <div class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 0.4rem; align-items: flex-end;">
        <button class="btn btn-secondary fav-add-cart-btn" data-id="${item.id}" style="font-size: 0.75rem; padding: 0.3rem 0.6rem;">
          + Carrinho
        </button>
        <button class="cart-item-remove fav-remove-btn" data-id="${item.id}" title="Remover dos favoritos">&times;</button>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.fav-add-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const prod = favs.find(p => p.id === id);
      if (prod) addToCart(prod);
    });
  });

  container.querySelectorAll('.fav-remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const prod = favs.find(p => p.id === id);
      if (prod) toggleFavorite(prod);
      updateFavDrawer();
    });
  });
}

export function setupDrawerListeners() {
  const cartBtn = document.getElementById('cart-drawer-btn');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartClose = document.getElementById('cart-close-btn');

  const favBtn = document.getElementById('fav-drawer-btn');
  const favDrawer = document.getElementById('fav-drawer');
  const favClose = document.getElementById('fav-close-btn');

  if (cartBtn && cartDrawer && cartClose) {
    cartBtn.addEventListener('click', () => {
      updateCartDrawer();
      cartDrawer.classList.add('active');
    });
    cartClose.addEventListener('click', () => {
      cartDrawer.classList.remove('active');
    });
  }

  if (favBtn && favDrawer && favClose) {
    favBtn.addEventListener('click', () => {
      updateFavDrawer();
      favDrawer.classList.add('active');
    });
    favClose.addEventListener('click', () => {
      favDrawer.classList.remove('active');
    });
  }

  window.addEventListener('cart-updated', () => {
    updateCartDrawer();
  });

  window.addEventListener('favs-updated', () => {
    updateFavDrawer();
  });
}
