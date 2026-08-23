export function renderHero() {
  return `
    <section class="hero" id="hero-section">
      <div class="container">
        <div class="hero-grid">
          <div class="hero-card-left">
            <h1 class="hero-title title-display">Sustentabilidade com Estilo Único</h1>
            <p class="hero-subtitle">
              Descubra curadorias exclusivas de moda second-hand para o seu dia a dia. Peças únicas que contam histórias.
            </p>
            <div>
              <a href="#loja" class="btn btn-primary" id="hero-cta-btn">
                Ver Novidades
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </a>
            </div>
          </div>

          <div class="hero-card-right">
            <img 
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80" 
              alt="Moda Sustentável EstiloBazar" 
              class="hero-img" 
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  `;
}
