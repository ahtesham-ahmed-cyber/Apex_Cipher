/* ============================================================
 *  APEX CIPHER — FAQ Accordion
 *
 *  Accessible accordion behaviour for [data-accordion]
 *  containers. The markup contract is:

 <div data-accordion>
 <div class="accordion__item">
 <h3 class="accordion__heading">
 <button type="button"
 id="trigger-id"
 aria-expanded="true"
 aria-controls="panel-id"
 data-accordion-trigger>
 <span class="accordion__label">...</span>
 <span class="accordion__icon" aria-hidden="true">...</span>
 </button>
 </h3>
 <div class="accordion__panel"
 id="panel-id"
 role="region"
 aria-labelledby="trigger-id"
 data-accordion-panel>
 <div class="accordion__content">...</div>
 </div>
 </div>
 </div>

 Behaviour:

 - Reads the initial open/closed state from aria-expanded and
 syncs the .is-open class on the panel and its parent item so
 the CSS in components.css animates from the correct place.
 - Toggles on click and on Enter / Space (native button
 activation, so no key handling is required for those).
 - Arrow Up / Arrow Down move focus to the previous or next
 trigger; Home / End jump to the first or last.
 - Honours the allowMultiple configuration flag. When false,
opening one panel closes any sibling that is currently open.
- Exposes a small public API so other modules can drive
accordion state without duplicating logic.

The module never throws when a page has no accordions, and it
never assumes a specific number of items per container.
============================================================ */

