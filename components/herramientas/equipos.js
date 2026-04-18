/**
 * Componente Equipos - Maneja la lógica de mostrar equipos por categoría
 * Módulo para reducir código en index.html
 */

const EquipmentData = {
  mapping: {
    'elevacion': ['Gatos Hidráulicos', 'Gato Estibador', 'Ganchos Colgantes', 'Winches', 'Pluma Grúa'],
    'perforacion': ['Taladros', 'Extractores', 'Sonda Eléctrica', 'Esmeriladora', 'Equipo Oxicorte', 'Cortadora Porcelanato', 'Extracción Núcleos'],
    'mezclado': ['Trompo Mezclador', 'Vibrocompactadora'],
    'limpieza': ['Hidrolavadora', 'Aspiradora Industrial', 'Motobomba Sumergible'],
    'soldadura': ['Compresor', 'Equipos de Soldadura', 'Planta Eléctrica'],
    'construccion': ['Andamios', 'Estanterías', 'Parasoles'],
    'movimiento': ['Diferenciales', 'Carretillas', 'Buggy con Pico y Pala'],
    'jardin': ['Escaleras', 'Motosierras']
  },

  categoryNames: {
    'elevacion': 'Elevación y Levante',
    'perforacion': 'Perforación y Corte',
    'mezclado': 'Mezclado y Compactación',
    'limpieza': 'Limpieza e Hidráulica',
    'soldadura': 'Soldadura y Energía',
    'construccion': 'Construcción y Estructura',
    'movimiento': 'Accesorios de Movimiento',
    'jardin': 'Jardín y Forestal'
  },

  getContainers() {
    return document.querySelectorAll('#herramientas-container article, #herramientas-container-2 article');
  },

  getArticlesByCategory(category) {
    const articles = this.getContainers();
    const filtered = [];
    let index = 0;
    
    articles.forEach(article => {
      const cat = article.getAttribute('data-category');
      if (cat === category) {
        filtered.push({ article, index: index++ });
      }
    });
    
    return filtered;
  },

  showEquipment(category, equipmentIndex) {
    const articles = this.getContainers();
    const equipmentName = this.mapping[category]?.[equipmentIndex];

    if (!equipmentName) {
      console.error('Equipo no encontrado:', category, equipmentIndex);
      return false;
    }

    // Ocultar todos
    articles.forEach(article => {
      article.classList.add('hidden-by-search');
      article.style.display = 'none';
    });

    // Encontrar el equipo objetivo
    let foundIndex = 0;
    let targetArticle = null;

    articles.forEach(article => {
      const articleCategory = article.getAttribute('data-category');
      if (articleCategory === category) {
        if (foundIndex === equipmentIndex) {
          targetArticle = article;
        }
        foundIndex++;
      }
    });

    if (targetArticle) {
      targetArticle.classList.remove('hidden-by-search');
      targetArticle.style.display = 'block';
      console.log('Display puesto a block para:', targetArticle.querySelector('.card-title')?.textContent);

      // Scroll AL ELEMENTO directamente
      setTimeout(() => {
        targetArticle.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

      // Mostrar botón back
      const backBtn = document.getElementById('back-to-netflix');
      if (backBtn) backBtn.style.display = 'block';

      // Ocultar Netflix rows
      const netflixRows = document.getElementById('netflixRows');
      if (netflixRows) netflixRows.style.display = 'none';

      return true;
    }

    console.error('Target article no encontrado:', category, equipmentIndex, 'encontrados:', foundIndex);
    return false;
  },

  hideAll() {
    const articles = this.getContainers();
    articles.forEach(article => {
      article.style.display = '';
      article.classList.remove('hidden-by-search');
    });

    const netflixRows = document.getElementById('netflixRows');
    if (netflixRows) netflixRows.style.display = 'block';

    const backBtn = document.getElementById('back-to-netflix');
    if (backBtn) backBtn.style.display = 'none';
  },

  filterByCategory(category) {
    const articles = this.getContainers();

    // Reset all articles visibility from search
    articles.forEach(article => {
      article.classList.remove('hidden-by-search');
      article.style.display = '';
    });

    const netflixRows = document.getElementById('netflixRows');
    if (netflixRows) netflixRows.style.display = 'block';

    const backBtn = document.getElementById('back-to-netflix');
    if (backBtn) backBtn.style.display = 'block';

    const equiposSection = document.getElementById('equipos');
    if (equiposSection) equiposSection.scrollIntoView({ behavior: 'smooth' });
  },

  init() {
    // No ocultar al inicio - dejar que el buscador maneje la visibilidad
    // Solo registrar para debugging
    const articles = this.getContainers();
    console.log('Equipos init - artículos:', articles.length);
  }
};

// Funciones globales para onclick
// Asegurar que estén disponibles globalmente
function setupGlobalFunctions() {
  window.showEquipmentDetail = function(event, category, equipmentIndex) {
    console.log('showEquipmentDetail called:', category, equipmentIndex);
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    return EquipmentData.showEquipment(category, equipmentIndex);
  };

  window.backToNetflix = function() {
    return EquipmentData.hideAll();
  };

  window.filterCategory = function(category) {
    return EquipmentData.filterByCategory(category);
  };
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupGlobalFunctions);
} else {
  setupGlobalFunctions();
}

export default EquipmentData;