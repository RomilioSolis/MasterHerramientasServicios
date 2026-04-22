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

## Reloj no aparece / No carga (Abril 2025)

**Problema:** El reloj no aparece o muestra "--:--" al entrar a la página.

**Causa Raíz:**
- `horario.js` se carga lazy (300ms delay)
- El script busca elementos del DOM (`#reloj-actual`, `#fecha-actual`) inmediatamente al ejecutarse
- Cuando el script se carga, los elementos aún no existen en el DOM

**Solución:** Obtener referencias al DOM dentro de función `inicializar()` en lugar de al inicio:
```javascript
// horario.js - CORREGIDO
var relojDisplay; // No buscar al inicio

function inicializarReloj() {
  relojDisplay = document.getElementById('reloj-actual'); // Buscar dentro de función
  fechaDisplay = document.getElementById('fecha-actual');
  
  if (relojDisplay && fechaDisplay) {
    if (!intervaloActivo) {
      actualizarReloj();
      setInterval(actualizarReloj, 1000);
      intervaloActivo = true;
    }
  }
}

// Intentar inmediatamente (para cuando ya está en DOM)
inicializarReloj();

// Escuchar evento de ComponentFactory
document.addEventListener('component:loaded', function(e) {
  if (e.detail && e.detail.id === 'horario') {
    setTimeout(inicializarReloj, 100);
  }
});

// Fallback adicional
setTimeout(function() {
  if (!intervaloActivo) {
    inicializarReloj();
  }
}, 500);
```

**Verificar:**
1. Recargar página
2. El reloj debe mostrar hora actual (no "--:--")
3. Verificar en consola: sin errores de "null is not an object"

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

---

## Nueva Estructura CSS - ITCSS (Abril 2026)

El proyecto ahora usa la arquitectura **ITCSS** (Inverted Triangle CSS). Los archivos se encuentran en:

```
assets/css/
├── 1-settings/              # Variables CSS
│   ├── _variables.css       # Colores, espaciado, breakpoints
│   ├── _theme-light.css     # Variables tema claro
│   └── _theme-dark.css    # Variables tema oscuro
├── 3-generic/            # Reset
│   └── _reset.css
├── 4-elements/           # Tipografía
│   └── _typography.css
├── 5-components/         # Componentes UI
│   ├── _buttons.css
│   ├── _cards.css
│   └── _nav-tabs.css
├── 6-layouts/            # Secciones
│   └── _sections.css
├── 7-themes/            # Variaciones de tema
│   └── _dark-mode.css
├── 8-utilities/         # Helpers
│   └── _helpers.css
└── main.css             # Punto de entrada
```

### Orden de carga en index.html

```html
<!-- 1. Componentes específicos (mayor especificidad) -->
<link rel="stylesheet" href="components/equipos/equipos.css">
<link rel="stylesheet" href="components/dark-mode/dark-mode.css">
...

<!-- 2. Arquitectura ITCSS -->
<link rel="stylesheet" href="assets/css/main.css">
```

---

## Problemas de CSS - Soluciones

### Títulos de categorías no visibles

**Problema:** Los subtítulos de filas Netflix (ej: "Elevación y Levante") no se ven.

**Solución:**
```css
.netflix-category-title {
  color: #ffffff !important;
  opacity: 1 !important;
  visibility: visible !important;
}
[data-theme="light"] .netflix-category-title {
  color: #ffffff !important;
}
```

### Sección equipos sin fondo azul en modo claro

**Problema:** El fondo azul oscuro se pierde en modo claro.

**Solución:**
```css
#equipos {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%) !important;
}
[data-theme="light"] #equipos {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%) !important;
}
```

### Botones de categorías no caben

**Problema:** Los botones son muy pequeños o no caben en el renglón.

**Solución:**
```css
#equipos .category-tabs {
  display: flex !important;
  flex-wrap: wrap !important;
  justify-content: flex-start !important;
  gap: 0.5rem !important;
}

#equipos .category-tabs .nav-link {
  padding: 0.5rem 1rem !important;
  font-size: 0.85rem !important;
  flex-shrink: 0 !important;
}
```

### Netflix items sin fondo oscuro

**Problema:** Items pierden el fondo azul en modo claro.

**Solución:**
```css
.netflix-item {
  background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%) !important;
}

.netflix-item-title {
  color: #ffffff !important;
  background: rgba(20, 20, 40, 0.95) !important;
}

[data-theme="light"] .netflix-item {
  background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%) !important;
}

[data-theme="light"] .netflix-item-title {
  color: #ffffff !important;
  background: rgba(20, 20, 40, 0.95) !important;
}
```

---

## Verificar estilos

1. **Abrir consola** (F12) → Network → verificar archivos CSS cargados
2. **Inspeccionar elemento** → Verificar computed styles
3. **Probar modo claro/oscuro** → Alternar con theme-switcher