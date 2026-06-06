#!/bin/bash
# Script para convertir imágenes JPG a WebP y actualizar referencias
# Uso: bash convert_to_webp.sh

set -e

echo "=== Conversión de imágenes a WebP ==="
echo ""

# Directorio base
BASE_DIR="/home/masterenherramientas/master-herramientas"
IMG_DIR="$BASE_DIR/assets/imagenes"

# Calidad de conversión (0-100, 80 es buen balance)
QUALITY=80

# Convertir todas las imágenes JPG/JPEG en subdirectorios
echo "Convirtiendo imágenes JPG a WebP..."
find "$IMG_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" \) | while read -r img; do
    # Obtener ruta sin extensión
    base="${img%.*}"
    # Solo convertir si no existe el .webp
    if [ ! -f "${base}.webp" ]; then
        echo "  Convirtiendo: $(basename "$img") -> $(basename "${base}.webp")"
        cwebp -q "$QUALITY" "$img" -o "${base}.webp"
    else
        echo "  Ya existe WebP: $(basename "${base}.webp")"
    fi
done

echo ""
echo "=== Actualizando referencias en archivos ==="
echo ""

# Función para actualizar referencias en archivos
update_references() {
    local file="$1"
    if [ ! -f "$file" ]; then
        return
    fi
    
    # Reemplazar referencias a .jpg/.jpeg por .webp (mantener original como fallback)
    # Usamos sed para hacer reemplazos seguros
    sed -i 's/\.jpg"/\.webp"/g' "$file" 2>/dev/null || true
    sed -i 's/\.jpeg"/\.webp"/g' "$file" 2>/dev/null || true
    sed -i "s/\.jpg'/\.webp'/g" "$file" 2>/dev/null || true
    sed -i "s/\.jpeg'/\.webp'/g" "$file" 2>/dev/null || true
}

# Actualizar archivos HTML de equipos
echo "Actualizando components/equipos/*.html..."
for file in "$BASE_DIR"/components/equipos/*.html; do
    if [ -f "$file" ]; then
        update_references "$file"
    fi
done

# Actualizar archivos JSON
echo "Actualizando assets/data/equipos.json..."
if [ -f "$BASE_DIR/assets/data/equipos.json" ]; then
    # Hacer backup
    cp "$BASE_DIR/assets/data/equipos.json" "$BASE_DIR/assets/data/equipos.json.bak"
    # Reemplazar .jpg/.jpeg por .webp en el campo imagen
    sed -i 's/\.jpg"/\.webp"/g' "$BASE_DIR/assets/data/equipos.json"
    sed -i 's/\.jpeg"/\.webp"/g' "$BASE_DIR/assets/data/equipos.json"
    sed -i "s/\.jpg'/\.webp'/g" "$BASE_DIR/assets/data/equipos.json"
    sed -i "s/\.jpeg'/\.webp'/g" "$BASE_DIR/assets/data/equipos.json"
fi

# Actualizar index.html si tiene referencias a imágenes específicas
echo "Actualizando index.html..."
if [ -f "$BASE_DIR/index.html" ]; then
    update_references "$BASE_DIR/index.html"
fi

echo ""
echo "=== Resumen ==="
echo ""
echo "Archivos WebP creados:"
find "$IMG_DIR" -type f -name "*.webp" | wc -l
echo ""
echo "Tamaño de imágenes originales vs WebP:"
echo "Originales (JPG/JPEG):"
du -sh "$IMG_DIR"/*.jpg "$IMG_DIR"/*.jpeg 2>/dev/null | sort -rh | head -5 || echo "  No hay JPGs en raíz"
echo ""
echo "WebP:"
du -sh "$IMG_DIR"/*.webp 2>/dev/null | sort -rh | head -5 || echo "  No hay WebPs en raíz"

echo ""
echo "=== Conversión completada ==="
echo ""
echo "Nota: Los archivos JPG originales se mantienen como fallback."
echo "Los navegadores modernos usarán WebP automáticamente."
