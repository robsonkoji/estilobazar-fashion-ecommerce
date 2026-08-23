import { 
  getProductsFromFirestore, 
  addProductToFirestore, 
  updateProductInFirestore, 
  deleteProductFromFirestore, 
  uploadProductImage,
  seedProductsToFirestore
} from '../services/productService.js';
import { logoutAdmin, getCurrentUser } from '../utils/auth.js';
import { categories, sizes, conditions, brands } from '../data/products.js';
import { compressImage } from '../utils/imageCompressor.js';

let adminProducts = [];
let editingProductId = null;
let currentProductImages = [];

export function renderAdminPanel() {
  const user = getCurrentUser();
  const email = user ? user.email : 'Administrador';

  return `
    <section class="admin-panel-section container" style="padding: 2.5rem 1.5rem;">
      <!-- Header do Painel -->
      <div class="admin-header glass-panel" style="padding: 1.5rem 2rem; margin-bottom: 2rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
        <div>
          <span class="badge-curated" style="margin-bottom: 0.3rem;">Painel de Gestão</span>
          <h2 class="title-section" style="font-size: 1.8rem;">EstiloBazar Backoffice</h2>
          <p style="font-size: 0.85rem; color: var(--c-text-muted);">
            Logado como: <strong>${email}</strong>
          </p>
        </div>

        <div style="display: flex; gap: 0.8rem; align-items: center; flex-wrap: wrap;">
          <button id="admin-preview-site-btn" class="btn btn-outline" style="font-size: 0.85rem; padding: 0.5rem 1rem;" title="Navegar por toda a loja em modo de teste">
            👁️ Ver Prévia da Loja
          </button>
          <button id="admin-seed-btn" class="btn btn-outline" style="font-size: 0.85rem; padding: 0.5rem 1rem;" title="Importar produtos padrão se o banco estiver vazio">
            🌱 Semeia Banco Firestore
          </button>
          <button id="admin-add-product-btn" class="btn btn-primary" style="font-size: 0.85rem; padding: 0.55rem 1.2rem;">
            ✨ + Cadastrar Novo Garimpo
          </button>
          <button id="admin-logout-btn" class="btn btn-outline" style="font-size: 0.85rem; padding: 0.5rem 1rem; border-color: #E05252; color: #C62828;">
            🚪 Sair
          </button>
        </div>
      </div>

      <!-- Dashboard Cards -->
      <div class="admin-stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.2rem; margin-bottom: 2rem;">
        <div class="glass-panel" style="padding: 1.2rem; text-align: center;">
          <div style="font-size: 2rem; margin-bottom: 0.2rem;">👗</div>
          <div style="font-size: 1.8rem; font-weight: 700; color: var(--c-text-main);" id="stat-total-count">0</div>
          <div style="font-size: 0.82rem; color: var(--c-text-muted);">Total de Peças Cadastradas</div>
        </div>

        <div class="glass-panel" style="padding: 1.2rem; text-align: center;">
          <div style="font-size: 2rem; margin-bottom: 0.2rem;">🏷️</div>
          <div style="font-size: 1.8rem; font-weight: 700; color: var(--c-text-main);" id="stat-featured-count">0</div>
          <div style="font-size: 0.82rem; color: var(--c-text-muted);">Peças em Destaque</div>
        </div>

        <div class="glass-panel" style="padding: 1.2rem; text-align: center;">
          <div style="font-size: 2rem; margin-bottom: 0.2rem;">💎</div>
          <div style="font-size: 1.8rem; font-weight: 700; color: var(--c-text-main);" id="stat-avg-price">R$ 0,00</div>
          <div style="font-size: 0.82rem; color: var(--c-text-muted);">Preço Médio do Acervo</div>
        </div>

        <div class="glass-panel" style="padding: 1.2rem; text-align: center;">
          <div style="font-size: 2rem; margin-bottom: 0.2rem;">🔥</div>
          <div style="font-size: 1.8rem; font-weight: 700; color: var(--c-text-main);" id="stat-bargain-count">0</div>
          <div style="font-size: 0.82rem; color: var(--c-text-muted);">Achados &lt; R$99</div>
        </div>
      </div>

      <!-- Tabela de Produtos -->
      <div class="glass-panel" style="padding: 1.5rem; border-radius: var(--radius-lg);">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.2rem;">
          <h3 style="font-size: 1.3rem; font-family: var(--font-heading);">Catálogo Atual</h3>
          <div style="display: flex; gap: 0.8rem; flex-wrap: wrap;">
            <input 
              type="text" 
              id="admin-search-input" 
              class="search-input" 
              placeholder="Buscar no admin..." 
              style="font-size: 0.85rem; padding: 0.4rem 0.9rem;"
            />
          </div>
        </div>

        <div style="overflow-x: auto;">
          <table class="admin-table" style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.88rem;">
            <thead>
              <tr style="border-bottom: 2px solid var(--c-mint); color: var(--c-text-muted);">
                <th style="padding: 0.8rem;">Foto</th>
                <th style="padding: 0.8rem;">Título / Peça</th>
                <th style="padding: 0.8rem;">Marca</th>
                <th style="padding: 0.8rem;">Categoria</th>
                <th style="padding: 0.8rem;">Preço</th>
                <th style="padding: 0.8rem;">Tam</th>
                <th style="padding: 0.8rem;">Destaque</th>
                <th style="padding: 0.8rem; text-align: right;">Ações</th>
              </tr>
            </thead>
            <tbody id="admin-table-body">
              <tr>
                <td colspan="8" style="text-align: center; padding: 2rem; color: var(--c-text-muted);">
                  Carregando catálogo do Firestore...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Modal Form de Produto (Criar / Editar) -->
    <div class="modal-overlay" id="admin-product-modal" aria-hidden="true">
      <div class="modal-container" style="max-width: 650px; padding: 2rem;">
        <button class="modal-close" id="admin-modal-close" aria-label="Fechar Modal">&times;</button>
        
        <h3 class="title-section" id="admin-modal-title" style="font-size: 1.5rem; margin-bottom: 1.2rem;">
          Cadastrar Novo Garimpo
        </h3>

        <form id="admin-product-form">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
            <div style="grid-column: 1 / -1;">
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 0.3rem;">Título da Peça *</label>
              <input type="text" id="p-title" class="search-input" style="width: 100%;" required placeholder="ex: Vestido Vintage Floral" />
            </div>

            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 0.3rem;">Categoria *</label>
              <select id="p-category" class="sort-select" style="width: 100%;" required>
                ${categories.filter(c => c !== 'Todos').map(c => `<option value="${c}">${c}</option>`).join('')}
              </select>
            </div>

            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 0.3rem;">Marca *</label>
              <input type="text" id="p-brand" class="search-input" style="width: 100%;" required placeholder="ex: Farm, Zara, Levi's" />
            </div>

            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 0.3rem;">Preço de Venda (R$) *</label>
              <input type="number" step="0.01" id="p-price" class="search-input" style="width: 100%;" required placeholder="149.90" />
            </div>

            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 0.3rem;">Preço Original / Estimado (R$)</label>
              <input type="number" step="0.01" id="p-original-price" class="search-input" style="width: 100%;" placeholder="320.00" />
            </div>

            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 0.3rem;">Tamanho *</label>
              <input type="text" id="p-size" class="search-input" style="width: 100%;" required placeholder="P, M, G, 37, Único" />
            </div>

            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 0.3rem;">Condição / Estado *</label>
              <input type="text" id="p-condition" class="search-input" style="width: 100%;" required placeholder="Como Nova, Vintage Raro" />
            </div>
          </div>

          <!-- Upload de Galeria de Fotos (Multi-fotos) -->
          <div style="margin-bottom: 1rem;">
            <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 0.3rem;">
              📸 Galeria de Fotos da Peça (Selecione 1 ou mais fotos do celular/computador)
            </label>
            <div style="display: flex; gap: 0.6rem; align-items: center;">
              <input type="text" id="p-image-url" class="search-input" style="flex: 1;" placeholder="Cole a URL da foto ou selecione os arquivos ao lado..." />
              <input type="file" id="p-image-file" accept="image/*" multiple style="display: none;" />
              <button type="button" id="p-upload-btn" class="btn btn-outline" style="font-size: 0.8rem; padding: 0.45rem 0.8rem;">
                📷 + Adicionar Fotos
              </button>
            </div>
            <div id="p-gallery-container" style="display: none;"></div>
          </div>

          <div style="margin-bottom: 1rem;">
            <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 0.3rem;">Descrição Completa</label>
            <textarea id="p-description" class="search-input" style="width: 100%; height: 75px; resize: vertical;" placeholder="Detalhes do produto..."></textarea>
          </div>

          <div style="display: flex; gap: 1.2rem; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap;">
            <label style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; font-weight: 600; cursor: pointer;">
              <input type="checkbox" id="p-featured" /> ⭐ Destaque na Home
            </label>
            <label style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; font-weight: 600; cursor: pointer;">
              <input type="checkbox" id="p-new" /> ✨ Novidade
            </label>
            <label style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; font-weight: 600; cursor: pointer;">
              <input type="checkbox" id="p-bargain" /> 🔥 Pechincha (&lt; R$99)
            </label>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.8rem;">
            <button type="button" id="admin-modal-cancel" class="btn btn-outline">Cancelar</button>
            <button type="submit" id="admin-form-submit" class="btn btn-primary">💾 Salvar Garimpo</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

export function setupAdminPanelListeners(onLogoutSuccess) {
  loadAdminProducts();

  const previewBtn = document.getElementById('admin-preview-site-btn');
  if (previewBtn) {
    previewBtn.addEventListener('click', () => {
      sessionStorage.setItem('estilobazar_preview_mode', 'true');
      window.location.hash = 'loja';
    });
  }

  const logoutBtn = document.getElementById('admin-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await logoutAdmin();
      if (onLogoutSuccess) onLogoutSuccess();
    });
  }

  const seedBtn = document.getElementById('admin-seed-btn');
  if (seedBtn) {
    seedBtn.addEventListener('click', async () => {
      if (confirm('Deseja importar o catálogo padrão para o banco Firestore?')) {
        seedBtn.disabled = true;
        seedBtn.textContent = 'Semeando...';
        const res = await seedProductsToFirestore();
        if (res.success) {
          alert(`✅ Sucesso! ${res.count} produtos importados.`);
          loadAdminProducts();
        } else {
          alert(`⚠️ ${res.message || res.error}`);
        }
        seedBtn.disabled = false;
        seedBtn.textContent = '🌱 Semeia Banco Firestore';
      }
    });
  }

  const addBtn = document.getElementById('admin-add-product-btn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      openProductModalForm(null);
    });
  }

  const searchInput = document.getElementById('admin-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      const filtered = adminProducts.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.brand.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q)
      );
      renderTableRows(filtered);
    });
  }

  setupModalFormListeners();
}

async function loadAdminProducts() {
  adminProducts = await getProductsFromFirestore();
  updateStats();
  renderTableRows(adminProducts);
}

function updateStats() {
  const total = adminProducts.length;
  const featured = adminProducts.filter(p => p.isFeatured).length;
  const bargain = adminProducts.filter(p => p.price <= 99).length;
  const avg = total > 0 ? adminProducts.reduce((acc, p) => acc + p.price, 0) / total : 0;

  const totalEl = document.getElementById('stat-total-count');
  const featEl = document.getElementById('stat-featured-count');
  const avgEl = document.getElementById('stat-avg-price');
  const bargEl = document.getElementById('stat-bargain-count');

  if (totalEl) totalEl.textContent = total;
  if (featEl) featEl.textContent = featured;
  if (avgEl) avgEl.textContent = `R$ ${avg.toFixed(2).replace('.', ',')}`;
  if (bargEl) bargEl.textContent = bargain;
}

function renderTableRows(products) {
  const tbody = document.getElementById('admin-table-body');
  if (!tbody) return;

  if (products.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 2rem; color: var(--c-text-muted);">
          Nenhuma peça encontrada.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = products.map(p => `
    <tr style="border-bottom: 1px solid rgba(196, 230, 197, 0.4);">
      <td style="padding: 0.6rem;">
        <img src="${p.image}" alt="${p.title}" style="width: 44px; height: 55px; object-fit: cover; border-radius: var(--radius-sm);" />
      </td>
      <td style="padding: 0.6rem; font-weight: 600;">${p.title}</td>
      <td style="padding: 0.6rem; color: var(--c-text-muted);">${p.brand}</td>
      <td style="padding: 0.6rem;"><span class="badge-size">${p.category}</span></td>
      <td style="padding: 0.6rem; font-weight: 700; color: var(--c-text-main);">R$ ${p.price.toFixed(2).replace('.', ',')}</td>
      <td style="padding: 0.6rem;">${p.size}</td>
      <td style="padding: 0.6rem;">${p.isFeatured ? '⭐ Sim' : 'Não'}</td>
      <td style="padding: 0.6rem; text-align: right;">
        <button class="btn btn-outline btn-edit-product" data-id="${p.id}" style="padding: 0.25rem 0.6rem; font-size: 0.78rem;">✏️ Editar</button>
        <button class="btn btn-outline btn-delete-product" data-id="${p.id}" style="padding: 0.25rem 0.6rem; font-size: 0.78rem; border-color: #E05252; color: #C62828;">🗑️ Deletar</button>
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('.btn-edit-product').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const prod = adminProducts.find(p => p.id === id);
      if (prod) openProductModalForm(prod);
    });
  });

  tbody.querySelectorAll('.btn-delete-product').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      const prod = adminProducts.find(p => p.id === id);
      if (prod && confirm(`Deseja realmente excluir "${prod.title}"?`)) {
        btn.disabled = true;
        const res = await deleteProductFromFirestore(id);
        if (res.success) {
          loadAdminProducts();
        } else {
          alert('Erro ao excluir produto: ' + res.error);
        }
      }
    });
  });
}

