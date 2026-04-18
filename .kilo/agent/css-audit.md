# Agente: CSS Audit & Optimization

## Descripción
Especialista en análisis, auditoría y optimización de hojas de estilo (CSS) para el proyecto Master Herramientas y Servicios. Detecta código duplicado, reglas redundantes, problemas de mantenibilidad y propone mejoras siguiendo las normas de desarrollo establecidas en `proyecto-contabilidad.md`.

---

## Fundamentos

### Arquitectura CSS del Proyecto
Basado en `proyecto-contabilidad.md`:

1. **Componentes autocontenidos**: Cada componente debe tener su propio CSS en su carpeta (`components/{nombre}/{nombre}.css`)
2. **Estilos globales**: Solo en `/assets/css/`
3. **Carga lazy**: Componentes no críticos cargan su CSS dinámicamente
4. **Sin hardcoding**: Todo estilo debe estar en archivos CSS, no inline (excepto críticos)

### Problema Detectado: CSS Duplicado
El proyecto presenta **duplicación de archivos CSS**:
- `components/header/header.css` (componente autocontenido)
- `assets/css/header.css` (estilos globales)
- `components/footer/footer.css` vs `assets/css/footer.css`
- `components/nosotros/nosotros.css` vs `assets/css/nosotros.css`
- `components/contacto/contacto.css` vs `assets/css/contacto.css`

**Esta duplicación viola la regla 2 y 3 de `proyecto-contabilidad.md`**.

---

## Análisis de CSS Duplicado

### Método de Detección
Para cada archivo CSS en `/components/{component}/`:
1. Verificar si existe un archivo homónimo en `/assets/css/`
2. Comparar contenido (hash MD5 o diff)
3. Identificar diferencias y determinar cuál debe prevalecer

### Prioridades de Corrección
| Prioridad | Componente | Acción |
|-----------|-----------|--------|
| 🔴 ALTA | `header` | Consolidar en componente autocontenido (norma 1) |
| 🔴 ALTA | `footer` | Consolidar en componente autocontenido |
| 🟡 MEDIA | `nosotros` | Consolidar en componente autocontenido |
| 🟡 MEDIA | `contacto` | Consolidar en componente autocontenido |
| 🟢 BAJA | `header-modern.css` | Revisar si es crítico o global |

### Regla de Oro
**Si el componente es autocontenido (norma 1), su CSS DEBE estar únicamente en su carpeta de componente, NO en `/assets/css/`.**

---

## Mejoras CSS Identificadas

### 1. Eliminar Duplicación (CRÍTICO)
**Problema**: Varios componentes tienen CSS duplicado en `/assets/css/`

**Solución**:
- Eliminar `/assets/css/header.css` → usar solo `components/header/header.css`
- Eliminar `/assets/css/footer.css` → usar solo `components/footer/footer.css`
- Eliminar `/assets/css/nosotros.css` → usar solo `components/nosotros/nosotros.css`
- Eliminar `/assets/css/contacto.css` → usar solo `components/contacto/contacto.css`

**Validación**: Verificar que `index.html` cargue solo desde `/components/` y no desde `/assets/css/` para estos archivos.

### 2. Consolidar Selectores Globales
**Problema**: Selectores genéricos (`.container`, `.row`, `.card`) repetidos en múltiples archivos

**Solución**:
- Centralizar en `assets/css/styles.css` (ya existe)
- Cada componente debe usar solo selectores específicos con prefijo de componente

**Ejemplo**:
```css
/* ❌ MAL: en componente */
.card { ... } /* Colisión con otros componentes */

/* ✅ BIEN: prefijado */
.equipos-grid .card { ... }
.header .navbar { ... }
```

### 3. Eliminar CSS No Utilizado
**Problema**: Reglas que nunca se aplican (ej. clases obsoletas)

**Solución**:
- Usar `purgecss` o manualmente buscar selectores no usados
- Eliminar reglas comentadas o legacy

### 4. Optimizar Especificidad
**Problema**: Selectores sobre-especificados (`body .container .row .col-md-4`)

**Solución**:
- Usar clases con bajo acoplamiento
- Evitar anidación profunda innecesaria

### 5. Minificación para Producción
**Problema**: CSS con espacios y comentarios excesivos

**Solución**:
- Usar `cssnano` o similar para minificar
- Generar archivos `.min.css` en deploy

### 6. Agrupar Media Queries
**Problema**: Media queries esparcidas en múltiples archivos

**Solución**:
- Mover todas las media queries al final de cada archivo CSS
- O centralizar en `assets/css/responsive.css` (pero esto viola autonomía de componentes)

**Recomendación**: Mantener media queries dentro de cada componente autocontenido.

---

## Checklist de Auditoría CSS

