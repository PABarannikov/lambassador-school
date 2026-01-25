// ========================================
// L'Ambassador School - JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavbar();
    initMobileMenu();
    initScrollAnimations();
    initContactForm();
    initSmoothScroll();
    initLanguageSwitcher();
});

// ========================================
// Navbar Scroll Effect
// ========================================
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add scrolled class when page is scrolled
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

// ========================================
// Mobile Menu Toggle
// ========================================
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ========================================
// Scroll Reveal Animations
// ========================================
function initScrollAnimations() {
    // Add reveal class to elements
    const revealElements = document.querySelectorAll(
        '.section-content, .section-image, .vision-card, .service-card, .philosophy-content, .goal-content, .contact-info, .contact-form'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    // Intersection Observer for reveal animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // Add staggered animation for grid items
                if (entry.target.parentElement?.classList.contains('vision-grid') ||
                    entry.target.parentElement?.classList.contains('services-grid')) {
                    const siblings = entry.target.parentElement.children;
                    Array.from(siblings).forEach((sibling, index) => {
                        sibling.style.transitionDelay = `${index * 0.1}s`;
                    });
                }
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
}

// ========================================
// Contact Form Handling
// ========================================
function initContactForm() {
    const form = document.getElementById('contactForm');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Collect form data
        const companyField = form.querySelector('#company');
        const formData = {
            name: form.querySelector('#name').value,
            email: form.querySelector('#email').value,
            company: companyField ? companyField.value : '',
            service: form.querySelector('#service').value,
            message: form.querySelector('#message').value
        };

        try {
            // Send directly to Web3Forms
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    access_key: 'f1c66897-12fa-4144-8688-9ebef8a09aa7',
                    subject: `New Enquiry: ${formData.service} - from ${formData.name}`,
                    from_name: "L'Ambassador School Website",
                    name: formData.name,
                    email: formData.email,
                    service: formData.service,
                    message: formData.message || 'No message provided'
                })
            });

            const result = await response.json();

            if (result.success) {
                showNotification('Thank you! Your message has been sent successfully.', 'success');
                form.reset();
            } else {
                const errorMsg = result.message || 'Failed to send message. Please try again.';
                showNotification(errorMsg, 'error');
            }
        } catch (error) {
            showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ========================================
// Notification System
// ========================================
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        padding: 20px 30px;
        background-color: ${type === 'success' ? '#c9a962' : '#dc3545'};
        color: ${type === 'success' ? '#0a0a0a' : '#fff'};
        font-family: 'Montserrat', sans-serif;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        gap: 15px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;

    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: inherit;
        line-height: 1;
    `;

    // Add to DOM
    document.body.appendChild(notification);

    // Close button handler
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);

    // Add animation keyframes if not exists
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// ========================================
// Smooth Scroll for Anchor Links
// ========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// Parallax Effect (Optional Enhancement)
// ========================================
function initParallax() {
    const hero = document.querySelector('.hero');

    if (!hero) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;

        hero.style.backgroundPositionY = `${rate}px`;
    });
}

// ========================================
// Language Switcher
// ========================================
function initLanguageSwitcher() {
    const langBtns = document.querySelectorAll('.lang-btn');

    // Translation dictionary
    const translations = {
        en: {
            // Hero
            'hero-badge': 'Lisbon, Portugal',
            'hero-tagline': 'Training the best Sales Ambassadors for powerful brands.',
            'hero-title-1': 'Training the best Sales Ambassadors for powerful brands.',
            'hero-subtitle': 'We believe that reaching excellence in customer service is a continuous journey — one that evolves, elevates, and never ends.',
            'hero-tagline-bottom': 'Elevating Service. Inspiring Excellence.',
            'hero-cta-1': 'Get in Touch',
            'hero-cta-2': 'Our Programmes',

            // About
            'about-label': 'About Us',
            'about-title': 'Excellence is a Never Ending Process',
            'about-text-1': 'L\'Ambassador School is Portugal\'s pioneering concept academy dedicated to developing top Sales Ambassadors through exclusive, tailor-made programmes and workshops aligned with each brand\'s DNA, standards, and philosophy.',
            'about-text-2': 'Shaping the next generation of exceptional Sales Ambassadors. We inspire ambition, develop talent, and transform potential into excellence.',
            'about-text-3': 'At L\'Ambassador School, we empower our students and clients with cutting-edge techniques, refined methods, and high-impact communication skills that boost confidence and elevate performance. Our training ensures every participant is prepared to deliver a truly tailor-made, memorable and impeccable customer experience — every time.',
            'about-highlight': 'We train, educate, inspire, and cultivate a deep, lasting passion for this remarkable profession — <span class="text-gold">Sales Ambassador</span>.',

            // What We Do
            'whatwedo-label': 'We Offer',
            'whatwedo-title': 'Tailored Training Programmes',
            'offer-1-title': 'Training Programmes',
            'offer-2-title': 'Individual Coaching',
            'offer-3-title': 'Talent Selection',
            'whatwedo-text-1': 'Our trainings stand out as a powerful growth driver for companies, especially in times of strong competition and rapid evolution within the luxury market.',
            'whatwedo-benefits-title': 'What Makes Our Training Different',
            'whatwedo-benefit-1': 'Our training programmes are designed for both newcomers and experienced sales assistants, as well as for those who want to start a career as a SA.',
            'whatwedo-benefit-2': 'We focus on how people think, feel, and respond in real-life situations, going beyond scripts and standard procedures.',
            'whatwedo-benefit-3': 'This is not a lecture-based course. Our training is dynamic, highly interactive, and filled with practical activities that keep participants engaged and involved throughout the programme.',
            'whatwedo-benefit-4': 'We combine hands-on tools with behavioral insight, helping participants understand not only what to do, but why it works.',
            'whatwedo-benefit-5': 'We openly address real challenges such as difficult conversations, emotional customers, cultural differences, stress, misunderstandings, and working under time pressure.',
            'whatwedo-benefit-6': 'Our activities are designed to strengthen seamless teamwork, leading to improved performance, stronger collaboration, and higher overall results.',
            'whatwedo-text-2': 'Our training programmes and workshops are fully customised and built around maximum live participation. Through dynamic role plays, real-life case studies, and a variety of interactive activities, participants gain practical, immediately applicable skills.',
            'whatwedo-text-3': 'Each training is carefully tailored to the specific needs of the luxury sector — whether boutique retail, real estate, or hospitality — to ensure absolute relevance and impact. All programmes are available in English or Portuguese, allowing brands to train their teams with confidence and consistency across markets.',

            // Vision Cards
            'vision-1-title': 'Luxury Universe',
            'vision-1-text': 'Understand the luxury universe — past, present, and future',
            'vision-2-title': 'Emotional Connection',
            'vision-2-text': 'Master the art of emotional connection and lifestyle offering',
            'vision-3-title': 'Cultural Awareness',
            'vision-3-text': 'Navigate cultural and generational nuances with confidence',
            'vision-4-title': 'Turn Challenges',
            'vision-4-text': 'Turn challenges, objections, and complaints into opportunities',
            'vision-5-title': 'Client Relationships',
            'vision-5-text': 'Build loyal, long-term client relationships that last',
            'vision-6-title': 'Authentic Communication',
            'vision-6-text': 'Communicate with confidence, authenticity, and impact',
            'vision-7-title': 'Evolving Expectations',
            'vision-7-text': 'Adapt to evolving luxury and service expectations',

            // Trainings
            'trainings-label': 'Training Programmes',
            'trainings-title': 'Transformative Programmes',
            'training-1-title': 'Speaking Luxury',
            'training-1-text': 'Develop a true luxury mindset and learn how language, attitude, and emotional intelligence shape perception. This training focuses on offering a lifestyle, delivering excellence under pressure, and creating memorable final impressions that leave a lasting impact.',
            'training-2-title': 'Secrets of Top Performing Sales Ambassadors',
            'training-2-text': 'Go beyond selling and become a relationship-builder and brand representative. This programme reveals the habits, communication techniques, and interpersonal skills of top performers who consistently exceed expectations and inspire client loyalty.',
            'training-3-title': 'Customer Service Excellence',
            'training-3-text': 'Master the fundamentals of exceptional service across all sectors. Learn how to evaluate service quality, adapt to different customer profiles, and apply proven techniques that elevate customer experience and strengthen teamwork.',
            'training-cta': 'Enquire Now',

            // Mission
            'mission-label': 'Our Mission',
            'mission-title': 'More Than Skills — Transformation',
            'mission-intro': 'Our trainings provide more than skills — they deliver confidence, motivation, and transformation.',
            'mission-1': 'Deliver tailored, high-level service at every touchpoint',
            'mission-2': 'Handle demanding situations with grace and professionalism',
            'mission-3': 'Represent their brand with authenticity, trust, and excellence',
            'mission-4': 'Create emotional connections that turn clients into loyal advocates',

            // Founder
            'founder-label': 'About the Founder',
            'founder-title': 'Olga',
            'founder-text-1': 'With extensive professional experience in the luxury and premium brand sector, the founder of L\'Ambassador School built her career working closely with international brands and multicultural teams.',
            'founder-text-2': 'After relocating to Portugal in 2011, she continued to develop within the luxury industry, where collaboration, team engagement, and service excellence became central to her work. Sharing experience, best practices, and real-life insights with colleagues was always a natural part of her professional journey.',
            'founder-text-3': 'Holding a university degree in Education and a CELTA certification, she brings a strong pedagogical foundation in adult learning methodologies, facilitation, and training design. Her professional development also includes two specialized training programmes within the LVMH Group, as well as studies with the CIPD (Chartered Institute of Personnel and Development) in People Management.',
            'founder-text-4': 'This unique combination of luxury expertise, educational background, and people-focused training enables her to design and deliver structured, engaging, high-impact bespoke learning solutions, fully aligned with strategic business objectives — and ultimately led to the creation of L\'Ambassador School.',
            'lang-english': 'English',
            'lang-portuguese': 'Portuguese',
            'lang-ukrainian': 'Ukrainian',
            'lang-russian': 'Russian',

            // Contact
            'contact-label': 'Let\'s Connect',
            'contact-title': 'Ready to Transform Your Team?',
            'contact-text': 'Every great brand is built by people. If you\'re curious about helping your team feel more confident, engaged, and aligned, we\'d love to hear from you.',
            'contact-location': 'Lisbon, Portugal',
            'form-name': 'Your Name',
            'form-email': 'Email Address',
            'form-service': 'Interested In',
            'form-message': 'Your Message (Optional)',
            'form-submit': 'Send Message',
            'form-option-1': 'Speaking Luxury',
            'form-option-2': 'Secrets of Top Performers',
            'form-option-3': 'Customer Service Excellence',
            'form-option-4': 'Other',

            // Footer
            'footer-tagline': 'Training the best Sales Ambassadors for powerful brands.',
            'footer-links-title': 'Quick Links',
            'footer-social-title': 'Follow Us',
            'footer-link-about': 'About Us',
            'footer-link-whatwedo': 'We Offer',
            'footer-link-trainings': 'Trainings',
            'footer-link-contact': 'Contact',
            'footer-copyright': '© 2026 L\'Ambassador School. All rights reserved.'
        },
        pt: {
            // Hero
            'hero-badge': 'Lisboa, Portugal',
            'hero-tagline': 'Formando os melhores Embaixadores de Vendas para marcas de prestígio.',
            'hero-title-1': 'Formando os melhores Embaixadores de Vendas para marcas de prestígio.',
            'hero-subtitle': 'Acreditamos que alcançar a excelência no serviço ao cliente é uma jornada contínua — que evolui, eleva e nunca termina.',
            'hero-tagline-bottom': 'Elevando o Serviço. Inspirando Excelência.',
            'hero-cta-1': 'Entre em Contacto',
            'hero-cta-2': 'Os Nossos Programas',

            // About
            'about-label': 'Sobre Nós',
            'about-title': 'A Excelência é um Processo Sem Fim',
            'about-text-1': 'A L\'Ambassador School é a academia pioneira em Portugal dedicada ao desenvolvimento de Embaixadores de Vendas de excelência através de programas e workshops exclusivos e personalizados, alinhados com o ADN, padrões e filosofia de cada marca.',
            'about-text-2': 'Moldando a próxima geração de Embaixadores de Vendas excecionais. Inspiramos ambição, desenvolvemos talento e transformamos potencial em excelência.',
            'about-text-3': 'Na L\'Ambassador School, capacitamos os nossos alunos e clientes com técnicas de vanguarda, métodos refinados e competências de comunicação de alto impacto que aumentam a confiança e elevam o desempenho. A nossa formação garante que cada participante está preparado para oferecer uma experiência de cliente verdadeiramente personalizada, memorável e impecável — sempre.',
            'about-highlight': 'Formamos, educamos, inspiramos e cultivamos uma paixão profunda e duradoura por esta profissão notável — <span class="text-gold">Embaixador de Vendas</span>.',

            // What We Do
            'whatwedo-label': 'Oferecemos',
            'whatwedo-title': 'Programas de Formação Personalizados',
            'offer-1-title': 'Programas de Formação',
            'offer-2-title': 'Coaching Individual',
            'offer-3-title': 'Seleção de Talentos',
            'whatwedo-text-1': 'As nossas formações destacam-se como um poderoso motor de crescimento para empresas, especialmente em tempos de forte concorrência e rápida evolução no mercado de luxo.',
            'whatwedo-benefits-title': 'O Que Torna a Nossa Formação Diferente',
            'whatwedo-benefit-1': 'Os nossos programas de formação são concebidos tanto para iniciantes como para assistentes de vendas experientes, bem como para quem deseja iniciar uma carreira como SA.',
            'whatwedo-benefit-2': 'Focamo-nos na forma como as pessoas pensam, sentem e respondem em situações reais, indo além de guiões e procedimentos padrão.',
            'whatwedo-benefit-3': 'Este não é um curso baseado em palestras. A nossa formação é dinâmica, altamente interativa e repleta de atividades práticas que mantêm os participantes envolvidos ao longo de todo o programa.',
            'whatwedo-benefit-4': 'Combinamos ferramentas práticas com conhecimento comportamental, ajudando os participantes a compreender não só o que fazer, mas também porque funciona.',
            'whatwedo-benefit-5': 'Abordamos abertamente desafios reais como conversas difíceis, clientes emocionais, diferenças culturais, stress, mal-entendidos e trabalho sob pressão.',
            'whatwedo-benefit-6': 'As nossas atividades são concebidas para fortalecer o trabalho em equipa, conduzindo a melhor desempenho, colaboração mais forte e resultados globais superiores.',
            'whatwedo-text-2': 'Os nossos programas de formação e workshops são totalmente personalizados e construídos em torno da máxima participação ao vivo. Através de dinâmicas de role play, casos de estudo reais e uma variedade de atividades interativas, os participantes adquirem competências práticas e imediatamente aplicáveis.',
            'whatwedo-text-3': 'Cada formação é cuidadosamente adaptada às necessidades específicas do setor de luxo — seja retalho boutique, imobiliário ou hotelaria — para garantir absoluta relevância e impacto. Todos os programas estão disponíveis em inglês ou português, permitindo às marcas formar as suas equipas com confiança e consistência em todos os mercados.',

            // Vision Cards
            'vision-1-title': 'Universo do Luxo',
            'vision-1-text': 'Compreender o universo do luxo — passado, presente e futuro',
            'vision-2-title': 'Conexão Emocional',
            'vision-2-text': 'Dominar a arte da conexão emocional e oferta de estilo de vida',
            'vision-3-title': 'Consciência Cultural',
            'vision-3-text': 'Navegar nuances culturais e geracionais com confiança',
            'vision-4-title': 'Transformar Desafios',
            'vision-4-text': 'Transformar desafios, objeções e reclamações em oportunidades',
            'vision-5-title': 'Relações com Clientes',
            'vision-5-text': 'Construir relações leais e duradouras com os clientes',
            'vision-6-title': 'Comunicação Autêntica',
            'vision-6-text': 'Comunicar com confiança, autenticidade e impacto',
            'vision-7-title': 'Expectativas em Evolução',
            'vision-7-text': 'Adaptar-se às expectativas em evolução do luxo e serviço',

            // Trainings
            'trainings-label': 'Programas de Formação',
            'trainings-title': 'Programas Transformadores',
            'training-1-title': 'Falar Luxo',
            'training-1-text': 'Desenvolva uma verdadeira mentalidade de luxo e aprenda como a linguagem, atitude e inteligência emocional moldam a perceção. Esta formação foca-se em oferecer um estilo de vida, entregar excelência sob pressão e criar impressões finais memoráveis que deixam um impacto duradouro.',
            'training-2-title': 'Segredos dos Melhores Embaixadores de Vendas',
            'training-2-text': 'Vá além da venda e torne-se um construtor de relações e representante de marca. Este programa revela os hábitos, técnicas de comunicação e competências interpessoais dos melhores profissionais que consistentemente superam expectativas e inspiram lealdade dos clientes.',
            'training-3-title': 'Excelência no Serviço ao Cliente',
            'training-3-text': 'Domine os fundamentos do serviço excecional em todos os setores. Aprenda a avaliar a qualidade do serviço, adaptar-se a diferentes perfis de clientes e aplicar técnicas comprovadas que elevam a experiência do cliente e fortalecem o trabalho em equipa.',
            'training-cta': 'Saber Mais',

            // Mission
            'mission-label': 'A Nossa Missão',
            'mission-title': 'Mais do que Competências — Transformação',
            'mission-intro': 'As nossas formações proporcionam mais do que competências — entregam confiança, motivação e transformação.',
            'mission-1': 'Entregar serviço personalizado e de alto nível em cada ponto de contacto',
            'mission-2': 'Lidar com situações exigentes com elegância e profissionalismo',
            'mission-3': 'Representar a sua marca com autenticidade, confiança e excelência',
            'mission-4': 'Criar conexões emocionais que transformam clientes em defensores leais',

            // Founder
            'founder-label': 'Sobre a Fundadora',
            'founder-title': 'Olga',
            'founder-text-1': 'Com vasta experiência profissional no setor de marcas de luxo e premium, a fundadora da L\'Ambassador School construiu a sua carreira trabalhando de perto com marcas internacionais e equipas multiculturais.',
            'founder-text-2': 'Após mudar-se para Portugal em 2011, continuou a desenvolver-se na indústria de luxo, onde a colaboração, o envolvimento de equipas e a excelência de serviço se tornaram centrais no seu trabalho. Partilhar experiência, boas práticas e conhecimentos reais com colegas sempre foi uma parte natural do seu percurso profissional.',
            'founder-text-3': 'Com um diploma universitário em Educação e certificação CELTA, traz uma base pedagógica sólida em metodologias de aprendizagem de adultos, facilitação e design de formação. O seu desenvolvimento profissional inclui também dois programas de formação especializados no Grupo LVMH, bem como estudos com o CIPD (Chartered Institute of Personnel and Development) em Gestão de Pessoas.',
            'founder-text-4': 'Esta combinação única de expertise em luxo, formação educacional e formação focada em pessoas permite-lhe conceber e entregar soluções de aprendizagem personalizadas, estruturadas, envolventes e de alto impacto, totalmente alinhadas com objetivos estratégicos de negócio — e que, em última análise, conduziu à criação da L\'Ambassador School.',
            'lang-english': 'Inglês',
            'lang-portuguese': 'Português',
            'lang-ukrainian': 'Ucraniano',
            'lang-russian': 'Russo',

            // Contact
            'contact-label': 'Vamos Conectar',
            'contact-title': 'Pronto para Transformar a Sua Equipa?',
            'contact-text': 'Toda grande marca é construída por pessoas. Se está curioso sobre como ajudar a sua equipa a sentir-se mais confiante, envolvida e alinhada, adoraríamos ouvir de si.',
            'contact-location': 'Lisboa, Portugal',
            'form-name': 'O Seu Nome',
            'form-email': 'Endereço de Email',
            'form-service': 'Interessado Em',
            'form-message': 'A Sua Mensagem (Opcional)',
            'form-submit': 'Enviar Mensagem',
            'form-option-1': 'Falar Luxo',
            'form-option-2': 'Segredos dos Melhores',
            'form-option-3': 'Excelência no Serviço',
            'form-option-4': 'Outro',

            // Footer
            'footer-tagline': 'Formando os melhores Embaixadores de Vendas para marcas de prestígio.',
            'footer-links-title': 'Links Rápidos',
            'footer-social-title': 'Siga-nos',
            'footer-link-about': 'Sobre Nós',
            'footer-link-whatwedo': 'Oferecemos',
            'footer-link-trainings': 'Formações',
            'footer-link-contact': 'Contacto',
            'footer-copyright': '© 2026 L\'Ambassador School. Todos os direitos reservados.'
        }
    };

    // Get saved language or default to English
    let currentLang = localStorage.getItem('lang') || 'en';

    // Apply initial language
    applyLanguage(currentLang);
    updateActiveButton(currentLang);

    // Language button click handlers
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            // On mobile, clicking active button toggles to other language
            const isMobileBtn = btn.closest('.nav-right');
            if (isMobileBtn && lang === currentLang) {
                // Toggle to the other language
                currentLang = lang === 'en' ? 'pt' : 'en';
            } else if (lang !== currentLang) {
                currentLang = lang;
            } else {
                return; // No change needed
            }
            localStorage.setItem('lang', currentLang);
            applyLanguage(currentLang);
            updateActiveButton(currentLang);
        });
    });

    function updateActiveButton(lang) {
        langBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
    }

    function applyLanguage(lang) {
        const t = translations[lang];

        // Update all elements with data-translate attribute
        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.dataset.translate;
            if (t[key]) {
                el.innerHTML = t[key];
            }
        });

        // Update navigation links with data attributes
        document.querySelectorAll('[data-en][data-pt]').forEach(el => {
            el.textContent = el.dataset[lang];
        });

        // Update page title
        document.title = lang === 'pt'
            ? 'L\'Ambassador School | Formando os melhores Embaixadores de Vendas para marcas de prestígio.'
            : 'L\'Ambassador School | Training the best Sales Ambassadors for powerful brands.';
    }
}
