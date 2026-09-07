// ============================================
// MÓDULO: Buscador
// Componente de búsqueda dinámica con Module Pattern
// ============================================

const Buscador = (() => {
  
  // --- CONSTANTES PRIVADAS ---
  const DEBOUNCE_DELAY = 200;
  const STORAGE_KEY = 'searchHistory';
  const MAX_HISTORY = 5;
  const SELECTORS = {
    INPUT: '#toolSearch',
    FEEDBACK: '#searchFeedback',
    HISTORY: '#searchHistory',
    NETFLIX_ROWS: '#netflixRows',
    SEARCH_BOX: '.search-box',
    NOSOTROS: '#nosotros',
    EQUIPOS: '#equipos'
  };
  
  // --- ESTADO PRIVADO ---
  let _state = {
    searchInput: null,
    feedbackElement: null,
    debounceTimer: null,
    initialized: false
  };
  
  // --- FUNCIONES PRIVADAS ---
  function _normalizeText(text) {
    if (!text) return '';
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  }
  
  function _updateUI(isSearching) {
    const searchBox = document.querySelector(SELECTORS.SEARCH_BOX);
    const nosotrosSection = document.getElementById('nosotros');
    const equiposSection = document.getElementById('equipos');
    
    if (searchBox) {
      searchBox.classList.toggle('has-results', isSearching);
    }
    
    if (equiposSection) {
      equiposSection.style.display = '';
    }
    if (nosotrosSection) {
      nosotrosSection.style.display = isSearching ? 'none' : '';
    }
  }
  
  function _getHistory() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }
  
  function _setHistory(items) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      // silently fail if localStorage is unavailable
    }
  }
  
  function _addToHistory(query) {
    const trimmed = query.trim();
    if (!trimmed) return;
    
    let history = _getHistory();
    history = history.filter(item => item !== trimmed);
    history.unshift(trimmed);
    if (history.length > MAX_HISTORY) {
      history = history.slice(0, MAX_HISTORY);
    }
    _setHistory(history);
  }
  
  function _escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  function _renderHistory() {
    const historyEl = document.querySelector(SELECTORS.HISTORY);
    if (!historyEl) return;
    
    const history = _getHistory();
    if (history.length === 0) {
      historyEl.innerHTML = '';
      historyEl.classList.remove('visible');
      return;
    }
    
    const itemsHtml = history.map(item => 
      `<div class="search-history-item" data-query="${_escapeHtml(item)}">${_escapeHtml(item)}</div>`
    ).join('');
    
    const clearHtml = `<div class="search-history-clear">Borrar historial</div>`;
    
    historyEl.innerHTML = itemsHtml + clearHtml;
    historyEl.classList.add('visible');
  }
  
  function _showHistory() {
    const historyEl = document.querySelector(SELECTORS.HISTORY);
    const searchBox = document.querySelector(SELECTORS.SEARCH_BOX);
    const feedbackEl = document.querySelector(SELECTORS.FEEDBACK);
    
    if (!historyEl || !searchBox) return;
    
    const history = _getHistory();
    if (history.length === 0) return;
    
    if (feedbackEl) {
      feedbackEl.classList.remove('has-results');
      feedbackEl.textContent = '';
    }
    
    _renderHistory();
    searchBox.classList.add('has-results');
  }
  
  function _hideHistory() {
    const historyEl = document.querySelector(SELECTORS.HISTORY);
    const searchBox = document.querySelector(SELECTORS.SEARCH_BOX);
    
    if (historyEl) {
      historyEl.classList.remove('visible');
    }
    if (searchBox && (!_state.searchInput || !_state.searchInput.value.trim())) {
      searchBox.classList.remove('has-results');
    }
  }
  
  function _updateFeedback(count, query) {
    if (!_state.feedbackElement) return;
    
    if (!query || query.trim() === '') {
      _state.feedbackElement.textContent = '';
      _state.feedbackElement.classList.remove('has-results');
      return;
    }
    
    const resultText = count === 1 ? 'resultado encontrado' : 'resultados encontrados';
    _state.feedbackElement.innerHTML = `<span class="results-count">${count}</span><span class="results-text">${resultText}</span>`;
    _state.feedbackElement.classList.toggle('has-results', count > 0);
  }
  
  function _searchInNetflixRows(searchTerm) {
    const container = document.querySelector(SELECTORS.NETFLIX_ROWS);
    if (!container) return 0;
    
    const rows = container.querySelectorAll('.netflix-row');
    let totalMatches = 0;
    
    rows.forEach(row => {
      const items = row.querySelectorAll('.netflix-item');
      let rowHasMatch = false;
      
      items.forEach(item => {
        const titleEl = item.querySelector('.netflix-item-title');
        if (!titleEl) return;
        
        const title = _normalizeText(titleEl.textContent);
        
        if (!searchTerm) {
          item.style.display = '';
          rowHasMatch = true;
          totalMatches++;
          return;
        }
        
        const matches = title.includes(searchTerm);
        
        if (matches) {
          item.style.display = '';
          rowHasMatch = true;
          totalMatches++;
        } else {
          item.style.display = 'none';
        }
      });
      
      row.style.display = rowHasMatch ? '' : 'none';
    });
    
    return totalMatches;
  }
  
  function _initializeCards() {
    const container = document.querySelector(SELECTORS.NETFLIX_ROWS);
    if (!container) return;
    
    const items = container.querySelectorAll('.netflix-item');
    const rows = container.querySelectorAll('.netflix-row');
    
    items.forEach(item => {
      item.style.display = '';
    });
    
    rows.forEach(row => {
      row.style.display = '';
    });
  }
  
  function _emit(eventName, detail = {}) {
    // Usar EventEmitter si está disponible (Patrón Observer)
    if (typeof EventEmitter !== 'undefined') {
      EventEmitter.emit(eventName, detail);
    }
    
    // También dispatchear CustomEvent para compatibilidad
    document.dispatchEvent(new CustomEvent(eventName, { detail }));
  }
  
  // --- BIND EVENTS ---
  function _bindEvents() {
    if (!_state.searchInput) return;
    
    // Focus: mostrar historial si el input está vacío
    _state.searchInput.addEventListener('focus', () => {
      const history = _getHistory();
      if (history.length > 0 && !_state.searchInput.value.trim()) {
        _showHistory();
      }
    });
    
    // Blur: ocultar historial después de un pequeño delay
    _state.searchInput.addEventListener('blur', () => {
      setTimeout(_hideHistory, 150);
    });
    
    // Input con debounce
    _state.searchInput.addEventListener('input', (e) => {
      _hideHistory();
      _debounceSearch(e.target.value);
    });
    
    // Enter para buscar (guarda en historial)
    _state.searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        _performSearch(_state.searchInput.value, true);
      }
    });
    
    // Click en items del historial
    const historyContainer = document.querySelector(SELECTORS.HISTORY);
    if (historyContainer) {
      historyContainer.addEventListener('mousedown', (e) => {
        const item = e.target.closest('.search-history-item');
        const clearBtn = e.target.closest('.search-history-clear');
        
        if (item) {
          e.preventDefault();
          const query = item.dataset.query;
          if (query !== undefined) {
            _state.searchInput.value = query;
            _performSearch(query, true);
            _hideHistory();
          }
        }
        
        if (clearBtn) {
          e.preventDefault();
          _setHistory([]);
          _hideHistory();
        }
      });
    }
    
    // Limpiar búsqueda cuando se selecciona categoría
    // Usar EventEmitter si está disponible, si no fallback a addEventListener
    if (typeof EventEmitter !== 'undefined') {
      EventEmitter.on('category:select', () => {
        _clear();
      });
      EventEmitter.on('equiposLoaded', () => {
        setTimeout(_initializeCards, 300);
      });
    } else {
      document.addEventListener('category:select', () => {
        _clear();
      });
      document.addEventListener('equiposLoaded', () => {
        setTimeout(_initializeCards, 300);
      });
    }
    
    // MutationObserver para cambios dinámicos
    const netflixContainer = document.querySelector(SELECTORS.NETFLIX_ROWS);
    if (netflixContainer) {
      const observer = new MutationObserver(() => {
        if (_state.searchInput && _state.searchInput.value.trim()) {
          _performSearch(_state.searchInput.value);
        }
      });
      observer.observe(netflixContainer, { childList: true, subtree: true });
    }
  }
  
  // --- SEARCH FUNCTIONS ---
  function _debounceSearch(query) {
    clearTimeout(_state.debounceTimer);
    _state.debounceTimer = setTimeout(() => {
      _performSearch(query, false);
    }, DEBOUNCE_DELAY);
  }
  
  function _performSearch(query, saveToHistory = false) {
    const searchTerm = _normalizeText(query);
    
    if (!_state.searchInput) return;
    
    _updateUI(searchTerm !== '');
    
    if (saveToHistory && searchTerm) {
      _addToHistory(query);
    }
    
    const netflixCount = _searchInNetflixRows(searchTerm);
    _updateFeedback(netflixCount, query);
  }
  
  function _clear() {
    if (_state.searchInput) {
      _state.searchInput.value = '';
      _performSearch('');
      _hideHistory();
    }
  }
  
  // --- WAIT FOR HEADER ---
  function _waitForHeader() {
    return new Promise((resolve) => {
      if (document.querySelector(SELECTORS.INPUT)) {
        resolve();
        return;
      }
      
      const observer = new MutationObserver(() => {
        if (document.querySelector(SELECTORS.INPUT)) {
          observer.disconnect();
          resolve();
        }
      });
      
      observer.observe(document.body, { childList: true, subtree: true });
      setTimeout(() => { observer.disconnect(); resolve(); }, 3000);
    });
  }
  
  // --- API PÚBLICA ---
  return {
    init() {
      if (_state.initialized) return;
      
      _state.searchInput = document.querySelector(SELECTORS.INPUT);
      _state.feedbackElement = document.querySelector(SELECTORS.FEEDBACK);
      
      if (!_state.searchInput) {
        _waitForHeader().then(() => {
          _state.searchInput = document.querySelector(SELECTORS.INPUT);
          _state.feedbackElement = document.querySelector(SELECTORS.FEEDBACK);
          
          if (_state.searchInput) {
            _bindEvents();
            _initializeCards();
            _state.initialized = true;
            _emit('buscador:init');
          }
        });
        return;
      }
      
      _bindEvents();
      _initializeCards();
      _state.initialized = true;
      _emit('buscador:init');
    },
    
    search(query) {
      if (_state.searchInput) {
        _state.searchInput.value = query;
        _performSearch(query, true);
      }
    },
    
    clear() {
      _clear();
      _hideHistory();
    },
    
    getQuery() {
      return _state.searchInput?.value || '';
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
  window.Buscador = Buscador;
  window.initBuscador = () => Buscador.init();
  window.searchTools = (query) => {
    if (query !== undefined) {
      Buscador.search(query);
    } else {
      Buscador.search(Buscador.getQuery());
    }
  };
}

// Exportar si ESM
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Buscador;
}