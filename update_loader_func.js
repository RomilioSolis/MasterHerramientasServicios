const fs = require('fs');
const path = 'components/equipos/loader.js';
let content = fs.readFileSync(path, 'utf8');

// Leer la nueva función
const newFunction = fs.readFileSync('components/equipos/_renderNetflixItem_temp.js', 'utf8');

// Encontrar la función vieja
const oldFunctionStart = content.indexOf('async function _renderNetflixItem(equipo, rowContent)');
if (oldFunctionStart === -1) {
  console.log('No se encontró la función para actualizar');
  process.exit(1);
}

// Encontrar el cierre balanceado
let braceCount = 0;
let i = oldFunctionStart;
for (; i < content.length; i++) {
  if (content[i] === '{') braceCount++;
  else if (content[i] === '}') {
    braceCount--;
    if (braceCount === 0) break;
  }
}
const oldFunctionEnd = i + 1;

// Reemplazar
content = content.substring(0, oldFunctionStart) + newFunction + content.substring(oldFunctionEnd);

fs.writeFileSync(path, content);
console.log('Función _renderNetflixItem actualizada exitosamente');

// Limpiar archivo temporal
fs.unlinkSync('components/equipos/_renderNetflixItem_temp.js');