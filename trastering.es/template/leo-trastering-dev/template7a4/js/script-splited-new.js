// // En tu archivo JavaScript principal para impedir que la página se posicione en el centro
// function preventInitialScrollJump() {
//   // 1. Bloquear scroll inicial
//   document.documentElement.style.scrollBehavior = 'auto';
//   document.body.style.overflow = 'hidden';
  
//   // 2. Esperar a que todo esté cargado
//   window.addEventListener('load', () => {
//     // 3. Restaurar estilos después de 100ms
//     setTimeout(() => {
//       document.documentElement.style.scrollBehavior = '';
//       document.body.style.overflow = '';
//       window.scrollTo(0, 0);
//     }, 100);
//   });
// }

// // Llamar al inicio
// document.addEventListener('DOMContentLoaded', preventInitialScrollJump);

class MenuSystem {
  constructor() {
    // Elementos principales
    this.hamburger = document.getElementById('hamburger-menu');
    this.mobileMenu = document.getElementById('mobile-menu');
    this.contactTrigger = document.getElementById('trigger-contacto');
    this.contactMobileMenu = document.getElementById('xmegamenu-mobile-contacto');
    this.activeClass = 'active';
    this.isMobile = window.innerWidth <= 599;
    this.currentOpenMobileMenu = null;

    // Megamenus para desktop (solo >600px)
    this.desktopMenus = {
      particulares: {
        trigger: document.getElementById('trigger-particulares'),
        menu: document.getElementById('xmegamenu-particulares')
      },
      autonomos: {
        trigger: document.getElementById('trigger-autonomos'),
        menu: document.getElementById('xmegamenu-autonomos')
      },
      empresas: {
        trigger: document.getElementById('trigger-empresas'),
        menu: document.getElementById('xmegamenu-empresas')
      },
      contacto: {
        trigger: document.getElementById('trigger-contacto'),
        menu: document.getElementById('xmegamenu-contacto')
      }
    };

    this.init();
  }

  init() {
    if (!this.checkElements()) return;

    this.setupMobileBehavior();
    this.setupDesktopBehavior();
    this.setupGlobalListeners();
  }

  checkElements() {
    // Verificar elementos móviles
    const mobileElementsExist = this.hamburger && this.mobileMenu &&
      this.contactTrigger && this.contactMobileMenu;

    // Verificar elementos desktop
    const desktopElementsExist = Object.values(this.desktopMenus).every(
      m => m.trigger && m.menu
    );

    if (!mobileElementsExist) console.warn('Elementos móviles no encontrados');
    if (!desktopElementsExist) console.warn('Algunos elementos desktop no encontrados');

    return mobileElementsExist;
  }

  closeHamburgerMenu() {
    if (this.mobileMenu.classList.contains(this.activeClass)) {
      this.mobileMenu.classList.remove(this.activeClass);
      this.hamburger.classList.remove(this.activeClass);
    }
  }

  closeContactMenu() {
    if (this.contactMobileMenu.style.display === 'flex') {
      this.contactMobileMenu.style.display = 'none';
      this.contactTrigger.classList.remove(this.activeClass);
    }
  }

  setupMobileBehavior() {
    // Hamburguer menu
    this.hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.mobileMenu.classList.contains(this.activeClass)) {
        this.closeAllMobileMenus();
      } else {
        this.openHamburgerMenu();
      }
    });

    // Contact trigger
    this.contactTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.contactMobileMenu.style.display === 'flex') {
        this.closeAllMobileMenus();
      } else {
        this.openContactMenu();
      }
    });

    // Clic en documento
    document.addEventListener('click', (e) => this.handleDocumentClick(e));
  }

  setupDesktopBehavior() {
    // Configurar megamenus desktop
    Object.values(this.desktopMenus).forEach(({ trigger, menu }) => {
      if (!trigger || !menu) return;

      trigger.addEventListener('click', (e) => {
        if (!this.isMobile) {
          e.stopPropagation();
          this.toggleDesktopMenu(trigger, menu);
        }
      });

      menu.addEventListener('mouseleave', () => {
        if (!this.isMobile) {
          this.closeDesktopMenu(trigger, menu);
        }
      });
    });
  }

  setupGlobalListeners() {
    // Cerrar menús al hacer click fuera
    document.addEventListener('click', (e) => {
      if (!this.isClickInsideMenu(e)) {
        this.closeAllMenus();
      }
    });

    // Actualizar al cambiar tamaño
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth <= 599;
      if (!this.isMobile) {
        this.closeAllMobileMenus();
      }
    });
  }

  isClickInsideMenu(e) {
    // Elementos del menú principal
    const menuElements = [
      this.hamburger,
      this.mobileMenu,
      this.contactTrigger,
      this.contactMobileMenu
    ];

    // Verifica si el click fue en algún elemento del menú
    const clickedMenuElement = menuElements.some(element =>
      element && element.contains(e.target)
    );

    // Verifica si el click fue en un acordeón del menú móvil
    const clickedAccordion = this.mobileMenu &&
      this.mobileMenu.contains(e.target) &&
      e.target.closest('.z0ytitle');

    return clickedMenuElement || clickedAccordion;
  }


  // Métodos para mobile
  toggleHamburgerMenu() {
    this.mobileMenu.classList.toggle(this.activeClass);
    this.hamburger.classList.toggle(this.activeClass);
  }

  toggleContactMenu() {
    if (this.contactMobileMenu.style.display === 'flex') {
      this.contactMobileMenu.style.display = 'none';
      this.contactTrigger.classList.remove(this.activeClass);
    } else {
      this.contactMobileMenu.style.display = 'flex';
      this.contactTrigger.classList.add(this.activeClass);
    }
  }

  // Métodos para desktop
  toggleDesktopMenu(trigger, menu) {
    if (menu.style.display === 'flex') {
      this.closeDesktopMenu(trigger, menu);
    } else {
      this.closeAllDesktopMenus();
      this.openDesktopMenu(trigger, menu);
    }
  }

  openDesktopMenu(trigger, menu) {
    menu.style.display = 'flex';
    trigger.classList.add(this.activeClass);
  }

  closeDesktopMenu(trigger, menu) {
    menu.style.display = 'none';
    trigger.classList.remove(this.activeClass);
  }

  // Métodos de cierre global
  closeAllMobileMenus() {
    this.mobileMenu.classList.remove(this.activeClass);
    this.hamburger.classList.remove(this.activeClass);
    this.contactMobileMenu.style.display = 'none';
    this.contactTrigger.classList.remove(this.activeClass);
  }

  closeAllDesktopMenus() {
    Object.values(this.desktopMenus).forEach(({ trigger, menu }) => {
      if (menu && trigger) {
        menu.style.display = 'none';
        trigger.classList.remove(this.activeClass);
      }
    });
  }

  closeAllMenus() {
    this.closeAllMobileMenus();
    if (!this.isMobile) {
      this.closeAllDesktopMenus();
    }
  }
  // Modificar el método handleDocumentClick
  handleDocumentClick(e) {
    // Verificar si el click fue fuera de todos los menús móviles
    const clickedOutsideAllMenus = !this.isClickInsideAnyMobileMenu(e);

    if (clickedOutsideAllMenus) {
      this.closeAllMobileMenus();
    }
  }

  // Nuevo método para verificar clicks en cualquier menú móvil
  isClickInsideAnyMobileMenu(e) {
    const mobileMenus = [
      this.mobileMenu,
      this.contactMobileMenu
      // Añadir aquí otros menús móviles si existen
    ];

    return mobileMenus.some(menu =>
      menu && menu.style.display === 'flex' && menu.contains(e.target)
    );
  }

  // Modificar los métodos de apertura
  openContactMenu() {
    this.closeAllMobileMenus(); // Cerrar otros menús primero
    this.contactMobileMenu.style.display = 'flex';
    this.contactTrigger.classList.add(this.activeClass);
    this.currentOpenMobileMenu = this.contactMobileMenu;
  }

  openHamburgerMenu() {
    this.closeAllMobileMenus(); // Cerrar otros menús primero
    this.mobileMenu.classList.add(this.activeClass);
    this.hamburger.classList.add(this.activeClass);
    this.currentOpenMobileMenu = this.mobileMenu;
  }

  // Método de cierre actualizado
  closeAllMobileMenus() {
    // Cerrar menú hamburguesa
    this.mobileMenu.classList.remove(this.activeClass);
    this.hamburger.classList.remove(this.activeClass);

    // Cerrar menú contacto móvil
    if (this.contactMobileMenu) {
      this.contactMobileMenu.style.display = 'none';
      this.contactTrigger.classList.remove(this.activeClass);
    }

    this.currentOpenMobileMenu = null;
  }
}
// hasta aquí lo que estaba en menu.js
// aquí acaba la refactorización de la clase MenuSystem que se inicializa despues del DomContentLoaded
class AccordionSystem {
  constructor() {
    this.accordionGroups = [
      // Grupo especial para el acordeón del menú móvil
      {
        id: 'mobile-menu',  // Contenedor del menú móvil
        titleClass: 'z0ytitle',
        ignoreOutsideClick: true  // Nueva propiedad para este caso especial
      },
      // Resto de acordeones normales
      { id: 'toggle-z1y1-find-centres-near-you-mobile', titleClass: 'z1ytitle' },
      { id: 'toggle-z0y0-mn-size-features', titleClass: 'z0y0title' },
      { id: 'toggle-z2y2-sm-size-features', titleClass: 'z2y2title' },
      { id: 'toggle-z3y3-md-size-features', titleClass: 'z3y3title' },
      { id: 'toggle-z4y4-bg-size-features', titleClass: 'z4y4title' },
      { id: 'toggle-z5y5-mx-size-features', titleClass: 'z5y5title' },
      { id: 'toggle-z6y6', titleClass: 'z6y6title' },
      { id: 'toggle-z7y7', titleClass: 'z7y7title' },
      { id: 'toggle-z8y8', titleClass: 'z8y8title' },
      { id: 'toggle-z01y01-tabs-info-centre-pb-cornella', titleClass: 'z01y01title' },
      { id: 'toggle-z02y02', titleClass: 'z02y02title' }
    ];

    this.activeClass = 'active';
    this.init();
  }

  init() {
    this.accordionGroups.forEach(group => {
      const container = document.getElementById(group.id);
      if (!container) return;

      const titles = container.querySelectorAll(`.${group.titleClass}`);
      titles.forEach(title => {
        title.addEventListener('click', (e) => {
          // No propagar el evento para el acordeón del menú móvil
          if (group.ignoreOutsideClick) {
            e.stopPropagation();
          }
          this.handleAccordionClick(title, titles);
        });
      });
    });
  }

  handleAccordionClick(clickedTitle, allTitles) {
    // Si es el acordeón del menú móvil, evitar que el menú se cierre
    if (this.menuSystem && clickedTitle.closest('#mobile-menu')) {
      this.menuSystem.keepMenuOpen = true;
    }

    // ... (resto de la lógica del acordeón)
    const isActive = clickedTitle.classList.contains(this.activeClass);
    const content = clickedTitle.nextElementSibling;

    this.closeAllInGroup(allTitles);

    if (!isActive && content) {
      clickedTitle.classList.add(this.activeClass);
      content.style.maxHeight = `${content.scrollHeight}px`;
    }
  }

  closeAllInGroup(titles) {
    titles.forEach(title => {
      title.classList.remove(this.activeClass);
      const content = title.nextElementSibling;
      if (content) {
        content.style.maxHeight = null;
      }
    });
  }
}
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
// Buscar el contenedor existente en tu HTML
const breadcrumbContainer = document.getElementById('breadcrumb-container1');

