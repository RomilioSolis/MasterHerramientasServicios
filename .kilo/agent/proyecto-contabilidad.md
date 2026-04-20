# Agente: Master Herramientas y Servicios

## Descripción
Este agente conoce la estructura, componentes y módulos del proyecto Master Herramientas y Servicios. Aplica las normas de desarrollo del proyecto para responder y desarrollar funcionalidades.

---

## Estructura del Proyecto

```
MasterHerramientasServicios/
├── index.html                    # Página principal
├── nosotros.html                # Página nosotros
├── components/                  # Componentes autocontenidos
│   ├── social-buttons/           # Botones flotantes redes sociales (right)
│   ├── back-to-top/              # Botón volver arriba
│   ├── chat-widget/              # Chat flotante WhatsApp (left)
│   ├── header/                   # Header dinámico
│   ├── lateral-menu/               # Menú lateral
│   ├── horario/                 # Horario con reloj en tiempo real
│   ├── gallery/                  # Galería interactiva (lightbox)
│   ├── navigation/               # Navegación
│   ├── equipos-grid/              # Grid de equipos (cards Bootstrap)
│   ├── equipos/                  # Netflix rows (carga dinámica)
│   ├── footer/                   # Footer (lazy load)
│   ├── contacto/                 # Sección contacto (lazy load)
│   └── faq/                     # Preguntas frecuentes (lazy load)
├── assets/
│   ├── css/                      # Estilos GLOBALES
│   └── js/                       # Scripts GLOBALES
└── docs/                         # Documentación
```

---

## Componentes y su Responsabilidad

### Social Buttons (`components/social-buttons/`)
- **Ubicación**: Ladoderecho, `right: 20px`, centrado verticalmente
- **Botones**: Facebook, Instagram, WhatsApp
- **Carga**: Módulo ES6 + lazy load (1000ms)
- **Importa**: Automaticamente back-to-top

### Chat Widget (`components/chat-widget/`)
- **Ubicación**: Lado izquierdo, `left: 20px`, `bottom: 85px`
- **Carga**: Lazy load (500ms) + módulo ES6 (800ms)
- **JS**: Importa `assets/js/chat-widget.js`

### Contacto (`components/contacto/`)
- **Componente autocontenido**: HTML + CSS + JS
- **HTML**: `contacto.html`
- **CSS**: `contacto.css` 
- **JS**: `contacto.js` (inicializa mapa con Leaflet)
- **Carga**: Lazy load desde index.html

### Equipos Loader (`components/equipos/loader.js`)
- **Función**: Genera filas tipo Netflix con scroll horizontal
- **Categorías**: 8 categorías, 37 equipos
- **Carga**: Dinámica mediante fetch

### Footer (`components/footer/`)
- **Componente autocontenido**: HTML + CSS
- **HTML**: `footer.html`
- **CSS**: `footer.css`
- **Carga**: Lazy load desde index.html

### Header (`components/header/`)
- **Función**: Orchestrator - carga todo el header + menú lateral + buscador
- **Carga**: Inmediata con módulo ES6

### Category Buttons (`components/category-buttons/`)
- **JS**: `category-buttons.js` (datos y funciones de pestañas)
- **Carga**: Script en línea en index.html

### Category Filter (`components/category-filter/`)
- **JS**: `category-filter.js` (filtrado de equipos)
- **Carga**: Script en línea en index.html

### Nosotros (`components/nosotros/`)
- **Componente autocontenido**: HTML + CSS + JS
- **HTML**: `nosotros.html`
- **CSS**: `nosotros.css`
- **JS**: `nosotros.js` (video + mapa Leaflet)
- **Carga**: Lazy load desde index.html

### Horario (`components/horario/`)
- **Componente autocontenido**: HTML + CSS + JS
- **HTML**: `horario.html`
- **CSS**: `horario.css`
- **JS**: `horario.js` (reloj en tiempo real, abierto/cerrado dinámico)
- **Carga**: Lazy load desde index.html
- **Horario**: Lun-Vie 8AM-6PM, Sáb 8AM-4PM, Dom cerrado
- **Zona horaria**: America/Bogota

