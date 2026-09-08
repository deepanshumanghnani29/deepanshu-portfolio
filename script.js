/**
 * Deepanshu Manghnani — Portfolio Interactions
 * Features: Mobile Nav, Scrollspy, Certificate Lightbox Modal, View All Toggle, Scroll Reveal
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // 1. Mobile Menu Toggle
    // -------------------------------------------------------------------------
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        const toggleMenu = (open) => {
            const shouldOpen = open !== undefined ? open : !navMenu.classList.contains('active');
            navMenu.classList.toggle('active', shouldOpen);
            menuToggle.classList.toggle('active', shouldOpen);
            menuToggle.setAttribute('aria-expanded', String(shouldOpen));
            document.body.style.overflow = shouldOpen ? 'hidden' : '';
        };

        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        // Close when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    toggleMenu(false);
                }
            });
        });

        // Close on clicking outside menu
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                toggleMenu(false);
            }
        });

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                toggleMenu(false);
                menuToggle.focus();
            }
        });
    }

    // -------------------------------------------------------------------------
    // 2. Active Section Scrollspy
    // -------------------------------------------------------------------------
    const sections = document.querySelectorAll('section[id]');
    const navbarHeight = 90;

    const highlightActiveSection = () => {
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - navbarHeight;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (correspondingLink) {
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    correspondingLink.classList.add('active');
                } else {
                    correspondingLink.classList.remove('active');
                }
            }
        });
    };

    window.addEventListener('scroll', highlightActiveSection, { passive: true });
    highlightActiveSection();

    // -------------------------------------------------------------------------
    // 3. View All Certificates Toggle
    // -------------------------------------------------------------------------
    const toggleCertBtn = document.getElementById('toggle-certificates-btn');
    const extraCertsWrapper = document.getElementById('extra-certificates');

    if (toggleCertBtn && extraCertsWrapper) {
        const toggleIcon = toggleCertBtn.querySelector('.toggle-icon');
        const toggleText = toggleCertBtn.querySelector('.toggle-btn-text');

        toggleCertBtn.addEventListener('click', () => {
            const isHidden = extraCertsWrapper.hasAttribute('hidden');

            if (isHidden) {
                extraCertsWrapper.removeAttribute('hidden');
                toggleCertBtn.setAttribute('aria-expanded', 'true');
                if (toggleText) toggleText.textContent = 'Show Less Certificates';
                if (toggleIcon) toggleIcon.classList.add('rotate');
            } else {
                extraCertsWrapper.setAttribute('hidden', '');
                toggleCertBtn.setAttribute('aria-expanded', 'false');
                if (toggleText) toggleText.textContent = 'View All Certificates (13)';
                if (toggleIcon) toggleIcon.classList.remove('rotate');
                // Scroll gently back to certificates header if user was down below
                const certsSection = document.getElementById('certificates');
                if (certsSection) {
                    certsSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }

    // -------------------------------------------------------------------------
    // 4. Certificate Lightbox Modal
    // -------------------------------------------------------------------------
    const certModal = document.getElementById('cert-modal');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalImg = document.getElementById('modal-cert-img');
    const modalTitle = document.getElementById('modal-cert-title');
    const modalIssuer = document.getElementById('modal-cert-issuer');
    const modalDate = document.getElementById('modal-cert-date');
    const modalPdfLink = document.getElementById('modal-cert-pdf');
    const modalVerifyBtn = document.getElementById('modal-cert-verify');

    let lastFocusedElement = null;

    const openCertModal = (triggerElement) => {
        lastFocusedElement = triggerElement;

        const title = triggerElement.getAttribute('data-cert-title') || 'Certificate';
        const issuer = triggerElement.getAttribute('data-cert-issuer') || '';
        const date = triggerElement.getAttribute('data-cert-date') || '';
        const imgSrc = triggerElement.getAttribute('data-cert-img') || '';
        const pdfHref = triggerElement.getAttribute('data-cert-pdf') || '#';
        const verifyHref = triggerElement.getAttribute('data-cert-verify') || '';

        if (modalTitle) modalTitle.textContent = title;
        if (modalIssuer) modalIssuer.textContent = issuer;
        if (modalDate) modalDate.innerHTML = `<i class="fa-regular fa-calendar" aria-hidden="true"></i> ${date}`;
        if (modalImg) {
            modalImg.src = imgSrc;
            modalImg.alt = `${title} Certificate Preview`;
        }
        if (modalPdfLink) {
            modalPdfLink.href = pdfHref;
        }

        if (modalVerifyBtn) {
            if (verifyHref) {
                modalVerifyBtn.href = verifyHref;
                modalVerifyBtn.removeAttribute('hidden');
            } else {
                modalVerifyBtn.setAttribute('hidden', '');
            }
        }

        certModal.removeAttribute('hidden');
        // Trigger transition next frame
        requestAnimationFrame(() => {
            certModal.classList.add('active');
            modalCloseBtn.focus();
            document.body.style.overflow = 'hidden';
        });
    };

    const closeCertModal = () => {
        if (!certModal) return;
        certModal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            certModal.setAttribute('hidden', '');
            if (lastFocusedElement) {
                lastFocusedElement.focus();
            }
        }, 300);
    };

    // Attach click triggers to all certificate cards & experience certificate buttons
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('.cert-thumbnail-btn, .btn-cert-modal, .btn-cert-link');
        if (trigger) {
            e.preventDefault();
            openCertModal(trigger);
        }
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeCertModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeCertModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && certModal && !certModal.hasAttribute('hidden')) {
            closeCertModal();
        }
    });

    // -------------------------------------------------------------------------
    // 5. Scroll Reveal Animation via IntersectionObserver
    // -------------------------------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px 0px -40px 0px',
            threshold: 0.12
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for browsers without IntersectionObserver
        revealElements.forEach(el => el.classList.add('reveal-visible'));
    }
});
