# Agente: Estilos del Proyecto

## ⚠️ ARQUITECTURA - REGLAS OBLIGATORIAS

### Stack del Proyecto
- **Vanilla JS** - NO frameworks
- **HTML estático** para GitHub Pages
- **NO** node_modules, Webpack, Vite

### Comunicación
- **EventEmitter** para Pub/Sub
- **NO** estado global complejo

---

## Arquitectura CSS: ITCSS (Inverted Triangle CSS)

Se utiliza la metodología **ITCSS** para organizar los estilos de forma escalable y mantenible.

### Estructura de Carpetas Implementada

```
assets/css/
├── 1-settings/              # Variables CSS y configuración ✓
│   ├── _variables.css       # Colores, espaciado, breakpoints
│   ├── _theme-light.css     # Variables del tema claro
│   └── _theme-dark.css      # Variables del tema oscuro + selectores [data-theme]
│
├── 2-tools/                 # Mixins y funciones (opcional - no implementado)
│
├── 3-generic/               # Reset y normalize ✓
│   └── _reset.css
│
├── 4-elements/              # Elementos HTML base ✓
│   └── _typography.css
│
├── 5-components/            # Componentes UI reutilizables ✓
│   ├── _buttons.css
│   ├── _cards.css
│   └── _nav-tabs.css
│
├── 6-layouts/               # Estructuras de página ✓
│   └── _sections.css
│
├── 7-themes/                # Variaciones de tema (SOLO selectores [data-theme]) ✓
│   └── _dark-mode.css
│
├── 8-utilities/             # Clases utilitarias ✓
│   └── _helpers.css
│
├── main.css                 # Punto de entrada - importa todos los archivos
├── styles.css               # LEGACY - en desuso
└── dark-mode.css            # LEGACY - en desuso (mantenido por compatibilidad)
```

### Reglas de ITCSS

1. **Orden de importación obligatorio**:
   ```
   1-settings → 2-tools → 3-generic → 4-elements →
   5-components → 6-layouts → 7-themes → 8-utilities
   ```

2. **Principio de especificidad creciente**: Los selectores más genéricos van primero

3. **Separación de responsabilidades**:
   - `7-themes/_dark-mode.css` → SOLO selectores `[data-theme="dark"]` o `[data-theme="light"]`
   - NO duplicar estilos de componentes en archivos de tema

4. **Variables CSS obligatorias** para:
   - Colores primarios, secundarios, de fondo
   - Espaciado (spacing)
   - Radios de borde
   - Sombras
   - Transiciones

---

## Carga de CSS en index.html

El orden de carga es importante para la especificidad:

```html
<!-- 1. Componentes específicos (mayor especificidad, se cargan primero) -->
<link rel="stylesheet" href="components/equipos/equipos.css">
<link rel="stylesheet" href="components/dark-mode/dark-mode.css">
<link rel="stylesheet" href="components/gallery/gallery.css">
<link rel="stylesheet" href="components/nosotros/nosotros.css">
<link rel="stylesheet" href="components/navigation/navigation.css">
<link rel="stylesheet" href="assets/css/cookie-menu.css">

<!-- 2. Arquitectura ITCSS (valores por defecto, se carga después) -->
<link rel="stylesheet" href="assets/css/main.css">
```

---

## Galería Interactiva (Lightbox con Fichas Técnicas)

### Funcionalidad
- Se abre al hacer clic en cualquier imagen de equipo en las filas Netflix
- Muestra galería de imágenes con navegación (anterior/siguiente)
- **Panel izquierdo (400px - Especificaciones)**: Descripción, datos básicos (categoría, disponibilidad), características técnicas y accesorios
- **Panel central (500px)**: Imagen principal con miniaturas de retroalimentación, perfectamente centrada
- **Panel derecho (400px - Normas de Alquiler)**: Políticas y condiciones para alquilar equipos
- Botón de WhatsApp para cotizar el equipo directamente

### Formato de datos esperado por `Gallery.open()`

