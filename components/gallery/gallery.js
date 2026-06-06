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
   * Cierra el lightbox
   */
  function close() {
    const lightbox = document.getElementById(LIGHTBOX_ID);
    if (lightbox) {
      lightbox.classList.remove('active');
      _state.isOpen = false;
    }
    const closeBtn = document.getElementById('gallery-close-fixed');
    if (closeBtn) closeBtn.style.display = 'none';
    document.body.style.overflow = '';
    document.body.classList.remove('gallery-open');
  }
  
  /**
   * Crea el HTML del lightbox
   * @returns {string} HTML del lightbox
   */
    function _createLightboxHTML() {
      return `<div id="${LIGHTBOX_ID}" class="gallery-lightbox" role="dialog" aria-modal="true" aria-label="Galería de imágenes">
        <div class="gallery-container">
          <!-- Panel izquierdo: Especificaciones -->
          <div class="gallery-specs-left" id="${SPECS_PANEL_ID}-left">
            <div class="gallery-specs-content" id="specs-especificaciones"></div>
          </div>

          <!-- Contenido central: Imagen y miniaturas -->
          <div class="gallery-content-wrapper">
            <div class="gallery-main-image-container">
              <img id="${MAIN_IMAGE_ID}" class="gallery-main-image" src="" alt="">
            </div>
            <div class="gallery-thumbnails" id="${THUMBS_ID}"></div>
          </div>

          <!-- Panel derecho: Normas -->
          <div class="gallery-specs-right" id="${SPECS_PANEL_ID}-right">
            <div class="gallery-specs-content" id="specs-normas"></div>
          </div>
        </div>

        <div class="gallery-info">
          <h3 id="${TITLE_ID}"></h3>
          <a id="${COTIZAR_ID}" class="gallery-cotizar" href="#" target="_blank" rel="noopener">
            <i class="bi bi-whatsapp"></i> Cotizar por WhatsApp
          </a>
        </div>
      </div>

      <!-- Botón de cierre: se inserta como hermano del lightbox, no dentro -->
      <button type="button" id="gallery-close-fixed" class="gallery-close-fixed" aria-label="Cerrar" onclick="return false">&times;</button>`;
    }
  
   /**
    * Inicializa el lightbox en el DOM
    */
     function _init() {
      console.log('Gallery._init() called, document.body exists?', !!document.body);

      if (_state.initialized) {
        console.log('Gallery ya inicializado, saltando');
        return;
      }

      // Si no hay body, esperar un poco y reintentar
      if (!document.body) {
        console.log('Gallery: document.body no disponible, reintentando en 100ms...');
        setTimeout(_init, 100);
        return;
      }

      console.log('Insertando lightbox HTML en body...');
      document.body.insertAdjacentHTML('beforeend', _createLightboxHTML());

      const lightbox = document.getElementById(LIGHTBOX_ID);
      console.log('Lightbox element creado:', lightbox);

      if (!lightbox) {
        console.error('Gallery: No se pudo crear el lightbox element');
        return;
      }

      // Botón de cierre fijo (hermano del lightbox, no dentro)
      const closeBtn = document.getElementById('gallery-close-fixed');
      console.log('Botón close fijo encontrado:', closeBtn);
      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('Gallery: close button clickeado (fixed)');
          close();
        });
      }

      // Cerrar al hacer clic fuera del contenido (overlay del lightbox)
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
          console.log('Gallery: close por click en overlay');
          close();
        }
      });

      // Teclado
      document.addEventListener('keydown', _handleKeydown);

      _state.initialized = true;
      console.log('Gallery inicializado correctamente');
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
   * Construye el HTML para las especificaciones
   */
  function _buildEspecificacionesHTML(specs) {
    let html = `<h4 class="gallery-specs-title">${specs.titulo}</h4>`;
    html += '<div class="gallery-specs-description">';
    if (specs.descripcion) {
      html += `<p>${specs.descripcion}</p>`;
    }
    html += '</div>';
    
    html += '<div class="gallery-specs-datos">';
    for (const [key, value] of Object.entries(specs.datos || {})) {
      html += `<div class="gallery-spec-row">
        <span class="gallery-spec-label">${key}</span>
        <span class="gallery-spec-value">${value}</span>
      </div>`;
    }
    html += '</div>';
    
    // Separar caracteristicas por líneas si vienen como string
    if (specs.caracteristicas) {
      const items = specs.caracteristicas.split('\n').filter(l => l.trim());
      if (items.length > 0) {
        html += '<div class="gallery-specs-caracteristicas">';
        html += '<h5>Características Técnicas</h5>';
        html += '<ul>';
        items.forEach(item => {
          html += `<li>${item.trim()}</li>`;
        });
        html += '</ul>';
        html += '</div>';
      }
    }
    
    return html;
  }
  
  /**
   * Construye el HTML para las normas
   */
  function _buildNormasHTML(specs) {
    let html = '<h4 class="gallery-specs-title">Normas de Alquiler</h4>';
    if (specs.normas && typeof specs.normas === 'string' && specs.normas.trim()) {
      const lines = specs.normas.split('\n').map(l => l.trim()).filter(l => l);
      html += '<div class="gallery-specs-normas"><ul>';
      lines.forEach((line) => {
        let text = line.replace(/^••?\\s*/, '');
        if (line.includes('1.') || line.includes('Identificarse')) {
          text = text.replace(/(\\d+\\.)/, '<strong>$1</strong>');
          text = text.replace(/(persona natural o juridica)/i, '<strong>$1</strong>');
        } else if (line.includes('2.') || line.includes('anticipación')) {
          text = text.replace(/(anticipación)/i, '<strong>$1</strong>');
        }
        html += `<li>${text}</li>`;
      });
      html += '</ul></div>';
    } else {
      html += '<div class="gallery-specs-normas"><p>Información no disponible</p></div>';
    }
    return html;
  }
  
  /**
   * Construye HTML de los paneles
   */
  function _buildSpecsHTML(specs) {
    return {
      especificaciones: _buildEspecificacionesHTML(specs),
      normas: _buildNormasHTML(specs)
    };
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
    const mainImg = document.getElementById(MAIN_IMAGE_ID);
    if (mainImg) mainImg.src = _state.images[idx];
    
    document.querySelectorAll('.gallery-thumb').forEach((t, i) => {
      t.classList.toggle('active', i === idx);
    });
  }
  
  /**
   * Actualiza los paneles de especificaciones
   */
  function _updateSpecsPanel() {
    if (_state.specs) {
      const panelContents = _buildSpecsHTML(_state.specs);
      const leftContent = document.getElementById('specs-especificaciones');
      if (leftContent) {
        leftContent.innerHTML = panelContents.especificaciones;
        const leftPanel = leftContent.parentElement;
        if (leftPanel) leftPanel.style.display = 'table-cell';
      }
      const rightContent = document.getElementById('specs-normas');
      if (rightContent) {
        rightContent.innerHTML = panelContents.normas;
        const rightPanel = rightContent.parentElement;
        if (rightPanel) rightPanel.style.display = 'table-cell';
      }
    } else {
      const leftPanel = document.getElementById(SPECS_PANEL_ID + '-left');
      const rightPanel = document.getElementById(SPECS_PANEL_ID + '-right');
      if (leftPanel) leftPanel.style.display = 'none';
      if (rightPanel) rightPanel.style.display = 'none';
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
      if (!document.getElementById(LIGHTBOX_ID)) {
        _init();
      }
      
      const lightbox = document.getElementById(LIGHTBOX_ID);
      if (!lightbox) return;
      
      _state.images = imgs;
      _state.title = name;
      _state.waLink = wa;
      _state.specs = specsData || null;
      _state.currentIndex = 0;
      
      const mainImg = document.getElementById(MAIN_IMAGE_ID);
      const titleEl = document.getElementById(TITLE_ID);
      const cotizarEl = document.getElementById(COTIZAR_ID);
      
      if (!mainImg || !titleEl || !cotizarEl) return;
      
      mainImg.src = _state.images[0];
      titleEl.textContent = _state.title;
      cotizarEl.href = _state.waLink;
      
      _updateSpecsPanel();
      _renderThumbnails();
      
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
      document.body.classList.add('gallery-open');
      _state.isOpen = true;
      const closeBtn = document.getElementById('gallery-close-fixed');
      if (closeBtn) closeBtn.style.display = 'flex';
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
    isOpen: () => _state.isOpen,
    getCurrentIndex: () => _state.currentIndex
  };
})();

// Exponer globalmente para que otros módulos (loader.js) puedan usarlo
if (typeof window !== 'undefined') {
  window.Gallery = Gallery;
}

// Inicializar Gallery inmediatamente si el DOM ya está listo, o escuchar DOMContentLoaded
(function() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', Gallery.init);
  } else {
    Gallery.init();
  }
})();