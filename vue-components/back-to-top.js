// Componente Vue para el botón "Volver al inicio"
// No es necesario importar Vue, ya está disponible globalmente

// Exportamos una función que crea e inicializa el componente
export function initBackToTop() {
    const { createApp, ref, onMounted } = Vue;
    
    createApp({
      setup() {
        const mostrarBoton = ref(false);
        
        // Función para volver al inicio de la página
        const volverArriba = () => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        };
        
        // Mostrar/ocultar el botón según la posición del scroll
        onMounted(() => {
          window.addEventListener('scroll', () => {
            // Para depurar, podemos agregar un log:
            // console.log("ScrollY:", window.scrollY);
            mostrarBoton.value = window.scrollY > 300;
          });
        });
        
        return {
          mostrarBoton,
          volverArriba
        };
      }
    }).mount('#app-back-to-top');
  }
  