# Chapel of Praise Admin

Admin dashboard for Chapel of Praise, built with Nuxt 4 (Vue 3, Pinia, Tailwind CSS 4). This app is a client-side rendered SPA (`ssr: false`) that talks to the Express backend in `../backend` and uses the Firebase **client** SDK for authentication (the backend uses the Firebase Admin SDK).

## Requirements

- Node.js 20+
- npm
- A running instance of the backend API (default: `http://localhost:5000/api`)

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create your environment file from the template and fill in the values:

   ```bash
   copy .env.example .env
   ```

   | Variable              | Description                                                                 |
   | --------------------- | --------------------------------------------------------------------------- |
   | `API_BASE_URL`        | Base URL of the Express backend API (dev: `http://localhost:5000/api`).    |
   | `FIREBASE_API_KEY`    | Firebase web app config (Project settings > Your apps).                     |
   | `FIREBASE_AUTH_DOMAIN`| Firebase web app config.                                                    |
   | `FIREBASE_PROJECT_ID` | Firebase web app config.                                                    |

   These are exposed through `runtimeConfig.public` in `nuxt.config.ts`.

## Development

Start the dev server (also enables the PWA and devtools locally):

```bash
npm run dev
```

The app runs at `http://localhost:3000` and redirects `/` to `/dashboard`. Unauthenticated users are sent to `/auth/login` by the global middleware in `middleware/auth.global.js`. The auth token is stored in the `admin_token` cookie and attached to API requests by `plugins/api-interceptor.js`.

## Scripts

| Command           | Description                                  |
| ----------------- | -------------------------------------------- |
| `npm run dev`     | Start the development server.                |
| `npm run build`   | Production build (output in `.output`).      |
| `npm run preview` | Preview the production build locally.        |
| `npm run generate`| Static site generation.                      |
| `npm run lint`    | Lint with ESLint (`@nuxt/eslint` config).    |
| `npm run test`    | Run unit tests with Vitest.                  |

## Production

```bash
npm run build
node .output/server/index.mjs
```

The build also generates the PWA service worker (`sw.js`) and `manifest.webmanifest` from the `pwa` config in `nuxt.config.ts`; source icons live in `public/`. `public/robots.txt` disallows indexing since this is an internal admin tool.

When deploying, set `API_BASE_URL` and the `FIREBASE_*` variables in your hosting environment before building.
