document.addEventListener("DOMContentLoaded", () => {
    
    // --- PASSWORD PROTECTION LOGIC ---
    const overlay = document.getElementById('password-overlay');
    const form = document.getElementById('password-form');
    const passwordInput = document.getElementById('password-input');
    const errorMessage = document.getElementById('error-message');
    
    // --- IMPORTANT NOTE ---
    // --- Change your password here ---
    const correctPassword = 'pisces2025';
    // ---------------------------------
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (passwordInput.value === correctPassword) {
            overlay.classList.add('hidden');
            // After the overlay is gone, start the main content animations
            startPageAnimations();
        } else {
            errorMessage.style.display = 'block';
            passwordInput.value = '';
        }
    });

    // --- MAIN CONTENT ANIMATION LOGIC ---
    // This function is now called only after a successful password entry.
    function startPageAnimations() {
        // --- Fade-in elements on scroll ---
        const faders = document.querySelectorAll('.fade-in');
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.2
        };

        const appearOnScroll = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        faders.forEach(fader => {
            appearOnScroll.observe(fader);
        });

        // --- Animated Stat Counters ---
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = +counter.getAttribute('data-target');
                    const speed = 200;

                    const updateCount = () => {
                        const count = +counter.innerText.replace('<', '');
                        const increment = Math.max(1, target / speed);

                        if (count < target) {
                            counter.innerText = (counter.innerText.startsWith('<') ? '<' : '') + Math.ceil(count + increment);
                            setTimeout(updateCount, 10);
                        } else {
                            counter.innerText = (counter.innerText.startsWith('<') ? '<' : '') + target;
                        }
                    };
                    updateCount();
                    observer.unobserve(counter);
                }
            });
        }, {
            threshold: 0.5
        });

        document.querySelectorAll('.stat-number').forEach(counter => {
            statsObserver.observe(counter);
        });
    }
});