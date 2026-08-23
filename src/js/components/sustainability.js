export function renderSustainabilitySection() {
  return `
    <section class="sustainability-banner" id="sustentabilidade">
      <div class="container" style="max-width: 960px;">
        <span class="badge-curated" style="margin-bottom: 0.6rem;">Nosso Impacto Sustentável</span>
        <h2 class="title-section" style="margin-bottom: 1rem;">O Poder da Moda Circular</h2>
        <p style="font-size: 1.05rem; color: var(--c-text-muted); max-width: 680px; margin: 0 auto 2rem auto; line-height: 1.6;">
          Ao escolher uma peça de brechó em vez de um item novo de fast fashion, você reduz o consumo de água, evita emissões de CO₂ e dá vida nova a roupas cheias de história.
        </p>

        <div class="sustainability-stats">
          <div class="stat-card">
            <div class="stat-number">2.700L</div>
            <div class="stat-label">De água economizada a cada peça garimpada</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">85%</div>
            <div class="stat-label">Menos pegada de carbono por roupa reaproveitada</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">100%</div>
            <div class="stat-label">Embalagens biodegradáveis &amp; envio neutro em carbono</div>
          </div>
        </div>
      </div>
    </section>
  `;
}
