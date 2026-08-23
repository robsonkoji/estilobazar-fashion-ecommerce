export function openSizeGuideModal() {
  const existing = document.getElementById('size-guide-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.className = 'modal-overlay active';
  modal.id = 'size-guide-modal';

  modal.innerHTML = `
    <div class="modal-container" style="max-width: 680px; padding: 2.2rem;">
      <button class="modal-close" id="size-guide-close-btn">&times;</button>
      
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <span class="badge-curated" style="margin-bottom: 0.4rem;">Tabela de Medidas</span>
        <h2 style="font-size: 1.6rem; font-weight: 700;">Guia de Tamanhos EstiloBazar</h2>
        <p style="font-size: 0.9rem; color: var(--c-text-muted);">Como cada peça vintage é única, meça seu corpo e compare com nossa tabela:</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; font-size: 0.9rem; text-align: center;">
        <thead>
          <tr style="background: var(--c-pink-light); border-bottom: 1.5px solid var(--c-pink);">
            <th style="padding: 0.75rem;">Tamanho</th>
            <th style="padding: 0.75rem;">Busto (cm)</th>
            <th style="padding: 0.75rem;">Cintura (cm)</th>
            <th style="padding: 0.75rem;">Quadril (cm)</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid var(--c-mint);">
            <td style="padding: 0.6rem; font-weight: 700;">PP (34)</td>
            <td>80 - 84</td>
            <td>62 - 66</td>
            <td>88 - 92</td>
          </tr>
          <tr style="border-bottom: 1px solid var(--c-mint);">
            <td style="padding: 0.6rem; font-weight: 700;">P (36-38)</td>
            <td>85 - 90</td>
            <td>67 - 72</td>
            <td>93 - 98</td>
          </tr>
          <tr style="border-bottom: 1px solid var(--c-mint);">
            <td style="padding: 0.6rem; font-weight: 700;">M (40-42)</td>
            <td>91 - 96</td>
            <td>73 - 78</td>
            <td>99 - 104</td>
          </tr>
          <tr style="border-bottom: 1px solid var(--c-mint);">
            <td style="padding: 0.6rem; font-weight: 700;">G (44-46)</td>
            <td>97 - 104</td>
            <td>79 - 86</td>
            <td>105 - 112</td>
          </tr>
          <tr>
            <td style="padding: 0.6rem; font-weight: 700;">GG (48+)</td>
            <td>105 - 112</td>
            <td>87 - 94</td>
            <td>113 - 120</td>
          </tr>
        </tbody>
      </table>

      <div style="background: var(--bg-base); border: 1px solid var(--c-mint); padding: 1rem; border-radius: var(--radius-md); font-size: 0.85rem; color: var(--c-text-muted);">
        💡 <strong>Dica de Garimpo:</strong> Na descrição de cada produto em nosso site, informamos a medida exata em centímetros da peça esticada em superfície plana.
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const closeBtn = modal.querySelector('#size-guide-close-btn');
  closeBtn.addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}
