import '../css/variables.css';
import '../css/global.css';
import '../css/components.css';
import '../css/layout.css';

import { setupRouter, navigateTo } from './utils/router.js';
import { renderHeader, setupHeaderListeners } from './components/header.js';
import { renderPoliciesBar } from './components/policies.js';
import { renderHero } from './components/hero.js';
import { renderPromoBanner, setupPromoBannerListeners } from './components/promoBanner.js';
import { renderHighlightsSection, setupHighlightsListeners } from './components/highlights.js';
import { renderBrandsSection } from './components/brands.js';
import { renderBanners } from './components/banners.js';
import { renderCatalog, updateCatalogGrid, setupCatalogListeners } from './components/catalog.js';
import { renderConsignSection, setupConsignListeners } from './components/consign.js';
import { renderAboutHistorySection } from './components/aboutHistory.js';
import { renderTestimonialsSection } from './components/testimonials.js';
import { renderBlogSection, setupBlogListeners } from './components/blog.js';
import { renderFaqSection, setupFaqListeners } from './components/faq.js';
import { renderInstagramSection } from './components/instagram.js';
import { renderSustainabilitySection } from './components/sustainability.js';
import { renderFooter, setupFooterListeners } from './components/footer.js';
import { renderDrawers, setupDrawerListeners, updateCartDrawer, updateFavDrawer } from './components/cart.js';
import { renderWhatsAppButton } from './components/whatsapp.js';
import { renderSocialProofContainer, setupSocialProofListeners } from './components/socialProof.js';
import { openOrdersModal } from './components/ordersModal.js';

// Admin & Coming Soon Components
import { isAuthenticated } from './utils/auth.js';
import { renderAdminLogin, setupAdminLoginListeners } from './components/adminLogin.js';
import { renderAdminPanel, setupAdminPanelListeners } from './components/adminPanel.js';
import { renderComingSoonPage, setupComingSoonListeners } from './components/comingSoon.js';

// Flag de Modo de Manutenção / Em Breve (defina como false para lançar publicamente!)
const IS_COMING_SOON_MODE = true;

function isPreviewActive() {
  return sessionStorage.getItem('estilobazar_preview_mode') === 'true';
}

function renderBreadcrumb(pathText) {
  return `
    <div class="breadcrumb-container container" style="padding-top: 1.2rem; padding-bottom: 0.5rem;">
      <nav class="breadcrumb-nav" aria-label="Navegação em migalhas">
        <a href="#home" class="breadcrumb-link">Início</a>
        <span class="breadcrumb-sep">/</span>
        <span class="breadcrumb-current">${pathText}</span>
      </nav>
    </div>
  `;
}

function renderPageView(route) {
  // Rota de administração sempre funcional
  if (route === 'admin') {
    return `
      ${renderBreadcrumb('Painel de Administração')}
      ${isAuthenticated() ? renderAdminPanel() : renderAdminLogin()}
    `;
  }

  // Visualização de Páginas da Loja
  switch (route) {
    case 'loja':
    case 'preview':
    case 'loja-preview':
      return `
        ${renderBreadcrumb('Loja & Acervo Garimpado')}
        ${renderCatalog()}
        ${renderBrandsSection()}
      `;

    case 'quero-vender':
      return `
        ${renderBreadcrumb('Quero Vender / Desapego')}
        ${renderConsignSection()}
        ${renderFaqSection()}
      `;

    case 'sobre':
      return `
        ${renderBreadcrumb('Sobre Nós')}
        ${renderAboutHistorySection()}
        ${renderSustainabilitySection()}
        ${renderTestimonialsSection()}
      `;

    case 'blog':
      return `
        ${renderBreadcrumb('Blog EstiloBazar')}
        ${renderBlogSection()}
      `;

    case 'faq':
      return `
        ${renderBreadcrumb('Central de Ajuda (FAQ)')}
        ${renderFaqSection()}
      `;

    case 'pedidos':
      return `
        ${renderBreadcrumb('Rastreio de Pedidos')}
        <section class="container" style="padding: 4rem 1.5rem; text-align: center;">
          <div class="glass-panel" style="max-width: 600px; margin: 0 auto; padding: 3rem 1.5rem;">
            <div style="font-size: 3.5rem; margin-bottom: 0.8rem;">📦</div>
            <h2 class="title-section" style="margin-bottom: 0.6rem;">Acompanhe Seu Pedido</h2>
            <p style="font-size: 0.95rem; color: var(--c-text-muted); margin-bottom: 1.5rem;">
              Clique no botão abaixo para ver seus pedidos recentes e o status de entrega nos Correios.
            </p>
            <button id="page-open-orders-btn" class="btn btn-primary" style="padding: 0.85rem 1.8rem;">
              🔍 Consultar Meus Pedidos
            </button>
          </div>
        </section>
      `;

    case 'home':
    default:
      return `
        ${renderHero()}
        ${renderPromoBanner()}
        ${renderHighlightsSection()}
        ${renderBrandsSection()}
        ${renderBanners()}
        ${renderCatalog()}
        ${renderConsignSection()}
        ${renderTestimonialsSection()}
        ${renderBlogSection()}
        ${renderFaqSection()}
        ${renderInstagramSection()}
        ${renderSustainabilitySection()}
      `;
  }
}

