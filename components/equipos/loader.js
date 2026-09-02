// Equipos loader - CARGA DESDE JSON EXTERNO (assets/data/equipos.json)
// Module Pattern (IIFE) - Vanilla JS
const EquiposLoader = (() => {

  // --- CONSTANTES PRIVADAS ---
  const BASE_DATA_PATH = 'assets/data/';
  const BASE_PATH = 'components/equipos/';
  const NETFLIX_CONTAINER_ID = 'netflixRows';

  // --- ESTADO PRIVADO ---
  let _state = {
    initialized: false,
    equipos: [],
    categorias: [],
    empresa: {}
  };

  // --- FUNCIONES PRIVADAS ---

  // Cargar archivo JSON externo
  async function _loadJsonFile(filename) {
    try {
      const res = await fetch(`${BASE_DATA_PATH}${filename}`);
      if (!res.ok) {
        console.warn(`EquiposLoader: HTTP ${res.status} al cargar ${filename}`);
        return [];
      }
      return await res.json();
    } catch (e) {
      console.error(`EquiposLoader: Error cargando ${filename}:`, e.message);
      return [];
    }
  }

  // Cargar todos los datos (equipos, categorías, empresa)
  async function _loadAllData() {
    const [equipos, categorias, empresa] = await Promise.all([
      _loadJsonFile('equipos.json'),
      _loadJsonFile('categorias.json'),
      _loadJsonFile('empresa.json')
    ]);

    _state.equipos = equipos;
    _state.categorias = categorias;
    _state.empresa = empresa;

    return { equipos, categorias, empresa };
  }

  // Agrupar equipos por categoría
  function _agruparPorCategoria(equipos) {
    return equipos.reduce((acc, equipo) => {
      if (!acc[equipo.categoria]) acc[equipo.categoria] = [];
      acc[equipo.categoria].push(equipo);
      return acc;
    }, {});
  }

  // Obtener nombre de categoría por ID
  function _getCategoriaNombre(id) {
    const cat = _state.categorias.find(c => c.id === id);
    return cat ? cat.label : id;
  }

  // Emitir evento (con fallback a CustomEvent)
  function _emit(eventName, detail = {}) {
    if (typeof EventEmitter !== 'undefined') {
      EventEmitter.emit(eventName, detail);
    }
    document.dispatchEvent(new CustomEvent(eventName, { detail }));
  }

  // Fetch HTML del equipo y extraer imágenes
  async function _fetchEquipmentImages(equipoId) {
    try {
      const res = await fetch(`${BASE_PATH}${equipoId}.html`);
      if (!res.ok) {
        console.warn(`EquiposLoader: HTTP ${res.status} al cargar ${equipoId}.html`);
        return [];
      }
      const html = await res.text();
      
      // Parsear HTML y extraer todas las imágenes
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const images = Array.from(doc.querySelectorAll('img')).map(img => img.src);
      
      return images;
    } catch (e) {
      console.error(`EquiposLoader: Error fetching ${equipoId}.html:`, e.message);
      return [];
    }
  }

// Renderizar un Netflix item (optimizado - sin fetch de HTML)
   async function _renderNetflixItem(equipo, rowContent) {
     try {
       const waLink = typeof WHATSAPP !== "undefined" 
         ? WHATSAPP.createLink("Necesito cotizar " + equipo.nombre)
         : "https://wa.me/" + (_state.empresa.telefonos?.whatsapp || "573165345675") + "?text=Hola,%20necesito%20cotizar%20" + encodeURIComponent(equipo.nombre);

       // Usar imagen del equipo o fallback (evita fetch extra)
       const firstImg = equipo.imagen ? `assets/imagenes/${equipo.carpeta || equipo.id}/${equipo.imagen}` : "assets/imagenes/logo.png";

      // Crear elemento Netflix item
      const netflixItem = document.createElement("div");
      netflixItem.className = "netflix-item";
      netflixItem.dataset.category = equipo.categoria;
      netflixItem.dataset.id = equipo.id;
      
      const imageDiv = document.createElement("div");
      imageDiv.className = "netflix-item-image";
      imageDiv.style.cursor = "pointer";

      const img = document.createElement("img");
      img.src = firstImg;
      img.alt = equipo.nombre;
      img.loading = "lazy";
      img.width = 350;
      img.height = 420;
      img.onerror = function() { this.src = "assets/imagenes/logo.png"; };

      imageDiv.appendChild(img);

// Click para abrir galería - fetch bajo demanda
        imageDiv.addEventListener("click", async function() {
          if (typeof Gallery === "undefined") return;
          
          // Cargar imágenes solo cuando se hace click (lazy)
          const images = await _fetchEquipmentImages(equipo.id).catch(() => []);
          if (images.length === 0) return;
          
          const specsData = {
            titulo: equipo.nombre,
            datos: {
              "Categoría": equipo.categoria,
              "Disponible": equipo.disponible ? "Sí" : "No"
            },
            caracteristicas: (function() {
              const val = equipo.caracteristicas;
              if (Array.isArray(val)) return val.join('\n');
              return (typeof val === 'string') ? val : (val || '');
            })(),
            descripcion: equipo.descripcion || '',
            normas: `1. Identificarse a nombre de quien va a hacer el alquiler persona natural o juridica
2. Solicitar con anticipación el alquiler de los equipos, el personal puede tener trabajos o clientes programados.
3. Si es cliente nuevo o reciente se solicita un depósito como garantía por el equipo, se hace la devolución con el reintegro en buen estado del equipo.
4. El tiempo de alquiler se maneja por días, igualmente para el cobro. Se maneja fecha calendario, informarnos entonces para nosotros evaluar si festivos son tenidos en cuenta, cada obra es distinta.
5. Los equipos se entregan en horario de oficina, existen excepciones donde se han pedido a altas horas de la noche, se cobrara un valor mayor.
6. Equipo dañado se cobrara.
7. Hacemos la logistica y contratación del transporte, se cobrara por aparte dependiendo del lugar donde vaya el equipo. No somos una empresa de transporte.`
          };

          Gallery.open(images, equipo.nombre, waLink, specsData);
        });

      const titleDiv = document.createElement("div");
      titleDiv.className = "netflix-item-title";
      titleDiv.textContent = equipo.nombre;

      const whatsappLink = document.createElement("a");
      whatsappLink.href = waLink;
      whatsappLink.className = "netflix-item-whatsapp";
      whatsappLink.target = "_blank";
      whatsappLink.rel = "noopener";
      whatsappLink.setAttribute("aria-label", "Cotizar " + equipo.nombre + " por WhatsApp");
      whatsappLink.innerHTML = "<i class=\"bi bi-whatsapp\"></i>";

      netflixItem.appendChild(imageDiv);
      netflixItem.appendChild(titleDiv);
      netflixItem.appendChild(whatsappLink);

      rowContent.appendChild(netflixItem);

    } catch (e) {
      console.error("EquiposLoader: Error renderizando " + equipo.id + ":", e.message);
    }
  }

// Renderizar filas Netflix por categoría (paralelo)
       async function _renderNetflixRows(equiposAgrupados) {
         const container = document.getElementById(NETFLIX_CONTAINER_ID);
         if (!container) return;
         container.innerHTML = '';

         for (const categoria of _state.categorias) {
           const equipos = equiposAgrupados[categoria.id];
           if (!equipos || equipos.length === 0) continue;

           const row = document.createElement('div');
           row.className = 'netflix-row';
           row.dataset.category = categoria.id;
           
           const headerDiv = document.createElement('div');
           headerDiv.className = 'netflix-row-header';
           
           const titleH3 = document.createElement('h3');
           titleH3.className = 'netflix-category-title';
           titleH3.textContent = categoria.label;
           
           const leftButton = document.createElement('button');
           leftButton.className = 'netflix-scroll-btn netflix-scroll-left';
           leftButton.setAttribute('aria-label', 'Desplazar izquierda');
           leftButton.innerHTML = '&#8249;';
           leftButton.addEventListener('click', function(e) {
             e.preventDefault();
             scrollRow('row-' + categoria.id, -1);
           });
           
           const rightButton = document.createElement('button');
           rightButton.className = 'netflix-scroll-btn netflix-scroll-right';
           rightButton.setAttribute('aria-label', 'Desplazar derecha');
           rightButton.innerHTML = '&#8250;';
           rightButton.addEventListener('click', function(e) {
             e.preventDefault();
             scrollRow('row-' + categoria.id, 1);
           });
           
           headerDiv.appendChild(leftButton);
           headerDiv.appendChild(titleH3);
           headerDiv.appendChild(rightButton);

           const contentDiv = document.createElement('div');
           contentDiv.className = 'netflix-row-content';
           contentDiv.id = 'row-' + categoria.id;

           row.appendChild(headerDiv);
           row.appendChild(contentDiv);
           container.appendChild(row);

            // Renderizar equipos en paralelo (no bloquea hilo)
            await Promise.all(equipos.map(equipo => _renderNetflixItem(equipo, contentDiv).catch(() => {})));
            row.dataset.categoryLoaded = 'true';
         }
       }

  // Inicializar carrusel Netflix (carrusel horizontal)
  function _initNetflixCarousel() {
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
      
      function rotateImage() {
        const imgs = carouselContainer.querySelectorAll('img');
        imgs.forEach(img => img.classList.remove('active'));
        currentIndex = (currentIndex + 1) % totalImages;
        imgs[currentIndex].classList.add('active');
        setTimeout(rotateImage, 5000);
      }
      
      setTimeout(rotateImage, 5000);
    });
  }

  // --- FUNCIÓN PÚBLICA DE INICIALIZACIÓN ---
  async function init() {
    if (_state.initialized) {
      console.log('EquiposLoader: Ya inicializado');
      return;
    }

    console.log('EquiposLoader: Cargando datos desde JSON externo...');
    
    try {
      // Cargar todos los datos
      await _loadAllData();
      
      // Renderizar filas Netflix
      const agrupados = _agruparPorCategoria(_state.equipos);
      await _renderNetflixRows(agrupados);
      
      // Inicializar carrusel
      _initNetflixCarousel();
      
      // Emitir evento de finalización (compatibilidad con ambos nombres)
      _emit('equiposLoaded', { 
        total: _state.equipos.length, 
        timestamp: Date.now() 
      });
      _emit('equipos:ready', { 
        total: _state.equipos.length, 
        timestamp: Date.now() 
      });
      
      _state.initialized = true;
      console.log(`EquiposLoader: ${_state.equipos.length} equipos cargados exitosamente`);
      
    } catch (error) {
      console.error('EquiposLoader: Error en inicialización:', error);
    }
  }

  // --- API PÚBLICA ---
  return {
    init,
    getEquipos: () => [..._state.equipos],
    getCategorias: () => [..._state.categorias],
    getEmpresa: () => ({..._state.empresa}),
    filtrarPorCategoria: (categoriaId) => _state.equipos.filter(eq => eq.categoria === categoriaId),
    buscar: (termino) => {
      const busqueda = termino.toLowerCase();
      return _state.equipos.filter(eq => 
        eq.nombre.toLowerCase().includes(busqueda) || 
        eq.descripcion.toLowerCase().includes(busqueda)
      );
    }
  };

})();

