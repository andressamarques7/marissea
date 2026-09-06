/**
 * Marissea - Public Website Application Logic
 * Modern, responsive catalog & editorial experience
 */

document.addEventListener('DOMContentLoaded', () => {
  const store = window.marisseaStore;
  if (!store) {
    console.error('Store não encontrado.');
    return;
  }

  // Estado da interface pública
  let currentCategory = 'todos';
  let searchQuery = '';
  let activeProduct = null;

  // Elementos do DOM
  const elements = {
    // Header & Brand
    headerLogo: document.getElementById('headerLogo'),
    footerLogo: document.getElementById('footerLogo'),
    mobileMenu: document.getElementById('mobileMenu'),
    mobileMenuToggle: document.getElementById('mobileMenuToggle'),
    mobileMenuClose: document.getElementById('mobileMenuClose'),
    
    // Hero
    heroTitle: document.getElementById('heroTitle'),
    heroSubtitle: document.getElementById('heroSubtitle'),
    heroButton: document.getElementById('heroButton'),
    heroImage: document.getElementById('heroImage'),
    heroBadge: document.getElementById('heroBadge'),
    
    // Catalog
    categoryTabs: document.getElementById('categoryTabs'),
    productGrid: document.getElementById('productGrid'),
    productCount: document.getElementById('productCount'),
    searchInput: document.getElementById('searchInput'),
    
    // Product Modal
    productModal: document.getElementById('productModal'),
    modalClose: document.getElementById('modalClose'),
    modalMainImage: document.getElementById('modalMainImage'),
    modalThumbs: document.getElementById('modalThumbs'),
    modalTitle: document.getElementById('modalTitle'),
    modalRef: document.getElementById('modalRef'),
    modalCategory: document.getElementById('modalCategory'),
    modalPrice: document.getElementById('modalPrice'),
    modalDescription: document.getElementById('modalDescription'),
    modalComposition: document.getElementById('modalComposition'),
    modalSizes: document.getElementById('modalSizes'),
    modalColors: document.getElementById('modalColors'),
    modalInterestBtn: document.getElementById('modalInterestBtn'),
    modalShareBtn: document.getElementById('modalShareBtn'),
    
    // About
    aboutQuote: document.getElementById('aboutQuote'),
    aboutTitle: document.getElementById('aboutTitle'),
    aboutSubtitle: document.getElementById('aboutSubtitle'),
    aboutP1: document.getElementById('aboutP1'),
    aboutP2: document.getElementById('aboutP2'),
    aboutP3: document.getElementById('aboutP3'),
    aboutImg1: document.getElementById('aboutImg1'),
    aboutImg2: document.getElementById('aboutImg2'),

    // Editorial
    editorialGrid: document.getElementById('editorialGrid'),
    articleModal: document.getElementById('articleModal'),
    articleModalClose: document.getElementById('articleModalClose'),
    articleTitle: document.getElementById('articleTitle'),
    articleMeta: document.getElementById('articleMeta'),
    articleImage: document.getElementById('articleImage'),
    articleBody: document.getElementById('articleBody'),

    // Contact & Footer
    catalogConciergeWhatsapp: document.getElementById('catalogConciergeWhatsapp'),
    contactWhatsappLink: document.getElementById('contactWhatsappLink'),
    contactWhatsappText: document.getElementById('contactWhatsappText'),
    contactInstagramLink: document.getElementById('contactInstagramLink'),
    contactInstagramText: document.getElementById('contactInstagramText'),
    contactEmailLink: document.getElementById('contactEmailLink'),
    contactEmailText: document.getElementById('contactEmailText'),
    contactLocationText: document.getElementById('contactLocationText'),
    footerTagline: document.getElementById('footerTagline'),
    
    // Toast
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toastMessage')
  };

  // Funções Auxiliares
  const formatCurrency = (val) => {
    if (val === null || val === undefined || isNaN(val)) return '';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const showToast = (message) => {
    if (!elements.toast) return;
    elements.toastMessage.textContent = message;
    elements.toast.classList.add('show');
    setTimeout(() => {
      elements.toast.classList.remove('show');
    }, 3500);
  };

  // ==========================================
  // RENDERIZAÇÃO GERAL
  // ==========================================

  function renderBrandInfo() {
    const info = store.getBrandInfo();
    
    // Logos
    if (elements.headerLogo) elements.headerLogo.src = info.logoNavy || 'assets/images/logo-navy.png';
    if (elements.footerLogo) elements.footerLogo.src = info.logoCream || 'assets/images/logo-cream.png';

    // Hero
    if (elements.heroTitle) elements.heroTitle.textContent = info.heroTitle;
    if (elements.heroSubtitle) elements.heroSubtitle.textContent = info.heroSubtitle;
    if (elements.heroButton) elements.heroButton.textContent = info.heroButtonText || 'Conheça a Coleção';
    if (elements.heroBadge) elements.heroBadge.textContent = info.heroBadge || 'Coleção 2026';
    if (elements.heroImage) {
      elements.heroImage.src = info.heroImage;
      elements.heroImage.alt = info.heroTitle;
    }

    // Sobre
    if (elements.aboutQuote) elements.aboutQuote.textContent = `“${info.manifestoQuote}”`;
    if (elements.aboutTitle) elements.aboutTitle.textContent = info.aboutTitle;
    if (elements.aboutSubtitle) elements.aboutSubtitle.textContent = info.aboutSubtitle;
    if (elements.aboutP1) elements.aboutP1.textContent = info.aboutParagraph1;
    if (elements.aboutP2) elements.aboutP2.textContent = info.aboutParagraph2;
    if (elements.aboutP3) elements.aboutP3.textContent = info.aboutParagraph3;
    if (elements.aboutImg1) elements.aboutImg1.src = info.aboutImage1;
    if (elements.aboutImg2) elements.aboutImg2.src = info.aboutImage2;

    // Contato
    if (elements.contactWhatsappText) elements.contactWhatsappText.textContent = info.whatsappFormatted || info.whatsappNumber;
    const cleanPhone = (info.whatsappNumber || '').replace(/\D/g, '');
    const defaultWhatsappUrl = `https://wa.me/${cleanPhone}?text=Ol%C3%A1%2C%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20as%20pe%C3%A7as%20Marissea.`;
    if (elements.contactWhatsappLink) elements.contactWhatsappLink.href = defaultWhatsappUrl;
    if (elements.catalogConciergeWhatsapp) elements.catalogConciergeWhatsapp.href = defaultWhatsappUrl;
    if (elements.contactInstagramText) elements.contactInstagramText.textContent = `@${info.instagramHandle}`;
    if (elements.contactInstagramLink) elements.contactInstagramLink.href = info.instagramUrl || `https://instagram.com/${info.instagramHandle}`;
    if (elements.contactEmailText) elements.contactEmailText.textContent = info.email;
    if (elements.contactEmailLink) elements.contactEmailLink.href = `mailto:${info.email}`;
    if (elements.contactLocationText) elements.contactLocationText.textContent = info.boutiqueLocation;
    if (elements.footerTagline) elements.footerTagline.textContent = info.tagline;
  }

  function renderCategoryTabs() {
    if (!elements.categoryTabs) return;
    const categories = store.getCategories();
    
    elements.categoryTabs.innerHTML = categories.map(cat => `
      <button 
        class="category-tab ${cat.id === currentCategory ? 'active' : ''}" 
        data-cat-id="${cat.id}">
        ${cat.name}
      </button>
    `).join('');

    // Eventos de clique nas categorias
    elements.categoryTabs.querySelectorAll('.category-tab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        currentCategory = e.currentTarget.dataset.catId;
        elements.categoryTabs.querySelectorAll('.category-tab').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        renderCatalog();
      });
    });
  }

  function renderCatalog() {
    if (!elements.productGrid) return;
    const allProducts = store.getProducts();
    
    // Filtragem por categoria e busca
    const filtered = allProducts.filter(item => {
      // Categoria
      let matchesCat = true;
      if (currentCategory === 'novidades') {
        matchesCat = !!item.isNew;
      } else if (currentCategory !== 'todos') {
        matchesCat = item.category === currentCategory;
      }
      
      // Busca
      let matchesSearch = true;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        matchesSearch = item.name.toLowerCase().includes(q) ||
                        item.description.toLowerCase().includes(q) ||
                        (item.ref && item.ref.toLowerCase().includes(q));
      }

      return matchesCat && matchesSearch;
    });

    if (elements.productCount) {
      elements.productCount.textContent = `${filtered.length} ${filtered.length === 1 ? 'modelo' : 'modelos'}`;
    }

    if (filtered.length === 0) {
      elements.productGrid.innerHTML = `
        <div class="col-span-full text-center py-20">
          <p class="font-serif-title text-2xl text-navy-main mb-2">Nenhum modelo encontrado</p>
          <p class="text-muted-custom text-sm">Tente selecionar outra categoria ou limpar a busca.</p>
        </div>
      `;
      return;
    }

    elements.productGrid.innerHTML = filtered.map(product => {
      const catObj = store.getCategories().find(c => c.id === product.category);
      const catLabel = catObj ? catObj.name : product.category;
      const secondaryImg = product.imageSecondary || product.imageMain;

      return `
        <article class="luxury-card group cursor-pointer flex flex-col" data-product-id="${product.id}">
          <!-- Imagem com proporção editorial 3:4 e troca suave -->
          <div class="product-card-img-container rounded-none mb-4 relative">
            <img src="${product.imageMain}" alt="${product.name}" loading="lazy" class="img-primary">
            <img src="${secondaryImg}" alt="${product.name}" loading="lazy" class="img-secondary">
            
            <!-- Badges -->
            <div class="absolute top-3 left-3 flex flex-col gap-1 z-10">
              ${product.isNew ? `<span class="badge-luxury badge-new">Novo</span>` : ''}
              ${product.isFeatured ? `<span class="badge-luxury badge-featured">Destaque</span>` : ''}
            </div>

            <!-- Botão Ver Detalhes Flutuante no Hover -->
            <div class="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center z-10">
              <span class="btn-luxury-light text-[11px] py-2.5 px-5 tracking-luxury">Ver Detalhes</span>
            </div>
          </div>

          <!-- Informações do Card -->
          <div class="flex flex-col flex-grow text-center px-1">
            <span class="text-[11px] uppercase tracking-luxury text-muted-custom mb-1">${catLabel}</span>
            <h3 class="font-serif-title text-lg text-navy-main font-normal tracking-wide group-hover:text-navy-vivid transition-colors duration-300 mb-1.5 line-clamp-1">
              ${product.name}
            </h3>
            <p class="text-xs text-muted-custom line-clamp-2 font-serif-body italic mb-2 leading-relaxed">
              ${product.description}
            </p>
            ${product.showPrice && product.price ? `
              <p class="text-sm font-medium text-navy-main mt-auto tracking-wide">
                ${formatCurrency(product.price)}
              </p>
            ` : ''}
          </div>
        </article>
      `;
    }).join('');

    // Eventos de clique nos cards para abrir modal
    elements.productGrid.querySelectorAll('.luxury-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.productId;
        openProductModal(id);
      });
    });
  }

  // ==========================================
  // MODAL DE PRODUTO ("QUICK VIEW & EXPERIÊNCIA")
  // ==========================================

  function openProductModal(productId) {
    const product = store.getProductById(productId);
    if (!product) return;
    activeProduct = product;

    // Atualizar dados no modal
    elements.modalTitle.textContent = product.name;
    elements.modalRef.textContent = `REF: ${product.ref || 'MAR-' + product.id}`;
    
    const catObj = store.getCategories().find(c => c.id === product.category);
    elements.modalCategory.textContent = catObj ? catObj.name : product.category;

    if (product.showPrice && product.price) {
      elements.modalPrice.textContent = formatCurrency(product.price);
      elements.modalPrice.classList.remove('hidden');
    } else {
      elements.modalPrice.classList.add('hidden');
    }

    elements.modalDescription.textContent = product.description;
    elements.modalComposition.textContent = product.composition || 'Linho puro nobre e acabamentos de alfaiataria fina.';

    // Imagem Principal
    elements.modalMainImage.src = product.imageMain;
    elements.modalMainImage.alt = product.name;

    // Miniaturas
    const images = [product.imageMain];
    if (product.imageSecondary && product.imageSecondary !== product.imageMain) {
      images.push(product.imageSecondary);
    }
    if (product.extraImages && Array.isArray(product.extraImages)) {
      images.push(...product.extraImages);
    }

    elements.modalThumbs.innerHTML = images.map((imgSrc, idx) => `
      <button class="w-16 h-20 border ${idx === 0 ? 'border-navy-main' : 'border-transparent'} hover:opacity-80 transition-all overflow-hidden flex-shrink-0" data-img-src="${imgSrc}">
        <img src="${imgSrc}" class="w-full h-full object-cover">
      </button>
    `).join('');

    elements.modalThumbs.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const src = e.currentTarget.dataset.imgSrc;
        elements.modalMainImage.src = src;
        elements.modalThumbs.querySelectorAll('button').forEach(b => b.classList.replace('border-navy-main', 'border-transparent'));
        e.currentTarget.classList.replace('border-transparent', 'border-navy-main');
      });
    });

    // Tamanhos
    if (product.sizes && product.sizes.length > 0) {
      elements.modalSizes.innerHTML = product.sizes.map(size => `
        <span class="px-3.5 py-1.5 border border-hairline text-xs tracking-wider text-navy-main bg-white/70 font-medium">
          ${size}
        </span>
      `).join('');
    } else {
      elements.modalSizes.innerHTML = `<span class="text-xs text-muted-custom">Tamanho sob medida / Único</span>`;
    }

    // Cores
    if (product.colors && product.colors.length > 0) {
      elements.modalColors.innerHTML = product.colors.map(col => `
        <div class="flex items-center gap-2" title="${col.name}">
          <span class="w-5 h-5 rounded-full border border-black/10 shadow-sm" style="background-color: ${col.hex || '#ffffff'}"></span>
          <span class="text-xs text-muted-custom">${col.name}</span>
        </div>
      `).join('');
    } else {
      elements.modalColors.innerHTML = `<span class="text-xs text-muted-custom">Consulte cartela disponível</span>`;
    }

    // Botão de Interesse com WhatsApp
    const info = store.getBrandInfo();
    const cleanPhone = (info.whatsappNumber || '5511999998888').replace(/\D/g, '');
    const message = encodeURIComponent(`Olá, Marissea! Tenho grande interesse na peça "${product.name}" (${product.ref || 'Catálogo'}). Gostaria de saber mais sobre a disponibilidade e atendimento.`);
    elements.modalInterestBtn.href = `https://wa.me/${cleanPhone}?text=${message}`;

    // Abrir Modal
    elements.productModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeProductModal() {
    if (elements.productModal) {
      elements.productModal.classList.remove('active');
      document.body.style.overflow = '';
      activeProduct = null;
    }
  }

  // ==========================================
  // EDITORIAL / JOURNAL
  // ==========================================

  function renderEditorial() {
    if (!elements.editorialGrid) return;
    const articles = store.getArticles();

    elements.editorialGrid.innerHTML = articles.map(art => `
      <article class="group cursor-pointer flex flex-col bg-white border border-hairline overflow-hidden hover:shadow-lg transition-all duration-500" data-article-id="${art.id}">
        <div class="overflow-hidden relative h-64 sm:h-72">
          <img src="${art.coverImage}" alt="${art.title}" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105">
          <div class="absolute top-4 left-4 bg-navy-main text-ivory text-[10px] tracking-luxury py-1 px-3">
            ${art.category}
          </div>
        </div>
        <div class="p-6 sm:p-8 flex flex-col flex-grow">
          <span class="text-[11px] text-muted-custom tracking-wider uppercase mb-2">${art.date}</span>
          <h3 class="font-serif-title text-xl text-navy-main mb-3 group-hover:text-navy-vivid transition-colors">
            ${art.title}
          </h3>
          <p class="text-xs sm:text-sm text-muted-custom line-clamp-3 leading-relaxed mb-6 font-serif-body">
            ${art.subtitle}
          </p>
          <div class="mt-auto flex items-center text-xs tracking-luxury text-navy-main font-semibold group-hover:translate-x-1 transition-transform">
            Ler Artigo Completo &rarr;
          </div>
        </div>
      </article>
    `).join('');

    elements.editorialGrid.querySelectorAll('article').forEach(card => {
      card.addEventListener('click', () => {
        openArticleModal(card.dataset.articleId);
      });
    });
  }

  function openArticleModal(articleId) {
    const article = store.getArticleById(articleId);
    if (!article) return;

    elements.articleTitle.textContent = article.title;
    elements.articleMeta.textContent = `${article.category} • ${article.date} • ${article.author}`;
    elements.articleImage.src = article.coverImage;
    
    // Conteúdo formatado
    if (Array.isArray(article.content)) {
      elements.articleBody.innerHTML = article.content.map(p => `
        <p class="text-base text-charcoal leading-relaxed mb-6 font-serif-body text-justify sm:text-left">${p}</p>
      `).join('');
    } else {
      elements.articleBody.innerHTML = `<p class="text-base text-charcoal leading-relaxed font-serif-body">${article.content}</p>`;
    }

    elements.articleModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeArticleModal() {
    if (elements.articleModal) {
      elements.articleModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // ==========================================
  // EVENT LISTENERS & INICIALIZAÇÃO
  // ==========================================

  // Fechar modais
  if (elements.modalClose) elements.modalClose.addEventListener('click', closeProductModal);
  if (elements.productModal) {
    elements.productModal.addEventListener('click', (e) => {
      if (e.target === elements.productModal) closeProductModal();
    });
  }

  if (elements.articleModalClose) elements.articleModalClose.addEventListener('click', closeArticleModal);
  if (elements.articleModal) {
    elements.articleModal.addEventListener('click', (e) => {
      if (e.target === elements.articleModal) closeArticleModal();
    });
  }

  // Tecla Esc fecha modais
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProductModal();
      closeArticleModal();
    }
  });

  // Compartilhar peça
  if (elements.modalShareBtn) {
    elements.modalShareBtn.addEventListener('click', () => {
      if (!activeProduct) return;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
        showToast('Link da peça copiado para a área de transferência!');
      } else {
        showToast('Modelo selecionado: ' + activeProduct.name);
      }
    });
  }

  // Busca em tempo real
  if (elements.searchInput) {
    elements.searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderCatalog();
    });
  }

  // Menu Mobile
  if (elements.mobileMenuToggle && elements.mobileMenu) {
    elements.mobileMenuToggle.addEventListener('click', () => {
      elements.mobileMenu.classList.toggle('hidden');
    });
  }
  if (elements.mobileMenuClose && elements.mobileMenu) {
    elements.mobileMenuClose.addEventListener('click', () => {
      elements.mobileMenu.classList.add('hidden');
    });
  }

  // Fechar menu mobile ao clicar em links
  document.querySelectorAll('#mobileMenu a').forEach(link => {
    link.addEventListener('click', () => {
      if (elements.mobileMenu) elements.mobileMenu.classList.add('hidden');
    });
  });

  // Header scroll shadow
  window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (header) {
      if (window.scrollY > 30) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }
    }
  });

  // Re-renderização reativa em caso de atualização via Store ou outra aba
  window.addEventListener('marissea:store_updated', () => {
    renderBrandInfo();
    renderCategoryTabs();
    renderCatalog();
    renderEditorial();
  });

  // Render inicial
  renderBrandInfo();
  renderCategoryTabs();
  renderCatalog();
  renderEditorial();
});
