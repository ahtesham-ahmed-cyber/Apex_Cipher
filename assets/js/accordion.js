/* ============================================================
   APEX CIPHER — Service-card accordion

   Drives the horizontal accordion in accordion.css.

   - the first card in each row starts expanded
   - hover (mouse) or keyboard focus expands a card
   - touch devices: first tap expands, second tap follows the link
   - marks the row .is-engaged while the user is interacting, so
     CSS can mute the other cards
   - writes data-distance (0 = active, 1 = neighbour, 2+ = far)
   - below 960px the layout is a plain grid and this module only
     keeps the classes in sync (CSS ignores them)

   Guarded: does nothing on pages without [data-accordion-row].
   ============================================================ */

(function (window, document) {
    "use strict";

    var CLASS_ACTIVE = "is-active";
    var CLASS_ENGAGED = "is-engaged";

    var canHover = window.matchMedia("(hover: hover) and (pointer: fine)");

    function initRow(row) {
        var cards = Array.prototype.slice.call(
            row.querySelectorAll("[data-accordion-card]")
        );

        if (!cards.length) {
            return;
        }

        var activeIndex = 0;
        var leaveTimer = null;

        function paint() {
            cards.forEach(function (card, index) {
                var distance = Math.abs(index - activeIndex);
                card.classList.toggle(CLASS_ACTIVE, index === activeIndex);
                card.setAttribute("data-distance", String(distance));
            });
        }

        function activate(index) {
            if (index === activeIndex) {
                return;
            }
            activeIndex = index;
            paint();
        }

        function engage() {
            window.clearTimeout(leaveTimer);
            row.classList.add(CLASS_ENGAGED);
        }

        function disengage() {
            window.clearTimeout(leaveTimer);
            /* Short grace period so moving across the gap between two
               cards does not flicker the dimming layer. */
            leaveTimer = window.setTimeout(function () {
                row.classList.remove(CLASS_ENGAGED);
            }, 140);
        }

        cards.forEach(function (card, index) {
            card.addEventListener("pointerenter", function (event) {
                if (event.pointerType === "mouse" || event.pointerType === "pen") {
                    engage();
                    activate(index);
                }
            });

            card.addEventListener("focusin", function () {
                engage();
                activate(index);
            });

            /* Touch: expand first, navigate on the second tap. */
            card.addEventListener(
                "click",
                function (event) {
                    if (canHover.matches || index === activeIndex) {
                        return;
                    }

                    if (window.matchMedia("(max-width: 960px)").matches) {
                        return;
                    }

                    event.preventDefault();
                    engage();
                    activate(index);
                },
                true
            );
        });

        row.addEventListener("pointerleave", disengage);
        row.addEventListener("focusout", function (event) {
            if (!row.contains(event.relatedTarget)) {
                disengage();
            }
        });

        paint();
    }

    function init() {
        var rows = document.querySelectorAll("[data-accordion-row]");

        Array.prototype.forEach.call(rows, initRow);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
})(window, document);
