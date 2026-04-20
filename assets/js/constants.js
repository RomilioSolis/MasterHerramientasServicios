// ============================================
// CONSTANTS - Configuración Centralizada
// ============================================

const APP_CONFIG = Object.freeze({
  // ============================================
  // Teléfonos
  // ============================================
  PHONE: {
    WHATSAPP: '573165345675',
    CALL: '+573165345675'
  },

  // ============================================
  // URLs
  // ============================================
  URLS: {
    BASE: 'https://masterenherramientasyservicios.com.co',
    WHATSAPP_BASE: 'https://wa.me',
    FACEBOOK: 'https://www.facebook.com/masters.herramientas/',
    INSTAGRAM: 'https://www.instagram.com/masterenherramientasyservisios/',
    GOOGLE_MAPS: 'https://www.google.com/maps'
  },

  // ============================================
  // Rutas
  // ============================================
  PATHS: {
    COMPONENTS: '/components',
    ASSETS: '/assets',
    IMAGES: '/assets/imagenes',
    VIDEOS: '/assets/Videos',
    CSS: '/assets/css',
    JS: '/assets/js'
  },

  // ============================================
  // Tiempos (ms)
  // ============================================
  TIMING: {
    LAZY_DELAY: 500,
    DEBOUNCE_DELAY: 250,
    ANIMATION_DURATION: 300,
    SCROLL_AMOUNT: 300
  },

  // ============================================
  // UI
  // ============================================
  UI: {
    Z_INDEX: {
      HEADER: 1000,
      MODAL: 10000,
      SOCIAL: 10001
    },
    breakpoints: {
      MOBILE: 768,
      TABLET: 992,
      DESKTOP: 1200
    }
  },

  // ============================================
  // Categorías de Equipos
  // ============================================
  CATEGORIES: {
    ALL: 'all',
    DEFAULT: 'all',
    LIST: [
      { id: 'elevacion', label: 'Elevación y Levante' },
      { id: 'perforacion', label: 'Perforación y Corte' },
      { id: 'mezclado', label: 'Mezclado y Compactación' },
      { id: 'limpieza', label: 'Limpieza e Hidráulica' },
      { id: 'soldadura', label: 'Soldadura y Energía' },
      { id: 'construccion', label: 'Construcción y Estructura' },
      { id: 'movimiento', label: 'Accesorios de Movimiento' },
      { id: 'jardin', label: 'Jardín y Forestal' }
    ]
  }
});

// ============================================
//Helper para WhatsApp
// ============================================
const WHATSAPP = Object.freeze({
  formatPhone(phone = APP_CONFIG.PHONE.WHATSAPP) {
    return phone.replace(/\D/g, '');
  },
  createLink(message, phone = APP_CONFIG.PHONE.WHATSAPP) {
    const text = encodeURIComponent(message);
    const formatted = this.formatPhone(phone);
    return `${APP_CONFIG.URLS.WHATSAPP_BASE}/${formatted}?text=${text}`;
  },
  defaultMessage: 'Hola, necesito información sobre'
});

// Exportar si ESM
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { APP_CONFIG, WHATSAPP };
}