```javascript
Gallery.open(imagesArray, titulo, waLink, specsData);
```

**Parámetros:**
- `imagesArray`: `string[]` - Array de URLs de imágenes del equipo
- `titulo`: `string` - Nombre del equipo
- `waLink`: `string` - URL de WhatsApp con mensaje predefinido
- `specsData`: `Object` - Datos de ficha técnica

**Estructura de `specsData`:**
```javascript
{
  titulo: "Taladro Magnético",           // string
  datos: {                               // object con key-value pairs
    "Categoría": "perforacion",
    "Disponible": "Sí" | "No"
  },
  caracteristicas: "Diámetro máximo: 13mm\nPotencia: 1100W\n...", // string con \n
  descripcion: "Taladro magnético para perforación en metal...",  // string (opcional)
  normas: "1. Identificarse a nombre...\n2. Solicitar con anticipación..." // string (opcional)
}
```

**Importante:** `caracteristicas` DEBE ser un **string con saltos de línea `\n`**, NO un array.

### Transformación crítica en `loader.js`

Los datos de `equipos.json` tienen `caracteristicas` como **array de strings**. Debe transformarse a string con saltos de línea antes de pasar a `Gallery.open()`:

```javascript
// components/equipos/loader.js - _renderNetflixItem() ~líneas 128-151
const specsData = {
  titulo: equipo.nombre,
  datos: {
    "Categoría": equipo.categoria,
    "Disponible": equipo.disponible ? "Sí" : "No"
  },
  // Transformación array → string con \n
  caracteristicas: Array.isArray(equipo.caracteristicas)
    ? equipo.caracteristicas.join('\n')
    : (equipo.caracteristicas || ''),
  descripcion: equipo.descripcion || '',
  normas: `1. Identificarse a nombre de quien va a hacer el alquiler persona natural o juridica
2. Solicitar con anticipación el alquiler de los equipos...
...` // string multilinea
};

Gallery.open(allImages, equipo.nombre, waLink, specsData);
```

**⚠️ ERROR común:** Pasar el objeto `equipo` completo SIN transformación causa:
```
Uncaught TypeError: specs.caracteristicas.split is not a function
```
Esto ocurre porque `gallery.js` hace `specs.caracteristicas.split('\n')` esperando un string, pero recibe un array.

### Validación defensiva en `gallery.js`

La galería incluye validación robusta en `_buildEspecificacionesHTML()` (líneas 168-172):

```javascript
const caracteristicasStr = typeof specs.caracteristicas === 'string'
  ? specs.caracteristicas
  : Array.isArray(specs.caracteristicas)
    ? specs.caracteristicas.join('\n')
    : String(specs.caracteristicas || '');

if (caracteristicasStr.trim()) {
  html += caracteristicasStr.split('\n')...
}
```

Esto proporciona fallback si los datos vienen mal formados, pero la transformación correcta debe hacerse en `loader.js`.

### Layout CSS (Abril 2026) - 3 paneles

**Estructura de tabla CSS:**

```css
.gallery-container {
  display: table;
  width: 100%;
  table-layout: fixed;
}

.gallery-specs-left,
.gallery-specs-right {
  display: table-cell;
  width: 400px;
  vertical-align: top;
  padding: 1.5rem;
  background: rgba(20, 20, 40, 0.95);
}

.gallery-content-wrapper {
  display: table-cell;
  width: 500px;
  vertical-align: middle;
  text-align: center;
  padding: 1rem;
}
```

**Responsive (móvil < 1024px):**
```css
@media (max-width: 1024px) {
  .gallery-container {
    display: block !important;
  }
  .gallery-specs-left,
  .gallery-specs-right,
  .gallery-content-wrapper {
    display: block !important;
    width: 100% !important;
  }
}
```

### Inicialización y ciclo de vida

