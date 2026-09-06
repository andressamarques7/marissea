/**
 * Marissea - State & Data Store
 * Gestão de dados persistentes no navegador (localStorage)
 * Suporte completo para catálogo, CMS, backups e futura expansão para e-commerce.
 */

const STORAGE_KEYS = {
  PRODUCTS: 'marissea_products',
  CATEGORIES: 'marissea_categories',
  BRAND_INFO: 'marissea_brand_info',
  ARTICLES: 'marissea_articles',
  AUTH_SESSION: 'marissea_auth_token'
};

// Seed de dados iniciais refinados (Quiet Luxury & Resort Atemporal)
const DEFAULT_BRAND_INFO = {
  brandName: 'Marissea',
  tagline: 'Elegância que transcende temporadas.',
  logoNavy: 'assets/images/logo-navy.png',
  logoCream: 'assets/images/logo-cream.png',
  logoOriginal: 'assets/images/logo-original.jpg',
  
  // Hero Section
  heroTitle: 'Elegância que transcende temporadas.',
  heroSubtitle: 'Alta alfaiataria feminina em fibras nobres. A união serena entre o Quiet Luxury e a brisa atemporal do litoral mediterrâneo.',
  heroButtonText: 'Conheça a Coleção',
  heroImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop',
  heroSecondaryImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
  heroBadge: 'Coleção Riviera 2026',

  // Manifesto & Sobre
  manifestoQuote: 'O luxo autêntico não grita. Ele se revela na pureza do corte, na nobreza da matéria-prima e na serenidade de quem sabe quem é.',
  aboutTitle: 'A Essência Marissea',
  aboutSubtitle: 'Atemporalidade, despojamento refinado e feminilidade discreta.',
  aboutParagraph1: 'A Marissea nasce da convicção de que a verdadeira sofisticação reside na sutileza e na permanência. Inspirada pelo ritmo compassado dos mais exclusivos balneários do Mediterrâneo, nossa marca veste a mulher que aprecia a distinção sem ostentação.',
  aboutParagraph2: 'Nossa criação prioriza matérias-primas puras e nobres: o linho europeu pré-lavado, a seda lavada de gramatura impecável e o algodão de fibra longa. Cada peça é lapidada com alfaiataria precisa, desenvolvida para fluir naturalmente com o corpo e acompanhar momentos que vão de um almoço ao ar livre a noites inesquecíveis.',
  aboutParagraph3: 'O mar, para nós, é um horizonte de serenidade. Ele não surge de forma óbvia ou temática, mas na leveza do movimento, nas linhas orgânicas e na elegância do azul-marinho que ancora nossa identidade.',
  aboutImage1: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200&auto=format&fit=crop',
  aboutImage2: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop',

  // Contatos
  whatsappNumber: '5511999998888',
  whatsappFormatted: '(11) 99999-8888',
  instagramHandle: 'marissea.oficial',
  instagramUrl: 'https://instagram.com',
  email: 'concierge@marissea.com.br',
  boutiqueLocation: 'Atendimento Exclusivo sob agendamento | Jardins, São Paulo'
};

const DEFAULT_CATEGORIES = [
  { id: 'todos', name: 'Todos os Modelos', slug: 'todos' },
  { id: 'novidades', name: 'Novidades', slug: 'novidades' },
  { id: 'vestidos', name: 'Vestidos', slug: 'vestidos' },
  { id: 'conjuntos', name: 'Conjuntos', slug: 'conjuntos' },
  { id: 'tops', name: 'Tops & Camisas', slug: 'tops' },
  { id: 'saias', name: 'Saias & Calças', slug: 'saias' },
  { id: 'resort', name: 'Linha Resort', slug: 'resort' },
  { id: 'acessorios', name: 'Acessórios', slug: 'acessorios' }
];

