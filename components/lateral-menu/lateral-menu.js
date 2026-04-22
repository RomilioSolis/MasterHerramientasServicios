const categoriesData = {
    elevacion: [
        { name: 'Gatos Hidráulicos', img: '/assets/imagenes/gatosM/gatos.png', wa: 'gato%20hidraulico' },
        { name: 'Gato Estibador', img: '/assets/imagenes/Estibador/estibador.png', wa: 'gato%20estibador' },
        { name: 'Ganchos Colgantes', img: '/assets/imagenes/GanchosColgantes/GanchosColgantes.png', wa: 'ganchos%20colgantes' },
        { name: 'Winches', img: '/assets/imagenes/Winches/Winches.png', wa: 'winche' },
        { name: 'Pluma Grúa', img: '/assets/imagenes/PlumaGrua/PlumaGrua.png', wa: 'pluma%20grua' },
        { name: 'Andamios Certificados', img: '/assets/imagenes/Andamios Certificados/Andamio Certificado 1.jpeg', wa: 'andamios%20certificados' }
    ],
    perforacion: [
        { name: 'Taladros', img: '/assets/imagenes/Taladros/Taladro.webp', wa: 'taladro' },
        { name: 'Taladro Magnético', img: '/assets/imagenes/TaladroMagnetico/TaladroMagnetico1.jpeg', wa: 'taladro%20magnetico' },
        { name: 'Extractores', img: '/assets/imagenes/Extractores/Extractor.png', wa: 'extractor' },
        { name: 'Sonda Eléctrica', img: '/assets/imagenes/SondaElectrica/SondaElectrica.png', wa: 'sonda%20electrica' },
        { name: 'Esmeriladora', img: '/assets/imagenes/Esmeril/Esmeril.png', wa: 'esmeriladora' },
        { name: 'Equipo Oxicorte', img: '/assets/imagenes/Oxicorte/EquiOxicorte.png', wa: 'equipo%20oxicorte' },
        { name: 'Cortadora Porcelanato', img: '/assets/imagenes/CortadoraPorcelanato/CortadoraPorcelanato.png', wa: 'cortadora%20porcelanato' },
        { name: 'Extracción Núcleos', img: '/assets/imagenes/ExtraNucleo/ExtraNucleo.png', wa: 'extraccion%20nucleos' }
    ],
    mezclado: [
        { name: 'Trompo Mezclador', img: '/assets/imagenes/TrompoMezclador/TrompoMezclador.png', wa: 'trompo%20mezclador' },
        { name: 'Vibrocompactadora', img: '/assets/imagenes/VibroCompactadora/VibroCompactadora.png', wa: 'vibrocompactadora' }
    ],
    limpieza: [
        { name: 'Hidrolavadora', img: '/assets/imagenes/Hidrolavadora/Hidrolavadora.png', wa: 'hidrolavadora' },
        { name: 'Aspiradora Industrial', img: '/assets/imagenes/Aspiradora/Aspiradora.png', wa: 'aspiradora%20industrial' },
        { name: 'Motobomba Sumergible', img: '/assets/imagenes/Motobomba/MotoBombaLapi.png', wa: 'motobomba%20sumergible' }
    ],
    soldadura: [
        { name: 'Soldadora', img: '/assets/imagenes/Soldador/Soldador.png', wa: 'soldadora' },
        { name: 'Planta Eléctrica', img: '/assets/imagenes/PlantaElectrica/PlantaEnergia.png', wa: 'planta%20electrica' },
        { name: 'Compresor', img: '/assets/imagenes/Compresor/compresor.png', wa: 'compresor' }
    ],
    construccion: [
        { name: 'Andamios', img: '/assets/imagenes/Andamios/Andamios.png', wa: 'andamios' },
        { name: 'Estanterías', img: '/assets/imagenes/Estanteria/Estanteria.png', wa: 'estanterias' },
        { name: 'Parasoles', img: '/assets/imagenes/Parasol/Parasol.png', wa: 'parasoles' }
    ],
    movimiento: [
        { name: 'Diferenciales', img: '/assets/imagenes/Diferencial/Diferencial.png', wa: 'diferenciales' },
        { name: 'Carretilla', img: '/assets/imagenes/Carretilla/Carretilla.png', wa: 'carretilla' },
        { name: 'Buggy', img: '/assets/imagenes/Buggy/Buggy.png', wa: 'buggy' }
    ],
    jardin: [
        { name: 'Escaleras', img: '/assets/imagenes/Escaleras/escaleras.jpg', wa: 'escaleras' },
        { name: 'Motosierra', img: '/assets/imagenes/Motosierra/Motosierra.png', wa: 'motosierra' }
    ]
};

