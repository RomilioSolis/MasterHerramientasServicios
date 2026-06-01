// ============================================
// MÓDULO: BackToTop
// Refactorizado con Module Pattern (IIFE + Revealing Module)
// Botón de regreso al inicio
// ============================================
const BackToTop = (() => {
  
  // --- CONSTANTES PRIVADAS ---
  const _HTML = `
    <button id="app-back-to-top" style="display:none;position:fixed;bottom:20px;right:20px;z-index:9999;width:50px;height:50px;border-radius:50%;background:#d88373;color:white;border:none;cursor:pointer;box-shadow:0 4px 15px rgba(216,131,115,0.4);" aria-label="Volver al inicio" title="Volver arriba">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>
    </button>`;
  
  const _STYLE_ID = 'back-to-top-styles';
  const _BTN_ID = 'app-back-to-top';
  
  // --- ESTADO PRIVADO ---
  let _state = {
    initialized: false
  };
  
  // --- FUNCIONES PRIVADAS ---
  
  /**
   * Carga los estilos CSS
   */
  function _loadStyles() {
    if (document.getElementById(_STYLE_ID)) return;
    const link = document.createElement('link');
    link.id = _STYLE_ID;
    link.rel = 'stylesheet';
    link.href = '/components/back-to-top/back-to-top.css';
    document.head.appendChild(link);
  }
  
  /**
   * Inyecta el HTML en el body
   */
  function _loadHTML() {
    if (document.getElementById(_BTN_ID)) return;
    document.body.insertAdjacentHTML('beforeend', _HTML);
  }
  
  /**
   * Configura el comportamiento del botón
   */
  function _initBtn() {
    const btn = document.getElementById(_BTN_ID);
    if (!btn) return;
    
    btn.onclick = function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    window.addEventListener('scroll', function() {
      btn.style.display = window.scrollY > 300 ? 'flex' : 'none';
    }, { passive: true });
  }
  
  /**
   * Inicializa el módulo
   */
  function _init() {
    _loadStyles();
    _loadHTML();
    _initBtn();
    _state.initialized = true;
  }
  
  // --- API PÚBLICA (REVEALING MODULE) ---
  return {
    init: _init
  };
})();

// Inicialización
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => BackToTop.init());
} else {
  BackToTop.init();
}