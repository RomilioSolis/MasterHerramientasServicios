# Diagnóstico: Botones Sociales (Social Buttons)

**Fecha**: 18 de abril, 2026  
**Estado**: 🔧 EN CORRECCIÓN

---

## Problema

Los botones sociales (Facebook, Instagram, WhatsApp) no aparecen en el lateral derecho de la página.

---

## Bugs Encontrados

### Bug 1:/scripts type="module" tienen comportamiento diferido
- **Ubicación**: `index.html` líneas 464-467 (original)
- **Causa**: Los scripts con `type="module"` se comportan como `defer` y pueden ejecutarse antes de que el DOM esté completamente listo
- **Solución**: Cambiar a import dinámico dentro de `DOMContentLoaded`

### Bug 2: CSS externo falla silenciosamente  
- **Ubicación**: `components/social-buttons/social-buttons.js`
- **Causa**: Si el CSS externo no carga, los botones no tienen estilos
- **Solución**: Agregar CSS embebido como fallback

### Bug 3: Sin estilos de fallback en el contenedor
- **Ubicación**: `index.html` línea 460
- **Causa**: El contenedor no tenía estilos inline base
- **Solución**: Agregar estilos inline mínimos como última línea de defensa

---

## Cambios Realizados

### 1. index.html - Carga robusta

**Antes**:
```html
<script type="module">
  import SocialButtons from '/components/social-buttons/social-buttons.js';
  SocialButtons.init();
</script>
```

**Después**:
```html
<script>
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
      import('/components/social-buttons/social-buttons.js').then(function(module) {
        var SocialButtons = module.default;
        SocialButtons.init();
      }).catch(function(err) {
        console.error('SocialButtons: error importando módulo:', err);
      });
    }, 100);
  });
</script>
```

### 2. index.html - Estilos inline de fallback

**Antes**:
```html
<div id="social-buttons-container"></div>
```

**Después**:
```html
<div id="social-buttons-container" style="position:fixed;right:20px;top:50%;transform:translateY(-50%);z-index:10001;display:flex;flex-direction:column;gap:10px;"></div>
```

### 3. social-buttons.js - CSS embebido como fallback

**Agregado**:
- Constante `SOCIAL_BUTTONS_CSS` con estilos embebidos
- Función `injectInlineStyles()` como backup
- Timeout de 2 segundos para aplicar CSS embebido si el externo falla
- Retry de hasta 5 veces para cargar el HTML

---

## Cómo Verificar

1. Abrir la consola del navegador (F12)
2. Recargar la página
3. Buscar mensajes:
   - ✅ `SocialButtons: módulo importado correctamente`
   - ✅ `SocialButtons: CSS externo cargado` o `SocialButtons: CSS embebido aplicado`
   - ✅ `SocialButtons: HTML inyectado`
4. Si los botones aparecen en el lateral derecho, el bug está resuelto

### Si siguen sin aparecer:

1. Revisar la consola por errores rojOS
2. Verificar que `#social-buttons-container` tenga contenido:
   ```javascript
   document.getElementById('social-buttons-container').innerHTML
   ```
3. Verificar que los estilos se aplicaron:
   ```javascript
   document.getElementById('social-buttons-inline-styles')
   // o
   document.getElementById('social-buttons-styles')
   ```

---

## Archivos Modificados

| Archivo | Cambios |
|---------|---------|
| `index.html` | Script module → import dinámico, estilos inline en contenedor |
| `components/social-buttons/social-buttons.js` | CSS embebido fallback, retry logic |

---

**Última actualización**: 18 de abril, 2026  
**Estado**: 🔧 EN CORRECCIÓN