const DEFAULT_PRODUCTS = [
  {
    id: 'prod-101',
    ref: 'MAR-101',
    name: 'Vestido Midi Riviera em Linho Puro',
    category: 'vestidos',
    price: 1280.00,
    showPrice: true,
    isNew: true,
    isFeatured: true,
    order: 1,
    imageMain: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1200&auto=format&fit=crop',
    imageSecondary: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1200&auto=format&fit=crop',
    description: 'Silhueta fluida com decote sutil em V, fenda lateral discreta e caimento impecável. Feito com linho nobre de toque macio, ideal para dias ensolarados com brisa fresca.',
    composition: '100% Linho Europeu Puro com forro interno 100% Algodão Pima.',
    sizes: ['PP', 'P', 'M', 'G'],
    colors: [
      { name: 'Azul Marissea', hex: '#0B2545' },
      { name: 'Off-White Marfim', hex: '#F5F1E8' },
      { name: 'Areia Suave', hex: '#D6CBB8' }
    ]
  },
  {
    id: 'prod-102',
    ref: 'MAR-102',
    name: 'Conjunto Pantalona & Colete Capri',
    category: 'conjuntos',
    price: 1650.00,
    showPrice: true,
    isNew: true,
    isFeatured: true,
    order: 2,
    imageMain: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop',
    imageSecondary: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=1200&auto=format&fit=crop',
    description: 'Alfaiataria desconstruída de alto padrão. Colete com botões em madrepérola natural esculpida e calça pantalona com pregas clássicas de alfaiate.',
    composition: '85% Linho nobre especial, 15% Seda pura.',
    sizes: ['P', 'M', 'G'],
    colors: [
      { name: 'Marfim Cru', hex: '#FAF6EE' },
      { name: 'Azul Noturno Nobre', hex: '#112239' }
    ]
  },
  {
    id: 'prod-103',
    ref: 'MAR-103',
    name: 'Camisa Oversized em Algodão Pima e Seda',
    category: 'tops',
    price: 890.00,
    showPrice: true,
    isNew: false,
    isFeatured: true,
    order: 3,
    imageMain: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=1200&auto=format&fit=crop',
    imageSecondary: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop',
    description: 'Corte generoso inspirado na alfaiataria masculina tradicional, reimaginada com caimento drapeado sutil e toque acetinado revigorante.',
    composition: '75% Algodão Pima Peruano 120 fios, 25% Seda.',
    sizes: ['PP', 'P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Branco Quente', hex: '#FAF8F5' },
      { name: 'Azul Brisa Costeira', hex: '#C7D7E3' }
    ]
  },
  {
    id: 'prod-104',
    ref: 'MAR-104',
    name: 'Saia Evasê Amalfi com Cós Estruturado',
    category: 'saias',
    price: 1120.00,
    showPrice: true,
    isNew: true,
    isFeatured: false,
    order: 4,
    imageMain: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=1200&auto=format&fit=crop',
    imageSecondary: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?q=80&w=1200&auto=format&fit=crop',
    description: 'Movimento gracioso que acompanha cada passo. Cintura marcada com passantes duplos e cinto com fivela forrada no mesmo tecido nobre.',
    composition: '100% Linho Belga pré-amaciado.',
    sizes: ['PP', 'P', 'M', 'G'],
    colors: [
      { name: 'Bege Duna', hex: '#DFD7CB' },
      { name: 'Azul Marissea Profundo', hex: '#0A1C33' }
    ]
  },
  {
    id: 'prod-105',
    ref: 'MAR-105',
    name: 'Vestido Longo Saint-Tropez Silk Back',
    category: 'vestidos',
    price: 1890.00,
    showPrice: true,
    isNew: true,
    isFeatured: true,
    order: 5,
    imageMain: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1200&auto=format&fit=crop',
    imageSecondary: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop',
    description: 'Uma peça de imponência silenciosa. Decote nas costas com tiras finas de amarrar e corte no viés que abraça a silhueta com extrema delicadeza.',
    composition: '100% Crepe de Seda Natural de alta gramatura.',
    sizes: ['PP', 'P', 'M'],
    colors: [
      { name: 'Off-White Pérola', hex: '#F7F4EB' },
      { name: 'Azul Oceânico', hex: '#0C203B' }
    ]
  },
  {
    id: 'prod-106',
    ref: 'MAR-106',
    name: 'Kaftan de Seda Resort Portofino',
    category: 'resort',
    price: 1450.00,
    showPrice: true,
    isNew: true,
    isFeatured: true,
    order: 6,
    imageMain: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
    imageSecondary: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200&auto=format&fit=crop',
    description: 'A expressão máxima do luxo descontraído. Caimento etéreo, mangas amplas e transparência elegante para tardes à beira-mar ou jantares ao luar.',
    composition: '100% Chiffon de Seda Habotai Italiana.',
    sizes: ['Tamanho Único'],
    colors: [
      { name: 'Marfim & Brisa Marítima', hex: '#E2EBF1' },
      { name: 'Areia Dourada Suave', hex: '#EDE4D4' }
    ]
  },
  {
    id: 'prod-107',
    ref: 'MAR-107',
    name: 'Calça Cenoura em Linho e Algodão Atenas',
    category: 'saias',
    price: 980.00,
    showPrice: true,
    isNew: false,
    isFeatured: false,
    order: 7,
    imageMain: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?q=80&w=1200&auto=format&fit=crop',
    imageSecondary: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=1200&auto=format&fit=crop',
    description: 'Modelagem cenoura contemporânea com pregas frontais alinhadas e bolsos discretos. Transita com graça do dia a dia sofisticado à recepções de fim de tarde.',
    composition: '65% Linho, 35% Algodão sustentável penteado.',
    sizes: ['PP', 'P', 'M', 'G'],
    colors: [
      { name: 'Areia Molhada', hex: '#D2C7B4' },
      { name: 'Azul Marinho Marissea', hex: '#0B2545' }
    ]
  },
  {
    id: 'prod-108',
    ref: 'MAR-108',
    name: 'Echarpe em Seda Pura Linhas do Mar',
    category: 'acessorios',
    price: 540.00,
    showPrice: true,
    isNew: false,
    isFeatured: false,
    order: 8,
    imageMain: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=1200&auto=format&fit=crop',
    imageSecondary: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop',
    description: 'Estampa sutil com curvas delicadas inspiradas nas ondas do litoral. Acabamento primoroso com bainha francesa feita à mão.',
    composition: '100% Seda Twill Pura (90cm x 90cm).',
    sizes: ['90 x 90 cm'],
    colors: [
      { name: 'Azul & Marfim', hex: '#0A1830' }
    ]
  }
];

