# Estructura del Proyecto - Master Herramientas y Servicios

## 📁 Estructura de Componentes

```
MasterHerramientasServicios/
├── index.html                    # Página principal
├── nosotros.html                 # Página nosotros
├── README.md                     # Documentación general
├── docs/
│   ├── COMPONENTS.md             # Documentación de componentes
│   ├── ESTRUCTURA-PROYECTO.md    # Estructura del proyecto
│   └── DIAGNOSTICO-BOTONES-FLOTANTES.md  # Diagnóstico de botones
│
├── components/                   # Componentes (HTML + JS módulo)
│   ├── social-buttons/           # ✅ Botones flotantes redes sociales (right)
│   │   ├── social-buttons.html   #   → 3 botones: Facebook, Instagram, WhatsApp
│   │   ├── social-buttons.css    #   → Estilos (position: fixed, right: 20px)
│   │   └── social-buttons.js     #   → Loader + init de BackToTop
│   │
│   ├── back-to-top/              # ✅ Botón volver arriba
│   │   ├── back-to-top.html
│   │   ├── back-to-top.css
│   │   └── back-to-top.js
│   │
│   ├── chat-widget/              # ✅ Chat flotante WhatsApp (left)
│   │   ├── chat-widget.html     #   → Ventana de chat + botón FAB
│   │   ├── chat-widget.js       #   → Lógica del chat (importa chat-widget.js de assets)
│   │   └── (sin CSS - estilos embebidos)
│   │
│   ├── header/                  # ✅ Header dinámico
│   │   ├── header.html
│   │   ├── header.css
│   │   ├── header.js
│   │   └── header-logo.css
│   │
│   ├── lateral-menu/            # ✅ Menú lateral
│   │   ├── lateral-menu.html
│   │   ├── lateral-menu.css
│   │   └── lateral-menu.js
│   │
│   ├── navigation/              # ✅ Navegación
│   │   ├── navigation.html
│   │   └── navigation.css
│   │
│   ├── equipos-grid/            # ✅ Grid de equipos (cards Bootstrap)
│   │   ├── equipos-grid.html
│   │   ├── equipos-grid.css
│   │   └── equipos-grid.js
│   │
│   ├── equipos/                 # ✅ Netflix rows (carga dinámica)
│   │   └── loader.js           #   → Genera filas tipo Netflix
│   │
│   ├── footer/                 # ✅ Footer (lazy load)
│   │   └── footer.html
│   ├── contacto/               # ✅ Sección contacto (lazy load)
│   ├── faq/                   # ✅ Preguntas frecuentes (lazy load)
│   └── dark-mode/             # ✅ Toggle modo oscuro
│
├── assets/
│   ├── css/                    # Estilos GLOBALES
│   │   ├── styles.css
│   │   ├── header-modern.css
│   │   ├── cookie-menu.css
│   │   ├── netflix-rows.css
│   │   └── ...
│   │
│   ├── js/                     # Scripts GLOBALES
│   │   ├── main.js
│   │   ├── chat-widget.js     #   → Lógica del chat (importado por componentes)
│   │   ├── buscador-unificado.js
│   │   ├── backtotop.js
│   │   └── ...
│   │
│   └── imagenes/               # Imágenes del sitio
│
└── tests/                      # Tests
    ├── debug-equipos.html
    └── simple-test.html
```

---

## 🎯 Componentes Flotantes

### Social Buttons (Lado DERECHO)
- **Ubicación**: `right: 20px`, centrado verticalmente (`top: 50%`)
- **Botones**: Facebook, Instagram, WhatsApp
- **Carga**: Módulo ES6 (`type="module"`)
- **HTML**: `components/social-buttons/social-buttons.html`
- **JS**: `components/social-buttons/social-buttons.js` (carga CSS + BackToTop)
- **CSS**: `components/social-buttons/social-buttons.css`

