// ============================================
// MÓDULO: MotosierraCarousel
// Refactorizado con Module Pattern (IIFE + Revealing Module)
// Carrusel de imágenes para la sección de motosierra
// ============================================
const MotosierraCarousel = (() => {
  
  // --- CONSTANTES PRIVADAS ---
  const _CAROUSEL_ID = 'carouselMotosierra';
  
  // --- ESTADO PRIVADO ---
  let _state = {
    initialized: false
  };
  
  // --- FUNCIONES PRIVADAS ---
  
  /**
   * Configura lazy loading para imágenes del carrusel
   * @param {HTMLElement} carousel - Elemento del carrusel
   */
  function _setupLazyLoading(carousel) {
    const items = carousel.querySelectorAll('.carousel-item');
    
    items.forEach((item, index) => {
      if (index > 0) {
        const img = item.querySelector('img');
        if (img && img.dataset.src) {
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.disconnect();
              }
            });
          }, { rootMargin: '50px' });
          observer.observe(img);
        }
      }
    });
  }
  
  /**
   * Configura controles del carrusel
   * @param {HTMLElement} carousel - Elemento del carrusel
   */
  function _setupControls(carousel) {
    const prevBtn = carousel.querySelector('.carousel-control-prev');
    const nextBtn = carousel.querySelector('.carousel-control-next');
    const indicators = carousel.querySelectorAll('.carousel-indicators button');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => _slide(carousel, 'prev'));
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => _slide(carousel, 'next'));
    }
    
    indicators.forEach((btn, index) => {
      btn.addEventListener('click', () => _slideTo(carousel, index));
    });
  }
  
  /**
   * Transición de slide
   * @param {HTMLElement} carousel - Elemento del carrusel
   * @param {string} direction - 'prev' o 'next'
   */
  function _slide(carousel, direction) {
    const items = carousel.querySelectorAll('.carousel-item');
    const activeIndex = Array.from(items).findIndex(item => 
      item.classList.contains('active')
    );
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    } else {
      newIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    }
    
    _slideTo(carousel, newIndex);
  }
  
  /**
   * Transición a slide específico
   * @param {HTMLElement} carousel - Elemento del carrusel
   * @param {number} newIndex - Índice del slide
   */
  function _slideTo(carousel, newIndex) {
    const items = carousel.querySelectorAll('.carousel-item');
    const indicators = carousel.querySelectorAll('.carousel-indicators button');
    
    items.forEach(item => item.classList.remove('active'));
    indicators.forEach(btn => btn.classList.remove('active'));
    
    items[newIndex].classList.add('active');
    if (indicators[newIndex]) {
      indicators[newIndex].classList.add('active');
    }
  }
  
  /**
   * Inicializa el carrusel
   */
  function _init() {
    const carousel = document.getElementById(_CAROUSEL_ID);
    if (!carousel) return;
    
    _setupLazyLoading(carousel);
    _setupControls(carousel);
    _state.initialized = true;
  }
  
  // --- API PÚBLICA (REVEALING MODULE) ---
  return {
    init: _init
  };
})();

// Inicialización automática
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => MotosierraCarousel.init());
} else {
  MotosierraCarousel.init();
}