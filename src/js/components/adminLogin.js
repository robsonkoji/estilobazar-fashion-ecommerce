import { loginAdmin } from '../utils/auth.js';

export function renderAdminLogin() {
  return `
    <section class="admin-login-section container" style="padding: 4rem 1.5rem; display: flex; justify-content: center;">
      <div class="glass-panel admin-login-card" style="max-width: 440px; width: 100%; padding: 2.5rem 2rem; border-radius: var(--radius-lg);">
        <div style="text-align: center; margin-bottom: 2rem;">
          <div style="display: inline-flex; align-items: center; justify-content: center; width: 64px; height: 64px; background: var(--c-pink-light); border-radius: var(--radius-full); margin-bottom: 1rem;">
            <img src="/logo-mark-trans.png" alt="EstiloBazar Logo" style="height: 38px; width: auto;" />
          </div>
          <h2 class="title-section" style="font-size: 1.8rem; margin-bottom: 0.3rem;">Painel Admin</h2>
          <p style="font-size: 0.88rem; color: var(--c-text-muted);">
            Acesso exclusivo para gestão do catálogo EstiloBazar
          </p>
        </div>

        <form id="admin-login-form">
          <div style="margin-bottom: 1.2rem;">
            <label for="admin-email" style="display: block; font-size: 0.82rem; font-weight: 700; color: var(--c-text-muted); margin-bottom: 0.4rem;">
              E-mail Administrativo
            </label>
            <input 
              type="email" 
              id="admin-email" 
              class="search-input" 
              style="width: 100%; border-radius: var(--radius-md);" 
              placeholder="ex: contato@estilobazar.com.br"
              required 
            />
          </div>

          <div style="margin-bottom: 1.5rem;">
            <label for="admin-password" style="display: block; font-size: 0.82rem; font-weight: 700; color: var(--c-text-muted); margin-bottom: 0.4rem;">
              Senha de Acesso
            </label>
            <input 
              type="password" 
              id="admin-password" 
              class="search-input" 
              style="width: 100%; border-radius: var(--radius-md);" 
              placeholder="••••••••"
              required 
            />
          </div>

          <div id="admin-login-error" style="display: none; background: rgba(224, 82, 82, 0.1); border: 1px solid #E05252; color: #C62828; padding: 0.7rem; border-radius: var(--radius-sm); font-size: 0.85rem; margin-bottom: 1.2rem; text-align: center;">
          </div>

          <button type="submit" id="admin-login-submit" class="btn btn-primary" style="width: 100%; padding: 0.85rem;">
            🔐 Entrar no Painel
          </button>
        </form>
      </div>
    </section>
  `;
}

export function setupAdminLoginListeners(onLoginSuccess) {
  const form = document.getElementById('admin-login-form');
  const errorEl = document.getElementById('admin-login-error');
  const submitBtn = document.getElementById('admin-login-submit');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('admin-email').value.trim();
    const password = document.getElementById('admin-password').value;

    if (errorEl) errorEl.style.display = 'none';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Autenticando...';
    }

    const result = await loginAdmin(email, password);

    if (result.success) {
      if (onLoginSuccess) onLoginSuccess();
    } else {
      if (errorEl) {
        errorEl.textContent = result.error;
        errorEl.style.display = 'block';
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = '🔐 Entrar no Painel';
      }
    }
  });
}
