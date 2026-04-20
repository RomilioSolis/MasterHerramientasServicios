# Master Herramientas y Servicios

Proyecto web para alquiler de herramientas y servicios de construcción en Cali, Colombia.

## ⚠️ Arquitectura del Proyecto - REGLAS OBLIGATORIAS

### Stack Tecnológico
- **Vanilla JS** - NO frameworks (React, Vue, Angular)
- **HTML estático** - NO Server-Side Rendering
- **GitHub Pages** - Hosting estático
- **PROHIBIDO**: node_modules, Webpack, Vite, Parcel

### Comunicación entre Componentes
- **EventEmitter** (`assets/js/event-emitter.js`) - Pub/Sub
- **CustomEvent** - fallback para compatibilidad
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
EventEmitter.emit('evento', { data: 1 });
// Escuchar evento
EventEmitter.on('evento', (data) => { /* ... */ });
```

---

## Estructura del Proyecto

```
MasterHerramientasServicios/
├── index.html              # Página principal (~560 líneas)
├── nosotros.html          # Página nosotros
├── components/            # Componentes autocontenidos
│   ├── social-buttons/     # Botones flotantes redes sociales
│   ├── back-to-top/       # Botón volver arriba
│   ├── header/            # Header dinámico
│   ├── lateral-menu/      # Menú lateral
│   ├── equipos-grid/     # Grid de equipos (cards)
│   ├── equipos/          # Netflix rows
│   ├── footer.html       # Footer
│   ├── contacto.html     # Sección contacto
│   ├── faq.html          # Preguntas frecuentes
│   └── dark-mode/        # Toggle modo oscuro
├── assets/
│   ├── css/               # Estilos GLOBALES
│   ├── js/                # Scripts GLOBALES
│   └── imagenes/          # Imágenes
└── docs/                  # Documentación
```

## Componentes

### Equipos Grid (components/equipos-grid/)
Grid de cards de equipos generados dinámicamente:
- 19 equipos en 8 categorías
- Schema.org markup embebido
- Botones WhatsApp y teléfono

### Social Buttons (components/social-buttons/)
Botones flotantes de redes sociales:
- Facebook
- Instagram  
- WhatsApp

El componente `back-to-top` se importa automáticamente.

### Back To Top (components/back-to-top/)
Botón flotante para volver al inicio de la página.
- Aparece después de hacer scroll 300px
- Animación smooth scroll

## Refactorización

El index.html fue refactorizado:
- **Antes**: 2814 líneas con 19 articles estáticos
- **Después**: ~560 líneas

Los equipos ahora se cargan desde `components/equipos-grid/`.

## Desarrollo

El proyecto usa carga de componentes para mejorar el rendimiento:
- Header: carga inmediata
- Equipos Grid: carga inmediata  
- Equipos Loader (Netflix rows): carga lazy
- Footer, Contacto, FAQ, Social Buttons: carga lazy
