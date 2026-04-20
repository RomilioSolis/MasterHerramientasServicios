# Agente: Troubleshooting del Proyecto

## ⚠️ ARQUITECTURA - REGLAS OBLIGATORIAS

### Stack del Proyecto
- **Vanilla JS** (NO frameworks)
- **HTML estático** para GitHub Pages
- **NO** node_modules, Webpack, Vite, React, Vue

### Comunicación
- **EventEmitter** para Pub/Sub
- **NO** estado global complejo

---

## Descripción
Conoce los problemas comunes del proyecto y sus soluciones.

---

## Patrón de Diseño JavaScript

Los componentes JavaScript usan **Module Pattern (IIFE + Revealing Module)**.
Consultar `/proyecto-refactorizacion` para detalles.

---

## Header no aparece

**Causa 1**: Módulos ES6 (`type="module"`) no soportados en GitHub Pages sin headers MIME específicos.
- **Solución**: Usar scripts clásicos con `defer` y rutas relativas.

**Causa 2**: Rutas absolutas (`/components/...`) fallan en subdirectorio GitHub Pages.
- **Solución**: Rutas relativas (`components/...`). Asegurar `<base href="./">` si hay enlaces rotos.

**Verificar**: 
- DevTools → Network: `header.js` (200) y `header.css` cargados
- Console sin `SyntaxError`
- `#header-app` existe y contiene header
- `.modern-header` tiene `position: relative; z-index: 1000;`

---

## Filtros de categoría no funcionan

**Requisito**: `category-filter.js` expone `window.handleCategoryClick`.
- **Depurar**: `typeof window.handleCategoryClick` → `"function"`. Si no, script no se ejecutó.

**Race condition**: Filas Netflix cargan asincrónicamente; si se filtra antes, no aplica.
- **Solución**: `category-filter.js` escucha `equiposLoaded` y reaplica `currentCategory` automáticamente.
- **Verificar console**: "Equipos cargados exitosamente"

**Inspeccionar**: Cada `.netflix-row` debe tener `data-category` coincidente con claves del dropdown (`elevacion`, `perforacion`, etc.).

---

## Netflix rows no aparecem

- **Loader**: `components/equipos/loader.js` debe ejecutarse.
- **DOM**: `#netflixRows` debe existir.
- **404**: Verificar rutas a `components/equipos/*.html` en Network tab. Ajustar rutas relativas.

---

## Botones sociales no aparecen

- **z-index**: 10001
- **Carga**: `social-buttons.js` presente en Network
- **Fuentes**: FontAwesome e icons cargados

---

## Filtros de categoría no funcionan (Abril 2025)

**Problema:** Botones de categorías no filtran equipos al hacer clic.

**Causa Raíz:**
- `equipos-dropdown.js` sobrescribe `window.handleCategoryClick` con una función que solo cierra el dropdown pero NO aplica el filtro

**Código problema (equipos-dropdown.js línea 349):**
```javascript
// ANTES (incorrecto)
window.handleCategoryClick = (category) => EquiposDropdown.close();
```

**Solución 1 - Preferred:** Agregar onclick inline en botones de categorías:
```javascript
// category-buttons.js - Añadir onclick al botón
function _getCategoryButtonHTML(category, isActive = false) {
  return `
    <button ... data-category="${category.category}"
            onclick="handleCategoryClick('${category.category}')">
    </button>
  `;
}
```

**Solución 2 - make equipos-dropdown.js llamar al filtro real:**
```javascript
// equipos-dropdown.js - CORREGIDO
window.handleCategoryClick = (category) => {
  // Llamar al CategoryFilter real si existe
  if (typeof window.CategoryFilter !== 'undefined' && window.CategoryFilter.handleCategoryClick) {
    window.CategoryFilter.handleCategoryClick(category);
  }
  // Luego cerrar el dropdown
  EquiposDropdown.close();
};
```

**Verificar:**
1. Abrir consola (F12)
2. Hacer clic en botón de categoría
3. Ver mensajes: "CategoryFilter: handleCategoryClick called with: elevacion"

---

## Error 404

- **GitHub Pages**: Confirmar que archivos están en la rama desplegada.
- **Rutas**: Usar relativas (sin `/` inicial).

---

## Menú lateral no responde

- **Estado**: `lateral-menu` obsoleto; no debe usarse.
- **Reemplazo**: `equipos-dropdown` en header.

---

## Gallery no abre

- **Verificar**: `Gallery` está disponible globalmente
- **Depurar**: `typeof Gallery` → `"object"`
- **Call**: `Gallery.open(images, title, waLink)`

---

## Chat widget no aparece

- **Ubicación**: `left: 20px`, `bottom: 85px`
- **z-index**: 10000
- **Carga**: Lazy load (500ms) + script defer (800ms)

---

## FAQ accordion no funciona (Abril 2025)

**Problema:** Las preguntas del FAQ no se expanden al hacer clic.

**Causa Raíz:**
- FAQ se carga dinámicamente via ComponentFactory (lazy load)
- `FAQ.init()` solo se ejecutaba en `DOMContentLoaded`, pero ese evento ya había pasado cuando el FAQ se cargó
- No había inicialización después de cargar el componente

**Solución:** Agregar listeners para inicializar después de carga lazy:
```javascript
// faq.js - Escuchar evento de ComponentFactory
document.addEventListener('component:loaded', (e) => {
  if (e.detail && e.detail.id === 'faq') {
    setTimeout(() => FAQ.init(), 100);
  }
});

// Fallback adicional
setTimeout(() => {
  if (!FAQ.isInitialized()) {
    FAQ.init();
  }
}, 500);
```

**Verificar:**
1. Abrir consola (F12)
2. Recargar página
3. Buscar mensaje: "FAQ: Initializing with X questions"

---

## Dark Mode no funciona (Abril 2025)

**Problema:** El botón de alternar modo oscuro no cambia el tema.

**Causa Raíz:**
- Botón en `dark-mode-btn.html` no tiene `onclick` asignado
- `DarkMode.init()` no se llamaba automáticamente

**Solución 1 - Agregar onclick al botón:**
```html
<!-- dark-mode-btn.html -->
<button onclick="DarkMode.toggle()">...</button>
```

**Solución 2 - Auto-inicializar en dark-mode.js:**
```javascript
document.addEventListener('DOMContentLoaded', () => {
  DarkMode.init();
});
```

**Verificar:**
1. Recargar página
2. Hacer clic en botón de modo oscuro
3. El fondo debe cambiar a oscuro

---

## Dark Mode - Texto del header no visible en modo claro (Abril 2025)

**Problema:** En modo claro, el texto del header (logo, nav-links) no se ve.

**Causa Raíz:**
- El header tiene fondo burdeos (#800020), pero los estilos CSS no forcambian el color del texto a blanco en modo claro
- Los estilos usaban selectores sin `body` como prefijo

**Solución:** Agregar selectores más específicos en dark-mode.css:
```css
/* Header modo claro */
body[data-theme="light"] .modern-header,
body[data-theme="light"] header.navbar {
  background-color: #800020 !important;
}
body[data-theme="light"] .modern-header .logo-text,
body[data-theme="light"] .nav-link {
  color: #ffffff !important;
}

/* Header modo oscuro */
body[data-theme="dark"] .modern-header {
  background-color: #800020 !important;
}
body[data-theme="dark"] .modern-header .logo-text,
body[data-theme="dark"] .nav-link {
  color: #ffffff !important;
}
```