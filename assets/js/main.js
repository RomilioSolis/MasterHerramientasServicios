// DarkMode ya está disponible globalmente desde dark-mode.js
// Usar el módulo ya cargado
if (window.DarkMode) {
  window.darkMode = window.DarkMode;
  window.DarkMode.init();
}

// Inicializar buscador unificado
if (typeof initBuscador === 'function') {
  initBuscador();
}

// Inicializar ChatWidget
if (typeof ChatWidget !== 'undefined' && ChatWidget.init) {
  ChatWidget.init();
}

// Componente Motosierra
if (typeof Motosierra !== 'undefined') {
  new Motosierra();
}

// Componente Equipos - maneja lógica de mostrar equipos
if (typeof Equipos !== 'undefined' && Equipos.init) {
  Equipos.init();
  console.log('Equipos loaded');
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
