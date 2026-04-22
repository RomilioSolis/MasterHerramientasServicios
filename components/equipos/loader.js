// Equipos loader - carga componentes dinámicamente (script clásico para GitHub Pages)
// No usa ES6 modules; se autoinicializa en DOMContentLoaded
const equiposData = {
  elevacion: [
    { id: 'gatos-hidraulicos', name: 'Gatos Hidraulicos' },
    { id: 'gato-estibador', name: 'Gato Estibador' },
    { id: 'ganchos-colgantes', name: 'Ganchos Colgantes' },
    { id: 'winches', name: 'Winches' },
    { id: 'pluma-grua', name: 'Pluma Grúa' },
    { id: 'andamios-certificados', name: 'Andamios Certificados' }
  ],
  perforacion: [
    { id: 'taladros', name: 'Taladros' },
    { id: 'taladro-magnetico', name: 'Taladro Magnético' },
    { id: 'extractores', name: 'Extractores' },
    { id: 'sonda-electrica', name: 'Sonda Eléctrica' },
    { id: 'esmeriladora', name: 'Esmeriladora' },
    { id: 'equipo-oxicorte', name: 'Equipo Oxicorte' },
    { id: 'cortadora-porcelanato', name: 'Cortadora Porcelanato' },
    { id: 'extraccion-nucleos', name: 'Extracción Núcleos' }
  ],
  mezclado: [
    { id: 'trompo-mezclador', name: 'Trompo Mezclador' },
    { id: 'vibrocompactadora', name: 'Vibrocompactadora' }
  ],
  limpieza: [
    { id: 'hidrolavadora', name: 'Hidrolavadora' },
    { id: 'aspiradora-industrial', name: 'Aspiradora Industrial' },
    { id: 'motobomba-sumergible', name: 'Motobomba Sumergible' }
  ],
  soldadura: [
    { id: 'compresor', name: 'Compresor' },
    { id: 'equipos-soldadura', name: 'Equipos de Soldadura' },
    { id: 'planta-electrica', name: 'Planta Eléctrica' }
  ],
  construccion: [
    { id: 'andamios', name: 'Andamios' },
    { id: 'estanterias', name: 'Estanterías' },
    { id: 'parasoles', name: 'Parasoles' }
  ],
  movimiento: [
    { id: 'diferenciales', name: 'Diferenciales' },
    { id: 'carretillas', name: 'Carretillas' },
    { id: 'buggy', name: 'Buggy con Pico y Pala' }
  ],
  jardin: [
    { id: 'escaleras', name: 'Escaleras' },
    { id: 'motosierra', name: 'Motosierra' }
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

const BASE_PATH = 'components/equipos/';

const equiposSpecs = {
  'aspiradora-industrial': {
    titulo: 'Aspiradora Industrial Truper ASP-12',
    datos: {
      'Referencia': '101509',
      'Potencia Maxima': '6.5 HP (Peak)',
      'Potencia Nominal': '1.6 HP (1,200 W)',
      'Capacidad Tanque': '45 Litros (12 Galones)',
      'Tension': '127 V / 60 Hz',
      'Presion Succión': '1.7 PSI (11.7 kPa)',
      'Presion Soplador': '1.9 PSI (13.1 kPa)'
    },
    caracteristicas: 'Aspira polvo (sólidos) y agua (líquidos)\nFunción de soplador integrada\nTanque de polietileno de alta resistencia\nDrenaje inferior con tapón\nSoportes para accesorios y cable',
    accesorios: 'Manguera de 2.1 m (7 ft) - 2 1/2"\n2 Tubos de extensión\nBoquilla para piso y alfombra\nBoquilla para ranuras\nFiltro de cartucho para sólidos\nFiltro de espuma para líquidos'
  }
};

async function loadEquipo(name, container) {
  try {
    const res = await fetch(`${BASE_PATH}${name}.html`);
    if (!res.ok) {
      console.warn(`loadEquipo: HTTP ${res.status} para ${name}.html`);
      return;
    }
    const html = await res.text();
    container.insertAdjacentHTML('beforeend', html);
  } catch (e) {
    console.error(`Error loading ${name}:`, e.message);
  }
}

async function loadNetflixItem(name, container) {
  try {
    const res = await fetch(`${BASE_PATH}${name}.html`);
    if (!res.ok) {
      console.warn(`loadNetflixItem: HTTP ${res.status} para ${name}.html`);
      return;
    }
    const html = await res.text();
    
    // Crear un elemento temporal para parsear el HTML
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    // Extraer información del article
    const article = temp.querySelector('article');
    if (!article) return;
    
    const category = article.dataset.category || '';
    const titleEl = article.querySelector('.card-title');
    const title = titleEl ? titleEl.textContent.replace('Alquiler de ', '').trim() : name;
    const firstImg = article.querySelector('img');
    const imgSrc = firstImg ? firstImg.src : '';
    
    // Extraer todas las imágenes del article
    const allImages = article.querySelectorAll('img');
    const images = Array.from(allImages).map(function(img) { return img.src; });
    if (images.length === 0) images.push(imgSrc);
    
    // Generar WhatsApp link
    const waText = name.toLowerCase().replace(/-/g, '%20');
    const waLink = `https://wa.me/573165345675?text=Hola,%20necesito%20cotizar%20${waText}`;
    
    // Crear Netflix item
    const netflixItem = document.createElement('div');
    netflixItem.className = 'netflix-item';
    netflixItem.dataset.category = category;
    netflixItem.dataset.name = name;
    
    netflixItem.innerHTML = `
      <div class="netflix-item-image" style="cursor:pointer">
        <img src="${imgSrc}" alt="${title}" loading="lazy">
      </div>
      <div class="netflix-item-title">${title}</div>
      <a href="${waLink}" class="netflix-item-whatsapp" target="_blank" rel="noopener" aria-label="Cotizar ${title} por WhatsApp">
        <i class="bi bi-whatsapp"></i>
      </a>
    `;
    
    // Agregar click para abrir galería
    const specsData = equiposSpecs[name] || null;
    netflixItem.querySelector('.netflix-item-image').onclick = function() {
      if (typeof Gallery !== 'undefined') {
        Gallery.open(images, title, waLink, specsData);
      }
    };
    
    container.appendChild(netflixItem);
  } catch (e) {
    console.error(`Error loading Netflix item ${name}:`, e.message);
  }
}

async function loadNetflixRows() {
  const container = document.getElementById('netflixRows');
  if (!container) return;

  for (const [category, equipos] of Object.entries(equiposData)) {
    const row = document.createElement('div');
    row.className = 'netflix-row';
    row.dataset.category = category;
    row.innerHTML = `
      <div class="netflix-row-header">
        <h3 class="netflix-category-title">${categoryNames[category]}</h3>
        <button class="netflix-scroll-btn netflix-scroll-left" onclick="scrollRow('row-${category}', -1)" aria-label="Desplazar izquierda">&#8249;</button>
        <button class="netflix-scroll-btn netflix-scroll-right" onclick="scrollRow('row-${category}', 1)" aria-label="Desplazar derecha">&#8250;</button>
      </div>
      <div class="netflix-row-content" id="row-${category}"></div>
    `;
    container.appendChild(row);

    const rowContent = row.querySelector(`#row-${category}`);
    for (const eq of equipos) {
      await loadNetflixItem(eq.id, rowContent);
    }
  }

  initNetflixCarousel();
}

async function loadCards() {
  const container = document.getElementById('herramientas-container');
  if (!container) return;

  for (const equipos of Object.values(equiposData)) {
    for (const eq of equipos) {
      await loadEquipo(eq.id, container);
    }
  }
}

function initNetflixCarousel() {
  const netflixItems = document.querySelectorAll('.netflix-item');
  netflixItems.forEach(item => {
    const imageContainer = item.querySelector('.netflix-item-image');
    if (!imageContainer) return;
    
    const images = imageContainer.querySelectorAll('img');
    if (images.length <= 1) return;
    
    const carouselContainer = document.createElement('div');
    carouselContainer.className = 'carousel-images';
    
    images.forEach((img, index) => {
      img.classList.add(index === 0 ? 'active' : '');
      carouselContainer.appendChild(img);
    });
    
    imageContainer.innerHTML = '';
    imageContainer.appendChild(carouselContainer);
    
    let currentIndex = 0;
    const totalImages = images.length;
    
    setInterval(() => {
      const imgs = carouselContainer.querySelectorAll('img');
      imgs.forEach(img => img.classList.remove('active'));
      currentIndex = (currentIndex + 1) % totalImages;
      imgs[currentIndex].classList.add('active');
    }, 5000);
  });
}

async function loadAllEquipos() {
  // Solo cargar Netflix rows (las cards ya están estáticas en index.html)
  await loadNetflixRows();

  // Dispatch evento usando EventEmitter (Patrón Observer)
  const detail = { timestamp: Date.now() };
  
  if (typeof EventEmitter !== 'undefined') {
    EventEmitter.emit('equipos:ready', detail);
  }
  
  // También dispatchear CustomEvent para compatibilidad
  document.dispatchEvent(new CustomEvent('equipos:ready', { detail }));
  console.log('Equipos cargados exitosamente');
}

// Auto-inicializar cuando se carga el script
document.addEventListener('DOMContentLoaded', loadAllEquipos);

// No ES6 exports; todo se ejecuta globalmente