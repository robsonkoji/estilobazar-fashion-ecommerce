import { testimonials } from '../data/products.js';

export function renderTestimonialsSection() {
  return `
    <section class="testimonials-section" id="depoimentos" style="padding: 4rem 0;">
      <div class="container">
        <div style="text-align: center; max-width: 680px; margin: 0 auto 3rem auto;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 0.3rem; color: #F5B588; font-size: 1.3rem; margin-bottom: 0.5rem;">
            ★★★★★ <span style="font-size: 0.9rem; font-weight: 700; color: var(--c-text-main); margin-left: 0.4rem;">4.9 / 5.0 (Mais de 1.200 clientes felizes)</span>
          </div>
          <h2 class="title-section" style="margin-bottom: 0.6rem;">O Que Dizem Sobre o EstiloBazar</h2>
          <p style="font-size: 0.98rem; color: var(--c-text-muted);">
            Depoimentos reais de quem compra garimpos ou desapega com a nossa curadoria.
          </p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.8rem;" class="testimonials-grid">
          ${testimonials.map(t => `
            <div class="glass-panel" style="padding: 1.8rem; display: flex; flex-direction: column; justify-content: space-between;">
              <div style="margin-bottom: 1rem;">
                <div style="color: #F5B588; margin-bottom: 0.8rem; font-size: 1.1rem;">★★★★★</div>
                <p style="font-size: 0.92rem; color: var(--c-text-main); line-height: 1.6; font-style: italic;">
                  "${t.comment}"
                </p>
              </div>

              <div style="display: flex; align-items: center; gap: 0.9rem; border-top: 1px dashed rgba(196,230,197,0.6); padding-top: 1rem;">
                <img src="${t.avatar}" alt="${t.name}" style="width: 46px; height: 46px; border-radius: 50%; object-fit: cover; border: 1.5px solid var(--c-pink);">
                <div>
                  <div style="font-weight: 700; font-size: 0.95rem;">${t.name}</div>
                  <div style="font-size: 0.78rem; color: var(--c-text-muted);">${t.city} • <span style="color: var(--c-mint-dark); font-weight: 600;">${t.role}</span></div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}
