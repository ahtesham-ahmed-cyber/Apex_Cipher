/* ============================================================
 A PEX CIPHER — Filt*ers

 Client-side filtering for portfolio and resource indexes.

 Expected markup contract:

 <div data-filter-root>
 <div data-filter-chips>
 <button data-filter-chip data-filter="all" aria-pressed="true">All</button>
 <button data-filter-chip data-filter="ai"  aria-pressed="false">AI</button>
 ...
 </div>

 <div data-filter-items>
 <article data-filter-item data-categories="ai cloud">...</article>
 <article data-filter-item data-categories="cloud">...</article>
 </div>

 <p data-filter-empty hidden>No items match this filter.</p>
 </div>

 A page may contain more than one [data-filter-root]; each is
 initialised independently and does not affect the others.

 The module works with no JavaScript-free fallback: every item
 is visible by default in the markup, and only the interactive
 filters reduce visibility. When JavaScript is unavailable the
 full list remains fully usable.
 ============================================================ */

(function (window, document) {
    "use strict";

    var config = window.APEX_CONFIG || {};
    var filterConfig = config.filters || {};

    var CLASS_HIDDEN = "is-hidden";
    var CLASS_ACTIVE = "is-active";

    var allKey =
    typeof filterConfig.allKey === "string" && filterConfig.allKey.length
    ? filterConfig.allKey
    : "all";

    /* Registry of initialised roots so a public refresh() can
     re-run matching *after the DOM changes. */
    var roots = [];

    /* ----------------------------------------------------------
     H elpers         *
     ---------------------------------------------------------- */

    function toArray(list) {
        return Array.prototype.slice.call(list || []);
    }

    function normaliseToken(value) {
        return String(value || "")
        .trim()
        .toLowerCase();
    }

    /**
     * Parses the space-separated category list on an item.
     */
    function readCategories(item) {
        var raw = item.getAttribute("data-categories") || "";
        var parts = raw.split(/\s+/);
        var result = [];

        parts.forEach(function (part) {
            var value = normaliseToken(part);
            if (value) {
                result.push(value);
            }
        });

        return result;
    }

    /**
     * Updates the aria-pressed and visual state of the chip set.
     */
    function applyChipState(chips, activeKey) {
        chips.forEach(function (chip) {
            var key = normaliseToken(chip.getAttribute("data-filter"));
            var isActive = key === activeKey;

            chip.setAttribute("aria-pressed", isActive ? "true" : "false");
            chip.classList.toggle(CLASS_ACTIVE, isActive);
        });
    }

    /**
     * Writes a count into an optional live region so screen-reader
     * users receive feedback after filtering. Marked as
     * aria-live="polite" in the markup; this module never changes
     * the politeness.
     */
    function announce(root, visibleCount, totalCount, activeKey) {
        var region = root.querySelector("[data-filter-status]");

        if (!region) {
            return;
        }

        var label = activeKey === allKey ? "all categories" : "\u201C" + activeKey + "\u201D";

        var message;

        if (totalCount === 0) {
            message = "No items available.";
        } else if (visibleCount === 0) {
            message = "No items match the selected filter.";
        } else {
            message =
            "Showing " +
            visibleCount +
            " of " +
            totalCount +
            " items for " +
            label +
            ".";
        }

        region.textContent = message;
    }

    /* ----------------------------------------------------------
     C ore filtering  *
     ---------------------------------------------------------- */

    function filterRoot(root, activeKey, options) {
        var items = toArray(root.querySelectorAll("[data-filter-item]"));

        var visibleCount = 0;

        items.forEach(function (item) {
            var categories = readCategories(item);
            var matches = activeKey === allKey || categories.indexOf(activeKey) !== -1;

            item.classList.toggle(CLASS_HIDDEN, !matches);

            /* When items are re-shown after being hidden, the reveal
             system must *be told so it can animate them back in. */
            if (matches) {
                visibleCount += 1;
            }

            if (options && options.resetReveal && matches) {
                item.classList.remove("is-visible");
            }
        });

        var emptyState = root.querySelector("[data-filter-empty]");

        if (emptyState) {
            emptyState.hidden = visibleCount !== 0;
        }

        announce(root, visibleCount, items.length, activeKey);

        /* Re-register any newly visible elements with the shared
         m odules. Guard*ed so this file remains safe when those
         modules are not loaded. */
        if (options && options.resetReveal) {
            if (window.APEX_ANIMATIONS && window.APEX_ANIMATIONS.observeNewElements) {
                window.APEX_ANIMATIONS.observeNewElements(root);
            }
            if (window.APEX_CARDS && window.APEX_CARDS.refresh) {
                window.APEX_CARDS.refresh(root);
            }
        }

        return visibleCount;
    }

    function setActive(root, activeKey) {
        if (!root) {
            return;
        }

        var state = root.__apexFilterState;

        if (!state) {
            return;
        }

        if (state.activeKey === activeKey) {
            return;
        }

        state.activeKey = activeKey;

        applyChipState(state.chips, activeKey);

        filterRoot(root, activeKey, {
            /* Only re-trigger reveal animations when the site is not
             r especting a* reduced-motion preference. Animations.js
             handles the reduced-motion branch itself, but skipping
             the reset here avoids a needless class churn. */
            resetReveal: filterConfig.animateItems !== false
        });
    }

    /* ----------------------------------------------------------
     E vent handling  *
     ---------------------------------------------------------- */

    function handleChipClick(event) {
        var chip = event.currentTarget;
        var root = chip.closest("[data-filter-root]");

        if (!root) {
            return;
        }

        var key = normaliseToken(chip.getAttribute("data-filter"));

        if (!key) {
            return;
        }

        event.preventDefault();
        setActive(root, key);
    }

    function handleChipsKeydown(event) {
        var key = event.key;

        if (
            key !== "ArrowLeft" &&
            key !== "ArrowRight" &&
            key !== "Home" &&
            key !== "End"
        ) {
            return;
        }

        var root = event.currentTarget.closest("[data-filter-root]");

        if (!root) {
            return;
        }

        var chips = toArray(root.querySelectorAll("[data-filter-chip]"));

        if (chips.length < 2) {
            return;
        }

        var currentIndex = chips.indexOf(event.target);

        if (currentIndex === -1) {
            return;
        }

        var nextIndex = currentIndex;

        if (key === "ArrowRight") {
            nextIndex = (currentIndex + 1) % chips.length;
        } else if (key === "ArrowLeft") {
            nextIndex = (currentIndex - 1 + chips.length) % chips.length;
        } else if (key === "Home") {
            nextIndex = 0;
        } else if (key === "End") {
            nextIndex = chips.length - 1;
        }

        if (nextIndex !== currentIndex) {
            event.preventDefault();
            chips[nextIndex].focus();
        }
    }

    /* ----------------------------------------------------------
     I nitialisation  *
     ---------------------------------------------------------- */

    function initRoot(root) {
        if (!root || root.dataset.filterBound === "true") {
            return;
        }

        var chips = toArray(root.querySelectorAll("[data-filter-chip]"));

        if (!chips.length) {
            return;
        }

        /* Determine the initial active key from the markup so the
         s tate is drive*n by the HTML rather than assumed. The
         first chip marked aria-pressed="true" wins; otherwise the
         "all" chip is selected if present, otherwise the first. */
        var activeKey = null;

        chips.forEach(function (chip) {
            if (activeKey !== null) {
                return;
            }

            if (chip.getAttribute("aria-pressed") === "true") {
                activeKey = normaliseToken(chip.getAttribute("data-filter"));
            }
        });

        if (activeKey === null) {
            var allChip = chips.filter(function (chip) {
                return normaliseToken(chip.getAttribute("data-filter")) === allKey;
            })[0];

            activeKey = allChip
            ? allKey
            : normaliseToken(chips[0].getAttribute("data-filter"));
        }

        root.__apexFilterState = {
            chips: chips,
            activeKey: activeKey
        };

        chips.forEach(function (chip) {
            chip.addEventListener("click", handleChipClick);
            chip.addEventListener("keydown", handleChipsKeydown);
        });

        root.dataset.filterBound = "true";
        roots.push(root);

        applyChipState(chips, activeKey);
        filterRoot(root, activeKey, { resetReveal: false });
    }

    function init() {
        var candidates = document.querySelectorAll("[data-filter-root]");

        if (!candidates.length) {
            return;
        }

        toArray(candidates).forEach(initRoot);
    }

    /**
     * Public surface.
     *
     *   refresh()  — re-evaluate the current filter after items
     *                have been added to or removed from the DOM.
     *   reset()    — return every root to the "all" view.
     */
    window.APEX_FILTERS = {
        refresh: function () {
            roots.forEach(function (root) {
                var state = root.__apexFilterState;

                if (state) {
                    filterRoot(root, state.activeKey, { resetReveal: false });
                }
            });
        },
        reset: function () {
            roots.forEach(function (root) {
                setActive(root, allKey);
            });
        }
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }

})(window, document);
