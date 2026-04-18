/* Galería interactiva - Lightbox */
var Gallery = (function() {
  var images = [];
  var currentIndex = 0;
  var title = '';
  var waLink = '';
  
  function init() {
    if (document.getElementById('gallery-lightbox')) return;
    
    var html = '<div id="gallery-lightbox" class="gallery-lightbox" role="dialog" aria-modal="true" aria-label="Galería de imágenes">' +
      '<button class="gallery-close" onclick="Gallery.close()" aria-label="Cerrar">&times;</button>' +
      '<button class="gallery-nav gallery-prev" onclick="Gallery.prev()" aria-label="Anterior">&#10094;</button>' +
      '<img id="gallery-main-image" class="gallery-main-image" src="" alt="">' +
      '<button class="gallery-nav gallery-next" onclick="Gallery.next()" aria-label="Siguiente">&#10095;</button>' +
      '<div class="gallery-thumbnails" id="gallery-thumbnails"></div>' +
      '<div class="gallery-info">' +
        '<h3 id="gallery-title"></h3>' +
        '<a id="gallery-cotizar" class="gallery-cotizar" href="#" target="_blank" rel="noopener">' +
          '<i class="bi bi-whatsapp"></i> Cotizar por WhatsApp' +
        '</a>' +
      '</div>' +
    '</div>';
    
    document.body.insertAdjacentHTML('beforeend', html);
    
    document.getElementById('gallery-lightbox').addEventListener('click', function(e) {
      if (e.target === this) Gallery.close();
    });
    
    document.addEventListener('keydown', function(e) {
      if (!document.getElementById('gallery-lightbox') || 
          !document.getElementById('gallery-lightbox').classList.contains('active')) return;
      if (e.key === 'Escape') Gallery.close();
      if (e.key === 'ArrowLeft') Gallery.prev();
      if (e.key === 'ArrowRight') Gallery.next();
    });
  }
  
  function open(imgs, name, wa) {
    if (!document.getElementById('gallery-lightbox')) init();
    
    images = imgs;
    title = name;
    waLink = wa;
    currentIndex = 0;
    
    var lightbox = document.getElementById('gallery-lightbox');
    var mainImg = document.getElementById('gallery-main-image');
    var thumbsContainer = document.getElementById('gallery-thumbnails');
    var titleEl = document.getElementById('gallery-title');
    var cotizarEl = document.getElementById('gallery-cotizar');
    
    mainImg.src = images[0];
    titleEl.textContent = title;
    cotizarEl.href = waLink;
    
    thumbsContainer.innerHTML = '';
    images.forEach(function(img, idx) {
      var thumb = document.createElement('img');
      thumb.src = img;
      thumb.className = 'gallery-thumb' + (idx === 0 ? ' active' : '');
      thumb.onclick = function() { showImage(idx); };
      thumb.alt = title + ' imagen ' + (idx + 1);
      thumbsContainer.appendChild(thumb);
    });
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  function showImage(idx) {
    currentIndex = idx;
    document.getElementById('gallery-main-image').src = images[idx];
    var thumbs = document.querySelectorAll('.gallery-thumb');
    thumbs.forEach(function(t, i) { 
      t.classList.toggle('active', i === idx); 
    });
  }
  
  function prev() {
    currentIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    showImage(currentIndex);
  }
  
  function next() {
    currentIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    showImage(currentIndex);
  }
  
  function close() {
    document.getElementById('gallery-lightbox').classList.remove('active');
    document.body.style.overflow = '';
  }
  
  return {
    init: init,
    open: open,
    prev: prev,
    next: next,
    close: close
  };
})();

document.addEventListener('DOMContentLoaded', function() {
  Gallery.init();
});