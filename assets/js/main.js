// DarkMode ya está disponible globalmente desde dark-mode.js
// Usar el módulo ya cargado
if (window.DarkMode) {
  window.darkMode = window.DarkMode;
  window.DarkMode.init();
}

import { initBuscador, getBuscador } from './buscador-unificado.js';

import ChatWidget from './chat-widget.js';
ChatWidget.init();

// Componente Motosierra
import Motosierra from '../../components/herramientas/motosierra.js';
new Motosierra();

// Componente Equipos - maneja lógica de mostrar equipos
import Equipos from '../../components/herramientas/equipos.js';
Equipos.init();
console.log('Equipos loaded');

// Sistema de búsqueda desde URL
const handleUrlSearch = () => {
  const params = new URLSearchParams(window.location.search);
  const searchTerm = params.get('search');

  if (searchTerm) {
    // Inicializar buscador unificado
    initBuscador();
    
    // Esperar a que los equipos se carguen y luego buscar
    setTimeout(() => {
      const buscador = getBuscador();
      if (buscador) {
        buscador.search(searchTerm);
      }
    }, 1500);
  }
};

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', handleUrlSearch);
} else {
  handleUrlSearch();
}