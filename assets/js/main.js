// DarkMode ya está disponible globalmente desde dark-mode.js
if (window.DarkMode && !window.DarkMode.isInitialized()) {
  window.DarkMode.init();
}

// Cargar componentes dinámicos via ComponentFactory
if (typeof ComponentFactory !== 'undefined' && ComponentFactory.loadAll) {
  ComponentFactory.loadAll(['footer', 'contacto', 'faq', 'nosotros', 'social-buttons', 'chat-widget']);
}

// Inicializar buscador unificado
if (typeof initBuscador === 'function') {
  initBuscador();
}

// Inicializar ChatWidget
if (typeof ChatWidget !== 'undefined' && ChatWidget.init) {
  ChatWidget.init();
}

// Componentes Motosierra y Equipos están autocargados vía defer en sus scripts

// Componente Equipos - maneja lógica de mostrar equipos
if (typeof EquiposLoader !== 'undefined' && EquiposLoader.init) {
  EquiposLoader.init();
  console.log('EquiposLoader loaded');
}

// Sistema de búsqueda desde URL
const handleUrlSearch = () => {
  const params = new URLSearchParams(window.location.search);
  const searchTerm = params.get('search');

  if (searchTerm) {
    // Inicializar buscador unificado
    if (typeof initBuscador === 'function') {
      initBuscador();
      
      // Esperar a que los equipos se carguen y luego buscar
      setTimeout(() => {
        const buscador = typeof getBuscador === 'function' ? getBuscador() : null;
        if (buscador) {
          buscador.search(searchTerm);
        }
      }, 1500);
    }
  }
};

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', handleUrlSearch);
} else {
  handleUrlSearch();
}