// Verificar si el contenedor existe
if (!breadcrumbContainer) {
    console.error('No se encontró el contenedor con ID "breadcrumb-container1"');
} else {
    // Configurar el contenedor encontrado
    breadcrumbContainer.className = 'breadcrumb';
    breadcrumbContainer.setAttribute('aria-label', 'breadcrumb');
    
    // Generar el breadcrumb
    function generateBreadcrumb() {
        const path = window.location.pathname;
        const segments = path.split('/')
          .filter(segment => segment !== '')
          .map(segment => segment.replace(/\.html$/, ''))
          .filter(segment => segment !== 'index');
        
          let breadcrumbHtml = segments.length === 0 
          ? '<span class="current">Inicio</span>'
          : '<a href="/">Inicio</a>';

        let accumulatedPath = '/';
        
        segments.forEach((segment, index) => {
            accumulatedPath += segment + '/';
            // breadcrumbHtml += `<span class="separator">/</span>`;
            
            const isLast = index === segments.length - 1;
            
            breadcrumbHtml += '<span class="separator" aria-hidden="true">›</span>';
            
            if (index === segments.length - 1) {
              breadcrumbHtml += `<span class="current">${formatSegment(segment)}</span>`;
            } else {
              // Comprobar si el segmento es uno de los casos especiales
              const specialPaths = ['inicio', 'alquiler-trasteros-particulares', 'alquiler-almacenes-empresas', 'alquiler-trasteros-autonomos', 'reserva'];
              if (specialPaths.includes(segment)) {
                breadcrumbHtml += `<span class="path">${formatSegment(segment)}</span>`;
              } else {
                breadcrumbHtml += `<a href="${accumulatedPath}">${formatSegment(segment)}</a>`;
              }
            }
        });
        
        breadcrumbContainer.innerHTML = breadcrumbHtml;
    }
    
    function formatSegment(segment) {
      // Eliminar .html y cualquier otra extensión de archivo
      const segmentWithoutExtension = segment.replace(/\.[^/.]+$/, '');
      
      return segmentWithoutExtension
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
  }
    
    // Generar breadcrumb inicial
    generateBreadcrumb();
    
    // Actualizar breadcrumb si cambia la URL (para SPAs)
    window.addEventListener('popstate', generateBreadcrumb);
}
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////



// Inicialización única ( parte 2 )
document.addEventListener('DOMContentLoaded', () => {
  // 1. Primero crea MenuSystem
  window.menuSystem = new MenuSystem();

  // 2. Luego crea AccordionSystem pasando menuSystem
  window.accordionSystem = new AccordionSystem(window.menuSystem);

  // 3. Añade esta propiedad a MenuSystem
  window.menuSystem.keepMenuOpen = false;

  // 4. Modifica el método closeAllMenus de MenuSystem:
  window.menuSystem.closeAllMenus = function () {
    if (!this.keepMenuOpen) {
      this.mobileMenu.classList.remove(this.activeClass);
      this.hamburger.classList.remove(this.activeClass);
    }
    this.keepMenuOpen = false; // Resetear la bandera
  };
});

// Eliminar la segunda inicialización
// window.menuSystem = new MenuSystem();
// window.accordionSystem = new AccordionSystem(window.menuSystem);

// aquí empieza la refactorización de la clase GenericCarousel

// aqui acaba la refactorización de la clase AccordionSystem que se inicializa despues del DomContentLoaded
// aquí empieza la refactorización de la clase GenericCarousel
class GenericCarousel {
  constructor(prefix, options = {}) {
    // Configuración básica
    this.prefix = prefix;
    this.pauseTime = options.pauseTime || 3800;
    this.clonedSlides = options.clonedSlides || 1;

    // Elementos del DOM
    this.container = document.querySelector(`.carousel${prefix}`);
    this.slideWrapper = document.querySelector(`.carousel__slides${prefix}`);
    this.slides = document.querySelectorAll(`.carousel__slide${prefix}`);
    this.navdots = document.querySelectorAll(`.carousel__navdots${prefix} button`);

    // Estado
    this.currentIndex = 0;
    this.autoPlayInterval = null;
    this.isPlaying = false;

    // Inicialización
    if (this.validateElements()) {
      this.init();
    }
    this.smoothScrollEnabled = true; // Nuevo: control de scroll suave
  }

  validateElements() {
    if (!this.container || !this.slideWrapper || this.slides.length === 0) {
      console.warn(`Elementos del carrusel ${this.prefix} no encontrados`);
      return false;
    }
    return true;
  }

  init() {
    this.setupDimensions();
    this.setupInfiniteScrolling();
    this.setupNavdots();
    this.setupEventListeners();
    this.startAutoplay();
    this.gotoSlide(0);
  }

  setupDimensions() {
    this.slideWidth = this.slides[0].offsetWidth;
    this.spaceBetween = Number(
      window.getComputedStyle(this.slideWrapper)
        .getPropertyValue('grid-column-gap')
        .replace('px', '')
    ) || 0;
  }

  setupInfiniteScrolling() {
    if (this.slides.length > 1) {
      const firstClone = this.slides[0].cloneNode(true);
      const lastClone = this.slides[this.slides.length - 1].cloneNode(true);

      firstClone.setAttribute('aria-hidden', 'true');
      lastClone.setAttribute('aria-hidden', 'true');

      this.slideWrapper.append(firstClone);
      this.slideWrapper.prepend(lastClone);
    }
  }

  setupNavdots() {
    this.navdots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.gotoSlide(index));
    });
  }

  setupEventListeners() {
    // Eventos de ratón/táctil
    this.container.addEventListener('mouseenter', () => this.pause());
    this.container.addEventListener('mouseleave', () => this.play());
    this.container.addEventListener('touchstart', () => this.pause());

    // Eventos de teclado
    this.container.addEventListener('focusin', () => this.pause());
    this.container.addEventListener('focusout', () => {
      if (!this.container.matches(':hover')) this.play();
    });

    // Redimensionamiento
    window.addEventListener('resize', () => {
      this.setupDimensions();
      this.gotoSlide(this.currentIndex);
    });
  }

  gotoSlide(index) {
    this.currentIndex = index;
    const scrollPosition = (this.slideWidth + this.spaceBetween) *
      (index + this.clonedSlides);

    this.slideWrapper.style.scrollBehavior = 'auto';
    this.slideWrapper.scrollLeft = scrollPosition;
    this.slideWrapper.style.scrollBehavior = 'smooth';

    this.updateNavdots();
    this.handleInfiniteScroll();
  }

  updateNavdots() {
    if (this.navdots.length > 0) {
      this.navdots.forEach(dot => {
        dot.classList.remove('is-active');
        dot.setAttribute('aria-disabled', 'false');
      });

      const activeDot = this.navdots[this.currentIndex];
      if (activeDot) {
        activeDot.classList.add('is-active');
        activeDot.setAttribute('aria-disabled', 'true');
      }
    }
  }

  handleInfiniteScroll() {
    const totalSlides = this.slides.length;
    const scrollThreshold = (this.slideWidth + this.spaceBetween) * this.clonedSlides;

    setTimeout(() => {
      if (this.slideWrapper.scrollLeft < scrollThreshold) {
        this.slideWrapper.style.scrollBehavior = 'auto';
        this.slideWrapper.scrollLeft = (this.slideWidth + this.spaceBetween) * totalSlides;
        this.slideWrapper.style.scrollBehavior = 'smooth';
      } else if (this.slideWrapper.scrollLeft > (totalSlides + this.clonedSlides - 0.5) * (this.slideWidth + this.spaceBetween)) {
        this.slideWrapper.style.scrollBehavior = 'auto';
        this.slideWrapper.scrollLeft = (this.slideWidth + this.spaceBetween) * this.clonedSlides;
        this.slideWrapper.style.scrollBehavior = 'smooth';
      }
    }, 100);
  }

  nextSlide() {
    this.gotoSlide((this.currentIndex + 1) % this.slides.length);
  }

  prevSlide() {
    this.gotoSlide((this.currentIndex - 1 + this.slides.length) % this.slides.length);
  }

  startAutoplay() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.stopAutoplay();
    this.isPlaying = true;
    this.autoPlayInterval = setInterval(() => this.nextSlide(), this.pauseTime);
    this.slideWrapper.setAttribute('aria-live', 'off');
  }

  stopAutoplay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.isPlaying = false;
      this.slideWrapper.setAttribute('aria-live', 'polite');
    }
  }

  play() {
    if (!this.isPlaying) {
      this.startAutoplay();
    }
  }

  pause() {
    this.stopAutoplay();
  }
  enableSmoothScroll() {
    this.slideWrapper.classList.add('smooth-scroll');
    this.smoothScrollEnabled = true;
  }

  disableSmoothScroll() {
    this.slideWrapper.classList.remove('smooth-scroll');
    this.smoothScrollEnabled = false;
  }

  gotoSlide(index) {
    this.currentIndex = index;
    const scrollPosition = (this.slideWidth + this.spaceBetween) * 
                         (index + this.clonedSlides);
    
    // Desactivar temporalmente smooth-scroll para posicionamiento inicial
    this.disableSmoothScroll();
    this.slideWrapper.scrollLeft = scrollPosition;
    
    // Reactivar smooth-scroll después de un breve retraso
    setTimeout(() => {
      this.enableSmoothScroll();
    }, 50);
    
    this.updateNavdots();
    this.handleInfiniteScroll();
  }

  handleInfiniteScroll() {
    const totalSlides = this.slides.length;
    const scrollThreshold = (this.slideWidth + this.spaceBetween) * this.clonedSlides;
    
    setTimeout(() => {
      if (this.slideWrapper.scrollLeft < scrollThreshold) {
        this.disableSmoothScroll();
        this.slideWrapper.scrollLeft = (this.slideWidth + this.spaceBetween) * totalSlides;
        this.enableSmoothScroll();
      } else if (this.slideWrapper.scrollLeft > (totalSlides + this.clonedSlides - 0.5) * (this.slideWidth + this.spaceBetween)) {
        this.disableSmoothScroll();
        this.slideWrapper.scrollLeft = (this.slideWidth + this.spaceBetween) * this.clonedSlides;
        this.enableSmoothScroll();
      }
    }, 100);
  }

  init() {
    this.setupDimensions();
    this.setupInfiniteScrolling();
    this.setupNavdots();
    this.setupEventListeners();
    this.enableSmoothScroll(); // Asegurar que está activado al inicio
    this.startAutoplay();
    this.gotoSlide(0);
  }
}

  const carousels = [
    new GenericCarousel(''), // Carrusel principal (sin sufijo)
    new GenericCarousel('2'), // Carrusel con sufijo '2'
    new GenericCarousel('3'), // Carrusel con sufijo '3'
    new GenericCarousel('q0x0'), // Carrusel con sufijo 'q0x0'
    new GenericCarousel('q1x1') // Carrusel con sufijo 'q1x1'
    // Añadir más según sea necesario
  ];

  // El resto de tu código existente puede mantenerse aquí
  // (carruseles, acordeones, etc.)
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // refactorización de los acordeones genéricos completada
  // \\\\\\ EMPIEZA EL CÓDIGO DE LAS TABS pestañas  PARA SELECCIONAR PLANES EN LA APP DE PRECIOS \\\\\\\\\\\\\\\\\\\
