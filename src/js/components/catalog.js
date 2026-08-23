import { getProductsFromFirestore } from '../services/productService.js';
import { categories, sizes, priceRanges, conditions, brands } from '../data/products.js';
import { addToCart, toggleFavorite, getFavorites } from '../utils/storage.js';
import { openProductModal } from './modal.js';

let activeCategory = "Todos";
let activeSize = "Todos";
let activePriceRangeIndex = 0;
let activeCondition = "Todas";
let activeBrand = "Todas";
let searchQuery = "";
let sortBy = "newest";

export function renderCatalog() {
  return `
    <section class="catalog-section" id="loja">
      <div class="container">
        <div class="catalog-header">
          <div class="catalog-title-row">
            <div>
              <span class="badge-curated" style="margin-bottom: 0.4rem;">Garimpos Exclusivos</span>
              <h2 class="title-section">Nosso Acervo Garimpado</h2>
            </div>

            <div class="catalog-controls">
              <div class="search-input-wrapper">
                <span class="search-icon">🔍</span>
                <input 
                  type="text" 
                  id="catalog-search" 
                  class="search-input" 
                  placeholder="Buscar peças, marcas ou tamanhos..."
                  value="${searchQuery}"
                />
              </div>

              <select id="catalog-sort" class="sort-select" aria-label="Ordenar produtos">
                <option value="newest" ${sortBy === 'newest' ? 'selected' : ''}>Mais Recentes</option>
                <option value="price-asc" ${sortBy === 'price-asc' ? 'selected' : ''}>Menor Preço</option>
                <option value="price-desc" ${sortBy === 'price-desc' ? 'selected' : ''}>Maior Preço</option>
              </select>
            </div>
          </div>

          <!-- Category Pills -->
          <div class="filter-pills-row" id="filter-pills">
            ${categories.map(cat => `
              <button 
                class="filter-pill ${activeCategory === cat ? 'active' : ''}" 
                data-category="${cat}"
              >
                ${cat}
              </button>
            `).join('')}
          </div>

          <!-- Advanced Filters Bar -->
          <div class="advanced-filters-bar glass-panel" style="padding: 1rem 1.2rem; margin-top: 1rem; display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; justify-content: space-between;">
            <div style="display: flex; flex-wrap: wrap; gap: 0.8rem; align-items: center;">
              <!-- Size Filter -->
              <div class="filter-select-wrap">
                <label style="font-size: 0.78rem; font-weight: 700; color: var(--c-text-muted); display: block; margin-bottom: 0.15rem;">Tamanho:</label>
                <select id="filter-size" class="sort-select" style="padding: 0.4rem 0.9rem; font-size: 0.85rem;">
                  ${sizes.map(s => `<option value="${s}" ${activeSize === s ? 'selected' : ''}>${s}</option>`).join('')}
                </select>
              </div>

              <!-- Price Range Filter -->
              <div class="filter-select-wrap">
                <label style="font-size: 0.78rem; font-weight: 700; color: var(--c-text-muted); display: block; margin-bottom: 0.15rem;">Faixa de Preço:</label>
                <select id="filter-price" class="sort-select" style="padding: 0.4rem 0.9rem; font-size: 0.85rem;">
                  ${priceRanges.map((p, idx) => `<option value="${idx}" ${activePriceRangeIndex === idx ? 'selected' : ''}>${p.label}</option>`).join('')}
                </select>
              </div>

              <!-- Condition Filter -->
              <div class="filter-select-wrap">
                <label style="font-size: 0.78rem; font-weight: 700; color: var(--c-text-muted); display: block; margin-bottom: 0.15rem;">Estado da Peça:</label>
                <select id="filter-condition" class="sort-select" style="padding: 0.4rem 0.9rem; font-size: 0.85rem;">
                  ${conditions.map(c => `<option value="${c}" ${activeCondition === c ? 'selected' : ''}>${c}</option>`).join('')}
                </select>
              </div>

              <!-- Brand Filter -->
              <div class="filter-select-wrap">
                <label style="font-size: 0.78rem; font-weight: 700; color: var(--c-text-muted); display: block; margin-bottom: 0.15rem;">Marca:</label>
                <select id="filter-brand" class="sort-select" style="padding: 0.4rem 0.9rem; font-size: 0.85rem;">
                  ${brands.map(b => `<option value="${b}" ${activeBrand === b ? 'selected' : ''}>${b}</option>`).join('')}
                </select>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 1rem;">
              <span id="results-count" style="font-size: 0.85rem; font-weight: 600; color: var(--c-text-muted);">
                Carregando...
              </span>
              <button id="clear-all-filters-btn" class="btn btn-outline" style="padding: 0.35rem 0.8rem; font-size: 0.8rem;">
                🧹 Limpar Filtros
              </button>
            </div>
          </div>

          <!-- Active Filter Chips Summary Bar -->
          <div id="active-filter-chips" class="active-filter-chips-bar" style="display: none;">
            <!-- Renderizado dinamicamente -->
          </div>

        </div>

        <div class="products-grid" id="products-grid">
          <!-- Renderizado via JS -->
        </div>
      </div>
    </section>
  `;
}

