(function() {
  var initialized = false;
  
  function init() {
    if (initialized) return;
    
    var questions = document.querySelectorAll('.faq-question');
    if (questions.length === 0) {
      setTimeout(init, 150);
      return;
    }

    questions.forEach(function(btn) {
      btn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        var ans = this.nextElementSibling;
        var open = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !open);
        this.classList.toggle('collapsed', open);
        ans.style.maxHeight = open ? '0' : ans.scrollHeight + 'px';
        ans.classList.toggle('show', !open);
      };
    });

    var links = document.querySelectorAll('.faq-nav-link');
    links.forEach(function(btn) {
      btn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        var id = this.getAttribute('data-target');
        var el = document.getElementById(id);
        
        if (el) {
          setTimeout(function() {
            var rect = el.getBoundingClientRect();
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            var targetY = rect.top + scrollTop - 80;
            window.scrollTo({ top: targetY, behavior: 'smooth' });
          }, 10);
        }
      };
    });
    
    initialized = true;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();