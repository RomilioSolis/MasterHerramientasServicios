// ============================================
// MÓDULO: EquiposGrid
// Refactorizado con Module Pattern (IIFE + Revealing Module)
// ============================================
const EquiposGrid = (() => {
  
  // --- CONSTANTES PRIVADAS ---
  const WHATSAPP = {
    PHONE: '573165345675',
    BASE: 'https://wa.me'
  };
  
  const BASE_URL = 'https://masterenherramientasyservicios.com.co';
  const CONTAINER_ID = 'herramientas-container';
  const STYLE_ID = 'equipos-grid-styles';
  
  // --- DATOS PRIVADOS ---
  const _DATA = {
    elevacion: [
      { id: 'gatos-hidraulicos', name: 'Gatos Hidraulicos', img: '/assets/imagenes/GatosH/Gatos.png', text: 'Gatos hidráulicos de alta capacidad para elevación.' },
      { id: 'gato-estibador', name: 'Gato Estibador', img: '/assets/imagenes/Estibador/estibador.png', text: 'Gato estibador para movimiento de cargas.' },
      { id: 'ganchos-colgantes', name: 'Ganchos Colgantes', img: '/assets/imagenes/GanchosColgantes/GanchosColgantes.png', text: 'Ganchos colgantes certificados.' },
      { id: 'winches', name: 'Winches', img: '/assets/imagenes/Winches/Winches.png', text: 'Winches eléctricos y manuales.' },
      { id: 'pluma-grua', name: 'Pluma Grúa', img: '/assets/imagenes/PlumaGrua/PlumaGrua.png', text: 'Pluma grúa para elevación de cargas.' },
      { id: 'andamios-certificados', name: 'Andamios Certificados', img: '/assets/imagenes/Andamios Certificados/Andamio Certificado 1.jpeg', text: 'Torres de andamios certificados con garantía de seguridad.' }
    ],
    perforacion: [
      { id: 'taladros', name: 'Taladros', img: '/assets/imagenes/Taladros/Taladro.webp', text: 'Taladros industriales de percusión.' },
      { id: 'taladro-magnetico', name: 'Taladro Magnético', img: '/assets/imagenes/TaladroMagnetico/TaladroMagnetico1.jpeg', text: 'Taladro magnético para perforación de metal.' },
      { id: 'extractores', name: 'Extractores', img: '/assets/imagenes/Extractores/Extractor.png', text: 'Extractores de ejes y rodamientos.' },
      { id: 'sonda-electrica', name: 'Sonda Eléctrica', img: '/assets/imagenes/SondaElectrica/SondaElectrica.png', text: 'Sonda eléctrica para barrenado.' },
      { id: 'esmeriladora', name: 'Esmeriladora', img: '/assets/imagenes/Esmeril/Esmeril.png', text: 'Esmeriladora angular de alta potencia.' },
      { id: 'equipo-oxicorte', name: 'Equipo Oxicorte', img: '/assets/imagenes/Oxicorte/EquiOxicorte.png', text: 'Equipo de oxicorte para corte de metal.' },
      { id: 'cortadora-porcelanato', name: 'Cortadora Porcelanato', img: '/assets/imagenes/CortadoraPorcelanato/CortadoraPorcelanato.png', text: 'Cortadora de porcelanato y cerámica.' },
      { id: 'extraccion-nucleos', name: 'Extracción Núcleos', img: '/assets/imagenes/ExtraNucleo/ExtraNucleo.png', text: 'Equipo de extracción de núcleos de concreto.' }
    ],
    mezclado: [
      { id: 'trompo-mezclador', name: 'Trompo Mezclador', img: '/assets/imagenes/TrompoMezclador/TrompoMezclador.png', text: 'Trompo mezclador de concreto.' },
      { id: 'vibrocompactadora', name: 'Vibrocompactadora', img: '/assets/imagenes/VibroCompactadora/VibroCompactadora.png', text: 'Vibrocompactadora para compactación de suelo.' }
    ],
    limpieza: [
      { id: 'hidrolavadora', name: 'Hidrolavadora', img: '/assets/imagenes/Hidrolavadora/Hidrolavadora.png', text: 'Hidrolavadora de alta presión.' },
      { id: 'aspiradora-industrial', name: 'Aspiradora Industrial', img: '/assets/imagenes/Aspiradora/Aspiradora.png', text: 'Aspiradora industrial wet/dry.' },
      { id: 'motobomba-sumergible', name: 'Motobomba Sumergible', img: '/assets/imagenes/Motobomba/MotoBombaLapi.png', text: 'Motobomba sumergible para achique.' }
    ],
    soldadura: [
      { id: 'compresor', name: 'Compresor', img: '/assets/imagenes/Compresor/Compresor.png', text: 'Compresor de aire industrial.' },
      { id: 'equipos-soldadura', name: 'Equipos de Soldadura', img: '/assets/imagenes/Soldador/Soldador.png', text: 'Equipos de soldadura inverter y TIG.' },
      { id: 'planta-electrica', name: 'Planta Eléctrica', img: '/assets/imagenes/PlantaElectrica/PlantaEnergia.png', text: 'Planta eléctrica генератор.' }
    ],
    construccion: [
      { id: 'andamios', name: 'Andamios', img: '/assets/imagenes/Andamios/Andamios.png', text: 'Torres de andamios certificados.' },
      { id: 'estanterias', name: 'Estanterías', img: '/assets/imagenes/Estanterias/Estanterias.png', text: 'Estanterías industriales.' },
      { id: 'parasoles', name: 'Parasoles', img: '/assets/imagenes/Parasol/Parasol.png', text: 'Parasoles profesionales.' }
    ],
    movimiento: [
      { id: 'diferenciales', name: 'Diferenciales', img: '/assets/imagenes/Diferencial/Diferencial.png', text: 'Diferenciales para movimiento de cargas.' },
      { id: 'carretillas', name: 'Carretillas', img: '/assets/imagenes/Carretilla/Carretilla.png', text: 'Carretillas industriales.' },
      { id: 'buggy', name: 'Buggy con Pico y Pala', img: '/assets/imagenes/Buggy/Buggy.png', text: 'Buggy para movimiento de material.' }
    ],
    jardin: [
      { id: 'escaleras', name: 'Escaleras', img: '/assets/imagenes/Escaleras/escaleras.jpg', text: 'Escaleras profesionales.' },
      { id: 'motosierra', name: 'Motosierra', img: '/assets/imagenes/Motosierra/Motosierra.png', text: 'Motosierra de cadena.' }
    ]
  };
  
  const _CATEGORY_NAMES = Object.freeze({
    elevacion: 'Elevación y Levante',
    perforacion: 'Perforación y Corte',
    mezclado: 'Mezclado y Compactación',
    limpieza: 'Limpieza e Hidráulica',
    soldadura: 'Soldadura y Energía',
    construccion: 'Construcción y Estructura',
    movimiento: 'Accesorios de Movimiento',
    jardin: 'Jardín y Forestal'
  });
  
  // --- ESTADO PRIVADO ---
  let _state = {
    initialized: false,
    loaded: false
  };
  
  // --- FUNCIONES PRIVADAS ---
  
  /**
   * Crea una tarjeta de equipo HTML
   * @param {Object} equipment - Datos del equipo
   * @param {string} category - Categoría del equipo
   * @returns {string} HTML de la tarjeta
   */
  function _createCard(equipment, category) {
    const waText = encodeURIComponent(equipment.name.toLowerCase().replace(/ /g, '%20'));
    const waLink = `${WHATSAPP.BASE}/${WHATSAPP.PHONE}?text=Hola,%20necesito%20cotizar%20${waText}`;
    
    return `
      <article class="col-md-4 mb-4" itemscope itemtype="https://schema.org/Product" data-category="${category}">
        <div class="card h-100">
          <div itemprop="brand" itemscope itemtype="https://schema.org/Brand" style="display: none;">
            <meta itemprop="name" content="Master Herramientas y Servicios">
          </div>
          <div itemprop="aggregateRating" itemscope itemtype="https://schema.org/AggregateRating">
            <meta itemprop="ratingValue" content="4.8">
            <meta itemprop="reviewCount" content="35">
            <meta itemprop="bestRating" content="5">
            <meta itemprop="worstRating" content="1">
          </div>
          <div itemprop="offers" itemscope itemtype="https://schema.org/Offer">
            <meta itemprop="priceCurrency" content="COP">
            <meta itemprop="price" content="150000">
            <link itemprop="availability" href="https://schema.org/InStock">
            <meta itemprop="url" content="${BASE_URL}/#equipos">
          </div>
          <img src="${equipment.img}"
                class="card-img-top"
                alt="Alquiler de ${equipment.name} en Cali"
                loading="lazy"
                width="400"
                height="250"
                itemprop="image">
          <div class="card-body">
            <h2 class="card-title h5" itemprop="name">Alquiler de ${equipment.name}</h2>
            <p class="card-text" itemprop="description">${equipment.text}</p>
            <div class="d-flex flex-column flex-md-row gap-2">
              <a href="${waLink}"
                  class="btn btn-success flex-fill"
                  target="_blank"
                  aria-label="Cotizar alquiler de ${equipment.name} por WhatsApp"
                  rel="noopener"
                  itemprop="url">
                <i class="bi bi-whatsapp"></i> Cotizar
              </a>
              <a href="tel:+57${WHATSAPP.PHONE}"
                  class="btn btn-primary flex-fill"
                  aria-label="Llamar para servicio de ${equipment.name}"
                  itemprop="telephone">
                <i class="bi bi-telephone"></i> Llamar
              </a>
            </div>
          </div>
        </div>
      </article>
    `;
  }
  
  /**
   * Carga los estilos del componente
   * @returns {Promise} Promesa que se resuelve cuando los estilos están cargados
   */
  function _loadStyles() {
    return new Promise((resolve) => {
      if (document.getElementById(STYLE_ID)) {
        resolve();
        return;
      }
      const link = document.createElement('link');
      link.id = STYLE_ID;
      link.rel = 'stylesheet';
      link.href = '/components/equipos-grid/equipos-grid.css';
      link.onload = resolve;
      document.head.appendChild(link);
    });
  }
  
  /**
   * Renderiza todos los equipos en el contenedor
   * @returns {number} Cantidad de equipos renderizados
   */
  function _render() {
    const container = document.getElementById(CONTAINER_ID);
    if (!container) return 0;
    
    let count = 0;
    for (const [category, equipos] of Object.entries(_DATA)) {
      for (const eq of equipos) {
        container.insertAdjacentHTML('beforeend', _createCard(eq, category));
        count++;
      }
    }
    
    _state.loaded = true;
    return count;
  }
  
  /**
   * Emite evento de carga completada
   * @param {number} count - Cantidad de equipos cargados
   */
  function _emitLoaded(count) {
    const detail = { count, categories: Object.keys(_DATA) };
    
    // Usar EventEmitter si está disponible (Patrón Observer)
    if (typeof EventEmitter !== 'undefined') {
      EventEmitter.emit('equipos:loaded', detail);
    }
    
    // También dispatchear CustomEvent para compatibilidad
    document.dispatchEvent(new CustomEvent('equipos:loaded', { 
      detail: detail 
    }));
  }
  
  // --- INICIALIZACIÓN ---
  function _init() {
    if (_state.initialized) return;
    _state.initialized = true;
  }
  
  // --- API PÚBLICA (REVEALING MODULE) ---
  return {
    /**
     * Inicializa y carga el grid de equipos
     */
    init: async function() {
      _init();
      await _loadStyles();
      const count = _render();
      _emitLoaded(count);
      console.log(`EquiposGrid: cargado ${count} artículos`);
    },
    
    /**
     * Retorna los datos de equipos (solo lectura)
     * @returns {Object} Datos de equipos congelados
     */
    getData: function() {
      return Object.freeze(_DATA);
    },
    
    /**
     * Retorna los nombres de categorías
     * @returns {Object} Nombres de categorías
     */
    getCategoryNames: function() {
      return _CATEGORY_NAMES;
    },
    
    /**
     * Verifica si los datos ya fueron cargados
     * @returns {boolean}
     */
    isLoaded: function() {
      return _state.loaded;
    }
  };
  
})();

// Exportar si ESM disponible
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EquiposGrid;
}