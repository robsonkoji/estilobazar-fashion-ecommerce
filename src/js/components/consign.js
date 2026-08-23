import { showToast } from '../utils/storage.js';

export function renderConsignSection() {
  return `
    <section class="consign-section" id="quero-vender" style="padding: 4rem 0; background: linear-gradient(180deg, var(--bg-base) 0%, var(--c-peach-light) 50%, var(--bg-base) 100%);">
      <div class="container">
        <div style="text-align: center; max-width: 720px; margin: 0 auto 3rem auto;">
          <span class="badge-curated" style="margin-bottom: 0.6rem; background: var(--c-pink-light); border-color: var(--c-pink);">Desapegue com Facilidade</span>
          <h2 class="title-section" style="margin-bottom: 0.8rem;">Quero Vender Minhas Peças</h2>
          <p style="font-size: 1.05rem; color: var(--c-text-muted);">
            Transforme roupas paradas no seu guarda-roupa em dinheiro rápido no PIX ou créditos na loja com 15% de bônus!
          </p>
        </div>

        <!-- 3 Steps -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.8rem; margin-bottom: 3.5rem;" class="steps-grid">
          <div class="glass-panel" style="padding: 2rem; text-align: center;">
            <div style="width: 54px; height: 54px; background: var(--c-pink); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700; margin: 0 auto 1.2rem auto;">1</div>
            <h3 style="font-size: 1.2rem; font-family: var(--font-body); font-weight: 700; margin-bottom: 0.5rem;">Cadastre &amp; Envie Fotos</h3>
            <p style="font-size: 0.9rem; color: var(--c-text-muted);">Preencha nosso formulário simples abaixo e envie fotos das peças que deseja desapegar.</p>
          </div>

          <div class="glass-panel" style="padding: 2rem; text-align: center;">
            <div style="width: 54px; height: 54px; background: var(--c-peach); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700; margin: 0 auto 1.2rem auto;">2</div>
            <h3 style="font-size: 1.2rem; font-family: var(--font-body); font-weight: 700; margin-bottom: 0.5rem;">Avaliação &amp; Envio</h3>
            <p style="font-size: 0.9rem; color: var(--c-text-muted);">Nossa curadoria avalia suas peças em 48h e envia uma etiqueta de postagem gratuita nos Correios.</p>
          </div>

          <div class="glass-panel" style="padding: 2rem; text-align: center;">
            <div style="width: 54px; height: 54px; background: var(--c-mint); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700; margin: 0 auto 1.2rem auto;">3</div>
            <h3 style="font-size: 1.2rem; font-family: var(--font-body); font-weight: 700; margin-bottom: 0.5rem;">Receba no PIX</h3>
            <p style="font-size: 0.9rem; color: var(--c-text-muted);">Assim que as peças forem aprovadas, você recebe o valor combinado direto na sua conta bancária!</p>
          </div>
        </div>

        <!-- Interactive Calculator & Form -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; align-items: start; margin-bottom: 3.5rem;" class="consign-form-grid">
          <div class="glass-panel" style="padding: 2.2rem;">
            <h3 style="font-size: 1.35rem; font-family: var(--font-body); font-weight: 700; margin-bottom: 0.5rem;">Simulador de Ganho Rápido</h3>
            <p style="font-size: 0.88rem; color: var(--c-text-muted); margin-bottom: 1.5rem;">Estime quanto você pode faturar desapegando hoje:</p>

            <div style="margin-bottom: 1.2rem;">
              <label style="display: flex; justify-content: space-between; font-size: 0.9rem; font-weight: 600; margin-bottom: 0.4rem;">
                <span>Quantidade de Peças:</span>
                <span id="calc-qty-display">5 peças</span>
              </label>
              <input type="range" id="calc-qty" min="1" max="30" value="5" style="width:100%; accent-color: var(--c-pink-dark);">
            </div>

            <div style="margin-bottom: 1.5rem;">
              <label style="display: block; font-size: 0.9rem; font-weight: 600; margin-bottom: 0.4rem;">Categoria Predominante:</label>
              <select id="calc-category" class="sort-select" style="width: 100%;">
                <option value="45">Vestidos e Conjuntos (~ R$ 45/peça)</option>
                <option value="60">Blazers e Jaquetas (~ R$ 60/peça)</option>
                <option value="35">Saias e Blusas (~ R$ 35/peça)</option>
                <option value="50">Calçados e Acessórios (~ R$ 50/peça)</option>
              </select>
            </div>

            <div style="background: var(--c-mint-light); border: 1.5px solid var(--c-mint); padding: 1.2rem; border-radius: var(--radius-md); text-align: center;">
              <div style="font-size: 0.85rem; color: var(--c-text-muted);">Estimativa de Recebimento no PIX:</div>
              <div id="calc-total" style="font-family: var(--font-heading); font-size: 2.2rem; font-weight: 700; color: var(--c-text-main); margin: 0.3rem 0;">R$ 225,00</div>
              <div style="font-size: 0.78rem; color: var(--c-mint-dark); font-weight: 600;">ou R$ 258,00 em Créditos na Loja! ✨</div>
            </div>
          </div>

          <div class="glass-panel" style="padding: 2.2rem;">
            <h3 style="font-size: 1.35rem; font-family: var(--font-body); font-weight: 700; margin-bottom: 0.5rem;">Enviar Peças para Avaliação</h3>
            <p style="font-size: 0.88rem; color: var(--c-text-muted); margin-bottom: 1.2rem;">Preencha para receber a instrução de envio por e-mail:</p>

            <form id="consign-form" style="display: flex; flex-direction: column; gap: 0.9rem;">
              <div>
                <input type="text" required placeholder="Seu Nome Completo" class="newsletter-input" style="width:100%;">
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem;">
                <input type="email" required placeholder="Seu E-mail" class="newsletter-input" style="width:100%;">
                <input type="text" required placeholder="WhatsApp / Celular" class="newsletter-input" style="width:100%;">
              </div>
              <div>
                <textarea rows="3" placeholder="Descreva brevemente as peças (marca, quantidade, estado)..." class="newsletter-input" style="width:100%; border-radius: var(--radius-md);"></textarea>
              </div>
              <button type="submit" class="btn btn-primary" style="padding: 0.85rem; font-size: 0.95rem; width: 100%;">
                💌 Enviar para Curadoria
              </button>
            </form>
          </div>
        </div>

        <!-- Acceptance Criteria Table (Aceitamos x Não Aceitamos) -->
        <div class="glass-panel" style="padding: 2.5rem;">
          <div style="text-align: center; margin-bottom: 2rem;">
            <h3 style="font-size: 1.5rem; font-family: var(--font-body); font-weight: 700; margin-bottom: 0.4rem;">Critérios de Curadoria &amp; Aceitação</h3>
            <p style="font-size: 0.9rem; color: var(--c-text-muted);">Confira o padrão de qualidade exigido para aprovação do seu desapego:</p>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;" class="consign-criteria-grid">
            <div style="background: var(--c-mint-light); border: 1.5px solid var(--c-mint); padding: 1.5rem; border-radius: var(--radius-md);">
              <h4 style="color: #2E7D32; font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>✓</span> O Que Aceitamos com Prioridade
              </h4>
              <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.7rem; font-size: 0.9rem; color: var(--c-text-main);">
                <li>✨ Roupas femininas e masculinas limpas e higienizadas</li>
                <li>🏷️ Peças de marcas reconhecidas (Zara, Farm, Arezzo, Animale, Levi's, etc.)</li>
                <li>👗 Relíquias vintage preservadas (anos 70, 80 e 90)</li>
                <li>👟 Calçados, bolsas e acessórios em excelente estado de conservação</li>
                <li>🏷️ Peças novas ainda com etiqueta original de loja</li>
              </ul>
            </div>

            <div style="background: #FDF0F0; border: 1.5px solid var(--c-pink); padding: 1.5rem; border-radius: var(--radius-md);">
              <h4 style="color: #C62828; font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>✕</span> O Que Não Aceitamos
              </h4>
              <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.7rem; font-size: 0.9rem; color: var(--c-text-main);">
                <li>⚠️ Peças com manchas, rasgos, furos ou zíper quebrado</li>
                <li>⚠️ Roupas com bolinhas acentuadas ou desgaste excessivo</li>
                <li>⚠️ Réplicas ou falsificações de marcas de luxo</li>
                <li>⚠️ Peças de moda íntima, biquínis usados ou pijamas usados</li>
                <li>⚠️ Roupas alteradas ou costuradas sem acabamento profissional</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  `;
}

export function setupConsignListeners() {
  const qtyInput = document.getElementById('calc-qty');
  const catInput = document.getElementById('calc-category');
  const qtyDisplay = document.getElementById('calc-qty-display');
  const totalDisplay = document.getElementById('calc-total');

  function updateCalc() {
    if (!qtyInput || !catInput || !qtyDisplay || !totalDisplay) return;
    const qty = parseInt(qtyInput.value, 10);
    const avgPrice = parseFloat(catInput.value);
    const total = qty * avgPrice;
    qtyDisplay.textContent = `${qty} ${qty === 1 ? 'peça' : 'peças'}`;
    totalDisplay.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
  }

  if (qtyInput) qtyInput.addEventListener('input', updateCalc);
  if (catInput) catInput.addEventListener('change', updateCalc);

  const form = document.getElementById('consign-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Solicitação de desapego recebida! Entraremos em contato em até 48h. 💌');
      form.reset();
    });
  }
}
