# Chat Application

An Angular 21 Identity Provider web client featuring authentication flows, dark/light theming, and zoneless change detection with Angular Signals.

## Features

- **Email & Phone Login** — Tab-based sign-in with email/password or phone/OTP
- **User Registration** — Full sign-up form with validation
- **Dark/Light Theme** — System preference detection with manual toggle
- **Toast Notifications** — Signal-based notification system
- **Server-Side Rendering** — Full SSR support with Express

## Quick Links

| Path | Description |
|------|-------------|
| `src/app/login/sign-in/` | Sign-in component (email/phone tabs) |
| `src/app/login/sign-up/` | Registration form |
| `src/app/shared/components/notification/` | Toast notification component |
| `src/app/shared/components/country-code-picker/` | Phone country code selector |
| `src/styles.scss` | Global styles and theme variables |

## Prerequisites

- Node.js >= 18
- npm

## Getting Started

```bash
# Install dependencies
npm install

# Start development server (HTTPS)
npm start
```

Open https://localhost:4200/

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Dev server with proxy and HTTPS |
| `npm run build` | Production build |
| `npm run watch` | Continuous dev build |
| `npm test` | Run unit tests (Vitest) |
| `npm run serve:ssr:ChatApplication` | Run SSR server |

## Architecture

### Zoneless Change Detection

Uses `provideZonelessChangeDetection()` with Angular Signals for reactive state management. No zone.js dependency.

```typescript
// app.config.ts
provideZonelessChangeDetection()
```

### Theming

CSS custom properties for light/dark mode:

```scss
:root, [data-bs-theme="light"] {
    --bg-primary: #ffffff;
    --surface: #ffffff;
    --text-primary: #1d1d1f;
    --accent: #0071e3;
}

[data-bs-theme="dark"] {
    --bg-primary: #0d0d0f;
    --surface: #1c1c1e;
    --text-primary: #f5f5f7;
    --accent: #0a84ff;
}
```

Theme toggle persists to localStorage and respects system preference.

### Services

| Service | Purpose |
|---------|---------|
| `ApiService` | HTTP client wrapper (base: `/k/identity`) |
| `LoginService` | Email login authentication |
| `RegistrationService` | User registration |
| `NotificationService` | Toast notification management |

## API Proxy

Development server proxies `/k/identity/` to `https://localhost:7285` (configured in `proxy.conf.js`).

## Testing

```bash
# Unit tests
npm test

# E2E (configure your preferred runner)
```

## Code Style

- Prettier with 4-space tabs
- Standalone components only
- Signal-based state management

## License

MIT
