// Clase principal para gestionar la aplicación
class ProductManager {
    constructor(productos, centro) {
        this.products = productos;
        this.centro = centro;
        this.container = document.getElementById('cs0r_products-container');
        this.template = document.getElementById('product-template');
        console.log('ProductManager constructor:', {
            centro: this.centro,
            container: this.container,
            template: this.template,
            products: this.products
        });
        this.filters = {
            type: 'all',
            capacity: 'all',
            plan: 'all'
        };
        // Orden por defecto SIEMPRE al cargar la página
        // this.currentSort = 'price-asc';
        this.currentSort = 'size-asc';
        this.currentFloor = 'all';
        this.modals = {};
        this.sizeConfig = {
            Mini: {
                label: 'MINI 1,65m²',
                volume: '= 4 m³',
                className: 'mini',
                sortValue: 0.5,
                capacity: {
                    particulares: `<p>Si estás de mudanza, es el tamaño perfecto para guardar el contenido de un estudio de hasta 15m² con algunos muebles desmontables. Es el volumen de carga de una furgoneta pequeña.<br />
Si necesitar hacer espacio en tu piso, es el tamaño ideal para ti: puedes guardar un par de muebles medianos desmontados, material deportivo de temporada y muchas cajas.  ¡Contrata un Trastero MINI para agrandar tu piso rápido, sin cambiar de piso!<br />
</p>`,
                    autonomos: `<p>Caben hasta 1,40 metros lineales de estanterías para almacenar herramientas y materiales de trabajo ordenadamente, aprovechando sus 2,39m de altura. Si no usas estanterías, caben ahí más de 55 cajas estándares de 55x35x30cm. Corresponde al volumen de carga de una furgoneta pequeña.</p>`,
                    empresas: `<p>Si quieres almacenar pequeños stocks de mercancías, caben unas 55 cajas estándar (55x35x30cm) o 1 palet europeo. Si quieres archivar documentos, caben hasta 160 archivadores definitivos (pasivos) en estanterías, y aproximadamente 2 veces más en cajas de cartón apiladas</p>`
                }
            },
            Pequeno: {
                label: 'PEQUEÑO 3,5m²',
                volume: '= 8,5 m³',
                className: 'pequeno',
                sortValue: 1,
                capacity: {
                    particulares: `<p>Si estás de mudanza, es el tamaño perfecto para guardar el contenido de un estudio de hasta 30m² con muebles desmontables. Es el volumen de carga de una furgoneta mediana a grande.</p><br />
                <p>También, suele ser el tamaño ideal para liberar espacio en tu hogar: guarda ahí todas tus cosas de uso ocasional, algún mueble desmontado que ya no usas y las reliquias de la familia. Caben ahí más de 100 cajas estándares de 55x35x30cm. ¡Contrata un Trastero PEQUEÑO para agrandar tu casa rápido, sin cambiar de casa!</p></br>`,
                    autonomos: `<p>Caben hasta 3 metros lineales de estanterías para almacenar herramientas y materiales de trabajo ordenadamente, aprovechando sus 2,39m de altura. Si no usas estanterías, caben ahí más de 100 cajas estándares de 55x35x30cm. Corresponde al volumen de carga de una furgoneta mediana a grande.</p>`,
                    empresas: `<p>Si quieres almacenar stocks de mercancías, caben más de 100 cajas estándar (55x35x30cm) o 2 palets europeos. Si quieres archivar documentos, caben hasta 350 archivadores definitivos (pasivos) en estanterías, y aproximadamente 2 veces más en cajas de cartón apiladas</p>`
                }
            },
            Mediano: {
                label: 'MEDIANO 7m²',
                volume: '= 16,5 m³',
                className: 'mediano',
                sortValue: 2,
                capacity: {
                    particulares: `<p>Si estás de mudanza o de reformas, suele ser el tamaño ideal para guardar el contenido entero de un piso de hasta 60 m² o de 2 ambientes (salón comedor + 1 habitación, por ejemplo) con muebles desmontables. Caben ahí más de 200 cajas estándares de 55x35x30cm. Es el volumen de carga de una furgoneta grande a muy grande.</p><br />
                <p>Si estás de mudanza o de reformas, suele ser el tamaño ideal para guardar el contenido entero de un piso de hasta 60 m² o de 2 ambientes (salón comedor + 1 habitación, por ejemplo) con muebles desmontables. Caben ahí más de 200 cajas estándares de 55x35x30cm. Es el volumen de carga de una furgoneta grande a muy grande.</p></br>`,
                    autonomos: `<p>Caben hasta 7 metros lineales de estanterías para almacenar herramientas y materiales de trabajo ordenadamente, aprovechando sus 2,39m de altura. Si no usas estanterías, caben ahí más de 200 cajas estándares de 55x35x30cm. Corresponde al volumen de carga de una furgoneta grande a muy grande.</p>`,
                    empresas: `<p>Si quieres almacenar stocks de mercancías, caben más de 200 cajas estándar (55x35x30cm) o 5 palets europeos. Si quieres archivar documentos, caben hasta 700 archivadores definitivos (pasivos) en estanterías, y aproximadamente 2 veces más en cajas de cartón apiladas</p>`
                }
            },
            Grande: {
                label: 'GRANDE 10,5m²',
                volume: '= 25 m³',
                className: 'grande',
                sortValue: 3,
                capacity: {
                    particulares: `<p>Si estás de mudanza o de reformas, suele ser el tamaño ideal para guardar el contenido entero de un piso de hasta 90 m² o de 3 ambientes (salón comedor + 2 habitaciones, por ejemplo) con muebles desmontables. Caben ahí más de 300 cajas estándares de 55x35x30cm. Es el volumen de carga de un camión de mudanza mediano a grande.</p><br />
                <p>Si estás de mudanza o de reformas, suele ser el tamaño ideal para guardar el contenido entero de un piso de hasta 90 m² o de 3 ambientes (salón comedor + 2 habitaciones, por ejemplo) con muebles desmontables. Caben ahí más de 300 cajas estándares de 55x35x30cm. Es el volumen de carga de un camión de mudanza mediano a grande.</p></br>`,
                    autonomos: `<p>Caben hasta 10 metros lineales de estanterías para almacenar herramientas y materiales de trabajo ordenadamente, aprovechando sus 2,39m de altura. Si no usas estanterías, caben ahí más de 300 cajas estándares de 55x35x30cm. Corresponde al volumen de carga de 2 furgones grandes.</p>`,
                    empresas: `<p>Si quieres almacenar stocks de mercancías, caben más de 300 cajas estándar (55x35x30cm) o 8 palets europeos. Si quieres archivar documentos, caben hasta 1.050 archivadores definitivos (pasivos) en estanterías, y aproximadamente 2 veces más en cajas de cartón apiladas</p>`
                }
            },
            Maxi: {
                label: 'MAXI 14m²',
                volume: '= 33 m³',
                className: 'maxi',
                sortValue: 4,
                capacity: {
                    particulares: `<p>Si estás de mudanza o de reformas, suele ser el tamaño ideal para guardar el contenido entero de un piso de hasta 120 m² o de 4 ambientes (salón comedor + 3 habitaciones, por ejemplo) con muebles desmontables. Caben ahí hasta 450 cajas estándares de 55x35x30cm. Es el volumen de carga de un camión de mudanza muy grande.</p>`,
                    autonomos: `<p>Caben hasta 13 metros lineales de estanterías para almacenar herramientas y materiales de trabajo ordenadamente, aprovechando sus 2,39m de altura. Si no usas estanterías, caben ahí hasta 450 cajas estándares de 55x35x30cm. Corresponde al volumen de carga de 2 furgones grandes a muy grandes.</p>`,
                    empresas: `<p>Si quieres almacenar stocks de mercancías, caben hasta 450 cajas estándar (55x35x30cm) o 11 palets europeos. Si quieres archivar documentos, caben hasta 1.400 archivadores definitivos (pasivos) en estanterías, y aproximadamente 2 veces más en cajas de cartón apiladas</p>`
                }
            }
        };
    }

