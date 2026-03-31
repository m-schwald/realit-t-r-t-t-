
(function (html) {

    'use strict';

    /* animations
    * -------------------------------------------------- */
    const tl = anime.timeline({
        easing: 'easeInOutCubic',
        duration: 800,
        autoplay: false
    })
        .add({
            targets: '#loader',
            opacity: 0,
            duration: 1000,
            begin: function (anim) {
                window.scrollTo(0, 0);
            }
        })
        .add({
            targets: '#preloader',
            opacity: 0,
            complete: function (anim) {
                document.querySelector("#preloader").style.visibility = "hidden";
                document.querySelector("#preloader").style.display = "none";
            }
        })
        .add({
            targets: ['.s-header__logo', '.s-header__menu-toggle'],
            opacity: [0, 1]
        }, '-=200')
        .add({
            targets: ['.s-intro__pretitle', '.s-intro__title', '.s-intro__subtitle', '.s-intro__more'],
            translateY: [100, 0],
            opacity: [0, 1],
            delay: anime.stagger(200)
        }, '-=400')
        .add({
            targets: ['.s-intro__social', '.s-intro__scroll'],
            opacity: [0, 1],
            delay: anime.stagger(200)
        }, '-=200');


    /* preloader
     * -------------------------------------------------- */
    const ssPreloader = function () {

        const preloader = document.querySelector('#preloader');
        if (!preloader) return;

        html.classList.add('ss-preload');

        window.addEventListener('load', function () {
            html.classList.remove('ss-preload');
            html.classList.add('ss-loaded');
            tl.play();
        });

    }; // end ssPreloader


    /* parallax
    * -------------------------------------------------- */
    const ssParallax = function () {

        const rellax = new Rellax('.rellax');

    }; // end ssParallax


    /* menu on scrolldown
     * ------------------------------------------------------ */
    const ssMenuOnScrolldown = function () {

        const menuToggle = document.querySelector('.s-header__menu-toggle');
        const triggerHeight = 150;


        window.addEventListener('scroll', function () {

            let loc = window.scrollY;

            if (loc > triggerHeight) {
                menuToggle.classList.add('opaque');
            } else {
                menuToggle.classList.remove('opaque');
            }

        });

    }; // menu on scrolldown


    /* offcanvas menu
     * ------------------------------------------------------ */
    const ssOffCanvas = function () {

        const menuToggle = document.querySelector('.s-header__menu-toggle');
        const nav = document.querySelector('.s-header__nav');
        const closeButton = document.querySelector('.s-header__nav-close-btn');
        const siteBody = document.querySelector('body');

        if (!(menuToggle && nav)) return;

        menuToggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            siteBody.classList.add('menu-is-open');
        });

        closeButton.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            if (siteBody.classList.contains('menu-is-open')) {
                siteBody.classList.remove('menu-is-open');
            }
        });

        siteBody.addEventListener('click', function (e) {
            if (!(e.target.matches('.s-header__nav, .smoothscroll'))) {
                closeButton.dispatchEvent(new Event('click'));
            }
        });

    }; // end ssOffcanvas


    /* animate elements if in viewport
     * ------------------------------------------------------ */
    const ssAnimateOnScroll = function () {

        const blocks = document.querySelectorAll('[data-animate-block]');
        if (!blocks) return;

        window.addEventListener('scroll', animateOnScroll);

        function animateOnScroll() {

            let scrollY = window.pageYOffset;

            blocks.forEach(function (current) {

                const viewportHeight = window.innerHeight;
                const triggerTop = (current.getBoundingClientRect().top + window.scrollY + (viewportHeight * .2)) - viewportHeight;
                const blockHeight = current.offsetHeight;
                const blockSpace = triggerTop + blockHeight;
                const inView = scrollY > triggerTop && scrollY <= blockSpace;
                const isAnimated = current.classList.contains('ss-animated');

                if (inView && (!isAnimated)) {

                    anime({
                        targets: current.querySelectorAll('[data-animate-el]'),
                        opacity: [0, 1],
                        translateY: [100, 0],
                        delay: anime.stagger(200, { start: 200 }),
                        duration: 800,
                        easing: 'easeInOutCubic',
                        begin: function (anim) {
                            current.classList.add('ss-animated');
                        }
                    });
                }
            });
        }

    }; // end ssAnimateOnScroll


    /* photoswipe
    * ----------------------------------------------------- */
    const ssPhotoswipe = function () {
        const folioItems = document.querySelectorAll('.folio-item');

        if (!folioItems) return;

        folioItems.forEach(function (folioItem, i) {

            let folio = folioItem;
            let thumb = folio.querySelector('.folio-item__thumb');
            let cat = folio.querySelector('.folio-item__cat');
            folio.dataset.index = i;
            let catText = cat.innerHTML;
            const catElement = document.createElement('div');
            catElement.className = 'folio-item__thumb__cat';
            catElement.innerHTML = catText;
            thumb.appendChild(catElement);
        });
    };  // end ssPhotoSwipe

    /* Back to Top
    * ------------------------------------------------------ */
    const ssBackToTop = function () {

        const pxShow = 900;
        const goTopButton = document.querySelector(".ss-go-top");

        if (!goTopButton) return;

        // Show or hide the button
        if (window.scrollY >= pxShow) goTopButton.classList.add("link-is-visible");

        window.addEventListener('scroll', function () {
            if (window.scrollY >= pxShow) {
                if (!goTopButton.classList.contains('link-is-visible')) goTopButton.classList.add("link-is-visible")
            } else {
                goTopButton.classList.remove("link-is-visible")
            }
        });

    }; // end ssBackToTop



    /* smoothscroll
     * ------------------------------------------------------ */
    const ssMoveTo = function () {

        const siteBody = document.querySelector('body');

        const easeFunctions = {
            easeInQuad: function (t, b, c, d) {
                t /= d;
                return c * t * t + b;
            },
            easeOutQuad: function (t, b, c, d) {
                t /= d;
                return -c * t * (t - 2) + b;
            },
            easeInOutQuad: function (t, b, c, d) {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t + b;
                t--;
                return -c / 2 * (t * (t - 2) - 1) + b;
            },
            easeInOutCubic: function (t, b, c, d) {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t * t + b;
                t -= 2;
                return c / 2 * (t * t * t + 2) + b;
            }
        }

        const triggers = document.querySelectorAll('.smoothscroll');

        const moveTo = new MoveTo({
            tolerance: 0,
            duration: 1200,
            easing: 'easeInOutCubic',
            container: window,
            callback: function (target) {
                if (siteBody.classList.contains('menu-is-open')) {
                    siteBody.classList.remove('menu-is-open');
                }
            }
        }, easeFunctions);

        triggers.forEach(function (trigger) {
            moveTo.registerTrigger(trigger);
        });

    }; // end ssMoveTo

    /* curved title
        * ------------------------------------------------------ */
    const ssCurve = function () {
        const el = document.getElementById("curveText");
        if (!el) return;

        const text = el.innerText || el.textContent || "";
        if (!text) return;

        el.innerHTML = "";

        const palettes = {
            primary: ['--primary-1', '--primary-2', '--primary-3'],
            /* secondary: ['--secondary-1','--secondary-2','--secondary-3'], */
            accent: ['--accent-1', '--accent-2']
        };

        const spans = [];

        text.split("").forEach((char, i) => {
            const span = document.createElement("span");
            span.classList.add("glitch");
            // preserve spaces
            const displayChar = char === " " ? "\u00A0" : char;
            span.innerText = displayChar;
            // ensure pseudo-elements have the same text
            span.setAttribute('data-text', displayChar);
            span.style.display = "inline-block";

            // Mitte berechnen
            const offset = i - text.length / 2;

            // Krümmung + Perspektive
            // determine desktop vs mobile and compute base translateY
            let baseTranslateY;
            if (window.innerWidth >= 600) { // desktop
                baseTranslateY = Math.abs(offset) * -14; // desktop: stronger curvature
            } else { // mobile
                baseTranslateY = Math.abs(offset) * -5; // mobile: gentler curvature
            }
            const baseRotate = offset * -4;
            const baseScale = 1 - Math.abs(offset) * 0.05;
            span.style.transform = `translateY(${baseTranslateY}px) rotate(${baseRotate}deg) scale(${baseScale})`;
            // store numeric base values for subtle animation
            span.dataset.baseTranslateY = baseTranslateY;
            span.dataset.baseRotate = baseRotate;
            span.dataset.baseScale = baseScale;

            // zufällige Farbgruppe wählen (primary / secondary / accent)
            const groups = Object.keys(palettes);
            const group = groups[Math.floor(Math.random() * groups.length)];
            const variants = palettes[group];
            const cssVar = variants[Math.floor(Math.random() * variants.length)];
            span.style.color = `var(${cssVar})`;
            el.appendChild(span);
            spans.push(span);
        });

        // Lightweight animation loop for subtle per-letter movement and hue shifts
        if (spans.length) {
            // helper: convert rgb() string to HSL
            function rgbStringToHsl(rgbStr) {
                const m = rgbStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
                if (!m) return [0, 0, 0];
                let r = parseInt(m[1], 10) / 255;
                let g = parseInt(m[2], 10) / 255;
                let b = parseInt(m[3], 10) / 255;
                const max = Math.max(r, g, b), min = Math.min(r, g, b);
                let h, s, l = (max + min) / 2;
                if (max === min) {
                    h = s = 0;
                } else {
                    const d = max - min;
                    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                    switch (max) {
                        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                        case g: h = (b - r) / d + 2; break;
                        case b: h = (r - g) / d + 4; break;
                    }
                    h = h * 60;
                }
                return [h || 0, Math.round(s * 100), Math.round(l * 100)];
            }

            // measure base HSL for each span and assign random params
            spans.forEach(s => {
                const cs = getComputedStyle(s).color;
                const hsl = rgbStringToHsl(cs);
                s._baseH = hsl[0];
                s._baseS = hsl[1];
                s._baseL = hsl[2];

                s._ampY = (Math.random() * 4) + 1; // px
                s._ampR = (Math.random() * 2) + 0.5; // deg
                s._speed = (Math.random() * 0.8) + 0.6; // oscillation speed
                s._phase = Math.random() * Math.PI * 2;
                s._hueShift = (Math.random() * 18) + 4; // deg max hue shift (slightly larger)
            });

            let start = performance.now();
            function animate(now) {
                const t = (now - start) / 1000;
                spans.forEach(s => {
                    const phase = t * s._speed + s._phase;
                    const dy = Math.sin(phase) * s._ampY;
                    const dr = Math.sin(phase * 0.9) * s._ampR;

                    const baseY = parseFloat(s.dataset.baseTranslateY) || 0;
                    const baseR = parseFloat(s.dataset.baseRotate) || 0;
                    const baseS = parseFloat(s.dataset.baseScale) || 1;

                    s.style.transform = `translateY(${baseY + dy}px) rotate(${baseR + dr}deg) scale(${baseS})`;

                    // compute hue-shifted color and update both text and pseudo-elements
                    const hueOffset = Math.sin(phase * 0.7) * s._hueShift;
                    const newH = (s._baseH + hueOffset + 360) % 360;
                    const textColor = `hsl(${Math.round(newH)} ${s._baseS}% ${s._baseL}%)`;
                    s.style.color = textColor;

                    // subtle variants for pseudo-elements
                    const beforeColor = `hsl(${Math.round((newH + 6) % 360)} ${Math.max(15, s._baseS - 10)}% ${Math.max(10, s._baseL - 10)}%)`;
                    const afterColor = `hsl(${Math.round((newH - 6 + 360) % 360)} ${Math.max(10, s._baseS - 20)}% ${Math.max(6, s._baseL - 18)}%)`;
                    s.style.setProperty('--glitch-before', beforeColor);
                    s.style.setProperty('--glitch-after', afterColor);
                });
                requestAnimationFrame(animate);
            }

            requestAnimationFrame(animate);
        }
    };




    /* Initialize
     * ------------------------------------------------------ */
    (function ssInit() {

        ssPreloader();
        ssParallax();
        ssMenuOnScrolldown();
        ssAnimateOnScroll();
        ssOffCanvas();
        ssPhotoswipe();
        ssBackToTop();
        ssMoveTo();
        ssCurve();
    })();

    /* Simple accordion built from the .folio-item sections
     * This creates a mobile-friendly list of toggles using the
     * thumbnail image as icon, the category as headline and the
     * .folio-item__title content as the body.
     */
    const ssAccordion = function () {
        const container = document.getElementById('info-accordion');
        if (!container) return;

        const folios = document.querySelectorAll('.folio-list .folio-item');
        if (!folios || folios.length === 0) return;

        folios.forEach(function (folio, i) {
            const thumbImgEl = folio.querySelector('.folio-item__thumb img');
            const iconSrc = thumbImgEl ? thumbImgEl.getAttribute('src') : '';
            const catEl = folio.querySelector('.folio-item__cat');
            const title = catEl ? catEl.textContent.trim() : ('Item ' + (i + 1));
            const contentEl = folio.querySelector('.folio-item__title');
            const contentHTML = contentEl ? contentEl.innerHTML : '';

            const item = document.createElement('div');
            item.className = 'accordion-item';

            const header = document.createElement('button');
            header.type = 'button';
            header.className = 'accordion-header';
            if (i % 2 !== 0) {
                header.classList.add('reverse');
            }
            header.setAttribute('aria-expanded', 'false');

            const iconWrap = document.createElement('span');
            iconWrap.className = 'accordion-icon';
            const img = document.createElement('img');
            img.src = iconSrc || '';
            img.alt = '';
            iconWrap.appendChild(img);

            const h = document.createElement('div');
            h.className = 'accordion-title';
            h.innerText = title;

            const indicator = document.createElement('span');
            indicator.className = 'accordion-toggle-indicator';
            indicator.innerText = '+';

            header.appendChild(iconWrap);
            header.appendChild(h);
            header.appendChild(indicator);

            const body = document.createElement('div');
            body.className = 'accordion-content';
            body.innerHTML = contentHTML;

            header.addEventListener('click', function () {
                const expanded = header.getAttribute('aria-expanded') === 'true';

                if (!expanded) {
                    header.setAttribute('aria-expanded', 'true');
                    indicator.innerText = '\u2212'; // en dash as minus
                    body.classList.add('open');

                    // wait for images to load and next frame to get accurate scrollHeight
                    const imgs = body.querySelectorAll('img');
                    const setHeight = () => {
                        // add tiny buffer in case of subpixel rounding
                        body.style.maxHeight = (body.scrollHeight + 64) + 'px';
                    };

                    if (imgs.length) {
                        const promises = Array.from(imgs).map(img => new Promise(res => {
                            if (img.complete) return res();
                            img.addEventListener('load', res);
                            img.addEventListener('error', res);
                        }));
                        Promise.all(promises).then(() => requestAnimationFrame(setHeight));
                    } else {
                        requestAnimationFrame(setHeight);
                    }

                } else {
                    header.setAttribute('aria-expanded', 'false');
                    indicator.innerText = '+';
                    body.style.maxHeight = null;
                    body.classList.remove('open');
                }
            });

            // keyboard support
            header.addEventListener('keydown', function (ev) {
                if (ev.key === 'Enter' || ev.key === ' ') {
                    ev.preventDefault();
                    header.click();
                }
            });

            item.appendChild(header);
            item.appendChild(body);
            container.appendChild(item);
        });
    };

    // initialize accordion after function declaration
    ssAccordion();

})(document.documentElement);