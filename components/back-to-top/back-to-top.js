// ============================================
// MÓDULO: BackToTop
// Botón de regreso al inicio - Module Pattern
// ============================================
const BackToTop = (() => {
  const _BTN_ID = 'app-back-to-top';

  function _loadHTML() {
    if (document.getElementById(_BTN_ID)) return;
    document.body.insertAdjacentHTML('beforeend', `
      <button id="${_BTN_ID}" aria-label="Volver al inicio" title="Volver arriba">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>
      </button>
    `);
  }

  function _initBtn() {
    const btn = document.getElementById(_BTN_ID);
    if (!btn) return;

    btn.onclick = function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('scroll', function() {
      btn.style.display = window.scrollY > 300 ? 'flex' : 'none';
    }, { passive: true });
  }

  function _init() {
    _loadHTML();
    _initBtn();
  }

  return { init: _init };
})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => BackToTop.init());
} else {
  BackToTop.init();
}