// });
if (document.getElementById("v_S_ab")) {
  const tabContainers = document.querySelectorAll('#v_S_ab > div');

  // Función para manejar las pestañas dentro de un contenedor
  function setupTabs(container) {
    const tabButtons = container.querySelectorAll('.xy-tabs__pills.btn');
    const tabContents = container.querySelectorAll('.xy-tabs__panels');
    const masInfoA = container.querySelector('.mas-info-a');
    const masInfoB = container.querySelector('.mas-info-b');

    tabButtons.forEach((tabBtn) => { // >
      tabBtn.addEventListener('click', () => { // >
        const tabId = tabBtn.getAttribute('data-id'); // >

        // Remover la clase 'active' de todos los botones y paneles dentro de este contenedor
        tabButtons.forEach((btn) => btn.classList.remove('active')); // >
        tabContents.forEach((content) => content.classList.remove('active')); // >

        // Agregar la clase 'active' al botón y panel correspondiente
        tabBtn.classList.add('active'); // >
        container.querySelector(`#${tabId}`).classList.add('active'); // >

        // Mostrar u ocultar los botones "Más info" según la pestaña activa
        if (tabId === 'mensual') { // >
          masInfoA.classList.add('active'); // >
          masInfoB.classList.remove('active'); // >
        } else if (tabId === 'anual') { // >
          masInfoA.classList.remove('active'); // >
          masInfoB.classList.add('active'); // >
        } // >
      }); // >
    }); // >

    // Mostrar el botón "Más info" correspondiente a la pestaña activa por defecto
    const activeTab = container.querySelector('.xy-tabs__panels.active').id;
    if (activeTab === 'mensual') {
      masInfoA.classList.add('active');
    } else if (activeTab === 'anual') {
      masInfoB.classList.add('active');
    }
  }

  // Función para manejar los modales
  function setupModals() {
    const masInfoButtons = document.querySelectorAll('.mas-info');
    const closeModalButtons = document.querySelectorAll('.close-modal');

    // Abrir modal
    masInfoButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const modalId = button.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        if (modal) {
          modal.style.display = 'flex';
        }
      });
    });

    // Cerrar modal
    closeModalButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        if (modal) {
          modal.style.display = 'none';
        }
      });
    });

    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener('click', (event) => {
      if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
      }
    });
  }

  // Aplicar la lógica de pestañas y modales a cada contenedor
  tabContainers.forEach((container) => {
    setupTabs(container); // Configurar pestañas para este contenedor
  });
  setupModals(); // Configurar modales

  ////////////// y aquí el código para los acordeones de las pestañas de la app de precios ////////////////////////
  let titles = document.querySelectorAll('.title');
  for (let i = 0; i < titles.length; i++) {
    titles[i].onclick = function () {
      this.classList.toggle('active');
      let box = this.nextElementSibling;
      if (box.style.maxHeight) {
        box.style.maxHeight = null;
      } else {
        box.style.maxHeight = box.scrollHeight + 'px';
      }
      for (let j = 0; j < titles.length; j++) {
        if (titles[j] !== this) {
          titles[j].classList.remove('active');
          titles[j].nextElementSibling.style.maxHeight = null;
        }
      }
    };
  }

}
if (document.getElementById("v_S_ba")) {
  const tabContainers = document.querySelectorAll('#v_S_ba > div');

  // Función para manejar las pestañas dentro de un contenedor
  function setupTabs(container) {
    const tabButtons = container.querySelectorAll('.xy-tabs__pills.btn');
    const tabContents = container.querySelectorAll('.xy-tabs__panels');
    const masInfoA = container.querySelector('.mas-info-a');
    const masInfoB = container.querySelector('.mas-info-b');

    tabButtons.forEach((tabBtn) => { // >
      tabBtn.addEventListener('click', () => { // >
        const tabId = tabBtn.getAttribute('data-id'); // >

        // Remover la clase 'active' de todos los botones y paneles dentro de este contenedor
        tabButtons.forEach((btn) => btn.classList.remove('active')); // >
        tabContents.forEach((content) => content.classList.remove('active')); // >

        // Agregar la clase 'active' al botón y panel correspondiente
        tabBtn.classList.add('active'); // >
        container.querySelector(`#${tabId}`).classList.add('active'); // >

        // Mostrar u ocultar los botones "Más info" según la pestaña activa
        if (tabId === 'mensual') { // >
          masInfoA.classList.add('active'); // >
          masInfoB.classList.remove('active'); // >
        } else if (tabId === 'anual') { // >
          masInfoA.classList.remove('active'); // >
          masInfoB.classList.add('active'); // >
        } // >
      }); // >
    }); // >

    // Mostrar el botón "Más info" correspondiente a la pestaña activa por defecto
    const activeTab = container.querySelector('.xy-tabs__panels.active').id;
    if (activeTab === 'mensual') {
      masInfoA.classList.add('active');
    } else if (activeTab === 'anual') {
      masInfoB.classList.add('active');
    }
  }

  // Función para manejar los modales
  function setupModals() {
    const masInfoButtons = document.querySelectorAll('.mas-info');
    const closeModalButtons = document.querySelectorAll('.close-modal');

    // Abrir modal
    masInfoButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const modalId = button.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        if (modal) {
          modal.style.display = 'flex';
        }
      });
    });

    // Cerrar modal
    closeModalButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        if (modal) {
          modal.style.display = 'none';
        }
      });
    });

    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener('click', (event) => {
      if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
      }
    });
  }

  // Aplicar la lógica de pestañas y modales a cada contenedor
  tabContainers.forEach((container) => {
    setupTabs(container); // Configurar pestañas para este contenedor
  });
  setupModals(); // Configurar modales

  ////////////// y aquí el código para los acordeones de las pestañas de la app de precios ////////////////////////
  let titles = document.querySelectorAll('.title');
  for (let i = 0; i < titles.length; i++) {
    titles[i].onclick = function () {
      this.classList.toggle('active');
      let box = this.nextElementSibling;
      if (box.style.maxHeight) {
        box.style.maxHeight = null;
      } else {
        box.style.maxHeight = box.scrollHeight + 'px';
      }
      for (let j = 0; j < titles.length; j++) {
        if (titles[j] !== this) {
          titles[j].classList.remove('active');
          titles[j].nextElementSibling.style.maxHeight = null;
        }
      }
    };
  }
  if (document.getElementById("v_P_ab")) {
    const tabContainers = document.querySelectorAll('#v_P_ab > div');

    // Función para manejar las pestañas dentro de un contenedor
    function setupTabs(container) {
      const tabButtons = container.querySelectorAll('.xy-tabs__pills.btn');
      const tabContents = container.querySelectorAll('.xy-tabs__panels');
      const masInfoA = container.querySelector('.mas-info-a');
      const masInfoB = container.querySelector('.mas-info-b');

      tabButtons.forEach((tabBtn) => { // >
        tabBtn.addEventListener('click', () => { // >
          const tabId = tabBtn.getAttribute('data-id'); // >

          // Remover la clase 'active' de todos los botones y paneles dentro de este contenedor
          tabButtons.forEach((btn) => btn.classList.remove('active')); // >
          tabContents.forEach((content) => content.classList.remove('active')); // >

          // Agregar la clase 'active' al botón y panel correspondiente
          tabBtn.classList.add('active'); // >
          container.querySelector(`#${tabId}`).classList.add('active'); // >

          // Mostrar u ocultar los botones "Más info" según la pestaña activa
          if (tabId === 'mensual') { // >
            masInfoA.classList.add('active'); // >
            masInfoB.classList.remove('active'); // >
          } else if (tabId === 'anual') { // >
            masInfoA.classList.remove('active'); // >
            masInfoB.classList.add('active'); // >
          } // >
        }); // >
      }); // >

      // Mostrar el botón "Más info" correspondiente a la pestaña activa por defecto
      const activeTab = container.querySelector('.xy-tabs__panels.active').id;
      if (activeTab === 'mensual') {
        masInfoA.classList.add('active');
      } else if (activeTab === 'anual') {
        masInfoB.classList.add('active');
      }
    }

    // Función para manejar los modales
    function setupModals() {
      const masInfoButtons = document.querySelectorAll('.mas-info');
      const closeModalButtons = document.querySelectorAll('.close-modal');

      // Abrir modal
      masInfoButtons.forEach((button) => {
        button.addEventListener('click', () => {
          const modalId = button.getAttribute('data-modal');
          const modal = document.getElementById(modalId);
          if (modal) {
            modal.style.display = 'flex';
          }
        });
      });

      // Cerrar modal
      closeModalButtons.forEach((button) => {
        button.addEventListener('click', () => {
          const modal = button.closest('.modal');
          if (modal) {
            modal.style.display = 'none';
          }
        });
      });

      // Cerrar modal al hacer clic fuera del contenido
      window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
          event.target.style.display = 'none';
        }
      });
    }

    // Aplicar la lógica de pestañas y modales a cada contenedor
    tabContainers.forEach((container) => {
      setupTabs(container); // Configurar pestañas para este contenedor
    });
    setupModals(); // Configurar modales

    ////////////// y aquí el código para los acordeones de las pestañas de la app de precios ////////////////////////
    let titles = document.querySelectorAll('.title');
    for (let i = 0; i < titles.length; i++) {
      titles[i].onclick = function () {
        this.classList.toggle('active');
        let box = this.nextElementSibling;
        if (box.style.maxHeight) {
          box.style.maxHeight = null;
        } else {
          box.style.maxHeight = box.scrollHeight + 'px';
        }
        for (let j = 0; j < titles.length; j++) {
          if (titles[j] !== this) {
            titles[j].classList.remove('active');
            titles[j].nextElementSibling.style.maxHeight = null;
          }
        }
      };
    }

  }
}
if (document.getElementById("v_P_ab")) {
  const tabContainers = document.querySelectorAll('#v_P_ab > div');

  // Función para manejar las pestañas dentro de un contenedor
  function setupTabs(container) {
    const tabButtons = container.querySelectorAll('.xy-tabs__pills.btn');
    const tabContents = container.querySelectorAll('.xy-tabs__panels');
    const masInfoA = container.querySelector('.mas-info-a');
    const masInfoB = container.querySelector('.mas-info-b');

    tabButtons.forEach((tabBtn) => { // >
      tabBtn.addEventListener('click', () => { // >
        const tabId = tabBtn.getAttribute('data-id'); // >

        // Remover la clase 'active' de todos los botones y paneles dentro de este contenedor
        tabButtons.forEach((btn) => btn.classList.remove('active')); // >
        tabContents.forEach((content) => content.classList.remove('active')); // >

        // Agregar la clase 'active' al botón y panel correspondiente
        tabBtn.classList.add('active'); // >
        container.querySelector(`#${tabId}`).classList.add('active'); // >

        // Mostrar u ocultar los botones "Más info" según la pestaña activa
        if (tabId === 'mensual') { // >
          masInfoA.classList.add('active'); // >
          masInfoB.classList.remove('active'); // >
        } else if (tabId === 'anual') { // >
          masInfoA.classList.remove('active'); // >
          masInfoB.classList.add('active'); // >
        } // >
      }); // >
    }); // >

    // Mostrar el botón "Más info" correspondiente a la pestaña activa por defecto
    const activeTab = container.querySelector('.xy-tabs__panels.active').id;
    if (activeTab === 'mensual') {
      masInfoA.classList.add('active');
    } else if (activeTab === 'anual') {
      masInfoB.classList.add('active');
    }
  }

  // Función para manejar los modales
  function setupModals() {
    const masInfoButtons = document.querySelectorAll('.mas-info');
    const closeModalButtons = document.querySelectorAll('.close-modal');

    // Abrir modal
    masInfoButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const modalId = button.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        if (modal) {
          modal.style.display = 'flex';
        }
      });
    });

    // Cerrar modal
    closeModalButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        if (modal) {
          modal.style.display = 'none';
        }
      });
    });

    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener('click', (event) => {
      if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
      }
    });
  }

  // Aplicar la lógica de pestañas y modales a cada contenedor
  tabContainers.forEach((container) => {
    setupTabs(container); // Configurar pestañas para este contenedor
  });
  setupModals(); // Configurar modales

  ////////////// y aquí el código para los acordeones de las pestañas de la app de precios ////////////////////////
  let titles = document.querySelectorAll('.title');
  for (let i = 0; i < titles.length; i++) {
    titles[i].onclick = function () {
      this.classList.toggle('active');
      let box = this.nextElementSibling;
      if (box.style.maxHeight) {
        box.style.maxHeight = null;
      } else {
        box.style.maxHeight = box.scrollHeight + 'px';
      }
      for (let j = 0; j < titles.length; j++) {
        if (titles[j] !== this) {
          titles[j].classList.remove('active');
          titles[j].nextElementSibling.style.maxHeight = null;
        }
      }
    };
  }

}
if (document.getElementById("v_P_ba")) {
  const tabContainers = document.querySelectorAll('#v_P_ba > div');

  // Función para manejar las pestañas dentro de un contenedor
  function setupTabs(container) {
    const tabButtons = container.querySelectorAll('.xy-tabs__pills.btn');
    const tabContents = container.querySelectorAll('.xy-tabs__panels');
    const masInfoA = container.querySelector('.mas-info-a');
    const masInfoB = container.querySelector('.mas-info-b');

    tabButtons.forEach((tabBtn) => { // >
      tabBtn.addEventListener('click', () => { // >
        const tabId = tabBtn.getAttribute('data-id'); // >

        // Remover la clase 'active' de todos los botones y paneles dentro de este contenedor
        tabButtons.forEach((btn) => btn.classList.remove('active')); // >
        tabContents.forEach((content) => content.classList.remove('active')); // >

        // Agregar la clase 'active' al botón y panel correspondiente
        tabBtn.classList.add('active'); // >
        container.querySelector(`#${tabId}`).classList.add('active'); // >

        // Mostrar u ocultar los botones "Más info" según la pestaña activa
        if (tabId === 'mensual') { // >
          masInfoA.classList.add('active'); // >
          masInfoB.classList.remove('active'); // >
        } else if (tabId === 'anual') { // >
          masInfoA.classList.remove('active'); // >
          masInfoB.classList.add('active'); // >
        } // >
      }); // >
    }); // >

    // Mostrar el botón "Más info" correspondiente a la pestaña activa por defecto
    const activeTab = container.querySelector('.xy-tabs__panels.active').id;
    if (activeTab === 'mensual') {
      masInfoA.classList.add('active');
    } else if (activeTab === 'anual') {
      masInfoB.classList.add('active');
    }
  }

  // Función para manejar los modales
  function setupModals() {
    const masInfoButtons = document.querySelectorAll('.mas-info');
    const closeModalButtons = document.querySelectorAll('.close-modal');

    // Abrir modal
    masInfoButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const modalId = button.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        if (modal) {
          modal.style.display = 'flex';
        }
      });
    });

    // Cerrar modal
    closeModalButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        if (modal) {
          modal.style.display = 'none';
        }
      });
    });

    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener('click', (event) => {
      if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
      }
    });
  }

  // Aplicar la lógica de pestañas y modales a cada contenedor
  tabContainers.forEach((container) => {
    setupTabs(container); // Configurar pestañas para este contenedor
  });
  setupModals(); // Configurar modales

  ////////////// y aquí el código para los acordeones de las pestañas de la app de precios ////////////////////////
  let titles = document.querySelectorAll('.title');
  for (let i = 0; i < titles.length; i++) {
    titles[i].onclick = function () {
      this.classList.toggle('active');
      let box = this.nextElementSibling;
      if (box.style.maxHeight) {
        box.style.maxHeight = null;
      } else {
        box.style.maxHeight = box.scrollHeight + 'px';
      }
      for (let j = 0; j < titles.length; j++) {
        if (titles[j] !== this) {
          titles[j].classList.remove('active');
          titles[j].nextElementSibling.style.maxHeight = null;
        }
      }
    };
  }

}
if (document.getElementById("v_P0")) {
  const tabContainers = document.querySelectorAll('#v_P0 > div');

  // Función para manejar las pestañas dentro de un contenedor
  function setupTabs(container) {
    const tabButtons = container.querySelectorAll('.xy-tabs__pills.btn');
    const tabContents = container.querySelectorAll('.xy-tabs__panels');
    const masInfoA = container.querySelector('.mas-info-a');
    const masInfoB = container.querySelector('.mas-info-b');

    tabButtons.forEach((tabBtn) => { // >
      tabBtn.addEventListener('click', () => { // >
        const tabId = tabBtn.getAttribute('data-id'); // >

        // Remover la clase 'active' de todos los botones y paneles dentro de este contenedor
        tabButtons.forEach((btn) => btn.classList.remove('active')); // >
        tabContents.forEach((content) => content.classList.remove('active')); // >

        // Agregar la clase 'active' al botón y panel correspondiente
        tabBtn.classList.add('active'); // >
        container.querySelector(`#${tabId}`).classList.add('active'); // >

        // Mostrar u ocultar los botones "Más info" según la pestaña activa
        if (tabId === 'mensual') { // >
          masInfoA.classList.add('active'); // >
          masInfoB.classList.remove('active'); // >
        } else if (tabId === 'anual') { // >
          masInfoA.classList.remove('active'); // >
          masInfoB.classList.add('active'); // >
        } // >
      }); // >
    }); // >

    // Mostrar el botón "Más info" correspondiente a la pestaña activa por defecto
    const activeTab = container.querySelector('.xy-tabs__panels.active').id;
    if (activeTab === 'mensual') {
      masInfoA.classList.add('active');
    } else if (activeTab === 'anual') {
      masInfoB.classList.add('active');
    }
  }

  // Función para manejar los modales
  function setupModals() {
    const masInfoButtons = document.querySelectorAll('.mas-info');
    const closeModalButtons = document.querySelectorAll('.close-modal');

    // Abrir modal
    masInfoButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const modalId = button.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        if (modal) {
          modal.style.display = 'flex';
        }
      });
    });

    // Cerrar modal
    closeModalButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        if (modal) {
          modal.style.display = 'none';
        }
      });
    });

    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener('click', (event) => {
      if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
      }
    });
  }

  // Aplicar la lógica de pestañas y modales a cada contenedor
  tabContainers.forEach((container) => {
    setupTabs(container); // Configurar pestañas para este contenedor
  });
  setupModals(); // Configurar modales

  ////////////// y aquí el código para los acordeones de las pestañas de la app de precios ////////////////////////
  let titles = document.querySelectorAll('.title');
  for (let i = 0; i < titles.length; i++) {
    titles[i].onclick = function () {
      this.classList.toggle('active');
      let box = this.nextElementSibling;
      if (box.style.maxHeight) {
        box.style.maxHeight = null;
      } else {
        box.style.maxHeight = box.scrollHeight + 'px';
      }
      for (let j = 0; j < titles.length; j++) {
        if (titles[j] !== this) {
          titles[j].classList.remove('active');
          titles[j].nextElementSibling.style.maxHeight = null;
        }
      }
    };
  }

}
if (document.getElementById("v_P1")) {
  const tabContainers = document.querySelectorAll('#v_P1 > div');

  // Función para manejar las pestañas dentro de un contenedor
  function setupTabs(container) {
    const tabButtons = container.querySelectorAll('.xy-tabs__pills.btn');
    const tabContents = container.querySelectorAll('.xy-tabs__panels');
    const masInfoA = container.querySelector('.mas-info-a');
    const masInfoB = container.querySelector('.mas-info-b');

    tabButtons.forEach((tabBtn) => { // >
      tabBtn.addEventListener('click', () => { // >
        const tabId = tabBtn.getAttribute('data-id'); // >

        // Remover la clase 'active' de todos los botones y paneles dentro de este contenedor
        tabButtons.forEach((btn) => btn.classList.remove('active')); // >
        tabContents.forEach((content) => content.classList.remove('active')); // >

        // Agregar la clase 'active' al botón y panel correspondiente
        tabBtn.classList.add('active'); // >
        container.querySelector(`#${tabId}`).classList.add('active'); // >

        // Mostrar u ocultar los botones "Más info" según la pestaña activa
        if (tabId === 'mensual') { // >
          masInfoA.classList.add('active'); // >
          masInfoB.classList.remove('active'); // >
        } else if (tabId === 'anual') { // >
          masInfoA.classList.remove('active'); // >
          masInfoB.classList.add('active'); // >
        } // >
      }); // >
    }); // >

    // Mostrar el botón "Más info" correspondiente a la pestaña activa por defecto
    const activeTab = container.querySelector('.xy-tabs__panels.active').id;
    if (activeTab === 'mensual') {
      masInfoA.classList.add('active');
    } else if (activeTab === 'anual') {
      masInfoB.classList.add('active');
    }
  }

  // Función para manejar los modales
  function setupModals() {
    const masInfoButtons = document.querySelectorAll('.mas-info');
    const closeModalButtons = document.querySelectorAll('.close-modal');

    // Abrir modal
    masInfoButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const modalId = button.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        if (modal) {
          modal.style.display = 'flex';
        }
      });
    });

    // Cerrar modal
    closeModalButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        if (modal) {
          modal.style.display = 'none';
        }
      });
    });

    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener('click', (event) => {
      if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
      }
    });
  }

  // Aplicar la lógica de pestañas y modales a cada contenedor
  tabContainers.forEach((container) => {
    setupTabs(container); // Configurar pestañas para este contenedor
  });
  setupModals(); // Configurar modales

  ////////////// y aquí el código para los acordeones de las pestañas de la app de precios ////////////////////////
  let titles = document.querySelectorAll('.title');
  for (let i = 0; i < titles.length; i++) {
    titles[i].onclick = function () {
      this.classList.toggle('active');
      let box = this.nextElementSibling;
      if (box.style.maxHeight) {
        box.style.maxHeight = null;
      } else {
        box.style.maxHeight = box.scrollHeight + 'px';
      }
      for (let j = 0; j < titles.length; j++) {
        if (titles[j] !== this) {
          titles[j].classList.remove('active');
          titles[j].nextElementSibling.style.maxHeight = null;
        }
      }
    };
  }

}
// \\\\\\ ACABA EL CÓDIGO DE LAS TABS pestañas  PARA SELECCIONAR PLANES EN LA APP DE PRECIOS \\\\\\\\\\\\\\\\\\\
  ////////////////////  ACABA EL CÓDIGO DEL ACORDEON EN EL MENU MOBILE ////////////////////////////////
  // codigo para ordenar y filtrar los trasteros en la app de precios
  if (document.getElementById("xy-sort-filter-prices-app")) {
    // Configuración de acordeones
    function setupAccordion(triggerClass) {
      const triggers = document.querySelectorAll(`.${triggerClass}`);

      triggers.forEach(trigger => {
        trigger.addEventListener('click', function () {
          // Toggle el acordeón clickeado
          this.classList.toggle('active');
          const box = this.nextElementSibling;

          if (this.classList.contains('active')) {
            box.style.maxHeight = (box.scrollHeight + 5) + 'px';
          } else {
            box.style.maxHeight = null;
          }

          // Cerrar otros acordeones del mismo tipo
          triggers.forEach(t => {
            if (t !== this) {
              t.classList.remove('active');
              t.nextElementSibling.style.maxHeight = null;
            }
          });
        });
      });
    }

    // Inicializar acordeones
    setupAccordion('trigger_BB321');
    setupAccordion('trigger_BB322');

    // Función para ordenar
    window.displayRadioValueS = function () {
      const selectedValue = document.querySelector('input[name="products"]:checked').value;
      const resultContainer = document.getElementById('resultS');

      // Ocultar todos los resultados primero
      document.querySelectorAll('.result-item').forEach(el => {
        el.style.display = 'none';
      });

      // Mostrar el seleccionado
      const selectedResult = document.querySelector(`.${selectedValue}`);
      if (selectedResult) {
        selectedResult.style.display = 'block';
        resultContainer.innerHTML = `Ordenado por: ${selectedResult.querySelector('h2').textContent}`;
      }

      // Cerrar el acordeón
      document.querySelector('.trigger_BB321').classList.remove('active');
      document.querySelector('.trigger_BB321').nextElementSibling.style.maxHeight = null;

      // Scroll suave al resultado
      selectedResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    window.displayRadioValueF = function () {
      const selectedValue = document.querySelector('input[name="planta"]:checked').value;
      const resultContainer = document.getElementById('resultF');

      // Ocultar TODOS los elementos primero (tanto v_P0 como v_P1)
      document.querySelectorAll('.v_P0, .v_P1').forEach(el => {
        el.style.display = 'none';
      });

      // Mostrar según selección
      if (selectedValue === 'todas') {
        // Mostrar ambos
        document.querySelectorAll('.v_P0, .v_P1').forEach(el => {
          el.style.display = 'block';
        });
        resultContainer.innerHTML = 'Mostrando todas las plantas';
      } else {
        // Mostrar SOLO el seleccionado (ocultando el otro automáticamente)
        document.querySelectorAll(`.${selectedValue}`).forEach(el => {
          el.style.display = 'block';
        });
        resultContainer.innerHTML = `Filtrado por: ${selectedValue === 'v_P0' ? 'Planta 0' : 'Planta 1'}`;
      }

      // Ocultar resultados de ordenación cuando se aplica un filtro
      document.querySelectorAll('.v_S_ab, .v_S_ba, .v_P_ab, .v_P_ba').forEach(el => {
        el.style.display = 'none';
      });

      // Cerrar el acordeón
      document.querySelector('.trigger_BB322').classList.remove('active');
      document.querySelector('.trigger_BB322').nextElementSibling.style.maxHeight = null;

      // Scroll suave a los resultados
      setTimeout(() => {
        const firstVisible = document.querySelector('.result-item[style="display: block;"]');
        if (firstVisible) {
          firstVisible.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 300);
    };

    // Inicializar con un valor por defecto
    document.querySelector('input[name="products"][value="v_P_ab"]').checked = true;
    displayRadioValueS(); // Mostrar el primer resultado por defecto
    document.querySelector('input[name="planta"][value="todas"]').checked = true;
    displayRadioValueS(); // Mostrar el primer resultado por defecto
  }
  // codigo para ordenar y filtrar los trasteros en la app de precios hasta aquí
  // codigo para ordenar y filtrar los trasteros en la app de precios
  if (document.getElementById("xy-sort-prices-app")) {
    // Configuración de acordeones
    function setupAccordion(triggerClass) {
      const triggers = document.querySelectorAll(`.${triggerClass}`);

      triggers.forEach(trigger => {
        trigger.addEventListener('click', function () {
          // Toggle el acordeón clickeado
          this.classList.toggle('active');
          const box = this.nextElementSibling;

          if (this.classList.contains('active')) {
            box.style.maxHeight = (box.scrollHeight + 5) + 'px';
          } else {
            box.style.maxHeight = null;
          }

          // Cerrar otros acordeones del mismo tipo
          triggers.forEach(t => {
            if (t !== this) {
              t.classList.remove('active');
              t.nextElementSibling.style.maxHeight = null;
            }
          });
        });
      });
    }

    // Inicializar acordeones (solo mantenemos el necesario para ordenar)
    setupAccordion('trigger_BB321');

    // Función para ordenar (versión simplificada)
    window.displayRadioValueS = function () {
      const selectedValue = document.querySelector('input[name="products"]:checked').value;
      const resultContainer = document.getElementById('resultS');

      // Ocultar todos los resultados primero
      document.querySelectorAll('.result-item').forEach(el => {
        el.style.display = 'none';
      });

      // Mostrar el seleccionado
      const selectedResult = document.querySelector(`.${selectedValue}`);
      if (selectedResult) {
        selectedResult.style.display = 'block';
        resultContainer.innerHTML = `Ordenado por: ${selectedResult.querySelector('h2').textContent}`;
      }

      // Cerrar el acordeón
      document.querySelector('.trigger_BB321').classList.remove('active');
      document.querySelector('.trigger_BB321').nextElementSibling.style.maxHeight = null;

      // Scroll suave al resultado
      selectedResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    // Inicializar con un valor por defecto
    document.querySelector('input[name="products"][value="v_P_ab"]').checked = true;
    displayRadioValueS(); // Mostrar el primer resultado por defecto
}
  //////////////////////////////////////////////
  //////////////////////////////////////////////
  ///////////////////////////////////////////////
  ///////////////////////////////////////////////
if (document.getElementById("app-multi-selector-segmento-contra-centro")) {
// Función principal para inicializar cada selector
function initializeSelector(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // ========== FUNCIONES INTERNAS ========== //
  
  // Construye la ruta relativa según la profundidad del directorio
  function buildRelativePath(category, selectedValue) {
    let currentPath = window.location.pathname;
    if (currentPath.endsWith('/')) currentPath = currentPath.slice(0, -1);
    const pathSegments = currentPath.split('/').filter(segment => segment !== '');
    const depth = pathSegments.length;
    let relativePath = depth > 0 ? '../' : '';
    return `${relativePath}alquiler-${category}/${selectedValue}`;
  }

  // Muestra/oculta los divs según la selección
  function toggleDiv(selectedClass) {
    const xcxcontentDivs = container.querySelectorAll(".xcxcontent-div");
    xcxcontentDivs.forEach((div) => {
      div.style.display = div.classList.contains(selectedClass) ? "flex" : "none";
    });
  }

  // Actualiza la URL del botón según la selección
  function updateButtonUrl(category) {
    const select = container.querySelector(`#${category}-select`);
    const button = container.querySelector(`#${category}-button`);
    
    if (!select || !button) return;
    
    const selectedValue = select.value;
    button.onclick = function() {
      if (!selectedValue) {
        showModal("Tienes que seleccionar un centro para continuar");
      } else {
        window.location.href = buildRelativePath(category, selectedValue);
      }
    };
  }

  // Verifica si se ha seleccionado una opción
  function checkSelection(category) {
    const select = container.querySelector(`#${category}-select`);
    const selectedValue = select.value;
    if (!selectedValue) {
      showModal("Tienes que seleccionar un centro para continuar");
    } else {
      window.location.href = buildRelativePath(category, selectedValue);
    }
  }

  // Muestra el modal con mensaje personalizado
  function showModal(message) {
    const modal = container.querySelector(".xmxmodal");
    const modalMessage = container.querySelector(".xmxmodal-message");
    if (modal && modalMessage) {
      modalMessage.textContent = message;
      modal.style.display = "flex";
    }
  }

  // Cierra todos los modales del contenedor
  function xcxcloseModal() {
    const modals = container.querySelectorAll(".xmxmodal");
    modals.forEach(modal => modal.style.display = "none");
  }

  // ========== ASIGNACIÓN DE EVENTOS ========== //

  // Eventos para los radio buttons
  container.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener('click', () => toggleDiv(radio.value));
  });

  // Eventos para los selects
  container.querySelectorAll('select[id$="-select"]').forEach(select => {
    const category = select.id.replace('-select', '');
    select.addEventListener('change', () => updateButtonUrl(category));
  });

  // Eventos para los botones
  container.querySelectorAll('button[id$="-button"]').forEach(button => {
    const category = button.id.replace('-button', '');
    button.addEventListener('click', () => checkSelection(category));
  });

  // Eventos para cerrar modales
  container.querySelectorAll('.xcxclose').forEach(closeBtn => {
    closeBtn.addEventListener('click', xcxcloseModal);
  });

  // Cerrar modal al hacer clic fuera
  container.addEventListener('click', function(event) {
    const modals = container.querySelectorAll(".xmxmodal");
    modals.forEach(modal => {
      if (event.target === modal) modal.style.display = "none";
    });
  });

  // Inicializar el primer radio button como seleccionado
  // const defaultRadio = container.querySelector('input[type="radio"]:checked');
  // if (defaultRadio) toggleDiv(defaultRadio.value);

    // ===== NUEVO: Seleccionar "trasteros-particulares" por defecto ===== //
    const defaultRadio = container.querySelector('input[type="radio"][value="trasteros-particulares"]');
    if (defaultRadio) {
      defaultRadio.checked = true; // Marcar el radio
      toggleDiv('trasteros-particulares'); // Mostrar su contenido asociado
    }

  
}

// ========== INICIALIZACIÓN DE SELECTORES ========== //
document.addEventListener('DOMContentLoaded', function() {
  // Inicializa cada selector (debes usar los IDs reales de tus contenedores)
  initializeSelector('app-multi-selector-segmento-contra-centro-1');
  initializeSelector('app-multi-selector-segmento-contra-centro-2');
  initializeSelector('app-multi-selector-segmento-contra-centro-3');
  
  // Si necesitas mantener compatibilidad con el selector original:
  // if (document.getElementById("app-selector-segmento-contra-centro")) {
  //   initializeSelector("app-selector-segmento-contra-centro");
  // }
});  
}
  //////////////////////////////////////////////
  //////////////////////////////////////////////
  ///////////////////////////////////////////////
  ///////////////////////////////////////////////


// codigo para ordenar y filtrar los trasteros en la app de precios hasta aquí
// codigo para ordenar y filtrar los trasteros en la app de precios hasta aquí
if (document.getElementById("app-selector-segmento-contra-centro")) {
  // codigo app selector entre 18 opciones segmentos x 3 opciones de productos
  function toggleDiv(selectedClass) {
    const xcxcontentDivs = document.querySelectorAll(".xcxcontent-div");
    xcxcontentDivs.forEach((div) => {
      if (div.classList.contains(selectedClass)) {
        div.style.display = "flex";
      } else {
        div.style.display = "none";
      }
    });
  }

  // Función para construir la ruta relativa correcta según la profundidad del directorio
  function buildRelativePath(category, selectedValue) {
    // Obtener la ruta actual
    let currentPath = window.location.pathname;

    // Normalizar la ruta (eliminar / final si existe)
    if (currentPath.endsWith('/')) {
      currentPath = currentPath.slice(0, -1);
    }

    // Contar cuántos niveles de directorio hay
    const pathSegments = currentPath.split('/').filter(segment => segment !== '');
    const depth = pathSegments.length;

    // Construir la ruta relativa
    let relativePath = '';
    // Si estamos en la raíz (depth = 0), no necesitamos '../'
    // Si estamos en un subdirectorio, necesitamos subir un nivel
    if (depth > 0) {
      relativePath = '../';
    }

    const finalPath = `${relativePath}alquiler-${category}/${selectedValue}`;
    
    // Debug: mostrar información en consola
    console.log('Debug buildRelativePath:');
    console.log('Current path:', currentPath);
    console.log('Path segments:', pathSegments);
    console.log('Depth:', depth);
    console.log('Category:', category);
    console.log('Selected value:', selectedValue);
    console.log('Final path:', finalPath);
    
    return finalPath;
  }

  function updateButtonUrl(category) {
    console.log('updateButtonUrl called with category:', category);
    const select = document.getElementById(`${category}-select`);
    const button = document.getElementById(`${category}-button`);
    
    if (!select || !button) {
      console.error('Select or button not found for category:', category);
      return;
    }
    
    const selectedValue = select.value;
    console.log('Selected value:', selectedValue);
    
    button.onclick = function () {
      if (selectedValue === "") {
        showModal("Tienes que seleccionar un centro para continuar");
      } else {
        const finalUrl = buildRelativePath(category, selectedValue);
        console.log('Navigating to:', finalUrl);
        window.location.href = finalUrl;
      }
    };
  }

  function checkSelection(category) {
    const select = document.getElementById(`${category}-select`);
    const selectedValue = select.value;
    if (selectedValue === "") {
      if (category === "trasteros-particulares") {
        showCenterModal();
      } else {
        showModal("Tienes que seleccionar un centro para continuar");
      }
    } else {
      window.location.href = buildRelativePath(category, selectedValue);
    }
  }

  function showInitialModal() {
    showModal("Para continuar escoge si eres particular, autónomo o empresa");
  }

  function showModal(message) {
    const xmxmodal = document.getElementById("myModal");
    const xmxmodalMessage = document.getElementById("xmxmodal-message");
    xmxmodalMessage.textContent = message;
    xmxmodal.style.display = "flex";
  }

  function showCenterModal() {
    const xmxmodal = document.getElementById("centerModal");
    xmxmodal.style.display = "flex";
  }

  function xcxcloseModal() {
    const xmxmodals = document.querySelectorAll(".xmxmodal");
    xmxmodals.forEach((xmxmodal) => {
      xmxmodal.style.display = "none";
    });
  }

  window.onclick = function (event) {
    const xmxmodals = document.querySelectorAll(".xmxmodal");
    xmxmodals.forEach((xmxmodal) => {
      if (event.target == xmxmodal) {
        xmxmodal.style.display = "none";
      }
    });
  };
}
///////////////////
///////////////////
///////////////////

// código para el app selector segmento contra centro level 2
if (document.getElementById("app-selector-segmento-contra-centro-level-2")) {
  // codigo app selector entre 18 opciones segmentos x 3 opciones de productos
  function toggleDiv(selectedClass) {
    const xcxcontentDivs = document.querySelectorAll(".xcxcontent-div");
    xcxcontentDivs.forEach((div) => {
      if (div.classList.contains(selectedClass)) {
        div.style.display = "flex";
      } else {
        div.style.display = "none";
      }
    });
  }

  function updateButtonUrl(category) {
    const select = document.getElementById(`${category}-select`);
    const button = document.getElementById(`${category}-button`);
    const selectedValue = select.value;
    button.onclick = function () {
      if (selectedValue === "") {
        showModal("Tienes que seleccionar un centro para continuar");
      } else {
        // Redirige al usuario a una URL relativa que sube 2 niveles (..), 
        // luego va a la carpeta "alquiler-" + el valor de category (ej: "trasteros-particulares")
        // y finalmente al subdirectorio con el valor seleccionado del centro
        window.location.href = `../../alquiler-${category}/${selectedValue}`;
      }
    };
  }

  function checkSelection(category) {
    const select = document.getElementById(`${category}-select`);
    const selectedValue = select.value;
    if (selectedValue === "") {
      if (category === "trasteros-particulares") {
        showCenterModal();
      } else {
        showModal("Tienes que seleccionar un centro para continuar");
      }
    } else {
      // Redirige al usuario a una URL relativa que sube 2 niveles (..), luego va a la carpeta "alquiler-" + la categoría seleccionada (ej: "trasteros-particulares") y finalmente al subdirectorio con el valor del centro seleccionado
      window.location.href = `../../alquiler-${category}/${selectedValue}`;
    }
  }

  function showInitialModal() {
    showModal("Para continuar escoge si eres particular, autónomo o empresa");
  }

  function showModal(message) {
    const xmxmodal = document.getElementById("myModal");
    const xmxmodalMessage = document.getElementById("xmxmodal-message");
    xmxmodalMessage.textContent = message;
    xmxmodal.style.display = "flex";
  }

  function showCenterModal() {
    const xmxmodal = document.getElementById("centerModal");
    xmxmodal.style.display = "flex";
  }

  function xcxcloseModal() {
    const xmxmodals = document.querySelectorAll(".xmxmodal");
    xmxmodals.forEach((xmxmodal) => {
      xmxmodal.style.display = "none";
    });
  }

  window.onclick = function (event) {
    const xmxmodals = document.querySelectorAll(".xmxmodal");
    xmxmodals.forEach((xmxmodal) => {
      if (event.target == xmxmodal) {
        xmxmodal.style.display = "none";
      }
    });
  };
}

// solucionando con deepseek el problema del boton de contacto del footer que solo se cerraba con el trigger 
// nuevo mostrar contacto flotante 20251018 13h07 EB3 ---------------------------->
class FooterContact {
  constructor() {
    this.trigger = document.getElementById('trigger-contacto-footer');
    this.contactFooter = document.getElementById('contact-from-footer');
    
    if (!this.trigger || !this.contactFooter) return;
    
    this.init();
  }

  init() {
    // Evento para el trigger del FOOTER
    this.trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleContact();
    });

    // Evento para clicks en el documento - solo para el FOOTER
    document.addEventListener('click', (e) => {
      if (!this.isClickInsideFooterContact(e) && this.isOpen()) {
        this.close();
      }
    });
  }

  isOpen() {
    return this.contactFooter.style.display === 'flex';
  }

  toggleContact() {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.contactFooter.style.display = 'flex';
  }

  close() {
    this.contactFooter.style.display = 'none';
  }

  isClickInsideFooterContact(e) {
    return this.contactFooter.contains(e.target) || 
           this.trigger.contains(e.target);
  }
}

