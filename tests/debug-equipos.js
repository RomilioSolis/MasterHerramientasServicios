/**
 * Test de debug simplificado - Ejecutar en consola del navegador
 * Copia y pega este código en la consola (F12) de tu navegador
 */

(function debugEquipos() {
  console.log('=== DEBUG EQUIPOS ===');
  
  // 1. Contenedores
  console.log('1. Contenedores:');
  console.log('   herramientas-container:', !!document.getElementById('herramientas-container'));
  console.log('   herramientas-container-2:', !!document.getElementById('herramientas-container-2'));
  
  // 2. Artículos
  const c1 = document.getElementById('herramientas-container');
  const c2 = document.getElementById('herramientas-container-2');
  const arts1 = c1 ? c1.querySelectorAll('article') : [];
  const arts2 = c2 ? c2.querySelectorAll('article') : [];
  console.log('   Artículos container1:', arts1.length);
  console.log('   Artículos container2:', arts2.length);
  
  // 3. Por categoría
  console.log('2. Artículos por categoría:');
  const cats = {};
  [...arts1, ...arts2].forEach(a => {
    const cat = a.getAttribute('data-category');
    const tit = a.querySelector('.card-title');
    const nombre = tit ? tit.textContent.trim() : 'SIN TITULO';
    (cats[cat] = cats[cat] || []).push(nombre);
  });
  Object.keys(cats).forEach(c => console.log('   ' + c + ':', cats[c].join(', ')));
  
  // 4. Netflix items
  console.log('3. Netflix items:');
  const items = document.querySelectorAll('.netflix-item');
  console.log('   Total:', items.length);
  
  // 5. Función
  console.log('4. showEquipmentDetail:', typeof window.showEquipmentDetail);
  
  // 6. Test click
  console.log('5. Probando click en Motosierra (jardin, 1):');
  if (typeof window.showEquipmentDetail === 'function') {
    try {
      showEquipmentDetail({ preventDefault: function(){}, stopPropagation: function(){} }, 'jardin', 1);
      setTimeout(() => {
        const visibles = [...arts1, ...arts2].filter(a => a.style.display !== 'none');
        console.log('   Equipos visibles:', visibles.length);
        visibles.forEach(a => {
          const t = a.querySelector('.card-title');
          console.log('   -', t ? t.textContent.trim() : '???');
        });
        if (visibles.length === 0) {
          console.log('ERROR: Ninguno visible!');
          console.log('  Todos display:', [...arts1, ...arts2].map(a => a.style.display || 'empty'));
          console.log('  Todos active:', [...arts1, ...arts2].map(a => a.classList.contains('active')));
        }
      }, 100);
    } catch(e) {
      console.log('   Error:', e.message);
    }
  } else {
    console.log('   Función NO existe!');
  }
  
  console.log('=== FIN DEBUG ===');
})();