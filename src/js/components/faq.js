import { faqItems } from '../data/products.js';

export function renderFaqSection() {
  return `
    <section class="faq-section" id="faq" style="padding: 4rem 0;">
      <div class="container" style="max-width: 860px;">
        <div style="text-align: center; margin-bottom: 3rem;">
          <span class="badge-curated" style="margin-bottom: 0.5rem;">Tire Suas Dúvidas</span>
          <h2 class="title-section">Perguntas Frequentes (FAQ)</h2>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1rem;" id="faq-accordion">
          ${faqItems.map((item, index) => `
            <div class="glass-panel faq-item" style="overflow: hidden;">
              <button class="faq-trigger" style="width: 100%; padding: 1.2rem 1.5rem; text-align: left; font-weight: 700; font-size: 1.05rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem;">
                <span>${item.question}</span>
                <span class="faq-icon" style="font-size: 1.2rem; transition: transform 0.3s ease; color: var(--c-pink-dark);">+</span>
              </button>
              <div class="faq-content" style="max-height: 0; overflow: hidden; transition: max-height 0.35s ease, padding 0.35s ease; padding: 0 1.5rem;">
                <p style="font-size: 0.94rem; color: var(--c-text-muted); line-height: 1.6; padding-bottom: 1.2rem;">
                  ${item.answer}
                </p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

export function setupFaqListeners() {
  const triggers = document.querySelectorAll('.faq-trigger');
  triggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const content = item.querySelector('.faq-content');
      const icon = item.querySelector('.faq-icon');
      const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';

      // Fechar todos os outros
      document.querySelectorAll('.faq-content').forEach(c => c.style.maxHeight = '0px');
      document.querySelectorAll('.faq-icon').forEach(i => {
        i.textContent = '+';
        i.style.transform = 'rotate(0deg)';
      });

      if (!isOpen) {
        content.style.maxHeight = content.scrollHeight + 'px';
        icon.textContent = '−';
        icon.style.transform = 'rotate(180deg)';
      }
    });
  });
}
