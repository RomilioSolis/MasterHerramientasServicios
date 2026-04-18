const equiposGridData = {
    elevacion: [
        { id: 'gatos-hidraulicos', name: 'Gatos Hidraulicos', img: '/assets/imagenes/GatosH/Gatos.png', text: 'Gatos hidráulicos de alta capacidad para elevación.' },
        { id: 'gato-estibador', name: 'Gato Estibador', img: '/assets/imagenes/Estibador/estibador.png', text: 'Gato estibador para movimiento de cargas.' },
        { id: 'ganchos-colgantes', name: 'Ganchos Colgantes', img: '/assets/imagenes/GanchosColgantes/GanchosColgantes.png', text: 'Ganchos colgantes certificados.' },
        { id: 'winches', name: 'Winches', img: '/assets/imagenes/Winches/Winches.png', text: 'Winches eléctricos y manuales.' },
        { id: 'pluma-grua', name: 'Pluma Grúa', img: '/assets/imagenes/PlumaGrua/PlumaGrua.png', text: 'Pluma grúa para elevación de cargas.' }
    ],
    perforacion: [
        { id: 'taladros', name: 'Taladros', img: '/assets/imagenes/Taladros/Taladro.webp', text: 'Taladros industriales de percusión.' },
        { id: 'taladro-magnetico', name: 'Taladro Magnético', img: '/assets/imagenes/TaladroMagnetico/TaladroMagnetico1.jpeg', text: 'Taladro magnético para perforación de metal.' },
        { id: 'extractores', name: 'Extractores', img: '/assets/imagenes/Extractores/Extractor.png', text: 'Extractores de ejes y rodamientos.' },
        { id: 'sonda-electrica', name: 'Sonda Eléctrica', img: '/assets/imagenes/SondaElectrica/SondaElectrica.png', text: 'Sonda eléctrica para barrenado.' },
        { id: 'esmeriladora', name: 'Esmeriladora', img: '/assets/imagenes/Esmeril/Esmeril.png', text: 'Esmeriladora angular de alta potencia.' },
        { id: 'equipo-oxicorte', name: 'Equipo Oxicorte', img: '/assets/imagenes/Oxicorte/EquiOxicorte.png', text: 'Equipo de oxicorte para corte de metal.' },
        { id: 'cortadora-porcelanato', name: 'Cortadora Porcelanato', img: '/assets/imagenes/CortadoraPorcelanato/CortadoraPorcelanato.png', text: 'Cortadora de porcelanato y cerámica.' },
        { id: 'extraccion-nucleos', name: 'Extracción Núcleos', img: '/assets/imagenes/ExtraNucleo/ExtraNucleo.png', text: 'Equipo de extracción de núcleos de concreto.' }
    ],
    mezclado: [
        { id: 'trompo-mezclador', name: 'Trompo Mezclador', img: '/assets/imagenes/TrompoMezclador/TrompoMezclador.png', text: 'Trompo mezclador de concreto.' },
        { id: 'vibrocompactadora', name: 'Vibrocompactadora', img: '/assets/imagenes/VibroCompactadora/VibroCompactadora.png', text: 'Vibrocompactadora para compactación de suelo.' }
    ],
    limpieza: [
        { id: 'hidrolavadora', name: 'Hidrolavadora', img: '/assets/imagenes/Hidrolavadora/Hidrolavadora.png', text: 'Hidrolavadora de alta presión.' },
        { id: 'aspiradora-industrial', name: 'Aspiradora Industrial', img: '/assets/imagenes/Aspiradora/Aspiradora.png', text: 'Aspiradora industrial wet/dry.' },
        { id: 'motobomba-sumergible', name: 'Motobomba Sumergible', img: '/assets/imagenes/Motobomba/MotoBombaLapi.png', text: 'Motobomba sumergible para achique.' }
    ],
    soldadura: [
        { id: 'compresor', name: 'Compresor', img: '/assets/imagenes/Compresor/Compresor.png', text: 'Compresor de aire industrial.' },
        { id: 'equipos-soldadura', name: 'Equipos de Soldadura', img: '/assets/imagenes/Soldador/Soldador.png', text: 'Equipos de soldadura inverter y TIG.' },
        { id: 'planta-electrica', name: 'Planta Eléctrica', img: '/assets/imagenes/PlantaElectrica/PlantaEnergia.png', text: 'Planta eléctrica генератор.' }
    ],
    construccion: [
        { id: 'andamios', name: 'Andamios', img: '/assets/imagenes/Andamios/Andamios.png', text: 'Torres de andamios certificados.' },
        { id: 'estanterias', name: 'Estanterías', img: '/assets/imagenes/Estanterias/Estanterias.png', text: 'Estanterías industriales.' },
        { id: 'parasoles', name: 'Parasoles', img: '/assets/imagenes/Parasol/Parasol.png', text: 'Parasoles profesionales.' }
    ],
    movimiento: [
        { id: 'diferenciales', name: 'Diferenciales', img: '/assets/imagenes/Diferencial/Diferencial.png', text: 'Diferenciales para movimiento de cargas.' },
        { id: 'carretillas', name: 'Carretillas', img: '/assets/imagenes/Carretilla/Carretilla.png', text: 'Carretillas industriales.' },
        { id: 'buggy', name: 'Buggy con Pico y Pala', img: '/assets/imagenes/Buggy/Buggy.png', text: 'Buggy para movimiento de material.' }
    ],
    jardin: [
        { id: 'escaleras', name: 'Escaleras', img: '/assets/imagenes/Escaleras/escaleras.jpg', text: 'Escaleras profesionales.' },
        { id: 'motosierra', name: 'Motosierra', img: '/assets/imagenes/Motosierra/Motosierra.png', text: 'Motosierra de cadena.' }
    ]
};

