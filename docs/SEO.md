# SEO - Master Herramientas y Servicios

> **Fecha de referencia de estándares**: 31 de agosto de 2026.
> **Última auditoría aplicada**: 2026-09-02.

Este documento resume las optimizaciones SEO aplicadas a la landing page, los estándares de referencia, y el checklist que se debe revisar en cada cambio significativo de contenido.

## 1. Estándares aplicados (agosto 2026)

| Categoría | Estándar / Documento | Aplicación |
|---|---|---|
| Indexación móvil | Google Mobile-First Indexing (default desde 2023) | Sitio completamente responsive, mobile-first |
| Core Web Vitals | Web Vitals 2024+ (LCP / INP / CLS) | Targets: LCP ≤ 2.5 s · INP ≤ 200 ms · CLS ≤ 0.1 |
| Datos estructurados | Schema.org 2026 + JSON-LD | `@graph` con `LocalBusiness`, `Organization`, `WebSite`, `WebPage`, `BreadcrumbList`, `FAQPage`, `VideoObject` |
| AI Overviews / AI Mode | Google Search Central – AI features and your website (2024–2026) | Contenido bien estructurado + Schema.org; sin `llms.txt` |
| E-E-A-T | Google Quality Rater Guidelines 2025 | Información verificable: dirección física, dos sucursales, horarios, teléfono, año de fundación, redes sociales |
| Accesibilidad | WCAG 2.1 AA | Contraste de texto ≥ 4.5:1, áreas clickeables ≥ 44×44 px, navegación por teclado |
| Open Graph | Open Graph protocol 2025 | `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:locale`, `og:site_name` |
| Twitter Cards | Twitter Developer Docs 2024 | `summary_large_image` con `twitter:title`, `twitter:description`, `twitter:image`, `twitter:site`, `twitter:creator` |
| HTML semántico | HTML Living Standard (WHATWG) | `<header>`, `<main>`, `<section>`, `<article>`, `<address>`, `<nav>`, `<footer>` |

## 2. Cambios aplicados en esta auditoría (2026-09-02)

### 2.1 `index.html`
- **Title** recortado a 58 caracteres: `Alquiler de Herramientas en Cali | Master Herramientas`.
- **Meta description** reescrita a 155 caracteres, sin emoji ni símbolos decorativos.
- **JSON-LD `@graph`** enriquecido:
  - `LocalBusiness.department[]` con la sucursal Santa Mónica (incluye su propio `address`, `geo`, `telephone` y `openingHoursSpecification`).
  - `LocalBusiness.location[]` con `Place` para ambas sedes y sus `GeoCoordinates`.
  - `WebPage.datePublished` añadido (2014-08-01) y `dateModified` actualizado a 2026-09-02.
  - `FAQPage` ampliada a 6 preguntas que cubren ubicación, horarios, servicios, contacto, entregas y cotización.
- **Open Graph y Twitter Cards** sincronizados con el nuevo title/description.

### 2.2 `components/contacto/contacto.html`
- Cada `<address>` ahora incluye `itemprop="name"`, `addressCountry` y `addressRegion` explícitos.
- El botón "Cómo llegar" tiene `aria-label` descriptivo.
- Añadido un segundo botón "Cómo llegar (Santa Mónica)" con coordenadas aproximadas 3.44565, -76.511.
- Enlace Google Maps de Santa Mónica incluye la ciudad en el query string.

### 2.3 `components/footer/footer.html`
- Ambas direcciones marcadas como `<address itemscope itemtype="https://schema.org/PostalAddress">`.
- Cada dirección tiene `itemprop="name"`, `streetAddress`, `addressLocality`, `addressCountry`.

### 2.4 `components/contacto/contacto.css`
- Añadido estilo `.btn-directions-secondary` con margen superior para separar visualmente los dos botones de mapa.

## 3. Lo que ya estaba bien (no se tocó)

