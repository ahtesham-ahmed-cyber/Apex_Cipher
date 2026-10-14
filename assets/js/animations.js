/* ============================================================
 A PEX CIPHER — Anim*ations

 Shared motion behaviour:

 - enables the scroll-reveal system by adding the
 js-reveal-ready class to <html>, which activates the
 reveal styles defined in animations.css
 - observes [data-reveal] elements with IntersectionObserver
 and adds .is-visible once each element enters view
 - applies staggered delays from [data-reveal-delay]
 - drives the pointer-following highlight defined by the
 [data-pointer-light] attribute

 Every effect here is decorative. Content must remain fully
 readable and reachable when JavaScript is unavailable, when
 IntersectionObserver is unsupported, or when the user
 prefers reduced motion.
 ============================================================ */

(function (window, document) {
    "use strict";

    var config = window.APEX_CONFIG || {};
    var animConfig = config.animations || {};
    var revealConfig = animConfig.reveal || {};
    var interactionsConfig = config.interactions || {};
    var pointerLightConfig = interactionsConfig.pointerLight || {};

    var CLASS_REVEAL_READY = "js-reveal-ready";
    var CLASS_VISIBLE = "is-visible";

    var supportsObserver = "IntersectionObserver" in window;

    var observer = null;
    var observedElements = [];

    /* ----------------------------------------------------------
     E nvironment chec*ks
     ---------------------------------------------------------- */

    function prefersReducedMotion() {
        return window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
    }

    function isFinePointer() {
        return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    }

    /* ----------------------------------------------------------
     S croll reveal   *
     ---------------------------------------------------------- */

    function revealImmediately(elements) {
        Array.prototype.forEach.call(elements, function (element) {
            element.classList.add(CLASS_VISIBLE);
        });
    }

    function buildObserver() {
        var threshold =
        typeof revealConfig.threshold === "number"
        ? revealConfig.threshold
        : 0.15;

        var rootMargin =
        typeof revealConfig.rootMargin === "string"
        ? revealConfig.rootMargin
        : "0px 0px -8% 0px";

        var once = revealConfig.once !== false;

        return new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(CLASS_VISIBLE);

                        if (once && observer) {
                            observer.unobserve(entry.target);
                        }
                    } else if (!once) {
                        entry.target.classList.remove(CLASS_VISIBLE);
                    }
                });
            },
            {
                threshold: threshold,
                rootMargin: rootMargin
            }
        );
    }

    function initScrollReveal() {
        var elements = document.querySelectorAll("[data-reveal]");

        if (!elements.length) {
            return;
        }

        /* Reduced motion or missing API: reveal everything at once
         s o no content *is ever hidden behind an animation the user
         cannot receive. */
        if (!supportsObserver || prefersReducedMotion()) {
            revealImmediately(elements);
            return;
        }

        /* Activate the reveal styles only now that we know we can
         drive them, ot*herwise content would remain invisible. */
        document.documentElement.classList.add(CLASS_REVEAL_READY);

        observer = buildObserver();
        observedElements = [];

        Array.prototype.forEach.call(elements, function (element) {
            observer.observe(element);
            observedElements.push(element);
        });
    }

    /**
     * Allows later scripts (for example, a filter module that
     * injects cards) to register newly created elements with the
     * reveal system without reinitialising the observer.
     */
    function observeNewElements(root) {
        if (!observer) {
            return;
        }

        var scope = root && root.querySelectorAll ? root : document;
        var elements = scope.querySelectorAll("[data-reveal]:not(.is-visible)");

        Array.prototype.forEach.call(elements, function (element) {
            observer.observe(element);
            observedElements.push(element);
        });
    }

    /* ----------------------------------------------------------
     P ointer-followin*g highlight
     ---------------------------------------------------------- */

    function writePointerPosition(element, event) {
        var rect = element.getBoundingClientRect();

        if (!rect.width || !rect.height) {
            return;
        }

        var x = ((event.clientX - rect.left) / rect.width) * 100;
        var y = ((event.clientY - rect.top) / rect.height) * 100;

        /* Clamp so the highlight never runs past the element edges. */
        x = Math.max(0, Math.min(100, x));
        y = Math.max(0, Math.min(100, y));

        element.style.setProperty("--pointer-x", x + "%");
        element.style.setProperty("--pointer-y", y + "%");
    }

    function handlePointerMove(event) {
        writePointerPosition(event.currentTarget, event);
    }

    function handlePointerLeave(event) {
        var element = event.currentTarget;
        element.style.removeProperty("--pointer-x");
        element.style.removeProperty("--pointer-y");
    }

    function initPointerLight() {
        if (pointerLightConfig.enabled === false) {
            return;
        }

        if (prefersReducedMotion() || !isFinePointer()) {
            return;
        }

        var elements = document.querySelectorAll("[data-pointer-light]");

        if (!elements.length) {
            return;
        }

        Array.prototype.forEach.call(elements, function (element) {
            element.addEventListener("pointermove", handlePointerMove, {
                passive: true
            });
            element.addEventListener("pointerleave", handlePointerLeave, {
                passive: true
            });
        });
    }

    /* ----------------------------------------------------------
     R eactive motion *preference
     If the user changes their reduced-motion preference while
     the page is open, reveal anything still hidden and stop the
     observer so no element is left invisible.
     ---------------------------------------------------------- */

    function handleMotionPreferenceChange(event) {
        if (!event.matches) {
            return;
        }

        if (observer) {
            Array.prototype.forEach.call(observedElements, function (element) {
                element.classList.add(CLASS_VISIBLE);
                observer.unobserve(element);
            });

            observer.disconnect();
            observer = null;
            observedElements = [];
        } else {
            revealImmediately(document.querySelectorAll("[data-reveal]"));
        }
    }

    function watchMotionPreference() {
        if (!window.matchMedia) {
            return;
        }

        var query = window.matchMedia("(prefers-reduced-motion: reduce)");

        if (typeof query.addEventListener === "function") {
            query.addEventListener("change", handleMotionPreferenceChange);
        } else if (typeof query.addListener === "function") {
            /* Safari < 14 fallback. */
            query.addListener(handleMotionPreferenceChange);
        }
    }

    /* ----------------------------------------------------------
     I nitialisation  *
     ---------------------------------------------------------- */

    function init() {
        initScrollReveal();
        initPointerLight();
        watchMotionPreference();
    }

    window.APEX_ANIMATIONS = {
        observeNewElements: observeNewElements,
        revealAll: function () {
            revealImmediately(document.querySelectorAll("[data-reveal]"));
        }
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }

})(window, document);
