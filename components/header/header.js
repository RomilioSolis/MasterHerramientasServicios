// Header Component - Orchestrator (script clásico para GitHub Pages)
// Carga dinámicamente: equipos-dropdown.js, buscador-unificado.js

const headerData = {
    logo: {
        src: 'assets/imagenes/logo.webp',
        alt: 'Logo',
        text: 'Master en Herramientas y Servicios'
    },
    nav: [
        { href: '#nosotros', text: 'Nosotros' },
        { href: '#equipos', text: 'Alquiler de equipos', dataMode: 'alquiler' },
        { href: '#equipos', text: 'Venta de equipos', dataMode: 'venta' },
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
                        if (item.dataMode) {
                            return `<a href="${item.href}" class="navigation-link equipos-nav-link" data-mode="${item.dataMode}" aria-label="${item.text}">
                                ${item.text}
                            </a>`;
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
    if (headerContainer && headerContainer.children.length === 0) {
      headerContainer.innerHTML = getHeaderHTML();
    }

       // Critical: equipos-dropdown.js (needed for dropdown interactions)
      try {
        await loadScript('components/equipos-dropdown/equipos-dropdown.js');
        if (window.initEquiposDropdown) {
          await window.initEquiposDropdown();
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

      // Bind click handlers for Alquiler/Venta nav links to set mode before navigation
      _bindEquiposNavLinks();
    }

    function _bindEquiposNavLinks() {
      const links = document.querySelectorAll('.equipos-nav-link');
      links.forEach(link => {
        link.addEventListener('click', (e) => {
          const mode = link.dataset.mode;
          // Notificar al catálogo antes de navegar
          document.dispatchEvent(new CustomEvent('equipos:mode:change', {
            detail: { mode }
          }));
          if (typeof EventEmitter !== 'undefined') {
            EventEmitter.emit('equipos:mode:change', { mode });
          }
          // Allow default navigation to #equipos
        });
      });
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