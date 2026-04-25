# Agente: Refactorización Module Pattern

## ⚠️ REGLAS DE ARQUITECTURA - IMPORTANTE

Estas reglas son **OBLIGATORIAS** y no deben ser violadas:

### Arquitectura del Proyecto
- **Tipo**: Landing Page estática para GitHub Pages
- **Stack**: Vanilla JS nativo (NO buscar node_modules, NO usar frameworks)
- **Módulos**: NO usar ES6 imports/exports en componentes (use IIFE para compatibilidad)

### Comunicación entre Componentes
- **Patrón**: Event Bus (Pub/Sub) usando `EventEmitter` en `assets/js/event-emitter.js`
- **Alternativa**: Eventos del DOM (`CustomEvent`)
- **PROHIBIDO**: Estado global complejo, Redux, contextos, etc.

### Renderizado
- El HTML es **estático** (en archivos .html)
- El JS se encarga de:
  - Interactividad (eventos, animaciones)
  - Componentes dinámicos (modales, lightboxes)
  - Inyección de contenido cuando sea necesario

### Module Pattern (Estructura Obligatoria)
```javascript
// Estructura correcta para TODOS los componentes
const MiComponente = (() => {
  // --- CONSTANTES PRIVADAS ---
  const _CONSTANTS = { /* ... */ };
  
  // --- ESTADO PRIVADO ---
  let _state = { initialized: false };
  
  // --- FUNCIONES PRIVADAS (prefijo _) ---
  function _init() { /* ... */ }
  
  // --- API PÚBLICA (REVEALING MODULE) ---
  return {
    init: _init,
    // otros métodos públicos
  };
})();
```

### Patrón Observer (Comunicación)
- Usar `EventEmitter.emit(eventName, data)` para notificar
- Usar `EventEmitter.on(eventName, callback)` para escuchar
- Siempre incluir fallback a `CustomEvent` para compatibilidad:
```javascript
function _emit(eventName, detail = {}) {
  if (typeof EventEmitter !== 'undefined') {
    EventEmitter.emit(eventName, detail);
  }
  document.dispatchEvent(new CustomEvent(eventName, { detail }));
}
```

### PROHIBICIONES
- ❌ NO usar `import`/`export` en componentes (usa IIFE)
- ❌ NO crear estado global con `window.miEstado`
- ❌ NO usar frameworks (React, Vue, Angular, etc.)
- ❌ NO buscar en node_modules
- ❌ NO usar Webpack/Vite/Parcel para componentes

---

## Descripción
Agente especializado en refactorizar código JavaScript del proyecto aplicando el patrón Module Pattern (IIFE + Revealing Module). Encapsula lógica, exponiendo solo APIs necesarias.

---

## Estado de Refactorización (COMPLETADO - 20 abril 2026)

| Componente | Estado Real del Código | Estado Module Pattern |
|------------|----------------------|---------------------|
| **buscador-unificado** | ✅ IIFE + Revealing Module | ✅ COMPLETADO |
| **category-buttons** | ✅ IIFE + Revealing Module | ✅ COMPLETADO |
| **category-filter** | ✅ IIFE + Revealing Module | ✅ COMPLETADO |
| **dark-mode** | ✅ IIFE + Revealing Module | ✅ COMPLETADO |
| **equipos-dropdown** | ✅ IIFE + Revealing Module | ✅ COMPLETADO |
| **event-emitter** | ✅ IIFE | ✅ ACTIVO |
| **faq** | ✅ IIFE + Revealing Module | ✅ COMPLETADO |
| **component-factory** | ✅ IIFE | ✅ ACTIVO |
| **component-tester** | ✅ IIFE | ✅ ACTIVO |
| **header** | ✅ IIFE | ✅ ACTIVO |
| **equipos-grid** | ✅ IIFE + Revealing Module | ✅ COMPLETADO |
| **gallery** | ✅ IIFE + Revealing Module (corregido var→const) | ✅ COMPLETADO |
| **social-buttons** | ✅ IIFE + Revealing Module | ✅ COMPLETADO |
| **chat-widget** | ✅ IIFE + Revealing Module | ✅ COMPLETADO |

---

## Patrón Module Pattern — Estructura Base

```javascript
// ============================================
// MÓDULO: NombreDelModulo
// ============================================
const NombreDelModulo = (() => {
  
  // --- CONSTANTES PRIVADAS ---
  const DEFAULT_CONFIG = {
    delay: 500,
    baseUrl: 'https://masterenherramientasyservicios.com.co'
  };
  
  // --- ESTADO PRIVADO ---
  let _state = {
    initialized: false,
    cache: new Map()
  };
  
  // --- FUNCIONES PRIVADAS ---
  function _createElement(tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'class') el.className = v;
      else if (k === 'style' && typeof v === 'object') {
        Object.assign(el.style, v);
      } else el.setAttribute(k, v);
    });
    children.forEach(c => {
      if (typeof c === 'string') el.appendChild(document.createTextNode(c));
      else if (c instanceof Node) el.appendChild(c);
    });
    return el;
  }
  
  function _emit(eventName, detail = {}) {
    document.dispatchEvent(new CustomEvent(eventName, { detail }));
  }
  
  // --- INICIALIZACIÓN ---
  function _init(config = {}) {
    if (_state.initialized) return;
    const cfg = { ...DEFAULT_CONFIG, ...config };
    _state.initialized = true;
    _emit('nombre-modulo:init', cfg);
  }
  
  // --- API PÚBLICA (REVEALING MODULE) ---
  return {
    init: _init,
    // APIs adicionales...
  };
  
})();

// Exportar si ESM disponible
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NombreDelModulo;
}
```

