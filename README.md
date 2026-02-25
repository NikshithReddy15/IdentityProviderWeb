# ChatApplication

ChatApplication is a small Angular 21 web client that implements a tiled login experience (email / phone), a notification system, and zoneless change-detection using Angular Signals.

This README covers how to run the app locally, development conveniences, and where to find the important parts of the codebase.

Quick links
- Project root: `src/`
- Login UI: `src/app/login/sign-in/`
- Sign-up: `src/app/login/sign-up/`
- Notifications: `src/app/shared/services/notification/` and `src/app/shared/components/notification/`
- Global styles: `src/styles.scss`

Prerequisites
- Node >= 18 and npm (this project uses npm as the package manager)
- Angular CLI (dev dependency) for local commands if you prefer `ng` directly

Install
```bash
npm install
```

Development server
- Start with the provided script (the project runs with a local HTTPS dev server by default):
```bash
npm start
# -> runs: ng serve --proxy-config proxy.conf.js --ssl true
```
- Open: https://localhost:4200/
- The dev server watches files and rebuilds automatically.

Available scripts
- `npm start` — run dev server (with proxy and HTTPS as configured)
- `npm run build` — produce production build in `dist/`
- `npm run watch` — continuous build in development mode
- `npm test` — run unit tests (Vitest)
- `npm run serve:ssr:ChatApplication` — run SSR server from `dist/ChatApplication` (after building)

Architecture notes
- Angular 21 signals & zoneless CD: this app uses `provideZonelessChangeDetection()` (see `src/app/app.config.ts`) and migrates component state to Signals where appropriate (e.g. loading/submitted in the sign-in flow). Signals remove reliance on zone.js for change detection and provide a predictable reactive model.
- Notification system: `NotificationService` exposes a readonly signal that the `NotificationComponent` reads directly in the template. See `src/app/shared/services/notification/notification.service.ts`.
- Login flows: sign-in is split into email and phone forms in `src/app/login/sign-in/`. DTOs and services live in `src/app/login/`.
- Styling: all SCSS has been consolidated into `src/styles.scss` which also overrides Bootstrap variables for theming.

Development tips & debugging
- If UI updates appear delayed, confirm you are running the zoneless flow (we use signals). If you manually changed HTTP behavior to use native fetch (via `provideHttpClient(withFetch())`), that's compatible with zoneless mode.
- For temporary diagnostics we log to a session debug file in the workspace during active debugging sessions: `.cursor/debug-<id>.log`. These entries are added only while instrumentation is present and removed when debugging is finished.

Proxy & API
- The dev server uses `proxy.conf.js` to proxy API requests in development. Update that file if your backend runs on another host/port.

Testing
- Unit tests: `npm test` (Vitest)
- E2E: configure and run your chosen runner (Playwright, Cypress, etc.)

Contributing
- Follow the project's Prettier settings (tabWidth 4). Run the app and tests locally, open a pull request with focused changes, and include a short test plan in the PR body.

Notes
- This README is intentionally minimal — for design/token details, architecture diagrams, or API contracts, check the `docs/` folder if present or ask the team for API specs.

License
- MIT (or your preferred license)