const DEFAULT_ARTICLES = [
  {
    id: 'art-1',
    title: 'O Manifesto do Linho Nobre: A Alma do Luxo Discreto',
    subtitle: 'Por que a nobreza das fibras naturais desafia a efemeridade das tendências passageiras.',
    category: 'Matéria & Concepção',
    date: 'Setembro, 2026',
    author: 'Equipe Editorial Marissea',
    coverImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200&auto=format&fit=crop',
    content: [
      'Na moda contemporânea, o verdadeiro luxo não busca aprovação ruidosa nem logotipos evidentes. Ele se expressa no toque, na gramatura exata do tecido e na sensação de conforto despretensioso que só as fibras naturais puras conseguem proporcionar.',
      'O linho cultivado na Europa carrega uma história milenar de sofisticação. Ao contrário dos tecidos sintéticos que perdem o viço com o tempo, o linho nobre ganha caráter e maciez a cada lavagem. O leve amassado natural do linho não é uma imperfeição — é a assinatura do despojamento elegante que define a estética Old Money.',
      'Na Marissea, selecionamos exclusivamente lotes com certificação de sustentabilidade e fiação de alta densidade. O resultado são peças que respiram com a pele, acompanhando com fluidez e dignidade a mulher que vive entre a cidade e o mar.'
    ]
  },
  {
    id: 'art-2',
    title: 'Brisa Mediterrânea: A Arquitetura do Verão Atemporal',
    subtitle: 'Uma imersão visual pelas enseadas de pedras calcárias, calmaria e paletas neutras.',
    category: 'Lifestyle & Inspirações',
    date: 'Agosto, 2026',
    author: 'Caderno de Inspirações',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    content: [
      'Existe uma luz particular que banha a costa do Mediterrâneo nas últimas horas da tarde: um dourado suave que reflete no azul-marinho profundo das águas e nas paredes caiadas de branco das vilas costeiras.',
      'Essa harmonia visual orienta cada cartela de cor da Marissea. Evitamos o exagero de tons estridentes em favor de azuis náuticos vívidos, beges que remetem à areia aquecida pelo sol e marfins que acolhem a luminosidade natural.',
      'Viver essa estética é compreender que a elegância mais marcante é aquela que parece ter acontecido sem esforço algum.'
    ]
  },
  {
    id: 'art-3',
    title: 'A Arte da Silhueta Perfeita: Menos Volume, Mais Presença',
    subtitle: 'Como a alfaiataria desconstruída redefine o guarda-roupa da mulher contemporânea.',
    category: 'Estilo & Silhuetas',
    date: 'Julho, 2026',
    author: 'Ateliê Marissea',
    coverImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop',
    content: [
      'Construir um acervo pessoal de roupas exige discernimento. A proposta da Marissea é oferecer silhuetas que não se esgotam em uma estação, permitindo composições versáteis e descomplicadas.',
      'Uma pantalona de corte impecável combinada a um colete de botões naturais transita do ambiente corporativo a um jantar na praia com uma simples troca de acessórios.',
      'Menos peças, materiais superiores e cortes que valorizam a postura natural da mulher. Essa é a essência do Quiet Luxury que cultivamos todos os dias.'
    ]
  }
];

