/* ============================================================
 A PEX CIPHER — Main*

 The last script in the load order. Its responsibilities are
 deliberately limited:

 - mark the document as JavaScript-ready so progressive
 enhancement styles can activate safely
 - fill in the current year wherever [data-current-year] is
 present in the footer
 - provide a single, small namespace (window.APEX_SITE) that
 other scripts or future integrators can use for debug
 information
 - confirm that every expected module has registered and log
 a concise warning when one has not

 All component behaviour lives in its own module:

 navigation.js    primary and mobile navigation
 animations.js    scroll reveals and pointer lighting
 cards.js         pointer-driven tilt
 filters.js       client-side index filtering
 faq.js           accessible accordions
 forms.js         contact form validation and demo status

     This file must never re-implement any of those behaviours.
     ============================================================ */

(function (window, document) {
    "use strict";

    var config = window.APEX_CONFIG || {};
    var pageHeroConfig = config.pageHeroSlides || {};
    var environment = config.environment || {};

    var SELECTOR_YEAR = "[data-current-year]";

    /* ----------------------------------------------------------
     D ocument readine*ss marker
     Set on <html> so progressive-enhancement styles can target
     it. This is intentionally distinct from the more specific
     js-nav-ready and js-reveal-ready flags that the navigation
     and animation modules add for their own purposes.
     ---------------------------------------------------------- */

    var CLASS_JS_READY = "js-ready";

    function markDocumentReady() {
        document.documentElement.classList.add(CLASS_JS_READY);
    }

    /* ----------------------------------------------------------
     F ooter year     *
     Fills every [data-current-year] element with the current
     four-digit year. The static value in the HTML acts as a
     fallback for users without JavaScript.
     ---------------------------------------------------------- */

    function updateCurrentYear() {
        var targets = document.querySelectorAll(SELECTOR_YEAR);

        if (!targets.length) {
            return;
        }

        var year = String(new Date().getFullYear());

        Array.prototype.forEach.call(targets, function (element) {
            element.textContent = year;
        });
    }

    /* ----------------------------------------------------------
     P age hero sliders
     Rotates each page-level hero section using its own slide set
     so every content page has an automatic, synchronized image and
     copy cycle without replacing the existing homepage slider.
     ---------------------------------------------------------- */

    function getPageHeroSlug() {
        var path = (window.location.pathname || "").replace(/\\/g, "/");
        var pageName = path.split("/").filter(Boolean).pop() || "index.html";
        var pageSlug = pageName.replace(/\.html?$/i, "").toLowerCase();

        if (pageSlug === "404") {
            return "not-found";
        }

        return pageSlug === "index" ? "" : pageSlug;
    }

    function initPageHeroSliders() {
        var pageSlug = getPageHeroSlug();
        var slides = pageHeroConfig && pageHeroConfig[pageSlug];
        var hero = document.querySelector(".page-hero");

        if (!pageSlug || !slides || !Array.isArray(slides) || !hero || hero.dataset.pageHeroReady === "true") {
            return;
        }

        var inner = hero.querySelector(".page-hero__inner");
        var media = hero.querySelector(".page-hero__media");
        var mediaFrame = media && media.querySelector(".page-hero__media-frame");
        var image = mediaFrame && mediaFrame.querySelector(".page-hero-image");
        var eyebrow = inner && inner.querySelector(".eyebrow");
        var title = inner && inner.querySelector(".page-hero__title");
        var lead = inner && inner.querySelector(".page-hero__lead");
        var meta = inner && inner.querySelector(".page-hero__meta");

        if (!inner || !media || !mediaFrame || !image || !eyebrow || !title || !lead) {
            return;
        }

        var cta = inner.querySelector(".page-hero__cta") || inner.querySelector(".hero__actions .btn--primary");
        if (!cta) {
            cta = document.createElement("a");
            cta.className = "btn btn--primary page-hero__cta";
            inner.appendChild(cta);
        } else {
            cta.classList.add("page-hero__cta");
        }

        var dots = [];
        var activeIndex = 0;
        var timerId = null;
        var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

        function updateDots(nextIndex) {
            dots.forEach(function (dot, index) {
                var isActive = index === nextIndex;
                dot.classList.toggle("is-active", isActive);
                dot.setAttribute("aria-current", isActive ? "true" : "false");
            });
        }

        function renderDots() {
            var dotWrap = hero.querySelector(".page-hero__dots");
            if (!dotWrap) {
                dotWrap = document.createElement("div");
                dotWrap.className = "page-hero__dots";
                mediaFrame.parentNode.insertBefore(dotWrap, mediaFrame.nextSibling);
            }

            dotWrap.innerHTML = slides.map(function (slide, index) {
                return '<button type="button" class="page-hero__dot' + (index === 0 ? " is-active" : "") + '" data-page-hero-dot="' + index + '" aria-label="Show slide ' + (index + 1) + '" aria-current="' + (index === 0 ? "true" : "false") + '"></button>';
            }).join("");

            dots = Array.prototype.slice.call(dotWrap.querySelectorAll("[data-page-hero-dot]"));
            dots.forEach(function (dot, index) {
                dot.addEventListener("click", function () {
                    updatePageHero(index);
                    startAutoplay();
                });
            });
        }

        function updatePageHero(index) {
            var nextIndex = (index + slides.length) % slides.length;
            var slide = slides[nextIndex];
            activeIndex = nextIndex;

            if (slide.eyebrow) {
                eyebrow.innerHTML = '<span class="eyebrow__dot" aria-hidden="true"></span>' + slide.eyebrow;
            }

            if (slide.title) {
                title.innerHTML = slide.title;
            }

            if (slide.description) {
                lead.textContent = slide.description;
            }

            if (meta && Array.isArray(slide.meta) && slide.meta.length) {
                meta.innerHTML = slide.meta.map(function (item) { return "<li>" + item + "</li>"; }).join("");
            }

            if (slide.image) {
                image.src = slide.image;
            }

            if (slide.alt) {
                image.alt = slide.alt;
            }

            if (slide.srcset) {
                image.setAttribute("srcset", slide.srcset);
            } else {
                image.removeAttribute("srcset");
            }

            if (slide.ctaHref) {
                cta.setAttribute("href", slide.ctaHref);
            }

            if (slide.ctaLabel) {
                cta.textContent = slide.ctaLabel;
            }

            updateDots(activeIndex);
        }

        function stopAutoplay() {
            if (timerId) {
                window.clearInterval(timerId);
                timerId = null;
            }
        }

        function startAutoplay() {
            if (reducedMotion.matches || slides.length < 2) {
                return;
            }

            stopAutoplay();
            timerId = window.setInterval(function () {
                updatePageHero(activeIndex + 1);
            }, 5000);
        }

        function handleMotionChange() {
            if (reducedMotion.matches) {
                stopAutoplay();
                return;
            }
            startAutoplay();
        }

        hero.dataset.pageHeroReady = "true";
        renderDots();
        updatePageHero(0);

        hero.addEventListener("mouseenter", stopAutoplay);
        hero.addEventListener("mouseleave", startAutoplay);
        hero.addEventListener("focusin", stopAutoplay);
        hero.addEventListener("focusout", function (event) {
            if (!hero.contains(event.relatedTarget)) {
                startAutoplay();
            }
        });

        if (typeof reducedMotion.addEventListener === "function") {
            reducedMotion.addEventListener("change", handleMotionChange);
        } else if (typeof reducedMotion.addListener === "function") {
            reducedMotion.addListener(handleMotionChange);
        }

        startAutoplay();
    }

    /* ----------------------------------------------------------
     H orizontal card carousels
     Converts the major card collections into compact horizontal
     scroll areas with consistent left/right controls where the
     layout is intended to behave like a carousel rather than a
     static grid.
     ---------------------------------------------------------- */

    function initHorizontalCardCarousels() {
        var selectors = [
            ".work-grid",
            ".grid--industries",
            ".insight-grid",
            ".portfolio-grid",
            ".value-grid"
        ];

        document.querySelectorAll(selectors.join(",")).forEach(function (group) {
            if (!group || group.dataset.carouselReady === "true") {
                return;
            }

            var items = Array.prototype.slice.call(group.children);
            if (items.length < 2) {
                return;
            }

            var shell = document.createElement("div");
            shell.className = "carousel-shell";

            var nav = document.createElement("div");
            nav.className = "carousel-nav";
            nav.setAttribute("aria-label", "Card carousel controls");

            var prev = document.createElement("button");
            prev.type = "button";
            prev.className = "carousel-arrow carousel-arrow--prev";
            prev.setAttribute("aria-label", "Previous cards");
            prev.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg>';

            var next = document.createElement("button");
            next.type = "button";
            next.className = "carousel-arrow carousel-arrow--next";
            next.setAttribute("aria-label", "Next cards");
            next.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg>';

            nav.appendChild(prev);
            nav.appendChild(next);

            if (group.parentNode) {
                group.parentNode.insertBefore(shell, group);
            }

            shell.appendChild(group);
            shell.appendChild(nav);
            group.classList.add("carousel-track");
            group.dataset.carouselReady = "true";

            function getStep() {
                var firstItem = items[0];
                if (!firstItem) {
                    return 260;
                }

                var styles = window.getComputedStyle(group);
                var gap = parseFloat(styles.columnGap || styles.gap || "24");
                return Math.max(firstItem.getBoundingClientRect().width + gap, 260);
            }

            function updateButtons() {
                var maxScroll = Math.max(group.scrollWidth - group.clientWidth, 0);
                prev.disabled = group.scrollLeft <= 4;
                next.disabled = group.scrollLeft >= maxScroll - 4;
                prev.setAttribute("aria-disabled", prev.disabled ? "true" : "false");
                next.setAttribute("aria-disabled", next.disabled ? "true" : "false");
                prev.classList.toggle("is-hidden", prev.disabled);
                next.classList.toggle("is-hidden", next.disabled);
            }

            prev.addEventListener("click", function () {
                group.scrollBy({ left: -getStep(), behavior: "smooth" });
            });

            next.addEventListener("click", function () {
                group.scrollBy({ left: getStep(), behavior: "smooth" });
            });

            group.addEventListener("scroll", updateButtons, { passive: true });
            window.addEventListener("resize", updateButtons);
            updateButtons();

            var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
            group.style.scrollBehavior = reducedMotion.matches ? "auto" : "smooth";

            if (reducedMotion.addEventListener) {
                reducedMotion.addEventListener("change", function () {
                    group.style.scrollBehavior = reducedMotion.matches ? "auto" : "smooth";
                });
            }
        });
    }

    /* ----------------------------------------------------------
     M odule presence *check
     Logs a concise warning when an expected module has not
     registered. This is helpful during development and for
     anyone integrating the project into a larger build. It does
     not affect the page and is silent when debug is disabled.
     ---------------------------------------------------------- */

    function checkModules() {
        if (environment.debug !== true) {
            return;
        }

        var expected = [
            { name: "APEX_CONFIG", value: window.APEX_CONFIG },
            { name: "APEX_API", value: window.APEX_API },
            { name: "APEX_NAV", value: window.APEX_NAV },
            { name: "APEX_ANIMATIONS", value: window.APEX_ANIMATIONS },
            { name: "APEX_CARDS", value: window.APEX_CARDS },
            { name: "APEX_FILTERS", value: window.APEX_FILTERS },
            { name: "APEX_FAQ", value: window.APEX_FAQ },
            { name: "APEX_FORMS", value: window.APEX_FORMS }
        ];

        var missing = [];

        expected.forEach(function (entry) {
            if (!entry.value) {
                missing.push(entry.name);
            }
        });

        if (missing.length && window.console && typeof window.console.warn === "function") {
            window.console.warn(
                "APEX CIPHER: the following modules did not register: " +
                missing.join(", ")
            );
        }
    }

    /* ----------------------------------------------------------
     S mall shared uti*lities
     Exposed through window.APEX_SITE so no module needs to
     duplicate these helpers. Kept intentionally minimal.
     ---------------------------------------------------------- */

    /**
     * Reads the current scroll offset in a way that works across
     * browsers without assuming documentElement is the scrolling
     * element.
     *
     * @returns {number}
     */
    function getScrollTop() {
        if (typeof window.pageYOffset === "number") {
            return window.pageYOffset;
        }

        return (
            document.documentElement.scrollTop ||
            document.body.scrollTop ||
            0
        );
    }

    /**
     * Safe querySelectorAll wrapper that always returns a real
     * array so callers can use forEach without a guard.
     *
     * @param {string} selector
     * @param {ParentNode} [scope]
     * @returns {Element[]}
     */
    function queryAll(selector, scope) {
        var root = scope && scope.querySelectorAll ? scope : document;

        return Array.prototype.slice.call(root.querySelectorAll(selector));
    }

    /**
     * Reports whether the user has requested reduced motion.
     * Several modules perform their own check; this helper exists
     * for future additions and for debug output.
     *
     * @returns {boolean}
     */
    function prefersReducedMotion() {
        return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    /* ----------------------------------------------------------
     D ebug summary   *
     Prints a single, terse line summarising the runtime state
     when debug is enabled. Nothing is logged otherwise.
     ---------------------------------------------------------- */

    function logSummary() {
        if (environment.debug !== true) {
            return;
        }

        if (!window.console || typeof window.console.info !== "function") {
            return;
        }

        var apiStatus =
        window.APEX_API && typeof window.APEX_API.getStatus === "function"
        ? window.APEX_API.getStatus()
        : { static: true, enabled: false };

        window.console.info(
            "APEX CIPHER ready.",
            {
                static: apiStatus.static,
                reducedMotion: prefersReducedMotion(),
                            revealSystem: document.documentElement.classList.contains(
                                "js-reveal-ready"
                            )
            }
        );
    }

    /* ----------------------------------------------------------
     I nitialisation  *
     ---------------------------------------------------------- */

    function init() {
        markDocumentReady();
        updateCurrentYear();
        initPageHeroSliders();
        initHorizontalCardCarousels();
        checkModules();
        logSummary();
    }

    /* The main script is loaded with defer, so the DOM is already
     p arsed by the ti*me this runs. The readyState check exists as
     a safety net for unusual embedding scenarios. */
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }

    window.APEX_SITE = {
        getScrollTop: getScrollTop,
 queryAll: queryAll,
 prefersReducedMotion: prefersReducedMotion,
 updateCurrentYear: updateCurrentYear
    };

})(window, document);