function renderActiveFilterChips() {
  const chipsContainer = document.getElementById('active-filter-chips');
  if (!chipsContainer) return;

  const currentPriceRange = priceRanges[activePriceRangeIndex];
  const chips = [];

  if (activeCategory !== "Todos") {
    chips.push({ label: `Categoria: ${activeCategory}`, type: 'category' });
  }
  if (activeSize !== "Todos") {
    chips.push({ label: `Tamanho: ${activeSize}`, type: 'size' });
  }
  if (activePriceRangeIndex !== 0 && currentPriceRange) {
    chips.push({ label: `Preço: ${currentPriceRange.label}`, type: 'price' });
  }
  if (activeCondition !== "Todas") {
    chips.push({ label: `Estado: ${activeCondition}`, type: 'condition' });
  }
  if (activeBrand !== "Todas") {
    chips.push({ label: `Marca: ${activeBrand}`, type: 'brand' });
  }
  if (searchQuery !== "") {
    chips.push({ label: `Busca: "${searchQuery}"`, type: 'search' });
  }

  if (chips.length === 0) {
    chipsContainer.style.display = 'none';
    chipsContainer.innerHTML = '';
    return;
  }

  chipsContainer.style.display = 'flex';
  chipsContainer.innerHTML = `
    <span style="font-size: 0.78rem; font-weight: 700; color: var(--c-text-muted); align-self: center; margin-right: 0.3rem;">Filtros Ativos:</span>
    ${chips.map(c => `
      <span class="active-filter-chip" data-chip-type="${c.type}">
        ${c.label} <button class="chip-remove-btn" aria-label="Remover filtro">&times;</button>
      </span>
    `).join('')}
  `;

  chipsContainer.querySelectorAll('.active-filter-chip').forEach(chip => {
    const btn = chip.querySelector('.chip-remove-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        const type = chip.getAttribute('data-chip-type');
        if (type === 'category') activeCategory = "Todos";
        if (type === 'size') activeSize = "Todos";
        if (type === 'price') activePriceRangeIndex = 0;
        if (type === 'condition') activeCondition = "Todas";
        if (type === 'brand') activeBrand = "Todas";
        if (type === 'search') {
          searchQuery = "";
          const searchInput = document.getElementById('catalog-search');
          if (searchInput) searchInput.value = "";
        }
        syncFilterSelectsUI();
        updateCatalogGrid();
      });
    }
  });
}

function syncFilterSelectsUI() {
  const brandSelect = document.getElementById('filter-brand');
  if (brandSelect) brandSelect.value = activeBrand;

  const sizeSelect = document.getElementById('filter-size');
  if (sizeSelect) sizeSelect.value = activeSize;

  const priceSelect = document.getElementById('filter-price');
  if (priceSelect) priceSelect.value = String(activePriceRangeIndex);

  const condSelect = document.getElementById('filter-condition');
  if (condSelect) condSelect.value = activeCondition;

  updateFilterPillsUI();
}

