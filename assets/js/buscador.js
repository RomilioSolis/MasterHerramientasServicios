const initBuscador = () => {
  const buscador = document.getElementById('buscadorHerramientas');
  const resultadoDiv = document.getElementById('resultadoBusqueda');
  const container = document.getElementById('herramientas-container');

  if (!buscador || !container) {
    console.log('Buscador: buscador o container no encontrado');
    return;
  }

  const normalizar = texto => texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const buscarHerramientas = (termino) => {
    const cards = container.querySelectorAll('.col-md-4');
    let resultados = 0;
    const terminoNormalizado = normalizar(termino);

    cards.forEach(card => {
      const tituloEl = card.querySelector('.card-title');
      const descEl = card.querySelector('.card-text');
      if (!tituloEl || !descEl) return;
      
      const titulo = normalizar(tituloEl.textContent);
      const descripcion = normalizar(descEl.textContent);
      const mostrar = titulo.includes(terminoNormalizado) || descripcion.includes(terminoNormalizado);

      card.style.display = mostrar ? 'block' : 'none';
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

export default initBuscador;