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
    const navToggle = document.querySelector('.nav-toggle');
    const navigation = document.getElementById('main-navigation');
    const homeAnchors = document.querySelectorAll('a[href="#inicio"]');
    const navLinks = navigation?.querySelectorAll('a') ?? [];

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    function closeMenu() {
        document.body.classList.remove('nav-open');
        navToggle?.setAttribute('aria-expanded', 'false');
        navToggle?.setAttribute('aria-label', 'Abrir menu');
    }

    if (navToggle && navigation) {
        navToggle.addEventListener('click', () => {
            const isOpen = document.body.classList.toggle('nav-open');
            navToggle.setAttribute('aria-expanded', String(isOpen));
            navToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
        });

        navLinks.forEach((link) => {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('click', (event) => {
            if (!document.body.classList.contains('nav-open')) {
                return;
            }

            if (navigation.contains(event.target) || navToggle.contains(event.target)) {
                return;
            }

            closeMenu();
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                closeMenu();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeMenu();
            }
        });
    }

    homeAnchors.forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            event.preventDefault();
            closeMenu();
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
    const modal = document.getElementById('serviceModal');
    const titleElement = document.getElementById('serviceModalTitle');
    const summaryElement = document.getElementById('serviceModalSummary');
    const detailElement = document.getElementById('serviceModalDetail');
    const tagsElement = document.getElementById('serviceModalTags');
    const iconElement = document.getElementById('serviceModalIcon');
    const detailButtons = document.querySelectorAll('.servico-arrow');

    if (!modal || !titleElement || !summaryElement || !detailElement || !tagsElement || !iconElement || !detailButtons.length) {
        return;
    }

    let lastFocusedElement = null;

    function closeServiceModal() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('project-modal-open');
        lastFocusedElement?.focus?.();
    }

    function openServiceModal(trigger) {
        const card = trigger.closest('.servico-card-dark');

        if (!card) {
            return;
        }

        const title = card.querySelector('h3')?.textContent.trim() ?? 'Serviço';
        const summary = card.querySelector('p')?.textContent.trim() ?? '';
        const detail = card.dataset.serviceDetail || summary;
        const tags = (card.dataset.serviceTags || '')
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean);
        const icon = card.querySelector('.servico-icon-dark svg')?.cloneNode(true);

        titleElement.textContent = title;
        summaryElement.textContent = summary;
        detailElement.textContent = detail;
        iconElement.replaceChildren();

        if (icon) {
            iconElement.appendChild(icon);
        }

        tagsElement.replaceChildren(...tags.map((tag) => {
            const tagElement = document.createElement('span');
            tagElement.textContent = tag;
            return tagElement;
        }));

        lastFocusedElement = trigger;
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('project-modal-open');
        modal.querySelector('[data-service-close]')?.focus();
    }

    detailButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            openServiceModal(button);
        });
    });

    modal.querySelectorAll('[data-service-close]').forEach((element) => {
        element.addEventListener('click', closeServiceModal);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('is-open')) {
            closeServiceModal();
        }
    });
})();

(() => {
    const modal = document.getElementById('projectModal');
    const titleElement = document.getElementById('projectModalTitle');
    const typeElement = document.getElementById('projectModalType');
    const descriptionElement = document.getElementById('projectModalDescription');
    const tagsElement = document.getElementById('projectModalTags');
    const imageElement = document.getElementById('projectModalImage');
    const thumbsElement = document.getElementById('projectModalThumbs');
    const detailButtons = document.querySelectorAll('.projeto-link');

    if (!modal || !titleElement || !typeElement || !descriptionElement || !tagsElement || !imageElement || !thumbsElement || !detailButtons.length) {
        return;
    }

    let lastFocusedElement = null;

    function closeProjectModal() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('project-modal-open');
        lastFocusedElement?.focus?.();
    }

    function openProjectModal(trigger) {
        const card = trigger.closest('.projeto-card');

        if (!card) {
            return;
        }

        const title = card.querySelector('.projeto-body h3')?.textContent.trim() ?? 'Projeto';
        const type = card.querySelector('.projeto-tipo')?.textContent.trim() ?? 'Projeto';
        const description = trigger.dataset.projectDescription || card.querySelector('.projeto-body p')?.textContent.trim() || '';
        const tags = Array.from(card.querySelectorAll('.projeto-tag')).map((tag) => tag.textContent.trim());
        const fallbackImage = card.querySelector('.projeto-photo-slot img')?.getAttribute('src') || 'assets/images/projects/project-cover-default.jpg';
        const images = (trigger.dataset.projectImages || fallbackImage)
            .split(',')
            .map((image) => image.trim())
            .filter(Boolean);

        titleElement.textContent = title;
        typeElement.textContent = type;
        descriptionElement.textContent = description;
        imageElement.src = images[0] || fallbackImage;
        imageElement.alt = `Prévia do projeto ${title}`;
        tagsElement.replaceChildren(...tags.map((tag) => {
            const tagElement = document.createElement('span');
            tagElement.textContent = tag;
            return tagElement;
        }));
        thumbsElement.replaceChildren(...images.map((image, index) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = index === 0 ? 'is-active' : '';
            button.setAttribute('aria-label', `Ver imagem ${index + 1} de ${title}`);

            const thumb = document.createElement('img');
            thumb.src = image;
            thumb.alt = '';

            button.appendChild(thumb);
            button.addEventListener('click', () => {
                imageElement.src = image;
                thumbsElement.querySelectorAll('button').forEach((thumbButton) => thumbButton.classList.remove('is-active'));
                button.classList.add('is-active');
            });

            return button;
        }));

        lastFocusedElement = trigger;
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('project-modal-open');
        modal.querySelector('[data-project-close]')?.focus();
    }

    detailButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            openProjectModal(button);
        });
    });

    modal.querySelectorAll('[data-project-close]').forEach((element) => {
        element.addEventListener('click', closeProjectModal);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('is-open')) {
            closeProjectModal();
        }
    });
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
            const whatsappText = `Olá, equipe MovCode!\n\nMeu nome é *${nome}*.\nMeu contato: ${email}\n\n*Como vocês podem me ajudar:*\n${mensagem}`;
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

