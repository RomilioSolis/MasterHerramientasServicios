// ============================================
// CATEGORY TESTER - Prueba filtros de categorías
// ============================================
var CategoryTester = (function() {

  function run() {
    console.log('%c=== CATEGORY TESTER ===', 'color: blue; font-weight: bold');
    
    // Verificar CategoryFilter
    console.log('CategoryFilter existe:', typeof CategoryFilter !== 'undefined');
    
    // Verificar handleCategoryClick
    console.log('handleCategoryClick existe:', typeof window.handleCategoryClick === 'function');
    
    // Verificar netflixRows
    var netflixRows = document.getElementById('netflixRows');
    console.log('netflixRows existe:', !!netflixRows);
    
    if (netflixRows) {
      var rows = netflixRows.querySelectorAll('.netflix-row');
      console.log('Filas encontradas:', rows.length);
      
      rows.forEach(function(row) {
        var cat = row.dataset.category;
        var visible = row.style.display !== 'none';
        console.log('  - ' + cat + ': ' + (visible ? 'visible' : 'oculto'));
      });
    }
    
    // Verificar container de herramientas
    var herramientas = document.getElementById('herramientas-container');
    console.log('herramientas-container existe:', !!herramientas);
    
    var herramientas2 = document.getElementById('herramientas-container-2');
    console.log('herramientas-container-2 existe:', !!herramientas2);
  }

  function testFilter(category) {
    console.log('%cProbando filtro: ' + category, 'color: orange; font-weight: bold');
    
    if (typeof CategoryFilter !== 'undefined') {
      CategoryFilter.handleCategoryClick(category);
    } else if (typeof window.handleCategoryClick === 'function') {
      window.handleCategoryClick(category);
    } else {
      console.error('handleCategoryClick no disponible');
    }
    
    // Verificar resultado
    setTimeout(function() {
      var netflixRows = document.getElementById('netflixRows');
      if (netflixRows) {
        var rows = netflixRows.querySelectorAll('.netflix-row');
        console.log('Filas después de filtrar ' + category + ':');
        rows.forEach(function(row) {
          var cat = row.dataset.category;
          var visible = row.style.display !== 'none';
          console.log('  - ' + cat + ': ' + (visible ? 'visible' : 'oculto'));
        });
      }
    }, 100);
  }

  return {
    run: run,
    testFilter: testFilter
  };
})();

if (typeof window !== 'undefined') {
  window.CategoryTester = CategoryTester;
}