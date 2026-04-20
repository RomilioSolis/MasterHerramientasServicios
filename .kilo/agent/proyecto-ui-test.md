# Agente: UI Tester

## ⚠️ ARQUITECTURA - REGLAS OBLIGATORIAS

### Stack del Proyecto
- **Vanilla JS** - NO frameworks
- **HTML estático** para GitHub Pages
- **NO** node_modules, Webpack, Vite

### Comunicación
- **EventEmitter** para Pub/Sub
- **NO** estado global complejo

---

## Descripción
Agente que prueba la funcionalidad de los botones y elementos interactivos del proyecto.
Sigue el Module Pattern y las reglas de troubleshooting.

---

## Reglas

1. **Module Pattern**: IIFE + Revealing Module
2. **window.UITester**: Asignar a window para acceso global
3. **No auto-ejecutar**: El usuario decide cuándo correr tests

---

## Comandos

| Comando | Descripción |
|---------|-------------|
| `/ui-test` | Ejecutar todos los tests de UI |
| `/ui-test click {selector}` | Probar click en botón específicos |

---

## Elementos a Testear

| ID | Elemento | Estado |
|----|---------|--------|
| header | Header principal | Por testear |
| equipos-dropdown | Dropdown equipos | Por testear |
| category-buttons | Botones de categorías | Por testear |
| category-filter | Filter function | Por testear |
| dark-mode | Toggle dark mode | Por testear |
| back-to-top | Botón volver arriba | Por testear |
| social-facebook | Botón Facebook | Por testear |
| social-instagram | Botón Instagram | Por testear |
| social-whatsapp | Botón WhatsApp | Por testear |
| chat-widget | Widget de chat | Por testear |
| faq-accordion | FAQ colapsable | Por testear |
| gallery | Gallery | Por testear |
| footer-links | Links del footer | Por testear |

---

## Ejemplo de Uso

En consola del navegador:
```javascript
// Ejecutar todos los tests
UITester.run()

// Probar click
UITester.testClick('.category-btn')
UITester.testClick('#dark-mode-btn')
```

---

## Resultados (20 abril 2026)

```
✅ Header: existe
✅ Dropdown Equipos: existe
✅ Botones de Categorías: 54 botones
✅ Category Filter: existe
✅ Botón Dark Mode: existe
✅ Botón Back to Top: existe
✅ Botón Facebook: existe
✅ Botón Instagram: existe
✅ Botón WhatsApp: existe
✅ Chat Widget: existe
✅ FAQ Accordion: 4 items
✅ Gallery: existe
✅ Links Footer: 7 links

Resultado: 13/13 elementos ✅
```

## Errores Corregidos

1. **Chat Widget**: Selector incorrecto → `#cw-fab`
2. **FAQ Accordion**: Selector incorrecto → `.faq-category`

---

## Filtros de Categoría (VERIFICADO ✅)

El sistema de filtros funciona correctamente:
```javascript
CategoryTester.testFilter('elevacion')
// Resultado: elevacion visible, resto oculto
```

**Componentes verificados:**
- `CategoryFilter.handleCategoryClick()` ✅
- `#netflixRows` con `.netflix-row[data-category]` ✅
- `category:select` event ✅

---

## Datos del Proyecto

- **Última actualización**: 20 abril 2026