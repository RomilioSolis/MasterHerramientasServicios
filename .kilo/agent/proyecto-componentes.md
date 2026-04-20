# Agente: Componentes del Proyecto

## ⚠️ ARQUITECTURA DEL PROYECTO - REGLAS OBLIGATORIAS

### Tipo de Proyecto
- **Landing Page estática** para GitHub Pages
- **Vanilla JS nativo** - NO frameworks, NO node_modules

### Stack Tecnológico
- JavaScript Vanilla (ES5+)
- HTML estático
- CSS (puede usar Bootstrap o custom)
- **NO** React, Vue, Angular, Svelte
- **NO** Webpack, Vite, Parcel
- **NO** buscar en node_modules

### Comunicación entre Componentes
- **Event Bus (Pub/Sub)**: `EventEmitter` en `assets/js/event-emitter.js`
- **Alternativa**: Eventos del DOM (`CustomEvent`)
- **PROHIBIDO**: Estado global complejo, Redux, contextos

### Module Pattern (Estructura de Componentes)
```javascript
const MiComponente = (() => {
  let _state = { initialized: false };
  
  function _init() { /* ... */ }
  
  return { init: _init };
})();
```

### Patrón Observer
```javascript
// Emitir evento
if (typeof EventEmitter !== 'undefined') {
  EventEmitter.emit('mi-evento', { data: 1 });
}
document.dispatchEvent(new CustomEvent('mi-evento', { detail: { data: 1 } }));

// Escuchar evento
if (typeof EventEmitter !== 'undefined') {
  EventEmitter.on('mi-evento', (data) => { /* ... */ });
}
```

---

## Descripción
Conoce los componentes del proyecto, su responsabilidad, estado y cómo interactúan entre sí.

---

## Patrón de Diseño

Los componentes JavaScript utilizan **Module Pattern (IIFE + Revealing Module)** para encapsular lógica:
- Cada componente es un IIFE que expone solo APIs necesarias
- Constantes privadas (prefijo `_`) y datos centralizados en `APP_CONFIG`
- Comunicación via `CustomEvent` (ej: `category:select`, `equipos-dropdown:open`)
- Legacy support mediante funciones globales en `window`

Consultar: `/proyecto-refactorizacion` para detalles del patrón.

---

## Estado de Componentes (Refactorizados con Module Pattern)

| Componente | Estado | Patrón |
|------------|--------|-------|
| category-buttons | ✅ ACTIVO | ✅ MODULE PATTERN |
| category-filter | ✅ ACTIVO | ✅ MODULE PATTERN |
| equipos-dropdown | ✅ ACTIVO | ✅ MODULE PATTERN |
| equipos-grid | ✅ ACTIVO | 🔄 PENDIENTE |
| social-buttons | ✅ ACTIVO | 🔄 PENDIENTE |
| header | ✅ ACTIVO | ✅ YA TIENE |
| back-to-top | ✅ ACTIVO | 🔄 PENDIENTE |
| navigation | ✅ ACTIVO | ✅ ACTIVO |
| footer | ✅ ACTIVO | ✅ ACTIVO |
| contacto | ✅ ACTIVO | 🔄 PENDIENTE |
| faq | ✅ ACTIVO | 🔄 PENDIENTE |
| chat-widget | ✅ ACTIVO | 🔄 PENDIENTE |
| horario | ✅ ACTIVO | 🔄 PENDIENTE |
| gallery | ✅ ACTIVO | 🔄 PENDIENTE |
| lateral-menu | ❌ OBSOLETO | - |

---

## Componentes y su Responsabilidad

### Category Buttons (`components/category-buttons/`)
- **Patrón**: ✅ MODULE PATTERN
- **JS**: `category-buttons.js` → `CategoryButtons` module
- **API**: `CategoryButtons.init()`, `.selectCategory(category)`, `.getCategories()`
- **Eventos**: Emite `category-buttons:init`, `category:select`
- **Legacy**: `window.getCategoryTabsHTML` disponible para compatibilidad

### Header (`components/header/`)
- **Función**: Orchestrator — inyecta HTML del header y carga dinámicamente dropdown y buscador
- **Carga**: Script clásico con `defer` en head
- **Patrón**: Carga dinámica de scripts mediante `appendChild('script')` (equipos-dropdown.js, buscador-unificado.js)
- **Exposición**: Funciones globales `window.toggleEquiposDropdown`, `window.searchTools`, etc.

