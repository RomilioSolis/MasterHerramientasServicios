// ============================================
// COMPONENT TESTER - Verifica componentes
// ============================================
var ComponentTester = (function() {

  var EXPECTED = [
    'footer-container',
    'faq-container',
    'contacto-container',
    'horario-card-container',
    'social-buttons-container',
    'chat-widget-container'  // Ahora también se carga
  ];

  var _results = [];

  function _checkFactory() {
    console.log('%c=== DEBUG FACTORY ===', 'color: blue; font-weight: bold');
    console.log('ComponentFactory existe:', typeof ComponentFactory !== 'undefined');
    if (typeof ComponentFactory !== 'undefined') {
      console.log('Registry:', ComponentFactory.getRegistry());
      console.log('isLoaded footer:', ComponentFactory.isLoaded('footer'));
    } else {
      console.log('%c⚠ ComponentFactory NO definido!', 'color: red');
    }
    console.log('%c=======================', 'color: blue');
  }

  function _runSingleTest(containerId) {
    var el = document.getElementById(containerId);
    var hasContent = el && el.innerHTML && el.innerHTML.trim().length > 0;
    
    var status = 'FAIL';
    if (hasContent) { status = 'OK'; }
    
    return {
      container: containerId,
      hasContent: hasContent,
      status: status,
      details: hasContent ? 'HTML cargado' : 'Sin contenido'
    };
  }

  function run() {
    _checkFactory();
    console.log('%c[ComponentTester] Verificando componentes...', 'color: orange');
    
    _results = [];
    EXPECTED.forEach(function(containerId) {
      var result = _runSingleTest(containerId);
      _results.push(result);
      
      var icon = result.status === 'OK' ? '✅' : '❌';
      console.log(icon + ' ' + containerId + ': ' + result.details);
    });
    
    var okCount = _results.filter(function(r) { return r.status === 'OK'; }).length;
    console.log('%c[ComponentTester] Resultado: ' + okCount + '/' + _results.length + ' componentes', 'color: ' + (okCount === _results.length ? 'green' : 'red'));
    
    return _results;
  }

  function manualLoad() {
    console.log('%c[ComponentTester] Cargando manualmente...', 'color: orange');
    if (typeof ComponentFactory !== 'undefined') {
      ComponentFactory.loadLazy(['footer', 'contacto', 'faq', 'horario', 'social-buttons']);
      setTimeout(run, 1000);
    } else {
      console.error('ComponentFactory no disponible');
    }
  }

  return {
    run: run,
    manualLoad: manualLoad
  };
})();

// Asignar a window
if (typeof window !== 'undefined') {
  window.ComponentTester = ComponentTester;
}

// Auto-ejecutar en load
if (document.readyState === 'complete') {
  setTimeout(ComponentTester.run, 1500);
} else {
  window.addEventListener('load', function() { setTimeout(ComponentTester.run, 1500); });
}