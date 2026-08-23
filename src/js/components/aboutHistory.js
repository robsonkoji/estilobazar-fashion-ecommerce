export function renderAboutHistorySection() {
  const milestones = [
    { year: "2021", title: "O Início do Garimpo", desc: "Nascemos como um acervo artesanal de pechinchas e relíquias vintage selecionadas a dedo em São Paulo." },
    { year: "2023", title: "Higienização & Curadoria 100% Ecológica", desc: "Implantamos o protocolo de higienização hospitalar a vapor a 120°C e embalagens biodegradáveis." },
    { year: "2024", title: "+15.000 Peças Embaladas com Amor", desc: "Alcançamos a marca de mais de 15 mil roupas reaproveitadas e mais de 40 milhões de litros de água economizados." },
    { year: "2026", title: "Referência Nacional em Moda Circular", desc: "Lançamento da plataforma digital com pagamento instantâneo via PIX e atendimento humano humanizado." }
  ];

  return `
    <section class="about-history-section" id="sobre">
      <div class="container">
        <div style="text-align: center; max-width: 680px; margin: 0 auto 3rem auto;">
          <span class="badge-curated" style="margin-bottom: 0.5rem; background: var(--c-mint-light); border-color: var(--c-mint);">Nossa Trajetória</span>
          <h2 class="title-section">De Garimpo Pessoal a Referência de Estilo</h2>
          <p style="font-size: 1rem; color: var(--c-text-muted);">
            Cada peça do nosso acervo passa por mãos cuidadosas antes de chegar ao seu armário. Conheça nossa história.
          </p>
        </div>

        <div class="history-timeline">
          ${milestones.map((m, index) => `
            <div class="history-card glass-panel">
              <div class="history-year">${m.year}</div>
              <h3 class="history-title">${m.title}</h3>
              <p class="history-desc">${m.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}
