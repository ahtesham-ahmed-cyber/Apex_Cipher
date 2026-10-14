# APEX CIPHER Project Map

This file provides a practical architecture overview of the APEX CIPHER static website and the purpose of each file in the project. It is designed to help any engineer or contributor quickly understand the codebase structure, file purpose, and the relationship between visual design, interactions, and deployment configuration.

---

## 1. Project Overview

APEX CIPHER is a static, multi-page technology website built with semantic HTML, layered CSS, and native vanilla JavaScript. The project is intentionally front-end focused and is designed for direct Netlify deployment without a build step.

The structure follows a simple resource model:

- HTML files define the page-level semantic structure
- CSS files define visual system, layout, animation, and responsive behavior
- JavaScript files provide progressive enhancement and interaction logic
- Static assets provide branding, icons, imagery, and design references
- Netlify and docs files support deployment and integration readiness

This project does not rely on a framework or backend runtime. It is a static multipage architecture built for clarity, maintainability, and clean deployment.

---

## 2. Root HTML Components

These files live at the project root and represent the public-facing pages of the website.

### 2.1 Main front-facing views

- `index.html`
  - Homepage and primary brand landing page.
  - Establishes the hero narrative, service positioning, capability summaries, selected work, and CTA flow.
  - Uses the shared semantic blueprint and site-wide styling system.

- `about.html`
  - Brand and team positioning page.
  - Explains company philosophy, engineering approach, delivery rhythm, and fit for client engagements.

- `services.html`
  - Service catalogue page.
  - Lists the delivery areas such as AI strategy, custom software, cloud engineering, and platform work.

- `ai-consulting.html`
  - Service-specific landing page for AI consulting and strategic advisory work.
  - Frames opportunity assessment, readiness reviews, and responsible AI planning.

- `software-development.html`
  - Engineering service page for implementation-heavy product and platform work.
  - Focuses on maintainability, integration, delivery discipline, and system longevity.

- `ai-solutions.html`
  - Applied AI and agent solution page.
  - Explains generative AI workflows, grounded systems, and operational guardrails.

- `industries.html`
  - Industry-specific positioning page.
  - Describes how sector constraints influence architecture, delivery, and compliance decisions.

- `work.html`
  - Portfolio and concept showcase page.
  - Highlights illustrative case studies and multi-discipline work examples.

- `case-study-ai-platform.html`
  - Detailed concept case study about an enterprise AI platform.
  - Demonstrates architecture, workflow design, evaluation, and governance considerations.

- `case-study-cloud-modernization.html`
  - Detailed modernization concept case study.
  - Covers migration sequencing, platform engineering, and progressive delivery planning.

- `insights.html`
  - Editorial and thought-leadership landing page.
  - Aggregates technical articles and long-form engineering content.

- `article-enterprise-ai.html`
  - Long-form article page for AI operating model and trust-oriented deployment thinking.

- `contact.html`
  - Inquiry and engagement contact page.
  - Contains the primary front-end contact experience and user intake flow.

- `faq.html`
  - Frequently asked questions and engagement clarification page.
  - Uses accordion-style JavaScript interaction for a readable FAQ experience.

- `privacy-policy.html`
  - Legal template page describing data handling and policy structure.
  - Includes placeholder content for business-specific details.

- `terms.html`
  - Website terms and usage page.
  - Serves as a static legal baseline template for publishing.

### 2.2 Error framework

- `404.html`
  - Custom not-found page.
  - Provides user recovery flow back to the homepage or contact page.
  - Works with the Netlify redirect configuration for unmatched route handling.

### 2.3 Shared semantic blueprint

All root HTML files follow a consistent static semantic structure:

- `header` with brand and navigation
- `main` with the unique page content
- semantic sections and content blocks
- `footer` with contact and navigation metadata
- shared JS and CSS resources loaded consistently

This approach maintains clear content hierarchy, accessibility, and predictable styling across the site.

---

## 3. Assets Framework: CSS

The CSS layer is organized into a design system with clear responsibilities.

### 3.1 `assets/css/tokens.css`

Design token layer for the visual system.

