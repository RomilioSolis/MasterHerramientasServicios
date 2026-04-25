// ============================================
// MÓDULO: EquipmentData
// Refactorizado con Module Pattern (IIFE + Revealing Module)
// Maneja la lógica de mostrar equipos por categoría
// ============================================
const EquipmentData = (() => {
  
  // --- CONSTANTES PRIVADAS ---
  const _MAPPING = {
    'elevacion': ['Gatos Hidráulicos', 'Gato Estibador', 'Ganchos Colgantes', 'Winches', 'Pluma Grúa', 'Andamios Certificados'],
    'perforacion': ['Taladros', 'Extractores', 'Sonda Eléctrica', 'Esmeriladora', 'Equipo Oxicorte', 'Cortadora Porcelanato', 'Extracción Núcleos'],
    'mezclado': ['Trompo Mezclador', 'Vibrocompactadora'],
    'limpieza': ['Hidrolavadora', 'Aspiradora Industrial', 'Motobomba Sumergible'],
    'soldadura': ['Compresor', 'Equipos de Soldadura', 'Planta Eléctrica'],
    'construccion': ['Andamios', 'Estanterías', 'Parasoles'],
    'movimiento': ['Diferenciales', 'Carretillas', 'Buggy con Pico y Pala'],
    'jardin': ['Escaleras', 'Motosierras']
  };
  
  const _CATEGORY_NAMES = {
    'elevacion': 'Elevación y Levante',
    'perforacion': 'Perforación y Corte',
    'mezclado': 'Mezclado y Compactación',
    'limpieza': 'Limpieza e Hidráulica',
    'soldadura': 'Soldadura y Energía',
    'construccion': 'Construcción y Estructura',
    'movimiento': 'Accisores de Movimiento',
    'jardin': 'Jardín y Forestal'
  };
  
  // --- ESTADO PRIVADO ---
  let _state = {
    initialized: false
  };
  
  // --- FUNCIONES PRIVADAS ---
  
  function _getContainers() {
    return document.querySelectorAll('#herramientas-container article, #herramientas-container-2 article');
  }
  
  function _getArticlesByCategory(category) {
    const articles = _getContainers();
    const filtered = [];
    let index = 0;
    
    articles.forEach(article => {
      const cat = article.getAttribute('data-category');
      if (cat === category) {
        filtered.push({ article, index: index++ });
      }
    });
    
    return filtered;
  }
  
  function _showEquipment(category, equipmentIndex) {
    const articles = _getContainers();
    const equipmentName = _MAPPING[category]?.[equipmentIndex];
    
    if (!equipmentName) {
      console.error('Equipo no encontrado:', category, equipmentIndex);
      return false;
    }
    
    articles.forEach(article => {
      article.classList.add('hidden-by-search');
      article.style.display = 'none';
    });
    
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
      
      setTimeout(() => {
        targetArticle.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      
      const backBtn = document.getElementById('back-to-netflix');
      if (backBtn) backBtn.style.display = 'block';
      
      const netflixRows = document.getElementById('netflixRows');
      if (netflixRows) netflixRows.style.display = 'none';
      
      return true;
    }
    
    console.error('Target article no encontrado:', category, equipmentIndex, 'encontrados:', foundIndex);
    return false;
  }
  
  function _hideAll() {
    const articles = _getContainers();
    articles.forEach(article => {
      article.style.display = '';
      article.classList.remove('hidden-by-search');
    });
    
    const netflixRows = document.getElementById('netflixRows');
    if (netflixRows) netflixRows.style.display = 'block';
    
    const backBtn = document.getElementById('back-to-netflix');
    if (backBtn) backBtn.style.display = 'none';
  }
  
  function _filterByCategory(category) {
    const articles = _getContainers();
    
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
  }
  
  function _init() {
    const articles = _getContainers();
    console.log('Equipos init - artículos:', articles.length);
    _state.initialized = true;
  }
  
  // --- API PÚBLICA (REVEALING MODULE) ---
  return {
    mapping: _MAPPING,
    categoryNames: _CATEGORY_NAMES,
    getContainers: _getContainers,
    getArticlesByCategory: _getArticlesByCategory,
    showEquipment: _showEquipment,
    hideAll: _hideAll,
    filterByCategory: _filterByCategory,
    init: _init
  };
})();

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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupGlobalFunctions);
} else {
  setupGlobalFunctions();
}