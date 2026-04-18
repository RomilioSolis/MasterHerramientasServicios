/**
 * Social Buttons - Auto-inicializador
 * Se ejecuta automáticamente al cargarse sin necesidad de módulos ES6
 */

(function() {
    'use strict';
    
    console.log('SocialButtons: inicializando...');
    
    var container = document.getElementById('social-buttons-container');
    if (!container) {
        console.error('SocialButtons: contenedor no encontrado');
        return;
    }
    
    // HTML mínimo
    container.innerHTML = 
        '<a href="https://www.facebook.com/masters.herramientas/" class="sb-btn sb-fb" target="_blank" aria-label="Facebook">' +
        '<svg viewBox="0 0 24 24" width="22"><path fill="#fff" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>' +
        '<a href="https://www.instagram.com/masterenherramientasyservisios/" class="sb-btn sb-ig" target="_blank" aria-label="Instagram">' +
        '<svg viewBox="0 0 24 24" width="22"><path fill="#fff" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></a>' +
        '<a href="https://wa.me/573165345675" class="sb-btn sb-wa" target="_blank" aria-label="WhatsApp">' +
        '<svg viewBox="0 0 24 24" width="22"><path fill="#fff" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>';
    
    console.log('SocialButtons: HTML inyectado');
    
    // CSS embebido
    var style = document.createElement('style');
    style.id = 'sb-styles';
    style.textContent = 
        '#social-buttons-container{position:fixed;right:20px;top:50%;transform:translateY(-50%);z-index:10001;display:flex;flex-direction:column;gap:10px}' +
        '.sb-btn{display:flex;width:48px;height:48px;border-radius:50%;align-items:center;justify-content:center;transition:all .3s;color:#fff;text-decoration:none;box-shadow:0 2px 5px rgba(0,0,0,.2)}' +
        '.sb-btn:hover{transform:scale(1.1);box-shadow:0 4px 8px rgba(0,0,0,.3)}' +
        '.sb-fb{background:#1877f2}' +
        '.sb-ig{background:linear-gradient(45deg,#405de6,#5851db,#833ab4,#c13584,#e1306c,#fd1d1d)}' +
        '.sb-wa{background:#25d366}';
    document.head.appendChild(style);
    console.log('SocialButtons: estilos aplicados');
    
    // Cargar BackToTop
    var btHtml = '<button id="app-back-to-top" style="display:none;position:fixed;bottom:20px;right:20px;z-index:9999;width:50px;height:50px;border-radius:50%;background:#800020;color:#fff;border:none;cursor:pointer;box-shadow:0 4px 15px rgba(196,30,58,0.4);display:flex;align-items:center;justify-content:center;" aria-label="Volver arriba" title="Volver arriba">' +
        '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg></button>';
    document.body.insertAdjacentHTML('beforeend', btHtml);
    
    var btStyle = document.createElement('style');
    btStyle.textContent = '#app-back-to-top{display:none;position:fixed;bottom:20px;right:20px;z-index:9999;width:50px;height:50px;border-radius:50%;background:#800020;color:#fff;border:none;cursor:pointer;box-shadow:0 4px 15px rgba(196,30,58,0.4);display:flex;align-items:center;justify-content:center}#app-back-to-top svg{width:28px;height:28px}#app-back-to-top:hover{transform:scale(1.1);background:#a00028}';
    document.head.appendChild(btStyle);
    
    var btBtn = document.getElementById('app-back-to-top');
    btBtn.onclick = function() { window.scrollTo({ top: 0, behavior: 'smooth' }); };
    window.addEventListener('scroll', function() {
        btBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
    }, { passive: true });
    
    console.log('BackToTop: inicializado');
})();