export function renderBanners() {
  return `
    <section class="banner-section" id="colecao">
      <div class="container">
        <div class="banner-grid">
          <div class="collection-banner">
            <img 
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80" 
              alt="Coleção Primavera EstiloBazar" 
              class="collection-banner-bg"
            />
            <div class="collection-banner-overlay"></div>
            <div class="collection-banner-content">
              <span class="badge-curated" style="margin-bottom: 0.8rem; background: var(--c-pink-light); border-color: var(--c-pink);">Lançamento da Estação</span>
              <h2 class="collection-banner-title">Coleção Primavera</h2>
              <p class="collection-banner-text">Peças leves, autênticas e cheias de vida. Explore o frescor da estação com curadoria responsável.</p>
              <a href="#loja" class="btn btn-secondary" style="font-size: 0.9rem; padding: 0.6rem 1.4rem;">Explore a Coleção →</a>
            </div>
          </div>

          <div class="glass-panel" style="padding: 2rem; display: flex; flex-direction: column; justify-content: center; background: linear-gradient(135deg, rgba(255,244,236,0.9), rgba(240,248,241,0.9));">
            <span class="badge-curated" style="margin-bottom: 0.6rem; width: fit-content;">Garantia de Qualidade</span>
            <h3 style="font-size: 1.35rem; margin-bottom: 0.5rem; font-family: var(--font-heading);">Curadoria 100% Autenticada</h3>
            <p style="font-size: 0.88rem; color: var(--c-text-muted); margin-bottom: 1.2rem;">Cada peça passa por higienização profissional a vapor, avaliação de tecido e restauro artesanal antes de ir para a loja.</p>
            <div style="display: flex; align-items: center; gap: 0.8rem;">
              <span style="font-size: 1.5rem;">🌿</span>
              <span style="font-size: 0.85rem; font-weight: 600;">Moda Consciente &amp; Economia Circular</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
