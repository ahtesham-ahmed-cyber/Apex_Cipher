/* ============================================================
 A PEX CIPHER — Card*s

 Pointer-driven 3D tilt for elements marked [data-tilt].

 The effect is deliberately narrow:

 - runs only on devices with a fine pointer and hover
 - is disabled when the user prefers reduced motion
 - writes --tilt-x and --tilt-y custom properties, which
 animations.css composes into a transform
 - resets cleanly on pointer leave, window blur, page hide,
viewport changes, and tab visibility changes

Only one shared requestAnimationFrame loop is used across all
tilt elements, and no listener is attached unless at least
one [data-tilt] element exists on the page.
============================================================ */

(function (window, document) {
    "use strict";

    var config = window.APEX_CONFIG || {};
    var interactions = config.interactions || {};
    var tiltConfig = interactions.tilt || {};

    var CLASS_TILTING = "is-tilting";

    var maxAngle =
    typeof tiltConfig.maxAngle === "number" ? tiltConfig.maxAngle : 6;

    var tiltElements = [];
    var activeElement = null;
    var pendingFrame = 0;
    var pendingX = 0.5;
    var pendingY = 0.5;

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

    function isSupported() {
        if (tiltConfig.enabled === false) {
            return false;
        }

        if (prefersReducedMotion() || !isFinePointer()) {
            return false;
        }

        /* requestAnimationFrame is universally available in modern
         b rowsers, but *the guard keeps the module safe in unusual
         embedded contexts. */
        return typeof window.requestAnimationFrame === "function";
    }

    /* ----------------------------------------------------------
     T ransform update*s
     ---------------------------------------------------------- */

    function applyTilt() {
        pendingFrame = 0;

        if (!activeElement) {
            return;
        }

        /* Convert normalised pointer position (0-1) into an angle
         r ange of [-max*Angle, +maxAngle]. The vertical axis is
         inverted so tilting toward the top of the element raises
         the top edge, matching a physical object. */
        var angleY = (pendingX - 0.5) * 2 * maxAngle;
        var angleX = (0.5 - pendingY) * 2 * maxAngle;

        activeElement.style.setProperty("--tilt-x", angleX.toFixed(3) + "deg");
        activeElement.style.setProperty("--tilt-y", angleY.toFixed(3) + "deg");
    }

    function scheduleTilt() {
        if (pendingFrame) {
            return;
        }

        pendingFrame = window.requestAnimationFrame(applyTilt);
    }

    function resetElement(element) {
        if (!element) {
            return;
        }

        element.classList.remove(CLASS_TILTING);
        element.style.removeProperty("--tilt-x");
        element.style.removeProperty("--tilt-y");
    }

    function resetAll() {
        if (pendingFrame) {
            window.cancelAnimationFrame(pendingFrame);
            pendingFrame = 0;
        }

        Array.prototype.forEach.call(tiltElements, resetElement);
        activeElement = null;
    }

    /* ----------------------------------------------------------
     P ointer handlers*
     ---------------------------------------------------------- */

    function handlePointerEnter(event) {
        var element = event.currentTarget;

        if (activeElement && activeElement !== element) {
            resetElement(activeElement);
        }

        activeElement = element;
        element.classList.add(CLASS_TILTING);
    }

    function handlePointerMove(event) {
        var element = event.currentTarget;

        if (element !== activeElement) {
            return;
        }

        var rect = element.getBoundingClientRect();

        if (!rect.width || !rect.height) {
            return;
        }

        /* Only respond to mouse and pen input. Pointer events from
         t ouch devices *would otherwise trigger the effect during
         a normal tap, and the coarse-pointer media query already
         excludes those devices, but this check keeps the intent
         explicit. */
        if (event.pointerType && event.pointerType !== "mouse" && event.pointerType !== "pen") {
            return;
        }

        pendingX = (event.clientX - rect.left) / rect.width;
        pendingY = (event.clientY - rect.top) / rect.height;

        /* Clamp in case the pointer moves just outside the element
         before the lea*ve event fires. */
        pendingX = Math.max(0, Math.min(1, pendingX));
        pendingY = Math.max(0, Math.min(1, pendingY));

        scheduleTilt();
    }

    function handlePointerLeave(event) {
        var element = event.currentTarget;

        if (element === activeElement) {
            activeElement = null;
        }

        resetElement(element);
    }

    function handlePointerCancel(event) {
        handlePointerLeave(event);
    }

    /* ----------------------------------------------------------
     G lobal resets   *
     ---------------------------------------------------------- */

    function handleWindowBlur() {
        resetAll();
    }

    function handleVisibilityChange() {
        if (document.visibilityState === "hidden") {
            resetAll();
        }
    }

    function handleViewportChange() {
        if (!isFinePointer() || prefersReducedMotion()) {
            resetAll();
        }
    }

    /* ----------------------------------------------------------
     A ttachment and t*eardown
     ---------------------------------------------------------- */

    function attachTo(element) {
        if (!element || element.dataset.tiltBound === "true") {
            return;
        }

        element.dataset.tiltBound = "true";
        element.addEventListener("pointerenter", handlePointerEnter, {
            passive: true
        });
        element.addEventListener("pointermove", handlePointerMove, {
            passive: true
        });
        element.addEventListener("pointerleave", handlePointerLeave, {
            passive: true
        });
        element.addEventListener("pointercancel", handlePointerCancel, {
            passive: true
        });

        tiltElements.push(element);
    }

    function detachFrom(element) {
        if (!element || element.dataset.tiltBound !== "true") {
            return;
        }

        element.removeEventListener("pointerenter", handlePointerEnter);
        element.removeEventListener("pointermove", handlePointerMove);
        element.removeEventListener("pointerleave", handlePointerLeave);
        element.removeEventListener("pointercancel", handlePointerCancel);

        delete element.dataset.tiltBound;
        resetElement(element);

        var index = tiltElements.indexOf(element);
        if (index !== -1) {
            tiltElements.splice(index, 1);
        }

        if (activeElement === element) {
            activeElement = null;
        }
    }

    /* ----------------------------------------------------------
     I nitialisation  *
     ---------------------------------------------------------- */

    function init() {
        var elements = document.querySelectorAll("[data-tilt]");

        if (!elements.length) {
            return;
        }

        /* When the effect is unavailable, strip the transform-related
         s tate that ani*mations.css would otherwise expect so the
         elements sit flat. The data attribute remains in place so
         a future preference change could still enable the effect
         after a reload. */
        if (!isSupported()) {
            Array.prototype.forEach.call(elements, function (element) {
                element.classList.remove(CLASS_TILTING);
                element.style.removeProperty("--tilt-x");
                element.style.removeProperty("--tilt-y");
            });
            return;
        }

        Array.prototype.forEach.call(elements, attachTo);

        window.addEventListener("blur", handleWindowBlur);
        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("resize", handleViewportChange, { passive: true });
    }

    /**
     * Public surface. `refresh` allows a module that injects new
     * markup (for example a filter that reveals previously hidden
     * cards) to register additional tilt elements.
     */
    window.APEX_CARDS = {
        refresh: function (root) {
            if (!isSupported()) {
                return;
            }

            var scope = root && root.querySelectorAll ? root : document;
            var elements = scope.querySelectorAll("[data-tilt]");

            Array.prototype.forEach.call(elements, attachTo);
        },
        reset: resetAll,
        detach: detachFrom
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }

})(window, document);
