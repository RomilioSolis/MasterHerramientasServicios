const BACK_TO_TOP_HTML = `
<button id="app-back-to-top" style="display:none;position:fixed;bottom:20px;right:20px;z-index:9999;width:50px;height:50px;border-radius:50%;background:#800020;color:white;border:none;cursor:pointer;box-shadow:0 4px 15px rgba(196,30,58,0.4);" aria-label="Volver al inicio" title="Volver arriba">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>
</button>`;

function loadStyles() {
    if (document.getElementById('back-to-top-styles')) return;
    const link = document.createElement('link');
    link.id = 'back-to-top-styles';
    link.rel = 'stylesheet';
    link.href = '/components/back-to-top/back-to-top.css';
    document.head.appendChild(link);
}

function loadHTML() {
    if (document.getElementById('app-back-to-top')) return;
    document.body.insertAdjacentHTML('beforeend', BACK_TO_TOP_HTML);
}

function init() {
    const btn = document.getElementById('app-back-to-top');
    if (!btn) return;
    
    btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    
    window.addEventListener('scroll', () => {
        btn.style.display = window.scrollY > 300 ? 'flex' : 'none';
    }, { passive: true });
}

// Export completo que carga todo
export function init() {
    loadStyles();
    loadHTML();
    initBtn();
}

function initBtn() {
    var btn = document.getElementById('app-back-to-top');
    if (!btn) return;
    
    btn.onclick = function() { window.scrollTo({ top: 0, behavior: 'smooth' }); };
    
    window.addEventListener('scroll', function() {
        btn.style.display = window.scrollY > 300 ? 'flex' : 'none';
    }, { passive: true });
}

export default { init };