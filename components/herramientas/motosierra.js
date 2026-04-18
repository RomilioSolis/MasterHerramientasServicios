class Motosierra {
  constructor() {
    this.id = 'carouselMotosierra';
    this.init();
  }

  init() {
    const carousel = document.getElementById(this.id);
    if (!carousel) return;

    this.setupLazyLoading(carousel);
    this.setupControls(carousel);
  }

  setupLazyLoading(carousel) {
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

  setupControls(carousel) {
    const prevBtn = carousel.querySelector('.carousel-control-prev');
    const nextBtn = carousel.querySelector('.carousel-control-next');
    const indicators = carousel.querySelectorAll('.carousel-indicators button');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.slide(carousel, 'prev'));
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.slide(carousel, 'next'));
    }
    indicators.forEach((btn, index) => {
      btn.addEventListener('click', () => this.slideTo(carousel, index));
    });
  }

  slide(carousel, direction) {
    const items = carousel.querySelectorAll('.carousel-item');
    const activeIndex = Array.from(items).findIndex(item => item.classList.contains('active'));
    let newIndex;

    if (direction === 'prev') {
      newIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    } else {
      newIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    }

    this.slideTo(carousel, newIndex);
  }

  slideTo(carousel, newIndex) {
    const items = carousel.querySelectorAll('.carousel-item');
    const indicators = carousel.querySelectorAll('.carousel-indicators button');

    items.forEach(item => item.classList.remove('active'));
    indicators.forEach(btn => btn.classList.remove('active'));

    items[newIndex].classList.add('active');
    if (indicators[newIndex]) {
      indicators[newIndex].classList.add('active');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Motosierra();
});

export default Motosierra;