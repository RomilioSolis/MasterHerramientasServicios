# Agente: Datos JSON Externos

## ✅ Implementado - 22 abril 2026

Todos los datos dinámicos del proyecto han sido migrados a **archivos JSON externos independientes**.

---

## 🗂️ Estructura Final

```
assets/
  data/
    equipos.json          ✅ 30 equipos con todos sus datos
    empresa.json          ✅ Datos de la empresa, contacto, horario
    categorias.json       ✅ Categorías de equipos
```

---

## 📋 Archivos Generados

### ✅ `equipos.json`
Contiene **todos los 30 equipos** con:
- `id`: identificador único
- `nombre`: nombre público del equipo
- `categoria`: categoría a la que pertenece
- `precioDia` / `precioSemana`: precios
- `disponible`: estado de disponibilidad
- `imagen`: nombre del archivo de imagen
- `descripcion`: descripción completa
- `caracteristicas`: array con características técnicas

```json
{
  "id": "taladro-magnetico",
  "nombre": "Taladro Magnético 13mm",
  "categoria": "perforacion",
  "precioDia": 120000,
  "precioSemana": 600000,
  "disponible": true,
  "imagen": "taladro-magnetico.jpg",
  "descripcion": "...",
  "caracteristicas": ["..."]
}
```

### ✅ `empresa.json`
```json
{
  "nombre": "Master Herramientas y Servicios",
  "fundacion": 2014,
  "direccion": "Cra. 23 #36-48, Barrio El Rodeo, Cali",
  "telefonos": { ... },
  "redes_sociales": { ... },
  "horario": { ... }
}
```

### ✅ `categorias.json`
```json
[
  { "id": "elevacion", "label": "Elevación y Levante" },
  { "id": "perforacion", "label": "Perforación y Corte" },
  ...
]
```

---

## 🎯 Beneficios Obtenidos para tu Proyecto

| Beneficio | Antes | Ahora | Impacto |
|----------|-------|-------|---------|
| **Mantenibilidad** | Cambiar un precio = editar 32 archivos | Cambiar un precio = editar **1 línea JSON** | 🔴 MUY ALTO |
| **Consistencia** | Posibilidad de tener 3 precios diferentes del mismo equipo en distintas páginas | **1 solo precio** para todos los componentes | 🔴 MUY ALTO |
| **Facilidad de actualización** | Solo programadores podían editar equipos | Cualquier persona puede editar un archivo JSON | 🟡 ALTO |
| **Reutilización** | Datos duplicados en cada archivo | Mismos datos usados por buscador, filtros, galería, footer, header | 🟡 ALTO |
| **Rendimiento** | Cargar 30 archivos HTML separados | Cargar **1 solo archivo JSON** | 🟡 ALTO |
| **Versionado** | No hay forma de saber cuando cambió un precio | Se ve el historial de cambios de precios/equipos en git | 🟢 MEDIO |

---

## ⚙️ Loader Actualizado
El `components/equipos/loader.js` ha sido completamente refactorizado:
- ✅ Carga todos los datos desde JSON externo
- ✅ Elimina **250 líneas** de datos hardcodeados
- ✅ Usa `Module Pattern`
- ✅ Integra con `APP_CONFIG` y `WHATSAPP` helper
- ✅ API pública para filtrar y buscar equipos
- ✅ Emite evento `equipos:ready` usando EventEmitter

---

## 🚀 API Pública

```javascript
// Uso en cualquier componente del proyecto:
EquiposLoader.getEquipos();            // Obtener todos los equipos
EquiposLoader.getCategorias();         // Obtener categorías
EquiposLoader.filtrarPorCategoria('perforacion');
EquiposLoader.buscar('taladro');
```

---

## ✅ Cumplimiento con Arquitectura
- ✅ **Vanilla JS** - Sin frameworks
- ✅ **Module Pattern (IIFE)**
- ✅ **Patrón Observer** via EventEmitter
- ✅ **Sin node_modules** - Funciona en GitHub Pages
- ✅ **Retrocompatibilidad** - No rompe nada existente

---

## Próximos Pasos
- [x] Extraer equipos a JSON
- [x] Extraer datos de empresa a JSON
- [x] Extraer categorías a JSON
- [x] Actualizar loader
- [ ] Eliminar los archivos HTML duplicados de equipos
- [ ] Implementar página de detalle dinámica