// Función global para desplazar filas (usada por botones de scroll)
if (typeof window !== 'undefined') {
  window.scrollRow = function(rowId, direction) {
    const row = document.getElementById(rowId);
    if (!row) {
      console.warn('scrollRow: Contenedor no encontrado:', rowId);
      return;
    }

    // El elemento con rowId YA ES el .netflix-row-content que se debe desplazar
    const content = row;
    const scrollAmount = 350;
    const maxScroll = content.scrollWidth - content.clientWidth;

    console.log('scrollRow called:', {
      rowId,
      direction,
      scrollWidth: content.scrollWidth,
      clientWidth: content.clientWidth,
      maxScroll,
      currentScroll: content.scrollLeft
    });

    if (direction === 1) {
      const newScrollLeft = Math.min(content.scrollLeft + scrollAmount, maxScroll);
      content.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    } else {
      const newScrollLeft = Math.max(content.scrollLeft - scrollAmount, 0);
      content.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    }
  };
}

 // Auto-inicializar cuando el DOM esté listo
 if (typeof document !== 'undefined') {
   if (document.readyState === 'loading') {
     document.addEventListener('DOMContentLoaded', EquiposLoader.init);
   } else {
     EquiposLoader.init();
   }
 }

 // Escuchar evento de ComponentFactory para reinicializar si el componente se carga dinámicamente
 if (typeof document !== 'undefined') {
   document.addEventListener('component:loaded', function(e) {
     if (e.detail && e.detail.id === 'equipos') {
       console.log('EquiposLoader: componente cargado dinámicamente, reinicializando...');
       setTimeout(() => EquiposLoader.init(), 100);
     }
   });
 }

  // Fallback: reintentar inicialización cuando el browser esté inactivo
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(function() {
      if (!_state.initialized) {
        console.log('EquiposLoader: fallback init durante idle');
        EquiposLoader.init();
      }
    }, { timeout: 1500 });
  } else {
    setTimeout(function() {
      if (!_state.initialized) {
        console.log('EquiposLoader: fallback init después de 1s');
        EquiposLoader.init();
      }
    }, 1000);
  }
