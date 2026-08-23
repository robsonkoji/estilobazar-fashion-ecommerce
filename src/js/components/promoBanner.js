import { showToast } from '../utils/storage.js';

export function renderPromoBanner() {
  return `
    <section class="promo-banner-section" id="promo-banner">
      <div class="container">
        <div class="promo-banner-card glass-panel">
          <div class="promo-banner-content">
            <div class="promo-badge">🎁 Presente de Boas-Vindas</div>
            <h3 class="promo-title">Ganhe 10% OFF no seu Primeiro Garimpo!</h3>
            <p class="promo-text">Use o cupom exclusivo e aproveite frete grátis acima de R$ 250 para renovar seu guarda-roupa com estilo consciente.</p>
          </div>

          <div class="promo-actions">
            <div class="promo-timer-wrap">
              <span class="promo-timer-label">Oferta expira em:</span>
              <div class="promo-timer-box" id="promo-countdown">04:32:15</div>
            </div>

            <div class="coupon-box">
              <span class="coupon-code" id="coupon-code-text">PRIMEIRACOMPRA10</span>
              <button class="btn btn-primary btn-copy-coupon" id="copy-coupon-btn">
                📋 Copiar Cupom
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function setupPromoBannerListeners() {
  const copyBtn = document.getElementById('copy-coupon-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('PRIMEIRACOMPRA10').then(() => {
        showToast('Cupom PRIMEIRACOMPRA10 copiado com sucesso! 🎉');
        copyBtn.textContent = '✓ Copiado!';
        setTimeout(() => copyBtn.textContent = '📋 Copiar Cupom', 3000);
      }).catch(() => {
        showToast('Use o cupom: PRIMEIRACOMPRA10 no checkout! ✨');
      });
    });
  }

  // Countdown timer logic
  const timerBox = document.getElementById('promo-countdown');
  if (timerBox) {
    let totalSeconds = 4 * 3600 + 32 * 60 + 15; // 4h 32m 15s

    setInterval(() => {
      if (totalSeconds <= 0) return;
      totalSeconds--;
      const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
      const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
      const secs = String(totalSeconds % 60).padStart(2, '0');
      timerBox.textContent = `${hrs}:${mins}:${secs}`;
    }, 1000);
  }
}
