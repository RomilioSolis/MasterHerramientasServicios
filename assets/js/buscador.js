// assets/js/buscador.js
document.addEventListener('DOMContentLoaded', function () {
    const initBuscador = () => {
      const buscador = document.getElementById('buscadorHerramientas');
      const resultadoDiv = document.getElementById('resultadoBusqueda');
      const container = document.getElementById('herramientas-container');
      const nosotrosSection = document.getElementById('nosotros');
      const videoSection = document.querySelector('section.py-4');
      const headerElement = document.querySelector('header');
  
      if (!buscador || !container) return;
  
      const normalizar = texto => texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  
      const buscarHerramientas = (termino) => {
        const cards = container.querySelectorAll('.col-md-4');
        let resultados = 0;
        const terminoNormalizado = normalizar(termino);
  
        headerElement.style.display = 'block';
  
        if (terminoNormalizado) {
          nosotrosSection.style.display = 'none';
          videoSection.style.display = 'none';
          document.getElementById('equipos').scrollIntoView({ behavior: 'smooth' });
        } else {
          nosotrosSection.style.display = 'block';
          videoSection.style.display = 'block';
        }
  
        cards.forEach(card => {
          const titulo = normalizar(card.querySelector('.card-title').textContent);
          const descripcion = normalizar(card.querySelector('.card-text').textContent);
          const mostrar = titulo.includes(terminoNormalizado) || descripcion.includes(terminoNormalizado);
  
          card.style.display = mostrar ? 'block' : 'none';
          card.classList.toggle('no-result', !mostrar);
          if (mostrar) resultados++;
        });
  
        resultadoDiv.innerHTML = termino ?
          `${resultados} herramienta${resultados !== 1 ? 's' : ''} encontrada${resultados !== 1 ? 's' : ''}` :
          'Ingrese el nombre de la herramienta';
        resultadoDiv.classList.toggle('has-results', resultados > 0);
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
  
    setTimeout(initBuscador, 500);
  });