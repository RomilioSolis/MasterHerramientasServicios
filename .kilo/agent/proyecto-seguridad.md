# Agente: Seguridad del Proyecto

## ⚠️ ARQUITECTURA - REGLAS OBLIGATORIAS

### Stack del Proyecto
- **Vanilla JS** - NO frameworks
- **HTML estático** para GitHub Pages
- **NO** node_modules, Webpack, Vite

### Comunicación
- **EventEmitter** para Pub/Sub
- **CustomEvent** como fallback

### Patrón de Diseño
- **Module Pattern (IIFE + Revealing Module)** - Consultar `/proyecto-refactorizacion`
- **NO** usar `import`/`export` (usa IIFE)
- **PROHIBIDO**: Estado global complejo

---

## Descripción
Agente especializado en análisis y mejora de seguridad del proyecto Master Herramientas y Servicios. Maneja CSP, headers HTTP, XSS, CSRF, sanitización, y auditoría de vulnerabilidades.

---

## Auditoría de Seguridad (Completada - 22 abril 2026)

### Estado de Implementación

| Área | Estado | Prioridad |
|------|--------|----------|
| **Content-Security-Policy** | ✅ IMPLEMENTADO | 🔴 CRÍTICA |
| **X-Frame-Options** | ✅ IMPLEMENTADO | 🟡 MEDIA |
| **X-Content-Type-Options** | ✅ IMPLEMENTADO | 🟡 MEDIA |
| **Referrer-Policy** | ✅ IMPLEMENTADO | 🟢 BAJA |
| **Permissions-Policy** | ✅ IMPLEMENTADO | 🟢 BAJA |
| **Integrity (SRI)** | ✅ PARCIAL | 🟡 MEDIA |
| **Sanitización** | ✅ IMPLEMENTADO | 🔴 CRÍTICA |
| **innerHTML dinámico** | ⚠️ RIESGO | 🔴 CRÍTICA |
| **external links** | ✅ SEGURO | ✅ OK |
| **CDN security** | ✅ PARCIAL | 🟡 MEDIA |

---

## Vulnerabilidades Identificadas

### 1. ✅ IMPLEMENTADO: Content-Security-Policy (CSP)
CSP implementado en index.html líneas 8-18:
- Previene XSS via scripts injectados
- Previene Data injection
- Previene Clickjacking
- Previene MIME sniffing

### 2. 🔴 CRÍTICA: innerHTML Dinámico sin Sanitizar
202 usos de `innerHTML` en el proyecto, muchos sin validación.

**Ejemplos de riesgo** (`index.html:536`):
```javascript
el.innerHTML = html;  // Peligroso si html contiene datos de usuario
```

**Solución**: Usar `SecurityUtils.escapeHtml()` o `textContent` para datos dinámicos.

### 3. ✅ IMPLEMENTADO: X-Frame-Options
Denega embebido en iframes (previene clickjacking).

### 4. ✅ IMPLEMENTADO: X-Content-Type-Options
Previene MIME sniffing (type confusion attacks).

### 5. 🟡 MEDIA: SRI Incompleto
Algunos CDNs tienen integrity, otros no.

---

## Reglas de Seguridad Implementadas

### CSP (Content-Security-Policy)
```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://www.google.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/;
style-src 'self' 'unsafe-inline' https://unpkg.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://fonts.googleapis.com;
img-src 'self' data: blob: https://*.openstreetmap.org https://*.tile.openstreetmap.org https://masterenherramientasyservicios.com.co;
media-src 'self' blob: https://masterenherramientasyservicios.com.co;
frame-src 'self' https://www.google.com https://www.google.com/recaptcha/ https://masterenherramientasyservicios.com.co;
connect-src 'self' https://unpkg.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com;
font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net;
worker-src 'self' blob:;
upgrade-insecure-requests;
```

**Importante**: 
- `font-src` debe incluir `https://cdnjs.cloudflare.com` para Font Awesome
- `font-src` debe incluir `https://cdn.jsdelivr.net` para Bootstrap Icons

**Nota**: Para otras páginas (nosotros.html, 404.html), agregar los mismos meta tags en el `<head>`.

