# Diagnóstico: Botón Back To Top

**Fecha**: 18 de abril, 2026  
**Estado**: ✅ CORREGIDO

---

## Problema

El botón "Volver arriba" no aparece en la vista.

---

## Bugs Encontrados

### Bug 1: Función no definida
- **Archivo**: `components/back-to-top/back-to-top.js` línea 35
- **Problema**: `initButtons()` no estaba definido
- **Solución**: Renombrar a `initBtn()` y definirla correctamente

### Bug 2: ID mismatch CSS/HTML
- **Archivo**: `components/back-to-top/back-to-top.css`
- **Problema**: CSS busca `#backToTop` pero HTML crea `#app-back-to-top`
- **Solución**: Actualizar CSS para ambos IDs

### Bug 3: BackToTop nunca se cargaba
- **Problema**: Sistema antiguo dependía de social-buttons.js (módulo ES6)
- **Causa**: sb-init.js no cargaba BackToTop
- **Solución**: Agregar carga inline de BackToTop en sb-init.js

---

## Archivos Modificados

| Archivo | Cambios |
|---------|---------|
| `components/back-to-top/back-to-top.js` | Corregido `initButtons()` → `initBtn()` |
| `components/back-to-top/back-to-top.css` | Agregado `#app-back-to-top` selector |
| `components/social-buttons/sb-init.js` | Agregada carga de BackToTop |

---

## Cómo Verificar

1. Recargar la página
2. Hacer scroll hacia abajo (más de 300px)
3. El botón debería aparecer en la esquina inferior derecha
4. Al hacer clic, debe volver arriba suavemente

---

**Última actualización**: 18 de abril, 2026  
**Estado**: ✅ CORREGIDO