export async function updateCatalogGrid() {
  const grid = document.getElementById('products-grid');
  const countEl = document.getElementById('results-count');
  if (!grid) return;

  const currentProducts = await getProductsFromFirestore();

  const favs = getFavorites();
  const favIds = new Set(favs.map(item => item.id));

  const currentPriceRange = priceRanges[activePriceRangeIndex] || priceRanges[0];

  // Advanced Filtering
  let filtered = currentProducts.filter(product => {
    const matchCategory = activeCategory === "Todos" || product.category === activeCategory;
    const matchSize = activeSize === "Todos" || product.size === activeSize;
    const matchPrice = product.price >= currentPriceRange.min && product.price <= currentPriceRange.max;
    const matchCondition = activeCondition === "Todas" || (product.condition && product.condition.toLowerCase().includes(activeCondition.toLowerCase()));
    const matchBrand = activeBrand === "Todas" || (product.brand && product.brand.toLowerCase() === activeBrand.toLowerCase());
    
    const matchSearch = searchQuery === "" || 
      (product.title && product.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.size && product.size.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchCategory && matchSize && matchPrice && matchCondition && matchBrand && matchSearch;
  });

  // Sorting
  if (sortBy === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  }

  if (countEl) {
    countEl.textContent = `Exibindo ${filtered.length} ${filtered.length === 1 ? 'garimpo' : 'garimpos'}`;
  }

  renderActiveFilterChips();

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;" class="glass-panel page-view-animate">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
        <h3 style="font-size: 1.4rem; margin-bottom: 0.5rem;">Nenhuma peça encontrada com esses filtros</h3>
        <p style="color: var(--c-text-muted);">Tente combinar outros tamanhos, marcas ou limpar os filtros ativos.</p>
        <button id="reset-filters-btn" class="btn btn-outline" style="margin-top: 1.2rem;">Ver Todas as Peças</button>
      </div>
    `;
    const resetBtn = document.getElementById('reset-filters-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', resetAllFilters);
    }
    return;
  }

  grid.innerHTML = filtered.map((product, index) => {
    const isFav = favIds.has(product.id);
    const delay = (index % 8) * 0.05;

    return `
      <article class="product-card filter-card-animate" data-id="${product.id}" style="animation-delay: ${delay}s;">
        <div class="product-card-img-wrapper">
          <span class="badge-curated product-card-badge">${product.badge}</span>
          <button class="product-card-fav ${isFav ? 'active' : ''}" data-id="${product.id}" title="Salvar nos Favoritos" aria-label="Favoritar ${product.title}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${isFav ? '#E05252' : 'none'}" stroke="${isFav ? '#E05252' : 'currentColor'}" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </button>
          <img 
            src="${product.image}" 
            alt="${product.title}" 
            class="product-card-img" 
            loading="lazy"
          />
        </div>

        <div class="product-card-body">
          <div style="font-size: 0.78rem; color: var(--c-text-light); text-transform: uppercase; letter-spacing: 0.03em; margin-bottom: 0.2rem;">
            ${product.brand}
          </div>
          <h3 class="product-card-title">${product.title}</h3>
          
          <div style="display: flex; align-items: baseline; gap: 0.5rem; margin-top: 0.3rem;">
            <span class="product-card-price">R$ ${product.price.toFixed(2).replace('.', ',')}</span>
            ${product.originalPrice ? `<span style="font-size: 0.82rem; color: var(--c-text-light); text-decoration: line-through;">R$ ${product.originalPrice.toFixed(2).replace('.', ',')}</span>` : ''}
          </div>

          <div class="product-card-meta">
            <span class="badge-size">Tam: ${product.size}</span>
            <span>${product.condition}</span>
          </div>

          <div class="product-card-actions">
            <button class="btn-card-buy btn-view-modal" data-id="${product.id}">
              Ver Detalhes &amp; Medidas
            </button>
            <button class="btn btn-secondary btn-add-cart" data-id="${product.id}" style="width: 100%; font-size: 0.85rem; padding: 0.5rem;">
              + Adicionar Peça
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  setupGridEventHandlers();
}

export function applyCatalogFilter({ category = "Todos", brand = "Todas", search = "" } = {}) {
  activeCategory = category;
  activeBrand = brand;
  searchQuery = search;
  activeSize = "Todos";
  activePriceRangeIndex = 0;
  activeCondition = "Todas";
  
  syncFilterSelectsUI();
  updateCatalogGrid();
}

function resetAllFilters() {
  applyCatalogFilter();
}

function updateFilterPillsUI() {
  const pills = document.querySelectorAll('.filter-pill');
  pills.forEach(pill => {
    if (pill.getAttribute('data-category') === activeCategory) {
      pill.classList.add('active');
    } else {
      pill.classList.remove('active');
    }
  });
}

async function setupGridEventHandlers() {
  const currentProducts = await getProductsFromFirestore();

  document.querySelectorAll('.btn-view-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const prod = currentProducts.find(p => p.id === id);
      if (prod) openProductModal(prod);
    });
  });

  document.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      const prod = currentProducts.find(p => p.id === id);
      if (prod) addToCart(prod);
    });
  });

  document.querySelectorAll('.product-card-fav').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      const prod = currentProducts.find(p => p.id === id);
      if (prod) {
        toggleFavorite(prod);
        updateCatalogGrid();
      }
    });
  });
}

export function setupCatalogListeners() {
  const searchInput = document.getElementById('catalog-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      updateCatalogGrid();
    });
  }

  const searchToggleBtn = document.getElementById('search-toggle-btn');
  if (searchToggleBtn && searchInput) {
    searchToggleBtn.addEventListener('click', () => {
      searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      searchInput.focus();
    });
  }

  const sortSelect = document.getElementById('catalog-sort');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      sortBy = e.target.value;
      updateCatalogGrid();
    });
  }

  const filterPillsContainer = document.getElementById('filter-pills');
  if (filterPillsContainer) {
    filterPillsContainer.addEventListener('click', (e) => {
      const pill = e.target.closest('.filter-pill');
      if (pill) {
        activeCategory = pill.getAttribute('data-category');
        updateFilterPillsUI();
        updateCatalogGrid();
      }
    });
  }

  // Advanced Filters Selects
  const sizeSelect = document.getElementById('filter-size');
  if (sizeSelect) {
    sizeSelect.addEventListener('change', (e) => {
      activeSize = e.target.value;
      updateCatalogGrid();
    });
  }

  const priceSelect = document.getElementById('filter-price');
  if (priceSelect) {
    priceSelect.addEventListener('change', (e) => {
      activePriceRangeIndex = parseInt(e.target.value, 10);
      updateCatalogGrid();
    });
  }

  const condSelect = document.getElementById('filter-condition');
  if (condSelect) {
    condSelect.addEventListener('change', (e) => {
      activeCondition = e.target.value;
      updateCatalogGrid();
    });
  }

  const brandSelect = document.getElementById('filter-brand');
  if (brandSelect) {
    brandSelect.addEventListener('change', (e) => {
      activeBrand = e.target.value;
      updateCatalogGrid();
    });
  }

  const clearBtn = document.getElementById('clear-all-filters-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', resetAllFilters);
  }
}
