import { instagramPosts } from '../data/products.js';

export function renderInstagramSection() {
  return `
    <section class="instagram-section" style="padding: 3rem 0; background: var(--c-pink-light);">
      <div class="container">
        <div style="text-align: center; margin-bottom: 2rem;">
          <span class="badge-curated" style="margin-bottom: 0.4rem; background: var(--bg-surface);">#EstiloBazar no Instagram</span>
          <h2 class="title-section" style="margin-bottom: 0.5rem;">Garimpeiros da Nossa Comunidade</h2>
          <p style="font-size: 0.95rem; color: var(--c-text-muted); max-width: 580px; margin: 0 auto;">
            Marque @estilobazar e apareça na nossa galeria de looks garimpados!
          </p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.2rem;" class="instagram-grid">
          ${instagramPosts.map(post => `
            <div style="position: relative; border-radius: var(--radius-md); overflow: hidden; aspect-ratio: 1; border: var(--glass-border);" class="insta-card">
              <img src="${post.image}" alt="${post.handle}" style="width:100%; height:100%; object-fit:cover;">
              <div style="position: absolute; inset: 0; background: rgba(0,0,0,0.35); opacity: 0; transition: opacity 0.3s ease; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; padding: 1rem; text-align: center;" class="insta-overlay">
                <span style="font-weight: 700; font-size: 1rem;">${post.handle}</span>
                <span style="font-size: 0.82rem; margin-top: 0.3rem;">❤️ ${post.likes} curtidas</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}
