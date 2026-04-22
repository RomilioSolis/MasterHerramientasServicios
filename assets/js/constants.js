// ============================================
// CONSTANTS - Configuración Centralizada
// ============================================

const APP_CONFIG = Object.freeze({
  // ============================================
  // Teléfonos
  // ============================================
  PHONE: {
    PRIMARY: '3165345675',
    SECONDARY: '3163550319',
    WHATSAPP: '573165345675',
    CALL: '+573165345675'
  },

  // ============================================
  // URLs
  // ============================================
  URLS: {
    BASE: 'https://masterenherramientasyservicios.com.co',
    WHATSAPP_BASE: 'https://wa.me',
    FACEBOOK: 'https://www.facebook.com/MasterHerramientas',
    INSTAGRAM: 'https://www.instagram.com/MasterHerramientas',
    GOOGLE_MAPS: 'https://www.google.com/maps',
    GOOGLE_MAPS_LOCATION: 'https://www.google.com/maps/dir/?api=1&destination=3.438050,-76.538800'
  },

  // ============================================
  // Datos de Empresa
  // ============================================
  BUSINESS: {
    NAME: 'Master Herramientas y Servicios',
    ADDRESS: 'Cra. 23 #36-48, Barrio El Rodeo, Cali',
    SCHEDULE: 'Lun-Vie: 8:00 - 18:00 | Sáb: 8:00 - 16:00',
    FOUNDATION_YEAR: 2014,
    CITY: 'Cali',
    REGION: 'Valle del Cauca',
    EMAIL: 'info@masterenherramientasyservicios.com.co'
  },

  // ============================================
  // Rutas
  // ============================================
  PATHS: {
    COMPONENTS: 'components',
    ASSETS: 'assets',
    IMAGES: 'assets/imagenes',
    VIDEOS: 'assets/Videos',
    CSS: 'assets/css',
    JS: 'assets/js',
    UTILS: 'assets/js/utils'
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