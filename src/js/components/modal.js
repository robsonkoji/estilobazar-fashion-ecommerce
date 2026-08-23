import { addToCart, toggleFavorite, getFavorites } from '../utils/storage.js';

export function openProductModal(product) {
  const existing = document.getElementById('product-detail-modal');
  if (existing) existing.remove();

  const favs = getFavorites();
  const isFav = favs.some(item => item.id === product.id);

  const galleryImages = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];

  const measurementsHTML = product.measurements
    ? Object.entries(product.measurements)
        .map(([key, val]) => `<span class="measurement-tag"><strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${val}</span>`)
        .join(' ')
    : '';

  const waMessage = encodeURIComponent(`Olá! Tenho interesse no garimpo: "${product.title}" (Tam: ${product.size}, R$ ${product.price.toFixed(2)}). Ainda está disponível?`);

  const modal = document.createElement('div');
  modal.className = 'modal-overlay active';
  modal.id = 'product-detail-modal';

  modal.innerHTML = `
    <div class="modal-container">
      <button class="modal-close" id="modal-close-btn">&times;</button>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;" class="modal-content-grid">
        <!-- Image & Gallery Section -->
        <div style="display: flex; flex-direction: column; gap: 0.8rem;">
          <div style="position: relative; border-radius: var(--radius-md); overflow: hidden; background: #F2EFE9; aspect-ratio: 3/4;">
            <img id="modal-main-img" src="${galleryImages[0]}" alt="${product.title}" style="width:100%; height:100%; object-fit:cover; transition: opacity 0.3s ease;">
            <span class="badge-curated" style="position: absolute; top:12px; left:12px;">${product.badge}</span>
          </div>

          ${galleryImages.length > 1 ? `
            <div class="modal-gallery-thumbs" style="display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 0.3rem;">
              ${galleryImages.map((imgUrl, i) => `
                <img 
                  src="${imgUrl}" 
                  class="modal-thumb ${i === 0 ? 'active' : ''}" 
                  data-src="${imgUrl}"
                  alt="Vista ${i + 1}"
                  style="width: 60px; height: 75px; object-fit: cover; border-radius: var(--radius-sm); cursor: pointer; border: 2px solid ${i === 0 ? 'var(--c-pink-dark)' : 'transparent'};"
                />
              `).join('')}
            </div>
          ` : ''}
        </div>

        <!-- Info & Actions Section -->
        <div style="display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="font-size: 0.85rem; color: var(--c-text-light); text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.3rem;">
              Marca: ${product.brand}
            </div>
            <h2 style="font-size: 1.7rem; margin-bottom: 0.8rem; font-family: var(--font-body); font-weight: 700;">${product.title}</h2>
            
            <div style="display: flex; align-items: baseline; gap: 0.8rem; margin-bottom: 1rem;">
              <span style="font-size: 1.6rem; font-weight: 700; color: var(--c-text-main);">
                R$ ${product.price.toFixed(2).replace('.', ',')}
              </span>
              ${product.originalPrice ? `<span style="font-size: 1rem; color: var(--c-text-light); text-decoration: line-through;">R$ ${product.originalPrice.toFixed(2).replace('.', ',')}</span>` : ''}
              <span class="badge-size" style="font-size: 0.85rem; padding: 0.2rem 0.6rem;">Tamanho: ${product.size}</span>
            </div>

            <div style="background: var(--bg-base); border: 1px solid var(--c-mint); padding: 0.75rem 1rem; border-radius: var(--radius-md); margin-bottom: 1rem; font-size: 0.88rem;">
              <strong>Estado de Conservação:</strong> ${product.condition}
            </div>

            ${measurementsHTML ? `
              <div style="background: var(--c-peach-light); border: 1px solid var(--c-peach-dark); padding: 0.75rem 1rem; border-radius: var(--radius-md); margin-bottom: 1rem;">
                <div style="font-size: 0.82rem; font-weight: 700; color: var(--c-text-main); margin-bottom: 0.3rem;">📐 Medidas Reais da Peça (cm):</div>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; font-size: 0.84rem;">
                  ${measurementsHTML}
                </div>
              </div>
            ` : ''}

            <p style="font-size: 0.92rem; color: var(--c-text-muted); line-height: 1.55; margin-bottom: 1.2rem;">
              ${product.description}
            </p>

            <div style="display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.83rem; color: var(--c-text-muted); margin-bottom: 1.2rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span>✨</span> Peça única higienizada a vapor a 120°C
              </div>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span>📦</span> Envio sustentável em embalagem biodegradável
              </div>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span>🔄</span> Devolução garantida em até 7 dias grátis
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div style="display: flex; flex-direction: column; gap: 0.6rem;">
            <div style="display: flex; gap: 0.8rem;">
              <button id="modal-add-cart-btn" class="btn btn-primary" style="flex-grow: 1; padding: 0.85rem; font-size: 0.95rem;">
                🛒 Adicionar ao Carrinho
              </button>
              <button id="modal-fav-btn" class="btn-icon" style="width: 48px; height: 48px; border-color: var(--c-pink);" title="Salvar nos Favoritos">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="${isFav ? '#E05252' : 'none'}" stroke="${isFav ? '#E05252' : 'currentColor'}" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              </button>
            </div>

            <a 
              href="https://wa.me/5511999998888?text=${waMessage}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="btn btn-secondary" 
              style="width: 100%; text-align: center; justify-content: center; font-size: 0.9rem; padding: 0.65rem;"
            >
              💬 Tirar Dúvida / Comprar no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Thumbnail switching logic
  const mainImg = modal.querySelector('#modal-main-img');
  const thumbs = modal.querySelectorAll('.modal-thumb');
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.style.borderColor = 'transparent');
      thumb.style.borderColor = 'var(--c-pink-dark)';
      if (mainImg) mainImg.src = thumb.getAttribute('data-src');
    });
  });

  const closeBtn = modal.querySelector('#modal-close-btn');
  closeBtn.addEventListener('click', () => modal.remove());

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });

  const addBtn = modal.querySelector('#modal-add-cart-btn');
  addBtn.addEventListener('click', () => {
    addToCart(product);
    modal.remove();
  });

  const favBtn = modal.querySelector('#modal-fav-btn');
  favBtn.addEventListener('click', () => {
    toggleFavorite(product);
    const updatedFavs = getFavorites();
    const nowFav = updatedFavs.some(item => item.id === product.id);
    favBtn.querySelector('svg').setAttribute('fill', nowFav ? '#E05252' : 'none');
    favBtn.querySelector('svg').setAttribute('stroke', nowFav ? '#E05252' : 'currentColor');
  });
}
