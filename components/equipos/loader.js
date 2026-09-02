// Equipos loader - STREAMING GRID VIEW
// Carga desde JSON externo (assets/data/equipos.json)
// Module Pattern (IIFE) - Vanilla JS
const EquiposLoader = (() => {

  // --- CONSTANTES PRIVADAS ---
  const BASE_DATA_PATH = 'assets/data/';
  const BASE_PATH = 'components/equipos/';
  const CONTAINER_ID = 'netflixRows';

  // --- ESTADO PRIVADO ---
  let _state = {
    initialized: false,
    equipos: [],
    categorias: [],
    empresa: {}
  };

  // --- FUNCIONES PRIVADAS ---

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

  function _agruparPorCategoria(equipos) {
    return equipos.reduce((acc, equipo) => {
      if (!acc[equipo.categoria]) acc[equipo.categoria] = [];
      acc[equipo.categoria].push(equipo);
      return acc;
    }, {});
  }

  function _getCategoriaNombre(id) {
    const cat = _state.categorias.find(c => c.id === id);
    return cat ? cat.label : id;
  }

  function _getCategoriaIcon(id) {
    const cat = _state.categorias.find(c => c.id === id);
    return cat && cat.icon ? cat.icon : 'bi-tools';
  }

  function _emit(eventName, detail = {}) {
    if (typeof EventEmitter !== 'undefined') {
      EventEmitter.emit(eventName, detail);
    }
    document.dispatchEvent(new CustomEvent(eventName, { detail }));
  }

  function _buildWhatsappLink(equipo) {
    if (typeof WHATSAPP !== 'undefined') {
      return WHATSAPP.createLink('Necesito cotizar ' + equipo.nombre);
    }
    const wa = _state.empresa.telefonos?.whatsapp || '573165345675';
    return 'https://wa.me/' + wa + '?text=Hola,%20necesito%20cotizar%20' + encodeURIComponent(equipo.nombre);
  }

  async function _fetchEquipmentImages(equipoId) {
    try {
      const res = await fetch(`${BASE_PATH}${equipoId}.html`);
      if (!res.ok) {
        console.warn(`EquiposLoader: HTTP ${res.status} al cargar ${equipoId}.html`);
        return [];
      }
      const html = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      return Array.from(doc.querySelectorAll('img')).map(img => img.src);
    } catch (e) {
      console.error(`EquiposLoader: Error fetching ${equipoId}.html:`, e.message);
      return [];
    }
  }

  // Renderiza el hero del catálogo (encabezado estilo streaming + chips de categorías)
  function _renderStreamingHero(container) {
    const hero = document.createElement('div');
    hero.className = 'stream-hero';

    const inner = document.createElement('div');
    inner.className = 'stream-hero-inner';

    const titulo = document.createElement('h2');
    titulo.className = 'stream-hero-title';
    titulo.textContent = 'Catálogo de Equipos';

    const chips = document.createElement('nav');
    chips.className = 'stream-chips';
    chips.setAttribute('aria-label', 'Categorías del catálogo');

    const todos = document.createElement('button');
    todos.type = 'button';
    todos.className = 'stream-chip is-active';
    todos.dataset.target = 'all';
    todos.textContent = 'Todos';
    todos.addEventListener('click', () => {
      _resetSearch();
      _applyCategoryFilter('all');
      _setActiveChipByTarget('all');
    });
    chips.appendChild(todos);

    _state.categorias.forEach(cat => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'stream-chip';
      btn.dataset.target = cat.id;
      btn.innerHTML = `<span>${cat.label}</span>`;
      btn.addEventListener('click', () => {
        _resetSearch();
        _applyCategoryFilter(cat.id);
        _setActiveChipByTarget(cat.id);
        const targetId = 'row-' + cat.id;
        const section = document.getElementById(targetId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
      chips.appendChild(btn);
    });

    inner.appendChild(titulo);
    inner.appendChild(chips);
    hero.appendChild(inner);
    container.appendChild(hero);
  }

  function _resetSearch() {
    const input = document.getElementById('toolSearch');
    if (input) input.value = '';
  }

  // Muestra/oculta las secciones por categoría (filtrado real)
  function _applyCategoryFilter(category) {
    const container = document.getElementById(CONTAINER_ID);
    if (!container) return;
    const rows = container.querySelectorAll('.stream-row');
    rows.forEach(row => {
      const rowCategory = row.dataset.category;
      const shouldShow = (category === 'all') || (rowCategory === category);
      row.style.display = shouldShow ? '' : 'none';
      if (shouldShow) {
        row.querySelectorAll('.stream-card').forEach(card => { card.style.display = ''; });
      }
    });
  }

  // Marca como activo el chip cuyo data-target coincide con `target`
  function _setActiveChipByTarget(target) {
    const container = document.getElementById(CONTAINER_ID);
    if (!container) return;
    container.querySelectorAll('.stream-chip').forEach(chip => {
      chip.classList.toggle('is-active', chip.dataset.target === target);
    });
  }

  // Reaccionar a la selección de categoría desde el dropdown del header
  // (o cualquier emisor de category:select). Se ejecuta en el siguiente tick
  // para que el buscador (Buscador) termine de limpiar su estado primero.
  function _subscribeCategorySelect() {
    function _onCategorySelect(detail) {
      const category = (detail && detail.category) ? detail.category : 'all';
      setTimeout(() => {
        _resetSearch();
        _applyCategoryFilter(category);
        _setActiveChipByTarget(category);
      }, 0);
    }
    if (typeof EventEmitter !== 'undefined') {
      EventEmitter.on('category:select', _onCategorySelect);
    } else {
      document.addEventListener('category:select', (e) => _onCategorySelect(e.detail));
    }
  }

  // Renderiza una card de equipo estilo streaming (ancha, con descripción y CTA)
  function _renderStreamingCard(equipo, track) {
    const waLink = _buildWhatsappLink(equipo);
    const firstImg = equipo.imagen
      ? `assets/imagenes/${equipo.carpeta || equipo.id}/${equipo.imagen}`
      : 'assets/imagenes/logo.png';

    const card = document.createElement('article');
    card.className = 'stream-card netflix-item';
    card.dataset.category = equipo.categoria;
    card.dataset.id = equipo.id;

    const poster = document.createElement('div');
    poster.className = 'stream-card-poster netflix-item-image';
    poster.style.cursor = 'pointer';

    const img = document.createElement('img');
    img.src = firstImg;
    img.alt = equipo.nombre;
    img.loading = 'lazy';
    img.width = 640;
    img.height = 360;
    img.onerror = function() { this.src = 'assets/imagenes/logo.png'; };
    poster.appendChild(img);

    if (equipo.disponible !== false) {
      const badge = document.createElement('span');
      badge.className = 'stream-card-badge netflix-item-available';
      badge.textContent = 'Disponible';
      badge.setAttribute('aria-label', equipo.nombre + ' disponible para alquiler');
      poster.appendChild(badge);
    } else {
      const badge = document.createElement('span');
      badge.className = 'stream-card-badge stream-card-badge--agotado';
      badge.textContent = 'Agotado';
      badge.setAttribute('aria-label', equipo.nombre + ' agotado');
      poster.appendChild(badge);
    }

    if (equipo.venta) {
      const venta = document.createElement('span');
      venta.className = 'stream-card-badge stream-card-badge--venta';
      venta.textContent = equipo.ventaLabel || ('Venta $' + equipo.venta.toLocaleString('es-CO'));
      venta.setAttribute('aria-label', equipo.nombre + ' disponible para venta');
      poster.appendChild(venta);
    }

    poster.addEventListener('click', async function() {
      if (typeof Gallery === 'undefined') return;
      const images = await _fetchEquipmentImages(equipo.id).catch(() => []);
      if (images.length === 0) return;
      const specsData = {
        titulo: equipo.nombre,
        datos: {
          'Categoría': _getCategoriaNombre(equipo.categoria),
          'Disponible': equipo.disponible ? 'Sí' : 'No'
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

    const body = document.createElement('div');
    body.className = 'stream-card-body';

    const titleEl = document.createElement('h3');
    titleEl.className = 'stream-card-title netflix-item-title';
    titleEl.textContent = equipo.nombre;

    const cta = document.createElement('a');
    cta.href = waLink;
    cta.className = 'stream-card-cta netflix-item-whatsapp';
    cta.target = '_blank';
    cta.rel = 'noopener';
    cta.setAttribute('aria-label', 'Cotizar ' + equipo.nombre + ' por WhatsApp');
    cta.innerHTML = '<i class="bi bi-whatsapp"></i><span>Cotizar por WhatsApp</span>';

    body.appendChild(titleEl);
    body.appendChild(cta);

    card.appendChild(poster);
    card.appendChild(body);
    track.appendChild(card);
  }

  // Renderiza todas las secciones grid (una por categoría)
  async function _renderStreamingSections(container, equiposAgrupados) {
    for (const categoria of _state.categorias) {
      const equipos = equiposAgrupados[categoria.id];
      if (!equipos || equipos.length === 0) continue;

      const section = document.createElement('section');
      section.className = 'stream-row netflix-row';
      section.id = 'row-' + categoria.id;
      section.dataset.category = categoria.id;

      const track = document.createElement('div');
      track.className = 'stream-row-track netflix-row-content streaming-row-content';
      track.id = 'row-track-' + categoria.id;
      section.appendChild(track);

      container.appendChild(section);

      equipos.forEach(equipo => {
        try { _renderStreamingCard(equipo, track); } catch (e) {
          console.error('EquiposLoader: Error renderizando ' + equipo.id + ':', e.message);
        }
      });

      section.dataset.categoryLoaded = 'true';
    }
  }

  // --- API PÚBLICA DE INICIALIZACIÓN ---
  async function init() {
    if (_state.initialized) {
      console.log('EquiposLoader: Ya inicializado');
      return;
    }

    console.log('EquiposLoader: Cargando datos desde JSON externo...');

    try {
      await _loadAllData();

      const container = document.getElementById(CONTAINER_ID);
      if (!container) {
        console.warn('EquiposLoader: Contenedor #' + CONTAINER_ID + ' no encontrado');
        return;
      }
      container.innerHTML = '';
      container.classList.add('streaming-view');

      _renderStreamingHero(container);

      const agrupados = _agruparPorCategoria(_state.equipos);
      await _renderStreamingSections(container, agrupados);

      // Filtrado por categoría: chips del hero + dropdown del header
      _subscribeCategorySelect();

      _emit('equiposLoaded', {
        total: _state.equipos.length,
        timestamp: Date.now()
      });
      _emit('equipos:ready', {
        total: _state.equipos.length,
        timestamp: Date.now()
      });

      _state.initialized = true;
      console.log('EquiposLoader: ' + _state.equipos.length + ' equipos cargados exitosamente');
    } catch (error) {
      console.error('EquiposLoader: Error en inicialización:', error);
    }
  }

  // --- API PÚBLICA ---
  return {
    init,
    getEquipos: () => [..._state.equipos],
    getCategorias: () => [..._state.categorias],
    getEmpresa: () => ({ ..._state.empresa }),
    filtrarPorCategoria: (categoriaId) => _state.equipos.filter(eq => eq.categoria === categoriaId),
    buscar: (termino) => {
      const busqueda = termino.toLowerCase();
      return _state.equipos.filter(eq =>
        eq.nombre.toLowerCase().includes(busqueda) ||
        (eq.descripcion || '').toLowerCase().includes(busqueda)
      );
    }
  };

})();

// Auto-inicializar cuando el DOM esté listo
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', EquiposLoader.init);
  } else {
    EquiposLoader.init();
  }
}

// Reaccionar a carga dinámica del componente
if (typeof document !== 'undefined') {
  document.addEventListener('component:loaded', function(e) {
    if (e.detail && e.detail.id === 'equipos') {
      console.log('EquiposLoader: componente cargado dinámicamente, reinicializando...');
      setTimeout(() => EquiposLoader.init(), 100);
    }
  });
}

// Fallback de inicialización cuando el browser esté inactivo
if (typeof window !== 'undefined') {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(function() {
      if (!EquiposLoader.getEquipos().length) {
        console.log('EquiposLoader: fallback init durante idle');
        EquiposLoader.init();
      }
    }, { timeout: 1500 });
  } else {
    setTimeout(function() {
      if (!EquiposLoader.getEquipos().length) {
        console.log('EquiposLoader: fallback init después de 1s');
        EquiposLoader.init();
      }
    }, 1000);
  }
}
