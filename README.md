# EstiloBazar — E-Commerce & Backoffice de Moda Circular (Second-Hand)

![EstiloBazar Banner](https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80)

Plataforma Web completa de E-Commerce e Painel Administrativo Backoffice desenvolvida para **EstiloBazar** — brechó de moda circular com curadoria de marcas renomadas (*Farm, Zara, Levi's, Animale, Osklen, Arezzo*).

---

## 🌟 Destaques & Funcionalidades

### 🛍️ E-Commerce Público (SPA Client-Side)
- **Navegação & Roteamento**: Roteador baseado em hash (`#home`, `#loja`, `#quero-vender`, `#sobre`, `#blog`, `#faq`, `#pedidos`).
- **Catálogo Garimpado**: Filtros dinâmicos em tempo real por Categoria, Marca, Tamanho, Faixa de Preço, Estado da Peça e Busca textual com animação em onda (*Stagger Entrance*).
- **Checkout Integrado (3 Etapas)**:
  1. Dados do cliente e CEP (autocompletar via ViaCEP).
  2. Opções de frete (PAC / SEDEX / Frete Grátis acima de R$ 250).
  3. Pagamento via **PIX (com 5% OFF, QR Code e Copia e Cola)** ou **Cartão de Crédito em até 6x**.
  4. Geração de pedido com código de rastreio exclusivo (`#EB-8492`).
- **Rastreamento de Pedidos**: Timeline de status em tempo real (*Pedido Criado ➔ Em Separação ➔ Enviado*).
- **Notificações de Prova Social**: Popups de compras recentes em tempo real para aumento de conversão.
- **Design System & UX**: Estilo Pastel & Glassmorphism, micro-interações táteis, modais com física de mola e responsividade total.

### 🔐 Backoffice Administrativo (`#admin`)
- **Autenticação de Segurança**: Login restrito via Firebase Auth (`email/senha`).
- **Dashboard com Métricas**: Métricas do acervo em tempo real (Total de Peças, Destaques, Preço Médio e Achados < R$ 99).
- **CRUD Completo no Firestore**: Cadastrar novos garimpos, editar valores/tamanhos e excluir peças.
- **Upload de Fotos (Storage)**: Envio direto de imagens para o Firebase Storage com preview instantâneo.
- **Botão de Semeamento (Seed)**: Importação de acervo inicial com 1 clique.

### 🚀 Landing Page "Em Breve" & Captura VIP
- Landing page isolada para modo de manutenção com formulário de **Captação de Leads VIP (Cupom 10% OFF)** integrado ao Firestore.
- **Modo Prévia (`#preview`)**: Navegação de teste persistente por sessão para o proprietário validar a loja sem expor ao público.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Vanilla JavaScript (ES6+), HTML5 Semântico, CSS3 (Custom Properties, Glassmorphism, CSS Grid & Flexbox).
- **Build Tool**: [Vite 5](https://vitejs.dev/) (ES Modules & Fast HMR).
- **Cloud & Backend (Serverless)**:
  - **Firebase Auth**: Gestão de sessões administrativas.
  - **Cloud Firestore**: Banco de dados NoSQL em tempo real.
  - **Firebase Storage**: Hospedagem de imagens de alta resolução.
  - **Firebase Hosting**: CDN global com SSL automático.

---

## 🏗️ Estrutura do Projeto

```
estilobazar/
├── public/
│   ├── favicon.svg
│   └── logo-mark-trans.png       # Logo Monograma EB Transparente
├── src/
│   ├── css/
│   │   ├── variables.css         # Design Tokens & Palette Pastel
│   │   ├── global.css            # Base & Keyframe Animations
│   │   ├── components.css        # Cards, Buttons, Modals, Badges
│   │   └── layout.css            # Header, TopBar, Footer, Grid Layout
│   ├── js/
│   │   ├── components/           # Componentes Modulares da Aplicação
│   │   │   ├── adminLogin.js     # Login Admin
│   │   │   ├── adminPanel.js     # Backoffice Dashboard & CRUD
│   │   │   ├── catalog.js        # Catálogo & Filtros em Onda
│   │   │   ├── checkoutModal.js  # Flow de Checkout em 3 Passos
│   │   │   ├── comingSoon.js     # Landing Page Em Breve & Leads VIP
│   │   │   ├── header.js         # Navigation Header & Mega-Menu
│   │   │   ├── highlights.js     # Carrossel Destaques
│   │   │   ├── modal.js          # Modal de Detalhes da Peça
│   │   │   └── ...
│   │   ├── services/
│   │   │   └── productService.js # Camada de Serviço Firestore & Storage
│   │   ├── utils/
│   │   │   ├── auth.js           # Auth Manager
│   │   │   ├── firebase.js       # Firebase App SDK Init
│   │   │   ├── router.js         # Client-side Hash Router
│   │   │   └── storage.js        # LocalStorage Manager (Cart & Favs)
│   │   ├── data/
│   │   │   └── products.js       # Mock & Static Datasets Fallback
│   │   └── main.js               # Entry Point & App Lifecycle
├── .env.example                  # Modelo de Variáveis de Ambiente
├── package.json
└── vite.config.js
```

---

## ⚡ Como Rodar Localmente

1. **Clonar o repositório**:
   ```bash
   git clone https://github.com/seu-usuario/estilobazar.git
   cd estilobazar
   ```

2. **Instalar as dependências**:
   ```bash
   npm install
   ```

3. **Configurar as Variáveis de Ambiente**:
   Crie um arquivo `.env` na raiz baseado no `.env.example` e adicione suas chaves do Firebase:
   ```env
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_PROJECT_ID=your_project_id
   ...
   ```

4. **Executar o Servidor de Desenvolvimento**:
   ```bash
   npm run dev
   ```
   Acesse no navegador: `http://localhost:3000`

---

## 📄 Licença
Este projeto é licenciado sob a Licença MIT.