---

## Reglas de Aplicación del Patrón

### 1. Encapsulamiento
- Todo código que no necesite ser全局 (no usado por otros scripts) debe ser **privado** (dentro del IIFE)
- Variables que comienza con `_` son privadas por convención
- Usar `const` para datos que no mutan

### 2. Exposición Mínima
- Solo exponer métodos necesarios: `init()`, `open()`, `close()`, `toggle()`, `getData()`
- No exponer funciones helper privadas

### 3. Datos Centralizados
- Extraer **constantes** (teléfono, URLs, paths) a constantes con nombre en UPPER_SNAKE_CASE
- No hardcodear en múltiples lugares

### 4. Eventos para Comunicación
- Usar `CustomEvent` para comunicar entre módulos
- Nombrar eventos como `{modulo}:{accion}` ej: `equipos-grid:loaded`

### 5.throttling/Debounce
- Funciones que responden a eventos (scroll, resize) usan throttle/debounce

---

## Guía de Refactorización por Componente

### Equipos Grid (`components/equipos-grid/equipos-grid.js`)

#### ANTES (PROBLEMA):
```javascript
const equiposGridData = { /* ... */ };
const equiposCategoryNames = { /* ... */ };

function createEquipmentCard(eq, category) { /* código inline */ }
function loadStyles() { /* repetitivo */ }
async function loadEquiposGrid() { /* poll global */ }

export default { init: loadEquiposGrid, data: equiposGridData, categoryNames: equiposCategoryNames };
```

#### DESPUÉS (MÓDULO):
```javascript
const EquiposGrid = (() => {
  // CONSTANTS
  const WHATSAPP = { PHONE: '573165345675', BASE: 'https://wa.me' };
  
  // DATA ( privado)
  const _DATA = {
    elevacion: [/* ... */]
  };
  
  // PRIVATE METHODS
  function _createCard(equipment, category) {
    const waLink = `${WHATSAPP.BASE}/${WHATSAPP.PHONE}?text=...`;
    return `...`;
  }
  
  function _loadStyles() {
    /* ... */
  }
  
  // PUBLIC API
  return {
    init() { /* ... */ },
    getData() { return Object.freeze(_DATA); }
  };
})();
```

### Social Buttons (`components/social-buttons/`)

#### ANTES:
```javascript
function initSocialButtons() { /* todo global */ }
window.initSocialButtons = initSocialButtons;
```

#### DESPUÉS:
```javascript
const SocialButtons = (() => {
  const _LINKS = {
    facebook: 'https://www.facebook.com/masters.herramientas/',
    instagram: 'https://www.instagram.com/masterenherramientasyservisios/',
    whatsapp: 'https://wa.me/573165345675'
  };
  
  function _render() { /* ... */ }
  
  return {
    init() { _render(); }
  };
})();
```

---

## Comandos del Agente

| Comando | Descripción |
|---------|-------------|
| `/refactorizar {componente}` | Refactoriza un componente específico |
| `/refactorizar todos` | Refactoriza todos los componentes pendientes |
| `/crear-modulo {nombre}` | Crea módulo nuevo con estructura base |
| `/extraer-constantes` | Extrae magic strings/numbers aconstants.js |
| `/verificar-estado` | Muestra estado de refactorización |

---

## Archivo de Constantes a Crear

```javascript
// assets/js/constants.js
const APP_CONFIG = Object.freeze({
  // Phone
  PHONE: {
    WHATSAPP: '573165345675',
    CALL: '+573165345675'
  },
  // URLs
  URLS: {
    BASE: 'https://masterenherramientasyservicios.com.co',
    WHATSAPP_BASE: 'https://wa.me',
    FACEBOOK: 'https://www.facebook.com/masters.herramientas/',
    INSTAGRAM: 'https://www.instagram.com/masterenherramientasyservisios/'
  },
  // Paths
  PATHS: {
    COMPONENTS: '/components',
    ASSETS: '/assets',
    IMAGES: '/assets/imagenes',
    VIDEOS: '/assets/Videos'
  },
  // Timing
  TIMING: {
    LAZY_DELAY: 500,
    DEBOUNCE_DELAY: 250,
    ANIMATION_DURATION: 300
  },
  // UI
  UI: {
    Z_INDEX: {
      HEADER: 1000,
      MODAL: 10000,
      SOCIAL: 10001
    }
  }
});
```

---

## Datos del Proyecto

- **Teléfono WhatsApp**: 316 534 5675
- **URL Base**: masterenherramientasyservicios.com.co
- **Última actualización**: 20 abril 2026