function renderGalleryPreviews() {
  const container = document.getElementById('p-gallery-container');
  if (!container) return;

  if (currentProductImages.length === 0) {
    container.style.display = 'none';
    container.innerHTML = '';
    return;
  }

  container.style.display = 'flex';
  container.style.flexWrap = 'wrap';
  container.style.gap = '0.8rem';
  container.style.marginTop = '0.8rem';

  container.innerHTML = currentProductImages.map((imgUrl, idx) => `
    <div style="position: relative; width: 80px; height: 100px; border-radius: var(--radius-sm); overflow: hidden; border: 2px solid ${idx === 0 ? '#8EC490' : 'rgba(0,0,0,0.12)'}; background: #FFF; box-shadow: 0 2px 5px rgba(0,0,0,0.08);">
      <img src="${imgUrl}" alt="Foto ${idx + 1}" style="width: 100%; height: 100%; object-fit: cover;" />
      ${idx === 0 ? `<span style="position: absolute; top: 3px; left: 3px; background: #8EC490; color: #FFF; font-size: 0.65rem; font-weight: 700; padding: 1px 5px; border-radius: 3px; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">⭐ Capa</span>` : ''}
      <button type="button" class="btn-remove-gallery-img" data-index="${idx}" style="position: absolute; top: 3px; right: 3px; background: #E05252; color: #FFF; border: none; border-radius: 50%; width: 22px; height: 22px; font-size: 0.75rem; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 3px rgba(0,0,0,0.3);" title="Remover esta foto">✕</button>
      ${idx !== 0 ? `<button type="button" class="btn-set-cover-img" data-index="${idx}" style="position: absolute; bottom: 3px; left: 3px; right: 3px; background: rgba(44, 48, 46, 0.85); color: #FFF; border: none; font-size: 0.62rem; padding: 2px 0; border-radius: 3px; cursor: pointer; text-align: center;" title="Definir como Capa">Usar Capa</button>` : ''}
    </div>
  `).join('');

  container.querySelectorAll('.btn-remove-gallery-img').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      currentProductImages.splice(idx, 1);
      const urlInput = document.getElementById('p-image-url');
      if (urlInput) urlInput.value = currentProductImages[0] || '';
      renderGalleryPreviews();
    });
  });

  container.querySelectorAll('.btn-set-cover-img').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      const [selectedImg] = currentProductImages.splice(idx, 1);
      currentProductImages.unshift(selectedImg);
      const urlInput = document.getElementById('p-image-url');
      if (urlInput) urlInput.value = currentProductImages[0] || '';
      renderGalleryPreviews();
    });
  });
}