### Equipos Dropdown (`components/equipos-dropdown/`)
- **Patrón**: ✅ MODULE PATTERN
- **JS**: `equipos-dropdown.js` → `EquiposDropdown` module
- **API**: `EquiposDropdown.init()`, `.open()`, `.close()`, `.toggle()`, `.getCategories()`
- **Eventos**: Emite `equipos-dropdown:init`, `equipos-dropdown:open`, `equipos-dropdown:close`, `category:select`
- **UI**: Flecha animada (rotate 180°), overlay, grid 2 columnas (1 en móvil)
- **Accesibilidad**: `aria-expanded`, `aria-controls`, Escape para cerrar
- **Legacy**: Funciones globales disponibles para compatibilidad

### Equipos Loader (`components/equipos/loader.js`)
- **Función**: Carga dinámica (fetch) de HTML de equipos y genera filas tipo Netflix
- **Categorías**: 8 categorías, 37 equipos
- **Salida**: Inserta `.netflix-row` con `data-category` y `.netflix-item` con `data-name`
- **Evento**: Dispara `CustomEvent('equiposLoaded')` al terminar
- **Scroll horizontal**: Botones left/right por fila

### Category Filter (`components/category-filter/`)
- **Patrón**: ✅ MODULE PATTERN
- **JS**: `category-filter.js` → `CategoryFilter` module
- **API**: `CategoryFilter.init()`, `CategoryFilter.handleCategoryClick(category)`, `CategoryFilter.showByIndex(category, index)`
- **Filtra**: Filas `.netflix-row[data-category]`
- **Eventos**: Escucha `equiposLoaded`, emite `category:change`
- **Legacy**: `window.handleCategoryClick` disponible para compatibilidad

### Social Buttons (`components/social-buttons/`)
- **Ubicación**: Lado derecho, `right: 20px`, centrado verticalmente
- **Botones**: Facebook, Instagram, WhatsApp
- **z-index**: 10001

### Chat Widget (`components/chat-widget/`)
- **Ubicación**: Lado izquierdo, `left: 20px`, `bottom: 85px`
- **z-index**: 10000

### Gallery (`components/gallery/`)
- **Carga**: Inmediata en `<head>` (sin defer)
- **API global**: `Gallery.open(images, title, waLink, specs?)`, `prev/next/close`
- **Uso**: Click en imagen de Netflix row abre galería interactiva

### Footer (`components/footer/`)
- **Autocontenido**: HTML + CSS
- **Carga**: Lazy load

### Contacto (`components/contacto/`)
- **Autocontenido**: HTML + CSS + JS (mapa Leaflet)
- **Carga**: Lazy load

### FAQ (`components/faq/`)
- **Patrón**: ✅ MODULE PATTERN
- **JS**: `faq.js` → `FAQ` module
- **API**: `FAQ.init()`, `.toggle(btn)`, `.openAll()`, `.closeAll()`, `.scrollTo(id)`, `.getCount()`
- **Eventos**: Emite `faq:init`
- **Autocontenido**: HTML + CSS + JS (accordion)
- **Carga**: Lazy load
- **Categorías**: Empresa/Ubi, Servicios, Alquiler, Contacto

### Horario (`components/horario/`)
- **Autocontenido**: HTML + CSS + JS (reloj real, horario dinámico)
- **Carga**: Lazy load
- **Horario**: Lun-Vie 8AM-6PM, Sáb 8AM-4PM, Dom cerrado (America/Bogota)

### Lateral Menu (`components/lateral-menu/`)
- **Estado**: ❌ OBSOLETO — reemplazado por dropdown, no se inicializa

---

## Cómo Crear un Nuevo Componente (Module Pattern)

1. Crear carpeta en `components/{nombre}/`
2. Crear `{nombre}.html`, `{nombre}.css`, `{nombre}.js`
3. En el JS, usar Module Pattern:

```javascript
const MiComponente = (() => {
  let _state = { initialized: false };
  
  function _init() { /* ... */ }
  
  return {
    init: _init,
    // APIs públicas...
  };
})();

if (typeof window !== 'undefined') {
  window.MiComponente = MiComponente;
  window.initMiComponente = () => MiComponente.init();
}
```

4. En `index.html`, cargar constantes primero, luego el componente:

```html
<script src="assets/js/constants.js" defer></script>
<script src="components/{nombre}/{nombre}.js" defer></script>
<div id="mi-componente-container"></div>
```

---

## Datos del Proyecto

- **Redes Sociales**:
  - Facebook: `https://www.facebook.com/masters.herramientas/`
  - Instagram: `https://www.instagram.com/masterenherramientasyservisios/`
  - WhatsApp: `https://wa.me/573165345675`

- **Equipos**: 38 equipos en 8 categorías (incluye Taladro Magnético)
- **Última actualización**: 20 abril 2026
