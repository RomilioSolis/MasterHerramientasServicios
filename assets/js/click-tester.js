// ============================================
// CLICK TESTER - Prueba clicks en botones
// ============================================
var ClickTester = (function() {

  function run() {
    console.log('%c=== CLICK TESTER ===', 'color: blue; font-weight: bold');
    
    // Verificar botones de categorías
    var categoryBtns = document.querySelectorAll('[data-category]');
    console.log('Botones con data-category:', categoryBtns.length);
    
    // Agregar listener para category:select
    document.addEventListener('category:select', function(e) {
      console.log('%cEVENTO RECIBIDO: category:select', 'color: green');
      console.log('category:', e.detail.category);
    });
    
    // Agregar listener para category:change
    document.addEventListener('category:change', function(e) {
      console.log('%cEVENTO RECIBIDO: category:change', 'color: green');
      console.log('category:', e.detail.category);
    });
    
    console.log('Listeners agregados. Ahora haz click en un botón de categoría.');
  }

  // Simular click en botón
  function clickCategory(category) {
    console.log('Simulando click en:', category);
    
    var btn = document.querySelector('[data-category="' + category + '"]');
    if (btn) {
      btn.click();
    } else {
      console.error('Botón no encontrado:', category);
    }
  }

  return {
    run: run,
    clickCategory: clickCategory
  };
})();

if (typeof window !== 'undefined') {
  window.ClickTester = ClickTester;
}

// Auto-ejecutar
setTimeout(ClickTester.run, 500);