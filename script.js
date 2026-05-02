window.MOVII_CONFIG = Object.freeze({
    emailjsPublicKey: 'SEU_PUBLIC_KEY',
    emailjsServiceId: 'SEU_SERVICE_ID',
    emailjsTemplateId: 'SEU_TEMPLATE_ID',
    whatsappNumber: '5516000000000',
    typewriterWords: [
        'Dashboards claros',
        'Sites sob medida',
        'Automações',
        'Sistemas internos'
    ]
});

(() => {
    const typewriterText = document.getElementById('typewriter-text');
    const dashboardNumbers = document.querySelectorAll('[data-dashboard-target]');

    if (dashboardNumbers.length) {
        const animateValue = (element) => {
            const target = Number(element.dataset.dashboardTarget || 0);
            const suffix = element.dataset.dashboardSuffix || '';
            const duration = 1400;
            const startTime = performance.now();

            const step = (currentTime) => {
                const progress = Math.min((currentTime - startTime) / duration, 1);
                const easedProgress = 1 - Math.pow(1 - progress, 3);
                const currentValue = Math.round(target * easedProgress);

                element.textContent = `${currentValue}${suffix}`;

                if (progress < 1) {
                    requestAnimationFrame(step);
                }
            };

            requestAnimationFrame(step);
        };

        dashboardNumbers.forEach((element, index) => {
            setTimeout(() => animateValue(element), 200 + index * 120);
        });
    }

    if (!typewriterText) {
        return;
    }

    const words = window.MOVII_CONFIG?.typewriterWords ?? [];
    let wordIndex = 0;
    let letterIndex = 0;
    let deleting = false;

    function type() {
        const currentWord = words[wordIndex];

        if (!currentWord) {
            return;
        }

        typewriterText.textContent = deleting
            ? currentWord.substring(0, letterIndex - 1)
            : currentWord.substring(0, letterIndex + 1);

        deleting ? letterIndex-- : letterIndex++;

        let speed = deleting ? 50 : 100;

        if (!deleting && letterIndex === currentWord.length) {
            speed = 2000;
            deleting = true;
        } else if (deleting && letterIndex === 0) {
            deleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            speed = 500;
        }

        setTimeout(type, speed);
    }

    setTimeout(type, 1000);
})();


(() => {
    const yearElement = document.getElementById('anoAtual');
    const header = document.querySelector('.site-header');
    const homeAnchors = document.querySelectorAll('a[href="#inicio"]');

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    homeAnchors.forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            history.pushState(null, '', '#inicio');
        });
    });
})();

(() => {
    const hiddenElements = document.querySelectorAll('.escondido');

    if (!hiddenElements.length || typeof window.IntersectionObserver === 'undefined') {
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aparecer');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    hiddenElements.forEach((element) => observer.observe(element));
})();

(() => {
    const slider = document.getElementById('marqueeTrack');

    if (!slider) {
        return;
    }

    let isPointerDown = false;
    let isPaused = false;
    let startX = 0;
    let dragStartTranslate = 0;
    let currentTranslate = 0;
    const speed = 1;
    let loopWidth = 0;
    let animationStarted = false;

    function calculateLoopWidth() {
        const cards = slider.querySelectorAll('.servico-card');
        if (!cards.length) {
            return;
        }

        loopWidth = (cards[0].offsetWidth + 30) * 5;
    }

    function animate() {
        if (!isPointerDown && !isPaused) {
            currentTranslate -= speed;
            if (Math.abs(currentTranslate) >= loopWidth) {
                currentTranslate = 0;
            }
            slider.style.transform = `translateX(${currentTranslate}px)`;
        }

        requestAnimationFrame(animate);
    }

    window.addEventListener('load', () => {
        requestAnimationFrame(() => {
            calculateLoopWidth();
            if (!animationStarted) {
                animationStarted = true;
                animate();
            }
        });
    });

    window.addEventListener('resize', calculateLoopWidth);

    slider.addEventListener('mouseenter', () => {
        isPaused = true;
    });

    slider.addEventListener('mouseleave', () => {
        isPaused = false;
        isPointerDown = false;
        slider.style.cursor = 'grab';
    });

    slider.addEventListener('mousedown', (event) => {
        isPointerDown = true;
        startX = event.pageX;
        dragStartTranslate = currentTranslate;
        slider.style.cursor = 'grabbing';
    });

    slider.addEventListener('mouseup', () => {
        isPointerDown = false;
        slider.style.cursor = 'grab';
    });

    slider.addEventListener('mousemove', (event) => {
        if (!isPointerDown) {
            return;
        }

        event.preventDefault();
        currentTranslate = dragStartTranslate + (event.pageX - startX);

        if (currentTranslate > 0) {
            currentTranslate = 0;
        }

        if (Math.abs(currentTranslate) >= loopWidth) {
            currentTranslate = -(loopWidth - 1);
        }

        slider.style.transform = `translateX(${currentTranslate}px)`;
    });

    slider.addEventListener('touchstart', (event) => {
        isPointerDown = true;
        isPaused = true;
        startX = event.touches[0].pageX;
        dragStartTranslate = currentTranslate;
    }, { passive: true });

    slider.addEventListener('touchend', () => {
        isPointerDown = false;
        isPaused = false;
    });

    slider.addEventListener('touchmove', (event) => {
        if (!isPointerDown) {
            return;
        }

        currentTranslate = dragStartTranslate + (event.touches[0].pageX - startX);

        if (currentTranslate > 0) {
            currentTranslate = 0;
        }

        if (Math.abs(currentTranslate) >= loopWidth) {
            currentTranslate = -(loopWidth - 1);
        }

        slider.style.transform = `translateX(${currentTranslate}px)`;
    }, { passive: true });
})();

(() => {
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');
    const config = window.MOVII_CONFIG;

    if (!contactForm || !formFeedback || !config) {
        return;
    }

    if (window.emailjs?.init) {
        window.emailjs.init({ publicKey: config.emailjsPublicKey });
    }

    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nome = document.getElementById('nome')?.value.trim() ?? '';
        const email = document.getElementById('email')?.value.trim() ?? '';
        const mensagem = document.getElementById('mensagem')?.value.trim() ?? '';

        if (!nome || !email || !mensagem) {
            return;
        }

        const submitButton = contactForm.querySelector('button[type="submit"]');
        if (!submitButton) {
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';
        formFeedback.style.display = 'none';

        try {
            await window.emailjs.send(config.emailjsServiceId, config.emailjsTemplateId, {
                nome,
                email,
                mensagem,
                reply_to: email
            });

            formFeedback.className = 'form-feedback success';
            formFeedback.textContent = '✓ Mensagem enviada! Retornaremos em breve.';
            formFeedback.style.display = 'block';
            contactForm.reset();
        } catch (error) {
            console.warn('EmailJS não configurado, redirecionando para WhatsApp.', error);
            const whatsappText = `Olá, equipe movii!\n\nMeu nome é *${nome}*.\nMeu contato: ${email}\n\n*Como vocês podem me ajudar:*\n${mensagem}`;
            window.open(`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(whatsappText)}`, '_blank', 'noopener,noreferrer');

            formFeedback.className = 'form-feedback success';
            formFeedback.textContent = '✓ Redirecionando para o WhatsApp...';
            formFeedback.style.display = 'block';
            contactForm.reset();
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar Mensagem';
        }
    });
})();
