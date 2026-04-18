/**
 * Debug Click - Copia y pega en la consola (F12) de index.html
 */

(function() {
  console.log('%c=== DEBUG CLICK ===', 'background: #c41e3a; color: white; padding: 5px;');
  
  // Encontrar primer artículo de elevación
  const article = document.querySelector('[data-category="elevacion"]');
  
  if (!article) {
    console.log('ERROR: No hay artículo');
    return;
  }
  
  console.log('Artículo encontrado:', article.querySelector('.card-title')?.textContent?.trim());
  
  // Aplicar display block
  article.style.display = 'block';
  article.classList.add('active');
  
  console.log('Display puesto:', article.style.display);
  
  // Verificar después de un momento
  setTimeout(() => {
    const display = window.getComputedStyle(article).display;
    console.log('Computed display:', display);
    console.log('¿Es visible?', display === 'block' ? 'SÍ' : 'NO');
    
    // Verificar dimensiones
    const rect = article.getBoundingClientRect();
    console.log('Dimensiones:', { width: rect.width, height: rect.height, top: rect.top });
    
    if (rect.width === 0 || rect.height === 0) {
      console.log('%cPROBLEMA: El elemento tiene tamaño 0!', 'color: red; font-weight: bold;');
    } else {
      console.log('%c✓ El elemento tiene tamaño', 'color: green');
    }
  }, 100);
})();