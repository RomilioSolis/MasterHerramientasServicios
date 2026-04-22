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

## Cambios Aplicados y Correcciones

### 1. Botones de Categorías (Category Tabs)
- **Problema**: Botones muy pequeños, no cabían todos, se perdían en el renglon
- **Solución**:
  - Contenedor con `flex-wrap: wrap` para que pasen a siguiente línea
  - Tamaño de botones: `padding: 0.5rem 1rem`, `font-size: 0.85rem`
  - Breakpoints responsivos para diferentes tamaños de pantalla

### 2. Títulos de Categorías (Netflix Category Title)
- **Problema**: No se veían en modo claro
- **Solución**: Forzar color blanco con `!important`
  ```css
  .netflix-category-title {
    color: #ffffff !important;
  }
  [data-theme="light"] .netflix-category-title {
    color: #ffffff !important;
  }
  ```

### 3. Sección Equipos - Fondo Azul Oscuro
- **Problema**: Fondo no se mantenía en modo claro
- **Solución**: Forzar fondo en ambos modos
  ```css
  #equipos {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%) !important;
  }
  [data-theme="light"] #equipos {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%) !important;
  }
  ```

### 4. Netflix Items y Títulos
- **Problema**: Items sin fondo oscuro en modo claro
- **Solución**: Forzar fondo azul oscuro y texto blanco
  ```css
  .netflix-item {
    background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%) !important;
  }
  .netflix-item-title {
    color: #ffffff !important;
    background: rgba(20, 20, 40, 0.95) !important;
  }
  ```

### 5. Títulos Principales de Sección Equipos
- **Problema**: "Equipos Disponibles para Alquiler" y subtítulo no visibles
- **Solución**: Forzar color blanco con sombra
  ```css
  #equipos h2,
  #equipos .text-center,
  #equipos p {
    color: #ffffff !important;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5) !important;
  }
  ```

---

## Z-Index (orden de prioridad)

| Componente | z-index |
|------------|---------|
| Social Buttons | 10001 |
| Chat Widget | 10000 |
| Header / Dropdown | 1000 |
| Overlay (dropdown) | 998 |

---

## Patrones de Carga

### 1. Scripts con `defer` (orquestación)
```html
<div id="header-app"></div>
<script src="components/header/header.js" defer></script>
```
- `defer` garantiza ejecución tras parseo, en orden.
- `header.js` inyecta dinámicamente scripts de dependencias mediante `appendChild('script')`.

### 2. Carga Lazy (con fetch)
```javascript
lazyLoad('footer-container', 'components/footer/footer.html', 'components/footer/footer.css');
```
- Carga bajo demanda de HTML+CSS de componentes no críticos.

### 3. Scripts clásicos independientes
```html
<script src="assets/js/chat-widget.js" defer></script>
```
- Para componentes simples que no requieren módulos ES6.

---

## Reglas de Desarrollo CSS

1. **Estilos globales**: Solo en `/assets/css/` (estructura ITCSS)
2. **Componentes autocontenidos**: Cada componente tiene su propio CSS en su carpeta
3. **z-index**: Respetar la jerarquía de capas (overlay < dropdown < chat < social)
4. **Transiciones**: 0.1s ease-out para animaciones UI
5. **GitHub Pages**: Todos los `href` de CSS usan rutas relativas
6. **Variables CSS**: Usar variables en lugar de valores hardcoded
7. **NO duplicar**: No repetir selectores en múltiples archivos
8. **Dark Mode**: Solo en `7-themes/`, nunca en archivos de componentes
9. **Overrides de seguridad**: Usar `!important` solo cuando sea necesario para mantener funcionalidad

---

## Estructura de CSS Global (LEGACY - En migración)

```
assets/css/
├── style.css          # Estilos principales (LEGACY)
├── dark-mode.css      # En migración a 7-themes/ (LEGACY)
└── components/        # Estilos por componente (LEGACY)
```

> ⚠️ **En desuso**: Los estilos de componentes se migrarán gradualmente a `5-components/`

---

## Patrones UI

### Overlay para Dropdown
- `position: fixed; top: 0; left: 0; width: 100%; height: 100%;`
- `background: rgba(0,0,0,0.5)`
- `z-index: 998`
- Usar para cerrar dropdown al hacer click fuera

### Grid de Equipos
- Bootstrap cards con `.netflix-row` y `.netflix-item`
- Scroll horizontal con botones left/right por fila

### FAQ Accordion
- Transiciones de 0.1s ease-out
- Categorías: Empresa/Ubi, Servicios, Alquiler, Contacto