const categoryNames = {
    elevacion: 'Elevación y Levante',
    perforacion: 'Perforación y Corte',
    mezclado: 'Mezclado y Compactación',
    limpieza: 'Limpieza e Hidráulica',
    soldadura: 'Soldadura y Energía',
    construccion: 'Construcción y Estructura',
    movimiento: 'Accesorios de Movimiento',
    jardin: 'Jardín y Forestal'
};

function loadStyles() {
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

function getLateralMenuHTML() {
    let categoriasHTML = '';
    
    for (const [category, items] of Object.entries(categoriesData)) {
        const categoryName = categoryNames[category];
        const itemsHTML = items.map(item => `
            <li class="lateral-equipment-item">
                <button class="lateral-equipment-btn" onclick="window.open('https://wa.me/573165345675?text=Hola,%20necesito%20cotizar%20${item.wa}', '_blank')">
                    <img src="${item.img}" alt="${item.name}">
                    <span>${item.name}</span>
                    <span class="lateral-equipment-whatsapp"><i class="bi bi-whatsapp"></i></span>
                </button>
            </li>
        `).join('');
        
        categoriasHTML += `
            <div class="lateral-category">
                <button class="lateral-category-btn" onclick="showLateralSubmenu('${category}')">
                    <span>${categoryName}</span>
                    <i class="bi bi-chevron-right"></i>
                </button>
            </div>
        `;
    }
    
    return `
        <div class="lateral-menu-overlay" onclick="closeLateralMenu()"></div>
        <nav class="lateral-menu" aria-label="Menú de categorías">
            <div class="lateral-menu-header">
                <h3>Categorías</h3>
                <button class="lateral-menu-close" onclick="closeLateralMenu()" aria-label="Cerrar menú">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
            <div class="lateral-menu-content">
                ${categoriasHTML}
            </div>
        </nav>
    `;
}

function showLateralSubmenu(category) {
    const equipment = categoriesData[category];
    const categoryName = categoryNames[category];
    
    let html = `
        <div class="lateral-submenu" id="lateralSubmenu">
            <div class="lateral-submenu-header">
                <button class="lateral-submenu-back" onclick="closeLateralSubmenu()" aria-label="Volver">
                    <i class="bi bi-arrow-left"></i>
                </button>
                <h3>${categoryName}</h3>
            </div>
            <ul class="lateral-equipment-list">
    `;
    
    equipment.forEach(item => {
        html += `
            <li class="lateral-equipment-item">
                <button class="lateral-equipment-btn" onclick="window.open('https://wa.me/573165345675?text=Hola,%20necesito%20cotizar%20${item.wa}', '_blank')">
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
        document.getElementById('lateralSubmenu').classList.add('open');
    }, 10);
}

function closeLateralSubmenu() {
    const submenu = document.getElementById('lateralSubmenu');
    if (submenu) {
        submenu.classList.remove('open');
        setTimeout(() => submenu.remove(), 300);
    }
}

function openLateralMenu() {
    const menu = document.querySelector('.lateral-menu');
    const overlay = document.querySelector('.lateral-menu-overlay');
    if (menu && overlay) {
        menu.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLateralMenu() {
    const menu = document.querySelector('.lateral-menu');
    const overlay = document.querySelector('.lateral-menu-overlay');
    if (menu && overlay) {
        menu.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        closeLateralSubmenu();
    }
}

async function initLateralMenu() {
    await loadStyles();
    
    // Exponer funciones globalmente
    window.showLateralSubmenu = showLateralSubmenu;
    window.closeLateralSubmenu = closeLateralSubmenu;
    window.openLateralMenu = openLateralMenu;
    window.closeLateralMenu = closeLateralMenu;
}

export default { 
    init: initLateralMenu,
    getHTML: getLateralMenuHTML,
    open: openLateralMenu,
    close: closeLateralMenu
};