### Chat Widget (Lado IZQUIERDO)
- **Ubicación**: `left: 20px`, `bottom: 85px`
- **Funcionalidad**: Chat flotante con ventana que se abre/cierra
- **Carga**: Lazy load (500ms) + módulo ES6 (800ms)
- **HTML**: `components/chat-widget/chat-widget.html`
- **JS**: `components/chat-widget/chat-widget.js` → importa `assets/js/chat-widget.js`
- **CSS**: Embebido en el HTML

### Back To Top (Lado DERECHO)
- **Ubicación**: `right: 20px`, `bottom: 20px`
- **Carga**: Automaticamente importado por social-buttons.js
- **JS**: `components/back-to-top/back-to-top.js`
- **CSS**: Compartido con social-buttons.css
│   ├── chat-widget/             # ⏳ Widget chat
│   └── dark-mode/               # ✅ Toggle modo oscuro
│
├── assets/
│   ├── css/                     # Estilos GLOBALES
│   │   ├── styles.css
│   │   ├── header-modern.css
│   │   ├── cookie-menu.css
│   │   ├── netflix-rows.css
│   │   ├── floating-cards.css
│   │   ├── contacto.css
│   │   └── footer.css
│   │
│   ├── js/                      # Scripts GLOBALES
│   │   ├── main.js
│   │   └── buscador-unificado.js
│   │
│   └── imagenes/                # Imágenes del sitio
│
└── tests/                       # Tests
    ├── debug-equipos.html
    └── simple-test.html
```

---

## 🔧 Cambios Realizados

### 1. **Eliminación de Cards Duplicadas** ✅
- **Problema**: ~1,425 líneas de cards Bootstrap hardcodeadas después del footer
- **Solución**: Eliminadas todas las cards duplicadas
- **Resultado**: `index.html` reducido de 2,223 a 684 líneas (69% más pequeño)

### 2. **Corrección de Carga de Social Buttons** ✅
- **Problema**: Solo aparecía Instagram, Facebook y WhatsApp no se veían
- **Causa**: Dos bloques `<script type="module">` duplicados causaban conflictos
- **Solución**: Eliminado el bloque duplicado, ahora solo hay una carga lazy
- **Flujo correcto**:
  1. `index.html` crea `#social-buttons-container` vacío
  2. A los 1000ms → carga `social-buttons.html` vía fetch
  3. Inyecta HTML con 3 botones
  4. Llama a `SocialButtons.init()` → carga CSS + init BackToTop

### 3. **Estructura Limpia del HTML** ✅
- Sección `#equipos` ahora solo contiene:
  - Título + descripción
  - Filtro de categorías
  - Contenedor `#netflixRows` (carga dinámica desde loader.js)
- Eliminadas referencias a `#herramientas-container` obsoleto
- Footer y contacto cargan lazy sin conflictos

---

## 🎯 Componentes y su Responsabilidad

### Social Buttons (`/components/social-buttons/`)
**Propósito**: Botones flotantes de redes sociales en el lateral derecho

**Botones**:
1. **Facebook** → `https://www.facebook.com/masters.herramientas/`
2. **Instagram** → `https://www.instagram.com/masterenherramientasyservisios/`
3. **WhatsApp** → `https://wa.me/573165345675`

**Posición**: Fixed, right: 20px, centrado verticalmente (top: 50%)

**Carga**: 
- Lazy load a los 1000ms desde `index.html`
- Importa automáticamente `back-to-top` component

---

### Equipos Grid (`/components/equipos-grid/`)
**Propósito**: Grid de cards de equipos (estilo Bootstrap)

**Estado**: ⚠️ **OBSOLETO** - Reemplazado por Netflix rows

**Nota**: El componente existe pero ya no se usa en `index.html`

---

### Equipos Loader (`/components/equipos/loader.js`)
**Propósito**: Generar filas tipo Netflix con scroll horizontal

**Funcionamiento**:
1. Lee `equiposData` (37 equipos en 8 categorías)
2. Para cada categoría crea una `.netflix-row`
3. Carga cada equipo desde `/components/equipos/{id}.html`
4. Genera `.netflix-item` con imagen + título + botón WhatsApp
5. Inicializa carrusel automático con rotación de imágenes cada 5s

