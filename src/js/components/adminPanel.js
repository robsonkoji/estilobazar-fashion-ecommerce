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

let adminProducts = [];
let editingProductId = null;

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

          <!-- Upload de Imagem -->
          <div style="margin-bottom: 1rem;">
            <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 0.3rem;">Foto Principal (URL ou Arquivo)</label>
            <div style="display: flex; gap: 0.6rem; align-items: center;">
              <input type="text" id="p-image-url" class="search-input" style="flex: 1;" placeholder="https://images.unsplash.com/..." />
              <input type="file" id="p-image-file" accept="image/*" style="display: none;" />
              <button type="button" id="p-upload-btn" class="btn btn-outline" style="font-size: 0.8rem; padding: 0.45rem 0.8rem;">
                📷 Upload Foto
              </button>
            </div>
            <div id="p-image-preview" style="margin-top: 0.5rem; display: none;">
              <img id="p-preview-img" src="" alt="Preview" style="height: 70px; border-radius: var(--radius-sm); border: 1px solid var(--c-pink);" />
            </div>
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

function openProductModalForm(product) {
  const modal = document.getElementById('admin-product-modal');
  const title = document.getElementById('admin-modal-title');
  if (!modal) return;

  editingProductId = product ? product.id : null;

  if (title) {
    title.textContent = product ? 'Editar Peça Garimpada' : 'Cadastrar Novo Garimpo';
  }

  document.getElementById('p-title').value = product ? product.title : '';
  document.getElementById('p-category').value = product ? product.category : 'Vestidos';
  document.getElementById('p-brand').value = product ? product.brand : '';
  document.getElementById('p-price').value = product ? product.price : '';
  document.getElementById('p-original-price').value = product && product.originalPrice ? product.originalPrice : '';
  document.getElementById('p-size').value = product ? product.size : '';
  document.getElementById('p-condition').value = product ? product.condition : 'Como Nova';
  document.getElementById('p-image-url').value = product ? product.image : '';
  document.getElementById('p-description').value = product ? product.description : '';
  document.getElementById('p-featured').checked = product ? !!product.isFeatured : false;
  document.getElementById('p-new').checked = product ? !!product.isNew : false;
  document.getElementById('p-bargain').checked = product ? !!product.isBargain : false;

  const previewWrap = document.getElementById('p-image-preview');
  const previewImg = document.getElementById('p-preview-img');
  if (product && product.image) {
    previewImg.src = product.image;
    previewWrap.style.display = 'block';
  } else {
    previewWrap.style.display = 'none';
  }

  modal.classList.add('active');
}

function setupModalFormListeners() {
  const modal = document.getElementById('admin-product-modal');
  const closeBtn = document.getElementById('admin-modal-close');
  const cancelBtn = document.getElementById('admin-modal-cancel');
  const form = document.getElementById('admin-product-form');

  const closeModal = () => modal && modal.classList.remove('active');

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  // Upload Button Trigger
  const uploadBtn = document.getElementById('p-upload-btn');
  const fileInput = document.getElementById('p-image-file');
  const urlInput = document.getElementById('p-image-url');

  if (uploadBtn && fileInput) {
    uploadBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        uploadBtn.disabled = true;
        uploadBtn.textContent = 'Enviando...';
        const res = await uploadProductImage(file);
        if (res.success) {
          urlInput.value = res.url;
          const previewWrap = document.getElementById('p-image-preview');
          const previewImg = document.getElementById('p-preview-img');
          previewImg.src = res.url;
          previewWrap.style.display = 'block';
        } else {
          alert('Erro no upload: ' + res.error);
        }
        uploadBtn.disabled = false;
        uploadBtn.textContent = '📷 Upload Foto';
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

      const productData = {
        title: document.getElementById('p-title').value.trim(),
        category: document.getElementById('p-category').value,
        brand: document.getElementById('p-brand').value.trim(),
        price: parseFloat(document.getElementById('p-price').value),
        originalPrice: parseFloat(document.getElementById('p-original-price').value) || 0,
        size: document.getElementById('p-size').value.trim(),
        condition: document.getElementById('p-condition').value.trim(),
        image: document.getElementById('p-image-url').value.trim() || 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
        description: document.getElementById('p-description').value.trim(),
        badge: document.getElementById('p-price').value <= 99 ? 'Achado < R$99' : 'Brechó Curado',
        isFeatured: document.getElementById('p-featured').checked,
        isNew: document.getElementById('p-new').checked,
        isBargain: document.getElementById('p-bargain').checked || (document.getElementById('p-price').value <= 99)
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