class FloatingContact {
  constructor() {
    this.trigger = document.getElementById('floating-contact-trigger');
    this.contactContent = document.getElementById('floating-contact-content');
    this.footer = document.querySelector('footer');
    this.container = document.querySelector('.xycontainer'); // Contenedor principal
    
    if (!this.trigger || !this.contactContent || !this.container) return;
    
    this.init();
    this.setupScrollListener();
    this.setupPositioning();
    this.setupResizeListener();
  }

  init() {
    // Evento para el trigger FLOTANTE
    this.trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleContact();
    });

    // Evento para clicks en el documento - solo para el FLOTANTE
    document.addEventListener('click', (e) => {
      if (!this.isClickInsideFloatingContact(e) && this.isOpen()) {
        this.close();
      }
    });
  }

  setupPositioning() {
    this.positionElements();
  }

  setupResizeListener() {
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.positionElements();
      }, 250);
    });
  }

  positionElements() {
    const containerRect = this.container.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    
    // Calcular la posición relativa al contenedor
    let rightPosition;
    
    if (containerRect.width >= 1280) {
      // Cuando el contenedor está en su máximo ancho (1280px)
      // o la ventana es más ancha que 1280px
      const containerRight = (viewportWidth - 1280) / 2 + 1280;
      rightPosition = viewportWidth - containerRight + 20; // 20px desde el borde derecho del contenedor
    } else {
      // Cuando el contenedor es más pequeño que 1280px
      rightPosition = 20; // 20px desde el borde derecho del viewport
    }
    
    // Aplicar posición al trigger
    this.trigger.style.right = `${rightPosition}px`;
    
    // Aplicar posición al contenido (alineado con el trigger)
    this.contactContent.style.right = `${rightPosition}px`;
    
    // Ajustar posición vertical del contenido si es necesario
    this.adjustContentVerticalPosition();
  }

  adjustContentVerticalPosition() {
    const triggerRect = this.trigger.getBoundingClientRect();
    const contentRect = this.contactContent.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Verificar si el contenido se sale por la parte superior
    if (contentRect.top < 0) {
      // Si el contenido se sale por arriba, posicionarlo debajo del trigger
      this.contactContent.style.bottom = `${viewportHeight - triggerRect.top + 10}px`;
    } else {
      // Posición normal (encima del trigger)
      this.contactContent.style.bottom = '140px';
    }
  }

  setupScrollListener() {
    let ticking = false;
    
    const checkFooterVisibility = () => {
      if (!this.footer) return;
      
      const footerRect = this.footer.getBoundingClientRect();
      const triggerRect = this.trigger.getBoundingClientRect();
      
      // Verificar si el footer está visible en la ventana
      const footerInView = footerRect.top < window.innerHeight && footerRect.bottom > 0;
      
      // Verificar si el trigger se superpone con el footer
      const triggerOverFooter = triggerRect.bottom > footerRect.top;
      
      if (footerInView && triggerOverFooter) {
        this.trigger.classList.add('hidden');
        this.close(); // Cerrar el contenido si está abierto
      } else {
        this.trigger.classList.remove('hidden');
      }
      
      // Re-posicionar en cada scroll (por si el layout cambia)
      this.positionElements();
      
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(checkFooterVisibility);
        ticking = true;
      }
    });

    // Verificar al cargar la página
    checkFooterVisibility();
  }

  isOpen() {
    return this.contactContent.classList.contains('show');
  }

  toggleContact() {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.contactContent.classList.add('show');
    // Re-posicionar al abrir por si hubo cambios
    this.positionElements();
  }

  close() {
    this.contactContent.classList.remove('show');
  }

  isClickInsideFloatingContact(e) {
    return this.contactContent.contains(e.target) || 
           this.trigger.contains(e.target);
  }
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  new FooterContact(); // Sistema del footer
  new FloatingContact(); // Sistema flotante
});
// //fin nuevo mostrar contacto flotante 20251018 EB3 ---------------------------->
// //acaba solucionando con deepseek el problema del boton de contacto del footer que solo se cerraba con el trigger






