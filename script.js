// Mobile menu toggle
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form submission handler
document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    // Create WhatsApp message
    const whatsappMessage = `Hola, soy ${name}. ${message}. Mi email es ${email} y mi teléfono es ${phone}.`;
    const whatsappUrl = `https://wa.me/18095540000?text=${encodeURIComponent(whatsappMessage)}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Reset form
    this.reset();
    
    // Show success message
    alert('Mensaje enviado. Te redirigiremos a WhatsApp para completar el contacto.');
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.product-card, .service-card, .blog-card, .location-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(26, 26, 46, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)';
        header.style.backdropFilter = 'none';
    }
});

// Product card hover effects
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Service card animations
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.service-icon i');
        icon.style.transform = 'scale(1.2) rotate(5deg)';
        icon.style.transition = 'transform 0.3s ease';
    });
    
    card.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.service-icon i');
        icon.style.transform = 'scale(1) rotate(0deg)';
    });
});

// Blog card click handlers
document.querySelectorAll('.blog-card').forEach(card => {
    card.addEventListener('click', function() {
        const title = this.querySelector('.blog-title').textContent;
        alert(`Próximamente: ${title}`);
    });
});

// Location card map interaction
document.querySelectorAll('.map-placeholder').forEach(map => {
    map.addEventListener('click', function() {
        const locationCard = this.closest('.location-card');
        const locationName = locationCard.querySelector('h3').textContent;
        
        if (locationName.includes('Principal')) {
            window.open('https://maps.google.com/?q=Higüey,+La+Altagracia,+Dominican+Republic', '_blank');
        } else if (locationName.includes('Punta Cana')) {
            window.open('https://maps.google.com/?q=Punta+Cana,+Dominican+Republic', '_blank');
        }
    });
});

// Dynamic content loading simulation
function loadPromotions() {
    const promotions = [
        {
            title: "Descuento Especial Julio",
            description: "15% de descuento en todas las motocicletas deportivas",
            date: "Válido hasta el 31 de Julio"
        },
        {
            title: "Financiamiento Sin Inicial",
            description: "Llévate tu motocicleta sin inicial en modelos seleccionados",
            date: "Promoción limitada"
        },
        {
            title: "Servicio Técnico Gratis",
            description: "Primer servicio gratuito con la compra de cualquier motocicleta",
            date: "Aplica términos y condiciones"
        }
    ];
    
    // This would normally load from a CMS or database
    console.log('Promotions loaded:', promotions);
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadPromotions();
    
    // Add loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Performance optimization
const lazyImages = document.querySelectorAll('[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// Contact form validation
const inputs = document.querySelectorAll('input, textarea');
inputs.forEach(input => {
    input.addEventListener('blur', function() {
        if (this.hasAttribute('required') && !this.value.trim()) {
            this.style.borderColor = '#ff4757';
        } else {
            this.style.borderColor = '#e1e5e9';
        }
    });
    
    input.addEventListener('focus', function() {
        this.style.borderColor = '#ff6b35';
    });
});

// Search functionality (for future implementation)
function searchProducts(query) {
    // This would integrate with a product database
    console.log('Searching for:', query);
}

// Newsletter subscription (placeholder)
function subscribeNewsletter(email) {
    // This would integrate with an email service
    console.log('Newsletter subscription:', email);
    alert('¡Gracias por suscribirte a nuestro newsletter!');
}

// Social media integration
function shareOnSocial(platform, url, text) {
    let shareUrl = '';
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodedText} ${encodedUrl}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}