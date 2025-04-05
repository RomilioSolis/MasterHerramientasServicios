const AlertBanner = {
    template: `
      <div v-if="mostrarAlerta" class="alert alert-warning alert-dismissible fade show text-center mb-0 fixed-top" 
           role="alert" style="z-index: 9999; border-radius: 0; transition: all 0.3s ease;">
        <div class="container">
          <i class="fas fa-tools me-2"></i>
          Estamos trabajando en la página poco a poco. Disculpe las molestias.
        </div>
        <button type="button" class="btn-close" @click="cerrarAlerta" aria-label="Cerrar"></button>
      </div>
    `,
    data() {
      return {
        mostrarAlerta: true,
        ocultando: false
      };
    },
    methods: {
      cerrarAlerta() {
        this.ocultando = true;
        document.body.style.paddingTop = '0';
        setTimeout(() => {
          this.mostrarAlerta = false;
        }, 300);
      }
    },
    mounted() {
      // Ajustar el padding del body cuando la alerta está visible
      const alerta = this.$el;
      if (alerta) {
        document.body.style.paddingTop = alerta.offsetHeight + 'px';
      }
      // Auto-ocultar después de 5 segundos
      setTimeout(() => {
        this.cerrarAlerta();
      }, 5000);
    }
  };
  
  const app = Vue.createApp({});
  app.component('alert-banner', AlertBanner);
  app.mount('#app');
  