    // Inicializar la aplicación
    async init() {
        if (!this.container || !this.template) {
            console.error('No se encontraron elementos necesarios en el DOM');
            return;
        }
        // Al cargar/refrescar, aplicar el orden por defecto
        this.updateDisplay();
        this.setupEventListeners();
    }

    // Configurar event listeners
    setupEventListeners() {
        // Event listeners para los acordeones de control (Ordenar y Filtrar)
        const controlAccordions = document.querySelectorAll('.control-accordion');
        controlAccordions.forEach(accordion => {
            const trigger = accordion.querySelector('.accordion-trigger');
            
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // Cerrar otros acordeones de control
                controlAccordions.forEach(otherAccordion => {
                    if (otherAccordion !== accordion) {
                        otherAccordion.classList.remove('active');
                    }
                });
                
                // Toggle el acordeón actual
                accordion.classList.toggle('active');
            });
        });

        // Cerrar acordeones de control al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.control-accordion')) {
                controlAccordions.forEach(accordion => {
                    accordion.classList.remove('active');
                });
            }
        });

        // Event listener para el botón de ordenar
        const applySortButton = document.getElementById('apply-sort');
        if (applySortButton) {
            applySortButton.addEventListener('click', () => {
                const selectedSort = document.querySelector('input[name="sort"]:checked').value;
                this.handleSorting(selectedSort);
                document.querySelector('.control-accordion:first-child').classList.remove('active');
            });
        }

        // Event listener para el botón de filtrar
        const applyFilterButton = document.getElementById('apply-filter');
        if (applyFilterButton) {
            applyFilterButton.addEventListener('click', () => {
                const selectedFilter = document.querySelector('input[name="filter"]:checked').value;
                this.handleFloorFilter(selectedFilter);
                document.querySelector('.control-accordion:last-child').classList.remove('active');
            });
        }

        // Event listeners para modales
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-trigger')) {
                const modalId = e.target.dataset.modal;
                this.openModal(modalId, e.target);
            } else if (e.target.classList.contains('close-modal')) {
                const modal = e.target.closest('.modal');
                this.closeModal(modal.id);
            }
        });

        // Cerrar modal al hacer clic fuera del contenido
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });

        // Cerrar modal con la tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal[style*="display: block"]');
                if (openModal) {
                    this.closeModal(openModal.id);
                }
            }
        });

        // Event listeners para las pestañas de planes
        document.addEventListener('click', (e) => {
            const tabTrigger = e.target.closest('.wrap-tab-modal[data-tab]');
            if (tabTrigger) {
                const card = tabTrigger.closest('.cs0r_product-card');
                if (card) {
                    this.switchPlanTab(card, tabTrigger.dataset.tab);
                }
            }
        });
    }

    // Cambiar entre pestañas de planes
    switchPlanTab(card, tabName) {
        // Actualizar tabs
        const tabTriggers = card.querySelectorAll('.wrap-tab-modal[data-tab]');
        tabTriggers.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });
        // Actualizar contenido de planes
        const plans = card.querySelectorAll('.plan');
        plans.forEach(plan => {
            plan.classList.toggle('active', plan.classList.contains(tabName));
        });
    }

    // Abrir modal
    openModal(modalId, triggerElement) {
        const modal = document.getElementById(modalId);
        const modalBody = modal.querySelector('.modal-body');

        // Detectar si el producto es mini (clase mini_planta_00 o mini_planta_01 en .product-image)
        let isMini = false;
        if (triggerElement) {
            const card = triggerElement.closest('.cs0r_product-card');
            const imageEl = card?.querySelector('.product-image');
            isMini = imageEl && /mini_planta_/.test(imageEl.className);
        }
        modal.classList.toggle('modal--mini-product', isMini);

        if (modalId === 'monthly-modal') {
            modalBody.innerHTML = `<h3>Pago mensual</h3><br><ul>
    <li><strong>Duración del contrato:</strong> Mensual, con renovación mensual automática. La facturación mínima es de 1 mes.</li>
    <li><strong>Facturación y cobro:</strong> Mensual, el día del comienzo del contrato y en cada fecha aniversario: por ejemplo, si el Contrato empieza el 12 de este mes, se facturará el 12 de cada mes</li>
    <li><strong>Forma de pago:</strong> cargo automático en su tarjeta bancaria de débito o crédito Visa, Mastercard o American Express vía la pasarela de pago segura STRIPE. Las tarjetas American Express y las tarjetas emitidas fuera de España llevarán un recargo del 2,5%.</li>
    <li><strong>Ofertas:</strong> las eventuales ofertas se aplican a la cuota mensual del primer mes o de los 2 primeros meses (no al coste del seguro), y no están sujetas a ningún compromiso de permanencia. Estas ofertas sólo se aplican a nuevos clientes.</li>
    <li class="li-modal-off_on_minis"><strong>Protección multirriesgo de los bienes:</strong> Es preciso contratar una protección multirriesgo de los bienes almacenados en el trastero cubriendo el valor real de estos bienes, con un mínimo de 1.000€ de cobertura para los trasteros de 1,65 y 3,5m², de 2.000€ de cobertura para un trastero de 7m², de 3.000€ de cobertura para un trastero de 10,5m² y de 4.000€ de cobertura para un trastero de 14m². El precio de esta protección multirriesgo es muy competitivo: 2€/mes por tramo de 1.000€ de valor de los bienes cubiertos.</li>
    <li class="li-modal_on_only_on_minis"><strong>Protección multirriesgo de los bienes:</strong> Es preciso contratar una protección multirriesgo de los bienes almacenados en el trastero cubriendo el valor real de estos bienes, con un mínimo de 1.000€ de cobertura para los trasteros de 1,65 y 3,5m², de 2.000€ de cobertura para un trastero de 7m², de 3.000€ de cobertura para un trastero de 10,5m² y de 4.000€ de cobertura para un trastero de 14m². El precio de esta protección multirriesgo es muy competitivo: 2€/mes por tramo de 1.000€ de valor de los bienes cubiertos.</li>
    <li><strong>Fianza reembolsable:</strong> el importe de la fianza del trastero es igual al precio mensual con IVA, antes de eventuales Ofertas. Se carga en su tarjeta bancaria el día de comienzo de su contrato y reembolsará en su tarjeta a la liberación del trastero.</li>
    <li><strong>Cambio de plan de pago:</strong> se puede cambiar a un Plan de Pago Anual cualquier día del mes, sin aviso previo, llamando al teléfono de Atención al Cliente de Trastering.</li>
    <li><strong>Rescisión de su contrato:</strong> cualquier día del mes, con un aviso mínimo de 15 días; los días no usados le serán reembolsados si avisa con 15 días de antelación.</li>
</ul>`;
        } else if (modalId === 'annual-modal') {
            modalBody.innerHTML = `<h3>Pago anual</h3><br><ul>
    <li><strong>Duración del contrato:</strong> Anual, con renovación anual automática. El mínimo de facturación es de 1 año.</li>
    <li><strong>Facturación y cobro:</strong> Anual, el día del comienzo del contrato y en cada fecha aniversario: por ejemplo, si el contrato empieza el 12 de febrero, se facturará el 12 de febrero de cada año.</li>
    <li><strong>Forma de pago:</strong> cargo automático en su tarjeta bancaria de débito o crédito Visa, Mastercard o American Express vía la pasarela de pago segura STRIPE. Las tarjetas American Express y las tarjetas emitidas fuera de España llevarán un recargo del 2,5%.</li>
    <li class="li-modal-off_on_minis"><strong>Protección multirriesgo de sus bienes:</strong> Es preciso contratar una protección multirriesgo de los bienes almacenados en el trastero cubriendo el valor real de estos bienes, con un mínimo de 1.000€ de cobertura para los trasteros de 1,65 y 3,5m², de 2.000€ de cobertura para un trastero de 7m², de 3.000€ de cobertura para un trastero de 10,5m² y de 4.000€ de cobertura para un trastero de 14m². El precio de esta protección multirriesgo es muy competitivo: 2€/mes por tramo de 1.000€ de valor de los bienes cubiertos.</li>
    <li class="li-modal_on_only_on_minis"><strong>Protección multirriesgo de los bienes:</strong> Es preciso contratar una protección multirriesgo de los bienes almacenados en el trastero cubriendo el valor real de estos bienes, con un mínimo de 1.000€ de cobertura para los trasteros de 1,65 y 3,5m², de 2.000€ de cobertura para un trastero de 7m², de 3.000€ de cobertura para un trastero de 10,5m² y de 4.000€ de cobertura para un trastero de 14m². El precio de esta protección multirriesgo es muy competitivo: 2€/mes por tramo de 1.000€ de valor de los bienes cubiertos.</li>
    <li><strong>Fianza reembolsable:</strong> el importe de la fianza del trastero es igual al precio mensual con IVA, antes de eventuales Ofertas. Se carga en su tarjeta bancaria el día de comienzo de su contrato y reembolsará en su tarjeta a la liberación del trastero.</li>
    <li><strong>Cambio de plan de pago:</strong> se puede cambiar a un Plan de Pago Mensual en cada fecha aniversario, llamando al teléfono de Atención al Cliente de Trastering con un mínimo de 24h laborales antes de la fecha aniversario.</li>
    <li><strong>Rescisión del contrato:</strong> cualquier día del año, con un aviso mínimo de 15 días. No se devuelve la parte proporcional del Pago Anual no usado.</li>
</ul>`;
        }

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Cerrar modal
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('modal--mini-product');
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    // Formatear precio
    formatPrice(price) {
        const num = parseFloat(price);
        if (Number.isInteger(num)) {
            return String(num);
        } else {
            return num.toFixed(1).replace('.', ',');
        }
    }

    // Generar badge de descuento
    generateDiscountBadge(product) {
        // Detectar si estamos en empresas-*
        const main = document.querySelector('main[id^="empresas-"]') || document.querySelector('div[id^="empresas-"]');
        if (product.PA0_sufix_discount === '%') {
            return product.MA0_discount + '%';
        } else if (product.PA0_sufix_discount === '€') {
            if (main) {
                // Empresas: sin IVA
                return this.formatPrice(product.WA1_monto_ahorro_no_vat) + '€';
            } else {
                // Particulares/autonomos: con IVA
                return this.formatPrice(product.VA1_monto_ahorro) + '€';
            }
        } else {
            // Lógica por defecto
            return '';
        }
    }

    // Obtener tamaño del producto
    getProductSize(product) {
        const sizeKey = this.getSizeKey(product.EA0_sizeCodeId);
        return sizeKey ? this.sizeConfig[sizeKey].sortValue : 0;
    }

    getSizeKey(sizeCodeId) {
        return Object.keys(this.sizeConfig).find(key =>
            sizeCodeId.startsWith(`${key}_`)
        );
    }

    getSizeDetails(sizeCodeId) {
        const sizeKey = this.getSizeKey(sizeCodeId);
        return sizeKey ? this.sizeConfig[sizeKey] : null;
    }

    // Filtrar productos por planta
    filterProductsByFloor(products) {
        if (this.currentFloor === 'all') {
            return products;
        }
        return products.filter(product =>
            product.AA1_product_name.includes(`_${this.currentFloor}_`)
        );
    }

    // Manejar filtrado por planta
    handleFloorFilter(floorType) {
        this.currentFloor = floorType;
        this.updateDisplay();
    }

    // Actualizar la visualización (combinar filtrado y ordenación)
    updateDisplay() {
        // Primero filtramos los productos
        let filteredProducts = this.filterProductsByFloor(this.products);

        // Luego aplicamos el ordenamiento si existe
        if (this.currentSort) {
            filteredProducts = this.sortProducts(filteredProducts, this.currentSort);
        }

        // Finalmente generamos las tarjetas
        this.generateProductCards(filteredProducts);
    }

    // Manejar ordenación
    handleSorting(sortType) {
        this.currentSort = sortType;
        this.updateDisplay();
    }

    // Ordenar productos
    sortProducts(products, sortType) {
        const sortedProducts = [...products];

        switch (sortType) {
            case 'price-asc':
                return sortedProducts.sort((a, b) =>
                    parseFloat(a.OA0_price_with_discount) - parseFloat(b.OA0_price_with_discount)
                );
            case 'price-desc':
                return sortedProducts.sort((a, b) =>
                    parseFloat(b.OA0_price_with_discount) - parseFloat(a.OA0_price_with_discount)
                );
            case 'size-asc':
                return sortedProducts.sort((a, b) =>
                    this.getProductSize(a) - this.getProductSize(b)
                );
            case 'size-desc':
                return sortedProducts.sort((a, b) =>
                    this.getProductSize(b) - this.getProductSize(a)
                );
            default:
                return sortedProducts;
        }
    }

    // Generar tarjetas de productos
    generateProductCards(products = this.products) {
        console.log('generateProductCards called:', {
            products,
            container: this.container,
            template: this.template
        });
        this.container.innerHTML = '';

        // Detectar si estamos en empresas-*
        const main = document.querySelector('main[id^="empresas-"], div[id^="empresas-"]');

        products.forEach((product, index) => {
            console.log('Renderizando producto:', product);
            const card = this.template.content.cloneNode(true);
            
            // Configurar el título y tamaño según el tipo de producto
            const titleElement = card.querySelector('.card-presentation-title');
            const sideTextElement = card.querySelector('.card-presentation-sidetext-title');
            const levelDescriptionElement = card.querySelector('.card-presentation-level-description');
            
            // Determinar el tamaño y texto correspondiente
            let sizeText = '';
            let volumeText = '';

            const sizeDetails = this.getSizeDetails(product.EA0_sizeCodeId);
            if (sizeDetails) {
                sizeText = sizeDetails.label;
                volumeText = sizeDetails.volume;
            }
            
            titleElement.textContent = sizeText;
            sideTextElement.textContent = volumeText;
            
            // Determinar la descripción del nivel
            if (product.EA0_sizeCodeId.includes('P1')) {
                levelDescriptionElement.textContent = 'Acceso escalera móvil en ';
                const strongElement = document.createElement('strong');
                strongElement.textContent = '1ª Planta';
                levelDescriptionElement.appendChild(strongElement);
            } else {
                levelDescriptionElement.textContent = 'Acceso drive-in en ';
                const strongElement = document.createElement('strong');
                strongElement.textContent = 'Planta Baja';
                levelDescriptionElement.appendChild(strongElement);
            }

            // Configurar la imagen según el tamaño y nivel
            const imageElement = card.querySelector('.product-image');
            let sizeClass = '';
            
            // Determinar la clase de tamaño
            if (sizeDetails) {
                sizeClass = sizeDetails.className;
            }
            
            // Combinar tamaño con nivel
            if (product.EA0_sizeCodeId.includes('P1')) {
                imageElement.classList.add(`${sizeClass}_planta_01`);
            } else if (product.EA0_sizeCodeId.includes('P0')) {
                imageElement.classList.add(`${sizeClass}_planta_00`);
            } else {
                // Fallback: usar solo la clase de tamaño si no se detecta nivel
                imageElement.classList.add(sizeClass);
            }

            // Disponibilidad en cada plan
            const availability1 = card.querySelector('.availability-1 .availability-value');
            const availability1Label = card.querySelector('.availability-1 .availability-label');
            const availability2 = card.querySelector('.availability-2 .availability-value');
            const availability2Label = card.querySelector('.availability-2 .availability-label');
            if (availability1) availability1.textContent = product.SA0_nbDispo;
            if (availability2) availability2.textContent = product.SA0_nbDispo;

            // Mensaje personalizado para availability-label
            function getAvailabilityLabel(nb) {
                switch (parseInt(nb)) {
                    case 1: return 'Última Unidad Disponible';
                    case 2: return 'Últimas 2 Unidades Disponibles';
                    case 3: return 'Últimas 3 Unidades Disponibles';
                    case 4: return 'Última Unidad en Oferta';
                    case 5: return 'Últimas 2 Unidades en Oferta';
                    case 6: return 'Últimas 3 Unidades en Oferta';
                    case 7: return 'Última Unidad con esta Oferta';
                    default: return 'Últimas Unidades con esta Oferta';
                }
            }
            if (availability1Label) availability1Label.textContent = getAvailabilityLabel(product.SA0_nbDispo);
            if (availability2Label) availability2Label.textContent = getAvailabilityLabel(product.SA0_nbDispo);

            // Acordeón
            const accordion = card.querySelector('.accordion');
            const accordionHeader = accordion.querySelector('.accordion-header');
            const accordionBody = accordion.querySelector('.accordion-body');
            
            // Determinar el tamaño para el contenido
            const sizeInfo = (() => {
                if (sizeDetails) {
                    return { size: sizeDetails.label, volume: sizeDetails.volume };
                }
                return { size: '', volume: '' };
            })();

            // Determinar el contenido según el tipo de usuario y tamaño
            let particularesText = '';
            let autonomosText = '';
            let empresasText = '';

            if (sizeDetails) {
                particularesText = sizeDetails.capacity.particulares;
                autonomosText = sizeDetails.capacity.autonomos;
                empresasText = sizeDetails.capacity.empresas;
            }

            // Actualizar el contenido de cada sección
            const particularesContent = accordionBody.querySelector('.capacity-info-particulares');
            const autonomosContent = accordionBody.querySelector('.capacity-info-autonomos');
            const empresasContent = accordionBody.querySelector('.capacity-info-empresas');

            particularesContent.innerHTML = `
                <h3>${sizeInfo.size} ${sizeInfo.volume}</h3>
                <p>${particularesText}</p>
            `;

            autonomosContent.innerHTML = `
                <h3>${sizeInfo.size} ${sizeInfo.volume}</h3>
                <p>${autonomosText}</p>
            `;

            empresasContent.innerHTML = `
                <h3>${sizeInfo.size} ${sizeInfo.volume}</h3>
                <p>${empresasText}</p>
            `;

            // Configurar el evento del acordeón
            accordionHeader.addEventListener('click', () => {
                accordion.classList.toggle('active');
            });

            // Planes de suscripción
            const planContent = card.querySelector('.plan-content');
            const monthlyPlan = card.querySelector('.plan.monthly');
            const annualPlan = card.querySelector('.plan.annual');
            const planTabs = card.querySelector('.plan-tabs');

            // Buscar los botones modal-trigger en las tabs
            const monthlyModalTrigger = planTabs.querySelector('.modal-trigger[data-modal="monthly-modal"]');
            const annualModalTrigger = planTabs.querySelector('.modal-trigger[data-modal="annual-modal"]');
            if (monthlyModalTrigger) monthlyModalTrigger.dataset.productId = index;
            if (annualModalTrigger) annualModalTrigger.dataset.productId = index;

            // Plan Mensual - precios con y sin IVA
            // Con IVA o sin IVA según tipo de usuario
            if (monthlyPlan.querySelector('.price-value')) {
                if (main) {
                    console.log('Empresas: asignando OA1_price_with_discount_no_vat:', product.OA1_price_with_discount_no_vat);
                    monthlyPlan.querySelector('.price-value').textContent = this.formatPrice(product.OA1_price_with_discount_no_vat);
                } else {
                    console.log('No empresas: asignando OA0_price_with_discount:', product.OA0_price_with_discount);
                    monthlyPlan.querySelector('.price-value').textContent = this.formatPrice(product.OA0_price_with_discount);
                }
            }
            if (monthlyPlan.querySelector('.price-value-no-vat'))
                monthlyPlan.querySelector('.price-value-no-vat').textContent = this.formatPrice(product.OA1_price_with_discount_no_vat);

            const monthlyOriginalPrice = monthlyPlan.querySelector('.original-price');
            const monthlyOriginalPriceNoVat = monthlyPlan.querySelector('.original-price-no-vat');
            const monthlyDiscountBadge = monthlyPlan.querySelector('.discount-badge');
            const monthlyPrice = monthlyPlan.querySelector('.price-value');

            monthlyOriginalPrice.textContent = `después: ${this.formatPrice(product.JA0_price_no_discount)}€/mes`;
            monthlyOriginalPriceNoVat.textContent = `después: ${this.formatPrice(product.JA1_price_no_discount_no_vat)}€/mes`;
            monthlyDiscountBadge.textContent = this.generateDiscountBadge(product);
            monthlyPrice.textContent = this.formatPrice(product.OA0_price_with_discount);

            // Duración de la promoción
            const promoDuration = monthlyPlan.querySelector('.promo-duration');
            if (product.LA0_promo_duration) {
                const duration = parseInt(product.LA0_promo_duration);
                promoDuration.textContent = duration === 1 ? 
                    'durante 1 mes' : 
                    `durante ${duration} meses`;
            }
             // Duración de la promoción
             const promoDuration2 = monthlyPlan.querySelector('.promo-duration2');
             if (product.LA0_promo_duration) {
                 const duration = parseInt(product.LA0_promo_duration);
                 promoDuration2.textContent = duration === 1 ? 
                     'por 1 mes' : 
                     `por ${duration} meses`;
             }

            // Plan Anual
            const annualOriginalPrice = annualPlan.querySelector('.original-price');
            const annualOriginalPriceNoVat = annualPlan.querySelector('.original-price-no-vat');
            const annualPrice = annualPlan.querySelector('.price-value');
            const annualPriceNoVat = annualPlan.querySelector('.price-value-no-vat');
            const annualSavings = annualPlan.querySelector('.savings-value');
            const annualSavingsNoVat = annualPlan.querySelector('.savings-value-no-vat');

            annualOriginalPrice.textContent = this.formatPrice(product.TA0_price_tachado) + '€';
            annualOriginalPriceNoVat.textContent = this.formatPrice(product.UA0_price_tachado_no_vat) + '€';
            
            if (annualPrice) {
                if (main) {
                    // Para empresas: precio anual sin IVA = precio tachado sin IVA - ahorro sin IVA
                    const priceNoVat = product.UA0_price_tachado_no_vat - product.WA0_monto_ahorro_no_vat;
                    console.log('Empresas: asignando precio anual sin IVA:', priceNoVat);
                    annualPrice.textContent = this.formatPrice(priceNoVat);
                } else {
                    console.log('No empresas: asignando precio anual con IVA:', product.OA9_price_anual);
                    annualPrice.textContent = this.formatPrice(product.OA9_price_anual);
                }
            }
            if (annualPriceNoVat) {
                // Precio sin IVA = precio tachado sin IVA - ahorro sin IVA
                // Para empresas: calcular directamente desde el precio anual final con IVA y redondear hacia arriba
                let priceNoVat;
                if (main) {
                    // Calcular directamente desde el precio anual final con IVA (OA9_price_anual) para evitar errores de redondeo acumulados
                    priceNoVat = Math.ceil(product.OA9_price_anual / 1.21);
                } else {
                    priceNoVat = product.UA0_price_tachado_no_vat - product.WA0_monto_ahorro_no_vat;
                }
                annualPriceNoVat.textContent = this.formatPrice(priceNoVat);
            }
            
            annualSavings.textContent = this.formatPrice(product.VA0_monto_ahorro) + '€';
            if (annualSavingsNoVat) {
                annualSavingsNoVat.textContent = this.formatPrice(product.WA0_monto_ahorro_no_vat) + '€';
            }

            // Crear y añadir el nuevo div subMens con promo-duration-annual debajo de oferta_inf
            const ofertaInf = annualPlan.querySelector('.oferta_inf');
            if (ofertaInf) {
                // Verificar si ya existe el div para no duplicarlo
                let subMens = annualPlan.querySelector('.subMens');
                if (!subMens) {
                    subMens = document.createElement('div');
                    subMens.className = 'subMens';
                    const promoDurationAnnual = document.createElement('span');
                    promoDurationAnnual.className = 'promo-duration-annual';
                    promoDurationAnnual.textContent = 'el primer año';
                    subMens.appendChild(promoDurationAnnual);
                    // Insertar después de oferta_inf
                    if (ofertaInf.parentNode) {
                        ofertaInf.parentNode.insertBefore(subMens, ofertaInf.nextSibling);
                    } else {
                        // Fallback: añadir después de oferta_inf
                        ofertaInf.after(subMens);
                    }
                }
            }

            // Cambiar el texto de price-frequency en el plan anual
            const priceFrequency = annualPlan.querySelector('.price-frequency');
            if (priceFrequency) {
                priceFrequency.textContent = '€/ año el 1er año';
            }

            // Crear y añadir el nuevo div despues_12_meses
            const annualPriceBlock = annualPlan.querySelector('.annual-price-block');
            if (annualPriceBlock) {
                // Verificar si ya existe el div para no duplicarlo
                let despues12Meses = annualPriceBlock.querySelector('.despues_12_meses');
                if (!despues12Meses) {
                    despues12Meses = document.createElement('div');
                    despues12Meses.className = 'despues_12_meses';
                    // Insertar después del div que contiene price-frequency (final-price-row)
                    const finalPriceRow = annualPriceBlock.querySelector('.final-price-row');
                    if (finalPriceRow && finalPriceRow.parentNode) {
                        finalPriceRow.parentNode.insertBefore(despues12Meses, finalPriceRow.nextSibling);
                    } else {
                        // Fallback: añadir al final del annual-price-block
                        annualPriceBlock.appendChild(despues12Meses);
                    }
                }
                // Calcular el precio después de 12 meses: precio mensual sin descuento * 11
                // Para empresas: calcular directamente desde el precio con IVA y redondear hacia arriba
                // Para particulares/autónomos: usar precio con IVA
                let precioDespues12Meses;
                if (main) {
                    // Calcular directamente: (precio mensual con IVA / 1.21) * 11 y redondear hacia arriba
                    precioDespues12Meses = Math.ceil((product.JA0_price_no_discount / 1.21) * 11);
                } else {
                    precioDespues12Meses = product.JA0_price_no_discount * 11;
                }
                despues12Meses.textContent = `después: ${this.formatPrice(precioDespues12Meses)}€/año`;
            }

            // Botones de selección
            const monthlyButton = monthlyPlan.querySelector('.select-button');
            const annualButton = annualPlan.querySelector('.select-button');

            monthlyButton.addEventListener('click', () => {
                const url = `/trigger_mensual_${product.EA0_sizeCodeId}`;
                window.location.href = url;
            });

            annualButton.addEventListener('click', () => {
                const url = `/trigger_annual_${product.EA0_sizeCodeId}`;
                window.location.href = url;
            });

            // Mostrar/ocultar promo
            if (!product.KA0_promo_mode) {
                planContent.classList.add('no-current-promo');
            } else {
                planContent.classList.remove('no-current-promo');
            }

            // Ocultar precios originales cuando no hay promoción
            if (!product.PA0_sufix_discount) {
                monthlyOriginalPrice.style.display = 'none';
                monthlyOriginalPriceNoVat.style.display = 'none';
                // annualOriginalPrice.style.display = 'none';
                // annualOriginalPriceNoVat.style.display = 'none';
            } else {
                monthlyOriginalPrice.style.display = '';
                monthlyOriginalPriceNoVat.style.display = '';
                // annualOriginalPrice.style.display = '';
                // annualOriginalPriceNoVat.style.display = '';
            }

            this.container.appendChild(card);
        });

        // Añadir clase a .filter-controls si hay algún producto de 1ª Planta
        const hasUpperFloor = this.products.some(product => 
            product.AA1_product_name && product.AA1_product_name.includes('_P1_')
        );
        const filterControls = document.querySelector('.filter-controls');
        if (filterControls) {
            filterControls.classList.toggle('doble_planta_center', hasUpperFloor);
        }

        // Cambiar mensaje de IVA según el entorno
        const mainEmpresas = document.querySelector('main[id^="empresas-"], div[id^="empresas-"]');
        if (mainEmpresas) {
            document.querySelectorAll('.vat-label, .iva-incluido').forEach(el => {
                el.textContent = 'IVA no incluido';
            });
        } else {
            document.querySelectorAll('.vat-label, .iva-incluido').forEach(el => {
                el.textContent = 'IVA incluido';
            });
        }
    }
}

// Espera a que el DOM esté listo y a que el evento pricesReady sea disparado por el script de datos correspondiente
document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('pricesReady', (e) => {
        const productos = e.detail.data;
        const centro = e.detail.centro;
        const app = new ProductManager(productos, centro);
        app.init();
    }, { once: true });
});