function initApp() {
  const app = document.getElementById('app');
  if (!app) return;

  // Setup Page Router
  setupRouter((route) => {
    // Se a rota acessada for #preview ou #loja-preview, ativa o modo preview
    if (route === 'preview' || route === 'loja-preview') {
      sessionStorage.setItem('estilobazar_preview_mode', 'true');
    }

    const inPreview = isPreviewActive();
    const inAdmin = (route === 'admin');

    // Se estiver em Modo "Em Breve" E NÃO for Admin E NÃO estiver em Modo Preview:
    if (IS_COMING_SOON_MODE && !inAdmin && !inPreview) {
      app.innerHTML = renderComingSoonPage();
      setupComingSoonListeners();
      return;
    }

    // Se for Modo Preview do Proprietário ou Modo Normal da Loja:
    const previewBannerHTML = inPreview ? `
      <div id="preview-mode-banner" style="background: #1C2420; color: white; padding: 0.45rem 1rem; text-align: center; font-size: 0.82rem; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 1rem; position: sticky; top: 0; z-index: 10000;">
        <span>👁️ Modo de Testes / Prévia do Proprietário Ativo</span>
        <button id="exit-preview-btn" style="background: var(--c-pink); color: var(--c-text-main); border: none; padding: 0.2rem 0.7rem; border-radius: var(--radius-sm); font-size: 0.75rem; font-weight: 700; cursor: pointer;">
          Sair da Prévia
        </button>
      </div>
    ` : '';

    app.innerHTML = `
      ${previewBannerHTML}
      ${renderHeader()}
      ${renderPoliciesBar()}
      <main id="main-content-view">
        ${renderPageView(route)}
      </main>
      ${renderFooter()}
      ${renderDrawers()}
      ${renderWhatsAppButton()}
      ${renderSocialProofContainer()}
    `;

    // Setup Listeners Gerais da Loja
    setupHeaderListeners();
    setupFooterListeners();
    setupDrawerListeners();
    updateCartDrawer();
    updateFavDrawer();
    setupSocialProofListeners();

    // Setup Botão Sair da Prévia se estiver ativo
    const exitPreviewBtn = document.getElementById('exit-preview-btn');
    if (exitPreviewBtn) {
      exitPreviewBtn.addEventListener('click', () => {
        sessionStorage.removeItem('estilobazar_preview_mode');
        window.location.hash = 'home';
        window.location.reload();
      });
    }

    // Listeners Específicos por Rota
    if (route === 'admin') {
      if (isAuthenticated()) {
        setupAdminPanelListeners(() => navigateTo('admin'));
      } else {
        setupAdminLoginListeners(() => navigateTo('admin'));
      }
    } else if (route === 'home') {
      setupPromoBannerListeners();
      setupHighlightsListeners();
      setupCatalogListeners();
      updateCatalogGrid();
      setupConsignListeners();
      setupBlogListeners();
      setupFaqListeners();
    } else if (route === 'loja' || route === 'preview' || route === 'loja-preview') {
      setupCatalogListeners();
      updateCatalogGrid();
    } else if (route === 'quero-vender') {
      setupConsignListeners();
      setupFaqListeners();
    } else if (route === 'blog') {
      setupBlogListeners();
    } else if (route === 'faq') {
      setupFaqListeners();
    } else if (route === 'pedidos') {
      const pageOrdersBtn = document.getElementById('page-open-orders-btn');
      if (pageOrdersBtn) {
        pageOrdersBtn.addEventListener('click', () => openOrdersModal());
      }
    }
  });

  window.addEventListener('admin-auth-changed', () => {
    if (window.location.hash === '#admin') {
      const mainView = document.getElementById('main-content-view');
      if (mainView) {
        mainView.innerHTML = renderPageView('admin');
        if (isAuthenticated()) {
          setupAdminPanelListeners(() => navigateTo('admin'));
        } else {
          setupAdminLoginListeners(() => navigateTo('admin'));
        }
      }
    }
  });

  console.log('✨ EstiloBazar carregado com isolamento de Modo Em Breve, Preview e Admin!');
}

document.addEventListener('DOMContentLoaded', initApp);
