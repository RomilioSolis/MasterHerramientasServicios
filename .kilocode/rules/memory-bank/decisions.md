# Decisions - Master Herramientas y Servicios

Registro de decisiones técnicas del proyecto. Cada decisión lleva un ID, fecha y justificación breve.

## D-SEO-01 · 2026-09-02 · JSON-LD como fuente de verdad Schema.org
**Decisión**: Mantener un único bloque `<script type="application/ld+json">` con `@graph` que agrupa todos los tipos Schema.org (LocalBusiness, Organization, WebSite, WebPage, BreadcrumbList, VideoObject, FAQPage) en lugar de múltiples scripts separados.
**Razón**: Reduce parseo, evita inconsistencias entre bloques y facilita la actualización (un solo lugar). El `@graph` está recomendado por Schema.org desde 2020 y Google lo soporta.

## D-SEO-02 · 2026-09-02 · Coordenadas aproximadas para Santa Mónica
**Decisión**: Usar coordenadas aproximadas 3.44565, -76.511 para la sucursal Santa Mónica en todos los lugares donde aparecen (JSON-LD, Google Maps, contacto.js), marcadas con TODO para reemplazo cuando se obtengan las exactas.
**Razón**: El cliente aún no ha entregado las coordenadas GPS exactas. Publicar coordenadas razonablemente cercanas permite que Google Maps ubique la sucursal mientras se confirma la cifra definitiva.

## D-SEO-03 · 2026-09-02 · hreflang es-CO y x-default en el mismo dominio
**Decisión**: Mantener `hreflang="es-CO"` y `hreflang="x-default"` ambos apuntando a `https://masterenherramientasyservicios.com.co/`.
**Razón**: El sitio es monolingüe (español colombiano). No hay versiones en otros idiomas, por lo que `x-default` y la versión regional coinciden. Esto evita señales contradictorias a Google.

## D-SEO-04 · 2026-09-02 · No generar llms.txt
**Decisión**: No crear un archivo `llms.txt` en la raíz.
**Razón**: Google ha indicado (2024-2025) que no requiere este archivo. La documentación oficial de Google Search Central sobre AI Overviews / AI Mode no menciona `llms.txt` como factor de ranking ni de inclusión en features generativas. El contenido bien estructurado con Schema.org es suficiente para que los modelos generativos lo parseen.

## D-SEO-05 · 2026-09-02 · dateModified en WebPage JSON-LD
**Decisión**: Actualizar `dateModified` del `WebPage` JSON-LD en cada cambio SEO significativo (no en cada deploy).
**Razón**: Google usa `dateModified` para entender frescura del contenido. Actualizarlo en cada push trivial (ej. corrección de typos en CSS) genera señales ruidosas. Se actualizará cuando cambie: descripción, JSON-LD, headings, contenido textual, FAQ.

## D-SEO-06 · 2026-09-02 · Microdata + JSON-LD simultáneos
**Decisión**: Mantener microdata clásica (`itemscope`/`itemtype`/`itemprop`) en `components/contacto/contacto.html` y `components/footer/footer.html` además del JSON-LD global.
**Razón**: Defensivo. Aunque Google prioriza JSON-LD desde 2020, otros motores (Bing, DuckDuckGo, parsers académicos) aún consumen microdata. No hay penalización por usarlos juntos siempre que los datos no se contradigan.

## D-SEO-07 · 2026-09-02 · Jerarquía de encabezados
**Decisión**: Mantener un único `<h1>` por página (provisto por el header dinámico que contiene la marca), `<h2>` por sección visible y `<h3>` para sub-secciones / tarjetas.
**Razón**: WCAG 2.4.6 y buenas prácticas SEO recomiendan una sola `<h1>` que represente el tema principal. La estructura actual cumple con esto.

## D-SEO-08 · 2026-09-02 · Botones "Cómo llegar" separados por sucursal
**Decisión**: Mostrar dos botones "Cómo llegar" en `components/contacto/contacto.html`, uno por sucursal, con `aria-label` específico.
**Razón**: Mejora la accesibilidad (lectores de pantalla anuncian claramente el destino) y reduce la fricción del usuario (no tiene que adivinar cuál sucursal está viendo en el mapa).

## D-ARCH-01 · 2026-04-18 · Carga asíncrona de CSS
**Decisión**: Cargar todos los CSS secundarios con `rel="preload" as="style" onload="this.rel='stylesheet'"` y `<noscript>` como fallback.
**Razón**: Elimina el render-blocking de CSS no crítico para above-the-fold, mejorando LCP/FCP.

## D-ARCH-02 · 2026-04-18 · Leaflet por CDN con `defer`
**Decisión**: Cargar Leaflet desde unpkg con `defer` y verificarlo con `crossorigin="anonymous"`.
**Razón**: Mapa no es above-the-fold. Diferir su carga evita bloquear el LCP de la sección principal.

## D-ARCH-03 · 2026-04-18 · Skeleton placeholders para contenedores dinámicos
**Decisión**: Aplicar `min-height` + animación `skeleton-loading` en `#header-app`, `#netflixRows`, `#contacto-map` antes de que cargue su contenido.
**Razón**: Evita CLS (Cumulative Layout Shift) cuando los componentes asíncronos terminan de inyectar HTML.