Responsibilities:
- Color primitives for midnight navy, neon cyan, electric violet, and supporting neutrals
- Typography scale and line-height constraints
- Spacing tokens, radius values, shadow definitions, and layout offsets
- Shared semantic naming used across page sections and components
- Brand consistency rules for all UI surfaces, cards, calls-to-action, and panels

This file establishes the default system that all pages inherit.

### 3.2 `assets/css/reset.css`

Global reset layer.

Responsibilities:
- Normalizes browser defaults
- Removes default margins, padding, and inconsistent list styling
- Sets predictable box-sizing, form styling, and typography defaults
- Creates a consistent foundation before theme styling is applied

### 3.3 `assets/css/base.css`

Baseline document styling.

Responsibilities:
- Base page structure, typography defaults, and body styling
- Global link styling, focus states, and semantic text treatment
- Shared utility-like foundation classes used throughout the site
- Core layout baseline for all pages

### 3.4 `assets/css/layout.css`

Layout system and structural framing.

Responsibilities:
- Container patterns and page grid scaffolding
- Header, footer, and section sizing conventions
- Spatial rules for content alignment and page rhythm
- Shared page layout building blocks used by multiple HTML files

### 3.5 `assets/css/components.css`

Reusable component styling layer.

Responsibilities:
- Navigation behavior styling, CTA buttons, cards, and forms
- Floating Back-button UI and glassmorphism treatment
- Orbital hero matrix setup, including the `.orbital__core` structure and visual composition
- Shared interface modules like panels, badges, service cards, and focus states
- Brand-specific UI surfaces that are reused across pages

This file is the functional design layer for reusable visual elements and the hero composition logic.

### 3.6 `assets/css/animations.css`

Motion and visual transition layer.

Responsibilities:
- Reveal-on-scroll animation rules
- Orbital motion, floating panel behavior, and decorative motion patterns
- Subtle transitions and micro-interactions for UI emphasis
- Ambient visual movement to support the APEX CIPHER high-tech aesthetic

### 3.7 `assets/css/pages.css`

Page-level visual overrides and custom page composition rules.

Responsibilities:
- Page hero treatment and landing-page-specific structure
- Section-level custom styling beyond the shared component set
- Interior page composition tuning for content-heavy templates
- Additional visual rules that apply to specific categories of pages, such as legal, article, and case-study layouts

### 3.8a `assets/css/navbar.css` (new)

Owns the entire navigation system: cyberpunk capsule bar, liquid tracker, 1-degree micro-tilt transform, exact 3-column header grid, FontAwesome icon styling, and the mobile burger with underlay drawer. Loaded after `responsive.css`.

### 3.8b `assets/css/accordion.css` (new)

Horizontal accordion service cards: spring flex-grow sizing, adjacent-card muting layer, contextual content reveal, and the responsive swap to a 2-column / 1-column grid below 960px.

### 3.8 `assets/css/responsive.css`

Responsive breakpoint layer.

Responsibilities:
- Mobile and tablet rules for navigation, grids, and hero layouts
- Breakpoint-specific adjustments for readability and safe spacing
- Controls for horizontal overflow prevention and content reflow
- Standard adaptation rules that keep the design usable across common screen sizes

---

## 4. Assets Framework: JavaScript Modules

The JavaScript layer is built with native browser capabilities and modular responsibilities.

### 4.1 `assets/js/config.js`

Shared configuration and canonical path map.

Responsibilities:
- Stores brand metadata and static site identity strings
- Defines canonical internal page paths for navigation and route references
- Centralizes reusable values that other scripts can access without duplication
- Keeps site-level references consistent and maintainable

### 4.2 `assets/js/api-client.js`

API and frontend seam abstraction layer.

Responsibilities:
- Provides a safe, static-site approach to data access patterns
- Establishes the client-side interface boundary for any future backend integration
- Handles data-fetch attempts in a defensive, non-breaking way
- Keeps potential front-end-to-backend integration isolated from UI modules

This file reflects the project’s documented frontend-to-backend seam rather than a full backend implementation.

### 4.3 `assets/js/navigation.js`

Primary navigation system.

Responsibilities:
- Mobile menu toggle behavior
- Current-page highlighting for nav items
- Home-link injection and active-route detection
- Liquid tracker positioning, 1-degree pointer/gyroscope micro-tilt, underlay drawer (focus trap, Escape, scroll lock)
- Floating Back-button generation and browser-history behavior
- Shared navigation logic used across multiple pages

