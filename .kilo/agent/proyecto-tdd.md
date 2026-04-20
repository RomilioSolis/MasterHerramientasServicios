# Agente: TDD - Test Driven Development

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
Agente que aplica Test Driven Development para el proyecto. Define el flujo: Red-Green-Refactor y ejecuta tests antes de implementar nuevas funcionalidades.

---

## RESULTADO DE TESTS (20 abril 2026)

```
✅ footer-container: HTML cargado
✅ faq-container: HTML cargado
✅ contacto-container: HTML cargado
✅ horario-card-container: HTML chargé
✅ social-buttons-container: HTML chargé
✅ chat-widget-container: HTML chargé

Resultado: 6/6 componentes
```

## Flujo TDD

```
1. RED    → Escribir test que falla
2. GREEN  → Implementar lo mínimo para pasar
3. REFACTOR → Mejorar código manteniendo tests
```

---

## Comandos TDD

| Comando | Descripción |
|---------|-------------|
| `/tdd test` | Verificar estado actual |
| `/tdd run` | Ejecutar todos los tests |
| `/tdd status` | Mostrar estado de cada componente |

---

## Componentes con Test

| Componente | Test | Estado |
|-----------|------|--------|
| factory | `load()` carga HTML/CSS/JS | 🟢 PASS |
| footer | Contenedor tiene HTML | 🟢 PASS |
| faq | Contenedor tiene HTML | 🟢 PASS |
| contacto | Contenedor tiene HTML | 🟢 PASS |
| horario | Contenedor tiene HTML | 🟢 PASS |
| social-buttons | Script ejecuta | 🟢 PASS |
| chat-widget | Contenedor tiene HTML | 🟢 PASS |

---

## Test Actual (component-tester.js)

```javascript
// Verificar contenido en container
function checkContainer(containerId) {
  const el = document.getElementById(containerId);
  return el && el.innerHTML.trim().length > 0;
}

// Verificar CSS cargado
function checkStyles(cssPath) {
  return !!document.querySelector(`link[href="${cssPath}"]`);
}

// Ejecutar todos
ComponentTester.run();
```

---

## Ejemplo: Agregar Test

```
/tdd add social-buttons
→ Escribir test que verifique sb-init.js ejecutado
→ Verificar que falla (RED)
→ Implementar carga en factory
→ Verificar que pasa (GREEN)
```

---

## Workflow para ComponentFactory

```
1. /tdd test
   → Verifica estado actual
   
2. Si hay fallos:
   → Revisar console.log del factory
   → Corregir ruta en registry
   → No modificar test
   
3. Verde:
   → Listo para nueva feature
```

---

## Ejecución de Tests

### En consola del navegador (F12):

```javascript
// Verificar estado actual
ComponentTester.run()

// Retry automático
ComponentTester.retry()

// Ver resultado de un componente
ComponentTester.check('footer-container')
```

### Estados esperados:
- 🔴 ROJO: Test falla
- 🟢 VERDE: Test pasa
- ⚠️ PARTIAL: Solo HTML o solo CSS

---

## Datos del Proyecto

- **Última actualización**: 20 abril 2026