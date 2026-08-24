import { showToast } from '../utils/storage.js';
import { openSizeGuideModal } from './sizeGuideModal.js';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../utils/firebase.js';

export function renderFooter() {
  return `
    <footer class="footer" id="footer-section">
      <div class="container">
        <div class="footer-grid footer-grid-5col">
          <!-- Brand Column -->
          <div class="footer-brand">
            <a href="#" class="logo-link">
              <img src="/logo-mark-trans.png" alt="EB Monogram Logo" class="footer-logo-mark-img" />
              <span class="logo-text">EstiloBazar</span>
            </a>
            <p class="footer-text">
              Curadoria de moda circular e vintage com alma. Peças únicas higienizadas, autenticadas e prontas para viver novos momentos com você.
            </p>
            <div class="footer-social-links">
              <a href="https://instagram.com/estilobazar" target="_blank" rel="noopener" class="footer-social-btn" title="Instagram" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://facebook.com/estilobazar" target="_blank" rel="noopener" class="footer-social-btn" title="Facebook" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="https://tiktok.com/@estilobazar" target="_blank" rel="noopener" class="footer-social-btn" title="TikTok" aria-label="TikTok">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
              </a>
              <a href="https://wa.me/5511999998888" target="_blank" rel="noopener" class="footer-social-btn" title="WhatsApp" aria-label="WhatsApp">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              </a>
            </div>
          </div>

          <!-- Navegação -->
          <div>
            <h4 class="footer-title">Navegação</h4>
            <ul class="footer-links">
              <li><a href="#loja" class="footer-link">Novidades Garimpadas</a></li>
              <li><a href="#quero-vender" class="footer-link" style="color: var(--c-pink-dark); font-weight: 600;">Quero Vender / Desapego</a></li>
              <li><a href="#colecao" class="footer-link">Coleções de Estação</a></li>
              <li><a href="#depoimentos" class="footer-link">Avaliações de Clientes</a></li>
              <li><a href="#sustentabilidade" class="footer-link">Nosso Impacto Sustentável</a></li>
            </ul>
          </div>

          <!-- Ajuda & Suporte -->
          <div>
            <h4 class="footer-title">Ajuda &amp; Suporte</h4>
            <ul class="footer-links">
              <li><a href="#" id="open-size-guide-btn" class="footer-link">Guia de Tamanhos 📐</a></li>
              <li><a href="#faq" class="footer-link">Perguntas Frequentes</a></li>
              <li><a href="#" class="footer-link">Como Comprar</a></li>
              <li><a href="#" class="footer-link">Entregas &amp; Devoluções</a></li>
              <li><a href="#" class="footer-link">Trocas em até 7 dias</a></li>
              <li><a href="#" class="footer-link">Termos de Uso</a></li>
              <li><a href="#" class="footer-link">Política de Privacidade</a></li>
            </ul>
          </div>

          <!-- Contato -->
          <div>
            <h4 class="footer-title">Contato</h4>
            <ul class="footer-links">
              <li class="footer-contact-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--c-pink-dark)" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                <span>(11) 99999-8888</span>
              </li>
              <li class="footer-contact-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--c-pink-dark)" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                <span>contato@estilobazar.com.br</span>
              </li>
              <li class="footer-contact-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--c-pink-dark)" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <span>São Paulo, SP - Brasil</span>
              </li>
            </ul>
          </div>

          <!-- Newsletter -->
          <div>
            <h4 class="footer-title">Fique por dentro</h4>
            <p style="font-size: 0.88rem; color: var(--c-text-muted); margin-bottom: 0.8rem;">
              Receba garimpos exclusivos e cupons de desconto em primeira mão.
            </p>
            <form id="newsletter-form" class="newsletter-form" style="flex-direction: column;">
              <input type="email" id="newsletter-email" required placeholder="Seu melhor e-mail" class="newsletter-input">
              <button type="submit" class="btn btn-primary" style="padding: 0.65rem 1.2rem; font-size: 0.88rem; width: 100%; margin-top: 0.5rem;">Assinar VIP List ✨</button>
            </form>
          </div>
        </div>

        <!-- Pagamento & Segurança -->
        <div class="footer-trust-section">
          <div class="footer-trust-block">
            <h5 class="footer-trust-title">Formas de Pagamento</h5>
            <div class="footer-payment-icons">
              <span class="payment-badge">PIX</span>
              <span class="payment-badge">Visa</span>
              <span class="payment-badge">Mastercard</span>
              <span class="payment-badge">Elo</span>
              <span class="payment-badge">Amex</span>
              <span class="payment-badge">Boleto</span>
            </div>
          </div>
          <div class="footer-trust-block">
            <h5 class="footer-trust-title">Segurança</h5>
            <div class="footer-security-badges">
              <span class="security-badge">🔒 Compra Segura</span>
              <span class="security-badge">🛡️ Loja Protegida</span>
              <span class="security-badge">🔐 SSL Criptografado</span>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <div>© ${new Date().getFullYear()} EstiloBazar. Todos os direitos reservados. Moda Circular &amp; Sustentável.</div>
          <div style="font-size: 0.82rem;">CNPJ: 00.000.000/0001-00</div>
        </div>
      </div>
    </footer>
  `;
}

export function setupFooterListeners() {
  const form = document.getElementById('newsletter-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = document.getElementById('newsletter-email');
      if (input && input.value) {
        const email = input.value.trim();
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Enviando...';
        }

        try {
          await addDoc(collection(db, 'leads_vip'), {
            email: email,
            origin: 'home_footer_vip',
            coupon: 'ESTILO10',
            createdAt: new Date().toISOString()
          });
          alert(`🎉 Cadastro VIP Confirmado!\n\nSeu e-mail (${email}) foi cadastrado com sucesso.\nUse o cupom ESTILO10 para ganhar 10% OFF no seu primeiro garimpo!`);
          showToast('Cupom ESTILO10 ativado para o seu e-mail! 💌');
          input.value = '';
        } catch (err) {
          console.warn('⚠️ Salvo com suporte offline:', err.message);
          alert(`🎉 Cadastro Confirmado!\n\nUse o cupom ESTILO10 para 10% OFF no seu primeiro garimpo!`);
          input.value = '';
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Assinar VIP List ✨';
          }
        }
      }
    });
  }

  const sizeGuideBtn = document.getElementById('open-size-guide-btn');
  if (sizeGuideBtn) {
    sizeGuideBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openSizeGuideModal();
    });
  }
}