function openProductModalForm(product) {
  editingProductId = product ? product.id : null;
  const modal = document.getElementById('admin-product-modal');
  if (!modal) {
    console.error('⚠️ Elemento #admin-product-modal não encontrado no DOM!');
    return;
  }

  const title = document.getElementById('admin-modal-title');
  if (title) {
    title.textContent = product ? 'Editar Peça Garimpada' : 'Cadastrar Novo Garimpo';
  }

  const elTitle = document.getElementById('p-title');
  if (elTitle) elTitle.value = product ? product.title || '' : '';

  const elCat = document.getElementById('p-category');
  if (elCat) elCat.value = product ? product.category || 'Vestidos' : 'Vestidos';

  const elBrand = document.getElementById('p-brand');
  if (elBrand) elBrand.value = product ? product.brand || '' : '';

  const elPrice = document.getElementById('p-price');
  if (elPrice) elPrice.value = product && product.price !== undefined ? product.price : '';

  const elOrigPrice = document.getElementById('p-original-price');
  if (elOrigPrice) elOrigPrice.value = product && product.originalPrice ? product.originalPrice : '';

  const elSize = document.getElementById('p-size');
  if (elSize) elSize.value = product ? product.size || '' : '';

  const elCond = document.getElementById('p-condition');
  if (elCond) elCond.value = product ? product.condition || 'Como Nova' : 'Como Nova';

  const elDesc = document.getElementById('p-description');
  if (elDesc) elDesc.value = product ? product.description || '' : '';

  const elFeat = document.getElementById('p-featured');
  if (elFeat) elFeat.checked = product ? !!product.isFeatured : false;

  const elNew = document.getElementById('p-new');
  if (elNew) elNew.checked = product ? !!product.isNew : false;

  const elBarg = document.getElementById('p-bargain');
  if (elBarg) elBarg.checked = product ? !!product.isBargain : false;

  const fileInput = document.getElementById('p-image-file');
  if (fileInput) fileInput.value = '';

  // Carrega lista de fotos existentes
  if (product && product.images && Array.isArray(product.images) && product.images.length > 0) {
    currentProductImages = [...product.images];
  } else if (product && product.gallery && Array.isArray(product.gallery) && product.gallery.length > 0) {
    currentProductImages = [...product.gallery];
  } else if (product && product.image) {
    currentProductImages = [product.image];
  } else {
    currentProductImages = [];
  }

  const urlInput = document.getElementById('p-image-url');
  if (urlInput) urlInput.value = currentProductImages[0] || '';

  renderGalleryPreviews();

  const uploadBtn = document.getElementById('p-upload-btn');
  if (uploadBtn) {
    uploadBtn.disabled = false;
    uploadBtn.textContent = '📷 + Adicionar Fotos';
  }

  modal.style.display = 'flex';
  modal.style.opacity = '1';
  modal.style.pointerEvents = 'auto';
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
}

