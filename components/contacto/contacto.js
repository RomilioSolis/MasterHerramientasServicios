// ============================================
// MÓDULO: Contacto
// Refactorizado con Module Pattern (IIFE + Revealing Module)
// Maneja la sección de contacto y mapa
// ============================================
const Contacto = (() => {
  
   // --- ESTADO PRIVADO ---
   let _state = {
     initialized: false,
     mapa: null,
     mapaInicializado: false
   };
   
   let _mapaObserver = null;
   
   function _crearMapaObserver() {
     if (_mapaObserver) return _mapaObserver;
     
     _mapaObserver = new IntersectionObserver((entries) => {
       entries.forEach(entry => {
         if (entry.isIntersecting && !_state.mapaInicializado) {
           _state.mapaInicializado = true;
           _initMapa();
           _mapaObserver.unobserve(entry.target);
         }
       });
     }, { rootMargin: '200px' });
     
     return _mapaObserver;
   }
  
  // --- FUNCIONES PRIVADAS ---
  
  /**
    * Inicializa el mapa Leaflet
    */
  function _initMapa() {
    const contactoMapa = document.getElementById('contacto-mapa');
    if (!contactoMapa) return;
    if (contactoMapa._leaflet_id !== undefined) return;
    if (typeof L === 'undefined') {
      console.warn('Leaflet pendiente de cargar');
      return;
    }
    
    const LAT = 3.438368;
    const LNG = -76.505911;
    const LAT_SANTA_MONICA = 3.436917;
    const LNG_SANTA_MONICA = -76.510377;
    
    const mapa = L.map('contacto-mapa', {
      center: [LAT, LNG],
      zoom: 16,
      scrollWheelZoom: false
    });
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(mapa);
    
    const iconoEmpresa = L.divIcon({
      className: '',
      html: '<div style="background:linear-gradient(135deg,#d88373,#bd1e1e);width:40px;height:40px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 3px 15px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;"><span style="transform:rotate(45deg);font-size:18px;">🔧</span></div>',
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    });
    
    L.marker([LAT, LNG], {icon: iconoEmpresa}).addTo(mapa).bindPopup(
      '<div style="font-family:var(--font-family);min-width:200px;padding:5px;">' +
      '<strong style="color:#d88373;font-size:15px;">🔧 Master Herramientas</strong><br>' +
      '<span style="color:#ccc;font-size:13px;">' + ((typeof APP_CONFIG !== 'undefined' && APP_CONFIG.BUSINESS.ADDRESS) || 'Cra. 23 #36-48, El Rodeo') + '</span><br>' +
      '<a href="https://www.google.com/maps/place/3.438368,-76.505911" target="_blank" style="color:#4dabf7;font-size:12px;">Ver en Maps →</a></div>'
    ).openPopup();
    
    const iconoSucursal = L.divIcon({
      className: '',
      html: '<div style="background:linear-gradient(135deg,#1565c0,#0d47a1);width:40px;height:40px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 3px 15px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;"><span style="transform:rotate(45deg);font-size:18px;">📍</span></div>',
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    });
    
    L.marker([LAT_SANTA_MONICA, LNG_SANTA_MONICA], {icon: iconoSucursal}).addTo(mapa).bindPopup(
      '<div style="font-family:var(--font-family);min-width:200px;padding:5px;">' +
      '<strong style="color:#1565c0;font-size:15px;">📍 Sucursal Santa Mónica</strong><br>' +
      '<span style="color:#ccc;font-size:13px;">Cra 23 # 33 b 126, Barrio Santa Monica</span><br>' +
      '<a href="https://www.google.com/maps/place/3.436917,-76.510377" target="_blank" style="color:#4dabf7;font-size:12px;">Ver en Maps →</a></div>'
    );
    
    const bounds = L.latLngBounds([
      [LAT, LNG],
      [LAT_SANTA_MONICA, LNG_SANTA_MONICA]
    ]);
    mapa.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
    
    _state.mapa = mapa;
  }
  
  /**
    * Inicializa el módulo
    */
  function _init() {
    const mapaContainer = document.getElementById('contacto-mapa');
    if (mapaContainer) {
      const observer = _crearMapaObserver();
      observer.observe(mapaContainer);
      if (mapaContainer.getBoundingClientRect().top < window.innerHeight && mapaContainer.getBoundingClientRect().bottom > 0) {
        _state.mapaInicializado = true;
        _initMapa();
        observer.unobserve(mapaContainer);
      }
    }
    _state.initialized = true;
  }
  
  /**
    * Refresca el mapa (útil en resize)
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

// Ejecución inicial
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof Contacto.init === 'function') {
      Contacto.init();
    }
  });
} else {
  if (typeof Contacto.init === 'function') {
    Contacto.init();
  }
}

// Manejar resize (debounced to prevent forced reflow spam)
window.addEventListener('resize', (() => {
  let resizeTimer;
  return () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => Contacto.refreshMapa(), 250);
  };
})());