document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("xy-modals-1")) {
    var xmodalBtns = [...document.querySelectorAll(".x3xmodal-toggle")];
    xmodalBtns.forEach(function (btn) {
      btn.onclick = function () {
        var x3xmodal = btn.getAttribute("data-x3xmodal");
        document.getElementById(x3xmodal).style.display = "flex";
      };
    });

    var x3xcloseBtns = [...document.querySelectorAll(".x3xmodal-close")];
    x3xcloseBtns.forEach(function (btn) {
      btn.onclick = function () {
        var x3xmodal = btn.closest(".x3xmodal");
        x3xmodal.style.display = "none";
      };
    });

    window.onclick = function (event) {
      console.log(event);
      if (event.target.className === "x3xmodal") {
        event.target.style.display = "none";
      }
    };

    const modals = document.querySelectorAll(".x3xmodal");
    const closeButtons = document.querySelectorAll(".x3xmodal-close");

    closeButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const modal = this.closest(".x3xmodal");
        modal.style.display = "none";

        // Detener el video de YouTube
        const iframe = modal.querySelector("iframe");
        if (iframe) {
          const iframeSrc = iframe.src;
          iframe.src = iframeSrc; // Reiniciar el src del iframe para detener el video
        }
      });
    });

    const triggers = document.querySelectorAll(".x3xmodal-toggle");
    triggers.forEach((trigger) => {
      trigger.addEventListener("click", function () {
        const modalId = this.getAttribute("data-x3xmodal");
        const modal = document.getElementById(modalId);
        if (modal) {
          modal.style.display = "flex";
        }
      });
    });
    const iframes = document.querySelectorAll("iframe");

    if (window.innerWidth >= 600) {
      iframes.forEach((iframe) => {
        iframe.style.width = "100%";
        iframe.style.height = "315px"; // Puedes ajustar la altura según tus necesidades
        iframe.style.maxWidth = "560px"; // Puedes ajustar el ancho máximo según tus necesidades
        iframe.style.border = "none"; // Elimina el borde del iframe
      });
    }
  }
  ///////////////////////////////////////
  
  //////////////////////////////////////
});




