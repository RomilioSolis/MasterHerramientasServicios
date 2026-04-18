/**
 * Buscador Unificado - Componente de búsqueda dinámica
 * Maneja la búsqueda en ambos contenedores: #herramientas-container y #netflixRows
 */

class Buscador {
  constructor() {
    this.searchInput = null;
    this.feedbackElement = null;
    this.debounceTimer = null;
    this.DEBOUNCE_DELAY = 200;
    
    this.init();
  }

  /**
   * Inicializa el buscador
   */
  init() {
    // Escuchar el evento de equipos cargados
    this.listenForEquiposLoaded();
    
    // Esperar a que el header esté cargado
    this.waitForHeader().then(() => {
      this.searchInput = document.getElementById('toolSearch');
      this.feedbackElement = document.getElementById('searchFeedback');
      
      if (!this.searchInput) {
        console.warn('Buscador: Input #toolSearch no encontrado');
        return;
      }

      this.setupEventListeners();
      console.log('Buscador: Inicializado correctamente');
    });
  }

  /**
   * Espera a que el header esté cargado en el DOM
   */
  waitForHeader() {
    return new Promise((resolve) => {
      if (document.getElementById('toolSearch')) {
        resolve();
        return;
      }

      const observer = new MutationObserver((mutations, obs) => {
        if (document.getElementById('toolSearch')) {
          obs.disconnect();
          resolve();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      // Timeout de seguridad
      setTimeout(() => {
        observer.disconnect();
        resolve();
      }, 3000);
    });
  }

  /**
   * Configura los event listeners
   */
  setupEventListeners() {
    // Inicializar todas las cards como activas (por el CSS netflix-rows.css)
    this.initializeCards();

    // Búsqueda en tiempo real con debounce
    this.searchInput.addEventListener('input', (e) => {
      this.debounceSearch(e.target.value);
    });

    // Enter para buscar (comportamiento legacy)
    this.searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.performSearch(this.searchInput.value);
      }
    });

    // Escuchar cambios dinámicos en el contenido
    this.setupMutationObserver();
  }

  /**
   * Inicializa los Netflix items para que todos sean visibles por defecto
   */
  initializeCards() {
    const container = document.getElementById('netflixRows');
    if (!container) {
      console.warn('Buscador: #netflixRows no encontrado');
      return;
    }

    const items = container.querySelectorAll('.netflix-item');
    if (items.length === 0) {
      console.warn('Buscador: No hay Netflix items, reintentando...');
      setTimeout(() => this.initializeCards(), 500);
      return;
    }

    items.forEach(item => {
      item.style.display = '';
    });

    // Mostrar todos los rows también
    const rows = container.querySelectorAll('.netflix-row');
    rows.forEach(row => {
      row.style.display = '';
    });
    
    console.log(`Buscador: ${items.length} Netflix items inicializados`);
  }

  /**
   * Escuchar evento de equipos cargados
   */
  listenForEquiposLoaded() {
    document.addEventListener('equiposLoaded', () => {
      console.log('Buscador: Equipos cargados, inicializando...');
      setTimeout(() => this.initializeCards(), 300);
    });
  }

  /**
   * Búsqueda con debounce para evitar múltiples ejecuciones
   */
  debounceSearch(query) {
    clearTimeout(this.debounceTimer);
    
    this.debounceTimer = setTimeout(() => {
      this.performSearch(query);
    }, this.DEBOUNCE_DELAY);
  }

  /**
   * Ejecuta la búsqueda en los Netflix rows
   */
  performSearch(query) {
    const searchTerm = this.normalizeText(query);
    
    // Si el input fue removido del DOM, salir
    if (!this.searchInput) return;

    // Actualizar UI según la búsqueda
    this.updateUI(searchTerm !== '');
    
    // Añadir/quitar clase has-results al search-box para efecto visual
    const searchBox = document.querySelector('.search-box');
    if (searchBox) {
      searchBox.classList.toggle('has-results', searchTerm !== '');
    }

    // Buscar en los Netflix items del #netflixRows
    const netflixCount = this.searchInNetflixRows(searchTerm);
    
    // Actualizar feedback
    this.updateFeedback(netflixCount, query);

    console.log(`Buscador: "${query}" - ${netflixCount} resultados en Netflix rows`);
  }

