// ============================================
// MÓDULO: Contacto
// Refactorizado con Module Pattern (IIFE + Revealing Module)
// Maneja la sección de contacto y mapa
// ============================================
const Contacto = (() => {
  
  // --- ESTADO PRIVADO ---
  let _state = {
    initialized: false,
    mapa: null
  };
  
  // --- FUNCIONES PRIVADAS ---
  
  /**
   * Espera a que Leaflet esté disponible
   */
  function _waitForLeaflet() {
    let attempts = 0;
    const maxAttempts = 20;
    
    function check() {
      attempts++;
      if (typeof L !== 'undefined') {
        _initMapa();
        return;
      }
      if (attempts < maxAttempts) {
        setTimeout(check, 100);
      } else {
        console.error('Leaflet no disponible después de 2 segundos');
      }
    }
    
    check();
  }
  
  /**
   * Inicializa el mapa Leaflet
   */
  function _initMapa() {
    const contactoMapa = document.getElementById('contacto-mapa');
    if (!contactoMapa) return;
    if (contactoMapa._leaflet_id !== undefined) return;
    
    const LAT = 3.438368;
    const LNG = -76.505911;
    
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
      '<span style="color:#ccc;font-size:13px;">Cra. 23 #36-48, El Rodeo</span><br>' +
      '<a href="https://www.google.com/maps/place/3.438368,-76.505911" target="_blank" style="color:#4dabf7;font-size:12px;">Ver en Maps →</a></div>'
    ).openPopup();
    
    _state.mapa = mapa;
    
    setTimeout(() => {
      if (mapa) mapa.invalidateSize();
    }, 200);
  }
  
  /**
   * Inicializa el módulo
   */
  function _init() {
    _waitForLeaflet();
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
setTimeout(() => Contacto.init(), 100);

// Manejar resize
window.addEventListener('resize', () => Contacto.refreshMapa());