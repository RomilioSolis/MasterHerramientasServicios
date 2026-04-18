/**
 * Test Debug para equipos - Ejecute en consola del navegador
 * Copie y pegue este código en la consola (F12)
 */

(function() {
  console.log('=== DEBUG EQUIPOS ===');
  
  // 1. Verificar contenedores
  const c1 = document.getElementById('herramientas-container');
  const c2 = document.getElementById('herramientas-container-2');
  console.log('Contenedor 1:', c1 ? 'EXISTE' : 'NO EXISTE');
  console.log('Contenedor 2:', c2 ? 'EXISTE' : 'NO EXISTE');
  
  // 2. Artículos
  const arts1 = c1?.querySelectorAll('article') || [];
  const arts2 = c2?.querySelectorAll('article') || [];
  console.log('Artículos container1:', arts1.length);
  console.log('Artículos container2:', arts2.length);
  
  // 3. Por categoría
  const todos = [...arts1, ...arts2];
  const porCat = {};
  todos.forEach(a => {
    const cat = a.getAttribute('data-category');
    const tit = a.querySelector('.card-title')?.textContent?.trim() || 'SIN TITULO';
    (porCat[cat] = porCat[cat] || []).push(tit);
  });
  console.log('Por categoría:', porCat);
  
  // 4. Función
  console.log('showEquipmentDetail:', typeof window.showEquipmentDetail);
  
  // 5. Test click Motosierra
  console.log('\n--- TEST CLICK (jardin, 1) ---');
  if (typeof window.showEquipmentDetail === 'function') {
    try {
      const event = { preventDefault: ()=>{}, stopPropagation: ()=>{} };
      const result = window.showEquipmentDetail(event, 'jardin', 1);
      console.log('Resultado:', result);
      
      setTimeout(() => {
        const visibles = todos.filter(a => a.style.display !== 'none');
        console.log('Equipos visibles:', visibles.length);
        visibles.forEach(a => {
          const t = a.querySelector('.card-title')?.textContent?.trim();
          console.log(' -', t);
        });
        if (visibles.length === 0) {
          console.log('ERROR: Ninguno visible!');
          console.log('Todos display:', todos.map(a => a.style.display || 'empty'));
        }
      }, 200);
    } catch(e) {
      console.log('Error:', e.message);
    }
  } else {
    console.log('ERROR: Función no existe!');
  }
  
  console.log('=== FIN ===');
})();