This is one of the key behavior modules for experienced visitor navigation across the multi-page structure.

### 4.3a `assets/js/accordion.js` (new)

Drives the service-card accordion: active card, `.is-engaged` row state, `data-distance` for muting, touch tap-to-expand.

### 4.4 `assets/js/animations.js`

Animation and reveal system.

Responsibilities:
- Scroll-triggered reveal animations
- Interactive lighting and pointer-based motion effects
- Controlled motion for animated UI components
- Visual polish without requiring any external libraries

### 4.5 `assets/js/cards.js`

Card interaction logic.

Responsibilities:
- Pointer-driven hover and tilt behavior for cards
- Lightweight visual enhancement for service and concept surfaces
- UI motion associated with content tiles and feature panels

### 4.6 `assets/js/filters.js`

Client-side filtering logic.

Responsibilities:
- Works with portfolio/work sections that need browser-side filtering
- Supports category or discipline-based filtering without external data
- Keeps filtering logic local and accessible within the static-site model

### 4.7 `assets/js/faq.js`

Accessible accordion logic for FAQs.

Responsibilities:
- Expand/collapse FAQ items
- Keyboard and semantic accessibility handling
- Toggle states and interaction behavior for educational content blocks

### 4.8 `assets/js/forms.js`

Form interaction and validation logic.

Responsibilities:
- Contact form field validation
- Demo-status or form-submission feedback
- Client-side user experience for the static contact flow
- Frontend-only validation without backend dependencies

### 4.9 `assets/js/main.js`

Application bootstrap and document readiness entry point.

Responsibilities:
- Marks the document as JavaScript-ready
- Initialises shared UI state for the site
- Populates year or runtime metadata where needed
- Provides the central entry namespace for scripts and their runtime checks
- Ensures modules are registered and enables a coherent startup sequence

This is the final startup file that brings the site’s script layer together.

---

## 5. Configuration and Governance Files

### 5.1 `netlify.toml`

Netlify deployment configuration.

Responsibilities:
- Redirect rules for route handling and custom 404 support
- Static host configuration for Netlify deployment
- Ensures the project can be deployed directly without a build pipeline

### 5.2 `README.md`

Project documentation and onboarding overview.

Responsibilities:
- Describes the project purpose and stack
- Lists the pages included in the static site
- Documents local preview commands
- Outlines Netlify deployment procedure
- Summarizes design and hosting assumptions

### 5.3 `docs/backend-integration.md`

Frontend-to-backend integration seam document.

Responsibilities:
- Outlines how the static front-end can connect to backend services if needed in the future
- Documents API boundaries, payload expectations, and integration concerns
- Describes the place where future server-side functionality would fit without breaking the static architecture
- Helps separate client-side behavior from future engineering extension points

This file acts as a technical handoff point between front-end design and any future operational system integration.

---

## 6. Static Asset Directories

### `assets/images/`

Contains visual media for case studies, insight content, project themes, and hero imagery.

Examples:
- hero visuals
- project concept imagery
- insights and article graphics
- team or brand-supporting visual assets

### `assets/icons/`

Contains brand and interface icon assets, including the favicon and reusable SVG marks.

### `assets/js/`

Contains the site interaction modules and bootstrapping logic.

### `assets/css/`

Contains the visual system, layout rules, styling components, and responsive adjustments.

---

## 7. Architecture Summary

The site is organized as a clean, static multi-page architecture with clear responsibilities:

- HTML files define the content and structure of each route
- CSS files define the visual system, layout, and responsive behavior
- JavaScript files provide progressive enhancement and interaction logic
- Static assets support the brand, visual narrative, and presentation layers
- Deployment files and docs keep the project portable, maintainable, and Netlify-ready

This design keeps the codebase simple, easy to scan, and well suited to a small professional static marketing and consulting website.

---

## 8. Recommended Mental Model

When navigating the project, think of it as a layered stack:

1. Semantic content pages
2. Shared design tokens and visual foundation
3. Reusable UI components and page-specific composition rules
4. JavaScript-control layer for interactivity
5. Static deployment and integration governance

This separation keeps the design system clean and ensures each file has a specific and understandable purpose.
