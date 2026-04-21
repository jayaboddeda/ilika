// Initialize AOS animations
AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 50
});

// Gallery lightbox
(function () {
    const items = Array.from(document.querySelectorAll('.gallery-item'));
    const lb = document.getElementById('lightbox');
    if (!items.length || !lb) return;

    const lbImage = document.getElementById('lb-image');
    const lbCaption = document.getElementById('lb-caption');
    const lbCounter = document.getElementById('lb-counter');
    const btnClose = document.getElementById('lb-close');
    const btnPrev = document.getElementById('lb-prev');
    const btnNext = document.getElementById('lb-next');

    let current = 0;

    function show(index) {
        current = (index + items.length) % items.length;
        const el = items[current];
        const src = el.dataset.src || el.querySelector('img').src;
        const caption = el.dataset.caption || '';

        lbImage.style.opacity = '0';
        const loader = new Image();
        loader.onload = () => {
            lbImage.src = src;
            lbImage.alt = caption;
            lbImage.style.opacity = '1';
        };
        loader.onerror = () => {
            lbImage.src = src;
            lbImage.style.opacity = '1';
        };
        loader.src = src;

        lbCaption.textContent = caption;
        lbCounter.textContent = (current + 1) + ' / ' + items.length;
    }

    function open(index) {
        show(index);
        lb.classList.remove('hidden');
        lb.classList.add('flex');
        requestAnimationFrame(() => { lb.style.opacity = '1'; });
        document.body.style.overflow = 'hidden';
    }

    function close() {
        lb.style.opacity = '0';
        setTimeout(() => {
            lb.classList.add('hidden');
            lb.classList.remove('flex');
        }, 300);
        document.body.style.overflow = '';
    }

    items.forEach((el, i) => el.addEventListener('click', () => open(i)));
    btnClose.addEventListener('click', close);
    btnPrev.addEventListener('click', (e) => { e.stopPropagation(); show(current - 1); });
    btnNext.addEventListener('click', (e) => { e.stopPropagation(); show(current + 1); });

    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });

    document.addEventListener('keydown', (e) => {
        if (lb.classList.contains('hidden')) return;
        if (e.key === 'Escape') close();
        else if (e.key === 'ArrowLeft') show(current - 1);
        else if (e.key === 'ArrowRight') show(current + 1);
    });

    // Touch swipe
    let touchStartX = 0;
    lb.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    lb.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].screenX - touchStartX;
        if (Math.abs(dx) > 50) show(dx < 0 ? current + 1 : current - 1);
    }, { passive: true });
})();

// Mobile offcanvas menu
(function () {
    const toggle = document.getElementById('mobile-menu-toggle');
    const closeBtn = document.getElementById('mobile-menu-close');
    const menu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('mobile-menu-overlay');
    if (!toggle || !menu || !overlay) return;

    const links = menu.querySelectorAll('.mobile-nav-link');

    function openMenu() {
        menu.classList.remove('translate-x-full');
        menu.setAttribute('aria-hidden', 'false');
        toggle.setAttribute('aria-expanded', 'true');
        overlay.classList.remove('hidden');
        requestAnimationFrame(() => {
            overlay.classList.remove('opacity-0');
            overlay.classList.add('opacity-100');
        });
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        menu.classList.add('translate-x-full');
        menu.setAttribute('aria-hidden', 'true');
        toggle.setAttribute('aria-expanded', 'false');
        overlay.classList.add('opacity-0');
        overlay.classList.remove('opacity-100');
        setTimeout(() => overlay.classList.add('hidden'), 300);
        document.body.style.overflow = '';
    }

    toggle.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);
    links.forEach(link => link.addEventListener('click', closeMenu));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !menu.classList.contains('translate-x-full')) closeMenu();
    });
})();

// Smart Header logic
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    const inner = document.getElementById('header-inner');
    if (window.scrollY > 50) {
        header.classList.add('shadow-lg');
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        inner.style.paddingTop = '6px';
        inner.style.paddingBottom = '6px';
    } else {
        header.classList.remove('shadow-lg');
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        inner.style.paddingTop = '';
        inner.style.paddingBottom = '';
    }
});
