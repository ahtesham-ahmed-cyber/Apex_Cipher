/* ============================================================
 A PEX CIP*HER — Config
 Simple, safe frontend configuration shared by the site's
 JavaScript modules.

 This file must never contain credentials, API keys, private
 endpoints, or any value that would be unsafe to expose in a
 client-side bundle. The project is a static frontend
 demonstration; nothing here enables server communication.
 ============================================================ */

(function (window) {
    "use strict";

    /**
     * Brand metadata used by scripts that need to reference the
     * official identity without duplicating strings across files.
     */
    var brand = {
        name: "APEX CIPHER",
        tagline: "A technology team by The Secure Script",
        attribution: "The Secure Script"
    };

    /**
     * Canonical internal paths. Scripts should reference these
     * rather than hard-coding URLs so a future restructure only
     * requires a single edit.
     */
    var paths = {
        home: "index.html",
        about: "about.html",
        services: "services.html",
        aiConsulting: "ai-consulting.html",
        softwareDevelopment: "software-development.html",
        aiSolutions: "ai-solutions.html",
        industries: "industries.html",
        work: "work.html",
        caseStudyAiPlatform: "case-study-ai-platform.html",
            caseStudyCloudModernization: "case-study-cloud-modernization.html",
                insights: "insights.html",
                articleEnterpriseAi: "article-enterprise-ai.html",
                contact: "contact.html",
                faq: "faq.html",
                privacyPolicy: "privacy-policy.html",
                terms: "terms.html",
                notFound: "404.html"
    };

    /**
     * Navigation behaviour.
     *  - mobileBreakpoint: must stay in sync with the --bp-md token
     *    in tokens.css and the media query in responsive.css.
     *  - closeOnLinkClick: collapse the mobile panel after a link.
     *  - closeOnEscape: allow the Escape key to dismiss the panel.
     *  - closeOnOutsideClick: dismiss when the pointer leaves the
     *    navigation region.
     */
    var navigation = {
        mobileBreakpoint: 1024,
        closeOnLinkClick: true,
        closeOnEscape: true,
        closeOnOutsideClick: true,
        scrollOffset: 12
    };

    /**
     * Shared scroll-reveal behaviour.
     *  - threshold: fraction of the element that must be visible.
     *  - rootMargin: expands the observation area so elements
     *    reveal slightly before entering the viewport.
     *  - once: stop observing after the first reveal.
     */
    var animations = {
        reveal: {
            threshold: 0.15,
            rootMargin: "0px 0px -8% 0px",
            once: true
        },
        revealDelayStep: 80
    };

    /**
     * Pointer interaction settings. Tilt and pointer lighting are
     * disabled automatically on touch devices and whenever the
     * user prefers reduced motion; those checks live in the
     * modules that consume these values.
     */
    var interactions = {
        tilt: {
            enabled: true,
            maxAngle: 6,
            perspective: 1200
        },
        pointerLight: {
            enabled: true
        }
    };

    /**
     * Client-side form demonstration settings.
     *
     * submissionEnabled is intentionally false. The contact form
     * is a front-end demonstration only: it must never claim to
     * have transmitted a message. forms.js reads this flag and
     * reports an honest in-page outcome instead.
     */
    var forms = {
        submissionEnabled: false,
 minimumMessageLength: 20,
 maximumMessageLength: 2000,
 statusResetDelay: 8000,
 messages: {
     success: "This is a front-end demonstration. Your message was not transmitted or stored.",
     invalid: "Please review the highlighted fields before continuing.",
     required: "This field is required.",
     emailInvalid: "Enter a valid email address.",
     messageShort: "Please provide a little more detail.",
     messageLong: "Please shorten your message."
 }
    };

    /**
     * Portfolio and insight filtering. Keys map to the value of
     * each filter chip's data-filter attribute; "all" must always
     * be present.
     */
    var filters = {
        allKey: "all",
        animateItems: true
    };

    /**
     * Accordion behaviour. allowMultiple controls whether more
     * than one panel may remain open at the same time.
     */
    var accordion = {
        allowMultiple: true
    };

    /**
     * Homepage hero carousel settings. This is the single source of
     * truth for slides, copy, and timing for a premium rotating hero.
     */
    var heroSlider = {
        intervalMs: 5000,
        slides: [
            {
                eyebrow: "AI + Systems",
                title: "Precision engineering",
                preTitle: "for",
                accent: "intelligent systems",
                description: "From AI strategy and product discovery to resilient cloud architecture, we design the systems that power better decisions and sharper execution.",
                ctaLabel: "Start a project",
                ctaHref: "contact.html",
                background: "assets/images/hero/hero-wide.webp"
            },
            {
                eyebrow: "Applied Intelligence",
                title: "Machine learning built",
                preTitle: "for",
                accent: "decision velocity",
                description: "We translate experimental AI into measurable workflows, explainable interfaces, and operational systems your teams can trust in production.",
                ctaLabel: "Explore AI solutions",
                ctaHref: "ai-solutions.html",
                background: "assets/images/insights/ai-insights.webp"
            },
            {
                eyebrow: "Cloud architecture",
                title: "Modern platforms",
                preTitle: "for",
                accent: "scalable delivery",
                description: "Cloud-native foundations, automation, and platform thinking keep your engineering organization fast without sacrificing quality or control.",
                ctaLabel: "View services",
                ctaHref: "services.html",
                background: "assets/images/insights/cloud-engineering.webp"
            },
            {
                eyebrow: "Data intelligence",
                title: "Actionable insight",
                preTitle: "for",
                accent: "complex operations",
                description: "We connect the data pipeline, the model layer, and the user experience so business decisions are grounded in timely, trustworthy information.",
                ctaLabel: "See selected work",
                ctaHref: "work.html",
                background: "assets/images/projects/ai-platform.webp"
            },
            {
                eyebrow: "Product engineering",
                title: "Digital experiences",
                preTitle: "designed for",
                accent: "human clarity",
                description: "From interface systems to product strategy, we create the polished digital products that turn complex technical work into confident customer moments.",
                ctaLabel: "Book a conversation",
                ctaHref: "contact.html",
                background: "assets/images/projects/cloud-modernization.webp"
            }
        ]
    };

    /**
     * Independent rotating content for any page hero that needs a
     * page-specific narrative without replacing the existing homepage
     * slider implementation.
     */
    var pageHeroSlides = {
        about: [
            {
                eyebrow: "Who we are",
                title: "We build systems that earn <span class=\"text-gradient\">their place</span>",
                description: "We stay close to the work so the architecture, code, and operating model match the realities of the business they serve.",
                meta: ["Applied AI", "Product Engineering", "Cloud & Platform"],
                ctaLabel: "Explore our approach",
                ctaHref: "about.html",
                image: "assets/images/hero/hero-wide.webp",
                alt: "AI platform concept illustration"
            },
            {
                eyebrow: "How we work",
                title: "Small team, broad capability, <span class=\"text-gradient\">clear decisions</span>",
                description: "Commercial clarity, technical honesty, and direct communication keep delivery predictable from discovery through handoff.",
                meta: ["Discovery", "Architecture", "Delivery"],
                ctaLabel: "See services",
                ctaHref: "services.html",
                image: "assets/images/insights/ai-insights.webp",
                alt: "AI consulting strategy concept"
            },
            {
                eyebrow: "What we value",
                title: "Technology that stays <span class=\"text-gradient\">legible and useful</span>",
                description: "The strongest systems are understandable to operators, extensible for teams, and designed for change without brittle workarounds.",
                meta: ["Legibility", "Operational clarity", "Trust"],
                ctaLabel: "Review work",
                ctaHref: "work.html",
                image: "assets/images/projects/ai-platform.webp",
                alt: "AI platform architecture overview"
            },
            {
                eyebrow: "Why it matters",
                title: "Work that scales with the <span class=\"text-gradient\">people behind it</span>",
                description: "We leave teams with a system they can understand, operate, and extend confidently instead of depending on a single point of knowledge.",
                meta: ["Knowledge transfer", "Resilience", "Runbooks"],
                ctaLabel: "Start a project",
                ctaHref: "contact.html",
                image: "assets/images/projects/cloud-modernization.webp",
                alt: "Cloud modernization concept"
            }
        ],
        services: [
            {
                eyebrow: "AI strategy",
                title: "AI and applied intelligence that <span class=\"text-gradient\">changes execution</span>",
                description: "We help organizations identify where AI improves decisions, operational leverage, and customer experience without introducing unnecessary complexity.",
                meta: ["Discovery", "Roadmaps", "Adoption"],
                ctaLabel: "Explore AI consulting",
                ctaHref: "ai-consulting.html",
                image: "assets/images/insights/ai-insights.webp",
                alt: "AI consulting strategy concept"
            },
            {
                eyebrow: "Software engineering",
                title: "Custom product and platform work built for <span class=\"text-gradient\">reliable delivery</span>",
                description: "From data flows to interfaces, we build systems that are testable, maintainable, and easy for your team to extend with confidence.",
                meta: ["Architecture", "Product builds", "Delivery"],
                ctaLabel: "See software development",
                ctaHref: "software-development.html",
                image: "assets/images/insights/software-engineering.webp",
                alt: "Custom software engineering concept"
            },
            {
                eyebrow: "Cloud & platform",
                title: "Modern platforms for <span class=\"text-gradient\">speed and control</span>",
                description: "We design cloud foundations with the right guardrails so teams move faster without compromising security, resilience, or operational clarity.",
                meta: ["Cloud foundations", "Automation", "Observability"],
                ctaLabel: "View platform work",
                ctaHref: "case-study-cloud-modernization.html",
                image: "assets/images/insights/cloud-engineering.webp",
                alt: "Cloud engineering platform concept"
            },
            {
                eyebrow: "Quality engineering",
                title: "Systems that stay stable as <span class=\"text-gradient\">they grow</span>",
                description: "Reliability, testability, and handoff discipline reduce the likelihood of hidden breakage when requirements and volume increase.",
                meta: ["QA strategy", "Automation", "Support"],
                ctaLabel: "Talk with the team",
                ctaHref: "contact.html",
                image: "assets/images/projects/cloud-modernization.webp",
                alt: "Cloud modernization concept"
            }
        ],
        industries: [
            {
                eyebrow: "Financial services",
                title: "Risk, trust, and operations for <span class=\"text-gradient\">high-stakes decisions</span>",
                description: "We help regulated organizations modernize critical systems while preserving control, auditability, and security around decision-making processes.",
                meta: ["Governance", "Automation", "Compliance"],
                ctaLabel: "Discuss your industry",
                ctaHref: "contact.html",
                image: "assets/images/projects/ai-platform.webp",
                alt: "AI platform architecture overview"
            },
            {
                eyebrow: "Healthcare",
                title: "Technology that supports care with <span class=\"text-gradient\">clear operational flow</span>",
                description: "From patient-facing workflows to internal operations, the work needs to be dependable, compliant, and easy to evolve as processes change.",
                meta: ["Workflow design", "Data quality", "Clinical ops"],
                ctaLabel: "See platform examples",
                ctaHref: "work.html",
                image: "assets/images/insights/cloud-engineering.webp",
                alt: "Cloud engineering platform concept"
            },
            {
                eyebrow: "Manufacturing",
                title: "Connected systems that improve <span class=\"text-gradient\">production visibility</span>",
                description: "Operational dashboards, integrations, and workflow automation help teams reduce friction and understand where bottlenecks or risks are forming.",
                meta: ["Operations", "Integration", "Analytics"],
                ctaLabel: "Review case studies",
                ctaHref: "case-study-cloud-modernization.html",
                image: "assets/images/projects/cloud-modernization.webp",
                alt: "Cloud modernization concept"
            },
            {
                eyebrow: "Professional services",
                title: "Delivery systems that make <span class=\"text-gradient\">expertise scalable</span>",
                description: "High-service organizations need repeatable flows, curated knowledge, and accessible data so client work can scale without friction.",
                meta: ["Service models", "Knowledge systems", "Client operations"],
                ctaLabel: "Talk to APEX CIPHER",
                ctaHref: "contact.html",
                image: "assets/images/insights/ai-insights.webp",
                alt: "AI consulting strategy concept"
            }
        ],
        work: [
            {
                eyebrow: "AI platform",
                title: "AI product work designed for <span class=\"text-gradient\">strategic adoption</span>",
                description: "We pair product thinking with strong delivery practice so AI solutions become dependable business capabilities, not isolated experiments.",
                meta: ["Discovery", "AI product design", "Rollout"],
                ctaLabel: "View AI platform case study",
                ctaHref: "case-study-ai-platform.html",
                image: "assets/images/projects/ai-platform.webp",
                alt: "Enterprise AI platform concept"
            },
            {
                eyebrow: "Cloud modernization",
                title: "Migration and platform redesign for <span class=\"text-gradient\">clarity and speed</span>",
                description: "By simplifying the core platform, we give teams more confidence in shipping and operating at scale without hidden system debt.",
                meta: ["Migration", "Platform engineering", "Stability"],
                ctaLabel: "Read the modernization story",
                ctaHref: "case-study-cloud-modernization.html",
                image: "assets/images/projects/cloud-modernization.webp",
                alt: "Cloud modernization concept"
            },
            {
                eyebrow: "Delivery systems",
                title: "Operational tooling built for <span class=\"text-gradient\">repeatable execution</span>",
                description: "The strongest systems bring visibility to work, reduce manual coordination, and give teams a common source of truth for delivery.",
                meta: ["Workflow design", "Automation", "Visibility"],
                ctaLabel: "Explore services",
                ctaHref: "services.html",
                image: "assets/images/insights/cloud-engineering.webp",
                alt: "Cloud engineering platform concept"
            },
            {
                eyebrow: "Customer experience",
                title: "Digital products shaped by <span class=\"text-gradient\">human clarity</span>",
                description: "We design interfaces and experiences that make strong technical systems easier to adopt, trust, and keep using across a business.",
                meta: ["UX direction", "Build design", "Handoff"],
                ctaLabel: "Start a conversation",
                ctaHref: "contact.html",
                image: "assets/images/hero/hero-wide.webp",
                alt: "AI platform concept illustration"
            }
        ],
        insights: [
            {
                eyebrow: "AI roadmap",
                title: "Practical AI strategy for <span class=\"text-gradient\">real business constraints</span>",
                description: "We focus on constraints, operating model, and measurable value so AI investments remain relevant after the pilot phase ends.",
                meta: ["Strategy", "Value framing", "Execution"],
                ctaLabel: "Read the article",
                ctaHref: "article-enterprise-ai.html",
                image: "assets/images/insights/ai-insights.webp",
                alt: "AI consulting strategy concept"
            },
            {
                eyebrow: "Cloud reliability",
                title: "Resilient systems begin with <span class=\"text-gradient\">clear foundations</span>",
                description: "A stable platform is not just about uptime. It is about sensible architecture, observability, and operations that people can trust.",
                meta: ["Cloud teams", "Monitoring", "Resilience"],
                ctaLabel: "See cloud guidance",
                ctaHref: "services.html",
                image: "assets/images/insights/cloud-engineering.webp",
                alt: "Cloud engineering platform concept"
            },
            {
                eyebrow: "Engineering quality",
                title: "Reliable delivery depends on <span class=\"text-gradient\">reviewable systems</span>",
                description: "Small and consistent practices around testing, documentation, and review lead to far better outcomes than heroics under pressure.",
                meta: ["QA", "Automation", "Practices"],
                ctaLabel: "Review engineering work",
                ctaHref: "software-development.html",
                image: "assets/images/insights/software-engineering.webp",
                alt: "Software engineering and delivery concept"
            },
            {
                eyebrow: "Product decisions",
                title: "Good product decisions come from <span class=\"text-gradient\">clear signals</span>",
                description: "Teams need a disciplined way to understand the trade-offs, measure outcomes, and decide what should be built next.",
                meta: ["Decision making", "Product data", "Roadmaps"],
                ctaLabel: "Talk to the team",
                ctaHref: "contact.html",
                image: "assets/images/projects/ai-platform.webp",
                alt: "AI platform architecture overview"
            }
        ],
        contact: [
            {
                eyebrow: "Engagement",
                title: "Tell us where the <span class=\"text-gradient\">decision pressure is</span>",
                description: "Whether the challenge is product strategy, AI adoption, or platform modernization, we can scope the work realistically with you.",
                meta: ["Discovery", "Scope", "Engagement"],
                ctaLabel: "Start the conversation",
                ctaHref: "contact.html",
                image: "assets/images/hero/hero-wide.webp",
                alt: "Contact and engagement illustration"
            },
            {
                eyebrow: "AI readiness",
                title: "Map the opportunity before <span class=\"text-gradient\">the build starts</span>",
                description: "The best delivery paths start with a realistic view of value, technical constraints, and the operational load your team can support.",
                meta: ["AI planning", "Roadmaps", "Business fit"],
                ctaLabel: "See AI strategy",
                ctaHref: "ai-consulting.html",
                image: "assets/images/insights/ai-insights.webp",
                alt: "AI consulting strategy concept"
            },
            {
                eyebrow: "Delivery confidence",
                title: "Build with a partner who stays <span class=\"text-gradient\">on the build</span>",
                description: "We bring product thinking, architecture depth, and engineering execution so the work stays grounded and maintainable.",
                meta: ["Product delivery", "Architecture", "Execution"],
                ctaLabel: "Review services",
                ctaHref: "services.html",
                image: "assets/images/projects/cloud-modernization.webp",
                alt: "Cloud modernization concept"
            }
        ],
        faq: [
            {
                eyebrow: "Questions",
                title: "Common questions with <span class=\"text-gradient\">clear answers</span>",
                description: "We answer the practical questions behind scope, implementation, team fit, and how we structure delivery around real constraints.",
                meta: ["Scope", "Fit", "Delivery"],
                ctaLabel: "Ask a question",
                ctaHref: "contact.html",
                image: "assets/images/insights/software-engineering.webp",
                alt: "FAQ and engagement questions"
            },
            {
                eyebrow: "Support",
                title: "We help teams move from <span class=\"text-gradient\">uncertainty to clarity</span>",
                description: "The right next step is often a focused recommendation, not a full transformation. We aim to answer that precisely.",
                meta: ["Guidance", "Direction", "Honest fit"],
                ctaLabel: "Book a conversation",
                ctaHref: "contact.html",
                image: "assets/images/projects/ai-platform.webp",
                alt: "AI platform architecture overview"
            },
            {
                eyebrow: "Process",
                title: "Discovery and execution designed for <span class=\"text-gradient\">practical momentum</span>",
                description: "Every engagement is designed to create momentum with clear decisions, reviewable progress, and a sustainable operating model.",
                meta: ["Discovery", "Execution", "Handover"],
                ctaLabel: "View services",
                ctaHref: "services.html",
                image: "assets/images/insights/cloud-engineering.webp",
                alt: "Cloud engineering platform concept"
            }
        ],
        "ai-consulting": [
            {
                eyebrow: "AI strategy",
                title: "Strategy that connects <span class=\"text-gradient\">business need and technical reality</span>",
                description: "We help teams identify the use cases that deserve focus and the platforms, data, and governance required to support them responsibly.",
                meta: ["Opportunity framing", "Roadmaps", "Adoption"],
                ctaLabel: "Talk to the team",
                ctaHref: "contact.html",
                image: "assets/images/insights/ai-insights.webp",
                alt: "AI consulting strategy concept"
            },
            {
                eyebrow: "Applied intelligence",
                title: "AI programs built for <span class=\"text-gradient\">practical adoption</span>",
                description: "We design for real operating constraints so teams can move from idea to workflow without creating fragile experiments or blind dependencies.",
                meta: ["Use cases", "Workflow design", "Execution"],
                ctaLabel: "See case studies",
                ctaHref: "work.html",
                image: "assets/images/projects/ai-platform.webp",
                alt: "AI platform architecture overview"
            },
            {
                eyebrow: "Governance",
                title: "Clear operating models for <span class=\"text-gradient\">trust and scale</span>",
                description: "Strong AI adoption needs governance, data stewardship, and sensible review loops so teams remain accountable as the system matures.",
                meta: ["Governance", "Data quality", "Review"],
                ctaLabel: "Book discovery",
                ctaHref: "contact.html",
                image: "assets/images/hero/hero-wide.webp",
                alt: "AI platform concept illustration"
            }
        ],
        "ai-solutions": [
            {
                eyebrow: "AI solutions",
                title: "Operational intelligence built around <span class=\"text-gradient\">human decision-making</span>",
                description: "From workflow automation to decision support, we build systems that make knowledge more accessible and actions more measurable.",
                meta: ["AI product", "Data flows", "Ops support"],
                ctaLabel: "Discuss your roadmap",
                ctaHref: "contact.html",
                image: "assets/images/projects/ai-platform.webp",
                alt: "AI platform architecture overview"
            },
            {
                eyebrow: "Design and delivery",
                title: "AI features that feel <span class=\"text-gradient\">usable and dependable</span>",
                description: "The strongest solution does not just generate output. It builds trust with interface quality, observability, and realistic task alignment.",
                meta: ["UX", "Testing", "Handover"],
                ctaLabel: "View work",
                ctaHref: "work.html",
                image: "assets/images/insights/ai-insights.webp",
                alt: "AI consulting strategy concept"
            },
            {
                eyebrow: "Scale",
                title: "Solutions that grow with the <span class=\"text-gradient\">organization</span>",
                description: "We help teams avoid fragile AI experiments by designing workflows, infrastructure, and governance around long-term operational needs.",
                meta: ["System design", "Reliability", "Operations"],
                ctaLabel: "Review services",
                ctaHref: "services.html",
                image: "assets/images/projects/cloud-modernization.webp",
                alt: "Cloud modernization concept"
            }
        ],
        "article-enterprise-ai": [
            {
                eyebrow: "Perspective",
                title: "Enterprise AI needs more than <span class=\"text-gradient\">model excitement</span>",
                description: "The value of AI is created by alignment, workflow design, governance, and operational tracing rather than isolated demos.",
                meta: ["AI operations", "Strategy", "Execution"],
                ctaLabel: "Read more insights",
                ctaHref: "insights.html",
                image: "assets/images/insights/ai-insights.webp",
                alt: "Enterprise AI article illustration"
            },
            {
                eyebrow: "Systems",
                title: "Better decisions require <span class=\"text-gradient\">better information flow</span>",
                description: "A useful AI system needs trustworthy inputs, clear design choices, and well-scoped feedback loops inside real operations.",
                meta: ["Architecture", "Decision flow", "Workflow"],
                ctaLabel: "Talk strategy",
                ctaHref: "ai-consulting.html",
                image: "assets/images/projects/ai-platform.webp",
                alt: "AI platform architecture overview"
            },
            {
                eyebrow: "Execution",
                title: "Large organizations need <span class=\"text-gradient\">disciplined adoption</span>",
                description: "AI value emerges where product clarity, operational design, and business accountability are aligned from the start.",
                meta: ["Adoption", "Delivery", "Capability"],
                ctaLabel: "Start a project",
                ctaHref: "contact.html",
                image: "assets/images/projects/cloud-modernization.webp",
                alt: "Cloud modernization concept"
            }
        ],
        "case-study-ai-platform": [
            {
                eyebrow: "Case study",
                title: "An AI platform designed for <span class=\"text-gradient\">clarity at scale</span>",
                description: "This work balanced product ambition, operational risk, and delivery constraints to create a system teams could trust and extend.",
                meta: ["AI product", "Workflow system", "Delivery"],
                ctaLabel: "View similar work",
                ctaHref: "work.html",
                image: "assets/images/projects/ai-platform.webp",
                alt: "Enterprise AI platform concept"
            },
            {
                eyebrow: "Outcomes",
                title: "Decision support with <span class=\"text-gradient\">better operating rhythm</span>",
                description: "The result decreased friction in the workflow and created a stronger foundation for ongoing product iteration and adoption.",
                meta: ["Value", "Operational fit", "Feedback"],
                ctaLabel: "Talk to the team",
                ctaHref: "contact.html",
                image: "assets/images/insights/ai-insights.webp",
                alt: "AI consulting strategy concept"
            },
            {
                eyebrow: "Delivery",
                title: "Strong engineering strategy without <span class=\"text-gradient\">unnecessary complexity</span>",
                description: "Clear design choices, measured delivery, and realistic handoff made the platform stronger than a faster, noisier build could have been.",
                meta: ["Architecture", "Delivery", "Handover"],
                ctaLabel: "See services",
                ctaHref: "services.html",
                image: "assets/images/hero/hero-wide.webp",
                alt: "AI platform concept illustration"
            }
        ],
        "case-study-cloud-modernization": [
            {
                eyebrow: "Case study",
                title: "Cloud modernization that improves <span class=\"text-gradient\">speed and confidence</span>",
                description: "The work corrected underlying platform friction so teams could deliver more, remove bottlenecks, and operate with better visibility.",
                meta: ["Cloud platform", "Migration", "Ops"],
                ctaLabel: "See platform services",
                ctaHref: "services.html",
                image: "assets/images/projects/cloud-modernization.webp",
                alt: "Cloud modernization concept"
            },
            {
                eyebrow: "Architecture",
                title: "Simplified foundations for <span class=\"text-gradient\">safer growth</span>",
                description: "Modernization becomes worthwhile when it reduces cognitive load, creates clearer ownership, and prepares the system for another cycle of change.",
                meta: ["Architecture", "Automation", "Reliability"],
                ctaLabel: "Review work",
                ctaHref: "work.html",
                image: "assets/images/insights/cloud-engineering.webp",
                alt: "Cloud engineering platform concept"
            },
            {
                eyebrow: "Evolution",
                title: "A platform that supports <span class=\"text-gradient\">continuous improvement</span>",
                description: "The best platform changes are not one-time rewrites; they are well-governed evolutions that make the next change simpler.",
                meta: ["Platform health", "Roadmaps", "Delivery"],
                ctaLabel: "Talk with the team",
                ctaHref: "contact.html",
                image: "assets/images/hero/hero-wide.webp",
                alt: "AI platform concept illustration"
            }
        ],
        "software-development": [
            {
                eyebrow: "Engineering",
                title: "Product and platform work shaped by <span class=\"text-gradient\">quality and clarity</span>",
                description: "We combine architecture, coding standards, and delivery discipline so modern software stays maintainable as teams and demands grow.",
                meta: ["Software delivery", "Architecture", "QA"],
                ctaLabel: "Explore engineering",
                ctaHref: "services.html",
                image: "assets/images/insights/software-engineering.webp",
                alt: "Custom software engineering concept"
            },
            {
                eyebrow: "Build systems",
                title: "Better engineering operations create <span class=\"text-gradient\">faster, safer delivery</span>",
                description: "Process quality matters as much as code quality when the objective is sustainable product velocity.",
                meta: ["Delivery flow", "Automation", "Quality"],
                ctaLabel: "See work",
                ctaHref: "work.html",
                image: "assets/images/projects/cloud-modernization.webp",
                alt: "Cloud modernization concept"
            },
            {
                eyebrow: "Product focus",
                title: "Software that supports the <span class=\"text-gradient\">actual work</span>",
                description: "The right system gives people a clear path to complete tasks, understand status, and evolve the product without constant friction.",
                meta: ["Product design", "Build quality", "Operations"],
                ctaLabel: "Book a conversation",
                ctaHref: "contact.html",
                image: "assets/images/projects/ai-platform.webp",
                alt: "AI platform architecture overview"
            }
        ],
        "privacy-policy": [
            {
                eyebrow: "Trust",
                title: "Clear policies and <span class=\"text-gradient\">responsible handling</span>",
                description: "We respect the boundaries around consent, transparency, and operational care for the information entrusted to us.",
                meta: ["Privacy", "Security", "Trust"],
                ctaLabel: "Contact the team",
                ctaHref: "contact.html",
                image: "assets/images/hero/hero-wide.webp",
                alt: "Privacy and compliance illustration"
            },
            {
                eyebrow: "Governance",
                title: "Thoughtful practice for <span class=\"text-gradient\">good information stewardship</span>",
                description: "Good data handling is a product and operational responsibility. We align policies to the way the work really operates.",
                meta: ["Policy", "Process", "Care"],
                ctaLabel: "Review services",
                ctaHref: "services.html",
                image: "assets/images/insights/cloud-engineering.webp",
                alt: "Cloud engineering platform concept"
            },
            {
                eyebrow: "Transparency",
                title: "Operational clarity breeds <span class=\"text-gradient\">greater trust</span>",
                description: "Clear communication about how systems work supports stronger relationships and better decisions for everyone involved.",
                meta: ["Transparency", "Responsibility", "Process"],
                ctaLabel: "See the FAQ",
                ctaHref: "faq.html",
                image: "assets/images/insights/software-engineering.webp",
                alt: "FAQ and engagement questions"
            }
        ],
        terms: [
            {
                eyebrow: "Terms",
                title: "Working with clear <span class=\"text-gradient\">boundaries and expectations</span>",
                description: "We believe clear terms, honest scoping, and strong communication protect both the client relationship and the delivery outcome.",
                meta: ["Scope", "Accountability", "Partnership"],
                ctaLabel: "Talk about project scope",
                ctaHref: "contact.html",
                image: "assets/images/hero/hero-wide.webp",
                alt: "Website policies and terms overview"
            },
            {
                eyebrow: "Partnership",
                title: "Strong working agreement, <span class=\"text-gradient\">better delivery</span>",
                description: "The clarity around responsibilities, timelines, and handover makes the work more predictable and easier to sustain.",
                meta: ["Clarity", "Execution", "Handover"],
                ctaLabel: "Review services",
                ctaHref: "services.html",
                image: "assets/images/projects/cloud-modernization.webp",
                alt: "Cloud modernization concept"
            },
            {
                eyebrow: "Support",
                title: "A good process protects the <span class=\"text-gradient\">outcome</span>",
                description: "Clear agreements help the team stay aligned as the work evolves and the business context changes.",
                meta: ["Process", "Expectation setting", "Trust"],
                ctaLabel: "Contact APEX CIPHER",
                ctaHref: "contact.html",
                image: "assets/images/insights/ai-insights.webp",
                alt: "AI consulting strategy concept"
            }
        ],
        "not-found": [
            {
                eyebrow: "Page missing",
                title: "We could not find that <span class=\"text-gradient\">route</span>",
                description: "The page may have moved, but our team is still ready to help you find the right place to start.",
                meta: ["Navigation", "Recovery", "Support"],
                ctaLabel: "Go home",
                ctaHref: "index.html",
                image: "assets/images/hero/hero-wide.webp",
                alt: "Navigation recovery illustration"
            },
            {
                eyebrow: "Start again",
                title: "Return to a relevant <span class=\"text-gradient\">starting point</span>",
                description: "Use the site’s core paths to move from strategy through product and platform work with the right team behind it.",
                meta: ["Home", "Services", "Work"],
                ctaLabel: "Explore services",
                ctaHref: "services.html",
                image: "assets/images/projects/ai-platform.webp",
                alt: "AI platform architecture overview"
            },
            {
                eyebrow: "Need help",
                title: "Let’s get you to the right <span class=\"text-gradient\">conversation</span>",
                description: "If you are looking for a specific solution or team capability, a quick conversation can help connect the right path quickly.",
                meta: ["Consultation", "Discovery", "Support"],
                ctaLabel: "Contact us",
                ctaHref: "contact.html",
                image: "assets/images/projects/cloud-modernization.webp",
                alt: "Cloud modernization concept"
            }
        ]
    };

    /**
     * Runtime environment flags. isStatic is always true for this
     * project and exists so future integrations can branch safely
     * without guessing.
     */
    var environment = {
        isStatic: true,
        debug: false
    };

    var config = {
        brand: brand,
        paths: paths,
        navigation: navigation,
        animations: animations,
        interactions: interactions,
        forms: forms,
        filters: filters,
        accordion: accordion,
        heroSlider: heroSlider,
        pageHeroSlides: pageHeroSlides,
        environment: environment
    };

    Object.freeze(config.brand);
    Object.freeze(config.paths);
    Object.freeze(config.navigation);
    Object.freeze(config.animations.reveal);
    Object.freeze(config.animations);
    Object.freeze(config.interactions.tilt);
    Object.freeze(config.interactions.pointerLight);
    Object.freeze(config.interactions);
    Object.freeze(config.forms.messages);
    Object.freeze(config.forms);
    Object.freeze(config.filters);
    Object.freeze(config.accordion);
    Object.freeze(config.heroSlider);
    Object.freeze(config.heroSlider.slides);
    Object.freeze(config.pageHeroSlides);
    Object.freeze(config.environment);
    Object.freeze(config);

    window.APEX_CONFIG = config;

})(window);
