import { recentPurchases } from '../data/products.js';

export function renderSocialProofContainer() {
  return `<div id="social-proof-toast" class="social-proof-toast" aria-live="polite"></div>`;
}

export function setupSocialProofListeners() {
  const container = document.getElementById('social-proof-toast');
  if (!container) return;

  let currentIndex = 0;

  function showNextNotification() {
    const item = recentPurchases[currentIndex];
    container.innerHTML = `
      <div class="social-proof-card glass-panel">
        <span class="social-proof-avatar">${item.avatar}</span>
        <div class="social-proof-info">
          <div class="social-proof-header">
            <strong>${item.name}</strong> (${item.city})
          </div>
          <div class="social-proof-text">
            Garimpou <strong>${item.item}</strong>
          </div>
          <div class="social-proof-time">${item.time} • Compra Verificada 🛍️</div>
        </div>
        <button class="social-proof-close" onclick="this.parentElement.parentElement.classList.remove('active')">&times;</button>
      </div>
    `;

    container.classList.add('active');

    setTimeout(() => {
      container.classList.remove('active');
    }, 4500);

    currentIndex = (currentIndex + 1) % recentPurchases.length;
  }

  // Initial delay 4s, then repeat every 14s
  setTimeout(() => {
    showNextNotification();
    setInterval(showNextNotification, 14000);
  }, 4000);
}
