# Agente: Constantes y Configuración Centralizada

## ✅ Implementado
El proyecto ya cuenta con archivo de configuración **`assets/js/constants.js`** con valores centralizados.

---

## Beneficios de esta mejora:

| Beneficio | Descripción | Impacto |
|----------|-------------|---------|
| **✅ Mantenibilidad** | Cambias un valor 1 vez en lugar de 40+ veces | 🔴 Alto |
| **✅ Consistencia** | Todos los componentes usan el mismo teléfono/URL | 🟡 Medio |
| **✅ Reutilización** | No duplicas valores en decenas de archivos | 🔴 Alto |
| **✅ Correcciones rápidas** | Si cambian teléfono/dirección no tienes que buscarlo | 🔴 Alto |
| **✅ Entornos** | Facilita pasar entre desarrollo / producción | 🟡 Medio |
| **✅ Documentación** | Todos los valores críticos se encuentran en un solo lugar | 🟢 Bajo |

---

## Estructura Actualizada

```javascript
const APP_CONFIG = Object.freeze({
  // 📞 Teléfonos
  PHONE: {
    PRIMARY: '3165345675',
    SECONDARY: '3163550319',
    WHATSAPP: '573165345675',
    CALL: '+573165345675'
  },

  // 🔗 URLs
  URLS: {
    BASE: 'https://masterenherramientasyservicios.com.co',
    WHATSAPP_BASE: 'https://wa.me',
    FACEBOOK: 'https://www.facebook.com/MasterHerramientas',
    INSTAGRAM: 'https://www.instagram.com/MasterHerramientas',
    GOOGLE_MAPS_LOCATION: 'https://www.google.com/maps/dir/?api=1&destination=3.438050,-76.538800'
  },

  // 🏢 Datos Empresa
  BUSINESS: {
    NAME: 'Master Herramientas y Servicios',
    ADDRESS: 'Cra. 23 #36-48, Barrio El Rodeo, Cali',
    SCHEDULE: 'Lun-Vie: 8:00 - 18:00 | Sáb: 8:00 - 16:00',
    FOUNDATION_YEAR: 2014,
    EMAIL: 'info@masterenherramientasyservicios.com.co'
  },

  // 📂 Rutas
  PATHS: {
    COMPONENTS: 'components',
    IMAGES: 'assets/imagenes',
    VIDEOS: 'assets/Videos'
  },

  // ⏱️ Tiempos
  TIMING: {
    LAZY_DELAY: 500,
    DEBOUNCE_DELAY: 250
  },

  // 🎨 UI
  UI: {
    Z_INDEX: { HEADER: 1000, MODAL: 10000, SOCIAL: 10001 },
    breakpoints: { MOBILE: 768, TABLET: 992, DESKTOP: 1200 }
  },

  // 📋 Categorías
  CATEGORIES: {
    DEFAULT: 'all',
    LIST: [ /* todas las categorías */ ]
  }
});
```

---

## Helper Incluido

```javascript
const WHATSAPP = Object.freeze({
  formatPhone(phone) { /* formatea número */ },
  createLink(message, phone) { /* genera link WhatsApp válido */ },
  defaultMessage: 'Hola, necesito información sobre'
});
```

---

## Uso Correcto

```javascript
// ❌ MAL (duplicado, no centralizado):
const waLink = `https://wa.me/573165345675?text=${mensaje}`;

// ✅ BIEN (centralizado):
const waLink = WHATSAPP.createLink('Necesito cotizar taladro');
```

---

## Próximos Pasos
- [x] Archivo constants.js creado y actualizado
- [ ] Refactorizar los 30+ archivos de equipos para usar `WHATSAPP.createLink()`
- [ ] Eliminar valores hardcodeados de teléfono y URLs en componentes

---

**Nota**: Este cambio es incremental. No hay necesidad de cambiar todo de golpe. Se pueden ir refactorizando componentes uno por uno sin romper nada.
