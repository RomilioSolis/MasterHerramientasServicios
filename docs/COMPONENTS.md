# Estructura del Proyecto

## ⚠️ ARQUITECTURA - REGLAS OBLIGATORIAS

### Stack Tecnológico
- **Vanilla JS** - NO frameworks
- **HTML estático** para GitHub Pages
- **NO** node_modules, Webpack, Vite

### Comunicación
- **EventEmitter** para Pub/Sub
- **NO** estado global complejo

---

## Estructura Final

```
MasterHerramientasServicios/
├── index.html                    # Página principal (REFACTORIZADO)
├── nosotros.html                 # Página nosotros
├── components/                   # Componentes autocontenidos
│   ├── social-buttons/
│   │   ├── social-buttons.html
│   │   ├── social-buttons.css
│   │   └── social-buttons.js
│   ├── back-to-top/
│   │   ├── back-to-top.html
│   │   ├── back-to-top.css
│   │   └── back-to-top.js
│   ├── header/
│   │   ├── header.html
│   │   ├── header.css
│   │   ├── header.js
│   │   └── header-logo.css
│   ├── lateral-menu/
│   │   ├── lateral-menu.html
│   │   ├── lateral-menu.css
│   │   └── lateral-menu.js
│   ├── navigation/
│   │   ├── navigation.html
│   │   └── navigation.css
│   ├── equipos-grid/             # NUEVO: Grid de equipos
│   │   ├── equipos-grid.html
│   │   ├── equipos-grid.css
│   │   └── equipos-grid.js
│   ├── equipos/                  # Netflix rows (cargado dinámicamente)
│   │   └── loader.js
│   ├── footer/
│   ├── contacto/
│   ├── faq/
│   ├── chat-widget/
│   └── dark-mode/
├── assets/
│   ├── css/                     # Estilos GLOBALES
│   │   ├── styles.css
│   │   ├── header-modern.css
│   │   ├── cookie-menu.css
│   │   └── ...
│   └── js/                      # Scripts GLOBALES
│       ├── main.js
│       └── buscador-unificado.js
├── docs/
└── README.md
```

---

## Refactorización index.html

### Reducción de tamaño

| Métrica | Antes | Después | Reducción |
|---------|-------|---------|-----------|
| Líneas | 2814 | ~444 | **84%** |
| Articles duplicados | 19 | 0 | **100%** |

### Qué se movió a componentes

- **Equipos cards (19)** → `components/equipos-grid/`
- **Social buttons** → `components/social-buttons/`
- **Back to top** → `components/back-to-top/`

### Código Que Permanece en index.html

| Sección | Código | Estado |
|---------|--------|--------|
| Header | `#header-app` + script módulo | ✅ ACTIVO |
| Lateral Menu | `#lateral-menu-container` | ✅ ACTIVO |
| Equipos Grid | `#herramientas-container` + script módulo | ✅ ACTIVO |
| Netflix Rows | `#netflixRows` + loader.js | ✅ ACTIVO |
| Social Buttons | `#social-buttons-container` | ✅ ACTIVO |
| Footer | `#footer-container` | ✅ ACTIVO |
| Contacto | `#contacto-container` | ✅ ACTIVO |
| FAQ | `#faq-container` | ✅ ACTIVO |
| Chat Widget | Botones inline | ✅ ACTIVO |

---

## Carga de Componentes (index.html actual)

```html
<!-- Header (carga inmediata) -->
<div id="header-app"></div>
<script type="module" src="/components/header/header.js"></script>

<!-- Equipos Grid (carga inmediata) -->
<div class="row" id="herramientas-container" role="list"></div>
<script type="module" src="/components/equipos-grid/equipos-grid.js"></script>

<!-- Netflix Rows (carga lazy) -->
<div class="netflix-rows-container" id="netflixRows"></div>
<script type="module" src="/components/equipos/loader.js"></script>

<!-- Componentes lazy (footer, contacto, faq, social-buttons) -->
<script type="module">
  import SocialButtons from '/components/social-buttons/social-buttons.js';
</script>
```

---

## Componentes y sus Responsabilidades

### Equipos Grid (components/equipos-grid/)
- **equipos-grid.html**: Contenedor vacío
- **equipos-grid.css**: Estilos para grid de cards
- **equipos-grid.js**: Genera las 19 cards dinámicamente con datos embebidos

### Social Buttons (components/social-buttons/)
- **social-buttons.js**: Carga CSS + importa back-to-top
- 3 botones: Facebook, Instagram, WhatsApp

### Back To Top (components/back-to-top/)
- **back-to-top.html**: Botón flotante
- **back-to-top.css**: Estilos
- **back-to-top.js**: Lógica scroll + importado por social-buttons

### Header (components/header/)
- **header.js**: Orchestrator - carga todo el header
- Carga el menú lateral
- Inicializa el buscador

### Lateral Menu (components/lateral-menu/)
- **lateral-menu.js**: Lógica + datos de categorías
- Genera el HTML del menú
- Expone funciones: `openLateralMenu()`, `closeLateralMenu()`, etc.

### Equipos Loader (components/equipos/)
- Genera Netflix-style rows con las cards
- Carga las páginas individuales de equipos

---

## Reglas de Organización