//// codigo para el mapa cen1///
if (document.getElementById("xy-map-v1")) {
  // Initialize the map
  var map = L.map("xy-map-v1").setView([41.35355, 2.09637], 15); // Coordinates for Barcelona, Spain

  // Add the OpenStreetMap tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Add a marker for Barcelona
  L.marker([41.35355, 2.09637])
    .addTo(map)
    .bindPopup("Trastering Cornellà - Hospitalet")
    .openPopup();
}
if (document.getElementById("xy-map-v2")) {
  // Initialize the map
  var map = L.map("xy-map-v2").setView([41.51406,2.19830], 15); // Coordinates for Barcelona, Spain

  // Add the OpenStreetMap tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Add a marker for Barcelona
  L.marker([41.51406,2.19830])
    .addTo(map)
    .bindPopup("Trastering La Llagosta")
    .openPopup();
}
/// hasta aqui el codigo para el mapa  cen6//
//// codigo para el mapa xy-map-v2x2 dentro de acordeon z01y01  ///
if (document.getElementById("xy-map-v2x2")) {
  // Initialize the map
  var map = L.map("xy-map-v2x2").setView([41.35355, 2.09637], 14); // Coordinates for Barcelona, Spain

  // Add the OpenStreetMap tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Add a marker for Barcelona
  L.marker([41.35355, 2.09637]).addTo(map).bindPopup("Trastering").openPopup();
}
/// hasta aqui el codigo para el mapa xy-map-vicalvaro-accordeon dentro de acordeon y01y01  //
//// codigo para el mapa xy-map-v2x2 dentro de acordeon z01y01  ///
if (document.getElementById("xy-map-vicalvaro-accordeon")) {
  // Initialize the map
  var map = L.map("xy-map-vicalvaro-accordeon").setView([41.35355, 2.09637], 14); // Coordinates for Barcelona, Spain

  // Add the OpenStreetMap tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Add a marker for Barcelona
  L.marker([41.35355, 2.09637]).addTo(map).bindPopup("Trastering").openPopup();
}