1. **Auto-inicialización:** `Gallery.init()` se llama automáticamente en `DOMContentLoaded` o inmediatamente si el DOM ya está listo.
2. **Event listeners adjuntados en `_init()`:**
   - Cerrar: click en overlay (fuera del contenido) o botón `×`
   - Navegación: botones ‹ › y teclas `ArrowLeft`/`ArrowRight`
   - Tecla `Escape`: cerrar lightbox
3. **body overflow:** Se bloquea (`overflow: hidden`) al abrir, se restaura al cerrar.
4. **Estado:** `_state.isOpen` rastrea si la galería está abierta.

### Errores comunes y debugging

| Síntoma | Causa probable | Solución |
|---------|----------------|----------|
| `Gallery is not defined` (console) | `gallery.js` no cargado o error de sintaxis | Verificar Network tab, sin `SyntaxError` |
| Galería no abre, sin errores | `Gallery.open` no llamado | Agregar `console.log` en click handler |
| `Uncaught TypeError: specs.caracteristicas.split is not a function` | `caracteristicas` no es string (es array/undefined) | Transformar array → string en `loader.js` con `.join('\n')` |
| Lightbox vacío o sin estilos | `gallery.css` no cargado o `_init()` no ejecutada | Verificar `Gallery.init()` llamado, CSS presente |
| Botón X (cerrar) recarga la página | Botón dentro de un formulario, event listener no adjuntado o evento propagado | **Solución (Abril 2026):** Botón de cierre se inserta como hermano del lightbox (`#gallery-close-fixed`) con `type="button"`, `onclick="return false"` y listener directo. Evita estar dentro de formularios. |
| Botones de navegación no funcionan | Event listeners no adjuntos | Verificar que `_init()` complete sin errors, check `lightbox` element exists |
| Imágenes no cambian | `_renderThumbnails()` no llamado | Llamar después de `open()` |

### Archivos relacionados

- **`components/gallery/gallery.js`** - Lógica del lightbox (Module Pattern IIFE)
- **`components/gallery/gallery.css`** - Estilos del lightbox, paneles laterales, responsive
- **`components/equipos/loader.js`** - Carga de datos JSON, renderizado de filas Netflix, transformación de datos para Gallery
- **`components/equipos/equipos.css`** - Estilos de Netflix rows, items, scroll buttons

### Z-Index (actualizado)

| Componente | z-index |
|------------|---------|
| Gallery Lightbox | 10002 |
| Social Buttons | 10001 |
| Chat Widget | 10000 |
| Header / Dropdown | 1000 |
| Overlay (dropdown) | 998 |

---

## Sección Equipos - Estilos

### Fondo azul oscuro (ambos modos)

El fondo degradado azul oscuro debe mantenerse en ambos temas (claro y oscuro) para consistencia de diseño:

```css
#equipos {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%) !important;
}

/* Forzar también en modo claro */
[data-theme="light"] #equipos {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%) !important;
}
```

### Netflix items (tarjetas de equipos)

Cada tarjeta debe tener fondo oscuro y título legible:

```css
.netflix-item {
  background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%) !important;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s ease-out;
}

.netflix-item:hover {
  transform: scale(1.05);
}

.netflix-item-title {
  color: #ffffff !important;
  background: rgba(20, 20, 40, 0.95) !important;
  padding: 0.5rem;
  font-size: 0.9rem;
  text-align: center;
}

/* Modo claro: forzar mismos estilos oscuros */
[data-theme="light"] .netflix-item {
  background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%) !important;
}

[data-theme="light"] .netflix-item-title {
  color: #ffffff !important;
  background: rgba(20, 20, 40, 0.95) !important;
}
```

### Títulos de categorías (Netflix rows)

Los títulos de cada fila (ej: "Elevación y Levante") deben ser siempre visibles:

```css
.netflix-category-title {
  color: #ffffff !important;
  opacity: 1 !important;
  visibility: visible !important;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}

[data-theme="light"] .netflix-category-title {
  color: #ffffff !important;
}
```

### Títulos principales de sección

