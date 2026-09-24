export const products = [];

export const categories = [
  "Todos",
  "Vestidos",
  "Blusas",
  "Calças",
  "Coletes",
  "Shorts",
  "Bermudas",
  "Conjuntos",
  "Saias",
  "Jaquetas",
  "Calçados",
  "Acessórios"
];

export const sizes = ["Todos", "PP", "P", "M", "G", "37", "Único"];

export const priceRanges = [
  { label: "Todos os Preços", min: 0, max: Infinity },
  { label: "Até R$ 99 (Pechinchas)", min: 0, max: 99 },
  { label: "R$ 100 - R$ 199", min: 100, max: 199 },
  { label: "Acima de R$ 200", min: 200, max: Infinity }
];

export const conditions = ["Todas", "Como Nova", "Seminova / Seda", "Seminova / Couro", "Seminovo", "Excelente", "Vintage Raro", "Ótimo Estado"];

export const brands = ["Todas", "Zara", "Farm", "Arezzo", "Animale", "Osklen", "Levi's", "Adidas", "Eloíse Vintage"];

// Social Proof Purchases Data
export const recentPurchases = [
  { name: "Beatriz S.", city: "São Paulo, SP", item: "Vestido Floral Vintage 70s", time: "há 2 minutos", avatar: "👗" },
  { name: "Mariana C.", city: "Curitiba, PR", item: "Jaqueta Jeans Levi's", time: "há 5 minutos", avatar: "🧥" },
  { name: "Camila F.", city: "Rio de Janeiro, RJ", item: "Blazer Linho Fendi", time: "há 12 minutos", avatar: "✨" },
  { name: "Fernanda M.", city: "Belo Horizonte, MG", item: "Bolsa de Couro Arezzo", time: "há 18 minutos", avatar: "👜" },
  { name: "Juliana R.", city: "Porto Alegre, RS", item: "Tênis Retro Adidas", time: "há 24 minutos", avatar: "👟" }
];

// Blog Posts Data
export const blogPosts = [
  {
    id: "blog-1",
    title: "Como Cuidar e Preservar Peças de Seda e Linho Vintage",
    date: "14 de Agosto, 2026",
    readTime: "4 min de leitura",
    category: "Dicas de Cuidados",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80",
    summary: "Descubra os segredos da higienização a frio e armazenamento correto para manter suas peças únicas perfeitas por décadas."
  },
  {
    id: "blog-2",
    title: "Guia de Estilo: Como Combinar Peças Retro no Guarda-Roupa Moderno",
    date: "08 de Agosto, 2026",
    readTime: "5 min de leitura",
    category: "Tendências & Estilo",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
    summary: "Dicas práticas para integrar jaquetas estonadas, blazers oversized e vestidos 70s no seu visual do dia a dia."
  },
  {
    id: "blog-3",
    title: "Economia Circular na Moda: Por Que o Brechó É o Futuro",
    date: "01 de Agosto, 2026",
    readTime: "6 min de leitura",
    category: "Sustentabilidade",
    image: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?auto=format&fit=crop&w=800&q=80",
    summary: "Entenda o impacto ambiental positivo de escolher brechós e como a curadoria consciente transforma o consumo."
  }
];

// Testimonials Data
export const testimonials = [
  {
    id: "test-1",
    name: "Beatriz Silveira",
    city: "São Paulo, SP",
    role: "Cliente Fiel",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    comment: "Estou apaixonada pelas peças! O vestido floral chegou perfumado, impecável e exatamente como na foto. O atendimento e o cuidado na embalagem biodegradável me conquistaram!"
  },
  {
    id: "test-2",
    name: "Mariana Costa",
    city: "Curitiba, PR",
    role: "Vendedora / Desapego",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    comment: "Desapeguei de 12 peças do meu guarda-roupa pela curadoria do EstiloBazar. A avaliação foi super justa e recebi o PIX rapidamente. Recomendo demais!"
  },
  {
    id: "test-3",
    name: "Camila Fernandez",
    city: "Rio de Janeiro, RJ",
    role: "Cliente Fiel",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
    comment: "O blazer de linho curado virou a peça favorita do meu armário! A curadoria do EstiloBazar tem um bom gosto indiscutível. Já fiz 3 compras e todas perfeitas."
  }
];

// FAQ Data
export const faqItems = [
  {
    question: "Como funciona a higienização das peças do brechó?",
    answer: "Todas as nossas peças passam por um rigoroso processo de lavagem profissional com produtos ecológicos hipoalergênicos e higienização profunda a vapor a 120°C antes de irem para o site. Garantimos peças 100% limpas e prontas para uso!"
  },
  {
    question: "Quero vender minhas roupas. Como funciona o processo de desapego?",
    answer: "Você pode nos enviar fotos das peças pelo formulário 'Quero Vender' no site. Nossa equipe faz uma pré-avaliação em até 48h. Após aprovação e envio, você escolhe receber o pagamento via PIX ou em créditos na loja com 15% de bônus!"
  },
  {
    question: "Qual é o prazo e o valor do frete?",
    answer: "Oferecemos FRETE GRÁTIS para todo o Brasil em compras acima de R$ 250,00. O prazo de entrega varia de 2 a 7 dias úteis dependendo da sua região, com código de rastreamento enviado por e-mail e WhatsApp."
  },
  {
    question: "E se a peça não servir? Posso trocar ou devolver?",
    answer: "Sim! Garantimos o direito de troca ou devolução em até 7 dias corridos após o recebimento, sem complicações. Fornecemos uma etiqueta de logística reversa gratuita."
  },
  {
    question: "As peças são originais e possuem garantia de autenticidade?",
    answer: "Com certeza. Todas as marcas internacionais e peças de designer passam por verificação minuciosa de etiqueta, costuras e materiais por nossa especialista em autenticação de moda vintage."
  }
];

// Instagram Community Posts
export const instagramPosts = [
  {
    id: "insta-1",
    handle: "@clarah_style",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
    likes: 342,
    tag: "#EstiloBazar"
  },
  {
    id: "insta-2",
    handle: "@juliana.vintage",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80",
    likes: 512,
    tag: "#EstiloBazar"
  },
  {
    id: "insta-3",
    handle: "@luiza_look",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
    likes: 289,
    tag: "#EstiloBazar"
  },
  {
    id: "insta-4",
    handle: "@sophia.mode",
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80",
    likes: 418,
    tag: "#EstiloBazar"
  }
];
