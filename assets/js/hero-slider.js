(function (window, document) {
    "use strict";

    var config = window.APEX_CONFIG || {};
    var sliderConfig = config.heroSlider || {};
    var slideData = Array.isArray(sliderConfig.slides) && sliderConfig.slides.length ? sliderConfig.slides : [];
    var intervalMs = Number(sliderConfig.intervalMs || 5000);
    var root = document.querySelector("[data-hero-slider]");

    if (!root || !slideData.length) {
        return;
    }

    var slideTrack = root.querySelector("[data-hero-slides]");
    var indicatorTrack = root.querySelector("[data-hero-indicators]");
    var eyebrowEl = document.querySelector("[data-hero-eyebrow]");
    var titleEl = document.querySelector("[data-hero-title]");
    var leadEl = document.querySelector("[data-hero-lead]");
    var primaryCta = document.querySelector("[data-hero-primary-cta]");
    var reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!slideTrack || !eyebrowEl || !titleEl || !leadEl || !primaryCta) {
        return;
    }

    var slideEls = [];
    var dots = [];
    var activeIndex = 0;
    var timerId = null;

    function makeSvgIcon() {
        return '<svg class="btn__icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
    }

    function stopAutoplay() {
        if (timerId) {
            window.clearInterval(timerId);
            timerId = null;
        }
    }

    function startAutoplay() {
        if (reducedMotionQuery.matches || slideData.length < 2 || timerId) {
            return;
        }

        timerId = window.setInterval(function () {
            activeIndex = (activeIndex + 1) % slideData.length;
            updateSlide(activeIndex);
        }, intervalMs);
    }

    function updateIndicators(nextIndex) {
        dots.forEach(function (dot, index) {
            var isActive = index === nextIndex;
            dot.classList.toggle("is-active", isActive);
            dot.setAttribute("aria-current", isActive ? "true" : "false");
        });
    }

    function updateSlide(nextIndex) {
        activeIndex = (nextIndex + slideData.length) % slideData.length;

        slideEls.forEach(function (slideEl, index) {
            slideEl.classList.toggle("is-active", index === activeIndex);
        });

        var currentSlide = slideData[activeIndex];
        eyebrowEl.textContent = currentSlide.eyebrow;
        titleEl.innerHTML = '<span class="hero__title-line">' + currentSlide.title + '</span><span class="hero__title-line">' + currentSlide.preTitle + ' <span class="text-gradient">' + currentSlide.accent + '</span></span>';
        leadEl.textContent = currentSlide.description;

        primaryCta.setAttribute("href", currentSlide.ctaHref || "contact.html");
        primaryCta.innerHTML = currentSlide.ctaLabel + " " + makeSvgIcon();

        updateIndicators(activeIndex);
    }

    function renderSlides() {
        slideTrack.innerHTML = slideData.map(function (slide, index) {
            var background = "linear-gradient(90deg, rgba(3, 4, 10, 0.72) 0%, rgba(3, 4, 10, 0.5) 30%, rgba(3, 4, 10, 0.2) 100%), url('" + slide.background + "')";
            return '<div class="hero__slide' + (index === 0 ? " is-active" : "") + '" data-hero-slide="' + index + '" style="background-image: ' + background + ';" aria-hidden="' + (index === 0 ? "false" : "true") + '"></div>';
        }).join("");

        slideEls = Array.prototype.slice.call(slideTrack.querySelectorAll("[data-hero-slide]"));

        if (indicatorTrack) {
            indicatorTrack.innerHTML = slideData.map(function (slide, index) {
                return '<button type="button" class="hero__indicator' + (index === 0 ? " is-active" : "") + '" data-hero-indicator="' + index + '" aria-label="Show slide ' + (index + 1) + '" aria-current="' + (index === 0 ? "true" : "false") + '"></button>';
            }).join("");

            dots = Array.prototype.slice.call(indicatorTrack.querySelectorAll("[data-hero-indicator]"));
            dots.forEach(function (dot, index) {
                dot.addEventListener("click", function () {
                    updateSlide(index);
                    startAutoplay();
                });
            });
        }
    }

    function handleMotionChange() {
        if (reducedMotionQuery.matches) {
            stopAutoplay();
            return;
        }

        startAutoplay();
    }

    function init() {
        renderSlides();
        updateSlide(0);

        root.addEventListener("mouseenter", stopAutoplay);
        root.addEventListener("mouseleave", startAutoplay);
        root.addEventListener("focusin", stopAutoplay);
        root.addEventListener("focusout", function (event) {
            if (!root.contains(event.relatedTarget)) {
                startAutoplay();
            }
        });

        if (typeof reducedMotionQuery.addEventListener === "function") {
            reducedMotionQuery.addEventListener("change", handleMotionChange);
        } else if (typeof reducedMotionQuery.addListener === "function") {
            reducedMotionQuery.addListener(handleMotionChange);
        }

        handleMotionChange();
    }

    init();
})(window, document);
