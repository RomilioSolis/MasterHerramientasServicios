/**
 * Test para ejecutar en la CONSOLA del navegador (F12)
 * Cuando estés en la página principal (index.html)
 * 
 * Instrucciones:
 * 1. Abre index.html en tu navegador
 * 2. Abre la consola (F12)
 * 3. Copia y pega todo este código
 * 4. Presiona Enter
 */

// Este test verifica si los contenedores y equipos existen en index.html
// Copia y pega en la consola:

(function test() {
  console.log('%c=== DEBUG EQUIPOS ===', 'color: #c41e3a; font-weight: bold; font-size: 14px;');
  
  // Verificar contenedores
  const c1 = document.getElementById('herramientas-container');
  const c2 = document.getElementById('herramientas-container-2');
  console.log('Contenedor #herramientas-container:', c1 ? '✓ EXISTE' : '✗ NO EXISTE');
  console.log('Contenedor #herramientas-container-2:', c2 ? '✓ EXISTE' : '✗ NO EXISTE');
  
  // Contar artículos
  const arts1 = c1 ? c1.querySelectorAll('article') : [];
  const arts2 = c2 ? c2.querySelectorAll('article') : [];
  console.log('Artículos en container1:', arts1.length);
  console.log('Artículos en container2:', arts2.length);
  
  // Verificar categorías
  const todos = [...arts1, ...arts2];
  if (todos.length > 0) {
    console.log('%cEquipos por categoría:', 'color: #198754; font-weight: bold;');
    const porCat = {};
    todos.forEach(a => {
      const cat = a.getAttribute('data-category') || 'sin categoría';
      const tit = a.querySelector('.card-title')?.textContent?.trim() || 'SIN TÍTULO';
      (porCat[cat] = porCat[cat] || []).push(tit);
    });
    Object.keys(porCat).forEach(cat => {
      console.log('  ' + cat + ': ' + porCat[cat].join(', '));
    });
  } else {
    console.log('%cERROR: No hay artículos!', 'color: #dc3545; font-weight: bold;');
  }
  
  // Verificar función
  console.log('showEquipmentDetail:', typeof window.showEquipmentDetail === 'function' ? '✓ EXISTS' : '✗ NO EXISTE');
  
  // Test click
  console.log('%c--- TEST CLICK (jardin, 1) ---', 'color: #0d6efd; font-weight: bold;');
  
  if (typeof window.showEquipmentDetail === 'function') {
    const event = { preventDefault: () => {}, stopPropagation: () => {} };
    const result = window.showEquipmentDetail(event, 'jardin', 1);
    console.log('Resultado showEquipmentDetail:', result);
    
    setTimeout(() => {
      const visibles = todos.filter(a => a.style.display !== 'none');
      console.log('Equipos visibles después del click:', visibles.length);
      visibles.forEach(a => {
        const t = a.querySelector('.card-title')?.textContent?.trim();
        console.log('  ✓ ' + t);
      });
      
      if (visibles.length === 0) {
        console.log('%cERROR: Ningún equipo visible después del click!', 'color: #dc3545;');
        console.log('Todos los estilos display:', todos.map(a => a.style.display || 'empty (no tiene style)'));
      } else {
        console.log('%c✓ TEST PASSED', 'color: #198754; font-weight: bold;');
      }
    }, 100);
  } else {
    console.log('%cERROR: Función no existe!', 'color: #dc3545;');
  }
  
  console.log('%c=== FIN ===', 'color: #c41e3a;');
})();

console.log('%cCopia y pega el código de arriba en la consola y presiona Enter', 'color: #ffc107; background: #333; padding: 5px;');