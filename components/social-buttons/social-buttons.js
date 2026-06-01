// ============================================
// MÓDULO: SocialButtons
// Refactorizado con Module Pattern (IIFE + Revealing Module)
// ============================================
const SocialButtons = (() => {
  
  // --- CONSTANTES PRIVADAS ---
  const WHATSAPP = {
    PHONE: '573165345675',
    BASE: 'https://wa.me'
  };
  
  const LINKS = Object.freeze({
    FACEBOOK: 'https://www.facebook.com/masters.herramientas/',
    INSTAGRAM: 'https://www.instagram.com/masterenherramientasyservisios/',
    WHATSAPP: `${WHATSAPP.BASE}/${WHATSAPP.PHONE}`
  });
  
  const CONTAINER_ID = 'social-buttons-container';
  const STYLE_ID = 'social-buttons-styles';
  const INLINE_STYLE_ID = 'social-buttons-inline-styles';
  const BACK_TO_TOP_ID = 'app-back-to-top';
  
  // --- ESTADO PRIVADO ---
  let _state = {
    initialized: false,
    container: null
  };
  
  // --- FUNCIONES PRIVADAS ---
  
  /**
   * Genera el HTML de los botones sociales
   * @returns {string} HTML
   */
  function _getHTML() {
    return `
<div class="social-buttons">
  <a href="${LINKS.FACEBOOK}" class="social-button facebook-button" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
    <svg viewBox="0 0 24 24" width="24" height="24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
  </a>
  <a href="${LINKS.INSTAGRAM}" class="social-button instagram-button" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
    <svg viewBox="0 0 24 24" width="24" height="24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
  </a>
  <a href="${LINKS.WHATSAPP}" class="social-button whatsapp-button" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
    <svg viewBox="0 0 24 24" width="24" height="24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
  </a>
</div>`;
  }
  
  /**
   * CSS embebido como fallback
   * @returns {string} CSS
   */
  function _getInlineCSS() {
    return `
.social-buttons { position: fixed; right: 20px; top: 50%; transform: translateY(-50%); display: flex !important; flex-direction: column; gap: 10px; z-index: 10001; }
.social-buttons a.social-button { display: flex !important; width: 50px; height: 50px; border-radius: 50%; align-items: center; justify-content: center; transition: all 0.3s ease; color: white; text-decoration: none; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
.social-buttons a.social-button svg { width: 24px; height: 24px; display: block; fill: white !important; }
.social-buttons a.social-button:hover { transform: scale(1.1); box-shadow: 0 4px 8px rgba(0,0,0,0.3); }
.social-buttons a.facebook-button { background-color: #1877f2 !important; }
.social-buttons a.instagram-button { background: linear-gradient(45deg, #405de6, #5851db, #833ab4, #c13584, #e1306c, #fd1d1d) !important; }
.social-buttons a.whatsapp-button { background-color: #25d366 !important; }
`;
  }
  
  /**
   * Intenta cargar CSS externo, hace fallback a CSS embebido
   */
  function _loadStyles() {
    if (document.getElementById(STYLE_ID) || document.getElementById(INLINE_STYLE_ID)) {
      return;
    }
    
    // Intentar cargar CSS externo
    const link = document.createElement('link');
    link.id = STYLE_ID;
    link.rel = 'stylesheet';
    link.href = '/components/social-buttons/social-buttons.css';
    link.onload = () => console.log('SocialButtons: CSS externo cargado');
    link.onerror = () => {
      console.warn('SocialButtons: Fallback a CSS embebido');
      _injectInlineStyles();
    };
    document.head.appendChild(link);
    
    // Timeout para fallback
    setTimeout(() => {
      if (!document.getElementById(STYLE_ID)) {
        _injectInlineStyles();
      }
    }, 2000);
  }
  
  /**
   * Inyecta CSS embebido
   */
  function _injectInlineStyles() {
    if (document.getElementById(INLINE_STYLE_ID)) return;
    
    const style = document.createElement('style');
    style.id = INLINE_STYLE_ID;
    style.textContent = _getInlineCSS();
    document.head.appendChild(style);
    console.log('SocialButtons: CSS embebido aplicado');
  }
  
  /**
   * Busca el contenedor con reintentos
   * @returns {HTMLElement|null}
   */
  function _findContainer() {
    return new Promise((resolve) => {
      let retries = 0;
      const maxRetries = 5;
      
      const tryFind = () => {
        const container = document.getElementById(CONTAINER_ID);
        
        if (!container && retries < maxRetries) {
          retries++;
          setTimeout(tryFind, 100);
          return;
        }
        
        resolve(container);
      };
      
      tryFind();
    });
  }
  
  /**
   * Renderiza los botones en el contenedor
   */
  async function _render() {
    const container = await _findContainer();
    
    if (!container) {
      console.error('SocialButtons: contenedor no encontrado');
      return;
    }
    
    if (container.innerHTML.trim()) return;
    
    container.innerHTML = _getHTML();
    console.log('SocialButtons: HTML inyectado');
  }
  
  /**
   * Inicializa el botón BackToTop
   */
  function _initBackToTop() {
    if (document.getElementById(BACK_TO_TOP_ID)) return;
    
    const btHtml = `<button id="${BACK_TO_TOP_ID}" style="display:none;position:fixed;bottom:20px;right:20px;z-index:9999;width:50px;height:50px;border-radius:50%;background:#d88373;color:#fff;border:none;cursor:pointer;box-shadow:0 4px 15px rgba(216,131,115,0.4);display:flex;align-items:center;justify-content:center;" aria-label="Volver arriba" title="Volver arriba">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
    </button>`;
    document.body.insertAdjacentHTML('beforeend', btHtml);
    
    const btStyle = document.createElement('style');
    btStyle.textContent = `#${BACK_TO_TOP_ID}{position:fixed;bottom:20px;right:20px;z-index:9999;width:50px;height:50px;border-radius:50%;background:#d88373;color:#fff;border:none;cursor:pointer;box-shadow:0 4px 15px rgba(216,131,115,0.4);display:flex;align-items:center;justify-content:center}#${BACK_TO_TOP_ID} svg{width:28px;height:28px}#${BACK_TO_TOP_ID}:hover{transform:scale(1.1);background:#bd1e1e}`;
    document.head.appendChild(btStyle);
    
    const btBtn = document.getElementById(BACK_TO_TOP_ID);
    btBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    window.addEventListener('scroll', () => {
      btBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
    }, { passive: true });
    
    console.log('BackToTop: inicializado');
  }
  
  // --- INICIALIZACIÓN ---
  function _init() {
    if (_state.initialized) return;
    _state.initialized = true;
  }
  
  // --- API PÚBLICA (REVEALING MODULE) ---
  return {
    /**
     * Inicializa los botones sociales y BackToTop
     */
    init: async function() {
      try {
        _init();
        _loadStyles();
        await _render();
        _initBackToTop();
        console.log('SocialButtons: inicializado');
      } catch (e) {
        console.error('SocialButtons.init() error:', e.message);
      }
    },
    
    /**
     * Retorna los enlaces sociales
     * @returns {Object} Links congelados
     */
    getLinks: function() {
      return LINKS;
    },
    
    /**
     * Verifica si está inicializado
     * @returns {boolean}
     */
    isInitialized: function() {
      return _state.initialized;
    }
  };
})();

// Auto-inicialización si hay contenedor
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('social-buttons-container');
  if (container) {
    SocialButtons.init();
  }
});

// Exportar si ESM disponible
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SocialButtons;
}