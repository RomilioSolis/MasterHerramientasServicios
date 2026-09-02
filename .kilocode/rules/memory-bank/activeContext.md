# Active Context - Memory Bank

## Última actualización
2026-09-02 — Auditoría SEO integral (estándares vigentes al 31-ago-2026)

## Reglas arquitectónicas obligatorias
- Vanilla JS, NO frameworks (React/Vue/Angular).
- HTML estático, NO SSR.
- GitHub Pages hosting.
- PROHIBIDO node_modules/Webpack/Vite/Parcel.
- Comunicación via EventEmitter (Pub/Sub) + CustomEvent.
- Module Pattern / Revealing Module para JS.
- Mobile-first, breakpoints: 375px / 768px / 1024px.
- Paths relativos (ej. ./css/style.css, ../assets/img/).
- Componentes anidados (cuyo contenedor DOM vive dentro del HTML de otro componente) deben cargarse desde el JS del componente padre tras inyectar su HTML, no registrarse en ComponentFactory ni en main.js.

## Información del negocio
- **Nombre**: Master Herramientas y Servicios
- **Dirección principal**: CRA 23 #36-48, Barrio El Rodeo, Cali, Colombia (3.438050, -76.538800)
- **Sucursal Santa Mónica**: Cra 23 # 33 b 126, Barrio Santa Monica, Cali, Colombia (3.44565, -76.511 — aproximadas, marcadas TODO)
- **Teléfonos**: 316 5345675 / 316 3550319
- **Email**: masterenherramientasyservicios@gmail.com
- **Horario**: Lun-Vie 8:00-18:00, Sáb 8:00-16:00
- **Año fundación**: 2014

## Estado actual del proyecto

### Auditoría SEO 2026-09-02
Se aplicaron los estándares SEO vigentes al 31-ago-2026:

- **Meta description** reescrita a 155 caracteres útiles, sin símbolos decorativos.
- **Title** recortado a 58 caracteres (`... | Master Herramientas`).
- **JSON-LD `@graph`** enriquecido: `LocalBusiness` ahora incluye `department[]` y `location[]` con sus propias `GeoCoordinates`, `PostalAddress`, `telephone` y `openingHoursSpecification` para la sucursal Santa Mónica. `WebPage` actualizada con `datePublished` (2014-08-01) y `dateModified` (2026-09-02). `FAQPage` ampliada con preguntas sobre entregas, contacto por correo y solicitud de cotización; primera respuesta incluye ambas direcciones.
- **Open Graph y Twitter Cards** sincronizados con el nuevo título y descripción.
- **`components/contacto/contacto.html`**: cada `<address>` ahora lleva `itemprop="name"`, `addressCountry`, y el `aria-label` en el botón "Cómo llegar". Se añadió botón "Cómo llegar (Santa Mónica)" con coordenadas aproximadas 3.44565, -76.511.
- **`components/footer/footer.html`**: ambas direcciones marcadas como `<address itemscope itemtype="https://schema.org/PostalAddress">` con `itemprop="name"`, `streetAddress`, `addressLocality`, `addressCountry`. Enlace Maps de Santa Mónica apunta a la versión con ciudad (`+Cali`).
- **Microdata dual**: la página ahora expone la información de las dos sucursales tanto en JSON-LD (Schema.org) como en microdata clásica (`itemscope`/`itemprop`), maximizando la compatibilidad con parsers de Google, Bing y modelos generativos.

### Decisiones tomadas (ver `decisions.md`)
- D-SEO-01: Mantener JSON-LD con `@graph` como fuente única de verdad para Schema.org.
- D-SEO-02: Usar coordenadas aproximadas 3.44565, -76.511 para Santa Mónica con TODO hasta confirmar GPS real.
- D-SEO-03: Conservar `hreflang="es-CO"` y `x-default` apuntando al mismo dominio (sitio monolingüe).
- D-SEO-04: No generar `llms.txt` (Google no lo requiere; contenido bien estructurado es suficiente).
- D-SEO-05: `dateModified` se actualizará en cada cambio SEO significativo.

## Archivos modificados en esta sesión
- `index.html` (meta description, title, JSON-LD `@graph` enriquecido, OG/Twitter)
- `components/contacto/contacto.html` (microdata ampliada + segundo botón de mapa)
- `components/contacto/contacto.css` (estilos `.btn-directions-secondary`)
- `components/footer/footer.html` (microdata ampliada para ambas direcciones)
- `.kilocode/rules/memory-bank/activeContext.md` (este archivo)
- `.kilocode/rules/memory-bank/projectbrief.md` (nuevo)
- `.kilocode/rules/memory-bank/decisions.md` (nuevo)
- `.kilocode/rules/memory-bank/productContext.md` (nuevo)
- `.kilocode/skills/ai-context-harness/SKILL.md` (reglas SEO añadidas)
- `docs/SEO.md` (nuevo)
- `docs/ESTRUCTURA-PROYECTO.md` (mínimo cambio, sólo se ajustó el pie de "Última actualización")

## TODO abierto
- Confirmar coordenadas GPS exactas de la sucursal Santa Mónica y reemplazar los valores aproximados (3.44565, -76.511) en `index.html` JSON-LD, `components/contacto/contacto.html` y `components/contacto/contacto.js`.
- Verificar en Google Search Console que el rich-result `LocalBusiness` con múltiples ubicaciones se indexa correctamente.
- Considerar agregar `Service` específico para cada categoría de equipo (hoy `hasOfferCatalog` lista sólo 3 servicios representativos).
