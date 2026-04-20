# Agente: SEO Master Herramientas

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
Este agente es especialista en SEO (Search Engine Optimization) y Schema.org para el proyecto Master Herramientas y Servicios. Maneja meta tags, datos estructurados, rendimiento y optimización para motores de búsqueda.

---

## Patrón de Diseño JavaScript

Los componentes JS usan **Module Pattern**. Consultar `/proyecto-refactorizacion` para detalles.

---

## Responsabilidades SEO

### 1. Meta Tags (index.html head)

**Meta Description** (~155 caracteres):
- Ubicación: línea 24
- Debe incluir: palabra clave principal, ubicación, diferenciales

**Canonical URL**:
- Línea 18: `https://masterenherramientasyservicios.com.co/`

**Open Graph** (redes sociales):
- Título, descripción, imagen, url, tipo, locale, site_name

**Twitter Cards**:
- `summary_large_image` con title, description, image

---

### 2. Schema.org (JSON-LD)

**Tipos implementados:**
- `LocalBusiness` - Datos locales del negocio
- `Organization` - Información de la organización
- `BreadcrumbList` - Navegación estructurada
- `WebSite` + `WebPage` - Sitio y página principal
- `VideoObject` - Video demostrativo
- `FAQPage` - Preguntas frecuentes

**Datos críticos:**
- name: "Master Herramientas y Servicios"
- address: "Cra. 23 #36-48, Barrio El Rodeo"
- geo: 3.438050, -76.538800 (Cali)
- telephone: +573165345675, +573163550319
- foundingDate: 2014-08

---

### 3. Imágenes y Recursos

**Logo y favicon:**
| Recurso | Ruta |
|--------|------|
| favicon.ico | /assets/imagenes/masterfavi.ico |
| apple-touch | /assets/imagenes/logo.jpg |
| logo (Schema) | /assets/imagenes/logo.jpg |
| miniatura-video | /assets/imagenes/miniatura-video.jpg |

---

### 4. Errores 404 a Evitar

- ✅ Verificar que todos los recursos referenciados existan
- ✅ Rutas relativas vs absolutas en Schema.org

---

### 5. Rendimiento SEO

**LCP (Largest Contentful Paint):**
- CSS crítico inline en head
- Preload de imágenes above-the-fold
- Video con preload="metadata"

**CLS (Cumulative Layout Shift):**
- Reserve space para contenido dinámico
- Dimensiones de imagen definidas

**TBT (Total Blocking Time):**
- Scripts con defer
- Lazy load de componentes no críticos

---

## Verificaciones de SEO

### Checklist antes de publicar:

- [ ] Meta description ≤ 160 caracteres
- [ ] Título H1 presente y único
- [ ] Schema.org sin errores
- [ ] Canonical URL correcta
- [ ] Mobile responsive

---

## Recursos Externos Verificados

| Recurso | URL |
|--------|-----|
| Bootstrap | cdn.jsdelivr.net/npm/bootstrap@5.3.3 |
| Bootstrap Icons | cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3 |
| Font Awesome | cdnjs.cloudflare.com |
| Leaflet | unpkg.com/leaflet@1.9.4 |
| Google Fonts | fonts.googleapis.com (Poppins) |

---

## Historial de Correcciones

- **18 abril 2026**: Título corregido "Master En Herramientas" → "Master Herramientas"
- **18 abril 2026**: H1 duplicado corregido - segundo H1 cambiado a H2 para solo un H1
- **18 abril 2026**: Theme-color duplicado eliminado - solo queda #800020 (color marca)

---

## Datos del Proyecto

- **URL**: https://masterenherramientasyservicios.com.co/
- **Idioma**: es-CO
- **Región**: CO-VAC (Cali)
- **Horario**: Lunes-Sábado 8:00 AM - 6:00 PM