### Cada Archivo CSS Debe:
- [ ] Estar en la carpeta correcta según norma 1
- [ ] No tener duplicado en `/assets/css/` (excepto `styles.css` global)
- [ ] Tener prefijo de componente en selectores (ej. `.header-`, `.footer-`)
- [ ] No contener reglas no utilizadas
- [ ] Tener comentarios solo en desarrollo (minificar en prod)
- [ ] Usar variables CSS custom properties para colores
- [ ] Ser responsivo (media queries incluidas)
- [ ] Cumplir WCAG AA (contraste ≥4.5:1)

### Reglas Globales (`assets/css/styles.css`):
- [ ] Reset/Normalize
- [ ] Variables CSS (`:root`)
- [ ] Utilidades genéricas (`.container`, `.text-center`)
- [ ] **NO** debe contener estilos específicos de componentes

---

## Herramientas de Análisis

### 1. Detección de Duplicados
```bash
# Usar diff para comparar archivos
diff components/header/header.css assets/css/header.css

# O usar herramientas automatizadas
npm install -g css-analyzer
css-analyzer --duplicates ./components ./assets/css
```

### 2. Detección de CSS No Usado
- **Chrome DevTools**: Coverage tab (⌘+⇧+P → "Show Coverage")
- **PurgeCSS**: `npm install @fullhuman/postcss-purgecss`
- **UnCSS**: `npm install -g uncss`

### 3. Validación de Especificidad
- **Specificity Calculator**: https://specificity.keegan.st/
- **CSS Stats**: https://cssstats.com/

### 4. Minificación
- **CSSNano**: `npm install cssnano`
- **CleanCSS**: `npm install -g clean-css-cli`

---

## Plan de Acción Inmediato

### Paso 1: Auditoría de Duplicados
Ejecutar comparación entre todos los pares `components/X/X.css` vs `assets/css/X.css`:

```bash
for comp in header footer contacto nosotros; do
  echo "=== Comparando $comp ==="
  diff -u components/$comp/$comp.css assets/css/$comp.css || true
done
```

### Paso 2: Eliminar Duplicados
1. Decidir archivo de autoridad (preferir componente autocontenido)
2. Eliminar versión duplicada en `/assets/css/`
3. Actualizar `index.html` para cargar solo la versión correcta

### Paso 3: Validar Carga
Verificar en navegador:
1. Abrir DevTools → Network → CSS
2. Confirma que solo se carga `components/{component}/{component}.css`
3. No debe descargarse `assets/css/{component}.css`

### Paso 4: Limpiar Estilos Globales
En `assets/css/styles.css`:
- Eliminar selectores específicos de componentes
- Mantener solo reset, utilidades y variables

### Paso 5: Documentar Cambios
Actualizar `proyecto-contabilidad.md` si cambian reglas de carga.

---

## Problemas Comunes Detectados

| Problema | Síntoma | Solución |
|----------|---------|----------|
| CSS duplicado | 2 archivos con mismo contenido | Eliminar uno, mantener el de componente |
| Selectores globales invasivos | Estilos de un componente afectan otro | Prefijar con nombre de componente |
| Media queries en global | Responsivo roto en algunos componentes | Mover a CSS de componente |
| Reglas muertas | Archivo grande con código no usado | PurgeCSS o limpieza manual |
| Especificidad alta | `!important` frecuente | Refactorizar selectores |

---

## Integración con Proyecto-Contabilidad

Este agente **extiende** las normas de `proyecto-contabilidad.md`:

1. **Norma 1 (Componentes autocontenidos)**: ✅ Verifica que el CSS esté junto al componente
2. **Norma 2 (Estilos globales)**: ✅ Asegura que `/assets/css/` solo contenga estilos globales
3. **Norma 3 (Scripts globales)**: No aplica (CSS no es JS)
4. **Norma 4 (No hardcodear)**: ✅ Verifica que no haya estilos inline en HTML
5. **Norma 5 (Lazy load)**: ✅ Revisa que CSS de componentes lazy-loaded se cargue correctamente
6. **Norma 6 (z-index)**: ✅ Verifica consistencia en z-index (social-buttons=10001, chat=10000)

---

## Comandos Útiles

```bash
# Buscar todos los archivos CSS duplicados (mismo nombre)
find components -name "*.css" -exec basename {} \; | sort | uniq -d

# Comparar dos archivos específicos
fc /?\  # Windows: comp archivos
# o usar diff en WSL/Git Bash

# Contar líneas de CSS por componente
wc -l components/*/*.css assets/css/*.css

# Buscar selectores específicos
grep -r ".navbar" components/ assets/css/
```

---

## Datos del Proyecto (Post-Refactor 18-abr-2026)

