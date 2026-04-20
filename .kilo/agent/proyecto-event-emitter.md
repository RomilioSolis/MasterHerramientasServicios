# Agente: EventEmitter - Comunicación entre Componentes

## ⚠️ ARQUITECTURA - REGLAS OBLIGATORIAS

### Stack del Proyecto
- **Vanilla JS** - NO frameworks
- **Landing Page estática** para GitHub Pages
- **NO** usar node_modules, Webpack, Vite

### Comunicación entre Componentes
- **OBLIGATORIO**: Usar `EventEmitter` para Pub/Sub
- **Fallback**: `CustomEvent` para compatibilidad
- **PROHIBIDO**: Estado global complejo

---

## Descripción
Agente especializado en crear y mantener un sistema de comunicación por eventos (`EventEmitter`) para decoupling entre componentes del proyecto Master Herramientas y Servicios.

---

## Problema Actual

Los componentes se comunican mediante:
1. Funciones globales en `window`
2. CustomEvents con `document.dispatchEvent`
3. Estado compartido (no ideal)

Esto genera acoplamiento y dificultades para mantener.

---

## Solución: EventEmitter Centralizado

### Ubicación
`assets/js/event-emitter.js`

### Implementación

```javascript
// ============================================
// EventEmitter - Sistema centralizado de eventos
// ============================================

const EventEmitter = (() => {
  
  // --- ESTADO PRIVADO ---
  const _listeners = new Map();
  
  // --- API PÚBLICA ---
  return {
    on(event, callback) {
      if (!_listeners.has(event)) {
        _listeners.set(event, new Set());
      }
      _listeners.get(event).add(callback);
      
      // Return unsubscribe function
      return () => this.off(event, callback);
    },
    
    off(event, callback) {
      if (_listeners.has(event)) {
        _listeners.get(event).delete(callback);
      }
    },
    
    emit(event, data = {}) {
      if (_listeners.has(event)) {
        _listeners.get(event).forEach(callback => {
          try {
            callback(data);
          } catch (e) {
            console.error(`EventEmitter error on "${event}":`, e);
          }
        });
      }
    },
    
    once(event, callback) {
      const wrapper = (data) => {
        callback(data);
        this.off(event, wrapper);
      };
      return this.on(event, wrapper);
    },
    
    clear(event) {
      if (event) {
        _listeners.delete(event);
      } else {
        _listeners.clear();
      }
    },
    
    listenerCount(event) {
      return _listeners.has(event) ? _listeners.get(event).size : 0;
    }
  };
  
})();

// Legacy compatibility
if (typeof window !== 'undefined') {
  window.EventEmitter = EventEmitter;
  window.EE = EventEmitter; // Short alias
}

// Export
if (typeof module !== 'undefined') {
  module.exports = EventEmitter;
}
```

---

## Convenciones de Nombres de Eventos

| Prefijo | Tipo de Evento | Ejemplo |
|--------|---------------|---------|
| `component:` | Inicialización de componente | `header:init`, `faq:init` |
| `component:action` | Acción del usuario | `category:select`, `search:execute` |
| `component:state` | Cambio de estado | `darkmode:toggle`, `modal:open` |
| `app:` | Eventos globales de la app | `app:ready`, `app:error` |
| `data:` | Eventos de datos | `equipos:loaded`, `equipos:filtered` |

---

## Guía de Uso por Componente

### 1. Emitir evento desde componente

```javascript
// ANTES (con dispatchEvent)
document.dispatchEvent(new CustomEvent('category:select', { 
  detail: { category } 
}));

// DESPUÉS (con EventEmitter)
EventEmitter.emit('category:select', { category });
```

### 2. Escuchar evento en componente

```javascript
// En cualquier componente
EventEmitter.on('category:select', (data) => {
  console.log('Categoría seleccionada:', data.category);
});

// Cleanup cuando ya no se necesita
const unsubscribe = EventEmitter.on('category:select', handler);
unsubscribe(); // Remove listener
```

### 3. Esperar evento global (once)

```javascript
// Ejecutar cuando algo sucede una vez
EventEmitter.once('equiposLoaded', () => {
  console.log('Equipos cargados!');
});
```

---

## Estado Actual de Eventos

| Evento | Emite | Escuchado por | Estado |
|--------|------|--------------|--------|
| `category:select` | equipos-dropdown, category-buttons | category-filter, buscador | ✅ ACTIVO |
| `category:change` | category-filter | - | ✅ ACTIVO |
| `equiposLoaded` | equipos/loader | category-filter, buscador | ✅ ACTIVO |
| `buscador:init` | buscador | - | ✅ ACTIVO |
| `darkmode:init` | dark-mode | - | ✅ ACTIVO |
| `darkmode:toggle` | dark-mode | - | ✅ ACTIVO |
| `faq:init` | faq | - | ✅ ACTIVO |
| `equipos-dropdown:init` | equipos-dropdown | - | ✅ ACTIVO |
| `category-buttons:init` | category-buttons | - | ✅ ACTIVO |

---

## Migración a EventEmitter

### Paso 1: Cargar EventEmitter primero

En `index.html`, cargar antes que otros scripts:

```html
<!-- EventEmitter - debe cargar primero -->
<script src="assets/js/event-emitter.js" defer></script>
```

### Paso 2: Reemplazar dispatchEvent

```javascript
// ANTES
document.dispatchEvent(new CustomEvent('mi-evento', { detail: { data } }));

// DESPUÉS  
EventEmitter.emit('mi-evento', { data });
```

### Paso 3: Reemplazar addEventListener

```javascript
// ANTES
document.addEventListener('mi-evento', (e) => { /* handler */ });

// DESPUÉS
EventEmitter.on('mi-evento', (data) => { /* handler */ });
```

---

## Beneficios del EventEmitter Centralizado

1. **Decoupling**: Componentes no dependen directamente entre sí
2. **Cleanup fácil**: `unsubscribe()` retorna función para remove listener
3. **Debugging**: `listenerCount()` permite verificar listeners activos
4. **Testing**: Fácil mockear eventos en pruebas
5. **Unified**: Un solo sistema para todos los componentes

---

## Comandos del Agente

| Comando | Descripción |
|---------|-------------|
| `/event-emitter add {evento} {componente}` | Agregar nuevo evento |
| `/event-emitter migrate {componente}` | Migrar componente a usar EventEmitter |
| `/event-emitter migrate all` | Migrar TODOS los componentes a EventEmitter |
| `/event-emitter list` | Listar todos los eventos activos |
| `/event-emitter listeners {evento}` | Ver listeners de un evento |

---

## Migración Completada

| Componente | Estado | Notas |
|-----------|--------|-------|
| category-buttons | ✅ MIGRADO | `_emit()` → `EventEmitter.emit()` |
| category-filter | ✅ MIGRADO | `_emit()` → `EventEmitter.emit()` + `on()` |
| equipos-dropdown | ✅ MIGRADO | `_emit()` → `EventEmitter.emit()` |
| buscador | ✅ MIGRADO | `addEventListener` → `EventEmitter.on()` |
| dark-mode | ✅ MIGRADO | `_emit()` → `EventEmitter.emit()` |
| faq | ✅ MIGRADO | `_emit()` → `EventEmitter.emit()` |