# Agente: Estructura del Proyecto

## ⚠️ ARQUITECTURA - REGLAS OBLIGATORIAS

### Stack Tecnológico
- **Vanilla JS** (NO frameworks)
- **HTML estático** (NO Server-Side Rendering)
- **GitHub Pages** (hosting estático)
- **PROHIBIDO**: node_modules, Webpack, Vite, React, Vue, Angular

### Comunicación
- **EventEmitter** (`assets/js/event-emitter.js`) para Pub/Sub
- **CustomEvent** como fallback
- **PROHIBIDO**: Estado global complejo

### Module Pattern
Cada componente debe usar IIFE + Revealing Module. Consultar `/proyecto-refactorizacion`.

---

## Descripción
Conoce la estructura de archivos, carpetas y configuración de despliegue del proyecto Master Herramientas y Servicios.

---

## Patrón de Diseño JavaScript

Los componentes JS usan **Module Pattern (IIFE + Revealing Module)**. Consultar `/proyecto-refactorizacion` para detalles.

---

## Entorno de Despliegue

- **Hosting**: GitHub Pages (static site hosting)
- **Estructura en repo**: Raíz del sitio = raíz del repositorio
- **Rutas**: Se usan rutas relativas (sin `/` inicial) para compatibilidad con subdirectorio en GitHub Pages.
- **Nota**: Al desplegar en `https://<username>.github.io/<repo>/`, las rutas relativas funcionan correctamente.

### Actualización 20 abril 2026
- Se migró de módulos ES6 a scripts clásicos (`defer`) para compatibilidad con GitHub Pages sin servidor.
- El menu lateral fue reemplazado por `equipos-dropdown` en el header.

---

## Estructura de Archivos

```
MasterHerramientasServicios/
├── index.html                    # Página principal
├── nosotros.html                # Página nosotros
├── components/                  # Componentes autocontenidos
│   ├── social-buttons/           # Botones flotantes redes sociales (right)
│   ├── back-to-top/              # Botón volver arriba
│   ├── chat-widget/              # Chat flotante WhatsApp (left)
│   ├── header/                   # Header dinámico (ES6 module)
│   ├── equipos-dropdown/         # Dropdown de categorías desde header (NUEVO)
│   ├── lateral-menu/             # Menú lateral (obsoleto — ya no se usa desde header)
│   ├── horario/                  # Horario con reloj en tiempo real
│   ├── gallery/                  # Galería interactiva (lightbox)
│   ├── navigation/               # Navegación (estilos compartidos)
│   ├── equipos-grid/             # Grid de equipos (cards Bootstrap)
│   ├── equipos/                  # Netflix rows (carga dinámica)
│   ├── footer/                   # Footer (lazy load)
│   ├── contacto/                 # Sección contacto (lazy load)
│   └── faq/                      # Preguntas frecuentes (lazy load)
├── assets/
│   ├── css/                      # Estilos GLOBALES
│   └── js/                       # Scripts GLOBALES
└── docs/                         # Documentación
```

---

## Reglas de Rutas

1. **Siempre usar rutas relativas** (sin `/` inicial) para compatibilidad con GitHub Pages subdirectorio.
2. **Evitar `type="module"`**; usar `defer` y scripts clásicos.
3. **Los fetch** usan rutas relativas al directorio actual (`components/...`).
4. **Verificar**: Si hay enlaces rotos, asegurar `<base href="./">` en index.html.

---

## CORS en Desarrollo Local

Para probar fetch sin errores CORS con `file://`, usar servidor local:
```bash
python -m http.server 8000
```
