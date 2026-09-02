// ============================================
// MÓDULO: DarkMode
// Controlador de temaClaro/Oscuro con Module Pattern
// ============================================

const DarkMode = (() => {
  
  // --- CONSTANTES PRIVADAS ---
  const STORAGE_KEY = 'theme';
  const TRANSITION_DURATION = 300;
  
  const THEME_STYLES = `
    body { transition: background-color 0.3s ease, color 0.3s ease !important; }
    [data-theme="light"] {
      --bg-primary: #ffffff;
      --bg-secondary: #f8f9fa;
      --text-primary: #212529;
      --text-secondary: #6c757d;
    }
    [data-theme="dark"] {
      --bg-primary: #1a1a1a;
      --bg-secondary: #2d2d2d;
      --text-primary: #f8f9fa;
      --text-secondary: #adb5bd;
      background-color: #1a1a1a !important;
      color: #f8f9fa !important;
    }
    [data-theme="dark"] a:not(.btn) { color: #4dabf7 !important; }
    [data-theme="dark"] .text-muted { color: #adb5bd !important; }
    [data-theme="dark"] .card {
      background-color: #2d2d2d !important;
      border-color: #404040 !important;
    }
    [data-theme="dark"] header, [data-theme="dark"] .navbar {
      background-color: #800020 !important;
    }
    [data-theme="dark"] .nav-link { color: #f8f9fa !important; }
    [data-theme="dark"] .logo-text { color: #ffffff !important; }
  `;
  
  // --- ESTADO PRIVADO ---
  let _state = {
    theme: localStorage.getItem(STORAGE_KEY) || 'light',
    initialized: false
  };
  
  // --- FUNCIONES PRIVADAS ---
  function _applyStyles() {
    if (document.getElementById('dark-mode-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'dark-mode-styles';
    style.innerHTML = THEME_STYLES;
    document.head.appendChild(style);
  }
  
  function _setTheme(theme) {
    _state.theme = theme;
    document.body.dataset.theme = theme;
    localStorage.setItem(STORAGE_KEY, theme);
  }
  
  function _emit(eventName, detail = {}) {
    // Usar EventEmitter si está disponible (Patrón Observer)
    if (typeof EventEmitter !== 'undefined') {
      EventEmitter.emit(eventName, detail);
    }
    
    // También dispatchear CustomEvent para compatibilidad
    document.dispatchEvent(new CustomEvent(eventName, { detail }));
  }
  
  // --- API PÚBLICA ---
  return {
    init() {
      if (_state.initialized) return;
      _applyStyles();
      _setTheme(_state.theme);
      _state.initialized = true;
      _emit('darkmode:init', { theme: _state.theme });
    },
    
    toggle() {
      const newTheme = _state.theme === 'light' ? 'dark' : 'light';
      
      // Animación de transición
      document.body.style.transition = `background-color ${TRANSITION_DURATION}ms ease, color ${TRANSITION_DURATION}ms ease`;
      
      _setTheme(newTheme);
      
      setTimeout(() => {
        document.body.style.transition = '';
      }, TRANSITION_DURATION);
      
      _emit('darkmode:toggle', { theme: newTheme });
    },
    
    getTheme() {
      return _state.theme;
    },
    
    isDark() {
      return _state.theme === 'dark';
    },
    
    setTheme(theme) {
      if (theme === 'light' || theme === 'dark') {
        _setTheme(theme);
        _emit('darkmode:change', { theme });
      }
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
  window.DarkMode = DarkMode;
  // Exponer como clase para compatibilidad con main.js
  window.DarkModeClass = class {
    constructor() { DarkMode.init(); }
    toggle() { DarkMode.toggle(); }
  };
}

// Auto-inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  if (!DarkMode.isInitialized()) {
    DarkMode.init();
  }
});

// Exportar si ESM
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DarkMode;
}