El título "Equipos Disponibles para Alquiler" y subtítulo:

```css
#equipos h2,
#equipos .text-center,
#equipos p.lead {
  color: #ffffff !important;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5) !important;
}
```

### Botones de categoría (Category Tabs)

Ajustes para que los botones no se vean pequeños y quepan en el renglón:

```css
#equipos .category-tabs {
  display: flex !important;
  flex-wrap: wrap !important;
  justify-content: flex-start !important;
  gap: 0.5rem !important;
  margin-bottom: 1.5rem;
}

#equipos .category-tabs .nav-link {
  padding: 0.5rem 1rem !important;
  font-size: 0.85rem !important;
  flex-shrink: 0 !important;
  border-radius: 20px !important;
  transition: all 0.1s ease-out !important;
}

#equipos .category-tabs .nav-link.active {
  background-color: #800020 !important; /* Burdeos */
  color: #ffffff !important;
}
```

---

## Z-Index (orden de prioridad)

Jerarquía de capas para superposiciones:

| Componente | z-index | Notas |
|------------|---------|-------|
| Gallery Lightbox | 10002 | sobre todo lo demás |
| Social Buttons | 10001 | fijo en esquina inferior derecha |
| Chat Widget | 10000 | flotante,clickeable |
| Header / Dropdown | 1000 | nav bar fijo arriba |
| Overlay (dropdown) | 998 | cubre pantalla completa |
| Netflix Scroll Btns | 100 | dentro de cada fila |

---

## Patrones de Carga

### 1. Scripts con `defer` (orquestación)

```html
<div id="header-app"></div>
<script src="components/header/header.js" defer></script>
```
- `defer` garantiza ejecución tras parseo completo, en orden de aparición.
- `header.js` inyecta dinámicamente scripts de dependencias mediante `appendChild('script')`.

### 2. Carga Lazy (con fetch + DOM injection)

```javascript
lazyLoad('footer-container', 'components/footer/footer.html', 'components/footer/footer.css');
```
- Carga bajo demanda de HTML+CSS de componentes no críticos (footer, nosotros, FAQ).
- Usa `fetch()` para obtener HTML y lo inyecta con `innerHTML`.
- Carga CSS dinámicamente creando `<link>` element.

### 3. Scripts clásicos independientes

```html
<script src="assets/js/chat-widget.js" defer></script>
```
- Para componentes simples que no requieren módulos ES6.
- Se cargan con `defer` para no bloquear render.

---

## Reglas de Desarrollo CSS

1. **Estilos globales**: Solo en `/assets/css/` (estructura ITCSS)
2. **Componentes autocontenidos**: Cada componente tiene su propio CSS en su carpeta
3. **z-index**: Respetar la jerarquía de capas (Gallery 10002 > Social 10001 > Chat 10000 > Header 1000)
4. **Transiciones**: 0.1s ease-out para animaciones UI, 0.3s para hover effects
5. **GitHub Pages**: Todos los `href` y `src` usan rutas relativas (sin `/` inicial)
6. **Variables CSS**: Usar variables (`var(--color-primary)`) en lugar de valores hardcoded
7. **NO duplicar**: No repetir selectores en múltiples archivos (evitar conflictos de especificidad)
8. **Dark Mode**: Solo en `7-themes/_dark-mode.css`, nunca en archivos de componentes
9. **Overrides de seguridad**: Usar `!important` solo cuando sea necesario para mantener funcionalidad crítica (galería, Netflix items, títulos)
10. **Layouts complejos**: Usar `display: table` para estructuras de 3 columnas (galería), `flex` para navs y grids
11. **Responsive**: Probar en móvil (< 768px), tablet (< 1024px), desktop
12. **Accesibilidad**: Mantener `aria-label`, `role`, contraste de colores AA mínimo

---

## Estructura de CSS Global (LEGACY - En migración)

