(function() {
  var relojDisplay = document.getElementById('reloj-actual');
  var fechaDisplay = document.getElementById('fecha-actual');
  var statusBadge = document.getElementById('status-abierto');
  
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
        statusBadge.innerHTML = '<span class="badge bg-success fs-6"><i class="bi bi-check-circle me-1"></i>Abierto</span>';
      } else {
        statusBadge.innerHTML = '<span class="badge bg-danger fs-6"><i class="bi bi-x-circle me-1"></i>Cerrado</span>';
      }
    }
  }
  
  if (relojDisplay && fechaDisplay) {
    actualizarReloj();
    setInterval(actualizarReloj, 1000);
  }
})();