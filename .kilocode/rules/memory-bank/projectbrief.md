# Project Brief - Master Herramientas y Servicios

## Visión
Ser el referente en Cali para el alquiler de herramientas y maquinaria de construcción, ofreciendo equipos profesionales, mantenimiento garantizado y atención personalizada desde 2014.

## Producto / Servicio
- **Núcleo**: Alquiler de herramientas y maquinaria para construcción.
- **Servicios complementarios**: demolición, extracción de núcleo, corte de pavimento, mantenimiento de equipos.
- **Cobertura**: Cali, Valle del Cauca (con entregas a zonas cercanas bajo consulta).
- **Sucursales**:
  1. Sede principal: Cra. 23 #36-48, Barrio El Rodeo.
  2. Sucursal: Cra 23 # 33 b 126, Barrio Santa Monica.

## Audiencia
- Maestros de obra y contratistas independientes.
- Pequeñas y medianas empresas constructoras en Cali.
- Usuarios DIY (hágalo-usted-mismo) que requieren equipos profesionales puntuales.
- Personas que necesitan un equipo específico por un periodo corto sin comprarlo.

## Objetivos SEO (vigentes al 31-ago-2026)
1. **Visibilidad local**: Posicionar la marca para búsquedas "alquiler de herramientas Cali", "alquiler de herramientas cerca de mí", "alquiler de [equipo] Cali".
2. **E-E-A-T**: Demostrar experiencia (desde 2014), expertise (catálogo amplio, mantenimiento garantizado), autoridad (redes sociales, datos de contacto verificables) y confiabilidad (dos sucursales físicas, horarios claros, Schema.org rico).
3. **AEO/GEO (Answer Engine / Generative Engine Optimization)**:
   - Responder preguntas frecuentes de forma directa en el primer párrafo de cada sección.
   - Mantener `FAQPage` JSON-LD con respuestas concisas y bien redactadas.
   - Estructurar el contenido con jerarquía de encabezados lógica (un solo `<h1>`, luego `<h2>`/`<h3>`).
4. **Core Web Vitals** (objetivo "Good" en 75° percentil):
   - LCP ≤ 2.5 s.
   - INP ≤ 200 ms.
   - CLS ≤ 0.1.
5. **Mobile-first indexing**: El sitio debe ser completamente funcional y rápido en móvil (375px como base).
6. **Datos estructurados completos**: `LocalBusiness` con `department[]` y `location[]` para múltiples sucursales, `FAQPage`, `Organization`, `WebSite`, `WebPage`, `BreadcrumbList`, `VideoObject`.

## Métricas de éxito
- Indexación de la página principal y de las dos sucursales en Google Search Console.
- Aparición en Google Maps / Google Business Profile con datos consistentes.
- Rich results: `LocalBusiness` con horarios, `FAQPage` con preguntas expandidas, `BreadcrumbList` en SERP.
- Cero errores críticos en Lighthouse (Performance, SEO, Accessibility, Best Practices ≥ 90).
- Aumento de tráfico orgánico desde búsquedas locales en Cali.

## Alcance del proyecto
- Sitio estático (HTML + CSS + Vanilla JS) alojado en GitHub Pages.
- Sin frameworks JS (React/Vue/Angular) ni SSR.
- Sin build step complejo (prohibido Webpack/Vite/Parcel).
- Path: `masterenherramientasyservicios.com.co` (CNAME configurado).

## Restricciones
- Stack: HTML estático, CSS, Vanilla JS.
- Hosting: GitHub Pages (HTTPS automático).
- Mantenimiento manual vía git push a la rama `master`.
- Idioma principal: español (Colombia) — `<html lang="es-CO">`.
