// ============================================
// MÓDULO: EquiposDropdown
// Dropdown de categorías de equipos en el header
// ============================================

const EquiposDropdown = (() => {
  
  // --- CONSTANTES PRIVADAS ---
  const _CATEGORIES = {
    elevacion: {
      name: 'Elevación y Levante',
      icon: 'bi-arrow-up-circle',
      wa: 'elevacion'
    },
    perforacion: {
      name: 'Perforación y Corte',
      icon: 'bi-tools',
      wa: 'perforacion'
    },
    mezclado: {
      name: 'Mezclado y Compactación',
      icon: 'bi-circle',
      wa: 'mezclado'
    },
    limpieza: {
      name: 'Limpieza e Hidráulica',
      icon: 'bi-bucket',
      wa: 'limpieza'
    },
    soldadura: {
      name: 'Soldadura y Energía',
      icon: 'bi-fire',
      wa: 'soldadura'
    },
    construccion: {
      name: 'Construcción y Estructura',
      icon: 'bi-building',
      wa: 'construccion'
    },
    movimiento: {
      name: 'Accesorios de Movimiento',
      icon: 'bi-truck',
      wa: 'movimiento'
    },
    jardin: {
      name: 'Jardín y Forestal',
      icon: 'bi-tree',
      wa: 'jardin'
    }
  };
  
  const _SELECTORS = {
    TRIGGER: '#equipos-dropdown-trigger',
    MENU: '#equiposDropdownMenu',
    OVERLAY: '#equiposDropdownOverlay',
    CONTAINER: '#equipos-dropdown-container'
  };
  
  // --- ESTADO PRIVADO ---
  let _state = {
    initialized: false,
    isOpen: false,
    hoverTimeout: null
  };
  
  // --- FUNCIONES PRIVADAS ---
  function _loadStyles() {
    return new Promise((resolve) => {
      if (document.getElementById('equipos-dropdown-styles')) {
        console.log('EquiposDropdown: CSS ya cargado');
        resolve();
        return;
      }
      console.log('EquiposDropdown: Cargando CSS...');
      const link = document.createElement('link');
      link.id = 'equipos-dropdown-styles';
      link.rel = 'stylesheet';
      link.href = 'components/equipos-dropdown/equipos-dropdown.css';
      link.onload = () => {
        console.log('EquiposDropdown: CSS cargado');
        resolve();
      };
      link.onerror = (e) => {
        console.error('EquiposDropdown: Error cargando CSS:', e);
        resolve();
      };
      document.head.appendChild(link);
    });
  }
  
  function _getCategoryHTML([key, cat]) {
    return `
      <a href="#equipos" class="equipos-category-item" data-category="${key}">
        <i class="bi ${cat.icon}"></i>
        <span>${cat.name}</span>
      </a>
    `;
  }
  
  function _getHTML() {
    const categoriesHTML = Object.entries(_CATEGORIES)
      .map(cat => _getCategoryHTML(cat))
      .join('');
    
    return `
      <div class="equipos-dropdown-overlay" id="equiposDropdownOverlay"></div>
      <div class="equipos-dropdown-menu" id="equiposDropdownMenu" role="menu" aria-label="Categorías de equipos">
        <div class="equipos-dropdown-header">Categorías</div>
        <div class="equipos-dropdown-categories">
          ${categoriesHTML}
        </div>
      </div>
    `;
  }
  
  function _open() {
    const trigger = document.querySelector(_SELECTORS.TRIGGER);
    const menu = document.querySelector(_SELECTORS.MENU);
    const overlay = document.querySelector(_SELECTORS.OVERLAY);
    
    if (!trigger || !menu) return;
    
    trigger.classList.add('active');
    trigger.setAttribute('aria-expanded', 'true');
    menu.classList.add('open');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    const rect = trigger.getBoundingClientRect();
    const menuWidth = menu.offsetWidth || 280;
    let leftPos = rect.left + rect.width / 2;
    const padding = 10;
    
    if (leftPos + menuWidth / 2 > window.innerWidth - padding) {
      leftPos = window.innerWidth - padding - menuWidth / 2;
    }
    if (leftPos - menuWidth / 2 < padding) {
      leftPos = padding + menuWidth / 2;
    }
    
    menu.style.top = `${rect.bottom + 8}px`;
    menu.style.left = `${leftPos}px`;
    
    _state.isOpen = true;
    _emit('equipos-dropdown:open');
  }
  
  function _close() {
    const trigger = document.querySelector(_SELECTORS.TRIGGER);
    const menu = document.querySelector(_SELECTORS.MENU);
    const overlay = document.querySelector(_SELECTORS.OVERLAY);
    
    if (trigger) {
      trigger.classList.remove('active');
      trigger.setAttribute('aria-expanded', 'false');
    }
    if (menu) menu.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
    
    _state.isOpen = false;
    _emit('equipos-dropdown:close');
  }
  
  function _toggle() {
    if (_state.isOpen) {
      _close();
    } else {
      _open();
    }
  }
  
  function _onCategoryClick(category) {
    _close();
    
    // Usar EventEmitter si está disponible (Patrón Observer)
    if (typeof EventEmitter !== 'undefined') {
      EventEmitter.emit('category:select', { category });
    }
    
    // También dispatchear CustomEvent para compatibilidad
    document.dispatchEvent(new CustomEvent('category:select', {
      detail: { category }
    }));
    
    const equiposSection = document.getElementById('equipos');
    if (equiposSection) {
      equiposSection.scrollIntoView({ behavior: 'smooth' });
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
  
  function _bindEvents() {
    const trigger = document.querySelector(_SELECTORS.TRIGGER);
    const menu = document.querySelector(_SELECTORS.MENU);
    const overlay = document.querySelector(_SELECTORS.OVERLAY);
    
    console.log('EquiposDropdown _bindEvents:', {
      trigger: !!trigger,
      menu: !!menu,
      overlay: !!overlay,
      triggerId: trigger?.id,
      menuId: menu?.id
    });
    
    if (!trigger || !menu) {
      console.error('EquiposDropdown: Trigger or menu not found!');
      return;
    }
    
    // Función toggle expuesta globalmente para usarse desde onclick inline
    window.toggleEquiposDropdownInternal = _toggle;
    
    // Click en trigger
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('EquiposDropdown: Click en trigger');
      _toggle();
    });
    
    // Click en categorías
    menu.addEventListener('click', (e) => {
      const link = e.target.closest('[data-category]');
      if (link) {
        e.preventDefault();
        const category = link.dataset.category;
        _onCategoryClick(category);
      }
    });
    
    // Overlay click
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        e.stopPropagation();
        _close();
      });
    }
    
    // Click fuera
    document.addEventListener('click', (e) => {
      if (!trigger.contains(e.target) && !menu.contains(e.target)) {
        _close();
      }
    });
    
    // Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && _state.isOpen) {
        _close();
        trigger?.focus();
      }
    });
    
    // Hover desktop
    if (window.innerWidth > 768) {
      trigger.addEventListener('mouseenter', () => {
        clearTimeout(_state.hoverTimeout);
        _open();
      });
      
      menu.addEventListener('mouseenter', () => {
        clearTimeout(_state.hoverTimeout);
      });
      
      const scheduleClose = () => {
        _state.hoverTimeout = setTimeout(_close, 200);
      };
      
      menu.addEventListener('mouseleave', scheduleClose);
      trigger.addEventListener('mouseleave', scheduleClose);
    }
  }
  
  // --- API PÚBLICA ---
  return {
    init() {
      // Si ya estaba inicializado, resolved inmediatamente
      if (_state.initialized) {
        return Promise.resolve();
      }
      
      // Retornar la promesa para que se pueda hacer await desde header.js
      const stylesPromise = _loadStyles();
      
      return stylesPromise.then(() => {
        const container = document.querySelector(_SELECTORS.CONTAINER);
        if (!container) {
          console.error('EquiposDropdown: Container not found');
          _state.initialized = true; // Marcar para no intentar de nuevo
          return;
        }
        
        container.innerHTML = _getHTML();
        _bindEvents();
        _state.initialized = true;
        
        _emit('equipos-dropdown:init');
        console.log('EquiposDropdown initialized');
      });
    },
    
    open() {
      _open();
    },
    
    close() {
      _close();
    },
    
    toggle() {
      _toggle();
    },
    
    isOpen() {
      return _state.isOpen;
    },
    
    getCategories() {
      return Object.freeze({ ..._CATEGORIES });
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
  window.EquiposDropdown = EquiposDropdown;
  // Wrapper que retorna la promesa para que pueda usarse con await
  window.initEquiposDropdown = () => EquiposDropdown.init();
  window.openEquiposDropdown = () => EquiposDropdown.open();
  window.closeEquiposDropdown = () => EquiposDropdown.close();
  window.toggleEquiposDropdown = () => EquiposDropdown.toggle();
  window.handleCategoryClick = (category) => {
    // Llamar al CategoryFilter real si existe
    if (typeof window.CategoryFilter !== 'undefined' && window.CategoryFilter.handleCategoryClick) {
      window.CategoryFilter.handleCategoryClick(category);
    }
    // Luego cerrar el dropdown
    EquiposDropdown.close();
  };
}

// Exportar si ESM
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EquiposDropdown;
}