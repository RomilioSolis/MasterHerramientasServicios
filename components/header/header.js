// Header Component - Orchestrator (script clásico para GitHub Pages)
// Carga dinámicamente: equipos-dropdown.js, buscador-unificado.js

const headerData = {
    logo: {
        src: 'assets/imagenes/logo.png',
        alt: 'Logo',
        text: 'Master en Herramientas y Servicios'
    },
    nav: [
        { href: '#nosotros', text: 'Nosotros' },
        { href: '#equipos', text: 'Equipo', isDropdown: true },
        { href: '#contacto', text: 'Contacto' }
    ]
};

function loadStyles() {
    return new Promise((resolve) => {
        if (document.getElementById('header-styles')) {
            resolve();
            return;
        }
        const link = document.createElement('link');
        link.id = 'header-styles';
        link.rel = 'stylesheet';
        link.href = 'components/header/header.css';
        link.onload = resolve;
        document.head.appendChild(link);
    });
}

function getHeaderHTML() {
    return `
    <header class="modern-header" data-theme-style="dark">
        <div class="container">
            <div class="header-inner">
                <a href="./" class="logo">
                    <img src="${headerData.logo.src}" alt="${headerData.logo.alt}" class="header-logo" width="180" height="50">
                    <span class="logo-text">${headerData.logo.text}</span>
                </a>
                <button class="mobile-toggle" aria-label="Abrir menú" onclick="document.querySelector('.navigation-nav').classList.toggle('active')">
                    <i class="bi bi-list"></i>
                </button>
                <nav class="navigation-nav" aria-label="Navegación principal">
                    ${headerData.nav.map(item => {
                        if (item.isDropdown) {
                            return `<button type="button" id="equipos-dropdown-trigger" class="navigation-link" aria-label="Abrir catálogo de equipos" aria-expanded="false" aria-controls="equiposDropdownMenu" onclick="(window.toggleEquiposDropdownInternal || window.toggleEquiposDropdown || function() {})()">
                                ${item.text} <i class="bi bi-chevron-down dropdown-arrow"></i>
                            </button>`;
                        }
                        return `<a href="${item.href}" class="navigation-link">${item.text}</a>`;
                    }).join('')}
                </nav>
                <div class="header-right">
                <div class="search-box">
                    <input type="text" id="toolSearch" class="search-input" placeholder="Buscar herramientas..." aria-label="Buscar herramientas" autocomplete="off">
                    <button type="button" class="search-btn" onclick="searchTools()" aria-label="Buscar">
                        <i class="bi bi-search"></i>
                    </button>
                    <div id="searchFeedback" class="search-feedback"></div>
                    <div id="searchHistory" class="search-history"></div>
                </div>
                    <button type="button" class="search-btn mobile-search-toggle" onclick="document.querySelector('.search-box').classList.toggle('active')" aria-label="Buscar">
                        <i class="bi bi-search"></i>
                    </button>
                    <div id="dark-mode-header"></div>
                </div>
            </div>
        </div>
    </header>
    `;
}

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
    });
}

async function _loadScriptDuringIdle(src) {
    if ('requestIdleCallback' in window) {
      await new Promise((resolve, reject) => {
        window.requestIdleCallback(() => loadScript(src).then(resolve).catch(reject), { timeout: 3000 });
      });
    } else {
      await loadScript(src);
    }
  }

  async function loadHeaderComponent() {
    await loadStyles();

    const headerContainer = document.getElementById('header-app');
    if (!headerContainer) return;

    headerContainer.innerHTML = getHeaderHTML();

    // Critical: equipos-dropdown.js (needed for dropdown interactions)
    try {
      console.log('Header: Cargando equipos-dropdown.js...');
      await loadScript('components/equipos-dropdown/equipos-dropdown.js');
      console.log('Header: Script cargado, initEquiposDropdown existe:', typeof window.initEquiposDropdown);
      
      if (window.initEquiposDropdown) {
        const result = await window.initEquiposDropdown();
        console.log('Header: EquiposDropdown inicializado:', result);
      } else {
        console.error('EquiposDropdown: initEquiposDropdown no disponible');
      }
    } catch (e) {
      console.error('Error cargando equipos-dropdown.js:', e);
    }

    // Non-critical: buscador-unificado.js (loaded during idle time to reduce TBT)
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(async () => {
        try {
          await loadScript('assets/js/buscador-unificado.js');
          if (window.Buscador) {
            window.Buscador.init();
          }
        } catch (e) {
          console.error('Error cargando buscador-unificado.js:', e);
        }
      }, { timeout: 2000 });
    } else {
      loadScript('assets/js/buscador-unificado.js').then(() => {
        if (window.Buscador) {
          window.Buscador.init();
        }
      }).catch(e => console.error('Error cargando buscador-unificado.js:', e));
    }

    // Detach MutationObservers after they've done their job
    const setupObserver = (elementId, selector) => {
      const el = document.getElementById(elementId);
      if (!el) return null;
      const observer = new MutationObserver((mutations) => {
        const items = el.querySelectorAll(selector);
        if (items.length > 0) {
          observer.disconnect();
        }
      });
      observer.observe(el, { childList: true, subtree: true });
      return observer;
    };

    setupObserver('netflixRows', '.netflix-item');
    setupObserver('herramientas-container', '.col-md-4');
  }

  document.addEventListener('DOMContentLoaded', loadHeaderComponent);

// Exponer búsqueda global (buscador-unificado ya expone searchTools, pero mantenemos por compatibilidad)
window.searchTools = function(query) {
    if (window.Buscador) {
        if (query) {
            window.Buscador.search(query);
        } else {
            window.Buscador.search(window.Buscador.getQuery());
        }
    }
};

// No ES6 export; usamos window