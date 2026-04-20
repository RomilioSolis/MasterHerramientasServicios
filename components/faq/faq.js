// ============================================
// MÓDULO: FAQ
// Componente de Preguntas Frecuentes con Module Pattern
// ============================================

const FAQ = (() => {
  
  // --- CONSTANTES PRIVADAS ---
  const SELECTORS = {
    QUESTIONS: '.faq-question',
    ANSWERS: '.faq-answer',
    NAV_LINKS: '.faq-nav-link',
    CONTAINER: '#faq-container'
  };
  
  // --- ESTADO PRIVADO ---
  let _state = {
    initialized: false,
    activeCategory: null
  };
  
  // --- FUNCIONES PRIVADAS ---
  function _toggleAnswer(btn) {
    const ans = btn.nextElementSibling;
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    
    btn.setAttribute('aria-expanded', !isOpen);
    btn.classList.toggle('collapsed', isOpen);
    ans.style.maxHeight = isOpen ? '0' : ans.scrollHeight + 'px';
    ans.classList.toggle('show', !isOpen);
  }
  
  function _scrollToTarget(id) {
    const el = document.getElementById(id);
    if (el) {
      setTimeout(() => {
        const rect = el.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetY = rect.top + scrollTop - 80;
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }, 10);
    }
  }
  
  function _emit(eventName, detail = {}) {
    if (typeof EventEmitter !== 'undefined') {
      EventEmitter.emit(eventName, detail);
    } else {
      document.dispatchEvent(new CustomEvent(eventName, { detail }));
    }
  }
  
  // --- BIND EVENTS ---
  function _bindEvents() {
    // Preguntas - usar event delegation
    const container = document.querySelector(SELECTORS.CONTAINER);
    if (!container) {
      console.log('FAQ: Container not found, retrying...');
      setTimeout(() => _bindEvents(), 100);
      return;
    }
    
    const questions = container.querySelectorAll(SELECTORS.QUESTIONS);
    console.log('FAQ: Binding events, questions found:', questions.length);
    
    container.addEventListener('click', (e) => {
      const btn = e.target.closest(SELECTORS.QUESTIONS);
      if (btn) {
        console.log('FAQ: Question clicked');
        e.preventDefault();
        _toggleAnswer(btn);
      }
    });
    
    // Navigation links
    container.addEventListener('click', (e) => {
      const link = e.target.closest(SELECTORS.NAV_LINKS);
      if (link) {
        e.preventDefault();
        const id = link.dataset.target;
        _scrollToTarget(id);
      }
    });
  }
  
  // --- API PÚBLICA ---
  return {
    init() {
      if (_state.initialized) return;
      
      // Esperar a que las preguntas estén cargadas
      const questions = document.querySelectorAll(SELECTORS.QUESTIONS);
      if (questions.length === 0) {
        console.log('FAQ: Questions not found yet, retrying...');
        setTimeout(() => this.init(), 150);
        return;
      }
      
      console.log('FAQ: Initializing with', questions.length, 'questions');
      _bindEvents();
      _state.initialized = true;
      
      _emit('faq:init', { count: questions.length });
    },
    
    toggle(questionBtn) {
      if (questionBtn) {
        _toggleAnswer(questionBtn);
      }
    },
    
    closeAll() {
      document.querySelectorAll(SELECTORS.QUESTIONS).forEach(btn => {
        const ans = btn.nextElementSibling;
        btn.setAttribute('aria-expanded', 'false');
        btn.classList.add('collapsed');
        ans.style.maxHeight = '0';
        ans.classList.remove('show');
      });
    },
    
    openAll() {
      document.querySelectorAll(SELECTORS.QUESTIONS).forEach(btn => {
        const ans = btn.nextElementSibling;
        btn.setAttribute('aria-expanded', 'true');
        btn.classList.remove('collapsed');
        ans.style.maxHeight = ans.scrollHeight + 'px';
        ans.classList.add('show');
      });
    },
    
    scrollTo(id) {
      _scrollToTarget(id);
    },
    
    getCount() {
      return document.querySelectorAll(SELECTORS.QUESTIONS).length;
    },
    
    isInitialized() {
      return _state.initialized;
    }
  };
  
})();

// ============================================
// LEGACY: Compatibilidad hacia atrás
// ============================================
if (typeof window !== 'undefined') {
  window.FAQ = FAQ;
  window.initFAQ = () => FAQ.init();
}

// Auto-inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  if (!FAQ.isInitialized()) {
    FAQ.init();
  }
});

// También intentar inicializar cuando se cargue dinámicamente via ComponentFactory
document.addEventListener('component:loaded', (e) => {
  if (e.detail && e.detail.id === 'faq') {
    setTimeout(() => {
      if (!FAQ.isInitialized()) {
        FAQ.init();
      }
    }, 100);
  }
});

// Intento adicional por si el listener arriba no funciona
setTimeout(() => {
  if (!FAQ.isInitialized()) {
    FAQ.init();
  }
}, 500);

// Exportar si ESM
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FAQ;
}