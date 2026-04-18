export default class DarkMode {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'light';
    this.init();
  }

  init() {
    document.body.dataset.theme = this.theme;
    this.applyGlobalStyles();
  }

  toggle() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    document.body.dataset.theme = this.theme;
    localStorage.setItem('theme', this.theme);
    
    setTimeout(() => {
      document.body.style.transition = '';
    }, 300);
  }

  applyGlobalStyles() {
    const style = document.createElement('style');
    style.id = 'dark-mode-styles';
    style.innerHTML = `
      body {
        transition: background-color 0.3s ease, color 0.3s ease !important;
      }
      [data-theme="light"] {
        --bg-primary: #ffffff;
        --bg-secondary: #f8f9fa;
        --text-primary: #212529;
        --text-secondary: #6c757d;
      }
      [data-theme="dark"] {
        --bg-primary: #1a1a1a;
        --bg-secondary: #2d2d2d;
        --text-primary: #f8f9fa;
        --text-secondary: #adb5bd;
        background-color: #1a1a1a !important;
        color: #f8f9fa !important;
      }
      [data-theme="dark"] a:not(.btn) {
        color: #4dabf7 !important;
      }
      [data-theme="dark"] .text-muted {
        color: #adb5bd !important;
      }
      [data-theme="dark"] .card {
        background-color: #2d2d2d !important;
        border-color: #404040 !important;
      }
      [data-theme="dark"] header, [data-theme="dark"] .navbar {
        background-color: #800020 !important;
      }
      [data-theme="dark"] .nav-link {
        color: #f8f9fa !important;
      }
      [data-theme="dark"] .logo-text {
        color: #ffffff !important;
      }
    `;
    if (!document.getElementById('dark-mode-styles')) {
      document.head.appendChild(style);
    }
  }
}