1. **components/** - Cada componente en su carpeta
2. **assets/css/** - Solo estilos globales
3. **assets/js/** - Solo scripts globales

---

## Cómo Crear un Nuevo Componente

1. Crear carpeta en `components/`
2. Crear `*.html`, `*.css`, `*.js`
3. Agregar script módulo en `index.html`

```html
<!-- Ejemplo -->
<div id="mi-componente-container"></div>
<script type="module" src="/components/mi-componente/mi-componente.js"></script>
```

---
## Estado de Reorganización

| Componente | Estado |
|------------|--------|
| equipos-grid | ✅ COMPLETADO |
| social-buttons | ✅ COMPLETADO |
| back-to-top | ✅ COMPLETADO |
| header | ✅ COMPLETADO |
| lateral-menu | ✅ COMPLETADO |
| navigation | ✅ COMPLETADO |
| footer | ✅ COMPLETADO |
| contacto | ✅ COMPLETADO |
| faq | ✅ COMPLETADO |
| chat-widget | ✅ COMPLETADO |
| horario | ✅ COMPLETADO |
| gallery | ✅ COMPLETADO |

---

## Equipos del Proyecto

### Total: 38 equipos en 8 categorías

| # | ID | Nombre | Categoría |
|---|-----|--------|-----------|
| 1 | gatos-hidraulicos | Gatos Hidraulicos | elevacion |
| 2 | gato-estibador | Gato Estibador | elevacion |
| 3 | ganchos-colgantes | Ganchos Colgantes | elevacion |
| 4 | winches | Winches | elevacion |
| 5 | pluma-grua | Pluma Grúa | elevacion |
| 6 | taladros | Taladros | perforacion |
| 7 | taladro-magnetico | Taladro Magnético | perforacion |
| 8 | extractores | Extractores | perforacion |
| 9 | sonda-electrica | Sonda Eléctrica | perforacion |
| 10 | esmeriladora | Esmeriladora | perforacion |
| 11 | equipo-oxicorte | Equipo Oxicorte | perforacion |
| 12 | cortadora-porcelanato | Cortadora Porcelanato | perforacion |
| 13 | extraccion-nucleos | Extracción Núcleos | perforacion |
| 14 | trompo-mezclador | Trompo Mezclador | mezclado |
| 15 | vibrocompactadora | Vibrocompactadora | mezclado |
| 16 | hidrolavadora | Hidrolavadora | limpieza |
| 17 | aspiradora-industrial | Aspiradora Industrial | limpieza |
| 18 | motobomba-sumergible | Motobomba Sumergible | limpieza |
| 19 | compresor | Compresor | soldadura |
| 20 | equipos-soldadura | Equipos de Soldadura | soldadura |
| 21 | planta-electrica | Planta Eléctrica | soldadura |
| 22 | andamios | Andamios | construccion |
| 23 | estanterias | Estanterías | construccion |
| 24 | parasoles | Parasoles | construccion |
| 25 | diferenciales | Diferenciales | movimiento |
| 26 | carretillas | Carretillas | movimiento |
| 27 | buggy | Buggy con Pico y Pala | movimiento |
| 28 | escaleras | Escaleras | jardin |
| 29 | motosierra | Motosierra | jardin |

### Imágenes por Equipo

Las imágenes se encuentran en: `/assets/imagenes/{NombreEquipo}/`

Ejemplo: `/assets/imagenes/TaladroMagnetico/` contiene:
- TaladroMagnetico1.jpeg
- TaladroMagnetico2.jpeg
- TaladroMagnetico3.jpeg

---

## Footer (components/footer.html)

### Estructura Actual
- **Ubicación**: `components/footer.html`
- **Carga**: Lazy load desde `index.html` (línea 2150)
- **Contiene**: Logo, información de contacto, redes sociales, links rápidos
- **CSS embebido**: En el mismo archivo HTML (líneas 90-406)

### Componente Footer.html
```
footer.modern-footer
├── .footer-wave (SVG decorativo - efecto ola en parte superior)
│   └── svg (viewBox: 0 0 1440 120)
└── .footer-content
    ├── .container
    │   ├── .row (grid Bootstrap)
    │   │   ├── .col-lg-4 (brand/logo)
    │   │   ├── .col-lg-4 (contacto)
    │   │   └── .col-lg-4 (redes sociales)
    │   └── .footer-bottom (copyright + badges)
```

### Problema Detectado: Espacio Debajo del Footer

**Causas**:
1. Footer wave con height:60px
2. Footer content padding: 2rem 0 1rem
3. Contenedor vacío en index.html con min-height:200px

**Solución Aplicada**:

| Archivo | Cambio |
|---------|--------|
| `index.html:464,2029` | `#footer-container` min-height: `200px` → `auto` |
| `index.html:465,2030` | `#social-buttons-container` min-height: `50px` → `auto` |
| `components/footer.html:103` | `.footer-wave` height: `60px` → `40px` |
| `components/footer.html:116` | `.footer-content` padding: `2rem 0 1rem` → `1rem 0 0.5rem` |

**Resultado**: ✅ Reducción del espacio debajo del footer

### Carga en index.html
```html
<!-- Footer Container -->
<div id="footer-container" style="min-height:200px;display:block"></div>
<div id="social-buttons-container" style="min-height:50px;display:block"></div>

<!-- Lazy load (línea 2150) -->
lazyLoad('footer-container', '/components/footer.html', '/assets/css/footer.css');
```

---

## Documentación relacionada

- `README.md` - Descripción general del proyecto
- `docs/ESTRUCTURA-PROYECTO.md` - Arquitectura y layout de componentes
- `docs/SEO.md` - Auditoría SEO y checklist vigente (2026-08-31)

---

## Contacto (components/contacto.html)
