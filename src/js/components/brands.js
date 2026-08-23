export function renderBrandsSection() {
  const brands = [
    'Zara', 'Farm', 'Arezzo', 'Animale', 'Osklen', "Levi's",
    'Nike', 'Adidas', 'Colcci', 'Morena Rosa', 'Canal Concept', 'Le Lis Blanc'
  ];

  const separator = `<span class="brands-sep" aria-hidden="true">✦</span>`;

  // Duplicate for seamless loop
  const brandItems = brands
    .map(b => `<span class="brands-name">${b}</span>${separator}`)
    .join('');

  return `
    <section class="brands-bar" id="brands-bar" aria-label="Marcas parceiras">
      <div class="brands-track">
        <div class="brands-scroll" aria-hidden="true">
          ${brandItems}
        </div>
        <div class="brands-scroll" aria-hidden="true">
          ${brandItems}
        </div>
      </div>
    </section>
  `;
}
