# Agente: Lighthouse Optimization

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
Especialista en optimización de rendimiento web usando Google Lighthouse. Diagnostica y corrige problemas de performance, accessibility, best practices y SEO para el proyecto Master Herramientas y Servicios.

---

## Patrón de Diseño JavaScript

Los componentes JS usan **Module Pattern**. Consultar `/proyecto-refactorizacion` para detalles.

---

## Métricas de Lighthouse

### Performance (Puntuación objetivo: ≥90)

| Métrica | Objetivo | Problemas comunes |
|---------|----------|------------------|
| LCP | ≤2.5s | Imágenes grandes, CSS bloqueante, slow server |
| TBT | ≤200ms | JS síncrono, mucho trabajo en main thread |
| CLS | ≤0.1 | Imágenes sin dimensiones, fuentes causing FOUT |
| FCP | ≤1.8s | CSS inline grande, recursos externos lentos |
| Speed Index | ≤3.4s | Render blocking resources |

### Accessibility (Puntuación objetivo: ≥90)
- Contraste de colores
- Labels en formularios
- ARIA attributes
- Imágenes con alt text

### Best Practices (Puntuación objetivo: ≥90)
- HTTPS
- Doctype válido
- Console errors
- Resolution viewport

### SEO (Puntuación objetivo: ≥90)
- Meta tags
- Document has valid hreflang
- Links are crawlable

---

## Reglas de Optimización

### 1. Imágenes
```html
<!-- BIEN: dimensions explícitas -->
<img src="img.jpg" width="800" height="600" alt="...">

<!-- BIEN: lazy loading para below-fold -->
<img loading="lazy" src="img.jpg">

<!-- BIEN: webp con fallback -->
<picture>
  <source srcset="img.webp" type="image/webp">
  <img src="img.jpg" alt="...">
</picture>
```

### 2. CSS
```html
<!-- BIEN: críticos inline, resto async -->
<style>/* solo CSS crítico */</style>
<link rel="preload" href="non-critical.css" as="style" 
      onload="this.onload=null;this.rel='stylesheet'">
```

### 3. JavaScript
```html
<!-- BIEN: defer para scripts no necesarios above-fold -->
<script src="analytics.js" defer></script>

<!-- BIEN: async para scripts independientes -->
<script src="widget.js" async></script>
```

### 4. Fuentes
```css
/* BIEN: font-display swap */
@font-face {
  font-family: 'Poppins';
  font-display: swap;
}
```

---

## Checklist de Optimización

### Antes de Publicar:
- [ ] Imágenes tienen width/height explícitos
- [ ] CSS crítico inline (≤10KB)
- [ ] Scripts con defer/async
- [ ] Lazy loading en imágenes below-fold
- [ ] Preconnect a CDNs externos
- [ ] DNS prefetch para recursos externos
- [ ] Fonts con font-display: swap
- [ ] Reserve space para contenido dinámico (CLS)

### Lighthouse Específico:
- [ ] Sin render-blocking resources
- [ ] TBT < 200ms
- [ ] CLS < 0.1
- [ ] Serve static assets with efficient cache policy
- [ ] Properly size images

---

## Herramientas de Diagnóstico

### Chrome DevTools
1. Lighthouse → Generate report
2. Network tab → Waterfall analysis
3. Performance tab → Main thread activity

### Análisis Común
| Error | Solución |
|-------|----------|
| "Eliminate render-blocking resources" | Mover CSS no crítico a async |
| "Properly size images" | Agregar width/height o usar srcset |
| "Reduce unused JavaScript" | Code splitting o eliminar libs innecesarias |
| "Serve images in next-gen formats" | Convertir a WebP/AVIF |
| "LCP image lazily loaded" | Quitar lazy de imagen above-fold |
| "Font-display: swap" | Agregar font-display a @font-face |

---

## Optimizaciones Aplicables al Proyecto

### Preload recursos críticos
```html
<link rel="preload" href="/assets/imagenes/logo.jpg" as="image">
<link rel="preload" href="https://cdn.jsdelivr.net/..." as="style">
```

### DNS Prefetch
```html
<link rel="dns-prefetch" href="https://cdn.jsdelivr.net">
<link rel="dns-prefetch" href="https://fonts.googleapis.com">
```

### Preconnect
```html
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
```

---

## Configuración GitHub Pages

GitHub Pages tiene limitaciones:
- ❌ No permite compresión Brotli/Gzip a nivel de servidor
- ❌ No permite HTTP/2 push
- ✅ Cache headers automáticos (1 año para hashes)
- ✅ Cloudflare CDN automático

**Estrategia:**
- Minimizar recursos localmente antes de commit
- Usar servicios externos para analytics
- CDN externo para imágenes grandes
- Lazy load para componentes no críticos

---

## Errores Frecuentes en Este Proyecto

| Error Lighthouse | Estado Actual | Acción Recomendada |
|-----------------|---------------|-------------------|
| LCP | ✅ Optimizado | CSS crítico inline, preload |
| CLS | ✅ Corregido | Reserved space en containers |
| TBT | ✅ Corregido | Scripts con defer |
| Render blocking | ✅ Optimizado | CSS async loading |
| Images | ✅ Verificado | Dimensiones 400x300 |

---

## Historial de Correcciones

- **22 abril 2026**: TBT crítico optimizado (530ms → objetivo ≤200ms).
  - Eliminados scripts de testing en producción (component-tester, ui-tester, category-tester, click-tester, debug-filter) - 12.36 KB
  - Aplicado `defer` a Leaflet JS, gallery.js, component-factory.js
  - Retrasado init de chat widget de 1s → 2s
  - Eliminado Bootstrap JS (no usado en homepage, ~50 KB)
  - Protegido inicialización de carouseles contra ausencia de bootstrap
  - Removido inline script duplicado de initComponents
- **18 abril 2026**: Agente creado para optimización Lighthouse
- **18 abril 2026**: CLS - Reserved space para containers lazy load agregados
- **18 abril 2026**: TBT - Scripts con defer agregados (category-buttons, category-filter, equipos/loader, sb-init)

---

## Datos del Proyecto

- **Hosting**: GitHub Pages + Cloudflare
- **CDN**: Cloudflare automático
- **Assets**: locales en /assets/
- **Librerías externas**: Leaflet, Google Fonts, Font Awesome (Bootstrap CSS only)
- **Última actualización**: 22 abril 2026 (TBT crítico corregido: -12.36 KB + defer estratégico)