# Active Context - Memory Bank

## Última actualización
2026-09-02

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
- **Dirección principal**: CRA 23 #36-48, Barrio El Rodeo, Cali, Colombia
- **Sucursal Santa Mónica**: Cra 23 # 33 b 126, Barrio Santa Monica, Cali, Colombia
- **Teléfonos**: 316 5345675 / 316 3550319
- **Email**: masterenherramientasyservicios@gmail.com
- **Horario**: Lun-Vie 8:00-18:00, Sáb 8:00-16:00
- **Año fundación**: 2014

**Coordenadas**:
- **Principal (El Rodeo)**: 3.438368, -76.505911
- **Sucursal Santa Mónica**: 3.436917, -76.510377

## Decisiones tomadas

### Mapas interactivos (2026-09-02)
Se actualizaron los mapas Leaflet en `components/nosotros/nosotros.js` y `components/contacto/contacto.js` para mostrar ambas ubicaciones:
- Marcador rojo/🔧 para la sede principal El Rodeo.
- Marcador azul/📍 para la sucursal Santa Mónica.
- `mapa.fitBounds()` ajusta la vista para incluir ambas ubicaciones con padding de 40px y `maxZoom: 16`.

## Archivos modificados en esta sesión
Se agregó la información de la nueva sucursal Santa Mónica como **segunda ubicación** en la landing page, sin reemplazar la ubicación existente en El Rodeo.

**Layout elegido**: Tarjeta de info apilada con dirección principal + sucursal secundaria. Cada ubicación usa su propio `<address>` semántico con microformatos Schema.org. La sucursal Santa Mónica incluye un enlace clickable a Google Maps (`https://maps.google.com/?q=Cra+23+%23+33+b+126+Santa+Monica`) para UX estática sin dependencias externas.

**Accesibilidad**: Se verificó contraste y tamaños de fuente para cumplir WCAG 2.1 AA. Textos en `rgba(255,255,255,0.9)` sobre fondo oscuro, fuentes >= 0.85rem en mobile, enlaces con estados hover diferenciados.

**Responsive**: Mobile-first, con separadores sutiles (`border-top`) para distinguir las ubicaciones en pantallas pequeñas. breakpoints aplicados en 480px, 768px, 992px.

**Schema.org actualizado**: Se agregó `additionalLocation` al `LocalBusiness` en `index.html` con la nueva dirección postal.

## Archivos modificados en esta sesión
- `components/contacto/contacto.html`
- `components/contacto/contacto.css`
- `components/footer/footer.html`
- `components/footer/footer.css`
- `components/nosotros/nosotros.html`
- `index.html` (Schema.org JSON-LD)