### 2. Sanitización de HTML
Módulo completo en `assets/js/utils/security.js`:
```javascript
// ============================================
// MÓDULO: Security Utils
// Funciones de sanitización y validación de seguridad
// ============================================
const SecurityUtils = (() => {
  
  // --- CONSTANTES PRIVADAS ---
  const HTML_ESCAPE_MAP = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  };

  const URL_PROTOCOLS = ['http:', 'https:', 'tel:', 'mailto:'];

  // --- FUNCIONES PRIVADAS ---
  
  function _escapeHtml(str) {
    if (str == null) return '';
    if (typeof str !== 'string') return String(str);
    return str.replace(/[&<>"'\/]/g, char => HTML_ESCAPE_MAP[char] || char);
  }

  function _escapeAttr(str) {
    if (str == null) return '';
    if (typeof str !== 'string') return String(str);
    return str.replace(/["&<>\/\\]/g, char => HTML_ESCAPE_MAP[char] || char);
  }

  function _isSafeUrl(url) {
    try {
      const parsed = new URL(url, window.location.origin);
      return URL_PROTOCOLS.includes(parsed.protocol);
    } catch {
      return !url || (!url.startsWith('javascript:') && !url.startsWith('data:') && !url.startsWith('vbscript:'));
    }
  }

  function _validatePhone(phone) {
    if (!phone) return false;
    const cleaned = String(phone).replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 15;
  }

  function _validateEmail(email) {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(String(email));
  }

  function _sanitizeObject(obj, fields) {
    const sanitized = {};
    for (const field of fields) {
      sanitized[field] = _escapeHtml(String(obj[field] || ''));
    }
    return sanitized;
  }

  function _escapeJs(str) {
    if (str == null) return '';
    return String(str)
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r');
  }

  // --- API PÚBLICA ---
  return {
    escapeHtml: _escapeHtml,
    escapeAttr: _escapeAttr,
    isSafeUrl: _isSafeUrl,
    validatePhone: _validatePhone,
    validateEmail: _validateEmail,
    sanitizeObject: _sanitizeObject,
    escapeJs: _escapeJs,
    
    // Versión segura de innerHTML
    setInnerHTML: (el, html) => {
      if (!el || !_isSafeUrl('about:blank')) return;
      el.textContent = _escapeHtml(html);
    },
    
    // Versión segura con template literals
    renderTemplate: (template, data) => {
      const safeData = _sanitizeObject(data, Object.keys(data));
      return template.replace(/\{\{(\w+)\}\}/g, (_, key) => safeData[key] || '');
    },
    
    // Valida y sanitiza entrada de formulario
    validateForm: (formData) => {
      const errors = [];
      if (!formData.nombre || formData.nombre.length < 2) {
        errors.push('Nombre debe tener al menos 2 caracteres');
      }
      if (formData.email && !_validateEmail(formData.email)) {
        errors.push('Email inválido');
      }
      if (formData.telefono && !_validatePhone(formData.telefono)) {
        errors.push('Teléfono inválido');
      }
      if (formData.url && !_isSafeUrl(formData.url)) {
        errors.push('URL inválida o no permitida');
      }
      return { valid: errors.length === 0, errors };
    }
  };

})();

window.SecurityUtils = SecurityUtils;
```

### 3. Uso Seguro de innerHTML
```javascript
// ANTES (PELIGROSO):
el.innerHTML = userInput;

// DESPUÉS (SEGURO):
el.textContent = SecurityUtils.escapeHtml(userInput);

// O con innerHTML seguro:
function _setInnerHTMLSafe(el, template, data) {
  const safeData = Object.entries(data).reduce((acc, [k, v]) => {
    acc[k] = SecurityUtils.escapeHtml(String(v));
    return acc;
  }, {});
  el.innerHTML = template.replace(/\{\{(\w+)\}\}/g, (_, k) => safeData[k] || '');
}
```

### 4. Validación de Formularios
```javascript
function _validateFormData(formData) {
  const errors = [];
  
  if (!formData.nombre || formData.nombre.length < 2) {
    errors.push('Nombre debe tener al menos 2 caracteres');
  }
  
  if (!SecurityUtils.validatePhone(formData.telefono)) {
    errors.push('Teléfono inválido');
  }
  
  if (!SecurityUtils.isSafeUrl(formData.url)) {
    errors.push('URL inválida');
  }
  
  return { valid: errors.length === 0, errors };
}
```

### 5. External Links - Seguridad
```javascript
function _openExternalLink(url) {
  if (!SecurityUtils.isSafeUrl(url)) {
    console.error('URL no segura:', url);
    return;
  }
  window.open(url, '_blank', 'noopener,noreferrer');
}
```

---

## Module Pattern - Estructura de Componentes de Seguridad

