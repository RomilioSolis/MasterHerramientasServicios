const equipmentData = {
  elevacion: [
    { name: 'Gatos Hidráulicos', img: '/assets/imagenes/gatosM/gatos.png', wa: 'gato%20hidraulico' },
    { name: 'Gato Estibador', img: '/assets/imagenes/Estibador/estibador.png', wa: 'gato%20estibador' },
    { name: 'Ganchos Colgantes', img: '/assets/imagenes/GanchosColgantes/GanchosColgantes.png', wa: 'ganchos%20colgantes' },
    { name: 'Winches', img: '/assets/imagenes/Winches/Winches.png', wa: 'winche' },
    { name: 'Pluma Grúa', img: '/assets/imagenes/PlumaGrua/PlumaGrua.png', wa: 'pluma%20grua' }
  ],
  perforacion: [
    { name: 'Taladros', img: '/assets/imagenes/Taladros/Taladro.webp', wa: 'taladro' },
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
    { name: 'Planta Eléctrica', img: '/assets/imagenes/PlantaElectrica/PlantaEnergia.png', wa: 'planta%20electrica' }
  ],
  construccion: [
    { name: 'Andamios', img: '/assets/imagenes/Andamios/Andamios.png', wa: 'andamios' },
    { name: 'Escaleras', img: '/assets/imagenes/Escaleras/escaleras.jpg', wa: 'escaleras' }
  ],
  movimiento: [
    { name: 'Carretilla', img: '/assets/imagenes/Carretilla/Carretilla.png', wa: 'carretilla' },
    { name: 'Grúa Horquilla', img: '/assets/imagenes/Diferencial/Diferencial.png', wa: 'grua%20horquilla' }
  ],
  jardin: [
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

const openLateralMenu = () => {
  document.querySelector('.lateral-menu')?.classList.add('open');
  document.querySelector('.lateral-menu-overlay')?.classList.add('active');
  document.body.style.overflow = 'hidden';
};

const closeLateralMenu = () => {
  document.querySelector('.lateral-menu')?.classList.remove('open');
  document.querySelector('.lateral-menu-overlay')?.classList.remove('active');
  document.body.style.overflow = '';
  closeLateralSubmenu();
};

const showLateralSubmenu = (category) => {
  const equipment = equipmentData[category];
  if (!equipment) return;
  
  const categoryName = categoryNames[category] || category;
  let html = `<div class="lateral-submenu" id="lateralSubmenu">
    <div class="lateral-submenu-header">
      <button class="lateral-submenu-back" onclick="closeLateralSubmenu()" aria-label="Volver">
        <i class="bi bi-arrow-left"></i>
      </button>
      <h3>${categoryName}</h3>
    </div>
    <ul class="lateral-equipment-list">`;
  
  equipment.forEach(item => {
    html += `<li class="lateral-equipment-item">
      <button class="lateral-equipment-btn" onclick="window.open('https://wa.me/573165345675?text=Hola,%20necesito%20cotizar%20${item.wa}', '_blank')">
        <img src="${item.img}" alt="${item.name}">
        <span>${item.name}</span>
        <span class="lateral-equipment-whatsapp"><i class="bi bi-whatsapp"></i></span>
      </button>
    </li>`;
  });
  
  html += '</ul></div>';
  
  document.getElementById('lateralSubmenu')?.remove();
  document.body.insertAdjacentHTML('beforeend', html);
  setTimeout(() => document.getElementById('lateralSubmenu')?.classList.add('open'), 10);
};

const closeLateralSubmenu = () => {
  const submenu = document.getElementById('lateralSubmenu');
  if (submenu) {
    submenu.classList.remove('open');
    setTimeout(() => submenu.remove(), 300);
  }
};

const initLateralMenu = () => {
  window.openLateralMenu = openLateralMenu;
  window.closeLateralMenu = closeLateralMenu;
  window.showLateralSubmenu = showLateralSubmenu;
  window.closeLateralSubmenu = closeLateralSubmenu;
};

export default initLateralMenu;