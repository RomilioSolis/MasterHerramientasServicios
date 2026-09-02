// ============================================
// COMPONENT FACTORY - Factory Pattern para Carga de Componentes
// Soporta arrays de JS para dependencias
// ============================================
const ComponentFactory = (function() {

   // --- CONSTANTES ---
   var TIMING = Object.freeze({
     LAZY_DELAY: 300,
     CHECK_INTERVAL: 50
   });

    // --- REGISTRO DE COMPONENTES ---
    var COMPONENT_REGISTRY = Object.freeze({
      footer: {
        id: 'footer-container',
        container: 'footer-container',
        html: 'components/footer/footer.html',
        css: 'components/footer/footer.css',
        js: null
      },
      contacto: {
        id: 'contacto-container',
        container: 'contacto-container',
        html: 'components/contacto/contacto.html',
        css: 'components/contacto/contacto.css',
        js: 'components/contacto/contacto.js'
      },
      faq: {
        id: 'faq-container',
        container: 'faq-container',
        html: 'components/faq/faq.html',
        css: 'components/faq/faq.css',
        js: 'components/faq/faq.js'
      },
      nosotros: {
        id: 'nosotros-container',
        container: 'nosotros-container',
        html: 'components/nosotros/nosotros.html',
        css: 'components/nosotros/nosotros.css',
        js: 'components/nosotros/nosotros.js'
      },
      'social-buttons': {
        id: 'social-buttons-container',
        container: 'social-buttons-container',
        html: null,
        css: null,
        js: 'components/social-buttons/sb-init.js'
      },
      'chat-widget': {
        id: 'chat-widget-container',
        container: 'chat-widget-container',
        html: 'components/chat-widget/chat-widget.html',
        css: null,
        js: ['assets/js/chat-widget.js', 'components/chat-widget/chat-widget.js']
      }
    });

   // --- ESTADO ---
   var _state = {
     loaded: {},
     loading: {},
     initCalled: false
   };

   // --- FUNCIONES PRIVADAS ---
   function _emit(eventName, detail) {
     detail = detail || {};
     document.dispatchEvent(new CustomEvent(eventName, { detail: detail, bubbles: false }));
   }

   function _isLoaded(id) {
     return _state.loaded[id] === true;
   }

   function _isLoading(id) {
     return _state.loading[id] === true;
   }

   function _loadCSS(href) {
     if (!href || document.querySelector('link[href="' + href + '"]')) {
       return Promise.resolve();
     }
     return new Promise(function(resolve, reject) {
       var link = document.createElement('link');
       link.rel = 'stylesheet';
       link.href = href;
       link.onload = function() { resolve(); };
       link.onerror = function() { reject(new Error('Failed to load CSS: ' + href)); };
       document.head.appendChild(link);
     });
   }

   function _loadHTML(url) {
     return fetch(url).then(function(response) {
       if (!response.ok) {
         throw new Error('HTTP ' + response.status + ' loading ' + url);
       }
       return response.text();
     }).then(function(text) {
       return text;
     });
   }

   function _loadJS(src) {
     return new Promise(function(resolve, reject) {
       var script = document.createElement('script');
       script.src = src;
       script.defer = true;
       script.onload = function() { resolve(); };
       script.onerror = function() { reject(new Error('Failed to load JS: ' + src)); };
       document.body.appendChild(script);
     });
   }

   function _loadJSArray(scripts) {
     if (typeof scripts === 'string') {
       scripts = [scripts];
     }
     var promise = Promise.resolve();
     scripts.forEach(function(src) {
       promise = promise.then(function() { return _loadJS(src); });
     });
     return promise;
   }

   function _getContainer(config) {
     var containerId = config.container || config.id;
     var el = document.getElementById(containerId);
     return el;
   }

   // --- CARGA DE COMPONENTE ---
   function _loadComponent(config) {
     var id = config.id;

     if (_isLoaded(id)) {
       return Promise.resolve();
     }

     if (_isLoading(id)) {
       return new Promise(function(resolve) {
         var check = setInterval(function() {
           if (!_isLoading(id)) {
             clearInterval(check);
             resolve();
           }
         }, TIMING.CHECK_INTERVAL);
       });
     }

     _state.loading[id] = true;
     var container = _getContainer(config);

     if (config.css) {
       _loadCSS(config.css)['catch'](function(e) { console.error('[ComponentFactory] CSS error:', e.message); });
     }

     if (config.html) {
       if (!container) {
         _state.loading[id] = false;
         console.error('[ComponentFactory] Container no encontrado: #' + config.container);
         return Promise.reject(new Error('Container no encontrado: #' + config.container));
       }
       _loadHTML(config.html).then(function(html) {
         container.innerHTML = html;
         _state.loaded[id] = true;
         _state.loading[id] = false;
         _emit('component:loaded', { id: id, config: config });
       })['catch'](function(e) {
         _state.loading[id] = false;
         console.error('[ComponentFactory] HTML error:', e.message);
       });
     } else {
       _state.loaded[id] = true;
       _state.loading[id] = false;
       _emit('component:loaded', { id: id, config: config });
     }

     if (config.js) {
       _loadJSArray(config.js)['catch'](function(e) {
         console.error('[ComponentFactory] JS error:', e.message);
       });
     }

     return Promise.resolve();
   }

    // --- INICIALIZACIÓN ---
    function _init() {
      if (_state.initCalled) { return; }
      _state.initCalled = true;
      _emit('component-factory:init');
    }

   // --- API PÚBLICA ---
   return {
     init: _init,

     getConfig: function(id) {
       return COMPONENT_REGISTRY[id];
     },

     load: function(id) {
       var config = COMPONENT_REGISTRY[id];
       if (!config) {
         throw new Error('Unknown component: ' + id);
       }
       _loadComponent(config);
       return this;
     },

     loadAll: function(ids) {
       var keys = ids || Object.keys(COMPONENT_REGISTRY);
       var self = this;
       keys.forEach(function(id) {
         try {
           self.load(id);
         } catch(e) {
           console.error('[ComponentFactory] Error:', e.message);
         }
       });
       return this;
     },

     loadLazy: function(ids, delay) {
       var delay = delay || TIMING.LAZY_DELAY;
       var self = this;
       if ('requestIdleCallback' in window) {
         window.requestIdleCallback(function() {
           setTimeout(function() {
             self.loadAll(ids);
           }, delay);
         }, { timeout: 2000 });
       } else {
         setTimeout(function() {
           self.loadAll(ids);
         }, delay);
       }
       return this;
     },

     isLoaded: function(id) {
       return _isLoaded(id);
     },

     getRegistry: function() {
       return Object.keys(COMPONENT_REGISTRY);
     }
   };
 })();

// Auto-inicializar y asignar a window
(function() {
   if (document.readyState === 'loading') {
     document.addEventListener('DOMContentLoaded', function() { ComponentFactory.init(); });
   } else {
     ComponentFactory.init();
   }
   if (typeof window !== 'undefined') {
     window.ComponentFactory = ComponentFactory;
   }
 })();

if (typeof module !== 'undefined' && module.exports) {
   module.exports = ComponentFactory;
 }
