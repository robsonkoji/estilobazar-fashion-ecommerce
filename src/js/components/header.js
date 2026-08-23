import { getCart, getFavorites } from '../utils/storage.js';
import { openOrdersModal } from './ordersModal.js';
import { applyCatalogFilter } from './catalog.js';

const megaMenuData = [
  {
    label: 'Feminino',
    href: '#loja',
    items: [
      { text: 'Vestidos', category: 'Vestidos' },
      { text: 'Blusas', category: 'Blusas' },
      { text: 'Saias', category: 'Saias' },
      { text: 'Calças', search: 'Calça' },
      { text: 'Casacos & Jaquetas', category: 'Jaquetas' },
      { text: 'Moda Fitness', search: 'Fitness' }
    ]
  },
  {
    label: 'Masculino',
    href: '#loja',
    items: [
      { text: 'Camisetas', search: 'Camiseta' },
      { text: 'Calças', search: 'Calça' },
      { text: 'Casacos & Jaquetas', category: 'Jaquetas' },
      { text: 'Acessórios', category: 'Acessórios' }
    ]
  },
  {
    label: 'Acessórios & Calçados',
    href: '#loja',
    items: [
      { text: 'Bolsas', category: 'Acessórios' },
      { text: 'Cintos', search: 'Cinto' },
      { text: 'Óculos', search: 'Óculos' },
      { text: 'Joias', search: 'Joia' },
      { text: 'Botas', category: 'Calçados' },
      { text: 'Tênis', category: 'Calçados' },
      { text: 'Salto', category: 'Calçados' }
    ]
  },
  {
    label: 'Marcas',
    href: '#loja',
    items: [
      { text: 'Zara', brand: 'Zara' },
      { text: 'Farm', brand: 'Farm' },
      { text: 'Arezzo', brand: 'Arezzo' },
      { text: 'Animale', brand: 'Animale' },
      { text: 'Osklen', brand: 'Osklen' },
      { text: 'Levi\'s', brand: 'Levi\'s' }
    ]
  }
];

export function renderHeader() {
  const cart = getCart();
  const favs = getFavorites();
  const cartCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const favCount = favs.length;

  const megaMenuHTML = megaMenuData.map(menu => `
    <li class="nav-item has-dropdown">
      <a href="${menu.href}" class="nav-link">${menu.label}</a>
      <div class="mega-dropdown" aria-hidden="true">
        <ul class="mega-dropdown-list">
          ${menu.items.map(item => `
            <li>
              <a 
                href="#loja" 
                class="mega-dropdown-link"
                ${item.category ? `data-filter-category="${item.category}"` : ''}
                ${item.brand ? `data-filter-brand="${item.brand}"` : ''}
                ${item.search ? `data-filter-search="${item.search}"` : ''}
              >
                ${item.text}
              </a>
            </li>
          `).join('')}
        </ul>
      </div>
    </li>
  `).join('');

  return `
    <div class="top-bar" id="top-bar">
      <div class="container top-bar-container">
        <div class="top-bar-announcement">
          ✨ Frete Grátis acima de R$ 250 • Desapegue e receba via PIX 🌿
        </div>
        <div class="top-bar-links">
          <a href="#minha-conta" class="top-bar-link">👤 Minha Conta</a>
          <span class="top-bar-sep">•</span>
          <a href="#" id="top-orders-link" class="top-bar-link">📦 Meus Pedidos</a>
          <span class="top-bar-sep">•</span>
          <a href="#sobre" class="top-bar-link">Sobre Nós</a>
          <span class="top-bar-sep">•</span>
          <a href="#faq" class="top-bar-link">Ajuda / FAQ</a>
        </div>
      </div>
    </div>

    <header class="header" id="main-header">
      <div class="container header-container">
        <a href="#home" class="logo-link" id="logo-btn">
          <img src="/logo-mark-trans.png" alt="EB Monogram Logo" class="logo-mark-img" />
          <span class="logo-text">EstiloBazar</span>
        </a>

        <nav class="nav-wrapper" id="nav-wrapper">
          <ul class="nav-menu" id="nav-menu">
            ${megaMenuHTML}
            <li class="nav-item">
              <a href="#quero-vender" class="nav-link nav-link-highlight">Quero Vender</a>
            </li>
          </ul>
        </nav>

        <div class="header-actions">
          <button class="btn-icon" id="search-toggle-btn" title="Buscar peças" aria-label="Buscar peças">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>

          <a href="#minha-conta" class="btn-icon" id="account-btn" title="Minha Conta / Acesso do Cliente" aria-label="Minha Conta">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </a>

          <button class="btn-icon" id="fav-drawer-btn" title="Meus Favoritos" aria-label="Meus Favoritos">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            <span class="badge-count" id="fav-badge">${favCount}</span>
          </button>

          <button class="btn-icon" id="cart-drawer-btn" title="Carrinho de Compras" aria-label="Carrinho de Compras">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            <span class="badge-count" id="cart-badge">${cartCount}</span>
          </button>

          <button class="mobile-nav-toggle" id="mobile-toggle" aria-label="Abrir Menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </div>
      </div>
    </header>
  `;
}

export function setupHeaderListeners() {
  const mobileBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (mobileBtn && navMenu) {
    mobileBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }

  // Mega dropdown link click filtering handler
  document.querySelectorAll('.mega-dropdown-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const cat = link.getAttribute('data-filter-category');
      const brand = link.getAttribute('data-filter-brand');
      const search = link.getAttribute('data-filter-search');

      if (window.location.hash !== '#loja') {
        window.location.hash = 'loja';
      }

      setTimeout(() => {
        applyCatalogFilter({
          category: cat || "Todos",
          brand: brand || "Todas",
          search: search || ""
        });
        const catalogEl = document.getElementById('loja');
        if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);

      if (navMenu) navMenu.classList.remove('active');
    });
  });

  const topOrdersLink = document.getElementById('top-orders-link');
  if (topOrdersLink) {
    topOrdersLink.addEventListener('click', (e) => {
      e.preventDefault();
      openOrdersModal();
    });
  }

  window.addEventListener('cart-updated', (e) => {
    const badge = document.getElementById('cart-badge');
    if (badge) {
      const count = e.detail.reduce((acc, item) => acc + (item.quantity || 1), 0);
      badge.textContent = count;
      badge.classList.remove('badge-pop');
      void badge.offsetWidth;
      badge.classList.add('badge-pop');
    }
  });

  window.addEventListener('favs-updated', (e) => {
    const badge = document.getElementById('fav-badge');
    if (badge) {
      badge.textContent = e.detail.length;
      badge.classList.remove('badge-pop');
      void badge.offsetWidth;
      badge.classList.add('badge-pop');
    }
  });
}
