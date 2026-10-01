import { getCart, removeFromCart, updateCartQuantity, getFavorites, toggleFavorite, addToCart } from '../utils/storage.js';
import { openCheckoutModal } from './checkoutModal.js';
import { calculateSmartShipping } from '../services/shippingService.js';

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

  container.innerHTML = freeShippingBarHTML + cart.map(item => {
    const qty = item.quantity || 1;
    const maxStock = (typeof item.stock === 'number' && item.stock >= 0) ? item.stock : (item.maxStock || 1);
    const itemTotal = item.price * qty;
    const isAtMaxStock = qty >= maxStock;

    return `
      <div class="cart-item" style="display: flex; gap: 0.8rem; padding: 0.8rem 0; border-bottom: 1px solid rgba(0,0,0,0.06); position: relative; align-items: center;">
        <img src="${item.image}" alt="${item.title}" class="cart-item-img" style="width: 70px; height: 85px; object-fit: cover; border-radius: var(--radius-sm);" />
        <div class="cart-item-details" style="flex: 1;">
          <div class="cart-item-title" style="font-weight: 700; font-size: 0.88rem; line-height: 1.3;">${item.title}</div>
          <div style="font-size: 0.76rem; color: var(--c-text-light); margin-top: 0.1rem;">Tam: ${item.size} • ${item.brand}</div>
          
          <div style="margin-top: 0.2rem;">
            ${maxStock === 1
              ? `<span style="font-size: 0.72rem; color: #C62828; background: #FFEBEE; padding: 0.1rem 0.4rem; border-radius: 4px; font-weight: 700;">⚠️ Peça Única em Estoque</span>`
              : `<span style="font-size: 0.72rem; color: #15803D; background: #DCFCE7; padding: 0.1rem 0.4rem; border-radius: 4px; font-weight: 600;">📦 Estoque: ${maxStock} un.</span>`}
          </div>

          <!-- Controle de Quantidade (+ / -) -->
          <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 0.5rem;">
            <div style="display: flex; align-items: center; gap: 0.4rem; background: #F3F4F6; padding: 0.15rem 0.4rem; border-radius: 6px; border: 1px solid #E5E7EB;">
              <button class="cart-qty-btn cart-qty-dec" data-id="${item.id}" style="width: 24px; height: 24px; border: none; background: #FFF; border-radius: 4px; font-weight: 800; cursor: pointer; color: var(--c-text-main); display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 2px rgba(0,0,0,0.05);" title="Remover 1 unidade">-</button>
              <span style="font-weight: 800; font-size: 0.88rem; min-width: 20px; text-align: center;">${qty}</span>
              <button class="cart-qty-btn cart-qty-inc" data-id="${item.id}" ${isAtMaxStock ? 'disabled style="width: 24px; height: 24px; border: none; background: #E5E7EB; border-radius: 4px; font-weight: 800; cursor: not-allowed; color: #9CA3AF; display: flex; align-items: center; justify-content: center;"' : 'style="width: 24px; height: 24px; border: none; background: #FFF; border-radius: 4px; font-weight: 800; cursor: pointer; color: var(--c-text-main); display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 2px rgba(0,0,0,0.05);"' } title="${isAtMaxStock ? 'Estoque máximo atingido' : 'Adicionar 1 unidade'}">+</button>
            </div>

            <div style="font-weight: 700; font-size: 0.9rem; color: var(--c-text-main);">
              R$ ${itemTotal.toFixed(2).replace('.', ',')}
            </div>
          </div>
        </div>

        <button class="cart-item-remove" data-id="${item.id}" title="Remover produto do carrinho" style="background: transparent; border: none; color: #9CA3AF; font-size: 1.2rem; cursor: pointer; padding: 0.2rem 0.4rem; transition: color 0.2s ease;">&times;</button>
      </div>
    `;
  }).join('');

  footer.innerHTML = `
    <!-- Simulador de Frete por CEP (Origem: Guarulhos - SP) -->
    <div style="background: #FAF9F6; border: 1px solid var(--c-mint); padding: 0.75rem 0.9rem; border-radius: var(--radius-md); margin-bottom: 0.9rem;">
      <div style="font-size: 0.8rem; font-weight: 700; color: var(--c-text-main); margin-bottom: 0.4rem; display: flex; align-items: center; justify-content: space-between;">
        <span>📍 Simular Frete (Guarulhos - SP)</span>
        <span style="font-size: 0.7rem; color: var(--c-text-muted);">Digite seu CEP</span>
      </div>
      <div style="display: flex; gap: 0.4rem;">
        <input type="text" id="cart-cep-input" class="search-input" placeholder="00000-000" style="font-size: 0.8rem; padding: 0.35rem 0.6rem; flex: 1;" />
        <button id="cart-cep-btn" class="btn btn-outline" style="font-size: 0.78rem; padding: 0.35rem 0.7rem;">Calcular</button>
      </div>
      <div id="cart-cep-result" style="display: none; margin-top: 0.5rem; font-size: 0.78rem;"></div>
    </div>

    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.95rem;">
      <span>Subtotal:</span>
      <strong>R$ ${subtotal.toFixed(2).replace('.', ',')}</strong>
    </div>
    <div style="display: flex; justify-content: space-between; margin-bottom: 1.2rem; font-size: 0.85rem; color: #388e3c;">
      <span>Frete:</span>
      <span id="cart-shipping-display-val">${remainingForFree <= 0 ? 'GRÁTIS' : 'Calculado no Checkout'}</span>
    </div>
    <button id="checkout-start-btn" class="btn btn-primary" style="width: 100%; padding: 0.9rem; font-size: 1rem;">
      Finalizar Compra Segura 🔒
    </button>
  `;

  const cepBtn = footer.querySelector('#cart-cep-btn');
  const cepInp = footer.querySelector('#cart-cep-input');
  const cepRes = footer.querySelector('#cart-cep-result');

  if (cepBtn && cepInp) {
    const runCartShippingCalc = async () => {
      const clean = cepInp.value.replace(/\D/g, '');
      if (clean.length !== 8) {
        if (cepRes) {
          cepRes.style.display = 'block';
          cepRes.style.color = '#DC2626';
          cepRes.textContent = 'Digite um CEP válido com 8 números.';
        }
        return;
      }
      if (cepRes) {
        cepRes.style.display = 'block';
        cepRes.style.color = 'var(--c-text-muted)';
        cepRes.textContent = '⏳ Calculando...';
      }

      const res = await calculateSmartShipping(clean, subtotal);
      if (res && res.options && res.options.length > 0) {
        const cheapest = res.options[0];
        if (cepRes) {
          cepRes.style.display = 'block';
          cepRes.style.color = '#2E7D32';
          cepRes.innerHTML = `
            <strong>${cheapest.name}</strong>: ${cheapest.price === 0 ? '<span style="color:#2E7D32; font-weight:800;">GRÁTIS</span>' : `R$ ${cheapest.price.toFixed(2).replace('.', ',')}`}<br>
            <span style="color:var(--c-text-muted); font-size:0.75rem;">Previsão: ${cheapest.time} (${res.zoneLabel})</span>
          `;
        }
      }
    };

    cepBtn.addEventListener('click', runCartShippingCalc);
    cepInp.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') runCartShippingCalc();
    });
  }

  // Event Listeners dos Botões de Quantidade (+ e -)
  container.querySelectorAll('.cart-qty-dec').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      updateCartQuantity(id, -1);
      updateCartDrawer();
    });
  });

  container.querySelectorAll('.cart-qty-inc').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      updateCartQuantity(id, +1);
      updateCartDrawer();
    });
  });

  // Event Listener para Remover Item Inteiro
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
