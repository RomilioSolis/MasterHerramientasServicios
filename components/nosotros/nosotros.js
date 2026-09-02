// ============================================
// MÓDULO: Nosotros
// Refactorizado con Module Pattern (IIFE + Revealing Module)
// Maneja la sección de video y mapa de la página nosotros
// ============================================
const Nosotros = (() => {
   
  // --- ESTADO PRIVADO ---
  let _state = {
    initialized: false,
    mapa: null
  };
  
  // --- FUNCIONES PRIVADAS ---
  
  /**
   * Inicializa funcionalidad del video
   */
  function _initVideo() {
    const video = document.getElementById('nosotros-video');
    const textoCard = document.getElementById('texto-card');
    const videoCardContainer = document.getElementById('video-card-container');
    
    if (!video || !textoCard || !videoCardContainer) return;
    
    video.addEventListener('play', () => {
      textoCard.classList.add('hidden-text');
      setTimeout(() => {
        textoCard.style.display = 'none';
        videoCardContainer.classList.add('full-width');
      }, 300);
    });
    
    video.addEventListener('ended', () => {
      videoCardContainer.classList.remove('full-width');
      textoCard.style.display = '';
      setTimeout(() => {
        textoCard.classList.remove('hidden-text');
      }, 10);
    });
  }
  
  /**
    * Inicializa el mapa Leaflet
    */
  function _initMapa() {
    const nosotrosMapa = document.getElementById('nosotros-mapa');
    if (!nosotrosMapa) return;
    
    if (typeof L === 'undefined') {
      console.warn('Leaflet pendiente de cargar');
      return;
    }
    
    if (nosotrosMapa._leaflet_id !== undefined) return;
    
    const LAT = 3.438368;
    const LNG = -76.505911;
    const LAT_SANTA_MONICA = 3.436917;
    const LNG_SANTA_MONICA = -76.510377;
    
    const mapa = L.map('nosotros-mapa', {
      center: [LAT, LNG],
      zoom: 16,
      scrollWheelZoom: false,
      zoomControl: true
    });
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(mapa);
    
    const iconoEmpresa = L.divIcon({
      className: '',
      html: '<div style="background:#d32f2f;width:36px;height:36px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 2px 12px rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;"><span style="transform:rotate(45deg);font-size:17px;">🔧</span></div>',
      iconSize: [36, 36],
      iconAnchor: [18, 36]
    });
    
    const popupEmpresa = '<div style="font-family:Segoe UI,sans-serif;min-width:180px;">' +
      '<strong style="font-size:14px;">🔧 Master Herramientas y Servicios</strong><br>' +
      '<span style="color:#555;font-size:12px;">Cra. 23 #36-48, Barrio El Rodeo</span><br>' +
      '<span style="color:#1565c0;font-size:11px;">📍 Parada MIO P21C justo enfrente</span><br>' +
      '<a href="https://www.google.com/maps/place/3.438368,-76.505911" target="_blank" style="font-size:12px;color:#1a73e8;">Ver en Google Maps</a>' +
      '</div>';
    
    L.marker([LAT, LNG], {icon: iconoEmpresa}).addTo(mapa).bindPopup(popupEmpresa).openPopup();
    
    const iconoMIO = L.divIcon({
      className: '',
      html: '<div style="background:#1565c0;width:30px;height:30px;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;"><span style="font-size:14px;">🚌</span></div>',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
    
    L.marker([LAT, LNG - 0.0002], {icon: iconoMIO}).addTo(mapa)
      .bindPopup('<div style="font-family:Segoe UI,sans-serif;"><span>🚌 Parada MIO — Ruta P21C</span></div>');
    
    const iconoSucursal = L.divIcon({
      className: '',
      html: '<div style="background:#1565c0;width:36px;height:36px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 2px 12px rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;"><span style="transform:rotate(45deg);font-size:17px;">📍</span></div>',
      iconSize: [36, 36],
      iconAnchor: [18, 36]
    });
    
    const popupSucursal = '<div style="font-family:Segoe UI,sans-serif;min-width:180px;">' +
      '<strong style="font-size:14px;color:#1565c0;">📍 Sucursal Santa Mónica</strong><br>' +
      '<span style="color:#555;font-size:12px;">Cra 23 # 33 b 126, Barrio Santa Monica</span><br>' +
      '<a href="https://www.google.com/maps/place/3.436917,-76.510377" target="_blank" style="font-size:12px;color:#1a73e8;">Ver en Google Maps</a>' +
      '</div>';
    
    L.marker([LAT_SANTA_MONICA, LNG_SANTA_MONICA], {icon: iconoSucursal}).addTo(mapa).bindPopup(popupSucursal);
    
    const bounds = L.latLngBounds([
      [LAT, LNG],
      [LAT_SANTA_MONICA, LNG_SANTA_MONICA]
    ]);
    mapa.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
    
    _state.mapa = mapa;
  }
  
  /**
    * Carga dinámicamente el componente Horario dentro del contenedor
    * e inicializa su lógica una vez el HTML está inyectado.
    */
  function _initHorario() {
    const container = document.getElementById('horario-card-container');
    if (!container) return;

    const loadHorarioHTML = () => {
      fetch('components/horario/horario.html')
        .then(function(response) {
          if (!response.ok) throw new Error('HTTP ' + response.status);
          return response.text();
        })
        .then(function(html) {
          container.innerHTML = html;
          document.dispatchEvent(new CustomEvent('component:loaded', { detail: { id: 'horario' } }));
        })
        .catch(function(err) {
          console.error('[Nosotros] Error cargando horario:', err);
        });
    };

    if (window.__horarioScriptLoaded) {
      loadHorarioHTML();
    } else {
      window.__horarioScriptLoaded = true;

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'components/horario/horario.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'components/horario/horario.js';
      script.onload = loadHorarioHTML;
      script.onerror = function() {
        console.error('[Nosotros] Error cargando horario.js');
      };
      document.body.appendChild(script);
    }
  }
   
  /**
    * Inicializa el módulo
    */
  function _init() {
    _initVideo();
    _initMapa();
    _initHorario();
    _state.initialized = true;
  }
  
  /**
    * Re-inicializa el mapa (útil en resize)
    */
  function _refreshMapa() {
    if (_state.mapa) {
      _state.mapa.invalidateSize();
    }
  }
  
  // --- API PÚBLICA (REVEALING MODULE) ---
  return {
    init: _init,
    initMapa: _initMapa,
    refreshMapa: _refreshMapa
  };
})();

// Inicialización
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => Nosotros.init(), 100);
  });
} else {
  setTimeout(() => Nosotros.init(), 100);
}

// Manejar resize (debounced to prevent forced reflow spam)
window.addEventListener('resize', (() => {
  let resizeTimer;
  return () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => Nosotros.refreshMapa(), 250);
  };
})());