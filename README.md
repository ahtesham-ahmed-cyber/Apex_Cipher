# APEX CIPHER

APEX CIPHER is a static, multi-page technology website for a professional consulting and engineering brand. The project is designed for direct deployment on Netlify without a build step.

## Project overview

- Brand: APEX CIPHER
- Tagline: A technology team by The Secure Script
- Stack: HTML5, CSS3, vanilla JavaScript
- Hosting: Netlify static hosting
- Backend: not required for the current site

## Included pages

- index.html
- about.html
- services.html
- ai-consulting.html
- software-development.html
- ai-solutions.html
- industries.html
- work.html
- case-study-ai-platform.html
- case-study-cloud-modernization.html
- insights.html
- article-enterprise-ai.html
- contact.html
- faq.html
- privacy-policy.html
- terms.html
- 404.html

## Local preview

From the project root, run:

```bash
python3 -m http.server 8000
```

Then open:

- http://localhost:8000

## Netlify deployment

This repository is compatible with direct deployment on Netlify.

1. Push the project to your Git provider.
2. Import the repository into Netlify.
3. Keep the publish directory as the project root.
4. Do not configure a build command.

The provided Netlify redirect configuration routes unmatched paths to the custom 404 page.

## Notes

- The contact form is intentionally frontend-only and clearly documented as a demonstration.
- No external JavaScript libraries or runtime dependencies are required.
- The site uses local SVG and image assets and does not rely on a backend service.

## Hero layouts

- Interior pages use `.page-hero` with a two-column grid: breadcrumb on its own top row, then text (left) and image (right). Add the `page-hero--reverse` class to the section to flip it (image left, text right).
- The image frame is a fixed 16:10 box; `.page-hero-image` uses `object-fit: cover` and `object-position: center`.
- Below 960px both the home hero and interior heroes stack: breadcrumb, text, then image.
- `hero-orb.webp` and `hero-wide.webp` were re-cropped so the sphere is centred and has no black edges.


## Local preview

For a reliable preview, serve this folder over HTTP (rather than opening HTML directly as `file://`). From the project folder run `python3 -m http.server 8000`, then visit `http://localhost:8000`. See `QA_REPORT.md` for checks that remain.
