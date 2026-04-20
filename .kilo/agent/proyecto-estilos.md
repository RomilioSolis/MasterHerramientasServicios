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

## Descripción
Conoce las reglas de estilos, CSS, z-index y patrones de UI del proyecto.

---

## Patrón de Diseño JavaScript

Los componentes JavaScript usan **Module Pattern (IIFE + Revealing Module)**.
Consultar `/proyecto-refactorizacion` para detalles.

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

1. **Estilos globales**: Solo en `/assets/css/`
2. **Componentes autocontenidos**: Cada componente tiene su propio CSS en su carpeta
3. **z-index**: Respetar la jerarquía de capas (overlay < dropdown < chat < social)
4. **Transiciones**: 0.1s ease-out para animaciones UI
5. **GitHub Pages**: Todos los `href` de CSS usan rutas relativas

---

## Estructura de CSS Global

```
assets/css/
├── style.css          # Estilos principales
├── components/       # Estilos por componente
└── ...
```

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