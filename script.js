// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100, // Offset for slightly taller header
                behavior: 'smooth'
            });
        }
    });
});

// Reveal animations on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('section, .skill-card, .project-card, .timeline-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'all 1.2s cubic-bezier(0.165, 0.84, 0.44, 1)';
    observer.observe(el);
});

// Language Switching Logic
const langSwitchBtn = document.getElementById('lang-switch');
let currentLang = localStorage.getItem('portfolio-lang') || 'en';

const updateContent = (lang) => {
    document.querySelectorAll('[data-en]').forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (text) {
            // Check if text contains HTML tags or entities
            if (text.includes('<') || text.includes('&')) {
                el.innerHTML = text;
            } else {
                el.textContent = text;
            }
        }
    });

    document.querySelectorAll('[data-placeholder-en]').forEach(el => {
        const placeholder = el.getAttribute(`data-placeholder-${lang}`);
        if (placeholder) el.placeholder = placeholder;
    });

    // Update Button Text
    langSwitchBtn.textContent = lang === 'en' ? 'EN / FR' : 'FR / EN';

    // Update HTML lang attribute
    document.documentElement.lang = lang;
};

// Initialize language
updateContent(currentLang);

langSwitchBtn.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'fr' : 'en';
    localStorage.setItem('portfolio-lang', currentLang);
    updateContent(currentLang);
});

// Email Form Submission with Formspree (AJAX)
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button');
        const originalText = btn.textContent;

        const loadingText = currentLang === 'en' ? 'Sending...' : 'Envoi en cours...';
        const successMsg = currentLang === 'en' ? 'Your message has been sent. Thank you!' : 'Votre message a bien été envoyé. Merci !';
        const errorMsg = currentLang === 'en' ? 'Oops! There was a problem sending your message.' : 'Oups ! Un problème est survenu lors de l\'envoi de votre message.';

        btn.textContent = loadingText;
        btn.disabled = true;

        // Honeypot check
        if (contactForm._gotcha.value) {
            console.log("Spam detected!");
            return;
        }

        // Frontend Sanitization
        const sanitize = (text) => text.replace(/<[^>]*>?/gm, ''); // Strips all HTML tags

        const formData = new FormData();
        formData.append('name', sanitize(contactForm.name.value.trim()));
        formData.append('email', sanitize(contactForm.email.value.trim()));
        formData.append('message', sanitize(contactForm.message.value.trim()));

        try {
            const response = await fetch(contactForm.action, {
                method: contactForm.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                alert(successMsg);
                contactForm.reset();
            } else {
                alert(errorMsg);
            }
        } catch (error) {
            alert(errorMsg);
        } finally {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    });
}

// Mobile Menu Toggle
const mobileToggle = document.querySelector('.mobile-toggle');
const navLinksContainer = document.querySelector('.nav-links');

if (mobileToggle && navLinksContainer) {
    mobileToggle.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinksContainer.classList.remove('active');
            const icon = mobileToggle.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-xmark');
        });
    });
}

