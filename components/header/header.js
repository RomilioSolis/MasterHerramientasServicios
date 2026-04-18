// Header Component - Coordina todos los subcomponentes del header
import { initBuscador, searchTools as searchToolsExport, getBuscador } from '../../assets/js/buscador-unificado.js';
import LateralMenu from '../lateral-menu/lateral-menu.js';

const headerData = {
    logo: {
        src: '/assets/imagenes/logo.jpg',
        alt: 'Logo',
        text: 'Master en Herramientas y Servicios'
    },
    nav: [
        { href: '#nosotros', text: 'Nosotros' },
        { href: '#equipos', text: 'Equipo' },
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
        link.href = '/components/header/header.css';
        link.onload = resolve;
        document.head.appendChild(link);
    });
}

function getHeaderHTML() {
    return `
    <header class="modern-header" data-theme-style="dark">
        <div class="container">
            <div class="header-inner">
                <button type="button" class="lateral-menu-toggle" onclick="openLateralMenu()" aria-label="Categorías">
                    <i class="bi bi-list"></i>
                </button>
                <a href="/" class="logo">
                    <img src="${headerData.logo.src}" alt="${headerData.logo.alt}" class="header-logo">
                    <span class="logo-text">${headerData.logo.text}</span>
                </a>
                <button class="mobile-toggle" aria-label="Abrir menú" onclick="document.querySelector('.nav-main').classList.toggle('active')">
                    <i class="bi bi-list"></i>
                </button>
                <nav class="nav-main" aria-label="Navegación principal">
                    ${headerData.nav.map(item => `<a href="${item.href}" class="nav-link">${item.text}</a>`).join('')}
                </nav>
                <div class="header-right">
                    <div class="search-box">
                        <input type="text" id="toolSearch" class="search-input" placeholder="Buscar herramientas..." aria-label="Buscar herramientas">
                        <button type="button" class="search-btn" onclick="searchTools()" aria-label="Buscar">
                            <i class="bi bi-search"></i>
                        </button>
                        <div id="searchFeedback" class="search-feedback"></div>
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

async function loadHeaderComponent() {
    await loadStyles();
    
    const headerContainer = document.getElementById('header-app');
    if (!headerContainer) return;

    // Cargar template del header
    headerContainer.innerHTML = getHeaderHTML();
    
    // Inicializar menú lateral
    const lateralContainer = document.getElementById('lateral-menu-container');
    if (!lateralContainer) {
        const lateralDiv = document.createElement('div');
        lateralDiv.id = 'lateral-menu-container';
        document.body.appendChild(lateralDiv);
    }
    document.getElementById('lateral-menu-container').innerHTML = LateralMenu.getHTML();
    await LateralMenu.init();
    
    // Inicializar buscador
    initBuscador();

    // Observar carga de contenido para re-aplicar búsqueda
    const netflixRows = document.getElementById('netflixRows');
    if (netflixRows) {
        const observer = new MutationObserver(() => {
            const items = netflixRows.querySelectorAll('.netflix-item');
            if (items.length > 0) {
                observer.disconnect();
            }
        });
        observer.observe(netflixRows, { childList: true, subtree: true });
    }

    const herramientasContainer = document.getElementById('herramientas-container');
    if (herramientasContainer) {
        const observer = new MutationObserver(() => {
            const cards = herramientasContainer.querySelectorAll('.col-md-4');
            if (cards.length > 0) {
                observer.disconnect();
            }
        });
        observer.observe(herramientasContainer, { childList: true, subtree: true });
    }
}

document.addEventListener('DOMContentLoaded', loadHeaderComponent);

// Hacer funciones disponibles globalmente
window.searchTools = searchToolsExport;
window.getBuscador = getBuscador;

export default { headerData, getHeaderHTML, loadHeaderComponent, searchTools: searchToolsExport };