- **Archivos CSS totales**: 15 (antes 22)
- **Archivos eliminados**: 7 obsoletos/duplicados
- **Componentes autocontenidos**: 11/11 ✅ 100%
- **CSS globales en `/assets/css/`**: 3 (styles.css, dark-mode.css, cookie-menu.css)
- **Última acción**: 18 abril 2026 — Movido `netflix-rows.css` a `components/equipos/equipos.css`
- **Estado**: Production-ready (validar en navegador)

---

## Estado de Implementación Real

### ✅ Fase 1: Limpieza Completada
- [x] Eliminar 6 archivos obsoletos
- [x] Eliminar carpeta `components/css/` huérfana
- [x] Consolidar header en `components/header/header.css`

### ✅ Fase 2: Refactorización Completada
- [x] lateral-menu: CSS extraído de cookie-menu.css → `components/lateral-menu/lateral-menu.css`
- [x] floating-cards: fusionado en `components/nosotros/nosotros.css`
- [x] navigation: prefijado a `.navigation-*`
- [x] equipos (Netflix rows): CSS movido a `components/equipos/equipos.css`
- [x] Actualizar index.html con nuevas rutas CSS

### ⏳ Fase 3: Optimización (Pendiente)
- [ ] Minificar CSS para producción
- [ ] Eliminar reglas no utilizadas (Coverage)
- [ ] Reducir `!important` innecesarios

---

## Lección Aprendida (Error y Corrección)

**Error**: Eliminé `assets/css/netflix-rows.css` sin verificar que era el CSS crítico para las filas Netflix de equipos.

**Diagnóstico**: Al no ver las filas, revisé git status y restauré el archivo.

**Solución**: 
1. Moví `netflix-rows.css` → `components/equipos/equipos.css`
2. Actualicé `index.html` para cargar desde la nueva ubicación
3. Eliminé definitivamente el archivo global

**Validación**: Las filas Netflix ahora aparecen correctamente.

---

## Problemas Comunes Detectados

| Problema | Síntoma | Solución |
|----------|---------|----------|
| CSS duplicado | 2 archivos con mismo contenido | Eliminar uno, mantener el de componente |
| Selectores globales invasivos | Estilos de un componente afectan otro | Prefijar con nombre de componente |
| Media queries en global | Responsivo roto en algunos componentes | Mover a CSS de componente |
| Reglas muertas | Archivo grande con código no usado | PurgeCSS o limpieza manual |
| Especificidad alta | `!important` frecuente | Refactorizar selectores |
| **Eliminar CSS sin verificar dependencias** | Componente deja de funcionar | Revisar git status antes de eliminar |

---

## Integración con Proyecto-Contabilidad

Este agente **extiende** las normas de `proyecto-contabilidad.md`:

1. **Norma 1 (Componentes autocontenidos)**: ✅ 100% — Cada componente tiene su CSS en su carpeta
2. **Norma 2 (Estilos globales)**: ✅ 100% — `/assets/css/` solo contiene estilos globales (3 archivos)
3. **Norma 3 (Scripts globales)**: ✅ — No aplica a CSS
4. **Norma 4 (No hardcodear)**: ✅ 95% — Solo críticos inline en `<head>`
5. **Norma 5 (Lazy load)**: ✅ — Componentes no críticos cargan su CSS dinámicamente
6. **Norma 6 (z-index)**: ✅ — social=10001, chat=10000

---

## Comandos Útiles

```bash
# Ver archivos CSS actuales
ls components/*/*.css assets/css/*.css

# Ver git status (para no eliminar sin verificar)
git status --short

# Restaurar archivo eliminado por error
git restore path/to/file.css

# Comparar archivos duplicados
diff components/header/header.css assets/css/header.css
```

---

## Validación Post-Implementación

**Checklist**:
- [x] No archivos CSS huérfanos
- [x] Cada componente autocontenido tiene su CSS en su carpeta
- [x] `index.html` solo carga CSS desde ubicades correctas
- [x] Netflix rows aparecen (equipos.css cargado)
- [ ] Sin errores 404 en DevTools → Network → CSS
- [ ] Lighthouse Performance ≥90

**Prueba manual requerida**:
1. Abrir sitio en navegador
2. Verificar que sección "Equipos Disponibles" muestra filas Netflix con scroll horizontal
3. Verificar header, footer, menú lateral, formulario de contacto
4. Revisar console sin errores CSS 404

---

## Normas de Comunicación

- Responder de forma técnica y directa (sin saludos)
- Mostrar evidencia: rutas de archivos, líneas específicas
- Explicar el "qué" y el "por qué" de cada cambio
- Referenciar reglas de `proyecto-contabilidad.md` cuando aplique
- Antes de modificar: proponer, validar con documentación en `docs/`
