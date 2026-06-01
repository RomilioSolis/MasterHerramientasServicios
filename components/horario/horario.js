(function() {
  var relojDisplay;
  var fechaDisplay;
  var statusBadge;
  var intervaloActivo = false;
  
  function actualizarReloj() {
    var ahora = new Date();
    var opciones = { timeZone: 'America/Bogota', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    var fechaOpciones = { timeZone: 'America/Bogota', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var horaStr = ahora.toLocaleTimeString('es-CO', opciones);
    var fechaStr = ahora.toLocaleDateString('es-CO', fechaOpciones);
    
    if (relojDisplay) relojDisplay.textContent = horaStr;
    if (fechaDisplay) fechaDisplay.textContent = fechaStr.charAt(0).toUpperCase() + fechaStr.slice(1);
    
    var dia = ahora.getDay();
    var hora = ahora.getHours();
    var open = false;
    if (dia >= 1 && dia <= 5) {
      if (hora >= 8 && hora < 18) open = true;
    } else if (dia === 6) {
      if (hora >= 8 && hora < 16) open = true;
    }
    if (statusBadge) {
      if (open) {
        statusBadge.innerHTML = '<span class="badge bg-success fs-6" style="background:#d88373;"><i class="bi bi-check-circle me-1"></i>Abierto</span>';
        if (relojDisplay) {
          relojDisplay.classList.remove('cerrado');
          relojDisplay.classList.add('abierto');
        }
      } else {
        statusBadge.innerHTML = '<span class="badge bg-danger fs-6" style="background:#bd1e1e;"><i class="bi bi-x-circle me-1"></i>Cerrado</span>';
        if (relojDisplay) {
          relojDisplay.classList.remove('abierto');
          relojDisplay.classList.add('cerrado');
        }
      }
    }
  }
  
  function inicializarReloj() {
    relojDisplay = document.getElementById('reloj-actual');
    fechaDisplay = document.getElementById('fecha-actual');
    statusBadge = document.getElementById('status-abierto');
    
    if (relojDisplay && fechaDisplay) {
      if (!intervaloActivo) {
        actualizarReloj();
        setInterval(actualizarReloj, 1000);
        intervaloActivo = true;
      }
    }
  }
  
  // Inicializar inmediatamente (para cuando ya está en DOM)
  inicializarReloj();
  
  // También escuchar cuando el componente se carga dinámicamente
  document.addEventListener('component:loaded', function(e) {
    if (e.detail && e.detail.id === 'horario') {
      setTimeout(inicializarReloj, 100);
    }
  });
  
  // Fallback adicional por si el evento no llega
  setTimeout(function() {
    if (!intervaloActivo) {
      inicializarReloj();
    }
  }, 500);
  
  // MutationObserver como respaldo final
  if (typeof MutationObserver !== 'undefined') {
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length > 0) {
          var hasReloj = false;
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === 1 && node.querySelector) {
              if (node.id === 'reloj-actual' || node.querySelector('#reloj-actual')) {
                hasReloj = true;
              }
            }
          });
          if (hasReloj && !intervaloActivo) {
            inicializarReloj();
            observer.disconnect(); // Desconectar una vez inicializado
          }
        }
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();