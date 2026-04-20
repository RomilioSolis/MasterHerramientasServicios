// ============================================
// UI TESTER - Prueba funcionalidad de botones
// Sigue reglas: Module Pattern, troubleshooting guidelines
// ============================================
var UITester = (function() {

  // --- ELEMENTOS A TESTEAR ---
  var BUTTON_TESTS = [
    // Header y navegación
    { id: 'header', name: 'Header', check: function() {
      var el = document.querySelector('.modern-header, #header-app');
      return el ? '存在' : null;
    }},
    { id: 'equipos-dropdown', name: 'Dropdown Equipos', check: function() {
      var dropdown = document.getElementById('equiposDropdownMenu');
      return dropdown ? '存在' : null;
    }},
    // Categorías
    { id: 'category-buttons', name: 'Botones de Categorías', check: function() {
      var btns = document.querySelectorAll('.category-btn, [data-category]');
      return btns.length > 0 ? btns.length + ' botones' : null;
    }},
    { id: 'category-filter', name: 'Category Filter', check: function() {
      return typeof window.handleCategoryClick === 'function' ? '存在' : null;
    }},
    // Dark mode
    { id: 'dark-mode', name: 'Botón Dark Mode', check: function() {
      var btn = document.querySelector('[data-theme], #dark-mode-btn, .dark-mode-toggle');
      return btn ? '存在' : null;
    }},
    // Back to top
    { id: 'back-to-top', name: 'Botón Back to Top', check: function() {
      var btn = document.getElementById('app-back-to-top');
      return btn ? '存在' : null;
    }},
    // Redes sociales
    { id: 'social-facebook', name: 'Botón Facebook', check: function() {
      var btn = document.querySelector('.sb-fb, a[href*="facebook"]');
      return btn ? '存在' : null;
    }},
    { id: 'social-instagram', name: 'Botón Instagram', check: function() {
      var btn = document.querySelector('.sb-ig, a[href*="instagram"]');
      return btn ? '存在' : null;
    }},
    { id: 'social-whatsapp', name: 'Botón WhatsApp', check: function() {
      var btn = document.querySelector('.sb-wa, a[href*="wa.me"]');
      return btn ? '存在' : null;
    }},
    // Chat widget
{ id: 'chat-widget', name: 'Chat Widget', check: function() {
      var widget = document.querySelector('#cw-fab, .chat-widget, [data-chat]');
      return widget ? '存在' : null;
    }},
    { id: 'faq-accordion', name: 'FAQ Accordion', check: function() {
      var faqs = document.querySelectorAll('.faq-item, .accordion-item, .faq-category');
      return faqs.length > 0 ? faqs.length + ' items' : null;
    }},
    // Gallery
    { id: 'gallery', name: 'Gallery', check: function() {
      return typeof Gallery === 'object' ? '存在' : null;
    }},
    // Footer
    { id: 'footer-links', name: 'Links Footer', check: function() {
      var links = document.querySelectorAll('#footer-container a');
      return links.length > 0 ? links.length + ' links' : null;
    }}
  ];

  // --- FUNCIÓN PRINCIPAL ---
  function run() {
    console.log('%c=== UI TESTER ===', 'color: blue; font-weight: bold');
    
    var results = [];
    BUTTON_TESTS.forEach(function(test) {
      var result = test.check();
      var status = result ? '✅' : '❌';
      console.log(status + ' ' + test.name + ': ' + (result || 'NO encontrado'));
      results.push({ name: test.name, result: result });
    });
    
    var okCount = results.filter(function(r) { return r.result; }).length;
    console.log('%cResultado: ' + okCount + '/' + results.length + ' elementos', 'color: ' + (okCount === results.length ? 'green' : 'red'));
    
    return results;
  }

  // --- PROBAR CLICK ---
  function testClick(selector) {
    var el = document.querySelector(selector);
    if (!el) {
      console.error('Botón no encontrado: ' + selector);
      return false;
    }
    console.log('Probando click en: ' + selector);
    el.click();
    return true;
  }

  // --- API PÚBLICA (REVEALING MODULE) ---
  return {
    run: run,
    testClick: testClick
  };
})();

// Asignar a window
if (typeof window !== 'undefined') {
  window.UITester = UITester;
}