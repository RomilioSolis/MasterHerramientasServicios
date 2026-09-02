const initBuscador = () => {
  const buscador = document.getElementById('buscadorHerramientas');
  const resultadoDiv = document.getElementById('resultadoBusqueda');
  const container = document.getElementById('netflixRows');

  if (!buscador || !container) {
    console.log('Buscador: buscador o container no encontrado');
    return;
  }

  const normalizar = texto => texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const buscarHerramientas = (termino) => {
    const cards = container.querySelectorAll('.netflix-item');
    let resultados = 0;
    const terminoNormalizado = normalizar(termino);

    cards.forEach(card => {
      const tituloEl = card.querySelector('.netflix-item-title');
      const descEl = card.querySelector('.netflix-item-description');
      if (!tituloEl) return;
      
      const titulo = normalizar(tituloEl.textContent || '');
      const descripcion = descEl ? normalizar(descEl.textContent) : '';
      const mostrar = titulo.includes(terminoNormalizado) || descripcion.includes(terminoNormalizado);

      card.style.display = mostrar ? '' : 'none';
      if (mostrar) resultados++;
    });

    resultadoDiv.innerHTML = termino ?
      `${resultados} herramienta${resultados !== 1 ? 's' : ''} encontrada${resultados !== 1 ? 's' : ''}` :
      'Ingrese el nombre de la herramienta';
    resultadoDiv.classList.toggle('has-results', resultados > 0);
    
    console.log('Búsqueda:', termino, 'resultados:', resultados);
  }

  const observer = new MutationObserver((mutations) => {
    mutations.forEach(() => {
      buscarHerramientas(buscador.value);
    });
  });

  observer.observe(container, {
    childList: true,
    subtree: true
  });

buscador.addEventListener('input', (e) => buscarHerramientas(e.target.value));
  buscarHerramientas('');
}

if (typeof window !== 'undefined') {
  window.initBuscador = initBuscador;
}