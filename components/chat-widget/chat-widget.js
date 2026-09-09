// ============================================
// CHAT WIDGET LOADER - Notifica cuando el componente está listo
// ============================================

(function() {
  'use strict';
  
  document.addEventListener('component:loaded', function(e) {
    if (e.detail && e.detail.id === 'chat-widget') {
      if (window.ChatWidget && typeof window.ChatWidget.init === 'function') {
        window.ChatWidget.init();
        console.log('[ChatWidgetLoader] ChatWidget inicializado');
      }
    }
  });
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      if (window.ChatWidget && typeof window.ChatWidget.init === 'function') {
        window.ChatWidget.init();
      }
    });
  } else {
    if (window.ChatWidget && typeof window.ChatWidget.init === 'function') {
      window.ChatWidget.init();
    }
  }
  
  console.log('[ChatWidgetLoader] Cargado');
})();
