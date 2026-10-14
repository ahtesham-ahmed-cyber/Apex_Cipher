/* ============================================================
 A PEX CIPHER — Form*s

 Client-side validation and honest demonstration feedback for
 the contact form (and any future form that adopts the same
 contract).

 Markup contract:

 <form data-form="contact" novalidate>
 <div class="field">
 <label class="field__label" for="name">Name</label>
 <input class="field__control" id="name" name="name"
 type="text" required data-field>
 <p class="field__error" data-field-error></p>
 </div>
 ...
 <div class="form-status" data-form-status
 role="status" aria-live="polite" hidden></div>
 <button type="submit">Send</button>
 </form>

 Important boundaries:

 - The project is a static frontend demonstration. No network
 request is made and no message is stored anywhere.
 - The module therefore never reports that a message has been
 sent. It reports exactly what happened: the input was
 validated locally and nothing was transmitted.
 - Successful validation is not presented as a submission.
 The wording is driven by APEX_CONFIG.forms.messages and
 always makes the demonstrative nature explicit.
 ============================================================ */

(function (window, document) {
    "use strict";

 var config = window.APEX_CONFIG || {};
 var formConfig = config.forms || {};
 var messages = formConfig.messages || {};

 var MIN_MESSAGE_LENGTH =
 typeof formConfig.minimumMessageLength === "number"
 ? formConfig.minimumMessageLength
 : 20;

 var MAX_MESSAGE_LENGTH =
 typeof formConfig.maximumMessageLength === "number"
 ? formConfig.maximumMessageLength
 : 2000;

 var STATUS_RESET_DELAY =
 typeof formConfig.statusResetDelay === "number"
 ? formConfig.statusResetDelay
 : 8000;

 var SELECTOR_FORM = "[data-form]";
 var SELECTOR_FIELD = "[data-field]";
 var SELECTOR_ERROR = "[data-field-error]";
 var SELECTOR_STATUS = "[data-form-status]";

 var CLASS_STATUS_INFO = "form-status--info";
 var CLASS_STATUS_ERROR = "form-status--error";

 /* ----------------------------------------------------------
  F allback copy   *
  Used when a message is missing from the configuration so the
  module never displays an empty status.
  ---------------------------------------------------------- */

 function copy(key, fallback) {
     var value = messages[key];
     return typeof value === "string" && value.length ? value : fallback;
 }

 var TEXT = {
     demo: copy(
         "success",
         "This is a front-end demonstration. Your message was not transmitted or stored."
     ),
     invalid: copy(
         "invalid",
         "Please review the highlighted fields before continuing."
     ),
     required: copy("required", "This field is required."),
 emailInvalid: copy("emailInvalid", "Enter a valid email address."),
 messageShort: copy("messageShort", "Please provide a little more detail."),
 messageLong: copy("messageLong", "Please shorten your message.")
 };

 /* ----------------------------------------------------------
  S mall helpers   *
  ---------------------------------------------------------- */

 function toArray(list) {
     return Array.prototype.slice.call(list || []);
 }

 /**
  * Deliberately conservative email check. Client-side email
  * validation can never be authoritative; this test only
  * catches obvious typos so the user is not blocked from a
  * legitimate address by an overzealous pattern.
  */
 function looksLikeEmail(value) {
     if (typeof value !== "string") {
         return false;
     }

     var trimmed = value.trim();

     if (trimmed.length < 3 || trimmed.length > 254) {
         return false;
     }

     if (trimmed.indexOf(" ") !== -1) {
         return false;
     }

     var at = trimmed.indexOf("@");

     if (at < 1 || at === trimmed.length - 1) {
         return false;
     }

     /* Exactly one @ in the local/domain boundary. */
     if (trimmed.lastIndexOf("@") !== at) {
         return false;
     }

     var local = trimmed.slice(0, at);
     var domain = trimmed.slice(at + 1);

     if (!local.length || !domain.length) {
         return false;
     }

     if (domain.indexOf(".") === -1) {
         return false;
     }

     if (domain.charAt(0) === "." || domain.charAt(domain.length - 1) === ".") {
         return false;
     }

     return true;
 }

 /**
  * Resolves the visible error paragraph for a control, adding
  * an id when one is missing so aria-describedby can point at
  * it reliably.
  */
 function getErrorElement(form, field) {
     var container = field.closest(".field");
     var error;

     if (container) {
         error = container.querySelector(SELECTOR_ERROR);
     }

     if (!error) {
         error = form.querySelector(
             "[data-field-error][data-for='" + field.id + "']"
         );
     }

     if (error && !error.id) {
         var base = field.id || field.name || "field";
         error.id = "error-" + base;
     }

     return error || null;
 }

 function setDescribedBy(field, errorId) {
     var existing = (field.getAttribute("aria-describedby") || "").trim();
     var parts = existing.length ? existing.split(/\s+/) : [];

     /* Preserve any hint ids already present, add the error id
      only once, and* never leave a dangling reference. */
     parts = parts.filter(function (value) {
         return value && value !== errorId;
     });

     if (errorId) {
         parts.push(errorId);
     }

     if (parts.length) {
         field.setAttribute("aria-describedby", parts.join(" "));
     } else {
         field.removeAttribute("aria-describedby");
     }
 }

 /* ----------------------------------------------------------
  F ield validation*
  ---------------------------------------------------------- */

 function validateField(field) {
     var type = (field.getAttribute("type") || field.tagName || "")
     .toString()
     .toLowerCase();

     var name = (field.getAttribute("name") || "").toLowerCase();
     var value = typeof field.value === "string" ? field.value : "";
     var trimmed = value.trim();
     var isRequired = field.hasAttribute("required");
     var errorElement = getErrorElement(field.form || document, field);
     var message = "";

     if (isRequired && !trimmed.length) {
         message = TEXT.required;
     } else if (trimmed.length && type === "email" && !looksLikeEmail(trimmed)) {
         message = TEXT.emailInvalid;
     } else if (name === "message" && trimmed.length) {
         if (trimmed.length < MIN_MESSAGE_LENGTH) {
             message = TEXT.messageShort;
         } else if (trimmed.length > MAX_MESSAGE_LENGTH) {
             message = TEXT.messageLong;
         }
     }

     var valid = message === "";

     field.setAttribute("aria-invalid", valid ? "false" : "true");

     if (errorElement) {
         errorElement.textContent = valid ? "" : message;
         setDescribedBy(field, valid ? null : errorElement.id);
     }

     return valid;
 }

 /* ----------------------------------------------------------
  S tatus region   *
  ---------------------------------------------------------- */

 var statusTimers = new WeakMap();

 function clearStatusTimer(form) {
     var timer = statusTimers.get(form);

     if (timer) {
         window.clearTimeout(timer);
         statusTimers.delete(form);
     }
 }

 function setStatus(form, text, variant) {
     var region = form.querySelector(SELECTOR_STATUS);

     if (!region) {
         return;
     }

     clearStatusTimer(form);

     region.classList.remove(CLASS_STATUS_INFO, CLASS_STATUS_ERROR);

     if (variant === "info") {
         region.classList.add(CLASS_STATUS_INFO);
     } else if (variant === "error") {
         region.classList.add(CLASS_STATUS_ERROR);
     }

     region.textContent = text;
     region.hidden = false;

     if (STATUS_RESET_DELAY > 0) {
         var timer = window.setTimeout(function () {
             region.hidden = true;
             region.textContent = "";
             region.classList.remove(CLASS_STATUS_INFO, CLASS_STATUS_ERROR);
             statusTimers.delete(form);
         }, STATUS_RESET_DELAY);

         statusTimers.set(form, timer);
     }
 }

 function clearStatus(form) {
     var region = form.querySelector(SELECTOR_STATUS);

     clearStatusTimer(form);

     if (region) {
         region.hidden = true;
         region.textContent = "";
         region.classList.remove(CLASS_STATUS_INFO, CLASS_STATUS_ERROR);
     }
 }

 /* ----------------------------------------------------------
  F ield group acce*ss
  ---------------------------------------------------------- */

 function getFields(form) {
     return toArray(form.querySelectorAll(SELECTOR_FIELD));
 }

 function focusFirstInvalid(form) {
     var fields = getFields(form);

     for (var i = 0; i < fields.length; i += 1) {
         if (fields[i].getAttribute("aria-invalid") === "true") {
             fields[i].focus();
             return;
         }
     }
 }

 /* ----------------------------------------------------------
  S ubmit handling *
  ---------------------------------------------------------- */

 function handleSubmit(event) {
     var form = event.currentTarget;

     event.preventDefault();

     var fields = getFields(form);
     var invalidCount = 0;

     fields.forEach(function (field) {
         if (!validateField(field)) {
             invalidCount += 1;
         }
     });

     if (invalidCount > 0) {
         setStatus(
             form,
                 TEXT.invalid + " " + TEXT.demo,
                 "error"
         );
         focusFirstInvalid(form);
         return;
     }

     /* The form is a static frontend demonstration. No request is
      m ade, no data *is stored, and the message intentionally
      states exactly that. */
     setStatus(form, TEXT.demo, "info");

     /* Reset the visible fields so the user can run through the
      d emonstration *again without leaving stale content in the
      inputs. This is a UI convenience only and does not imply
      anything was submitted. */
     form.reset();

     fields.forEach(function (field) {
         field.setAttribute("aria-invalid", "false");

         var error = getErrorElement(form, field);

         if (error) {
             error.textContent = "";
         }

         setDescribedBy(field, null);
     });
 }

 /* ----------------------------------------------------------
  L ive field behav*iour
  Once a field has been marked invalid, revalidate on input so
  the error clears as soon as the user fixes it. Errors are
  never shown for fields the user has not yet touched.
  ---------------------------------------------------------- */

 function handleFieldBlur(event) {
     var field = event.currentTarget;

     /* Only validate on blur when the field has content or was
      a lready flagge*d. This keeps required-field errors from
      appearing while the user tabs through an empty form. */
     if (
         field.value.trim().length ||
         field.getAttribute("aria-invalid") === "true"
     ) {
         validateField(field);
     }
 }

 function handleFieldInput(event) {
     var field = event.currentTarget;

     if (field.getAttribute("aria-invalid") === "true") {
         validateField(field);
     }
 }

 /* ----------------------------------------------------------
  I nitialisation  *
  ---------------------------------------------------------- */

 function attachForm(form) {
     if (!form || form.dataset.formBound === "true") {
         return;
     }

     var fields = getFields(form);

     if (!fields.length) {
         return;
     }

     /* The attributes below are set from JavaScript so they are
      o nly present w*hen the module is active. Without JavaScript
      the native browser validation would otherwise be silently
      disabled by novalidate in the markup, which is why the
      template should not include novalidate by default. */
     form.setAttribute("novalidate", "novalidate");

     fields.forEach(function (field) {
         if (!field.hasAttribute("aria-invalid")) {
             field.setAttribute("aria-invalid", "false");
         }

         field.addEventListener("blur", handleFieldBlur);
         field.addEventListener("input", handleFieldInput);
     });

     form.addEventListener("submit", handleSubmit);
     form.addEventListener("reset", function () {
         clearStatus(form);

         fields.forEach(function (field) {
             field.setAttribute("aria-invalid", "false");

             var error = getErrorElement(form, field);

             if (error) {
                 error.textContent = "";
             }

             setDescribedBy(field, null);
         });
     });

     form.dataset.formBound = "true";
 }

 function init() {
     var forms = document.querySelectorAll(SELECTOR_FORM);

     if (!forms.length) {
         return;
     }

     toArray(forms).forEach(attachForm);
 }

 window.APEX_FORMS = {
     validate: function (form) {
         if (!form || !form.querySelectorAll) {
             return { valid: false, invalidCount: 0 };
         }

         var fields = getFields(form);
         var invalidCount = 0;

         fields.forEach(function (field) {
             if (!validateField(field)) {
                 invalidCount += 1;
             }
         });

         return {
             valid: invalidCount === 0,
             invalidCount: invalidCount
         };
     },
     clearStatus: clearStatus
 };

 if (document.readyState === "loading") {
     document.addEventListener("DOMContentLoaded", init, { once: true });
 } else {
     init();
 }

})(window, document);
