// ============================================
// MÓDULO: ChatWidget
// Refactorizado con Module Pattern (IIFE + Revealing Module)
// ============================================
const ChatWidget = (() => {
  
  // --- CONSTANTES PRIVADAS ---
  const WA_NUMBER = '573165345675';
  const MAX_USES = 5;
  const STORAGE_KEY = 'masterCwUses';
  
  // IDs de elementos del DOM
  const IDS = {
    FAB: 'cw-fab',
    BADGE: 'cw-badge',
    WINDOW: 'cw-window',
    MESSAGES: 'cw-messages',
    INPUT: 'cw-input',
    SEND: 'cw-send',
    CLOSE_BTN: 'cw-close-btn',
    USES_LEFT: 'cw-uses-left',
    LIMIT_NOTICE: 'cw-limit-notice',
    FOOTER: 'cw-footer',
    CHIPS: 'cw-chips'
  };
  
  // --- FUNCIONES PRIVADAS ---
  
  /**
   * Obtiene el número de usos desde localStorage
   * @returns {number}
   */
  function _getUses() {
    try { 
      return parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10); 
    } catch(e) { 
      return 0; 
    }
  }
  
  /**
   * Incrementa el contador de usos
   */
  function _incrementUses() {
    try { 
      localStorage.setItem(STORAGE_KEY, String(_getUses() + 1)); 
    } catch(e) {}
  }
  
  /**
   * Retorna la hora actual formateada
   * @returns {string}
   */
  function _timeNow() {
    const d = new Date();
    return d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0');
  }
  
  /**
   * Escapa HTML para prevenir XSS
   * @param {string} str
   * @returns {string}
   */
  function _escapeHtml(str) {
    return str
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#039;');
  }
  
  // --- ESTADO PRIVADO ---
  let _state = {
    elements: {},
    initialized: false
  };
  
  // --- FUNCIONES PÚBLICAS (MÉTODOS DEL MÓDULO) ---
  
  /**
   * Inicializa el chat widget
   * @returns {boolean}
   */
  function init() {
    const fab = document.getElementById(IDS.FAB);
    console.log('ChatWidget init - fab:', fab, 'initialized:', _state.initialized);
    
    if (!fab || _state.initialized) return false;
    _state.initialized = true;
    
    // Cachear elementos del DOM
    _state.elements = {
      fab: fab,
      badge: document.getElementById(IDS.BADGE),
      win: document.getElementById(IDS.WINDOW),
      msgs: document.getElementById(IDS.MESSAGES),
      input: document.getElementById(IDS.INPUT),
      sendBtn: document.getElementById(IDS.SEND),
      closeBtn: document.getElementById(IDS.CLOSE_BTN),
      chips: document.querySelectorAll('.cw-chip'),
      usesLeft: document.getElementById(IDS.USES_LEFT),
      limitNote: document.getElementById(IDS.LIMIT_NOTICE),
      footer: document.getElementById(IDS.FOOTER),
      chipsArea: document.getElementById(IDS.CHIPS)
    };
    
    _bindEvents();
    addBubble('👋 ¡Hola! Soy el asistente de Master Herramientas.\nEscribe tu consulta y te la enviamos directamente a nuestro WhatsApp 📲', 'in');
    _updateCounter();
    _applyLimitState();
    return true;
  }
  
  /**
   * Añade una burbuja de mensaje al chat
   * @param {string} text - Texto del mensaje
   * @param {string} direction - 'in' o 'out'
   */
  function addBubble(text, direction) {
    const { msgs } = _state.elements;
    if (!msgs) return;
    
    const div = document.createElement('div');
    const baseStyle = 'max-width:82%;padding:8px 11px;border-radius:10px;font-size:13.5px;line-height:1.45;position:relative;word-break:break-word;animation:cwBubbleIn 0.2s ease;';
    const inStyle = baseStyle + 'background:#fff;border-bottom-left-radius:2px;align-self:flex-start;color:#111;box-shadow:0 1px 2px rgba(0,0,0,0.12);';
    const outStyle = baseStyle + 'background:#dcf8c6;border-bottom-right-radius:2px;align-self:flex-end;color:#111;box-shadow:0 1px 2px rgba(0,0,0,0.12);';
    
    div.style.cssText = direction === 'in' ? inStyle : outStyle;
    div.innerHTML = _escapeHtml(text) + '<div style="font-size:10px;color:rgba(0,0,0,0.45);text-align:right;margin-top:2px;">' + _timeNow() + '</div>';
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }
  
  /**
   * Actualiza el contador de usos
   */
  function _updateCounter() {
    const { badge, usesLeft } = _state.elements;
    if (!badge || !usesLeft) return;
    
    const uses = _getUses();
    const remaining = Math.max(0, MAX_USES - uses);
    badge.textContent = remaining;
    usesLeft.textContent = remaining + ' consultas restantes';
    if (remaining === 0) badge.style.background = '#888';
  }
  
  /**
   * Aplica el estado de límite alcanzado
   */
  function _applyLimitState() {
    const { input, sendBtn, limitNote, footer, chipsArea } = _state.elements;
    if (_getUses() >= MAX_USES) {
      if (input) {
        input.disabled = true;
        input.placeholder = 'Límite de consultas alcanzado';
      }
      if (sendBtn) sendBtn.disabled = true;
      if (limitNote) limitNote.style.display = 'block';
      if (footer) footer.style.opacity = '.5';
      if (chipsArea) chipsArea.style.display = 'none';
    }
  }
  
  /**
   * Envía el mensaje a WhatsApp
   * @param {string} text
   */
  function sendToWhatsApp(text) {
    const { input } = _state.elements;
    const clean = text.trim();
    if (!clean) return;
    if (_getUses() >= MAX_USES) { 
      _applyLimitState(); 
      return; 
    }
    
    addBubble(clean, 'out');
    _incrementUses();
    _updateCounter();
    
    setTimeout(() => {
      addBubble('✅ Tu mensaje está listo. Se abrirá WhatsApp para enviarlo.', 'in');
      setTimeout(() => {
        window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(clean), '_blank', 'noopener,noreferrer');
      }, 500);
    }, 600);
    
    if (input) {
      input.value = '';
      input.style.height = 'auto';
    }
    _applyLimitState();
  }
  
  /**
   * Abre el chat
   */
  function openChat() {
    const { win, fab, input } = _state.elements;
    if (!win || !fab) return;
    
    win.style.transform = 'scale(1) translateY(0)';
    win.style.opacity = '1';
    win.style.pointerEvents = 'all';
    fab.setAttribute('aria-expanded', 'true');
    if (input) input.focus();
  }
  
  /**
   * Cierra el chat
   */
  function closeChat() {
    const { win, fab } = _state.elements;
    if (!win || !fab) return;
    
    win.style.transform = 'scale(0.8) translateY(20px)';
    win.style.opacity = '0';
    win.style.pointerEvents = 'none';
    fab.setAttribute('aria-expanded', 'false');
  }
  
  /**
   * Vincula los eventos del widget
   */
  function _bindEvents() {
    const { input, fab, closeBtn, sendBtn, chips } = _state.elements;
    
    if (input) {
      input.addEventListener('input', () => {
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 90) + 'px';
      });
    }
    
    if (fab) {
      fab.addEventListener('click', () => {
        if (_state.elements.win && _state.elements.win.style.opacity === '1') {
          closeChat();
        } else {
          openChat();
        }
      });
    }
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeChat());
    }
    
    if (sendBtn) {
      sendBtn.addEventListener('click', () => sendToWhatsApp(input ? input.value : ''));
    }
    
    if (input) {
      input.addEventListener('keydown', (e) => { 
        if (e.key === 'Enter' && !e.shiftKey) { 
          e.preventDefault(); 
          sendToWhatsApp(input.value); 
        } 
      });
    }
    
    if (chips) {
      chips.forEach(chip => {
        chip.addEventListener('click', () => sendToWhatsApp(chip.getAttribute('data-text')));
      });
    }
    
    document.addEventListener('keydown', (e) => { 
      if (e.key === 'Escape' && _state.elements.win && _state.elements.win.style.opacity === '1') {
        closeChat();
      }
    });
  }
  
  // --- API PÚBLICA (REVEALING MODULE) ---
  return {
    init: init,
    addBubble: addBubble,
    sendToWhatsApp: sendToWhatsApp,
    openChat: openChat,
    closeChat: closeChat,
    
    /**
     * Retorna el estado de inicialización
     * @returns {boolean}
     */
    isInitialized: () => _state.initialized,
    
    /**
     * Retorna los usos restantes
     * @returns {number}
     */
    getRemainingUses: () => Math.max(0, MAX_USES - _getUses())
  };
})();

export default ChatWidget;