(function (window, document) {
    "use strict";

 var config = window.APEX_CONFIG || {};
 var accordionConfig = config.accordion || {};

 var allowMultiple = accordionConfig.allowMultiple !== false;

 var SELECTOR_CONTAINER = "[data-accordion]";
 var SELECTOR_TRIGGER = "[data-accordion-trigger]";
 var SELECTOR_PANEL = "[data-accordion-panel]";
 var SELECTOR_ITEM = ".accordion__item";

 var CLASS_ITEM_OPEN = "is-open";
 var CLASS_PANEL_OPEN = "is-open";

 var containers = [];

 /* ----------------------------------------------------------
  S mall helpers   *
  ---------------------------------------------------------- */

 function toArray(list) {
     return Array.prototype.slice.call(list || []);
 }

 /**
  * Resolves the panel that a trigger controls. The
  * aria-controls attribute is the authoritative source; a
  * sibling fallback exists in case the attribute is ever
  * omitted from markup.
  */
 function getPanel(trigger) {
     var id = trigger.getAttribute("aria-controls");

     if (id) {
         var byId = document.getElementById(id);

         if (byId && byId.matches && byId.matches(SELECTOR_PANEL)) {
             return byId;
         }
     }

     var item = trigger.closest(SELECTOR_ITEM);

     if (item) {
         var sibling = item.querySelector(SELECTOR_PANEL);

         if (sibling) {
             return sibling;
         }
     }

     return null;
 }

 function isExpanded(trigger) {
     return trigger.getAttribute("aria-expanded") === "true";
 }

 /* ----------------------------------------------------------
  S tate applicatio*n
  ---------------------------------------------------------- */

 function applyState(trigger, expanded) {
     trigger.setAttribute("aria-expanded", expanded ? "true" : "false");

     var panel = getPanel(trigger);

     if (panel) {
         panel.classList.toggle(CLASS_PANEL_OPEN, expanded);
     }

     var item = trigger.closest(SELECTOR_ITEM);

     if (item) {
         item.classList.toggle(CLASS_ITEM_OPEN, expanded);
     }
 }

 function expandTrigger(trigger) {
     if (!trigger || isExpanded(trigger)) {
         return;
     }

     applyState(trigger, true);
 }

 function collapseTrigger(trigger) {
     if (!trigger || !isExpanded(trigger)) {
         return;
     }

     applyState(trigger, false);
 }

 function closeSiblings(container, trigger) {
     if (allowMultiple || !container) {
         return;
     }

     var open = toArray(
         container.querySelectorAll(SELECTOR_TRIGGER + "[aria-expanded='true']")
     );

     open.forEach(function (other) {
         if (other !== trigger) {
             collapseTrigger(other);
         }
     });
 }

 /* ----------------------------------------------------------
  E vent handlers  *
  ---------------------------------------------------------- */

 function handleTriggerClick(event) {
     var trigger = event.currentTarget;
     var container = trigger.closest(SELECTOR_CONTAINER);

     if (!container) {
         return;
     }

     var nextState = !isExpanded(trigger);

     if (nextState) {
         closeSiblings(container, trigger);
     }

     applyState(trigger, nextState);
 }

 function handleTriggerKeydown(event) {
     var key = event.key;

     if (
         key !== "ArrowUp" &&
         key !== "ArrowDown" &&
         key !== "Home" &&
         key !== "End"
     ) {
         return;
     }

     var trigger = event.currentTarget;
     var container = trigger.closest(SELECTOR_CONTAINER);

     if (!container) {
         return;
     }

     var triggers = toArray(container.querySelectorAll(SELECTOR_TRIGGER));

     if (triggers.length < 2) {
         return;
     }

     var currentIndex = triggers.indexOf(trigger);

     if (currentIndex === -1) {
         return;
     }

     var nextIndex = currentIndex;

     if (key === "ArrowDown") {
         nextIndex = (currentIndex + 1) % triggers.length;
     } else if (key === "ArrowUp") {
         nextIndex = (currentIndex - 1 + triggers.length) % triggers.length;
     } else if (key === "Home") {
         nextIndex = 0;
     } else if (key === "End") {
         nextIndex = triggers.length - 1;
     }

     if (nextIndex !== currentIndex) {
         event.preventDefault();
         triggers[nextIndex].focus();
     }
 }

 /* ----------------------------------------------------------
  C ontainer initia*lisation
  ---------------------------------------------------------- */

 function initContainer(container) {
     if (!container || container.dataset.accordionBound === "true") {
         return;
     }

     var triggers = toArray(container.querySelectorAll(SELECTOR_TRIGGER));

     if (!triggers.length) {
         return;
     }

     triggers.forEach(function (trigger) {
         /* Sync the visual state to the accessible state declared
          i n the HTML.* This is the only point at which the classes
          are written without a user action, so it happens once
          per page load and never animates. */
         applyState(trigger, isExpanded(trigger));

         trigger.addEventListener("click", handleTriggerClick);
         trigger.addEventListener("keydown", handleTriggerKeydown);
     });

     container.dataset.accordionBound = "true";
     containers.push(container);
 }

 /* ----------------------------------------------------------
  P ublic API      *
  ---------------------------------------------------------- */

 function forEachInScope(scope, callback) {
     var roots;

     if (scope && scope.querySelectorAll) {
         roots = scope.matches && scope.matches(SELECTOR_CONTAINER)
         ? [scope]
         : toArray(scope.querySelectorAll(SELECTOR_CONTAINER));
     } else {
         roots = toArray(document.querySelectorAll(SELECTOR_CONTAINER));
     }

     roots.forEach(function (root) {
         var triggers = toArray(root.querySelectorAll(SELECTOR_TRIGGER));
         triggers.forEach(function (trigger) {
             callback(trigger);
         });
     });
 }

 function expandAll(scope) {
     forEachInScope(scope, expandTrigger);
 }

 function collapseAll(scope) {
     forEachInScope(scope, collapseTrigger);
 }

 /**
  * Re-runs the binding pass for accordions added to the DOM
  * after initial load. Existing containers are skipped via the
  * data-accordion-bound marker.
  */
 function refresh(scope) {
     var roots;

     if (scope && scope.querySelectorAll) {
         roots = scope.matches && scope.matches(SELECTOR_CONTAINER)
         ? [scope]
         : toArray(scope.querySelectorAll(SELECTOR_CONTAINER));
     } else {
         roots = toArray(document.querySelectorAll(SELECTOR_CONTAINER));
     }

     roots.forEach(initContainer);
 }

 /* ----------------------------------------------------------
  B oot            *
  ---------------------------------------------------------- */

 function init() {
     var roots = document.querySelectorAll(SELECTOR_CONTAINER);

     if (!roots.length) {
         return;
     }

     toArray(roots).forEach(initContainer);
 }

 window.APEX_FAQ = {
     expandAll: expandAll,
 collapseAll: collapseAll,
 refresh: refresh
 };

 if (document.readyState === "loading") {
     document.addEventListener("DOMContentLoaded", init, { once: true });
 } else {
     init();
 }

})(window, document);
