import { products as fallbackProducts } from '../data/products.js';
import { getProductsFromFirestore } from '../services/productService.js';

function formatPrice(value) {
  return (value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function calcDiscount(original, current) {
  if (!original || original <= current) return 0;
  return Math.round(((original - current) / original) * 100);
}

function renderProductCard(product) {
  const discount = calcDiscount(product.originalPrice, product.price);
  return `
    <div class="highlight-card" data-id="${product.id}">
      <div class="highlight-card-img-wrap">
        <img src="${product.image}" alt="${product.title}" loading="lazy" />
        ${product.badge ? `<span class="highlight-badge">${product.badge}</span>` : ''}
        ${discount > 0 ? `<span class="highlight-discount">-${discount}%</span>` : ''}
      </div>
      <div class="highlight-card-body">
        <span class="highlight-brand">${product.brand}</span>
        <h4 class="highlight-card-title">${product.title}</h4>
        <div class="highlight-card-pricing">
          <span class="highlight-price">${formatPrice(product.price)}</span>
          ${product.originalPrice > product.price
            ? `<span class="highlight-original-price">${formatPrice(product.originalPrice)}</span>`
            : ''}
        </div>
        <span class="highlight-size">Tam. ${product.size}</span>
      </div>
    </div>
  `;
}

export function renderHighlightsSection() {
  const featured = fallbackProducts.filter(p => p.isFeatured);
  const newArrivals = fallbackProducts.filter(p => p.isNew);

  return `
    <section class="highlights-section" id="destaques">
      <div class="container">

        <!-- Destaques da Semana -->
        <div class="highlights-header">
          <div>
            <span class="badge-curated">✨ Curadoria Especial</span>
            <h2 class="title-section">Destaques da Semana</h2>
          </div>
          <div class="highlights-nav">
            <button class="highlights-arrow highlights-arrow-left" id="highlights-arrow-left" aria-label="Anterior">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <button class="highlights-arrow highlights-arrow-right" id="highlights-arrow-right" aria-label="Próximo">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        </div>

        <div class="highlights-carousel-wrap">
          <div class="highlights-carousel" id="highlights-carousel">
            ${featured.map(p => renderProductCard(p)).join('')}
          </div>
        </div>

        <!-- Novidades do Dia -->
        <div class="highlights-header" style="margin-top: 3.5rem;">
          <div>
            <span class="badge-curated" style="background: var(--c-mint-light); color: var(--c-mint-dark);">🌱 Recém Chegados</span>
            <h2 class="title-section">Novidades do Dia</h2>
          </div>
        </div>

        <div class="new-arrivals-grid" id="new-arrivals-grid">
          ${newArrivals.map(p => renderProductCard(p)).join('')}
        </div>

      </div>
    </section>
  `;
}

export async function setupHighlightsListeners() {
  const carousel = document.getElementById('highlights-carousel');
  const leftBtn = document.getElementById('highlights-arrow-left');
  const rightBtn = document.getElementById('highlights-arrow-right');
  const newArrivalsGrid = document.getElementById('new-arrivals-grid');

  // Carrega produtos do Firestore
  const allProducts = await getProductsFromFirestore();
  if (allProducts && allProducts.length > 0) {
    const featured = allProducts.filter(p => p.isFeatured);
    const newArrivals = allProducts.filter(p => p.isNew);

    if (carousel && featured.length > 0) {
      carousel.innerHTML = featured.map(p => renderProductCard(p)).join('');
    }
    if (newArrivalsGrid && newArrivals.length > 0) {
      newArrivalsGrid.innerHTML = newArrivals.map(p => renderProductCard(p)).join('');
    }
  }

  if (!carousel || !leftBtn || !rightBtn) return;

  const scrollAmount = 320;

  leftBtn.addEventListener('click', () => {
    carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });

  rightBtn.addEventListener('click', () => {
    carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });

  function updateArrows() {
    const { scrollLeft, scrollWidth, clientWidth } = carousel;
    leftBtn.classList.toggle('is-hidden', scrollLeft <= 0);
    rightBtn.classList.toggle('is-hidden', scrollLeft + clientWidth >= scrollWidth - 2);
  }

  carousel.addEventListener('scroll', updateArrows, { passive: true });
  updateArrows();
}