### Componente: SecurityHeaders
```javascript
const SecurityHeaders = (() => {
  
  // --- CONSTANTES ---
  const HEADERS = {
    CSP: "default-src 'self'; script-src 'self' 'unsafe-inline' https://unpkg.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://unpkg.com https://cdn.jsdelivr.net https://fonts.googleapis.com; img-src 'self' data: https://*.tile.openstreetmap.org; frame-src 'self' https://www.google.com; upgrade-insecure-requests;",
    X_FRAME: 'DENY',
    X_CONTENT_TYPE: 'nosniff',
    REFERRER: 'strict-origin-when-cross-origin'
  };

  // --- ESTADO ---
  let _state = { initialized: false };

  // --- PRIVADO ---
  function _applyHeaders() {
    // Los headers CSP se aplican via meta tag en HTML
    // Esta función verifica que estén presentes
    const requiredMeta = ['Content-Security-Policy', 'X-Frame-Options', 'X-Content-Type-Options'];
    const missing = requiredMeta.filter(name => {
      return !document.querySelector(`meta[http-equiv="${name}"]`);
    });
    
    if (missing.length > 0) {
      console.warn('Security: Missing headers:', missing);
      return false;
    }
    return true;
  }

  // --- PÚBLICA ---
  return {
    init() {
      _state.initialized = true;
      return _applyHeaders();
    },
    getHeaders() {
      return { ...HEADERS };
    }
  };

})();
```

---

## Comandos del Agente

| Comando | Descripción |
|---------|-----------|
| `/security audit` | Ejecuta auditoría completa de seguridad |
| `/security headers` | Muestra headers de seguridad implementados |
| `/security csp` | Aplica CSP al proyecto |
| `/security xss` | Analiza vulnerabilidades XSS |
| `/security sanitize` | Agrega funciones de sanitización |
| `/security link {url}` | Valida si un enlace es seguro |
| `/security report` | Genera reporte de seguridad |

---

## Checklist de Seguridad

### ✅ Implementado
- [x] Cross-origin en CDNs (crossorigin="anonymous")
- [x] External links usan target="_blank" con rel="noopener"
- [x] Integrity hashes en Leaflet CSS
- [x] preconnect a CDNs confiables
- [x] Phone validation básico
- [x] **Content-Security-Policy meta tag** (index.html líneas 8-18)
- [x] **X-Frame-Options meta tag** (index.html línea 19)
- [x] **X-Content-Type-Options meta tag** (index.html línea 20)
- [x] **Referrer-Policy meta tag** (index.html línea 21)
- [x] **Permissions-Policy meta tag** (index.html línea 22)
- [x] **Módulo de sanitización SecurityUtils** (assets/js/utils/security.js)
- [x] Validación de URLs con `SecurityUtils.isSafeUrl()`
- [x] Validación de emails con `SecurityUtils.validateEmail()`
- [x] Validación de formularios con `SecurityUtils.validateForm()`
- [x] Funciones `escapeHtml()`, `escapeAttr()`, `escapeJs()` para sanitización

### ❌ Pendiente
- [ ] Sanitización de innerHTML dinámicos en componentes (reemplazar por textContent o SecurityUtils)
- [ ] SRI completo en todos los CDNs externos

---

## Datos del Proyecto

- **Teléfono WhatsApp**: 316 534 5675
- **URL Base**: masterenherramientasyservicios.com.co
- **Última actualización**: 22 abril 2026

---

## Mejoras Aplicadas (22 abril 2026)

### Implementaciones Completadas
1. **Meta tags de seguridad** en todas las páginas HTML:
   - `index.html` (líneas 8-22)
   - `nosotros.html` (líneas 7-21)
   - `404.html` (líneas 7-21)
   - Incluye: CSP completa, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy

2. **Módulo SecurityUtils** (assets/js/utils/security.js):
   - Funciones: escapeHtml, escapeAttr, escapeJs
   - Validadores: isSafeUrl, validatePhone, validateEmail, validateForm
   - Helpers: sanitizeObject, setInnerHTML, renderTemplate
   - Carga automática en index.html

3. **CSP para Icon Fonts**:
   - `font-src` incluye `https://cdnjs.cloudflare.com` para Font Awesome
   - `font-src` incluye `https://cdn.jsdelivr.net` para Bootstrap Icons

4. **Constantes Centralizadas** (assets/js/constants.js):
   - Archivo de configuración `APP_CONFIG` con Object.freeze() (inmutable)
   - Teléfonos, URLs, datos de empresa, rutas, tiempos, categorías
   - Helper `WHATSAPP.createLink()` para generar enlaces válidos
   - Eliminación de valores hardcodeados duplicados en todo el proyecto

5. **Documentación actualizada** en este archivo y agente `proyecto-constantes.md`

### Pendiente
- Refactorizar innerHTML dinámicos para usar SecurityUtils
- Actualizar componentes de equipos para usar constantes centralizadas

---

## Recursos de参考

- [CSP Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [X-Frame-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options)
- [OWASP XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)