// Obtener el botón
const backToTopButton = document.getElementById('backToTop');

// Mostrar el botón cuando el usuario hace scroll hacia abajo
window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {  // Muestra el botón si el scroll es mayor a 200px
        backToTopButton.style.display = 'block';
    } else {
        backToTopButton.style.display = 'none';
    }
});

// Al hacer clic en el botón, se desplaza suavemente hacia arriba
backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