### Gallery (`components/gallery/`)
- **Componente autocontenido**: HTML + CSS + JS
- **HTML**: `gallery.html`
- **CSS**: `gallery.css`
- **JS**: `gallery.js` (lightbox interactivo)
- **Carga**: Inmediata (script en head)
- **Funciones**: `Gallery.open(images, title, waLink)`, `Gallery.prev()`, `Gallery.next()`, `Gallery.close()`
- **Uso**: Click en imagen de Netflix rows abre galería con todas las imágenes del equipo
- **Navegación**: Teclas flechas, Escape, click fuera

### FAQ (`components/faq/`)
- **Componente autocontenido**: HTML + CSS + JS
- **HTML**: `faq.html` (estructura con 4 categorías, sidebar navegación)
- **CSS**: `faq.css` (transiciones CSS optimizadas)
- **JS**: `faq.js` (accordion vanilla, scroll suave)
- **Carga**: Lazy load desde index.html
- **Categorías**: Empresa y Ubicación - Servicios - Alquiler - Contacto
- **Navegación sidebar**: Botones con `data-target` (no href)
- **Transiciones**: 0.1s ease-out (respuesta), 0.08s (toggle)
- **Última actualización**: 20 abril 2026

### Lateral Menu (`components/lateral-menu/`)
- **Expide funciones**: `openLateralMenu()`, `closeLateralMenu()`
- **Carga**: Importado por header.js

---

## Patrones de Carga

### 1. Carga Inmediata
```html
<div id="header-app"></div>
<script type="module" src="/components/header/header.js"></script>
```

### 2. Carga Lazy (con fetch)
```javascript
lazyLoad('footer-container', '/components/footer.html', '/assets/css/footer.css');
```

### 3. Módulo ES6
```javascript
import SocialButtons from '/components/social-buttons/social-buttons.js';
```

---

## Reglas de Desarrollo

1. **Componentes autocontenidos**: Cada componente en su carpeta dentro de `/components/`
2. **Estilos globales**: Solo en `/assets/css/`
3. **Scripts globales**: Solo en `/assets/js/`
4. **No hardcodear**: Contenido dinámico va en componentes, no en index.html
5. **Lazy load**: Para componentes no críticos (footer, faq, contacto)
6. **z-index**: Botones sociales (10001), Chat widget (10000)

---

## Estado de Componentes

| Componente | Estado |
|------------|--------|
| equipos-grid | ✅ ACTIVO |
| social-buttons | ✅ ACTIVO |
| back-to-top | ✅ ACTIVO |
| header | ✅ ACTIVO |
| lateral-menu | ✅ ACTIVO |
| navigation | ✅ ACTIVO |
| footer | ✅ ACTIVO |
| contacto | ✅ ACTIVO |
| faq | ✅ ACTIVO |
| chat-widget | ✅ ACTIVO |
| horario | ✅ ACTIVO |
| gallery | ✅ ACTIVO |

---

## Cómo Crear un Nuevo Componente

1. Crear carpeta en `components/{nombre}/`
2. Crear `{nombre}.html`, `{nombre}.css`, `{nombre}.js`
3. Agregar script módulo en `index.html`

```html
<div id="mi-componente-container"></div>
<script type="module" src="/components/mi-componente/mi-componente.js"></script>
```

---

## Troubleshooting Común

### Botones sociales no aparecen
- Verificar z-index: 10001
- Revisar DevTools Console por errores

### Netflix rows no aparecen
- Verificar que `/components/equipos/loader.js` se ejecuta
- Revisar `#netflixRows` en DOM

### Error 404
- Verificar que el archivo existe en la ruta correcta
- Verificar que el servidor está corriendo

---

## Datos del Proyecto

- **Redes Sociales**:
  - Facebook: `https://www.facebook.com/masters.herramientas/`
  - Instagram: `https://www.instagram.com/masterenherramientasyservisios/`
  - WhatsApp: `https://wa.me/573165345675`

- **Equipos**: 38 equipos en 8 categorías (incluye Taladro Magnético)
- **Última actualización**: 18 abril 2026 (galería interactiva + Taladro Magnético)

---

## Normas de Comunicación

- Responder de forma técnica y directa
- Explicar el "qué" y el "por qué" de los cambios
- No ser conversacional ni iniciar con saludos
- Antes de modificar: revisar documentación en `docs/`