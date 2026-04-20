// ============================================
// MÓDULO: Gallery
// Refactorizado con Module Pattern (IIFE + Revealing Module)
// Galería interactiva - Lightbox con Fichas Técnicas
// ============================================
const Gallery = (() => {
  
  // --- CONSTANTES PRIVADAS ---
  const LIGHTBOX_ID = 'gallery-lightbox';
  const MAIN_IMAGE_ID = 'gallery-main-image';
  const THUMBS_ID = 'gallery-thumbnails';
  const TITLE_ID = 'gallery-title';
  const COTIZAR_ID = 'gallery-cotizar';
  const SPECS_PANEL_ID = 'gallery-specs-panel';
  
  // --- ESTADO PRIVADO ---
  let _state = {
    images: [],
    currentIndex: 0,
    title: '',
    waLink: '',
    specs: null,
    initialized: false,
    isOpen: false
  };
  
  // --- FUNCIONES PRIVADAS ---
  
  /**
   * Crea el HTML del lightbox
   * @returns {string} HTML del lightbox
   */
  function _createLightboxHTML() {
    return `<div id="${LIGHTBOX_ID}" class="gallery-lightbox" role="dialog" aria-modal="true" aria-label="Galería de imágenes">
      <button class="gallery-close" data-gallery-action="close" aria-label="Cerrar">&times;</button>
      <button class="gallery-nav gallery-prev" data-gallery-action="prev" aria-label="Anterior">&#10094;</button>
      <div class="gallery-content-wrapper">
        <img id="${MAIN_IMAGE_ID}" class="gallery-main-image" src="" alt="">
        <div class="gallery-thumbnails" id="${THUMBS_ID}"></div>
      </div>
      <div class="gallery-specs-panel" id="${SPECS_PANEL_ID}"></div>
      <div class="gallery-info">
        <h3 id="${TITLE_ID}"></h3>
        <a id="${COTIZAR_ID}" class="gallery-cotizar" href="#" target="_blank" rel="noopener">
          <i class="bi bi-whatsapp"></i> Cotizar por WhatsApp
        </a>
      </div>
    </div>`;
  }
  
  /**
   * Inicializa el lightbox en el DOM
   */
  function _init() {
    if (_state.initialized) return;
    
    document.body.insertAdjacentHTML('beforeend', _createLightboxHTML());
    
    const lightbox = document.getElementById(LIGHTBOX_ID);
    
    // Cerrar al hacer clic fuera del contenido
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        close();
      }
    });
    
    // Botones de navegación
    lightbox.querySelectorAll('[data-gallery-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.dataset.galleryAction;
        if (action === 'close') close();
        else if (action === 'prev') prev();
        else if (action === 'next') next();
      });
    });
    
    // Teclado
    document.addEventListener('keydown', _handleKeydown);
    
    _state.initialized = true;
  }
  
  /**
   * Maneja eventos de teclado
   * @param {KeyboardEvent} e 
   */
  function _handleKeydown(e) {
    const lightbox = document.getElementById(LIGHTBOX_ID);
    if (!lightbox || !lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  }
  
  /**
   * Genera el HTML de las especificaciones
   * @param {Object} specs - Datos de especificaciones
   * @returns {string} HTML de especificaciones
   */
  function _buildSpecsHTML(specs) {
    let html = `<h4 class="gallery-specs-title">${specs.titulo}</h4>`;
    html += '<div class="gallery-specs-content">';
    
    for (const key in specs.datos) {
      html += `<div class="gallery-spec-row">
        <span class="gallery-spec-label">${key}:</span>
        <span class="gallery-spec-value">${specs.datos[key]}</span>
      </div>`;
    }
    html += '</div>';
    
    if (specs.caracteristicas) {
      html += '<div class="gallery-specs-caracteristicas"><h5>Características Principales</h5><ul>';
      html += specs.caracteristicas.split('\n').map(c => `<li>${c.trim()}</li>`).join('');
      html += '</ul></div>';
    }
    
    if (specs.accesorios) {
      html += '<div class="gallery-specs-accesorios"><h5>Accesorios Incluidos</h5><ul>';
      html += specs.accesorios.split('\n').map(a => `<li>${a.trim()}</li>`).join('');
      html += '</ul></div>';
    }
    
    return html;
  }
  
  /**
   * Renderiza las miniaturas
   */
  function _renderThumbnails() {
    const thumbsContainer = document.getElementById(THUMBS_ID);
    thumbsContainer.innerHTML = '';
    
    _state.images.forEach((img, idx) => {
      const thumb = document.createElement('img');
      thumb.src = img;
      thumb.className = 'gallery-thumb' + (idx === 0 ? ' active' : '');
      thumb.addEventListener('click', () => showImage(idx));
      thumb.alt = `${_state.title} imagen ${idx + 1}`;
      thumbsContainer.appendChild(thumb);
    });
  }
  
  /**
   * Muestra una imagen por índice
   * @param {number} idx - Índice de la imagen
   */
  function _showImage(idx) {
    _state.currentIndex = idx;
    document.getElementById(MAIN_IMAGE_ID).src = _state.images[idx];
    
    document.querySelectorAll('.gallery-thumb').forEach((t, i) => {
      t.classList.toggle('active', i === idx);
    });
  }
  
  /**
   * Actualiza el panel de especificaciones
   */
  function _updateSpecsPanel() {
    const specsPanel = document.getElementById(SPECS_PANEL_ID);
    
    if (_state.specs) {
      specsPanel.innerHTML = _buildSpecsHTML(_state.specs);
      specsPanel.classList.add('has-specs');
    } else {
      specsPanel.innerHTML = '';
      specsPanel.classList.remove('has-specs');
    }
  }
  
  /**
   * Abre el lightbox con las imágenes dadas
   * @param {string[]} imgs - Array de URLs de imágenes
   * @param {string} name - Título de la galería
   * @param {string} wa - Link de WhatsApp para cotizar
   * @param {Object} specsData - Datos de especificaciones técnicas
   */
  function open(imgs, name, wa, specsData) {
    if (!document.getElementById(LIGHTBOX_ID)) _init();
    
    _state.images = imgs;
    _state.title = name;
    _state.waLink = wa;
    _state.specs = specsData || null;
    _state.currentIndex = 0;
    
    const mainImg = document.getElementById(MAIN_IMAGE_ID);
    const titleEl = document.getElementById(TITLE_ID);
    const cotizarEl = document.getElementById(COTIZAR_ID);
    
    mainImg.src = _state.images[0];
    titleEl.textContent = _state.title;
    cotizarEl.href = _state.waLink;
    
    _updateSpecsPanel();
    _renderThumbnails();
    
    const lightbox = document.getElementById(LIGHTBOX_ID);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    _state.isOpen = true;
  }
  
  /**
   * Muestra la imagen anterior
   */
  function prev() {
    _state.currentIndex = _state.currentIndex > 0 
      ? _state.currentIndex - 1 
      : _state.images.length - 1;
    _showImage(_state.currentIndex);
  }
  
  /**
   * Muestra la siguiente imagen
   */
  function next() {
    _state.currentIndex = _state.currentIndex < _state.images.length - 1 
      ? _state.currentIndex + 1 
      : 0;
    _showImage(_state.currentIndex);
  }
  
  /**
   * Cierra el lightbox
   */
  function close() {
    const lightbox = document.getElementById(LIGHTBOX_ID);
    if (lightbox) {
      lightbox.classList.remove('active');
    }
    document.body.style.overflow = '';
    _state.isOpen = false;
  }
  
  /**
   * Muestra una imagen específica (público para compatibilidad)
   * @param {number} idx - Índice de la imagen
   */
  function showImage(idx) {
    _showImage(idx);
  }
  
  // --- API PÚBLICA (REVEALING MODULE) ---
  return {
    init: _init,
    open: open,
    prev: prev,
    next: next,
    close: close,
    showImage: showImage,
    
    /**
     * Verifica si el lightbox está abierto
     * @returns {boolean}
     */
    isOpen: () => _state.isOpen,
    
    /**
     * Retorna el índice de la imagen actual
     * @returns {number}
     */
    getCurrentIndex: () => _state.currentIndex
  };
})();

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  Gallery.init();
});