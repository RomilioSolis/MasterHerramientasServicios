/**
 * Test FULL para ejecutar en consola de index.html
 * Copia y pega todo en la consola (F12)
 */

(function fullTest() {
  console.clear();
  console.log('%c=== FULL TEST EQUIPOS ===', 'background: #c41e3a; color: white; padding: 5px;');
  
  // 1. Verificar que existen los contenedores
  const c1 = document.getElementById('herramientas-container');
  const c2 = document.getElementById('herramientas-container-2');
  console.log('1. CONTENEDORES:');
  console.log('   #herramientas-container:', c1 ? '✓' : '✗ FALTA');
  console.log('   #herramientas-container-2:', c2 ? '✓' : '✗ FALTA');
  
  if (!c1 || !c2) {
    console.log('%cERROR: Contenedores no existen!', 'color: red; font-weight: bold;');
    return;
  }
  
  // 2. Verificar artículos
  const arts1 = c1.querySelectorAll('article');
  const arts2 = c2.querySelectorAll('article');
  console.log('2. ARTÍCULOS:');
  console.log('   Container 1:', arts1.length);
  console.log('   Container 2:', arts2.length);
  console.log('   Total:', arts1.length + arts2.length);
  
  if (arts1.length + arts2.length === 0) {
    console.log('%cERROR: No hay artículos en los contenedores!', 'color: red;');
    return;
  }
  
  // 3. Listar todos los equipos
  const todos = [...arts1, ...arts2];
  const porCategoria = {};
  todos.forEach(a => {
    const cat = a.getAttribute('data-category');
    const titulo = a.querySelector('.card-title')?.textContent?.trim() || 'SIN TÍTULO';
    if (!porCategoria[cat]) porCategoria[cat] = [];
    porCategoria[cat].push(titulo);
  });
  
  console.log('3. EQUIPOS POR CATEGORÍA:');
  Object.keys(porCategoria).forEach(cat => {
    console.log('   ' + cat + ': ' + porCategoria[cat].join(', '));
  });
  
  // 4. Verificar función global
  console.log('4. FUNCIÓN GLOBAL:');
  console.log('   window.showEquipmentDetail:', typeof window.showEquipmentDetail);
  
  // 5. Verificar Netflix rows
  const netflixRows = document.getElementById('netflixRows');
  const netflixItems = netflixRows?.querySelectorAll('.netflix-item');
  console.log('5. NETFLIX ROWS:');
  console.log('   netflixRows:', netflixRows ? '✓' : '✗');
  console.log('   Items en Netflix:', netflixItems?.length || 0);
  
  // 6. TEST CLICK - Motosierra (jardin, 1)
  console.log('6. TEST CLICK (jardin, 1 = Motosierra):');
  
  if (typeof window.showEquipmentDetail === 'function') {
    // Reset: mostrar todos temporalmente
    todos.forEach(a => a.style.display = '');
    
    // Verificar estado inicial
    let antes = todos.filter(a => a.style.display === 'block').length;
    console.log('   Equipos visibles ANTES:', antes);
    
    // Ejecutar click
    const event = { preventDefault: () => {}, stopPropagation: () => {} };
    const result = window.showEquipmentDetail(event, 'jardin', 1);
    console.log('   Resultado:', result);
    
    // Verificar después
    setTimeout(() => {
      let despues = todos.filter(a => a.style.display === 'block').length;
      console.log('   Equipos visibles DESPUÉS:', despues);
      
      // Mostrar cuáles son visibles
      const visibles = todos.filter(a => a.style.display === 'block');
      if (visibles.length > 0) {
        console.log('   EQUIPOS VISIBLES:');
        visibles.forEach(a => {
          const t = a.querySelector('.card-title')?.textContent?.trim();
          const cat = a.getAttribute('data-category');
          console.log('     - ' + t + ' (' + cat + ')');
        });
        console.log('%c✓ TEST PASSED - Las fichas se muestran!', 'color: green; font-weight: bold;');
      } else {
        console.log('%c✗ TEST FAILED - Las fichas NO se muestran', 'color: red; font-weight: bold;');
        
        // Debug: mostrar todos los display
        console.log('   DEBUG - Todos los display:');
        todos.forEach((a, i) => {
          const t = a.querySelector('.card-title')?.textContent?.trim()?.substring(0, 20);
          const cat = a.getAttribute('data-category');
          const d = a.style.display || '(vacío)';
          console.log('     ' + i + ': ' + t + ' | ' + cat + ' | display=' + d);
        });
      }
    }, 200);
  } else {
    console.log('%cERROR: window.showEquipmentDetail NO existe!', 'color: red; font-weight: bold;');
    console.log('   Las funciones globales no se están configurando.');
  }
  
  console.log('%c=== FIN ===', 'background: #c41e3a; color: white; padding: 5px;');
})();