document.addEventListener('DOMContentLoaded', () => {
    // Ocultar el contenido principal hasta que todo esté listo para evitar parpadeos
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.style.visibility = 'hidden';
    }
    
    // Iniciar la carga de productos y activar todos los listeners
    initializePage();
});

function initializePage() {
    fetchAndDisplayProducts(); // Carga inicial de todos los productos
    setupEventListeners();
    setupIntersectionObserver();
}

function showPageContent() {
    const loadingSpinner = document.getElementById('loading-spinner');
    const mainContent = document.getElementById('main-content');

    if (loadingSpinner) {
        loadingSpinner.style.display = 'none';
    }
    if (mainContent) {
        mainContent.style.visibility = 'visible';
        mainContent.style.opacity = '1';
        mainContent.style.transition = 'opacity 0.5s ease-in-out';
    }
}

async function fetchAndDisplayProducts(category = 'all', searchTerm = '') {
    const productsGrid = document.getElementById('products-grid');
    const apiUrl = `/api/products?category=${category}&search=${encodeURIComponent(searchTerm)}`;
    
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const products = await response.json();
        
        productsGrid.innerHTML = ''; // Limpiar la parrilla
        
        if (products.length === 0) {
            productsGrid.innerHTML = '<p class="no-products-message">No se encontraron productos que coincidan con tu búsqueda.</p>';
        } else {
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card'; // Para el observer de animación
                productCard.innerHTML = `
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}" loading="lazy">
                    </div>
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p class="product-category">${product.category}</p>
                        <p class="product-price">$${product.price.toLocaleString('es-DO')}</p>
                        <button class="cta-button">Ver Detalles</button>
                    </div>
                `;
                productsGrid.appendChild(productCard);
            });
        }
    } catch (error) {
        console.error('Error al cargar los productos:', error);
        productsGrid.innerHTML = '<p class="error-message">Lo sentimos, no pudimos cargar los productos. Por favor, intenta de nuevo más tarde.</p>';
    } finally {
        // Una vez finalizada la carga (con éxito o error), mostramos el contenido.
        showPageContent(); 
        // Re-activar el observer para las nuevas tarjetas de producto creadas
        setupIntersectionObserver();
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');

    // Mostrar loader y deshabilitar botón
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-block';
    submitBtn.disabled = true;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Ocurrió un error en el servidor.');
        }

        document.getElementById('success-modal').style.display = 'flex';
        form.reset();

    } catch (error) {
        alert(`Error al enviar el mensaje: ${error.message}`);
    } finally {
        // Ocultar loader y habilitar botón
        btnText.style.display = 'inline-block';
        btnLoader.style.display = 'none';
        submitBtn.disabled = false;
    }
}

function setupEventListeners() {
    // Menú móvil
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const navLinks = document.querySelector('.nav-links');
    mobileMenuButton.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Filtros de productos
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelector('.filter-btn.active').classList.remove('active');
            button.classList.add('active');
            const category = button.dataset.category;
            fetchAndDisplayProducts(category, document.getElementById('search-input').value);
        });
    });

    // Búsqueda de productos
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');
    searchBtn.addEventListener('click', () => {
        const activeCategory = document.querySelector('.filter-btn.active').dataset.category;
        fetchAndDisplayProducts(activeCategory, searchInput.value);
    });
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });

    const btn = document.getElementById('submit-btn');
    
    document.getElementById('contact-form')
     .addEventListener('submit', function(event) {
       event.preventDefault();
    
       btn.value = 'Enviando...';
    
       const serviceID = 'default_service';
       const templateID = 'template_kgh1w9x';
    
       emailjs.sendForm(serviceID, templateID, this)
        .then(() => {
          btn.value = 'Enviar Email';
          alert('Sent!');
        }, (err) => {
          btn.value = 'Enviar Email';
          alert(JSON.stringify(err));
        });
    });

    // Efecto de scroll en el header
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });
}

function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Aplicar a todas las tarjetas que deben animarse
    document.querySelectorAll('.product-card, .service-card, .blog-card, .location-card').forEach(el => {
        observer.observe(el);
    });
}

