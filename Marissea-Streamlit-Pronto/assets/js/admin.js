/**
 * Marissea - Painel Administrativo Visual (CMS)
 * Gerenciamento completo sem necessidade de tocar em código.
 */

document.addEventListener('DOMContentLoaded', () => {
  const store = window.marisseaStore;
  if (!store) {
    console.error('Store não encontrado.');
    return;
  }

  // Estado da Administração
  let currentTab = 'produtos';
  let editingProductId = null;
  let editingArticleId = null;
  let tempSizes = [];
  let tempColors = [];

  // Elementos da Auth
  const loginSection = document.getElementById('loginSection');
  const adminDashboard = document.getElementById('adminDashboard');
  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('loginError');
  const logoutBtn = document.getElementById('logoutBtn');

  // Elementos de Navegação do Painel
  const navTabs = document.querySelectorAll('.admin-nav-tab');
  const tabPanels = document.querySelectorAll('.admin-tab-panel');

  // Toast
  const adminToast = document.getElementById('adminToast');
  const adminToastMsg = document.getElementById('adminToastMsg');

  function showToast(msg, isError = false) {
    if (!adminToast) return;
    adminToastMsg.textContent = msg;
    adminToast.className = `toast-notification show ${isError ? 'bg-red-800' : 'bg-[#0B2545]'}`;
    setTimeout(() => {
      adminToast.classList.remove('show');
    }, 3500);
  }

  // ==========================================
  // AUTENTICAÇÃO
  // ==========================================

  function checkAuth() {
    if (store.isLoggedIn()) {
      loginSection.classList.add('hidden');
      adminDashboard.classList.remove('hidden');
      initDashboard();
    } else {
      loginSection.classList.remove('hidden');
      adminDashboard.classList.add('hidden');
    }
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = document.getElementById('loginUser').value;
      const pass = document.getElementById('loginPass').value;
      
      const result = store.login(user, pass);
      if (result.success) {
        loginError.classList.add('hidden');
        loginForm.reset();
        checkAuth();
        showToast('Login efetuado com sucesso! Bem-vinda, Andressa.');
      } else {
        loginError.textContent = result.message;
        loginError.classList.remove('hidden');
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      store.logout();
      checkAuth();
      showToast('Sessão encerrada.');
    });
  }

  // ==========================================
  // NAVEGAÇÃO DE ABAS
  // ==========================================

  function switchTab(tabId) {
    currentTab = tabId;
    navTabs.forEach(tab => {
      if (tab.dataset.tab === tabId) {
        tab.classList.add('bg-[#0B2545]', 'text-white');
        tab.classList.remove('text-[#0B2545]', 'hover:bg-black/5');
      } else {
        tab.classList.remove('bg-[#0B2545]', 'text-white');
        tab.classList.add('text-[#0B2545]', 'hover:bg-black/5');
      }
    });

    tabPanels.forEach(panel => {
      if (panel.id === `tab-${tabId}`) {
        panel.classList.remove('hidden');
      } else {
        panel.classList.add('hidden');
      }
    });

    // Renderizar dados da aba
    if (tabId === 'produtos') renderProductsTab();
    if (tabId === 'home') renderHomeTab();
    if (tabId === 'categorias') renderCategoriesTab();
    if (tabId === 'editorial') renderEditorialTab();
    if (tabId === 'sobre') renderAboutTab();
    if (tabId === 'contato') renderContactTab();
  }

  navTabs.forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });

  // ==========================================
  // INICIALIZAÇÃO DO DASHBOARD
  // ==========================================

  function initDashboard() {
    renderStats();
    switchTab('produtos');
  }

  function renderStats() {
    const products = store.getProducts();
    const categories = store.getCategories();
    const articles = store.getArticles();

    const statProds = document.getElementById('statTotalProducts');
    const statCats = document.getElementById('statTotalCategories');
    const statArts = document.getElementById('statTotalArticles');

    if (statProds) statProds.textContent = products.length;
    if (statCats) statCats.textContent = categories.length;
    if (statArts) statArts.textContent = articles.length;
  }

  // ==========================================
  // GESTÃO DE PRODUTOS
  // ==========================================

  const productModal = document.getElementById('productFormModal');
  const productForm = document.getElementById('productForm');
  const productModalTitle = document.getElementById('productModalTitle');
  const btnNewProduct = document.getElementById('btnNewProduct');
  const btnCloseProductModal = document.getElementById('btnCloseProductModal');
  const productsTableBody = document.getElementById('productsTableBody');
  const productSearch = document.getElementById('productSearchInput');

  function renderProductsTab() {
    renderStats();
    const products = store.getProducts();
    const categories = store.getCategories();
    const query = productSearch ? productSearch.value.toLowerCase().trim() : '';

    const filtered = products.filter(p => {
      if (!query) return true;
      return p.name.toLowerCase().includes(query) || (p.ref && p.ref.toLowerCase().includes(query));
    });

    if (!productsTableBody) return;

    if (filtered.length === 0) {
      productsTableBody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center py-12 text-[#6B7280]">
            Nenhum produto encontrado. Clique em "+ Novo Produto" para cadastrar.
          </td>
        </tr>
      `;
      return;
    }

    productsTableBody.innerHTML = filtered.map(prod => {
      const cat = categories.find(c => c.id === prod.category);
      const catName = cat ? cat.name : prod.category;
      const priceFormatted = prod.price ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(prod.price) : 'Sob Consulta';

      return `
        <tr class="border-b border-black/[0.06] hover:bg-black/[0.01] transition-colors">
          <td class="py-3 px-4">
            <div class="w-12 h-16 bg-[#ECE5DA] overflow-hidden">
              <img src="${prod.imageMain}" alt="${prod.name}" class="w-full h-full object-cover">
            </div>
          </td>
          <td class="py-3 px-4">
            <span class="block font-medium text-[#0B2545] text-sm">${prod.name}</span>
            <span class="text-[11px] text-[#6B7280] uppercase tracking-luxury">${prod.ref || 'REF: -'}</span>
          </td>
          <td class="py-3 px-4 text-xs text-[#22262B]">
            <span class="bg-[#F5EFE6] px-2.5 py-1 text-[#0B2545] border border-black/[0.05]">${catName}</span>
          </td>
          <td class="py-3 px-4 text-xs font-medium text-[#0B2545]">
            ${priceFormatted}
          </td>
          <td class="py-3 px-4">
            <div class="flex gap-1.5 flex-wrap">
              ${prod.isNew ? '<span class="text-[9px] uppercase px-1.5 py-0.5 bg-[#0B2545] text-white">Novo</span>' : ''}
              ${prod.isFeatured ? '<span class="text-[9px] uppercase px-1.5 py-0.5 bg-[#F5EFE6] text-[#0B2545] border border-black/10">Destaque</span>' : ''}
            </div>
          </td>
          <td class="py-3 px-4 text-right">
            <div class="inline-flex items-center gap-2">
              <button class="btn-edit-prod p-1.5 text-[#0B2545] hover:bg-black/5" data-id="${prod.id}" title="Editar Produto">
                <i data-lucide="edit-3" class="w-4 h-4"></i>
              </button>
              <button class="btn-del-prod p-1.5 text-red-600 hover:bg-red-50" data-id="${prod.id}" data-name="${prod.name}" title="Excluir Produto">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Re-render Lucide icons
    if (window.lucide) lucide.createIcons();

    // Eventos de Editar e Excluir
    productsTableBody.querySelectorAll('.btn-edit-prod').forEach(btn => {
      btn.addEventListener('click', () => openEditProductModal(btn.dataset.id));
    });

    productsTableBody.querySelectorAll('.btn-del-prod').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const name = btn.dataset.name;
        if (confirm(`Tem certeza que deseja remover o produto "${name}"? Esta ação não pode ser desfeita.`)) {
          store.deleteProduct(id);
          renderProductsTab();
          showToast(`Produto "${name}" removido com sucesso.`);
        }
      });
    });
  }

  if (productSearch) {
    productSearch.addEventListener('input', renderProductsTab);
  }

  // Preencher categorias no select do modal de produtos
  function populateProductCategorySelect() {
    const select = document.getElementById('prodCategory');
    if (!select) return;
    const categories = store.getCategories().filter(c => c.id !== 'todos' && c.id !== 'novidades');
    select.innerHTML = categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  }

  // Modal Novo / Editar Produto
  function openNewProductModal() {
    editingProductId = null;
    productModalTitle.textContent = 'Adicionar Novo Modelo';
    productForm.reset();
    populateProductCategorySelect();

    tempSizes = ['PP', 'P', 'M', 'G'];
    tempColors = [{ name: 'Azul Marissea', hex: '#0B2545' }, { name: 'Off-White', hex: '#FAF8F5' }];

    document.getElementById('prodRef').value = 'MAR-' + Math.floor(100 + Math.random() * 900);
    document.getElementById('prodShowPrice').checked = true;
    document.getElementById('prodIsNew').checked = true;
    document.getElementById('prodIsFeatured').checked = false;
    
    document.getElementById('previewMainImg').src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop';
    document.getElementById('prodImageMain').value = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop';
    
    document.getElementById('previewSecondaryImg').src = '';
    document.getElementById('prodImageSecondary').value = '';

    renderSizesList();
    renderColorsList();

    productModal.classList.remove('hidden');
  }

  function openEditProductModal(id) {
    const prod = store.getProductById(id);
    if (!prod) return;

    editingProductId = id;
    productModalTitle.textContent = 'Editar Modelo: ' + prod.name;
    populateProductCategorySelect();

    document.getElementById('prodName').value = prod.name;
    document.getElementById('prodRef').value = prod.ref || '';
    document.getElementById('prodCategory').value = prod.category;
    document.getElementById('prodPrice').value = prod.price || '';
    document.getElementById('prodShowPrice').checked = !!prod.showPrice;
    document.getElementById('prodIsNew').checked = !!prod.isNew;
    document.getElementById('prodIsFeatured').checked = !!prod.isFeatured;
    document.getElementById('prodDescription').value = prod.description || '';
    document.getElementById('prodComposition').value = prod.composition || '';

    // Imagens
    document.getElementById('prodImageMain').value = prod.imageMain || '';
    document.getElementById('previewMainImg').src = prod.imageMain || '';

    document.getElementById('prodImageSecondary').value = prod.imageSecondary || '';
    document.getElementById('previewSecondaryImg').src = prod.imageSecondary || '';

    // Tamanhos e Cores
    tempSizes = Array.isArray(prod.sizes) ? [...prod.sizes] : ['P', 'M', 'G'];
    tempColors = Array.isArray(prod.colors) ? [...prod.colors] : [];

    renderSizesList();
    renderColorsList();

    productModal.classList.remove('hidden');
  }

  function closeProductModal() {
    productModal.classList.add('hidden');
    editingProductId = null;
  }

  if (btnNewProduct) btnNewProduct.addEventListener('click', openNewProductModal);
  if (btnCloseProductModal) btnCloseProductModal.addEventListener('click', closeProductModal);

  // Manipulação de Upload de Imagens Locais (Base64)
  function setupImageUpload(fileInputId, textInputId, previewImgId) {
    const fileInput = document.getElementById(fileInputId);
    const textInput = document.getElementById(textInputId);
    const previewImg = document.getElementById(previewImgId);

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target.result;
          if (textInput) textInput.value = base64;
          if (previewImg) previewImg.src = base64;
        };
        reader.readAsDataURL(file);
      });
    }

    if (textInput) {
      textInput.addEventListener('input', (e) => {
        if (previewImg) previewImg.src = e.target.value;
      });
    }
  }

  setupImageUpload('prodFileMain', 'prodImageMain', 'previewMainImg');
  setupImageUpload('prodFileSecondary', 'prodImageSecondary', 'previewSecondaryImg');

  // Tamanhos Visuais
  function renderSizesList() {
    const container = document.getElementById('sizesContainer');
    if (!container) return;

    container.innerHTML = tempSizes.map((s, idx) => `
      <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-black/10 text-xs text-[#0B2545] font-medium">
        ${s}
        <button type="button" class="text-red-500 hover:text-red-700 ml-1" onclick="removeSize(${idx})">&times;</button>
      </span>
    `).join('');
  }

  window.removeSize = (idx) => {
    tempSizes.splice(idx, 1);
    renderSizesList();
  };

  const btnAddSize = document.getElementById('btnAddSize');
  const newSizeInput = document.getElementById('newSizeInput');
  if (btnAddSize && newSizeInput) {
    btnAddSize.addEventListener('click', () => {
      const val = newSizeInput.value.trim().toUpperCase();
      if (val && !tempSizes.includes(val)) {
        tempSizes.push(val);
        newSizeInput.value = '';
        renderSizesList();
      }
    });
  }

  // Cores Visuais
  function renderColorsList() {
    const container = document.getElementById('colorsContainer');
    if (!container) return;

    container.innerHTML = tempColors.map((c, idx) => `
      <div class="inline-flex items-center gap-2 px-3 py-1 bg-white border border-black/10 text-xs text-[#0B2545]">
        <span class="w-3.5 h-3.5 rounded-full border border-black/20" style="background-color: ${c.hex}"></span>
        <span>${c.name}</span>
        <button type="button" class="text-red-500 hover:text-red-700 ml-1" onclick="removeColor(${idx})">&times;</button>
      </div>
    `).join('');
  }

  window.removeColor = (idx) => {
    tempColors.splice(idx, 1);
    renderColorsList();
  };

  const btnAddColor = document.getElementById('btnAddColor');
  const newColorName = document.getElementById('newColorName');
  const newColorHex = document.getElementById('newColorHex');
  if (btnAddColor && newColorName && newColorHex) {
    btnAddColor.addEventListener('click', () => {
      const name = newColorName.value.trim();
      const hex = newColorHex.value;
      if (name) {
        tempColors.push({ name, hex });
        newColorName.value = '';
        renderColorsList();
      }
    });
  }

  // Salvar Produto
  if (productForm) {
    productForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('prodName').value.trim();
      const ref = document.getElementById('prodRef').value.trim();
      const category = document.getElementById('prodCategory').value;
      const price = parseFloat(document.getElementById('prodPrice').value) || 0;
      const showPrice = document.getElementById('prodShowPrice').checked;
      const isNew = document.getElementById('prodIsNew').checked;
      const isFeatured = document.getElementById('prodIsFeatured').checked;
      const description = document.getElementById('prodDescription').value.trim();
      const composition = document.getElementById('prodComposition').value.trim();
      const imageMain = document.getElementById('prodImageMain').value.trim();
      const imageSecondary = document.getElementById('prodImageSecondary').value.trim() || imageMain;

      if (!name || !imageMain) {
        showToast('Por favor, informe ao menos o Nome e a Foto Principal.', true);
        return;
      }

      const productPayload = {
        name,
        ref,
        category,
        price,
        showPrice,
        isNew,
        isFeatured,
        description,
        composition,
        imageMain,
        imageSecondary,
        sizes: [...tempSizes],
        colors: [...tempColors]
      };

      if (editingProductId) {
        productPayload.id = editingProductId;
      }

      store.saveProduct(productPayload);
      closeProductModal();
      renderProductsTab();
      showToast(`Modelo "${name}" salvo com sucesso!`);
    });
  }

  // ==========================================
  // GESTÃO DA HOME & BANNERS
  // ==========================================

  const homeForm = document.getElementById('homeForm');

  function renderHomeTab() {
    const info = store.getBrandInfo();
    document.getElementById('homeHeroTitle').value = info.heroTitle || '';
    document.getElementById('homeHeroSubtitle').value = info.heroSubtitle || '';
    document.getElementById('homeHeroBtnText').value = info.heroButtonText || '';
    document.getElementById('homeHeroBadge').value = info.heroBadge || '';
    document.getElementById('homeHeroImage').value = info.heroImage || '';
    document.getElementById('previewHeroImg').src = info.heroImage || '';
    document.getElementById('homeManifesto').value = info.manifestoQuote || '';
  }

  setupImageUpload('homeHeroFile', 'homeHeroImage', 'previewHeroImg');

  if (homeForm) {
    homeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      store.updateBrandInfo({
        heroTitle: document.getElementById('homeHeroTitle').value.trim(),
        heroSubtitle: document.getElementById('homeHeroSubtitle').value.trim(),
        heroButtonText: document.getElementById('homeHeroBtnText').value.trim(),
        heroBadge: document.getElementById('homeHeroBadge').value.trim(),
        heroImage: document.getElementById('homeHeroImage').value.trim(),
        manifestoQuote: document.getElementById('homeManifesto').value.trim()
      });
      showToast('Conteúdo da Home atualizado com sucesso!');
    });
  }

  // ==========================================
  // GESTÃO DE CATEGORIAS
  // ==========================================

  const categoriesList = document.getElementById('categoriesList');
  const newCategoryForm = document.getElementById('newCategoryForm');

  function renderCategoriesTab() {
    const categories = store.getCategories();
    if (!categoriesList) return;

    categoriesList.innerHTML = categories.map(cat => {
      const isProtected = cat.id === 'todos' || cat.id === 'novidades';
      return `
        <div class="flex items-center justify-between p-4 bg-white border border-black/[0.06]">
          <div>
            <span class="font-medium text-[#0B2545]">${cat.name}</span>
            <span class="text-xs text-[#6B7280] ml-2 font-mono">(${cat.id})</span>
          </div>
          <div>
            ${isProtected ? 
              '<span class="text-[10px] uppercase tracking-luxury text-[#6B7280] bg-black/5 px-2 py-1">Padrão</span>' : 
              `<button class="btn-del-cat text-xs text-red-600 hover:underline" data-id="${cat.id}" data-name="${cat.name}">Excluir</button>`
            }
          </div>
        </div>
      `;
    }).join('');

    categoriesList.querySelectorAll('.btn-del-cat').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const name = btn.dataset.name;
        if (confirm(`Deseja excluir a categoria "${name}"?`)) {
          store.deleteCategory(id);
          renderCategoriesTab();
          renderStats();
          showToast(`Categoria "${name}" excluída.`);
        }
      });
    });
  }

  if (newCategoryForm) {
    newCategoryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('newCategoryName');
      const name = nameInput.value.trim();
      if (!name) return;

      store.saveCategory({ name });
      nameInput.value = '';
      renderCategoriesTab();
      renderStats();
      showToast(`Categoria "${name}" criada com sucesso!`);
    });
  }

  // ==========================================
  // GESTÃO DO EDITORIAL / JOURNAL
  // ==========================================

  const articlesList = document.getElementById('articlesList');
  const btnNewArticle = document.getElementById('btnNewArticle');
  const articleModal = document.getElementById('articleFormModal');
  const articleForm = document.getElementById('articleForm');
  const btnCloseArticleModal = document.getElementById('btnCloseArticleModal');

  function renderEditorialTab() {
    const articles = store.getArticles();
    if (!articlesList) return;

    articlesList.innerHTML = articles.map(art => `
      <div class="flex flex-col sm:flex-row gap-4 p-4 bg-white border border-black/[0.06] items-start sm:items-center justify-between">
        <div class="flex gap-4 items-center">
          <div class="w-16 h-16 bg-[#ECE5DA] overflow-hidden flex-shrink-0">
            <img src="${art.coverImage}" alt="${art.title}" class="w-full h-full object-cover">
          </div>
          <div>
            <span class="text-[10px] uppercase tracking-luxury text-[#6B7280]">${art.category} • ${art.date}</span>
            <h4 class="font-serifTitle text-lg text-[#0B2545]">${art.title}</h4>
            <p class="text-xs text-[#6B7280] line-clamp-1">${art.subtitle}</p>
          </div>
        </div>
        <div class="flex items-center gap-2 self-end sm:self-center">
          <button class="btn-edit-art text-xs py-1.5 px-3 border border-[#0B2545] text-[#0B2545] hover:bg-[#0B2545] hover:text-white transition-colors" data-id="${art.id}">
            Editar
          </button>
          <button class="btn-del-art text-xs py-1.5 px-3 text-red-600 hover:bg-red-50 transition-colors" data-id="${art.id}" data-title="${art.title}">
            Excluir
          </button>
        </div>
      </div>
    `).join('');

    articlesList.querySelectorAll('.btn-edit-art').forEach(btn => {
      btn.addEventListener('click', () => openEditArticleModal(btn.dataset.id));
    });

    articlesList.querySelectorAll('.btn-del-art').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const title = btn.dataset.title;
        if (confirm(`Deseja excluir a matéria "${title}"?`)) {
          store.deleteArticle(id);
          renderEditorialTab();
          renderStats();
          showToast('Matéria editorial excluída.');
        }
      });
    });
  }

  function openNewArticleModal() {
    editingArticleId = null;
    articleForm.reset();
    document.getElementById('artCoverImage').value = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop';
    document.getElementById('previewArtImg').src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop';
    articleModal.classList.remove('hidden');
  }

  function openEditArticleModal(id) {
    const art = store.getArticleById(id);
    if (!art) return;

    editingArticleId = id;
    document.getElementById('artTitle').value = art.title;
    document.getElementById('artSubtitle').value = art.subtitle;
    document.getElementById('artCategory').value = art.category;
    document.getElementById('artAuthor').value = art.author || 'Equipe Marissea';
    document.getElementById('artCoverImage').value = art.coverImage;
    document.getElementById('previewArtImg').src = art.coverImage;
    
    if (Array.isArray(art.content)) {
      document.getElementById('artContent').value = art.content.join('\n\n');
    } else {
      document.getElementById('artContent').value = art.content || '';
    }

    articleModal.classList.remove('hidden');
  }

  if (btnNewArticle) btnNewArticle.addEventListener('click', openNewArticleModal);
  if (btnCloseArticleModal) btnCloseArticleModal.addEventListener('click', () => articleModal.classList.add('hidden'));

  setupImageUpload('artCoverFile', 'artCoverImage', 'previewArtImg');

  if (articleForm) {
    articleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('artTitle').value.trim();
      const subtitle = document.getElementById('artSubtitle').value.trim();
      const category = document.getElementById('artCategory').value.trim();
      const author = document.getElementById('artAuthor').value.trim();
      const coverImage = document.getElementById('artCoverImage').value.trim();
      const contentRaw = document.getElementById('artContent').value.trim();

      const paragraphs = contentRaw.split('\n\n').map(p => p.trim()).filter(Boolean);

      const payload = {
        title,
        subtitle,
        category,
        author,
        coverImage,
        content: paragraphs
      };

      if (editingArticleId) payload.id = editingArticleId;

      store.saveArticle(payload);
      articleModal.classList.add('hidden');
      renderEditorialTab();
      showToast(`Publicação "${title}" salva com sucesso!`);
    });
  }

  // ==========================================
  // GESTÃO DO SOBRE
  // ==========================================

  const aboutForm = document.getElementById('aboutForm');

  function renderAboutTab() {
    const info = store.getBrandInfo();
    document.getElementById('aboutTitleInput').value = info.aboutTitle || '';
    document.getElementById('aboutSubtitleInput').value = info.aboutSubtitle || '';
    document.getElementById('aboutP1Input').value = info.aboutParagraph1 || '';
    document.getElementById('aboutP2Input').value = info.aboutParagraph2 || '';
    document.getElementById('aboutP3Input').value = info.aboutParagraph3 || '';
    
    document.getElementById('aboutImg1Input').value = info.aboutImage1 || '';
    document.getElementById('previewAboutImg1').src = info.aboutImage1 || '';
    
    document.getElementById('aboutImg2Input').value = info.aboutImage2 || '';
    document.getElementById('previewAboutImg2').src = info.aboutImage2 || '';
  }

  setupImageUpload('aboutFileImg1', 'aboutImg1Input', 'previewAboutImg1');
  setupImageUpload('aboutFileImg2', 'aboutImg2Input', 'previewAboutImg2');

  if (aboutForm) {
    aboutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      store.updateBrandInfo({
        aboutTitle: document.getElementById('aboutTitleInput').value.trim(),
        aboutSubtitle: document.getElementById('aboutSubtitleInput').value.trim(),
        aboutParagraph1: document.getElementById('aboutP1Input').value.trim(),
        aboutParagraph2: document.getElementById('aboutP2Input').value.trim(),
        aboutParagraph3: document.getElementById('aboutP3Input').value.trim(),
        aboutImage1: document.getElementById('aboutImg1Input').value.trim(),
        aboutImage2: document.getElementById('aboutImg2Input').value.trim()
      });
      showToast('Manifesto da marca atualizado com sucesso!');
    });
  }

  // ==========================================
  // GESTÃO DE CONTATO & IDENTIDADE
  // ==========================================

  const contactForm = document.getElementById('contactForm');

  function renderContactTab() {
    const info = store.getBrandInfo();
    document.getElementById('contactWhatsappInput').value = info.whatsappNumber || '';
    document.getElementById('contactWhatsappFormatInput').value = info.whatsappFormatted || '';
    document.getElementById('contactInstagramInput').value = info.instagramHandle || '';
    document.getElementById('contactEmailInput').value = info.email || '';
    document.getElementById('contactAddressInput').value = info.boutiqueLocation || '';
    
    // Logo
    document.getElementById('logoNavyInput').value = info.logoNavy || '';
    document.getElementById('previewLogoNavy').src = info.logoNavy || '';
    
    document.getElementById('logoCreamInput').value = info.logoCream || '';
    document.getElementById('previewLogoCream').src = info.logoCream || '';
  }

  setupImageUpload('logoNavyFile', 'logoNavyInput', 'previewLogoNavy');
  setupImageUpload('logoCreamFile', 'logoCreamInput', 'previewLogoCream');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      store.updateBrandInfo({
        whatsappNumber: document.getElementById('contactWhatsappInput').value.trim(),
        whatsappFormatted: document.getElementById('contactWhatsappFormatInput').value.trim(),
        instagramHandle: document.getElementById('contactInstagramInput').value.trim(),
        email: document.getElementById('contactEmailInput').value.trim(),
        boutiqueLocation: document.getElementById('contactAddressInput').value.trim(),
        logoNavy: document.getElementById('logoNavyInput').value.trim(),
        logoCream: document.getElementById('logoCreamInput').value.trim()
      });
      showToast('Dados de contato e logos atualizados com sucesso!');
    });
  }

  // ==========================================
  // BACKUP, RESTAURAÇÃO & RESET
  // ==========================================

  const btnDownloadBackup = document.getElementById('btnDownloadBackup');
  const fileImportBackup = document.getElementById('fileImportBackup');
  const btnResetDefaults = document.getElementById('btnResetDefaults');

  if (btnDownloadBackup) {
    btnDownloadBackup.addEventListener('click', () => {
      const dataStr = store.exportData();
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `marissea-backup-${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Arquivo de backup baixado com sucesso!');
    });
  }

  if (fileImportBackup) {
    fileImportBackup.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = store.importData(event.target.result);
        if (result.success) {
          showToast('Dados restaurados com sucesso!');
          initDashboard();
        } else {
          showToast('Erro ao importar arquivo: ' + result.error, true);
        }
      };
      reader.readAsText(file);
    });
  }

  if (btnResetDefaults) {
    btnResetDefaults.addEventListener('click', () => {
      if (confirm('Atenção: isto restaurará o catálogo e textos originais da Marissea. Deseja continuar?')) {
        store.resetDefaults();
        initDashboard();
        showToast('Catálogo restaurado para os padrões inaugurais.');
      }
    });
  }

  // Verificar autenticação inicial
  checkAuth();
});
