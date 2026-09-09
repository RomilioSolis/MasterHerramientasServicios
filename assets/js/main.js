// DarkMode ya está disponible globalmente desde dark-mode.js (defer)
if (window.DarkMode && !window.DarkMode.isInitialized()) {
  window.DarkMode.init();
}

// Cargar componentes críticos (above-the-fold y near-the-fold)
if (typeof ComponentFactory !== 'undefined' && ComponentFactory.loadAll) {
  // Nosotros ya está inlined (solo necesita JS/CSS)
  // Footer, contacto y FAQ son near-the-fold
  ComponentFactory.loadAll(['nosotros', 'footer', 'contacto', 'faq']);
}

// Cargar componentes no críticos de forma lazy (reduce TBT)
if (typeof ComponentFactory !== 'undefined' && ComponentFactory.loadLazy) {
  ComponentFactory.loadLazy(['social-buttons', 'chat-widget', 'backToTop']);
}

// Sistema de búsqueda desde URL
const handleUrlSearch = async () => {
  const params = new URLSearchParams(window.location.search);
  const searchTerm = params.get('search');

  if (searchTerm) {
    if (typeof initBuscador === 'function') {
      initBuscador();
    } else if (window.Buscador?.init) {
      window.Buscador.init();
    }

    const waitForBuscador = () => new Promise((resolve) => {
      const check = () => {
        if (window.Buscador?.isInitialized()) {
          resolve(window.Buscador);
          return;
        }
        setTimeout(check, 100);
      };
      check();
    });

    const buscador = await Promise.race([
      waitForBuscador(),
      new Promise((resolve) => setTimeout(() => resolve(null), 5000))
    ]);

    if (buscador) {
      buscador.search(searchTerm);
    }
  }
};

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', handleUrlSearch);
} else {
  handleUrlSearch();
}