  /**
   * Normaliza el texto para búsqueda (sin acentos, lowercase)
   */
  normalizeText(text) {
    if (!text) return '';
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  }

  /**
   * Busca en los Netflix items del #netflixRows
   */
  searchInNetflixRows(searchTerm) {
    const container = document.getElementById('netflixRows');
    if (!container) return 0;

    const rows = container.querySelectorAll('.netflix-row');
    let totalMatches = 0;

    rows.forEach(row => {
      const items = row.querySelectorAll('.netflix-item');
      let rowHasMatch = false;

      items.forEach(item => {
        const titleEl = item.querySelector('.netflix-item-title');
        if (!titleEl) return;

        const title = this.normalizeText(titleEl.textContent);
        
        // Si no hay término de búsqueda, mostrar todo
        if (!searchTerm) {
          item.style.display = '';
          rowHasMatch = true;
          totalMatches++;
          return;
        }

        // Buscar coincidencias en el título
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

  /**
   * Actualiza la UI según si hay búsqueda activa
   */
  updateUI(isSearching) {
    const nosotrosSection = document.getElementById('nosotros');
    const videoSection = document.querySelector('section.py-4');
    const equiposSection = document.getElementById('equipos');
    const searchBox = document.querySelector('.search-box');

    if (isSearching) {
      // Ocultar secciones no relevantes durante búsqueda
      if (nosotrosSection) nosotrosSection.style.display = 'none';
      if (videoSection) videoSection.style.display = 'none';
      
      // No hacer scroll automático aquí, dejar que el usuario vea los resultados
    } else {
      // Restaurar secciones cuando se limpia la búsqueda
      if (nosotrosSection) nosotrosSection.style.display = '';
      if (videoSection) videoSection.style.display = '';
      
      // Quitar clase has-results al limpiar búsqueda
      if (searchBox) searchBox.classList.remove('has-results');
    }
  }

  /**
   * Actualiza el feedback de resultados
   */
  updateFeedback(count, query) {
    if (!this.feedbackElement) return;

    if (!query || query.trim() === '') {
      this.feedbackElement.textContent = '';
      this.feedbackElement.classList.remove('has-results');
      return;
    }

    const resultText = count === 1 ? 'resultado encontrado' : 'resultados encontrados';
    this.feedbackElement.innerHTML = `<span class="results-count">${count}</span><span class="results-text">${resultText}</span>`;
    this.feedbackElement.classList.toggle('has-results', count > 0);
  }

  /**
   * Configura MutationObserver para detectar cambios dinámicos
   */
  setupMutationObserver() {
    // Observar cambios en netflixRows
    const netflixContainer = document.getElementById('netflixRows');
    if (netflixContainer) {
      const observer = new MutationObserver(() => {
        if (this.searchInput && this.searchInput.value.trim()) {
          this.performSearch(this.searchInput.value);
        }
      });

      observer.observe(netflixContainer, {
        childList: true,
        subtree: true
      });
    }
  }

  /**
   * Método público para ejecutar búsqueda programática
   */
  search(query) {
    if (this.searchInput) {
      this.searchInput.value = query;
      this.performSearch(query);
    }
  }

  /**
   * Método público para limpiar búsqueda
   */
  clear() {
    if (this.searchInput) {
      this.searchInput.value = '';
      this.performSearch('');
    }
  }
}

// Singleton para evitar múltiples instancias
let buscadorInstance = null;

/**
 * Inicializa el buscador (llamada principal)
 */
export function initBuscador() {
  if (!buscadorInstance) {
    buscadorInstance = new Buscador();
  }
  return buscadorInstance;
}

/**
 * Obtiene la instancia del buscador
 */
export function getBuscador() {
  return buscadorInstance;
}

/**
 * Búsqueda programática desde otros módulos
 * @param {string} [query] - Opcional: si no se proporciona, usa el valor del input
 */
export function searchTools(query) {
  if (buscadorInstance) {
    // Si no se proporciona query, usar el valor actual del input
    const searchTerm = query !== undefined ? query : (buscadorInstance.searchInput?.value || '');
    buscadorInstance.performSearch(searchTerm);
  } else {
    console.warn('Buscador: Instancia no inicializada aún');
  }
}

export default Buscador;
