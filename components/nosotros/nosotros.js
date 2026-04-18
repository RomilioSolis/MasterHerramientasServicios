const Nosotros = {
  init: function() {
    this.initVideo();
    this.initMapa();
  },
  
  initVideo: function() {
    var video = document.getElementById('nosotros-video');
    var textoCard = document.getElementById('texto-card');
    var videoCardContainer = document.getElementById('video-card-container');
    var videoCard = document.getElementById('video-card');
    
    if (!video || !textoCard || !videoCardContainer) return;
    
    video.addEventListener('play', function() {
      textoCard.style.opacity = '0';
      setTimeout(function() {
        textoCard.style.display = 'none';
        videoCardContainer.style.width = '100%';
        videoCardContainer.style.maxWidth = '900px';
        videoCardContainer.style.margin = '0 auto';
        videoCardContainer.style.flex = '0 0 100%';
      }, 300);
    });
    
    video.addEventListener('ended', function() {
      videoCardContainer.style.flex = '';
      videoCardContainer.style.width = '';
      videoCardContainer.style.maxWidth = '';
      videoCardContainer.style.margin = '';
      textoCard.style.display = '';
      setTimeout(function() {
        textoCard.style.opacity = '1';
      }, 10);
    });
  },
  
  initMapa: function() {
    var nosotrosMapa = document.getElementById('nosotros-mapa');
    if (!nosotrosMapa) return;
    
    if (typeof L === 'undefined') {
      console.warn('Leaflet pendiente de cargar');
      return;
    }
    if (nosotrosMapa._leaflet_id !== undefined) return;
    
    var LAT = 3.438368;
    var LNG = -76.505911;
    
    var mapa = L.map('nosotros-mapa', {
      center: [LAT, LNG],
      zoom: 16,
      scrollWheelZoom: false,
      zoomControl: true
    });
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(mapa);
    
    var iconoEmpresa = L.divIcon({
      className: '',
      html: '<div style="background:#d32f2f;width:36px;height:36px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 2px 12px rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;"><span style="transform:rotate(45deg);font-size:17px;">🔧</span></div>',
      iconSize: [36, 36],
      iconAnchor: [18, 36]
    });
    
    var popupEmpresa = '<div style="font-family:Segoe UI,sans-serif;min-width:180px;">' +
      '<strong style="font-size:14px;">🔧 Master Herramientas y Servicios</strong><br>' +
      '<span style="color:#555;font-size:12px;">Cra. 23 #36-48, Barrio El Rodeo</span><br>' +
      '<span style="color:#1565c0;font-size:11px;">📍 Parada MIO P21C justo enfrente</span><br>' +
      '<a href="https://www.google.com/maps/place/3.438368,-76.505911" target="_blank" style="font-size:12px;color:#1a73e8;">Ver en Google Maps</a>' +
      '</div>';
    
    L.marker([LAT, LNG], {icon: iconoEmpresa}).addTo(mapa).bindPopup(popupEmpresa).openPopup();
    
    var iconoMIO = L.divIcon({
      className: '',
      html: '<div style="background:#1565c0;width:30px;height:30px;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;"><span style="font-size:14px;">🚌</span></div>',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
    
    L.marker([LAT, LNG - 0.0002], {icon: iconoMIO}).addTo(mapa)
      .bindPopup('<div style="font-family:Segoe UI,sans-serif;"><span>🚌 Parada MIO — Ruta P21C</span></div>');
    
    setTimeout(function() {
      if (mapa) mapa.invalidateSize();
    }, 200);
  }
};

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    Nosotros.init();
  }, 100);
});

window.addEventListener('resize', function() {
  Nosotros.initMapa();
});