**Categorías**:
- Elevación y Levante (5 equipos)
- Perforación y Corte (7 equipos)
- Mezclado y Compactación (2 equipos)
- Limpieza e Hidráulica (3 equipos)
- Soldadura y Energía (3 equipos)
- Construcción y Estructura (3 equipos)
- Accesorios de Movimiento (3 equipos)
- Jardín y Forestal (2 equipos)

---

## 📊 Métricas del Proyecto

| Métrica | Antes | Después | Mejora |
|---------|-------|---------|--------|
| Líneas en index.html | 2,223 | 684 | **69% reducción** |
| Cards duplicadas | 19 articles | 0 | **100% eliminado** |
| Scripts duplicados | 2 bloques | 1 bloque | **50% reducción** |
| Tamaño de sección equipos | ~1,500 líneas | ~30 líneas | **98% reducción** |

---

## 🚀 Cómo Verificar los Cambios

### Verificar Botones Flotantes
1. Abrir `http://localhost:8080` en el navegador
2. Esperar 1-2 segundos (lazy load a 1000ms)
3. Deberían aparecer 3 botones en el lateral derecho:
   - 🔵 Facebook (azul)
   - 🟣 Instagram (gradient)
   - 🟢 WhatsApp (verde)

### Verificar Netflix Rows
1. Hacer scroll hasta la sección "Equipos Disponibles para Alquiler"
2. Ver filas horizontales con scroll por categoría
3. Cada fila tiene:
   - Título de categoría
   - Botones de scroll ← →
   - Cards con imagen que rotan cada 5s

### Verificar Limpieza del Código
1. Abrir DevTools → Elements
2. Buscar `<div id="social-buttons-container">`
3. Debería contener solo 3 botones (no duplicados)
4. Buscar `<section id="equipos">`
5. No debería haber `<article class="col-md-4 mb-4">` hardcodeados

---

## ⚠️ Problemas Resueltos (18 abril 2026)

### Botones sociales no aparecen
- **Causa**: z-index bajo (1000 vs 10000 del chat widget)
- **Solución**: aumentado a z-index 10001
- **Estado**: ✅ RESUELTO

### Chat widget duplicado
- **Causa**: Dos bloques con mismo ID `cw-fab`
- **Solución**: Eliminado segundo bloque
- **Estado**: ✅ RESUELTO

Si encuentras un problema:
1. Revisar `/docs/DIAGNOSTICO-*.md` para problemas conocidos
2. Verificar en DevTools Console si hay errores
3. Verificar Network tab si hay errores 404

---

## 📝 Reglas de Organización

1. **Cada componente en su carpeta** en `/components/`
2. **Estilos globales** solo en `/assets/css/`
3. **Scripts globales** solo en `/assets/js/`
4. **No hardcodear** contenido dinámico en `index.html`
5. **Lazy load** para componentes no críticos (footer, faq, contacto)
6. **Carga inmediata** solo para header y equipos

---

## 🔍 Troubleshooting

### Botones sociales no aparecen
```javascript
// En DevTools Console:
document.getElementById('social-buttons-container').innerHTML
// Debería mostrar el HTML de los 3 botones
```

### Error 404 en consola
- Verificar que el archivo existe en la ruta correcta
- Verificar que el servidor está corriendo (`python -m http.server 8080`)

### CSS no se aplica
- Verificar que el `<link>` está en `<head>`
- Verificar en Network tab que el CSS cargó (status 200)

### Netflix rows no aparecen
- Verificar que `/components/equipos/loader.js` se ejecuta
- Verificar que `#netflixRows` existe en el DOM
- Revisar consola por errores de fetch

---

## 📚 Documentación Relacionada

- `README.md` - Descripción general del proyecto
- `docs/COMPONENTS.md` - Detalle de cada componente
- `docs/DIAGNOSTICO-BOTONES-FLOTANTES.md` - Diagnóstico de botones sociales

---

**Última actualización**: 15 de abril, 2026
**Estado del proyecto**: ✅ Operativo - Optimizado
