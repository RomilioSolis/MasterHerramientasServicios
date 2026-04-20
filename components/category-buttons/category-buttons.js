// ============================================
// MÓDULO: CategoryButtons
// Botones de categorías de equipos
// ============================================

const CategoryButtons = (() => {
  
  // --- CONSTANTES PRIVADAS ---
  const DEFAULT_CATEGORY = 'all';
  
  const _CATEGORIES = [
    { id: 'all', label: 'Todos', category: 'all' },
    { id: 'elevacion', label: 'Elevación y Levante', category: 'elevacion' },
    { id: 'perforacion', label: 'Perforación y Corte', category: 'perforacion' },
    { id: 'mezclado', label: 'Mezclado y Compactación', category: 'mezclado' },
    { id: 'limpieza', label: 'Limpieza e Hidráulica', category: 'limpieza' },
    { id: 'soldadura', label: 'Soldadura y Energía', category: 'soldadura' },
    { id: 'construccion', label: 'Construcción y Estructura', category: 'construccion' },
    { id: 'movimiento', label: 'Accesorios de Movimiento', category: 'movimiento' },
    { id: 'jardin', label: 'Jardín y Forestal', category: 'jardin' }
  ];
  
  const _LATERAL_CATEGORIES = [
    { id: 'elevacion', label: 'Elevación y Levante' },
    { id: 'perforacion', label: 'Perforación y Corte' },
    { id: 'mezclado', label: 'Mezclado y Compactación' },
    { id: 'limpieza', label: 'Limpieza e Hidráulica' },
    { id: 'soldadura', label: 'Soldadura y Energía' },
    { id: 'construccion', label: 'Construcción y Estructura' },
    { id: 'movimiento', label: 'Accesorios de Movimiento' },
    { id: 'jardin', label: 'Jardín y Forestal' }
  ];
  
  // --- ESTADO PRIVADO ---
  let _state = {
    activeCategory: DEFAULT_CATEGORY,
    initialized: false
  };
  
  // --- FUNCIONES PRIVADAS ---
  function _getCategoryButtonHTML(category, isActive = false) {
    return `
      <li class="nav-item" role="presentation">
        <button class="nav-link btn btn-outline-primary px-3 ${isActive ? 'active' : ''}" 
                id="${category.id}-tab" 
                type="button" 
                data-category="${category.category}"
                onclick="handleCategoryClick('${category.category}')">
          ${category.label}
        </button>
      </li>
    `;
  }
  
  function _getTabsHTML(activeCategory = DEFAULT_CATEGORY) {
    return `
      <ul class="nav nav-pills mb-3 justify-content-between flex-nowrap category-tabs" id="categoryTabs" role="tablist">
        ${_CATEGORIES.map(cat => _getCategoryButtonHTML(cat, cat.category === activeCategory)).join('')}
      </ul>
    `;
  }
  
  function _getLateralCategoryHTML(category) {
    return `
      <li>
        <button class="lateral-category-btn" data-lateral-category="${category.id}">
          ${category.label}
          <span class="lateral-arrow"><i class="fas bi-chevron-right"></i></span>
        </button>
      </li>
    `;
  }
  
  function _getLateralHTML() {
    return `
      <ul class="lateral-categories">
        ${_LATERAL_CATEGORIES.map(cat => _getLateralCategoryHTML(cat)).join('')}
      </ul>
    `;
  }
  
  function _emit(eventName, detail = {}) {
    // Usar EventEmitter si está disponible (Patrón Observer)
    if (typeof EventEmitter !== 'undefined') {
      EventEmitter.emit(eventName, detail);
    }
    
    // También dispatchear CustomEvent para compatibilidad
    document.dispatchEvent(new CustomEvent(eventName, { detail }));
  }
  
  function _bindEvents(container) {
    if (!container) return;
    
    // Delegar click en botones de categorías
    container.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-category]');
      if (btn) {
        const category = btn.dataset.category;
        console.log('CategoryButtons: Click detected, category:', category);
        _setActiveButton(btn);
        _emit('category:select', { category });
      }
    });
  }
  
  function _setActiveButton(activeBtn) {
    const container = document.getElementById('categoryTabs');
    if (!container) return;
    
    container.querySelectorAll('.nav-link').forEach(btn => {
      btn.classList.remove('active');
    });
    
    if (activeBtn) {
      activeBtn.classList.add('active');
    }
  }
  
  // --- API PÚBLICA ---
  return {
    init(containerId = 'categoryButtonsContainer', activeCategory = DEFAULT_CATEGORY) {
      if (_state.initialized) return;
      
      const container = document.getElementById(containerId);
      if (!container) {
        console.error('CategoryButtons: Container not found:', containerId);
        return;
      }
      
      _state.activeCategory = activeCategory;
      container.innerHTML = _getTabsHTML(activeCategory);
      _bindEvents(container);
      _state.initialized = true;
      
      _emit('category:init', { activeCategory });
      console.log('CategoryButtons initialized');
    },
    
    getTabsHTML(activeCategory = DEFAULT_CATEGORY) {
      return _getTabsHTML(activeCategory);
    },
    
    getLateralHTML() {
      return _getLateralHTML();
    },
    
    getCategories() {
      return Object.freeze([..._CATEGORIES]);
    },
    
    getLateralCategories() {
      return Object.freeze([..._LATERAL_CATEGORIES]);
    },
    
    selectCategory(category, button = null) {
      _state.activeCategory = category;
      
      if (button) {
        _setActiveButton(button);
      } else {
        const tabBtn = document.getElementById(category + '-tab');
        if (tabBtn) _setActiveButton(tabBtn);
      }
      
      _emit('category:select', { category });
    },
    
    getActiveCategory() {
      return _state.activeCategory;
    },
    
    isInitialized() {
      return _state.initialized;
    }
  };
  
})();

// ============================================
// LEGACY: Compatibilidad hacia atrás
// ============================================
if (typeof window !== 'undefined') {
  window.getCategoryTabsHTML = CategoryButtons.getTabsHTML.bind(CategoryButtons);
  window.getLateralCategoriesHTML = CategoryButtons.getLateralHTML.bind(CategoryButtons);
  window.CategoryButtons = CategoryButtons;
}

// Auto-inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('categoryButtonsContainer');
  if (container && !CategoryButtons.isInitialized()) {
    CategoryButtons.init('categoryButtonsContainer', 'all');
  }
});

// Exportar si ESM
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CategoryButtons;
}