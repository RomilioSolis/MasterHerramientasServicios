// ============================================
// MÓDULO: Horario
// Reloj en tiempo real + estado de atención (Abierto/Cerrado)
// Module Pattern (IIFE) - Vanilla JS
// ============================================

const Horario = (() => {

  // --- CONSTANTES PRIVADAS ---
  const RELOJ_ID = 'reloj-actual';
  const FECHA_ID = 'fecha-actual';
  const STATUS_ID = 'status-abierto';

  // Horario de atención (coincide con assets/js/constants.js y el HTML)
  const HORARIO = {
    'lun-vie': { start: 8, end: 18 },   // 8:00 AM - 6:00 PM
    'sabado':    { start: 8, end: 16 }    // 8:00 AM - 4:00 PM
  };

  // --- ESTADO PRIVADO ---
  let _state = {
    relojDisplay: null,
    fechaDisplay: null,
    statusBadge: null,
    intervalId: null,
    initialized: false,
    observer: null
  };

  // --- FUNCIONES PRIVADAS ---

  function _formatTime(date) {
    return date.toLocaleTimeString('es-CO', {
      timeZone: 'America/Bogota',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  }

  function _formatDate(date) {
    const str = date.toLocaleDateString('es-CO', {
      timeZone: 'America/Bogota',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Determina si el negocio está abierto en este momento (hora de Bogotá)
  function _isAbierto(now) {
    // Convertir a hora de Bogotá para evitar dependencia de TZ del navegador
    const bogota = new Date(now.toLocaleString('en-US', { timeZone: 'America/Bogota' }));
    const dia = bogota.getDay(); // 0=Dom, 1=Lun, ... 6=Sáb
    const hora = bogota.getHours();

    if (dia >= 1 && dia <= 5) {               // Lun - Vie
      return hora >= HORARIO['lun-vie'].start && hora < HORARIO['lun-vie'].end;
    } else if (dia === 6) {                   // Sábado
      return hora >= HORARIO['sabado'].start && hora < HORARIO['sabado'].end;
    }
    return false;                             // Domingo
  }

  function _renderBadge(abierto) {
    if (!_state.statusBadge) return;

    if (abierto) {
      _state.statusBadge.innerHTML =
        '<span class="badge fs-6" style="background:#d88373;">' +
        '<i class="bi bi-check-circle me-1"></i>Abierto</span>';
      if (_state.relojDisplay) {
        _state.relojDisplay.classList.remove('cerrado');
        _state.relojDisplay.classList.add('abierto');
      }
    } else {
      _state.statusBadge.innerHTML =
        '<span class="badge fs-6" style="background:#bd1e1e;">' +
        '<i class="bi bi-x-circle me-1"></i>Cerrado</span>';
      if (_state.relojDisplay) {
        _state.relojDisplay.classList.remove('abierto');
        _state.relojDisplay.classList.add('cerrado');
      }
    }
  }

  function _actualizarReloj() {
    const ahora = new Date();
    if (_state.relojDisplay) _state.relojDisplay.textContent = _formatTime(ahora);
    if (_state.fechaDisplay) _state.fechaDisplay.textContent = _formatDate(ahora);
    _renderBadge(_isAbierto(ahora));
  }

  function _bindElements() {
    _state.relojDisplay = document.getElementById(RELOJ_ID);
    _state.fechaDisplay = document.getElementById(FECHA_ID);
    _state.statusBadge = document.getElementById(STATUS_ID);
  }

  function _startClock() {
    if (_state.initialized) return;

    _bindElements();
    if (!_state.relojDisplay || !_state.fechaDisplay) return;

    _actualizarReloj();
    _state.intervalId = setInterval(_actualizarReloj, 1000);
    _state.initialized = true;
  }

  function _stopClock() {
    if (_state.intervalId) {
      clearInterval(_state.intervalId);
      _state.intervalId = null;
    }
  }

  function _setupObserver() {
    if (typeof MutationObserver === 'undefined' || _state.observer) return;

    _state.observer = new MutationObserver((mutations) => {
      if (_state.initialized) return;

      for (const mutation of mutations) {
        if (!mutation.addedNodes || mutation.addedNodes.length === 0) continue;
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== 1) continue;
          const hasReloj = node.querySelector
            ? node.querySelector('#' + RELOJ_ID)
            : (node.id === RELOJ_ID);
          if (hasReloj) {
            // Dar un pequeño delay para que el HTML esté completamente inyectado
            setTimeout(_startClock, 50);
            return;
          }
        }
      }
    });

    _state.observer.observe(document.body, { childList: true, subtree: true });
  }

  function _onComponentLoaded(e) {
    if (e.detail && e.detail.id === 'horario') {
      // El ComponentFactory inyecta HTML y luego dispara este evento.
      // Esperar un tick para asegurar que los elementos están en el DOM.
      setTimeout(_startClock, 100);
    }
  }

  // --- API PÚBLICA ---
  return {
    init() {
      _stopClock();
      _state.initialized = false;
      _state.observer = null;
      _setupObserver();
      _startClock();
    },

    start() {
      _startClock();
    },

    stop() {
      _stopClock();
    },

    isRunning() {
      return _state.initialized;
    },

    update() {
      _actualizarReloj();
    },

    // Expuesto para que el evento component:loaded lo active
    _onComponentLoaded
  };

})();

// ============================================
// LEGACY: Compatibilidad hacia atrás
// ============================================
if (typeof window !== 'undefined') {
  window.Horario = Horario;
  window.inicializarReloj = () => Horario.init();
}

// ============================================
// AUTO-INICIO
// ============================================

// Iniciar inmediatamente si el DOM ya está listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Horario.init());
} else {
  Horario.init();
}

// Reaccionar a carga dinámica del ComponentFactory
document.addEventListener('component:loaded', Horario._onComponentLoaded || (() => {}));

// Fallback: intentar cada 500ms por 5 segundos
(function () {
  let intentos = 0;
  const fallback = setInterval(() => {
    if (Horario.isRunning() || intentos >= 10) {
      clearInterval(fallback);
      return;
    }
    intentos++;
    Horario.init();
  }, 500);
})();