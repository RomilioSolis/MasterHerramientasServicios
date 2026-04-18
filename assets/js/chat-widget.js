const WA_NUMBER = '573165345675';
const MAX_USES = 5;
const STORAGE_KEY = 'masterCwUses';

const getUses = () => {
  try { return parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10); } 
  catch(e) { return 0; }
};

const incrementUses = () => {
  try { localStorage.setItem(STORAGE_KEY, String(getUses() + 1)); } 
  catch(e) {}
};

const timeNow = () => {
  const d = new Date();
  return d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0');
};

const escapeHtml = (str) => {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
};

const ChatWidget = {
  fab: null,
  badge: null,
  win: null,
  msgs: null,
  input: null,
  sendBtn: null,
  closeBtn: null,
  chips: null,
  usesLeft: null,
  limitNote: null,
  footer: null,
  chipsArea: null,
  initialized: false,

  init() {
    this.fab = document.getElementById('cw-fab');
    console.log('ChatWidget init - fab:', this.fab, 'initialized:', this.initialized);
    if (!this.fab || this.initialized) return false;
    this.initialized = true;

    this.badge = document.getElementById('cw-badge');
    this.win = document.getElementById('cw-window');
    this.msgs = document.getElementById('cw-messages');
    this.input = document.getElementById('cw-input');
    this.sendBtn = document.getElementById('cw-send');
    this.closeBtn = document.getElementById('cw-close-btn');
    this.chips = document.querySelectorAll('.cw-chip');
    this.usesLeft = document.getElementById('cw-uses-left');
    this.limitNote = document.getElementById('cw-limit-notice');
    this.footer = document.getElementById('cw-footer');
    this.chipsArea = document.getElementById('cw-chips');

    this.bindEvents();
    this.addBubble('👋 ¡Hola! Soy el asistente de Master Herramientas.\nEscribe tu consulta y te la enviamos directamente a nuestro WhatsApp 📲', 'in');
    this.updateCounter();
    this.applyLimitState();
    return true;
  },

  addBubble(text, direction) {
    const div = document.createElement('div');
    const style = 'max-width:82%;padding:8px 11px;border-radius:10px;font-size:13.5px;line-height:1.45;position:relative;word-break:break-word;animation:cwBubbleIn 0.2s ease;';
    const inStyle = style + 'background:#fff;border-bottom-left-radius:2px;align-self:flex-start;color:#111;box-shadow:0 1px 2px rgba(0,0,0,0.12);';
    const outStyle = style + 'background:#dcf8c6;border-bottom-right-radius:2px;align-self:flex-end;color:#111;box-shadow:0 1px 2px rgba(0,0,0,0.12);';
    
    div.style.cssText = direction === 'in' ? inStyle : outStyle;
    div.innerHTML = escapeHtml(text) + '<div style="font-size:10px;color:rgba(0,0,0,0.45);text-align:right;margin-top:2px;">' + timeNow() + '</div>';
    this.msgs.appendChild(div);
    this.msgs.scrollTop = this.msgs.scrollHeight;
  },

  updateCounter() {
    const uses = getUses();
    const remaining = Math.max(0, MAX_USES - uses);
    this.badge.textContent = remaining;
    this.usesLeft.textContent = remaining + ' consultas restantes';
    if (remaining === 0) this.badge.style.background = '#888';
  },

  applyLimitState() {
    if (getUses() >= MAX_USES) {
      this.input.disabled = true;
      this.sendBtn.disabled = true;
      this.input.placeholder = 'Límite de consultas alcanzado';
      this.limitNote.style.display = 'block';
      this.footer.style.opacity = '.5';
      this.chipsArea.style.display = 'none';
    }
  },

  sendToWhatsApp(text) {
    const clean = text.trim();
    if (!clean) return;
    if (getUses() >= MAX_USES) { this.applyLimitState(); return; }
    
    this.addBubble(clean, 'out');
    incrementUses();
    this.updateCounter();
    
    setTimeout(() => {
      this.addBubble('✅ Tu mensaje está listo. Se abrirá WhatsApp para enviarlo.', 'in');
      setTimeout(() => {
        window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(clean), '_blank', 'noopener,noreferrer');
      }, 500);
    }, 600);
    
    this.input.value = '';
    this.input.style.height = 'auto';
    this.applyLimitState();
  },

  openChat() {
    this.win.style.transform = 'scale(1) translateY(0)';
    this.win.style.opacity = '1';
    this.win.style.pointerEvents = 'all';
    this.fab.setAttribute('aria-expanded', 'true');
    this.input.focus();
  },

  closeChat() {
    this.win.style.transform = 'scale(0.8) translateY(20px)';
    this.win.style.opacity = '0';
    this.win.style.pointerEvents = 'none';
    this.fab.setAttribute('aria-expanded', 'false');
  },

  bindEvents() {
    this.input.addEventListener('input', () => {
      this.input.style.height = 'auto';
      this.input.style.height = Math.min(this.input.scrollHeight, 90) + 'px';
    });

    this.fab.addEventListener('click', () => {
      if (this.win.style.opacity === '1') this.closeChat();
      else this.openChat();
    });

    this.closeBtn.addEventListener('click', () => this.closeChat());
    this.sendBtn.addEventListener('click', () => this.sendToWhatsApp(this.input.value));
    
    this.input.addEventListener('keydown', (e) => { 
      if (e.key === 'Enter' && !e.shiftKey) { 
        e.preventDefault(); 
        this.sendToWhatsApp(this.input.value); 
      } 
    });
    
    this.chips.forEach(chip => {
      chip.addEventListener('click', () => this.sendToWhatsApp(chip.getAttribute('data-text')));
    });

    document.addEventListener('keydown', (e) => { 
      if (e.key === 'Escape' && this.win.style.opacity === '1') this.closeChat(); 
    });
  }
};

export default ChatWidget;