function setupModalFormListeners() {
  const modal = document.getElementById('admin-product-modal');
  const closeBtn = document.getElementById('admin-modal-close');
  const cancelBtn = document.getElementById('admin-modal-cancel');
  const form = document.getElementById('admin-product-form');

  const closeModal = () => {
    if (modal) {
      modal.classList.remove('active');
      modal.style.display = 'none';
      modal.style.opacity = '0';
      modal.style.pointerEvents = 'none';
      modal.setAttribute('aria-hidden', 'true');
    }
    const uploadBtn = document.getElementById('p-upload-btn');
    if (uploadBtn) {
      uploadBtn.disabled = false;
      uploadBtn.textContent = '📷 + Adicionar Fotos';
    }
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  // Delegação Global de Cliques para garantia absoluta de abertura do modal
  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('#admin-add-product-btn');
    if (addBtn) {
      e.preventDefault();
      openProductModalForm(null);
      return;
    }

    const editBtn = e.target.closest('.btn-edit-product');
    if (editBtn) {
      e.preventDefault();
      const id = editBtn.getAttribute('data-id');
      const prod = adminProducts.find(p => String(p.id) === String(id));
      if (prod) {
        openProductModalForm(prod);
      }
      return;
    }
  });

  const uploadBtn = document.getElementById('p-upload-btn');
  const fileInput = document.getElementById('p-image-file');
  const urlInput = document.getElementById('p-image-url');

  if (urlInput) {
    urlInput.addEventListener('change', (e) => {
      const url = e.target.value.trim();
      if (url && !currentProductImages.includes(url)) {
        currentProductImages.unshift(url);
        renderGalleryPreviews();
      }
    });
  }

  if (uploadBtn && fileInput) {
    uploadBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files);
      if (files.length > 0) {
        uploadBtn.disabled = true;
        uploadBtn.textContent = `Processando (${files.length})...`;

        for (const file of files) {
          try {
            const compressedDataUrl = await compressImage(file, 1000, 1000, 0.75);
            currentProductImages.push(compressedDataUrl);
            renderGalleryPreviews();

            const targetIndex = currentProductImages.length - 1;
            uploadProductImage(file).then(res => {
              if (res && res.success && res.url) {
                currentProductImages[targetIndex] = res.url;
                if (targetIndex === 0 && urlInput) urlInput.value = res.url;
                renderGalleryPreviews();
              }
            }).catch(err => console.warn('⚠️ Foto mantida em Base64:', err.message));
          } catch (err) {
            console.warn('⚠️ Erro ao processar foto:', err.message);
          }
        }

        if (urlInput && currentProductImages.length > 0) {
          urlInput.value = currentProductImages[0];
        }

        uploadBtn.disabled = false;
        uploadBtn.textContent = '📷 + Adicionar Fotos';
        fileInput.value = '';
      }
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('admin-form-submit');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Salvando...';
      }

      const inputUrl = document.getElementById('p-image-url').value.trim();
      if (inputUrl && !currentProductImages.includes(inputUrl)) {
        currentProductImages.unshift(inputUrl);
      }

      const mainCover = currentProductImages[0] || inputUrl || 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80';
      const galleryList = currentProductImages.length > 0 ? [...currentProductImages] : [mainCover];

      const productData = {
        title: document.getElementById('p-title').value.trim(),
        category: document.getElementById('p-category').value,
        brand: document.getElementById('p-brand').value.trim(),
        price: parseFloat(document.getElementById('p-price').value),
        originalPrice: parseFloat(document.getElementById('p-original-price').value) || 0,
        size: document.getElementById('p-size').value.trim(),
        condition: document.getElementById('p-condition').value.trim(),
        image: mainCover,
        images: galleryList,
        gallery: galleryList,
        description: document.getElementById('p-description').value.trim(),
        badge: parseFloat(document.getElementById('p-price').value) <= 99 ? 'Achado < R$99' : 'Brechó Curado',
        isFeatured: document.getElementById('p-featured').checked,
        isNew: document.getElementById('p-new').checked,
        isBargain: document.getElementById('p-bargain').checked || (parseFloat(document.getElementById('p-price').value) <= 99)
      };

      let result;
      if (editingProductId) {
        result = await updateProductInFirestore(editingProductId, productData);
      } else {
        result = await addProductToFirestore(productData);
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = '💾 Salvar Garimpo';
      }

      if (result.success) {
        closeModal();
        loadAdminProducts();
      } else {
        alert('Erro ao salvar produto: ' + result.error);
      }
    });
  }
}
