// ============================================
// MÓDULO: CategoryFilter
// Filtro de categorías en la vista de equipos
// ============================================

const CategoryFilter = (() => {
  
  // --- CONSTANTES PRIVADAS ---
  const DEFAULT_CATEGORY = 'all';
  const CONTAINERS = ['herramientas-container', 'herramientas-container-2'];
  
  // --- ESTADO PRIVADO ---
  let _state = {
    currentCategory: DEFAULT_CATEGORY,
    initialized: false,
    pendingCategory: null
  };
  
  // --- FUNCIONES PRIVADAS ---
  function _getContainers() {
    return CONTAINERS.map(id => document.getElementById(id)).filter(Boolean);
  }
  
  function _hideAllEquipmentDetails() {
    _getContainers().forEach(container => {
      container.querySelectorAll('article').forEach(article => {
        article.style.display = 'none';
      });
    });
  }
  
  function _getNetflixRows() {
    return document.getElementById('netflixRows');
  }
  
  function _applyFilter(category) {
    const netflixRows = _getNetflixRows();
    if (!netflixRows) {
      console.log('CategoryFilter: netflixRows container not found');
      return;
    }
    
    netflixRows.style.display = 'block';
    const rows = netflixRows.querySelectorAll('.netflix-row');
    console.log('CategoryFilter: _applyFilter category:', category, 'rows found:', rows.length);
    
    // Si las filas no están cargadas, guardar categoría para después
    if (rows.length === 0) {
      console.log('CategoryFilter: Rows not loaded yet, saving pending category');
      _state.pendingCategory = category;
      return;
    }
    
    rows.forEach(row => {
      const rowCategory = row.dataset.category;
      const shouldShow = (category === DEFAULT_CATEGORY) || (rowCategory === category);
      row.style.display = shouldShow ? 'block' : 'none';
      console.log('CategoryFilter: Row', rowCategory, 'shouldShow:', shouldShow, 'display:', row.style.display);
    });
  }
  
  function _scrollToEquipos() {
    const equiposSection = document.getElementById('equipos');
    if (equiposSection) {
      equiposSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  
  function _emit(eventName, detail = {}) {
    // Usar EventEmitter si está disponible (Patrón Observer)
    if (typeof EventEmitter !== 'undefined') {
      EventEmitter.emit(eventName, detail);
    }
    
    // También dispatchear CustomEvent para compatibilidad
    document.dispatchEvent(new CustomEvent(eventName, { detail }));
  }
  
  /**
   * Suscribe a eventos del EventEmitter (Patrón Observer)
   */
  function _subscribeToEvents() {
    if (typeof EventEmitter === 'undefined') return;
    
    // Escuchar selección de categoría desde otros componentes
    EventEmitter.on('category:select', (data) => {
      console.log('CategoryFilter:收到的category:select event:', data);
      if (data && data.category) {
        _state.currentCategory = data.category;
        _hideAllEquipmentDetails();
        _applyFilter(data.category);
        _scrollToEquipos();
      }
    });
    
    // Escuchar cambio de categoría
    EventEmitter.on('category:change', (data) => {
      console.log('CategoryFilter:收到的category:change event:', data);
    });
  }
  
  // --- API PÚBLICA ---
  return {
    init() {
      if (_state.initialized) return;
      
      // Suscribir a eventos del EventEmitter
      _subscribeToEvents();
      
      _hideAllEquipmentDetails();
      _state.initialized = true;
      
      _emit('category:init', { category: _state.currentCategory });
      console.log('CategoryFilter initialized');
    },
    
    handleCategoryClick(category, button = null) {
      console.log('CategoryFilter: handleCategoryClick called with:', category);
      _state.currentCategory = category;
      
      // Mostrar el contenedor de Netflix rows
      const netflixRows = _getNetflixRows();
      if (netflixRows) {
        netflixRows.style.display = 'block';
        console.log('CategoryFilter: Showing netflixRows');
      }
      
      // Ocultar los detalles de equipos
      _hideAllEquipmentDetails();
      
      // Aplicar el filtro de categoría
      _applyFilter(category);
      _scrollToEquipos();
      
      console.log('CategoryFilter: handleCategoryClick - category:', category);
      _emit('category:change', { category });
    },
    
    applyCategoryFilter(category) {
      _applyFilter(category);
    },
    
    showEquipmentDetail(event, category, index) {
      event.preventDefault();
      event.stopPropagation();
      this.showByIndex(category, index);
    },
    
    showByIndex(category, index) {
      const netflixRows = _getNetflixRows();
      if (netflixRows) {
        netflixRows.style.display = 'none';
      }
      
      _hideAllEquipmentDetails();
      
      const allArticles = [];
      _getContainers().forEach(container => {
        if (container) {
          allArticles.push(...container.querySelectorAll(`article[data-category="${category}"]`));
        }
      });
      
      if (allArticles.length === 0) return;
      
      if (index >= 0 && index < allArticles.length) {
        allArticles[index].style.display = 'block';
        allArticles[index].classList.add('active');
        allArticles[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        console.error('CategoryFilter: Índice no válido:', index, 'para categoría:', category);
        if (netflixRows) netflixRows.style.display = 'block';
      }
    },
    
    showByTitle(event, element) {
      event.preventDefault();
      event.stopPropagation();
      
      const titleElement = element.querySelector('.netflix-item-title');
      if (!titleElement) return;
      
      const equipmentName = titleElement.textContent.trim().toLowerCase();
      
      const netflixRows = _getNetflixRows();
      if (netflixRows) {
        netflixRows.style.display = 'none';
      }
      
      _hideAllEquipmentDetails();
      
      const allArticles = [];
      _getContainers().forEach(container => {
        if (container) {
          allArticles.push(...container.querySelectorAll('article'));
        }
      });
      
      let targetArticle = null;
      let matchCount = 0;
      
      allArticles.forEach(article => {
        const titleEl = article.querySelector('h2, h3, h4, .card-title, [itemprop="name"], .card-body h2, .card-body h3');
        if (titleEl) {
          const articleTitle = titleEl.textContent.trim().toLowerCase();
          const cleanArticleTitle = articleTitle.replace(/alquiler de | en cali/gi, '').trim();
          
          const searchName = equipmentName;
          if (cleanArticleTitle === searchName || cleanArticleTitle.includes(searchName) || searchName.includes(cleanArticleTitle)) {
            if (!targetArticle) {
              targetArticle = article;
            }
            matchCount++;
          }
        }
      });
      
      if (targetArticle && matchCount === 1) {
        targetArticle.style.display = 'block';
        targetArticle.classList.add('active');
        targetArticle.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (targetArticle && matchCount > 1) {
        const exactMatch = allArticles.find(article => {
          const titleEl = article.querySelector('h2, h3, h4, .card-title, [itemprop="name"], .card-body h2, .card-body h3');
          if (titleEl) {
            const articleTitle = titleEl.textContent.trim().toLowerCase();
            const cleanArticleTitle = articleTitle.replace(/alquiler de | en cali/gi, '').trim();
            return cleanArticleTitle === equipmentName;
          }
          return false;
        });
        
        if (exactMatch) {
          _hideAllEquipmentDetails();
          exactMatch.style.display = 'block';
          exactMatch.classList.add('active');
          exactMatch.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (netflixRows) {
          netflixRows.style.display = '';
        }
      } else {
        if (netflixRows) netflixRows.style.display = 'block';
      }
    },
    
    scrollRow(rowId, direction) {
      const row = document.getElementById(rowId);
      if (!row) return;
      
      row.scrollBy({
        left: direction * 300,
        behavior: 'smooth'
      });
    },
    
    setCategory(category) {
      _state.currentCategory = category;
    },
    
    getCategory() {
      return _state.currentCategory;
    },
    
    isInitialized() {
      return _state.initialized;
    }
  };
  
})();

// ============================================
// EVENTOS: Reaplicar filtro cuando las filas estén cargadas
// ============================================
// Usar EventEmitter si está disponible
const _setupCategoryFilterEvents = () => {
  if (typeof EventEmitter !== 'undefined') {
    EventEmitter.on('equiposLoaded', () => {
      const category = CategoryFilter.getCategory();
      if (category && category !== 'all') {
        CategoryFilter.applyCategoryFilter(category);
      }
    });
    
    EventEmitter.on('category:select', (data) => {
      console.log('CategoryFilter: Received category:select event:', data);
      CategoryFilter.handleCategoryClick(data.category);
    });
  }
  
  // Fallback a addEventListener siempre (para redundancy)
  document.addEventListener('category:select', (e) => {
    console.log('CategoryFilter: Received category:select via CustomEvent:', e.detail);
    if (e.detail && e.detail.category) {
      CategoryFilter.handleCategoryClick(e.detail.category);
    }
  });
  
  // También escuchar cuando las filas se cargan
  document.addEventListener('equiposLoaded', () => {
    const category = CategoryFilter.getCategory();
    if (category && category !== 'all') {
      CategoryFilter.applyCategoryFilter(category);
    }
  });
};

// Inicializar eventos
_setupCategoryFilterEvents();

// ============================================
// LEGACY: Compatibilidad hacia atrás
// ============================================
if (typeof window !== 'undefined') {
  window.handleCategoryClick = CategoryFilter.handleCategoryClick.bind(CategoryFilter);
  window.showEquipmentDetail = CategoryFilter.showEquipmentDetail.bind(CategoryFilter);
  window.showEquipmentDetailByTitle = CategoryFilter.showByTitle.bind(CategoryFilter);
  window.showEquipmentDetailByIndex = CategoryFilter.showByIndex.bind(CategoryFilter);
  window.hideAllEquipmentDetails = () => CategoryFilter.init();
  window.initEquipmentFilter = () => CategoryFilter.init();
  window.CategoryFilter = CategoryFilter;
}

// Auto-inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  if (!CategoryFilter.isInitialized()) {
    CategoryFilter.init();
  }
});

// Exportar si ESM
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CategoryFilter;
}