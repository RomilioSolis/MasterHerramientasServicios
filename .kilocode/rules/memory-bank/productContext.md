# Product Context - Master Herramientas y Servicios

## ¿Qué hace el producto?
Permite a clientes en Cali (Colombia) encontrar, comparar y alquilar herramientas y maquinaria profesional para construcción, con entrega en dos sucursales físicas y opción de entrega a domicilio bajo consulta.

## ¿Qué problema resuelve?
- Evita la inversión de capital en equipos que se usan puntualmente.
- Reduce el costo de oportunidad de comprar herramientas que se subutilizan.
- Provee mantenimiento profesional incluido en el alquiler.
- Centraliza la oferta en un único proveedor con catálogo amplio (38 equipos en 8 categorías).

## ¿Cómo debería trabajar?
1. **Descubrimiento**: El usuario llega vía Google buscando "alquiler de herramientas Cali" o "alquiler de [equipo específico]".
2. **Exploración**: En la landing ve el catálogo organizado por categoría (Netflix-style rows) con fotos, nombres y botón directo a WhatsApp.
3. **Decisión**: Lee la FAQ, ve horarios y dirección, identifica la sucursal más cercana.
4. **Conversión**: Click en "Cotizar por WhatsApp" → abre chat con mensaje pre-llenado.
5. **Post-alquiler**: Mantenimiento del equipo corre por cuenta de Master Herramientas.

## Experiencia de usuario objetivo
- **Tiempo de carga percibido**: < 1.5 s (LCP < 2.5 s).
- **Mobile-first**: 80% del tráfico estimado proviene de móvil.
- **Cero scroll horizontal** en 375px, 768px y 1024px.
- **WCAG 2.1 AA**: contraste suficiente, fuentes escalables, navegación por teclado.

## Restricciones y dependencias
- **Geográficas**: Cali y Valle del Cauca, Colombia. Coordenadas GPS aproximadas para la sucursal Santa Mónica (3.44565, -76.511) marcadas con TODO.
- **Temporales**: Horario comercial Lun-Vie 8-18, Sáb 8-16. Fuera de horario, sólo WhatsApp.
- **Técnicas**: Sin frameworks JS, sin SSR, sin build step. Todo el HTML es estático y se sirve desde GitHub Pages.

## Suposiciones
- El usuario promedio prefiere WhatsApp sobre formularios web o llamadas para cotizar.
- Las búsquedas móviles dominan (Cali tiene alta penetración smartphone).
- El cliente valora la cercanía geográfica (dos sucursales cubren más barrios).