- `<html lang="es-CO">` correcto.
- `viewport` con `width=device-width, initial-scale=1.0`.
- `robots` con directivas avanzadas (`max-image-preview`, `max-snippet`, `max-video-preview`).
- `canonical`, `hreflang` (es-CO + x-default) y `sitemap` declarados.
- Cabeceras de seguridad (CSP, XFO, XCTO, Referrer-Policy, Permissions-Policy).
- Preconnect a CDNs externos (fonts, Leaflet, FontAwesome, GTM).
- Preload de la imagen LCP (`miniatura-video.webp`) y de los fonts críticos.
- CSS crítico inline + CSS secundario async con `<noscript>` fallback.
- Leaflet y demás JS pesados diferidos con `defer`.
- Skeleton placeholders para prevenir CLS en componentes asíncronos.
- Webfonts con `font-display: swap` y métricas de fallback.
- Microdata clásica + JSON-LD (defensa contra parsers que no soporten JSON-LD).
- OG / Twitter Cards con `image:alt` para accesibilidad.

## 4. Checklist de revisión (cada cambio significativo)

Usar este checklist al modificar contenido, agregar secciones, o cambiar información de contacto/horarios/dirección.

- [ ] `<title>` sigue en 50–60 caracteres y refleja el contenido actual.
- [ ] `<meta name="description">` sigue en 150–160 caracteres.
- [ ] JSON-LD: ¿hay que actualizar `LocalBusiness.address` / `department` / `openingHoursSpecification`?
- [ ] JSON-LD: ¿hay que actualizar `FAQPage` (nuevas preguntas / respuestas)?
- [ ] JSON-LD: ¿`dateModified` de `WebPage` debe avanzar?
- [ ] OG y Twitter Cards sincronizados con title/description nuevos.
- [ ] Heading hierarchy: un solo `<h1>`, sin saltos de nivel.
- [ ] Imágenes nuevas con `alt` descriptivo, `width`/`height` explícitos.
- [ ] Si hay nuevo video, `VideoObject` en JSON-LD actualizado.
- [ ] Si cambió la dirección, coordenadas o sucursales, actualizados también en:
  - [ ] `components/contacto/contacto.html`
  - [ ] `components/contacto/contacto.js` (mapa Leaflet)
  - [ ] `components/footer/footer.html`
  - [ ] Google Maps links
  - [ ] `meta name="geo.position"` / `ICBM` (en `index.html`)
- [ ] Contraste WCAG 2.1 AA verificado en texto nuevo.
- [ ] Mobile (375px) sin scroll horizontal tras los cambios.
- [ ] Lighthouse SEO ≥ 95 y Performance ≥ 90 en build local.

## 5. Métricas objetivo (Core Web Vitals, 75° percentil)

| Métrica | Target | Cómo se logra |
|---|---|---|
| LCP (Largest Contentful Paint) | ≤ 2.5 s | Preload de imagen hero, CSS crítico inline, defer de JS no crítico, WebP |
| INP (Interaction to Next Paint) | ≤ 200 ms | `defer` en scripts, listeners pasivos, sin tareas síncronas largas, lazy via `IntersectionObserver` |
| CLS (Cumulative Layout Shift) | ≤ 0.1 | `min-height` / `aspect-ratio` en contenedores dinámicos, `width`/`height` en `<img>`, `font-display: swap` + `size-adjust` |

## 6. Pendientes / TODO

1. **Coordenadas GPS exactas de la sucursal Santa Mónica**: hoy se usan aproximadas (3.44565, -76.511). Cuando el cliente entregue las reales, actualizar:
   - `index.html` JSON-LD (`LocalBusiness.department[0].geo`, `location[1].geo`).
   - `components/contacto/contacto.html` (botón "Cómo llegar Santa Mónica").
   - `components/contacto/contacto.js` (marcador Leaflet).
   - `index.html` `meta name="geo.position"` y `ICBM` (representan la sede principal; el segundo par puede agregarse como `geo.position` adicional con `geo.placename="Santa Monica"`).
2. **`Service` por categoría de equipo**: hoy `hasOfferCatalog` lista 3 servicios representativos. Considerar ampliar a las 8 categorías para mejorar rich results específicos.
3. **Verificación en Google Search Console**: tras desplegar, validar que `LocalBusiness` con múltiples ubicaciones se indexe y muestre horarios, teléfono y dirección correcta para cada sede.
4. **Imágenes `srcset` responsive**: la imagen hero (`miniatura-video.webp`) está preloaded pero no tiene `srcset` multiparámetro. Se recomienda generar variantes 400w, 800w, 1200w y añadirlas al `<picture>` cuando se migre a un build pipeline.
