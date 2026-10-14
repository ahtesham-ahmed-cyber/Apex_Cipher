# Backend integration notes

This project is intentionally built as a static frontend and does not require a backend to function. The contact form, API client, and other client-side modules are designed to remain fully static and safe for direct deployment on Netlify.

## Current state

- No API requests are made from the frontend.
- No credentials, secrets, or endpoint values are embedded.
- Forms validate locally in the browser and clearly communicate that they are demonstrations.
- The site can be deployed without build tooling or server runtime configuration.

## Integration seam

The JavaScript API client exists as a documented placeholder for future work. It does not perform network requests in the current project. If a backend is added later, the expected contract is:

- `window.APEX_API.get(path)` returns a Promise-like result object.
- `window.APEX_API.post(path, payload)` returns a Promise-like result object.
- `window.APEX_API.configureEndpoint(url)` can set a future base URL.
- `window.APEX_API.getStatus()` reports whether the client is enabled and whether a backend endpoint is configured.

The static implementation is deliberately honest: it returns a result object and highlights that no network request was attempted.

## Recommended future approach

When a real backend is eventually introduced:

1. Add a secure, authenticated server endpoint.
2. Move form submission handling behind the server.
3. Validate input again on the server.
4. Store or relay messages only when the business process explicitly requires it.
5. Replace the demonstration messaging with real success, error, and rate-limit states.

This keeps the current site safe, static, and deployable while leaving a clean path for future integration.
