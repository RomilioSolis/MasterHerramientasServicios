// ============================================
// DEBUG FILTER - Diagnosticar filtro de categorías
// ============================================
var DebugFilter = (function() {

  function checkNetflixRows() {
    var container = document.getElementById('netflixRows');
    console.log('%c=== DEBUG NETFLIX ROWS ===', 'color: blue; font-weight: bold');
    console.log('Container existe:', !!container);
    
    if (container) {
      var rows = container.querySelectorAll('.netflix-row');
      console.log('Total filas:', rows.length);
      
      rows.forEach(function(row, i) {
        var cat = row.dataset.category;
        var display = row.style.display;
        var computed = window.getComputedStyle(row).display;
        console.log(i + '. ' + cat + ' -> display inline: "' + display + '", computed: "' + computed + '"');
      });
    }
  }

  function testManualFilter(category) {
    console.log('%c=== MANUAL FILTER: ' + category + ' ===', 'color: orange');
    
    var container = document.getElementById('netflixRows');
    if (!container) {
      console.error('Container no encontrado');
      return;
    }
    
    var rows = container.querySelectorAll('.netflix-row');
    console.log('Procesando', rows.length, 'filas');
    
    rows.forEach(function(row) {
      var cat = row.dataset.category;
      var shouldShow = (category === 'all') || (cat === category);
      
      row.style.display = shouldShow ? '' : 'none';
      
      console.log(cat + ' -> display: ' + row.style.display + ' (shouldShow: ' + shouldShow + ')');
    });
  }

  return {
    checkNetflixRows: checkNetflixRows,
    testManualFilter: testManualFilter
  };
})();

if (typeof window !== 'undefined') {
  window.DebugFilter = DebugFilter;
}