---

# Patrón Observer / EventEmitter

## Estado de Implementación (COMPLETADO - 20 abril 2026)

| Componente | Emite Evento | Usa EventEmitter | Estado |
|------------|-------------|------------------|--------|
| **equipos-grid** | `equipos:loaded` | ✅ EventEmitter + CustomEvent | ✅ COMPLETADO |
| **equipos-dropdown** | `category:select`, `equipos-dropdown:open` | ✅ EventEmitter + CustomEvent | ✅ COMPLETADO |
| **category-buttons** | `category:init`, `category:select` | ✅ EventEmitter + CustomEvent | ✅ COMPLETADO |
| **category-filter** | `category:init`, `category:change` (escucha eventos) | ✅ EventEmitter + CustomEvent | ✅ COMPLETADO |
| **dark-mode** | `darkmode:init`, `darkmode:toggle`, `darkmode:change` | ✅ EventEmitter + CustomEvent | ✅ COMPLETADO |
| **buscador-unificado** | `buscador:init` | ✅ EventEmitter + CustomEvent | ✅ COMPLETADO |
| **equipos-loader** | `equipos:ready` | ✅ EventEmitter + CustomEvent | ✅ COMPLETADO |
| **event-emitter** | N/A | ✅ Ya existe | ✅ ACTIVO |
| **app-events** | N/A | 🆕 Creado con constantes | ✅ ACTIVO |

---

## Eventos del Sistema

```javascript
// assets/js/app-events.js
const APP_EVENTS = Object.freeze({
  // Categorías
  CATEGORY_SELECT: 'category:select',
  CATEGORY_CHANGE: 'category:change',
  CATEGORY_INIT: 'category:init',

  // Tema Oscuro
  THEME_INIT: 'darkmode:init',
  THEME_TOGGLE: 'darkmode:toggle',
  THEME_CHANGE: 'darkmode:change',

  // Equipos
  EQUIPOS_LOADED: 'equipos:loaded',
  EQUIPOS_FILTER: 'equipos:filter',

  // UI / Búsqueda
  SEARCH_INIT: 'buscador:init',
  SEARCH_PERFORM: 'buscador:search',
  SEARCH_CLEAR: 'buscador:clear',

  // Modal
  MODAL_OPEN: 'modal:open',
  MODAL_CLOSE: 'modal:close'
});
```

---

## Arquitectura de Comunicación Propuesta

```
┌─────────────────────────────────────────────────────────────────┐
│                        EVENT EMITTER                            │
│              (assets/js/event-emitter.js)                       │
└─────────────────────────────────────────────────────────────────┘
           ▲                    ▲                    ▲
           │                    │                    │
    ┌──────┴──────┐      ┌──────┴──────┐      ┌──────┴──────┐
    │ Category    │      │   Dark      │      │  Equipos    │
    │ Buttons     │      │   Mode      │      │  Grid       │
    │ (EMITE)     │      │  (EMITE)    │      │  (EMITE)    │
    └─────────────┘      └─────────────┘      └─────────────┘
                                                    │
                                                    ▼
           ▼                    ▼           ┌──────┴──────┐
    ┌─────────────┐      ┌─────────────┐    │ Category    │
    │ Category    │      │  Chat       │    │ Filter      │
    │ Filter      │      │  Widget     │    │ (ESCUCHA)   │
    │ (ESCUCHA)   │      │ (ESCUCHA)   │    └─────────────┘
    └─────────────┘      └─────────────┘              │
           │                                        ▼
           ▼                               ┌─────────────────┐
    ┌─────────────┐                        │ Buscador        │
    │ Equipos     │                        │ (ESCUCHA)       │
    │ Dropdown    │                        └─────────────────┘
    │ (ESCUCHA)   │
    └─────────────┘
```

---

## Guía de Implementación

### 1. Emisor (Componente que dispatcha evento)

**ANTES:**
```javascript
function _emit(eventName, detail = {}) {
  document.dispatchEvent(new CustomEvent(eventName, { detail }));
}
```

**DESPUÉS:**
```javascript
function _emit(eventName, detail = {}) {
  // Usar EventEmitter si está disponible
  if (typeof EventEmitter !== 'undefined') {
    EventEmitter.emit(eventName, detail);
  } else {
    // Fallback a CustomEvent para compatibilidad
    document.dispatchEvent(new CustomEvent(eventName, { detail }));
  }
}
```

### 2. Suscriptor (Componente que escucha eventos)

```javascript
// En el init del componente
if (typeof EventEmitter !== 'undefined') {
  EventEmitter.on('category:select', (data) => {
    // Filtrar equipos por categoría
    this.filterByCategory(data.category);
  });
}
```

---

## Comandos del Agente para Observer

| Comando | Descripción |
|---------|-------------|
| `/observer categorias` | Aplica Observer para comunicación de categorías |
| `/observer tema` | Aplica Observer para tema oscuro |
| `/observer equipos` | Aplica Observer para carga de equipos |
| `/observer todos` | Aplica Observer a todos los componentes pendientes |
| `/verificar-observer` | Muestra estado de implementación de Observer |
