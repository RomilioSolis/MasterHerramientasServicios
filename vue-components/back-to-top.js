// Componente Vue para el botón "Volver al inicio"
// No necesitamos importar Vue aquí, ya está disponible globalmente

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
            if (window.scrollY > 300) {
              mostrarBoton.value = true;
            } else {
              mostrarBoton.value = false;
            }
          });
        });
        
        return {
          mostrarBoton,
          volverArriba
        };
      }
    }).mount('#app-back-to-top');
  }