/// hasta aqui el codigo para el mapa xy-map-v2x2 dentro de acordeon y01y01  //
//// codigo para el mapa cen6///
if (document.getElementById("xy-map-v3")) {
  // Initialize the map
  var map = L.map("xy-map-v3").setView([41.29800,2.01400], 15); // Coordinates for Barcelona, Spain

  // Add the OpenStreetMap tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Add a marker for Barcelona
  L.marker([41.29800,2.01400])
    .addTo(map)
    .bindPopup("Trastering Gavà - Castelldefels")
    .openPopup();
}
if (document.getElementById("xy-map-v4")) {
  // Initialize the map
  var map = L.map("xy-map-v4").setView([41.23272,1.73926], 15); // Coordinates for Barcelona, Spain

  // Add the OpenStreetMap tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Add a marker for Barcelona
  L.marker([41.23272,1.73926])
    .addTo(map)
    .bindPopup("Trastering Vilanova - Sant Pere de Ribes")
    .openPopup();
}
//// codigo para el mapa cen6///
if (document.getElementById("xy-map-v6")) {
  // Initialize the map
  var map = L.map("xy-map-v6").setView([41.5323174, 2.4286733], 15); // Coordinates for Barcelona, Spain

  // Add the OpenStreetMap tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Add a marker for Barcelona
  L.marker([41.5323174, 2.4286733])
    .addTo(map)
    .bindPopup("Trastering Mataró - Maresme")
    .openPopup();
}
/// hasta aqui el codigo para el mapa cen6 //
//// codigo para el mapa cen9///
if (document.getElementById("xy-map-v9")) {
  // Initialize the map
  var map = L.map("xy-map-v9").setView([40.397771, -3.589444], 15); // Coordinates for Barcelona, Spain

  // Add the OpenStreetMap tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Add a marker for Barcelona
  L.marker([40.397771, -3.589444])
    .addTo(map)
    .bindPopup("Trastering Vicálvaro - Madrid")
    .openPopup();
}
/// hasta aqui el codigo para el mapa cen6 //


//// codigo para el mapa cenMostoles///
if (document.getElementById("xy-map-vMostoles")) {
  // Initialize the map
  var map = L.map("xy-map-vMostoles").setView([40.3122190, -3.8473610], 17); // Coordinates for Barcelona, Spain

  // Add the OpenStreetMap tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Add a marker for Barcelona
  L.marker([40.3122190, -3.8473610])
    .addTo(map)
    .bindPopup("Trastering")
    .openPopup();
}
/// hasta aqui el codigo para el mapa cenMostoles //

//// codigo para el mapa cenFuenlabrada/// 40.27135947248638, -3.7687101754430365
if (document.getElementById("xy-map-vFuenlabrada")) {
  // Initialize the map
  var map = L.map("xy-map-vFuenlabrada").setView([40.27135947248638, -3.7687101754430365], 17); // Coordinates for Barcelona, Spain

  // Add the OpenStreetMap tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Add a marker for Trastering Fuenlabrada - Getafe
  L.marker([40.27135947248638, -3.7687101754430365])
    .addTo(map)
    .bindPopup("Trastering")
    .openPopup();
}
/// hasta aqui el codigo para el mapa cenFuenlabrada //


//// codigo para el mapa barcelona provincia///
if (document.getElementById("xy-map-barcelona-provincia")) {
  function myFunction(x) {
    if (x.matches) { // If media query matches
      mapzd = 8;
    } else {
        mapzd = 10;
    }
  }
  
  // Create a MediaQueryList object
  var x = window.matchMedia("(max-width: 1080px)")
  
  // Call listener function at run time
  myFunction(x);
  
  // Attach listener function on state changes
  x.addEventListener("change", function() {
    myFunction(x);
  });


    var mapping = L.map('mapping').setView([41.35355,2.09637],mapzd);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapping);

    var LeafIcon = L.Icon.extend({
        options: {
            iconAnchor:   [13.5, 42], // Ajustado para que el punto de anclaje esté en la punta del pin
            popupAnchor:  [0, -42] // Ajustado para que el popup aparezca encima del pin
        }
    })

    const pinSvg = 'data:image/svg+xml;base64,' + btoa('<svg width="27" height="42" viewBox="0 0 27 42" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 0C20.9558 0 27 6.04416 27 13.5C27 20.9558 13.5 42 13.5 42C13.5 42 0 20.9558 0 13.5C0 6.04416 6.04416 0 13.5 0ZM13.5 5C8.80558 5 5 8.80558 5 13.5C5 18.1944 8.80558 22 13.5 22C18.1944 22 22 18.1944 22 13.5C22 8.80558 18.1944 5 13.5 5Z" fill="#FF0000"/></svg>');

    var corneIcon = new LeafIcon({iconUrl: pinSvg});
    var gavaiIcon = new LeafIcon({iconUrl: pinSvg});
    var llagoIcon = new LeafIcon({iconUrl: pinSvg});
    var matarIcon = new LeafIcon({iconUrl: pinSvg});
    var vilanIcon = new LeafIcon({iconUrl: pinSvg});

    var mCorne = L.marker([41.35355,2.09637], {icon: corneIcon}).bindPopup('<div class="leafletPopupInfo"><h4>Trastering Cornellà - Hospitalet</h4><a href="https://www.google.es/maps/place/C.+del+Cobalt,+49,+08940+Cornell%C3%A0+de+Llobregat,+Barcelona/@41.3537563,2.0916031,17z/data=!3m1!4b1!4m6!3m5!1s0x12a4992530c73f99:0x970eccf1eb237029!8m2!3d41.3537524!4d2.0964794!16s%2Fg%2F11c0yx9nbc?entry=ttu" target="_blank" class="exch-link">Carrer del Cobalt, 49, 08940 <br>Cornellà de Llobregat</a></div>').addTo(mapping);

    var mGavai = L.marker([41.29800,2.01400], {icon: gavaiIcon}).bindPopup('<div class="leafletPopupInfo"><h4>Trastering Gavà - Castelldefels</h4><a href="https://www.google.es/maps/place/Carrer+de+la+M%C3%A0quina,+32,+08850+Gav%C3%A0,+Barcelona/@41.2973983,2.0135218,305m/data=!3m2!1e3!4b1!4m6!3m5!1s0x12a49d1b97dc0faf:0x8563ecb7b70f24ed!8m2!3d41.2973983!4d2.0141669!16s%2Fg%2F11c27z0pfh?entry=ttu" target="_blank" class="exch-link">Carrer de la Màquina, 32 08850 Gavà (Barcelona) </a></div>').addTo(mapping);


    var mLlago = L.marker([41.51406,2.19830], {icon: llagoIcon}).bindPopup('<div class="leafletPopupInfo"><h4>Llagosta-Mollet del Vallès</h4><a href="https://www.google.es/maps/place/Carrer+de+Barcelona,+12,+08120+La+Llagosta,+Barcelona/@41.51392,2.1974009,18.24z/data=!4m6!3m5!1s0x12a4be9147097eff:0x5cf8e0d523bd0b02!8m2!3d41.5141919!4d2.1982941!16s%2Fg%2F11c24xmjz9?entry=ttu" target="_blank" class="exch-link">Carrer de Barcelona, 12 08120 <br>La llagosta</a></div>').addTo(mapping);


    var mMatar = L.marker([41.58221,2.42888], {icon: matarIcon}).bindPopup('<div class="leafletPopupInfo"><h4>Trastering Mataro - Maresme</h4><a href="https://www.google.es/maps/place/Carrer+Serra+i+Moret,+26,+08302+Matar%C3%B3,+Barcelona/@41.5322914,2.4274176,18z/data=!3m1!4b1!4m6!3m5!1s0x12a4b4fcf13a1187:0x3f66cf30c1058c5e!8m2!3d41.5322894!4d2.4287077!16s%2Fg%2F11rj3x1qnw?entry=ttu" target="_blank" class="exch-link">Carrer Serra i Moret, 26 08302 Mataró</a></div>').addTo(mapping);
    
    var mVilan = L.marker([41.23272,1.73926], {icon: vilanIcon}).bindPopup('<div class="leafletPopupInfo"><h4>Vilanova-Sant Pere de Ribes</h4><a href="https://www.google.es/maps/place/Ronda+Ib%C3%A8rica,+7,+08800+Vilanova+i+la+Geltr%C3%BA,+Barcelona/@41.232666,1.7385354,19z/data=!4m6!3m5!1s0x12a38721c03b3ca1:0x6f68f427b4805b72!8m2!3d41.232666!4d1.7391845!16s%2Fg%2F11cs8fzgmm?entry=ttu" target="_blank" class="exch-link">Ronda Ibèrica, 7 08880 Vilanova i la Geltrú</a></div>').addTo(mapping);
    
}
/// hasta aqui el codigo para el mapa provincia barcelona 5 centros //



