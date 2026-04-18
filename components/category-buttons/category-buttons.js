// components/category-buttons/category-buttons.js
// Componente de botones de categorías

const categoryButtonsData = [
  { id: 'all', label: 'Todos', category: 'all' },
  { id: 'elevacion', label: 'Elevación y Levante', category: 'elevacion' },
  { id: 'perforacion', label: 'Perforación y Corte', category: 'perforacion' },
  { id: 'mezclado', label: 'Mezclado y Compactación', category: 'mezclado' },
  { id: 'limpieza', label: 'Limpieza e Hidráulica', category: 'limpieza' },
  { id: 'soldadura', label: 'Soldadura y Energía', category: 'soldadura' },
  { id: 'construccion', label: 'Construcción y Estructura', category: 'construccion' },
  { id: 'movimiento', label: 'Accesorios de Movimiento', category: 'movimiento' },
  { id: 'jardin', label: 'Jardín y Forestal', category: 'jardin' }
];

const lateralCategoryData = [
  { id: 'elevacion', label: 'Elevación y Levante' },
  { id: 'perforacion', label: 'Perforación y Corte' },
  { id: 'mezclado', label: 'Mezclado y Compactación' },
  { id: 'limpieza', label: 'Limpieza e Hidráulica' },
  { id: 'soldadura', label: 'Soldadura y Energía' },
  { id: 'construccion', label: 'Construcción y Estructura' },
  { id: 'movimiento', label: 'Accesorios de Movimiento' },
  { id: 'jardin', label: 'Jardín y Forestal' }
];

function getCategoryTabsHTML(activeCategory = 'all') {
  return `
    <ul class="nav nav-pills mb-3 justify-content-between flex-nowrap category-tabs" id="categoryTabs" role="tablist">
      ${categoryButtonsData.map(cat => `
        <li class="nav-item" role="presentation">
          <button class="nav-link btn btn-outline-primary px-3 ${cat.category === activeCategory ? 'active' : ''}" 
                  id="${cat.id}-tab" 
                  type="button" 
                  onclick="handleCategoryClick('${cat.category}', this)">
            ${cat.label}
          </button>
        </li>
      `).join('')}
    </ul>
  `;
}

function getLateralCategoriesHTML() {
  return `
    <ul class="lateral-categories">
      ${lateralCategoryData.map(cat => `
        <li>
          <button class="lateral-category-btn" onclick="showLateralSubmenu('${cat.id}')">
            ${cat.label}
            <span class="lateral-arrow"><i class="fas bi-chevron-right"></i></span>
          </button>
        </li>
      `).join('')}
    </ul>
  `;
}