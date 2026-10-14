/* ============================================================
   APEX CIPHER — Navigation

   Behaviour for the capsule navigation (see navbar.css):

   - liquid sliding tracker that follows hover / focus and rests
     on the current page
   - dampened 3D micro-tilt (hard cap: 1 degree) driven by the
     pointer on desktop and by the gyroscope on mobile
   - burger toggle with an underlay drawer: ARIA state, Escape,
     underlay click, focus trap, focus return, body scroll lock
   - aria-current="page" on the active link, with sub-pages
     mapped to their parent section
   - floating Back button on inner pages

   Every step is guarded so the module is harmless on pages
   without the navigation markup.
   ============================================================ */

(function (window, document) {
    "use strict";

    var config = window.APEX_CONFIG || {};
    var navConfig = config.navigation || {};

    var mobileBreakpoint =
        typeof navConfig.mobileBreakpoint === "number"
            ? navConfig.mobileBreakpoint
            : 1024;

    var closeOnLinkClick = navConfig.closeOnLinkClick !== false;
    var closeOnEscape = navConfig.closeOnEscape !== false;
    var closeOnOutsideClick = navConfig.closeOnOutsideClick !== false;

    var CLASS_NAV_READY = "js-nav-ready";
    var CLASS_NAV_OPEN = "is-open";
    var CLASS_BODY_LOCKED = "nav-open";

    /* Hard cap for the micro-tilt, in degrees. */
    var TILT_MAX_DEG = 1;
    var TILT_DAMPING = 0.08;

    /* Inner pages that belong to a top-level navigation section. */
    var SECTION_PARENTS = {
        "ai-consulting.html": "services.html",
        "ai-solutions.html": "services.html",
        "software-development.html": "services.html",
        "case-study-ai-platform.html": "work.html",
        "case-study-cloud-modernization.html": "work.html",
        "article-enterprise-ai.html": "insights.html",
        "faq.html": "insights.html"
    };

    var header = null;
    var nav = null;
    var toggle = null;
    var underlay = null;
    var capsule = null;
    var tracker = null;

    var isOpen = false;
    var lastFocusedBeforeOpen = null;
    var trackerHasPosition = false;

    /* ----------------------------------------------------------
       Helpers
       ---------------------------------------------------------- */

    function isMobileViewport() {
        return window.matchMedia("(max-width: " + mobileBreakpoint + "px)").matches;
    }

    function prefersReducedMotion() {
        return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    function clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }

    /* ----------------------------------------------------------
       Liquid tracker
       ---------------------------------------------------------- */

    function getActiveLink() {
        return nav ? nav.querySelector(".site-nav__link[aria-current='page']") : null;
    }

    function placeTracker(link, instant) {
        if (!tracker) {
            return;
        }

        if (!link) {
            tracker.classList.remove("is-visible");
            return;
        }

        var x = link.offsetLeft;
        var y = link.offsetTop;
        var w = link.offsetWidth;
        var h = link.offsetHeight;

        if (!w || !h) {
            return;
        }

        var previousX = parseFloat(tracker.style.getPropertyValue("--tx")) || 0;
        var previousY = parseFloat(tracker.style.getPropertyValue("--ty")) || 0;
        var moved = Math.abs(previousX - x) + Math.abs(previousY - y);
        var snap = instant || !trackerHasPosition;

        if (snap) {
            tracker.style.transition = "none";
        }

        tracker.style.setProperty("--tx", x + "px");
        tracker.style.setProperty("--ty", y + "px");
        tracker.style.width = w + "px";
        tracker.style.height = h + "px";
        tracker.classList.add("is-visible");

        if (snap) {
            /* Force a reflow so the next move animates again. */
            void tracker.offsetWidth;
            tracker.style.transition = "";
            trackerHasPosition = true;
            return;
        }

        /* Liquid squash-and-stretch while the tracker travels. */
        if (moved > 4 && !prefersReducedMotion() && typeof tracker.animate === "function") {
            var horizontal = Math.abs(previousX - x) >= Math.abs(previousY - y);
            var stretch = horizontal ? "1.14 0.86" : "0.88 1.12";
            var settle = horizontal ? "0.97 1.05" : "1.04 0.97";

            try {
                tracker.animate(
                    [
                        { scale: "1 1", offset: 0 },
                        { scale: stretch, offset: 0.35 },
                        { scale: settle, offset: 0.7 },
                        { scale: "1 1", offset: 1 }
                    ],
                    { duration: 640, easing: "ease-out" }
                );
            } catch (error) {
                /* Engines without the individual `scale` property: skip. */
            }
        }
    }

    function restTracker(instant) {
        placeTracker(getActiveLink(), instant);
    }

    function initTracker() {
        capsule = nav.querySelector("[data-nav-capsule]");
        tracker = nav.querySelector("[data-nav-tracker]");

        if (!capsule || !tracker) {
            return;
        }

        var links = capsule.querySelectorAll(".site-nav__link");

        Array.prototype.forEach.call(links, function (link) {
            link.addEventListener("pointerenter", function (event) {
                if (event.pointerType === "touch") {
                    return;
                }
                placeTracker(link);
            });

            link.addEventListener("focus", function () {
                placeTracker(link);
            });
        });

        capsule.addEventListener("pointerleave", function () {
            restTracker();
        });

        capsule.addEventListener("focusout", function (event) {
            if (!capsule.contains(event.relatedTarget)) {
                restTracker();
            }
        });

        restTracker(true);

        window.addEventListener(
            "resize",
            function () {
                restTracker(true);
            },
            { passive: true }
        );

        /* Web fonts change link widths after first paint. */
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(function () {
                restTracker(true);
            });
        }

        window.addEventListener("load", function () {
            restTracker(true);
        });
    }

    /* ----------------------------------------------------------
       Dampened micro-tilt (pointer on desktop, gyroscope on mobile)
       ---------------------------------------------------------- */

    function initTilt() {
        if (!header || prefersReducedMotion()) {
            return;
        }

        var targetX = 0;
        var targetY = 0;
        var currentX = 0;
        var currentY = 0;
        var frame = 0;

        function render() {
            frame = 0;

            currentX += (targetX - currentX) * TILT_DAMPING;
            currentY += (targetY - currentY) * TILT_DAMPING;

            header.style.setProperty("--nav-tilt-x", currentX.toFixed(3) + "deg");
            header.style.setProperty("--nav-tilt-y", currentY.toFixed(3) + "deg");

            if (Math.abs(targetX - currentX) > 0.002 || Math.abs(targetY - currentY) > 0.002) {
                frame = window.requestAnimationFrame(render);
            }
        }

        function setTarget(rotateX, rotateY) {
            targetX = clamp(rotateX, -TILT_MAX_DEG, TILT_MAX_DEG);
            targetY = clamp(rotateY, -TILT_MAX_DEG, TILT_MAX_DEG);

            if (!frame) {
                frame = window.requestAnimationFrame(render);
            }
        }

        var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

        if (finePointer.matches) {
            window.addEventListener(
                "pointermove",
                function (event) {
                    if (isMobileViewport()) {
                        return;
                    }

                    var nx = event.clientX / window.innerWidth - 0.5;
                    var ny = event.clientY / window.innerHeight - 0.5;

                    setTarget(-ny * 2 * TILT_MAX_DEG, nx * 2 * TILT_MAX_DEG);
                },
                { passive: true }
            );

            document.documentElement.addEventListener("pointerleave", function () {
                setTarget(0, 0);
            });

            return;
        }

        /* Gyroscope. iOS gates this behind an explicit permission
           prompt, so it is only wired where no prompt is needed. */
        var Orientation = window.DeviceOrientationEvent;

        if (!Orientation || typeof Orientation.requestPermission === "function") {
            return;
        }

        window.addEventListener(
            "deviceorientation",
            function (event) {
                if (event.gamma === null || event.beta === null) {
                    return;
                }

                var roll = clamp(event.gamma / 30, -1, 1);
                var pitch = clamp((event.beta - 50) / 30, -1, 1);

                setTarget(-pitch * TILT_MAX_DEG, roll * TILT_MAX_DEG);
            },
            { passive: true }
        );
    }

    /* ----------------------------------------------------------
       Drawer open / close
       ---------------------------------------------------------- */

    function getFocusable() {
        var found = [];
        var brand = header ? header.querySelector(".brand") : null;

        if (brand) {
            found.push(brand);
        }

        Array.prototype.forEach.call(
            nav.querySelectorAll("a[href], button:not([disabled])"),
            function (item) {
                found.push(item);
            }
        );

        if (toggle) {
            found.push(toggle);
        }

        return found;
    }

    function applyState() {
        if (!nav || !toggle) {
            return;
        }

        toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        toggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
        nav.classList.toggle(CLASS_NAV_OPEN, isOpen);

        if (underlay) {
            underlay.classList.toggle(CLASS_NAV_OPEN, isOpen);
        }

        document.body.classList.toggle(CLASS_BODY_LOCKED, isOpen);

        if (isOpen) {
            restTracker(true);
        }
    }

    function openMenu(trigger) {
        if (!nav || !toggle || isOpen) {
            return;
        }

        lastFocusedBeforeOpen =
            trigger && trigger.focus ? trigger : document.activeElement;

        isOpen = true;
        applyState();

        var firstLink = nav.querySelector("a[href]");

        if (firstLink) {
            window.setTimeout(
                function () {
                    firstLink.focus();
                },
                prefersReducedMotion() ? 0 : 120
            );
        }
    }

    function closeMenu(options) {
        if (!nav || !toggle || !isOpen) {
            return;
        }

        var opts = options || {};
        isOpen = false;
        applyState();

        if (opts.restoreFocus !== false) {
            var target = lastFocusedBeforeOpen;

            if (target && typeof target.focus === "function" && document.contains(target)) {
                target.focus();
            } else {
                toggle.focus();
            }
        }
    }

    function toggleMenu() {
        if (isOpen) {
            closeMenu();
        } else {
            openMenu(toggle);
        }
    }

    /* ----------------------------------------------------------
       Event handlers
       ---------------------------------------------------------- */

    function handleToggleClick(event) {
        event.preventDefault();
        toggleMenu();
    }

    function handleDocumentKeydown(event) {
        if (!isOpen) {
            return;
        }

        if (closeOnEscape && (event.key === "Escape" || event.key === "Esc")) {
            event.stopPropagation();
            closeMenu();
            return;
        }

        if (event.key === "Tab") {
            var focusable = getFocusable();

            if (!focusable.length) {
                return;
            }

            var first = focusable[0];
            var last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    }

    function handleUnderlayClick() {
        if (closeOnOutsideClick) {
            closeMenu({ restoreFocus: false });
        }
    }

    function handleNavLinkClick(event) {
        /* A mega-menu handler may prevent the first click to expand a submenu.
           Do not close the mobile drawer for that handled click. */
        if (event.defaultPrevented || !isOpen || !closeOnLinkClick) {
            return;
        }

        var link = event.target.closest ? event.target.closest("a[href]") : null;

        if (!link) {
            return;
        }

        var href = link.getAttribute("href") || "";
        var isSamePageAnchor = href.charAt(0) === "#";

        closeMenu({ restoreFocus: isSamePageAnchor });
    }

    function handleViewportChange() {
        if (isOpen && !isMobileViewport()) {
            closeMenu({ restoreFocus: false });
        }
    }

    function handleHeaderScroll() {
        if (!header) {
            return;
        }

        var offsetY = window.pageYOffset || document.documentElement.scrollTop || 0;
        header.classList.toggle("is-scrolled", offsetY > 8);
    }

    /* ----------------------------------------------------------
       Current page marking
       ---------------------------------------------------------- */

    function getCurrentPageName() {
        var path = window.location.pathname || "/";
        var current = path.split("/").filter(Boolean).pop() || "index.html";
        current = current.split("?")[0].split("#")[0];
        if (current === "" || current.indexOf(".") === -1) {
            current = "index.html";
        }
        return current.toLowerCase();
    }

    function ensureHomeLink() {
        var navList = document.querySelector(".site-nav__list");

        if (!navList) {
            return;
        }

        var existingHome = navList.querySelector(
            ".site-nav__link[href='index.html'], .site-nav__link[href='./'], .site-nav__link[href='/'], [data-home-link]"
        );

        if (existingHome) {
            return;
        }

        var item = document.createElement("li");
        item.className = "site-nav__item site-nav__item--home";

        var link = document.createElement("a");
        link.className = "site-nav__link";
        link.href = "index.html";
        link.textContent = "Home";
        link.setAttribute("data-home-link", "true");

        item.appendChild(link);
        navList.insertBefore(item, navList.firstChild);
    }

    function handleBackButtonClick() {
        if (window.history && window.history.length > 1 && document.referrer) {
            var referrer = document.referrer || "";

            if (referrer.indexOf(window.location.origin) === 0) {
                window.history.back();
                return;
            }
        }

        window.location.href = "index.html";
    }

    function injectBackButton() {
        if (document.body.classList.contains("page--home")) {
            return;
        }

        if (document.querySelector(".btn-back")) {
            return;
        }

        var button = document.createElement("button");
        button.type = "button";
        button.className = "btn btn--ghost btn-back page-back";
        button.setAttribute("aria-label", "Go back");
        button.setAttribute("title", "Go back");
        button.innerHTML =
            '<svg class="btn__icon btn-back__icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg><span>Back</span>';

        button.addEventListener("click", handleBackButtonClick);
        document.body.appendChild(button);
    }

    function pageFromHref(href) {
        if (!href) {
            return "";
        }
        var target = href.split("#")[0].split("?")[0].trim();
        if (!target || target === "/" || target === "./") {
            return "index.html";
        }
        target = target.replace(/\\/g, "/");
        var page = target.split("/").filter(Boolean).pop() || "index.html";
        if (page.indexOf(".") === -1) {
            page = "index.html";
        }
        return page.toLowerCase();
    }

    function isInternalHref(href) {
        if (!href) {
            return false;
        }
        var value = href.trim();
        return value.charAt(0) !== "#" &&
            !/^(?:[a-z]+:)?\/\//i.test(value) &&
            !/^(?:mailto:|tel:|javascript:)/i.test(value);
    }

    function markCurrentPage() {
        var current = getCurrentPageName();
        var section = SECTION_PARENTS[current] || current;
        var navLinks = document.querySelectorAll(".site-nav__link");
        var allLinks = document.querySelectorAll(
            ".site-nav__link, .site-footer__list a, .breadcrumb a"
        );

        var navHasMatch = false;
        Array.prototype.forEach.call(navLinks, function (link) {
            var href = link.getAttribute("href") || "";
            if (isInternalHref(href) && pageFromHref(href) === section) {
                navHasMatch = true;
            }
        });

        Array.prototype.forEach.call(allLinks, function (link) {
            var href = link.getAttribute("href") || "";
            if (!isInternalHref(href)) {
                return;
            }

            var isPrimary = link.classList.contains("site-nav__link");
            var compareTo = isPrimary && navHasMatch ? section : current;
            var matches = pageFromHref(href) === compareTo;

            if (matches) {
                link.setAttribute("aria-current", "page");
                if (isPrimary) {
                    link.classList.add("is-active");
                }
            } else {
                link.removeAttribute("aria-current");
                if (isPrimary) {
                    link.classList.remove("is-active");
                }
            }
        });

        if (tracker) {
            restTracker(true);
        }
    }

    function init() {
        header = document.querySelector("[data-site-header]");
        nav = document.querySelector("[data-site-nav]");
        toggle = document.querySelector("[data-nav-toggle]");
        underlay = document.querySelector("[data-nav-underlay]");

        if (!nav || !toggle) {
            markCurrentPage();
            return;
        }

        document.documentElement.classList.add(CLASS_NAV_READY);

        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open navigation");

        toggle.addEventListener("click", handleToggleClick);
        document.addEventListener("keydown", handleDocumentKeydown);

        if (underlay) {
            underlay.addEventListener("click", handleUnderlayClick);
        }

        nav.addEventListener("click", handleNavLinkClick);
        window.addEventListener("resize", handleViewportChange, { passive: true });
        window.addEventListener("orientationchange", handleViewportChange, {
            passive: true
        });

        if (header) {
            handleHeaderScroll();
            window.addEventListener("scroll", handleHeaderScroll, { passive: true });
        }

        ensureHomeLink();
        initTracker();
        markCurrentPage();
        initTilt();
        injectBackButton();
    }

    /* Deliberately small public surface. */
    window.APEX_NAV = {
        close: closeMenu,
        open: openMenu,
        isOpen: function () {
            return isOpen;
        },
        refreshCurrentPage: markCurrentPage
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
})(window, document);