const equiposCategoryNames = {
    elevacion: 'Elevación y Levante',
    perforacion: 'Perforación y Corte',
    mezclado: 'Mezclado y Compactación',
    limpieza: 'Limpieza e Hidráulica',
    soldadura: 'Soldadura y Energía',
    construccion: 'Construcción y Estructura',
    movimiento: 'Accesorios de Movimiento',
    jardin: 'Jardín y Forestal'
};

function createEquipmentCard(eq, category) {
    const waText = encodeURIComponent(eq.name.toLowerCase().replace(/ /g, '%20'));
    const waLink = `https://wa.me/573165345675?text=Hola,%20necesito%20cotizar%20${waText}`;
    
    return `
        <article class="col-md-4 mb-4" itemscope itemtype="https://schema.org/Product" data-category="${category}">
            <div class="card h-100">
                <div itemprop="brand" itemscope itemtype="https://schema.org/Brand" style="display: none;">
                    <meta itemprop="name" content="Master Herramientas y Servicios">
                </div>
                <div itemprop="aggregateRating" itemscope itemtype="https://schema.org/AggregateRating">
                    <meta itemprop="ratingValue" content="4.8">
                    <meta itemprop="reviewCount" content="35">
                    <meta itemprop="bestRating" content="5">
                    <meta itemprop="worstRating" content="1">
                </div>
                <div itemprop="offers" itemscope itemtype="https://schema.org/Offer">
                    <meta itemprop="priceCurrency" content="COP">
                    <meta itemprop="price" content="150000">
                    <link itemprop="availability" href="https://schema.org/InStock">
                    <meta itemprop="url" content="https://masterenherramientasyservicios.com.co/#equipos">
                </div>
                <img src="${eq.img}"
                     class="card-img-top"
                     alt="Alquiler de ${eq.name} en Cali"
                     loading="lazy"
                     width="400"
                     height="250"
                     itemprop="image">
                <div class="card-body">
                    <h2 class="card-title h5" itemprop="name">Alquiler de ${eq.name}</h2>
                    <p class="card-text" itemprop="description">${eq.text}</p>
                    <div class="d-flex flex-column flex-md-row gap-2">
                        <a href="${waLink}"
                           class="btn btn-success flex-fill"
                           target="_blank"
                           aria-label="Cotizar alquiler de ${eq.name} por WhatsApp"
                           rel="noopener"
                           itemprop="url">
                            <i class="bi bi-whatsapp"></i> Cotizar
                        </a>
                        <a href="tel:+573165345675"
                           class="btn btn-primary flex-fill"
                           aria-label="Llamar para servicio de ${eq.name}"
                           itemprop="telephone">
                            <i class="bi bi-telephone"></i> Llamar
                        </a>
                    </div>
                </div>
            </div>
        </article>
    `;
}

function loadStyles() {
    return new Promise((resolve) => {
        if (document.getElementById('equipos-grid-styles')) {
            resolve();
            return;
        }
        const link = document.createElement('link');
        link.id = 'equipos-grid-styles';
        link.rel = 'stylesheet';
        link.href = '/components/equipos-grid/equipos-grid.css';
        link.onload = resolve;
        document.head.appendChild(link);
    });
}

async function loadEquiposGrid() {
    await loadStyles();
    
    const container = document.getElementById('herramientas-container');
    if (!container) return;
    
    let delay = 0;
    for (const [category, equipos] of Object.entries(equiposGridData)) {
        for (const eq of equipos) {
            container.insertAdjacentHTML('beforeend', createEquipmentCard(eq, category));
        }
    }
    
    document.dispatchEvent(new CustomEvent('equiposGridLoaded'));
    console.log('Equipos grid cargado:', document.querySelectorAll('#herramientas-container article').length, 'artículos');
}

export default {
    init: loadEquiposGrid,
    data: equiposGridData,
    categoryNames: equiposCategoryNames
};