```
assets/css/
├── style.css          # Estilos principales (LEGACY) - se migrará a ITCSS
├── dark-mode.css      # En migración a 7-themes/ (LEGACY) - mantener por compatibilidad
└── components/        # Estilos por componente (LEGACY) - en proceso de migración
```

> ⚠️ **En desuso**: Los estilos de componentes se migrarán gradualmente a `5-components/`. NO agregar nuevos estilos en `assets/css/components/`.

---

## Patrones UI

### Overlay para Dropdown
- `position: fixed; top: 0; left: 0; width: 100%; height: 100%;`
- `background: rgba(0,0,0,0.5)`
- `z-index: 998`
- Cierra dropdown al hacer click fuera

### Grid de Equipos (Netflix-style)
- Filas horizontales (`.netflix-row`) con scroll
- Cada fila: header (título + botones ‹ ›) + content (`.netflix-row-content`)
- Items: `.netflix-item` con imagen + título + botón WhatsApp
- Scroll horizontal con `scrollBy({ behavior: 'smooth' })`

### FAQ Accordion
- Transiciones de 0.1s ease-out
- Categorías: Empresa/Ubi, Servicios, Alquiler, Contacto
- Carga lazy via ComponentFactory

### Reloj (Horario)
- Carga lazy (300ms delay)
- Inicialización después de que el DOM elemento existe
- Actualización cada segundo con `setInterval`

---

## Troubleshooting - Errores CSS comunes

### Título principal "Equipos Disponibles" no visible
**Síntoma:** El texto blanco se pierde sobre fondo blanco en modo claro.
**Solución:**
```css
#equipos h2,
#equipos .text-center,
#equipos p.lead {
  color: #ffffff !important;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5) !important;
}
```

### Botones de categoría muy pequeños
**Problema:** No caben todos en una línea.
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

### Netflix items sin fondo oscuro en modo claro
**Problema:** Items se ven con fondo blanco, no contrastan.
**Solución:**
```css
.netflix-item {
  background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%) !important;
}
[data-theme="light"] .netflix-item {
  background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%) !important;
}
```

### Galería no carga o muestra error split
**Problema:** `Uncaught TypeError: specs.caracteristicas.split is not a function`
**Causa:** `caracteristicas` es array, no string.
**Solución:** En `loader.js` transformar:
```javascript
caracteristicas: Array.isArray(equipo.caracteristicas)
  ? equipo.caracteristicas.join('\n')
  : (equipo.caracteristicas || '')
```

---

## Historial de cambios críticos

### Abril 2026 - Galería layout de 3 paneles
- Se rediseñó gallery.js para layout con 2 paneles laterales (400px) + central (500px)
- Se separó `_buildSpecsHTML` en `_buildEspecificacionesHTML` y `_buildNormasHTML`
- Se añadió validación robusta de `caracteristicas` (array → string) en ambas funciones
- **Corrección crítica:** Se eliminó código duplicado de `_init()` y líneas sueltas que causaban `SyntaxError`

### Abril 2026 - loader.js scrollRow corregido
- `scrollRow` ahora hace scroll directo sobre el elemento con ID (que YA es `.netflix-row-content`)
- Se eliminó búsqueda redundante con `querySelector('.netflix-row-content')`
- Se añadió logging detallado para debugging

### Abril 2025 - Filtros de categoría rotos
- `equipos-dropdown.js` sobrescribía `window.handleCategoryClick` sin aplicar filtro
- Se añadió `onclick` inline en botones de categorías
- Se hizo que `equipos-dropdown.js` llame a `CategoryFilter.handleCategoryClick` antes de cerrar

### Abril 2025 - FAQ accordion
- FAQ carga lazy via ComponentFactory
- Se añadió listener `component:loaded` para inicializar después de carga dinámica
- Fallback de 500ms para reinicializar si no se cargó

### Abril 2025 - Reloj no aparece
- `horario.js` carga lazy (300ms)
- Se movió búsqueda de elementos DOM dentro de `inicializarReloj()`
- Se añadieron listeners para `component:loaded` y fallback timeout
