const Contacto = {
  init: function() {
    this.waitForLeaflet();
  },
  
  waitForLeaflet: function() {
    var attempts = 0;
    var maxAttempts = 20;
    
    var check = () => {
      attempts++;
      if (typeof L !== 'undefined') {
        this.initMapa();
        return;
      }
      if (attempts < maxAttempts) {
        setTimeout(check, 100);
      } else {
        console.error('Leaflet no disponible después de 2 segundos');
      }
    };
    
    check();
  },
  
  initMapa: function() {
    var contactoMapa = document.getElementById('contacto-mapa');
    if (!contactoMapa) return;
    if (contactoMapa._leaflet_id !== undefined) return;
    
    var LAT = 3.438368;
    var LNG = -76.505911;
    
    var mapa = L.map('contacto-mapa', {
      center: [LAT, LNG],
      zoom: 16,
      scrollWheelZoom: false
    });
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(mapa);
    
    var iconoEmpresa = L.divIcon({
      className: '',
      html: '<div style="background:linear-gradient(135deg,#800020,#a01830);width:40px;height:40px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 3px 15px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;"><span style="transform:rotate(45deg);font-size:18px;">🔧</span></div>',
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    });
    
    L.marker([LAT, LNG], {icon: iconoEmpresa}).addTo(mapa).bindPopup(
      '<div style="font-family:Segoe UI,sans-serif;min-width:200px;padding:5px;">' +
      '<strong style="color:#800020;font-size:15px;">🔧 Master Herramientas</strong><br>' +
      '<span style="color:#555;font-size:13px;">Cra. 23 #36-48, El Rodeo</span><br>' +
      '<a href="https://www.google.com/maps/place/3.438368,-76.505911" target="_blank" style="color:#1a73e8;font-size:12px;">Ver en Maps →</a></div>'
    ).openPopup();
    
    setTimeout(function() {
      if (mapa) mapa.invalidateSize();
    }, 200);
  }
};

// Ejecutar cuando el script se cargue
setTimeout(function() {
  Contacto.init();
}, 100);

window.addEventListener('resize', function() {
  Contacto.initMapa();
});