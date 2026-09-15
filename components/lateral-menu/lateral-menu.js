// ============================================
// MÓDULO: LateralMenu
// Refactorizado con Module Pattern (IIFE + Revealing Module)
// Menú lateral para navegación de categorías
// ============================================
const _WHATSAPP_PHONE = (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.PHONE.WHATSAPP) || '573165345675';
const LateralMenu = (() => {
  
  // --- CONSTANTES PRIVADAS ---
  const _CATEGORIES_DATA = {
    elevacion: [
      { name: 'Gatos Hidráulicos', img: '/assets/imagenes/gatosM/gatos.webp', wa: 'gato%20hidraulico' },
      { name: 'Gato Estibador', img: '/assets/imagenes/Estibador/estibador.webp', wa: 'gato%20estibador' },
      { name: 'Ganchos Colgantes', img: '/assets/imagenes/GanchosColgantes/GanchosColgantes.webp', wa: 'ganchos%20colgantes' },
      { name: 'Winches', img: '/assets/imagenes/Winches/Winches.webp', wa: 'winche' },
      { name: 'Pluma Grúa', img: '/assets/imagenes/PlumaGrua/PlumaGrua.webp', wa: 'pluma%20grua' },
      { name: 'Andamios Certificados', img: '/assets/imagenes/Andamios Certificados/Andamio Certificado 1.webp', wa: 'andamios%20certificados' }
    ],
    perforacion: [
      { name: 'Taladros', img: '/assets/imagenes/Taladros/Taladro.webp', wa: 'taladro' },
      { name: 'Taladro Magnético', img: '/assets/imagenes/TaladroMagnetico/TaladroMagnetico1.webp', wa: 'taladro%20magnetico' },
      { name: 'Extractores', img: '/assets/imagenes/Extractores/Extractor.webp', wa: 'extractor' },
      { name: 'Sonda Eléctrica', img: '/assets/imagenes/SondaElectrica/SondaElectrica.webp', wa: 'sonda%20electrica' },
      { name: 'Esmeriladora', img: '/assets/imagenes/Esmeril/Esmeril.webp', wa: 'esmeriladora' },
      { name: 'Equipo Oxicorte', img: '/assets/imagenes/Oxicorte/EquiOxicorte.webp', wa: 'equipo%20oxicorte' },
      { name: 'Cortadora Porcelanato', img: '/assets/imagenes/CortadoraPorcelanato/CortadoraPorcelanato.webp', wa: 'cortadora%20porcelanato' },
      { name: 'Extracción Núcleos', img: '/assets/imagenes/ExtraNucleo/ExtraNucleo.webp', wa: 'extraccion%20nucleos' }
    ],
    mezclado: [
      { name: 'Trompo Mezclador', img: '/assets/imagenes/TrompoMezclador/TrompoMezclador.webp', wa: 'trompo%20mezclador' },
      { name: 'Vibrocompactadora', img: '/assets/imagenes/VibroCompactadora/VibroCompactadora.webp', wa: 'vibrocompactadora' }
    ],
    limpieza: [
      { name: 'Hidrolavadora', img: '/assets/imagenes/Hidrolavadora/Hidrolavadora.webp', wa: 'hidrolavadora' },
      { name: 'Aspiradora Industrial', img: '/assets/imagenes/Aspiradora/Aspiradora.webp', wa: 'aspiradora%20industrial' },
      { name: 'Motobomba Sumergible', img: '/assets/imagenes/Motobomba/MotoBombaLapi.webp', wa: 'motobomba%20sumergible' }
    ],
    soldadura: [
      { name: 'Soldadora', img: '/assets/imagenes/Soldador/Soldador.webp', wa: 'soldadora' },
      { name: 'Planta Eléctrica', img: '/assets/imagenes/PlantaElectrica/PlantaEnergia.webp', wa: 'planta%20electrica' },
      { name: 'Compresor', img: '/assets/imagenes/Compresor/compresor.webp', wa: 'compresor' }
    ],
    construccion: [
      { name: 'Andamios', img: '/assets/imagenes/Andamios/Andamios.webp', wa: 'andamios' },
      { name: 'Estanterías', img: '/assets/imagenes/Estanteria/Estanteria.webp', wa: 'estanterias' },
      { name: 'Parasoles', img: '/assets/imagenes/Parasol/Parasol.webp', wa: 'parasoles' }
    ],
    movimiento: [
      { name: 'Diferenciales', img: '/assets/imagenes/Diferencial/Diferencial.webp', wa: 'diferenciales' },
      { name: 'Carretilla', img: '/assets/imagenes/Carretilla/Carretilla.webp', wa: 'carretilla' },
      { name: 'Buggy', img: '/assets/imagenes/Buggy/Buggy.webp', wa: 'buggy' }
    ],
    jardin: [
      { name: 'Escaleras', img: '/assets/imagenes/Escaleras/escaleras.webp', wa: 'escaleras' },
      { name: 'Motosierra', img: '/assets/imagenes/Motosierra/Motosierra.webp', wa: 'motosierra' }
    ]
  };
  
  const _CATEGORY_NAMES = {
    elevacion: 'Elevación y Levante',
    perforacion: 'Perforación y Corte',
    mezclado: 'Mezclado y Compactación',
    limpieza: 'Limpieza e Hidráulica',
    soldadura: 'Soldadura y Energía',
    construccion: 'Construcción y Estructura',
    movimiento: 'Accisores de Movimiento',
    jardin: 'Jardín y Forestal'
  };
  
  // --- ESTADO PRIVADO ---
  let _state = {
    initialized: false
  };
  
  // --- FUNCIONES PRIVADAS ---
  
  function _loadStyles() {
    return new Promise((resolve) => {
      if (document.getElementById('lateral-menu-styles')) {
        resolve();
        return;
      }
      const link = document.createElement('link');
      link.id = 'lateral-menu-styles';
      link.rel = 'stylesheet';
      link.href = '/components/lateral-menu/lateral-menu.css';
      link.onload = resolve;
      document.head.appendChild(link);
    });
  }
  
  function _getLateralMenuHTML() {
    let categoriasHTML = '';
    
    for (const [category, items] of Object.entries(_CATEGORIES_DATA)) {
      const categoryName = _CATEGORY_NAMES[category];
      const itemsHTML = items.map(item => `
        <li class="lateral-equipment-item">
          <button class="lateral-equipment-btn" onclick="window.open('https://wa.me/${_WHATSAPP_PHONE}?text=Hola,%20necesito%20cotizar%20${item.wa}', '_blank')">
            <img src="${item.img}" alt="${item.name}">
            <span>${item.name}</span>
            <span class="lateral-equipment-whatsapp"><i class="bi bi-whatsapp"></i></span>
          </button>
        </li>
      `).join('');
      
      categoriasHTML += `
        <div class="lateral-category">
          <button class="lateral-category-btn" onclick="LateralMenu._handleCategoryClick('${category}')">
            <span>${categoryName}</span>
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      `;
    }
    
    return `
      <div class="lateral-menu-overlay" onclick="LateralMenu.close()"></div>
      <nav class="lateral-menu" aria-label="Menú de categorías">
        <div class="lateral-menu-header">
          <h3>Categorías</h3>
          <button class="lateral-menu-close" onclick="LateralMenu.close()" aria-label="Cerrar menú">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="lateral-menu-content">
          ${categoriasHTML}
        </div>
      </nav>
    `;
  }
  
  function _showLateralSubmenu(category) {
    const equipment = _CATEGORIES_DATA[category];
    const categoryName = _CATEGORY_NAMES[category];
    
    let html = `
      <div class="lateral-submenu" id="lateralSubmenu">
        <div class="lateral-submenu-header">
          <button class="lateral-submenu-back" onclick="LateralMenu._closeLateralSubmenu()" aria-label="Volver">
            <i class="bi bi-arrow-left"></i>
          </button>
          <h3>${categoryName}</h3>
        </div>
        <ul class="lateral-equipment-list">
    `;
    
    equipment.forEach(item => {
      html += `
        <li class="lateral-equipment-item">
          <button class="lateral-equipment-btn" onclick="window.open('https://wa.me/${_WHATSAPP_PHONE}?text=Hola,%20necesito%20cotizar%20${item.wa}', '_blank')">
            <img src="${item.img}" alt="${item.name}">
            <span>${item.name}</span>
            <span class="lateral-equipment-whatsapp"><i class="bi bi-whatsapp"></i></span>
          </button>
        </li>
      `;
    });
    
    html += '</ul></div>';
    
    const existingSubmenu = document.getElementById('lateralSubmenu');
    if (existingSubmenu) {
      existingSubmenu.remove();
    }
    
    document.body.insertAdjacentHTML('beforeend', html);
    
    setTimeout(() => {
      const submenu = document.getElementById('lateralSubmenu');
      if (submenu) submenu.classList.add('open');
    }, 10);
  }
  
  function _closeLateralSubmenu() {
    const submenu = document.getElementById('lateralSubmenu');
    if (submenu) {
      submenu.classList.remove('open');
      setTimeout(() => submenu.remove(), 300);
    }
  }
  
  function _openMenu() {
    const menu = document.querySelector('.lateral-menu');
    const overlay = document.querySelector('.lateral-menu-overlay');
    if (menu && overlay) {
      menu.classList.add('open');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }
  
  function _closeMenu() {
    const menu = document.querySelector('.lateral-menu');
    const overlay = document.querySelector('.lateral-menu-overlay');
    if (menu && overlay) {
      menu.classList.remove('open');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      _closeLateralSubmenu();
    }
  }
  
  function _init() {
    _loadStyles().then(() => {
      _state.initialized = true;
      console.log('LateralMenu inicializado');
    });
  }
  
  // --- API PÚBLICA (REVEALING MODULE) ---
  return {
    init: _init,
    getHTML: _getLateralMenuHTML,
    open: _openMenu,
    close: _closeMenu,
    showSubmenu: _showLateralSubmenu,
    closeSubmenu: _closeLateralSubmenu,
    // Métodos para acceso desde HTML onclick (mantienen compatibilidad)
    _handleCategoryClick: _showLateralSubmenu,
    _closeLateralSubmenu: _closeLateralSubmenu
  };
})();

// Exponer globalmente para uso desde HTML
if (typeof window !== 'undefined') {
  window.LateralMenu = LateralMenu;
}

// Inicialización automática
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => LateralMenu.init());
} else {
  LateralMenu.init();
}