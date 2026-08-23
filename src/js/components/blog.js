import { blogPosts } from '../data/products.js';
import { showToast } from '../utils/storage.js';

export function renderBlogSection() {
  return `
    <section class="blog-section" id="blog" style="padding: 4rem 0; background: var(--bg-surface-translucent);">
      <div class="container">
        <div style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 2.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <span class="badge-curated" style="margin-bottom: 0.4rem;">Dicas de Estilo &amp; Cuidados</span>
            <h2 class="title-section">Blog EstiloBazar</h2>
          </div>
          <a href="#blog" class="btn btn-outline" style="font-size: 0.88rem;">Ver Todos os Artigos →</a>
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.8rem;" class="blog-grid">
          ${blogPosts.map(post => `
            <article class="glass-panel" style="overflow: hidden; display: flex; flex-direction: column; cursor: pointer;" class="blog-card" data-id="${post.id}">
              <div style="position: relative; height: 190px; overflow: hidden;">
                <img src="${post.image}" alt="${post.title}" style="width:100%; height:100%; object-fit:cover; transition: transform 0.4s ease;" class="blog-img">
                <span class="badge-curated" style="position: absolute; top:12px; left:12px; background: rgba(255,255,255,0.9);">${post.category}</span>
              </div>

              <div style="padding: 1.4rem; display: flex; flex-direction: column; flex-grow: 1;">
                <div style="font-size: 0.78rem; color: var(--c-text-light); margin-bottom: 0.5rem;">
                  ${post.date} • ${post.readTime}
                </div>
                <h3 style="font-size: 1.1rem; font-family: var(--font-body); font-weight: 700; margin-bottom: 0.6rem; line-height: 1.35;">${post.title}</h3>
                <p style="font-size: 0.88rem; color: var(--c-text-muted); line-height: 1.5; margin-bottom: 1.2rem; flex-grow: 1;">
                  ${post.summary}
                </p>
                <span style="font-size: 0.85rem; font-weight: 600; color: var(--c-pink-dark); display: inline-flex; align-items: center; gap: 0.3rem;">
                  Ler Artigo Completo →
                </span>
              </div>
            </article>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

export function setupBlogListeners() {
  document.querySelectorAll('.blog-card').forEach(card => {
    card.addEventListener('click', () => {
      showToast('Artigo do blog em breve disponível na versão completa! 📖');
    });
  });
}
