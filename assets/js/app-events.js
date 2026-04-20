// ============================================
// APP EVENTS - Constantes de Eventos del Sistema
// Patrón Observer - Comunicación entre componentes
// ============================================

const APP_EVENTS = Object.freeze({
  // ============================================
  // CATEGORÍAS
  // ============================================
  CATEGORY_SELECT: 'category:select',
  CATEGORY_CHANGE: 'category:change',
  CATEGORY_INIT: 'category:init',

  // ============================================
  // TEMA OSCURO
  // ============================================
  THEME_INIT: 'darkmode:init',
  THEME_TOGGLE: 'darkmode:toggle',
  THEME_CHANGE: 'darkmode:change',

  // ============================================
  // EQUIPOS
  // ============================================
  EQUIPOS_LOADED: 'equipos:loaded',
  EQUIPOS_FILTER: 'equipos:filter',
  EQUIPOS_READY: 'equipos:ready',

  // ============================================
  // BÚSQUEDA
  // ============================================
  SEARCH_INIT: 'buscador:init',
  SEARCH_PERFORM: 'buscador:search',
  SEARCH_CLEAR: 'buscador:clear',
  SEARCH_RESULT: 'buscador:result',

  // ============================================
  // UI / MODAL
  // ============================================
  MODAL_OPEN: 'modal:open',
  MODAL_CLOSE: 'modal:close',

  // ============================================
  // NAVEGACIÓN
  // ============================================
  SCROLL_TO_EQUIPOS: 'nav:scroll-to-equipos',
  SCROLL_TO_CONTACTO: 'nav:scroll-to-contacto'
});

// ============================================
// Helper para emitir eventos con fallback
// ============================================
function emitEvent(eventName, detail = {}) {
  if (typeof EventEmitter !== 'undefined') {
    EventEmitter.emit(eventName, detail);
  } else if (typeof document !== 'undefined') {
    document.dispatchEvent(new CustomEvent(eventName, { detail }));
  }
}

// ============================================
// Helper para suscribirse a eventos con cleanup automático
// ============================================
function onEvent(eventName, callback) {
  if (typeof EventEmitter !== 'undefined') {
    return EventEmitter.on(eventName, callback);
  } else if (typeof document !== 'undefined') {
    const handler = (e) => callback(e.detail);
    document.addEventListener(eventName, handler);
    return () => document.removeEventListener(eventName, handler);
  }
  return () => {};
}

// ============================================
// Legacy support
// ============================================
if (typeof window !== 'undefined') {
  window.APP_EVENTS = APP_EVENTS;
  window.emitEvent = emitEvent;
  window.onEvent = onEvent;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { APP_EVENTS, emitEvent, onEvent };
}