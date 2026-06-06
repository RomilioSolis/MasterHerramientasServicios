// ============================================
// MÓDULO: ChatWidget - Self-contained with Event Delegation
// Works with dynamically injected DOM elements
// ============================================

window.ChatWidget = (function() {
    
   // --- CONSTANTES ---
   const WA_NUMBER = '573165345675';
   const MAX_USES = 5;
   const STORAGE_KEY = 'masterCwUses';
   
   // IDs de elementos del DOM
   const IDS = Object.freeze({
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
   });
   
   // --- ESTADO (Singleton) ---
   let _state = {
     initialized: false,
     eventsConfigured: false
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
   
   /**
    * Añade una burbuja de mensaje al chat
    * @param {string} text - Texto del mensaje
    * @param {string} direction - 'in' o 'out'
    */
function addBubble(text, direction) {
      const msgs = document.getElementById(IDS.MESSAGES);
      if (!msgs) return;
      
      const div = document.createElement('div');
      const baseStyle = 'max-width:82%;padding:8px 11px;border-radius:10px;font-size:13.5px;line-height:1.45;position:relative;word-break:break-word;animation:cwBubbleIn 0.2s ease;';
      const inStyle = baseStyle + 'background:#fff;border-bottom-left-radius:2px;align-self:flex-start;color:#111;box-shadow:0 1px 2px rgba(0,0,0,0.12);';
      const outStyle = baseStyle + 'background:#dcf8c6;border-bottom-right-radius:2px;align-self:flex-end;color:#111;box-shadow:0 1px 2px rgba(0,0,0,0.12);';
      
      div.style.cssText = direction === 'in' ? inStyle : outStyle;
      div.innerHTML = _escapeHtml(text) + '<div style="font-size:10px;color:rgba(0,0,0,0.45);text-align:right;margin-top:2px;">' + _timeNow() + '</div>';
      msgs.appendChild(div);
      // Use requestAnimationFrame for smooth scrolling without forced reflow
      requestAnimationFrame(() => {
        msgs.scrollTop = msgs.scrollHeight;
      });
    }
   
   /**
    * Actualiza el contador de usos
    */
   function _updateCounter() {
     const badge = document.getElementById(IDS.BADGE);
     const usesLeft = document.getElementById(IDS.USES_LEFT);
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
     const input = document.getElementById(IDS.INPUT);
     const sendBtn = document.getElementById(IDS.SEND);
     const limitNote = document.getElementById(IDS.LIMIT_NOTICE);
     const footer = document.getElementById(IDS.FOOTER);
     const chipsArea = document.getElementById(IDS.CHIPS);
     
     if (_getUses() >= MAX_USES) {
       if (input) {
         input.disabled = true;
         input.placeholder = 'Límite de consultas alcanzado';
       }
       if (sendBtn) sendBtn.disabled = true;
       if (limitNote) limitNote.style.display = 'block';
       if (footer) footer.style.opacity = '.5';
       if (chipsArea) chipsArea.style.display = 'none';
     } else {
       if (input) {
         input.disabled = false;
         input.placeholder = 'Escribe tu mensaje…';
       }
       if (sendBtn) sendBtn.disabled = false;
       if (limitNote) limitNote.style.display = 'none';
       if (footer) footer.style.opacity = '1';
       if (chipsArea) chipsArea.style.display = 'flex';
     }
   }
   
   /**
    * Envía el mensaje a WhatsApp
    * @param {string} text
    */
   function sendToWhatsApp(text) {
     const input = document.getElementById(IDS.INPUT);
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
     const win = document.getElementById(IDS.WINDOW);
     const fab = document.getElementById(IDS.FAB);
     const input = document.getElementById(IDS.INPUT);
     
     if (!win || !fab) {
       console.warn('[ChatWidget] Elementos no encontrados para abrir chat');
       return;
     }
     
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
     const win = document.getElementById(IDS.WINDOW);
     const fab = document.getElementById(IDS.FAB);
     
     if (!win || !fab) return;
     
     win.style.transform = 'scale(0.8) translateY(20px)';
     win.style.opacity = '0';
     win.style.pointerEvents = 'none';
     fab.setAttribute('aria-expanded', 'false');
   }
   
   /**
    * Alterna entre abrir y cerrar el chat
    */
   function toggleChat() {
     const win = document.getElementById(IDS.WINDOW);
     if (!win) {
       console.warn('[ChatWidget] Ventana de chat no encontrada');
       return;
     }
     
     const isOpen = win.style.opacity === '1';
     if (isOpen) {
       closeChat();
     } else {
       openChat();
     }
   }
   
   /**
    * Verifica si todos los elementos del widget están en el DOM
    * @returns {boolean}
    */
   function _areElementsPresent() {
     return !!document.getElementById(IDS.FAB) && 
            !!document.getElementById(IDS.WINDOW);
   }
   
   /**
    * Espera a que los elementos del widget estén presentes en el DOM
    * @param {function} callback
    * @param {number} maxAttempts
    * @param {number} interval
    */
   function _waitForElements(callback, maxAttempts, interval) {
     let attempts = 0;
     
     function check() {
       if (_areElementsPresent()) {
         callback();
         return;
       }
       
       attempts++;
       if (attempts < maxAttempts) {
         setTimeout(check, interval);
       } else {
         console.warn('[ChatWidget] Elementos no aparecieron después de ' + maxAttempts + ' intentos');
       }
     }
     
     check();
   }
   
   /**
    * Configura event delegation en el documento
    *Funciona incluso si los elementos se inyectan después del load
    */
   function _setupEventDelegation() {
     if (_state.eventsConfigured) return;
     _state.eventsConfigured = true;
     
     // Click delegation - maneja clics en cualquier elemento del DOM
     document.addEventListener('click', function(e) {
       // Toggle del chat (FAB button)
       const fab = e.target.closest('#' + IDS.FAB);
       if (fab) {
         e.preventDefault();
         toggleChat();
         return;
       }
       
       // Cerrar chat (close button)
       const closeBtn = e.target.closest('#' + IDS.CLOSE_BTN);
       if (closeBtn) {
         e.preventDefault();
         closeChat();
         return;
       }
       
       // Enviar mensaje (send button)
       const sendBtn = e.target.closest('#' + IDS.SEND);
       if (sendBtn) {
         e.preventDefault();
         const input = document.getElementById(IDS.INPUT);
         if (input) {
           sendToWhatsApp(input.value);
         }
         return;
       }
       
       // Chips (preguntas rápidas)
       const chip = e.target.closest('.cw-chip');
       if (chip) {
         const text = chip.getAttribute('data-text');
         if (text) {
           sendToWhatsApp(text);
         }
         return;
       }
       
       // Cerrar al hacer clic fuera del chat window (overlay behavior)
       const win = document.getElementById(IDS.WINDOW);
       if (win && win.contains(e.target) === false && !e.target.closest('#' + IDS.FAB)) {
         // Solo cerrar si el chat está abierto
         if (win.style.opacity === '1') {
           closeChat();
         }
       }
     }, false); // useCapture phase not needed
     
     // Keyboard events - Enter to send, Escape to close
     document.addEventListener('keydown', function(e) {
       const input = document.getElementById(IDS.INPUT);
       if (!input || document.activeElement !== input) return;
       
       if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         sendToWhatsApp(input.value);
       }
       
       if (e.key === 'Escape') {
         const win = document.getElementById(IDS.WINDOW);
         if (win && win.style.opacity === '1') {
           closeChat();
         }
       }
     }, false);
     
// Auto-resize textarea on input
      document.addEventListener('input', function(e) {
        if (e.target.id === IDS.INPUT) {
          // Use requestAnimationFrame to avoid forced reflow
          requestAnimationFrame(() => {
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.target.scrollHeight, 90) + 'px';
          });
        }
      }, false);
     
     console.log('[ChatWidget] Event delegation configured');
   }
   
   /**
    * Inicializa el widget (puede llamarse antes o después de que el HTML esté inyectado)
    * @returns {boolean} true si se inicializó, false si ya estaba inicializado
    */
   function init() {
     if (_state.initialized) return false;
     _state.initialized = true;
     
     // Configurar event delegation inmediatamente (no depende del DOM)
     _setupEventDelegation();
     
     // Esperar a que los elementos del HTML estén presentes
     _waitForElements(function() {
       // Ahora que los elementos existen, inicializar el contenido
       const msgs = document.getElementById(IDS.MESSAGES);
       if (msgs && msgs.children.length === 0) {
         addBubble('👋 ¡Hola! Soy el asistente de Master Herramientas.\nEscribe tu consulta y te la enviamos directamente a nuestro WhatsApp 📲', 'in');
       }
       
       _updateCounter();
       _applyLimitState();
       
       console.log('[ChatWidget] Initialized (elements found)');
     }, 50, 100); // 50 intentos cada 100ms = ~5 segundos max
     
     console.log('[ChatWidget] init() called, waiting for DOM elements...');
     return true;
   }
   
   // --- API PÚBLICA ---
   return {
     init: init,
     open: openChat,
     close: closeChat,
     toggle: toggleChat,
     sendToWhatsApp: sendToWhatsApp,
     addBubble: addBubble,
     
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

// Exportar para compatibilidad con CommonJS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.ChatWidget;
}