//// codigo para el mapa barcelona provincia///
if (document.getElementById("xy-map-barcelona-provincia-mobile")) {
  function myFunction(x) {
    if (x.matches) { // If media query matches
      mapzdmobile = 8;
    } else {
        mapzdmobile = 10;
    }
  }
  
  // Create a MediaQueryList object
  var x = window.matchMedia("(max-width: 780px)")
  
  // Call listener function at run time
  myFunction(x);
  
  // Attach listener function on state changes
  x.addEventListener("change", function() {
    myFunction(x);
  });


    var mappingmobile = L.map('mappingmobile').setView([41.35355,2.09637],mapzdmobile);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mappingmobile);

    var LeafIconmobile = L.Icon.extend({
        options: {
            iconAnchor:   [13.5, 42],
            popupAnchor:  [0, -42]
        }
    })

    const pinSvgMobile = 'data:image/svg+xml;base64,' + btoa('<svg width="27" height="42" viewBox="0 0 27 42" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 0C20.9558 0 27 6.04416 27 13.5C27 20.9558 13.5 42 13.5 42C13.5 42 0 20.9558 0 13.5C0 6.04416 6.04416 0 13.5 0ZM13.5 5C8.80558 5 5 8.80558 5 13.5C5 18.1944 8.80558 22 13.5 22C18.1944 22 22 18.1944 22 13.5C22 8.80558 18.1944 5 13.5 5Z" fill="#FF0000"/></svg>');

    var corneIconmobile = new LeafIcon({iconUrl: pinSvgMobile});
    var gavaiIconmobile = new LeafIcon({iconUrl: pinSvgMobile});
    var llagoIconmobile = new LeafIcon({iconUrl: pinSvgMobile});
    var matarIconmobile = new LeafIcon({iconUrl: pinSvgMobile});
    var vilanIconmobile = new LeafIcon({iconUrl: pinSvgMobile});

    var mCornemobile = L.marker([41.35355,2.09637], {icon: corneIconmobile}).bindPopup('<div class="leafletPopupInfo"><h4>Trastering Cornellà - Hospitalet</h4><a href="https://www.google.es/maps/place/C.+del+Cobalt,+49,+08940+Cornell%C3%A0+de+Llobregat,+Barcelona/@41.3537563,2.0916031,17z/data=!3m1!4b1!4m6!3m5!1s0x12a4992530c73f99:0x970eccf1eb237029!8m2!3d41.3537524!4d2.0964794!16s%2Fg%2F11c0yx9nbc?entry=ttu" target="_blank" class="exch-link">Carrer del Cobalt, 49, 08940 <br>Cornellà de Llobregat</a></div>').addTo(mappingmobile);

    var mGavaimobile = L.marker([41.29800,2.01400], {icon: gavaiIconmobile}).bindPopup('<div class="leafletPopupInfo"><h4>Trastering Gavà - Castelldefels</h4><a href="https://www.google.es/maps/place/Carrer+de+la+M%C3%A0quina,+32,+08850+Gav%C3%A0,+Barcelona/@41.2973983,2.0135218,305m/data=!3m2!1e3!4b1!4m6!3m5!1s0x12a49d1b97dc0faf:0x8563ecb7b70f24ed!8m2!3d41.2973983!4d2.0141669!16s%2Fg%2F11c27z0pfh?entry=ttu" target="_blank" class="exch-link">Carrer de la Màquina, 32 08850 Gavà (Barcelona) </a></div>').addTo(mappingmobile);


    var mLlagomobile = L.marker([41.51406,2.19830], {icon: llagoIconmobile}).bindPopup('<div class="leafletPopupInfo"><h4>Llagosta-Mollet del Vallès</h4><a href="https://www.google.es/maps/place/Carrer+de+Barcelona,+12,+08120+La+Llagosta,+Barcelona/@41.51392,2.1974009,18.24z/data=!4m6!3m5!1s0x12a4be9147097eff:0x5cf8e0d523bd0b02!8m2!3d41.5141919!4d2.1982941!16s%2Fg%2F11c24xmjz9?entry=ttu" target="_blank" class="exch-link">Carrer de Barcelona, 12 08120 <br>La llagosta</a></div>').addTo(mappingmobile);


    var mMatarmobile = L.marker([41.58221,2.42888], {icon: matarIconmobile}).bindPopup('<div class="leafletPopupInfo"><h4>Trastering Mataro - Maresme</h4><a href="https://www.google.es/maps/place/Carrer+Serra+i+Moret,+26,+08302+Matar%C3%B3,+Barcelona/@41.5322914,2.4274176,18z/data=!3m1!4b1!4m6!3m5!1s0x12a4b4fcf13a1187:0x3f66cf30c1058c5e!8m2!3d41.5322894!4d2.4287077!16s%2Fg%2F11rj3x1qnw?entry=ttu" target="_blank" class="exch-link">Carrer Serra i Moret, 26 08302 Mataró</a></div>').addTo(mappingmobile);
    
    var mVilanmobile = L.marker([41.23272,1.73926], {icon: vilanIconmobile}).bindPopup('<div class="leafletPopupInfo"><h4>Vilanova-Sant Pere de Ribes</h4><a href="https://www.google.es/maps/place/Ronda+Ib%C3%A8rica,+7,+08800+Vilanova+i+la+Geltr%C3%BA,+Barcelona/@41.232666,1.7385354,19z/data=!4m6!3m5!1s0x12a38721c03b3ca1:0x6f68f427b4805b72!8m2!3d41.232666!4d1.7391845!16s%2Fg%2F11cs8fzgmm?entry=ttu" target="_blank" class="exch-link">Ronda Ibèrica, 7 08880 Vilanova i la Geltrú</a></div>').addTo(mappingmobile);
    
}
/// hasta aqui el codigo para el mapa provincia barcelona 5 centros //




//// codigo para el mapa xy-map-v2x2 dentro de acordeon y01y01  ///
if (document.getElementById("xy-map-v2x2v1")) {
  // Initialize the map
  var map = L.map("xy-map-v2x2v1").setView([41.35355,2.09637], 14); // Coordinates for Barcelona, Spain

  // Add the OpenStreetMap tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Add a marker for Barcelona
  L.marker([41.35355,2.09637]).addTo(map).bindPopup("Trastering Gavà").openPopup();
}
if (document.getElementById("xy-map-v2x2v2")) {
  // Initialize the map
  var map = L.map("xy-map-v2x2v2").setView([41.51406,2.19830], 14); // Coordinates for Barcelona, Spain

  // Add the OpenStreetMap tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Add a marker for Barcelona
  L.marker([41.51406,2.19830]).addTo(map).bindPopup("Trastering Llagosta").openPopup();
}
if (document.getElementById("xy-map-v2x2v3")) {
  // Initialize the map
  var map = L.map("xy-map-v2x2v3").setView([41.29800,2.01400], 14); // Coordinates for Barcelona, Spain

  // Add the OpenStreetMap tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Add a marker for Barcelona
  L.marker([41.29800,2.01400]).addTo(map).bindPopup("Trastering Gavà Castelldefels").openPopup();
}
if (document.getElementById("xy-map-v2x2v4")) {
  // Initialize the map
  var map = L.map("xy-map-v2x2v4").setView([41.23272,1.73926], 14); // Coordinates for Barcelona, Spain

  // Add the OpenStreetMap tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Add a marker for Barcelona
  L.marker([41.23272,1.73926]).addTo(map).bindPopup("Trastering Vilanova i la Geltrú").openPopup();
}
if (document.getElementById("xy-map-v2x2v6")) {
  // Initialize the map
  var map = L.map("xy-map-v2x2v6").setView([41.5323174, 2.4286733], 14); // Coordinates for Barcelona, Spain

  // Add the OpenStreetMap tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Add a marker for Barcelona
  L.marker([41.5323174, 2.4286733]).addTo(map).bindPopup("Trastering").openPopup();
}
//// codigo para el mapa xy-map-v2x2 dentro de acordeon y01y01  ///
if (document.getElementById("xy-map-v2x2v9")) {
  // Initialize the map
  var map = L.map("xy-map-v2x2v9").setView([40.397771, -3.589444], 14); // Coordinates for Vicalvaro Madrid, Spain

  // Add the OpenStreetMap tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Add a marker for Barcelona
  L.marker([40.397771, -3.589444]).addTo(map).bindPopup("Trastering Vicálvaro").openPopup();
}

//// codigo para el mapa xy-map-v2x2 dentro de acordeon y01y01  ///
if (document.getElementById("xy-map-v2x2vMostoles")) {
  // Initialize the map
  var map = L.map("xy-map-v2x2vMostoles").setView([40.3122190, -3.8473610], 17); // Coordinates for Mostoles Madrid, Spain

  // Add the OpenStreetMap tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Add a marker for Barcelona
  L.marker([40.3122190, -3.8473610]).addTo(map).bindPopup("Trastering").openPopup();
}
// document
//   .getElementById("trigger-contacto-footer")
//   .addEventListener("click", function () {
//     var dropupward = document.getElementById("contact-from-footer");
//     if (dropupward.style.display === "flex") {
//       dropupward.style.display = "none";
//     } else {
//       dropupward.style.display = "flex";
//     }
//   });

// Close the dropupward if the user clicks outside of it
// window.onclick = function (event) {
//   if (
//     !event.target.matches("#trigger-contacto-footer") &&
//     !event.target.closest("#contact-from-footer")
//   ) {
//     var dropupward = document.getElementById("contact-from-footer");
//     if (dropupward.style.display === "flex") {
//       dropupward.style.display = "none";
//     }
//   }
// };
if (document.getElementById("trigger-contacto-facility-info")) {
  document
    .getElementById("trigger-contacto-facility-info")
    .addEventListener("click", function () {
      var dropupward = document.getElementById("contact-from-facility-info");
      if (dropupward.style.display === "flex") {
        dropupward.style.display = "none";
      } else {
        dropupward.style.display = "flex";
      }
    });

  // Close the dropupward if the user clicks outside of it
  window.onclick = function (event) {
    if (
      !event.target.matches("#trigger-contacto-facility-info") &&
      !event.target.closest("#contact-from-facility-info")
    ) {
      var dropupward = document.getElementById("contact-from-facility-info");
      if (dropupward.style.display === "flex") {
        dropupward.style.display = "none";
      }
    }
  };
}

if (document.getElementById("xy-tabtoggle-y0y0")) {
  const triggers = document.querySelectorAll(".xy-tabtoggle-y0y0-trigger");
  const contents = document.querySelectorAll(".xy-tabtoggle-y0y0-content");

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");
      const targetContent = document.getElementById(targetId);

      // Toggle the "active" class on the target content div
      if (targetContent.classList.contains("active")) {
        targetContent.classList.remove("active");
      } else {
        // Remove the "active" class from any content div that has it
        contents.forEach((content) => {
          content.classList.remove("active");
        });
        targetContent.classList.add("active");
      }

      // Toggle the "set-on" class on the trigger itself
      if (this.classList.contains("set-on")) {
        this.classList.remove("set-on");
      } else {
        // Remove the "set-on" class from any trigger that has it
        triggers.forEach((trigger) => {
          trigger.classList.remove("set-on");
        });
        this.classList.add("set-on");
      }
    });
  });
}
////////////////////  ACABA EL CÓDIGO EL Trigger tabtoggle-y0y0  ////////////////////////////////
// Seleccionar todos los contenedores de pestañas

/////////////////////////////////////////////////////////////////////////////////

// // Debugger de desplazamiento
// let lastScroll = window.scrollY;
// setInterval(() => {
//   if (window.scrollY !== lastScroll) {
//     console.log('Scroll detectado. Posición:', window.scrollY);
//     console.trace('Stack trace del scroll');
//     lastScroll = window.scrollY;
//   }
// }, 100);


// Código para manejar el texto expandible
document.addEventListener('DOMContentLoaded', function() {
  const readMoreBtn = document.querySelector('.read-more-btn');
  if (readMoreBtn) {
    readMoreBtn.addEventListener('click', function() {
      const expandableText = this.closest('.expandable-text');
      expandableText.classList.add('expanded');
    });
  }
});