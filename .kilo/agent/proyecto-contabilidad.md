# Agente: Master Herramientas y Servicios

## ⚠️ ARQUITECTURA DEL PROYECTO - REGLAS OBLIGATORIAS

### Stack Tecnológico
- **Vanilla JS** (NO frameworks como React, Vue, Angular)
- **Landing Page estática** para GitHub Pages
- **NO** usar node_modules, Webpack, Vite, Parcel
- **PROHIBIDO**: Estado global complejo, Redux, contextos

### Comunicación entre Componentes
- **EventEmitter** (`assets/js/event-emitter.js`) - Pub/Sub
- **CustomEvent** - fallback para compatibilidad
- **NO** funciones globales en window (excepto legacy)

### Module Pattern
Todos los componentes deben usar **IIFE + Revealing Module**:
```javascript
const MiComponente = (() => {
  let _state = { initialized: false };
  function _init() { }
  return { init: _init };
})();
```

### Patrón Observer
```javascript
// Emitir
EventEmitter.emit('evento', { data: 1 });
// Escuchar
EventEmitter.on('evento', (data) => { });
```

---

## Descripción
Agente orquestador que delega a sub-agentes especializados según el tipo de tarea.

## Sub-Agentes

| Agente | Usar para |
|--------|-----------|
| `proyecto-estructura` | Rutas, archivos, GitHub Pages, CORS |
| `proyecto-componentes` | Crear/modificar componentes, responsabilidades |
| `proyecto-refactorizacion` | Refactorizar con Module Pattern |
| `proyecto-estilos` | CSS, z-index, patrones UI |
| `proyecto-troubleshooting` | Problemas y soluciones |

## Patrón de Diseño

Los componentes JavaScript usan **Module Pattern (IIFE + Revealing Module)**.
Ver `/proyecto-refactorizacion` para detalles del patrón.

## Normas de Comunicación

- Responder de forma técnica y directa
- Explicar el "qué" y el "por qué" de los cambios
- No ser conversacional ni iniciar con saludos
- Antes de modificar: revisar documentación en `docs/`

## Datos del Proyecto

- **Redes Sociales**:
  - Facebook: `https://www.facebook.com/masters.herramientas/`
  - Instagram: `https://www.instagram.com/masterenherramientasyservisios/`
  - WhatsApp: `https://wa.me/573165345675`

- **Equipos**: 38 equipos en 8 categorías
- **Componentes activos**: 13
- **Última actualización**: 20 abril 2026