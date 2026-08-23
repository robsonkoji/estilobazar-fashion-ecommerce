import { db } from '../utils/firebase.js';
import { collection, addDoc } from 'firebase/firestore';

export function renderComingSoonPage() {
  return `
    <div class="coming-soon-standalone" style="min-height: 100vh; display: flex; flex-direction: column; justify-content: space-between; padding: 2rem 1.5rem; background: linear-gradient(135deg, #FAF9F6 0%, #FDF0F0 50%, #F0F8F1 100%); position: relative; overflow: hidden;">
      <!-- Ambient Blur Orbs -->
      <div style="position: absolute; top: -120px; right: -120px; width: 420px; height: 420px; background: rgba(248, 194, 194, 0.45); filter: blur(90px); border-radius: 50%; pointer-events: none;"></div>
      <div style="position: absolute; bottom: -120px; left: -120px; width: 420px; height: 420px; background: rgba(196, 230, 197, 0.45); filter: blur(90px); border-radius: 50%; pointer-events: none;"></div>

      <!-- Header Minimalista (Apenas Brand Logo) -->
      <header style="text-align: center; padding-top: 1.5rem; position: relative; z-index: 2;">
        <div style="display: inline-flex; align-items: center; justify-content: center; gap: 0.8rem;">
          <img src="/logo-mark-trans.png" alt="EstiloBazar Monograma" style="height: 62px; width: auto;" />
          <span style="font-family: var(--font-heading); font-size: 2.2rem; font-weight: 700; color: var(--c-text-main); letter-spacing: -0.02em;">EstiloBazar</span>
        </div>
      </header>

      <!-- Conteúdo Principal Isolado -->
      <main style="max-width: 680px; width: 100%; margin: 2rem auto; text-align: center; position: relative; z-index: 2;">
        <div class="glass-panel" style="padding: 3rem 2.2rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); backdrop-filter: blur(20px); border: 1.5px solid var(--c-pink);">
          <span class="badge-curated" style="margin-bottom: 1.2rem; font-size: 0.82rem; padding: 0.4rem 1.1rem; background: var(--c-pink-light); color: var(--c-text-main);">
            ✨ Preparando Nosso Lançamento
          </span>
          
          <h1 class="title-display" style="font-size: clamp(2rem, 4.5vw, 2.9rem); margin-bottom: 1.1rem; line-height: 1.25; color: var(--c-text-main);">
            Em Breve Nosso Acervo Estará No Ar
          </h1>
          
          <p style="font-size: 1.05rem; color: var(--c-text-muted); max-width: 540px; margin: 0 auto 2.2rem; line-height: 1.65;">
            Estamos higienizando, fotografando e organizando peças garimpadas de marcas renomadas como <strong>Farm, Zara, Animale e Levi's</strong>.
          </p>

          <!-- Benefícios Rápido -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 0.9rem; margin-bottom: 2.5rem; text-align: left;">
            <div style="display: flex; align-items: center; gap: 0.6rem; background: rgba(255,255,255,0.75); padding: 0.8rem; border-radius: var(--radius-md); border: 1px solid var(--c-mint);">
              <span style="font-size: 1.3rem;">🌿</span>
              <div>
                <strong style="display: block; font-size: 0.82rem;">Moda Circular</strong>
                <span style="font-size: 0.74rem; color: var(--c-text-muted);">100% Higienizadas</span>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 0.6rem; background: rgba(255,255,255,0.75); padding: 0.8rem; border-radius: var(--radius-md); border: 1px solid var(--c-pink);">
              <span style="font-size: 1.3rem;">📦</span>
              <div>
                <strong style="display: block; font-size: 0.82rem;">Frete Grátis</strong>
                <span style="font-size: 0.74rem; color: var(--c-text-muted);">Acima de R$ 250</span>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 0.6rem; background: rgba(255,255,255,0.75); padding: 0.8rem; border-radius: var(--radius-md); border: 1px solid var(--c-peach-dark);">
              <span style="font-size: 1.3rem;">⚡</span>
              <div>
                <strong style="display: block; font-size: 0.82rem;">PIX com 5% OFF</strong>
                <span style="font-size: 0.74rem; color: var(--c-text-muted);">Ou até 6x no cartão</span>
              </div>
            </div>
          </div>

          <!-- Form de Captura VIP -->
          <div style="background: var(--c-pink-light); padding: 1.8rem 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--c-pink);">
            <h3 style="font-size: 1.15rem; font-family: var(--font-heading); margin-bottom: 0.4rem; color: var(--c-text-main);">
              🎁 Receba o Convite VIP &amp; 10% OFF no Lançamento
            </h3>
            <p style="font-size: 0.85rem; color: var(--c-text-muted); margin-bottom: 1.2rem;">
              Cadastre seu e-mail para ter acesso antecipado às peças assim que o site for ao ar.
            </p>

            <form id="coming-soon-form" style="display: flex; gap: 0.6rem; max-width: 460px; margin: 0 auto; flex-wrap: wrap;">
              <input 
                type="email" 
                id="coming-soon-email" 
                class="search-input" 
                placeholder="Seu melhor e-mail..." 
                style="flex: 1; min-width: 200px; background: white; border-radius: var(--radius-full); padding: 0.75rem 1.2rem; font-size: 0.9rem;"
                required
              />
              <button type="submit" id="coming-soon-submit" class="btn btn-primary" style="padding: 0.75rem 1.4rem; white-space: nowrap;">
                ✨ Quero Acesso VIP
              </button>
            </form>

            <div id="coming-soon-success" style="display: none; margin-top: 1rem; padding: 0.8rem; background: #C4E6C5; color: #1C2420; font-size: 0.88rem; font-weight: 600; border-radius: var(--radius-sm);">
              🎉 Excelente! Seu e-mail foi cadastrado na lista VIP do EstiloBazar.
            </div>
          </div>

          <!-- Redes Sociais sem links admin à vista -->
          <div style="margin-top: 2rem; display: flex; align-items: center; justify-content: center; gap: 1.2rem; flex-wrap: wrap; font-size: 0.85rem; color: var(--c-text-muted);">
            <a href="mailto:contato@estilobazar.com.br" style="display: flex; align-items: center; gap: 0.4rem; text-decoration: none; color: var(--c-text-muted);">
              ✉️ contato@estilobazar.com.br
            </a>
            <span>•</span>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; gap: 0.4rem; text-decoration: none; color: var(--c-text-muted);">
              📸 @estilobazar
            </a>
          </div>
        </div>
      </main>

      <!-- Footer Minimalista sem nada do e-commerce -->
      <footer style="text-align: center; padding-bottom: 1.5rem; font-size: 0.8rem; color: var(--c-text-light); position: relative; z-index: 2;">
        © 2026 EstiloBazar. Todos os direitos reservados.
      </footer>
    </div>
  `;
}

export function setupComingSoonListeners() {
  const form = document.getElementById('coming-soon-form');
  const emailInput = document.getElementById('coming-soon-email');
  const submitBtn = document.getElementById('coming-soon-submit');
  const successEl = document.getElementById('coming-soon-success');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    if (!email) return;

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';
    }

    try {
      await addDoc(collection(db, 'leads_vip'), {
        email,
        subscribedAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Salvo localmente:', err.message);
      const leads = JSON.parse(localStorage.getItem('estilobazar_leads') || '[]');
      leads.push({ email, subscribedAt: new Date().toISOString() });
      localStorage.setItem('estilobazar_leads', JSON.stringify(leads));
    }

    if (form) form.style.display = 'none';
    if (successEl) successEl.style.display = 'block';
  });
}
