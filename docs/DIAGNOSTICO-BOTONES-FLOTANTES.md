# Diagnóstico: Botones Flotantes Lateral

**Fecha**: 18 de abril, 2026  
**Estado**: ✅ OPERATIVO  
**Resumen**: Botones sociales en lado derecho, Chat widget en lado izquierdo (separados)

---

## 🎯 Componentes Flotantes (Actual)

| Componente | Ubicación | Lado | Funcionalidad |
|------------|-----------|------|---------------|
| **Social Buttons** | right: 20px, top: 50% | DERECHO | 3 botones: Facebook, Instagram, WhatsApp |
| **Chat Widget** | left: 20px, bottom: 85px | IZQUIERDO | Chat flotante que se abre/cierra |
| **Back To Top** | right: 20px, bottom: 20px | DERECHO | Botón volver arriba |

---

## 🔍 Problema Original

Usuario reportaba que los botones sociales (Facebook, Instagram, WhatsApp) no aparecían en el lateral derecho.

---

## 📋 Problemas Identificados y Soluciones

### Problema 1: Z-Index Bajo (✅ RESUELTO)
- **Descripción**: Los botones sociales tenían `z-index: 1000` mientras el chat widget tiene `z-index: 10000`
- **Causa**: Los botones quedaban ocultos por el chat widget
- **Solución**: Aumentado z-index a `10001` en `social-buttons.css`

### Problema 2: Chat Widget Duplicado (✅ RESUELTO)
- **Descripción**: Dos bloques de Chat Widget en index.html con ID duplicado `cw-fab`
- **Ubicación original**: 
  - Línea ~499: Primer Chat Widget 
  - Línea ~593: Segundo Chat Widget duplicado
- **Solución**: 
  1. Eliminado el bloque duplicado de index.html
  2. Creado componente `components/chat-widget/` para carga limpia via lazy load

### Problema 3: BackToTop con ID Incorrecto (✅ RESUELTO)
- **Descripción**: Los estilos CSS buscaban `#backToTop` pero el JS crea `#app-back-to-top`
- **Solución**: Actualizado el selector CSS para incluir ambos IDs

---

## 🔧 Estructura de Carga (index.html)

```html
<!-- Social Buttons - Carga inmediata -->
<div id="social-buttons-container"></div>
<script type="module">
  import SocialButtons from '/components/social-buttons/social-buttons.js';
  SocialButtons.init();
</script>

<!-- Chat Widget - Carga lazy (500ms) + init (800ms) -->
<div id="chat-widget-container"></div>
<script>
  // Carga HTML desde componente
</script>
<script type="module">
  import ChatWidgetLoader from '/components/chat-widget/chat-widget.js';
  setTimeout(() => ChatWidgetLoader.init(), 800);
</script>
```

---

## 📁 Archivos Involucrados

| Archivo | Propósito |
|---------|-----------|
| `index.html` | Contenedores + carga de componentes |
| `components/social-buttons/social-buttons.js` | Loader de social-buttons + BackToTop |
| `components/social-buttons/social-buttons.css` | Estilos (z-index: 10001) |
| `components/chat-widget/chat-widget.html` | HTML del chat (FAB + ventana) |
| `components/chat-widget/chat-widget.js` | Loader que importa chat-widget.js |
| `assets/js/chat-widget.js` | Lógica completa del chat |

---

## 📝 Regla de Organización

> **Social Buttons y Chat Widget son componentes SEPARADOS**
> - Social Buttons → Lado DERECHO → Botones directos a redes
> - Chat Widget → Lado IZQUIERDO → Chat flotante con ventana

---

**Última actualización**: 18 de abril, 2026  
**Estado**: ✅ OPERATIVO
