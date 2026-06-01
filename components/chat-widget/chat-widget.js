// ============================================
// CHAT WIDGET LOADER - Notifica cuando el componente está listo
// ============================================

(function() {
  'use strict';
  
  // Escuchar evento de ComponentFactory para inicializar
  document.addEventListener('component:loaded', function(e) {
    if (e.detail && e.detail.id === 'chat-widget') {
      //Dar un pequeño delay para asegurar que el HTML esté renderizado
      setTimeout(function() {
        if (window.ChatWidget && typeof window.ChatWidget.init === 'function') {
          window.ChatWidget.init();
          console.log('[ChatWidgetLoader] ChatWidget inicializado');
        }
      }, 50);
    }
  });
  
  // Auto-iniciar si el widget ya está en el DOM al cargar este script
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      var container = document.getElementById('chat-widget-container');
      if (container && container.querySelector('#cw-fab')) {
        setTimeout(function() {
          if (window.ChatWidget && typeof window.ChatWidget.init === 'function') {
            window.ChatWidget.init();
          }
        }, 50);
      }
    });
  } else {
    var container = document.getElementById('chat-widget-container');
    if (container && container.querySelector('#cw-fab')) {
      setTimeout(function() {
        if (window.ChatWidget && typeof window.ChatWidget.init === 'function') {
          window.ChatWidget.init();
        }
      }, 50);
    }
  }
  
  console.log('[ChatWidgetLoader] Cargado');
})();