class MarisseaStore {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      this.saveToStorage(STORAGE_KEYS.PRODUCTS, DEFAULT_PRODUCTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      this.saveToStorage(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.BRAND_INFO)) {
      this.saveToStorage(STORAGE_KEYS.BRAND_INFO, DEFAULT_BRAND_INFO);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ARTICLES)) {
      this.saveToStorage(STORAGE_KEYS.ARTICLES, DEFAULT_ARTICLES);
    }
  }

  saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
    this.notifyChange(key);
  }

  getFromStorage(key, fallback = null) {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error(`Erro ao decodificar ${key}:`, e);
      return fallback;
    }
  }

  notifyChange(key) {
    window.dispatchEvent(new CustomEvent('marissea:store_updated', { detail: { key } }));
  }

  // === PRODUTOS ===
  getProducts() {
    return this.getFromStorage(STORAGE_KEYS.PRODUCTS, DEFAULT_PRODUCTS);
  }

  getProductById(id) {
    const products = this.getProducts();
    return products.find(p => p.id === id) || null;
  }

  saveProduct(productData) {
    const products = this.getProducts();
    if (productData.id) {
      // Atualizar existente
      const idx = products.findIndex(p => p.id === productData.id);
      if (idx !== -1) {
        products[idx] = { ...products[idx], ...productData };
      } else {
        products.push(productData);
      }
    } else {
      // Criar novo
      const newId = 'prod-' + Date.now();
      const newProduct = {
        ...productData,
        id: newId,
        ref: productData.ref || 'MAR-' + Math.floor(100 + Math.random() * 900),
        order: products.length + 1
      };
      products.unshift(newProduct);
    }
    this.saveToStorage(STORAGE_KEYS.PRODUCTS, products);
    return true;
  }

  deleteProduct(id) {
    let products = this.getProducts();
    products = products.filter(p => p.id !== id);
    this.saveToStorage(STORAGE_KEYS.PRODUCTS, products);
    return true;
  }

  // === CATEGORIAS ===
  getCategories() {
    return this.getFromStorage(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
  }

  saveCategory(catData) {
    const categories = this.getCategories();
    if (catData.id) {
      const idx = categories.findIndex(c => c.id === catData.id);
      if (idx !== -1) {
        categories[idx] = { ...categories[idx], ...catData };
      }
    } else {
      const id = catData.slug || catData.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '-');
      categories.push({
        id,
        name: catData.name,
        slug: id
      });
    }
    this.saveToStorage(STORAGE_KEYS.CATEGORIES, categories);
    return true;
  }

  deleteCategory(id) {
    if (id === 'todos') return false; // Categoria raiz protegida
    let categories = this.getCategories();
    categories = categories.filter(c => c.id !== id);
    this.saveToStorage(STORAGE_KEYS.CATEGORIES, categories);
    return true;
  }

  // === INFORMAÇÕES DA MARCA & TEXTOS ===
  getBrandInfo() {
    return this.getFromStorage(STORAGE_KEYS.BRAND_INFO, DEFAULT_BRAND_INFO);
  }

  updateBrandInfo(partialInfo) {
    const current = this.getBrandInfo();
    const updated = { ...current, ...partialInfo };
    this.saveToStorage(STORAGE_KEYS.BRAND_INFO, updated);
    return updated;
  }

  // === EDITORIAL / JOURNAL ===
  getArticles() {
    return this.getFromStorage(STORAGE_KEYS.ARTICLES, DEFAULT_ARTICLES);
  }

  getArticleById(id) {
    const articles = this.getArticles();
    return articles.find(a => a.id === id) || null;
  }

  saveArticle(articleData) {
    const articles = this.getArticles();
    if (articleData.id) {
      const idx = articles.findIndex(a => a.id === articleData.id);
      if (idx !== -1) {
        articles[idx] = { ...articles[idx], ...articleData };
      }
    } else {
      const newArticle = {
        ...articleData,
        id: 'art-' + Date.now(),
        date: articleData.date || new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(new Date())
      };
      articles.unshift(newArticle);
    }
    this.saveToStorage(STORAGE_KEYS.ARTICLES, articles);
    return true;
  }

  deleteArticle(id) {
    let articles = this.getArticles();
    articles = articles.filter(a => a.id !== id);
    this.saveToStorage(STORAGE_KEYS.ARTICLES, articles);
    return true;
  }

  // === BACKUP & RESTAURAÇÃO ===
  exportData() {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      brandInfo: this.getBrandInfo(),
      categories: this.getCategories(),
      products: this.getProducts(),
      articles: this.getArticles()
    };
    return JSON.stringify(data, null, 2);
  }

  importData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.brandInfo) this.saveToStorage(STORAGE_KEYS.BRAND_INFO, data.brandInfo);
      if (data.categories) this.saveToStorage(STORAGE_KEYS.CATEGORIES, data.categories);
      if (data.products) this.saveToStorage(STORAGE_KEYS.PRODUCTS, data.products);
      if (data.articles) this.saveToStorage(STORAGE_KEYS.ARTICLES, data.articles);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  resetDefaults() {
    this.saveToStorage(STORAGE_KEYS.BRAND_INFO, DEFAULT_BRAND_INFO);
    this.saveToStorage(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
    this.saveToStorage(STORAGE_KEYS.PRODUCTS, DEFAULT_PRODUCTS);
    this.saveToStorage(STORAGE_KEYS.ARTICLES, DEFAULT_ARTICLES);
    return true;
  }

  // === AUTENTICAÇÃO SIMULADA DE SEGURANÇA ===
  login(username, password) {
    // Credenciais solicitadas
    if (username.trim().toLowerCase() === 'andressa marques' && password === 'Andressa2026') {
      const token = 'auth_' + Math.random().toString(36).substring(2) + Date.now();
      sessionStorage.setItem(STORAGE_KEYS.AUTH_SESSION, token);
      return { success: true, token };
    }
    return { success: false, message: 'Usuário ou senha incorretos.' };
  }

  isLoggedIn() {
    return !!sessionStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
  }

  logout() {
    sessionStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
  }
}

// Instância singleton global acessível por qualquer script
window.marisseaStore = new MarisseaStore();
