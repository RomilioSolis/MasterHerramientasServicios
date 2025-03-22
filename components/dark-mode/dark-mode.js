class DarkMode {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'light';
    this.init();
  }

  init() {
    document.body.dataset.theme = this.theme;
    this.applyGlobalStyles();
    this.addOverrideStyles();
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
    style.innerHTML = `
      body {
        transition: background-color 0.3s ease, color 0.3s ease !important;
      }
      [data-theme="dark"] a:not(.btn) {
        color: #4dabf7 !important;
      }
      [data-theme="dark"] .text-muted {
        color: #adb5bd !important;
      }
    `;
    document.head.appendChild(style);
  }

  addOverrideStyles() {
    const elements = document.querySelectorAll('[data-theme="dark"]');
    elements.forEach(el => {
      el.style.color = 'inherit';
    });
  }
}

const darkMode = new DarkMode();