# Aura — wellness and focus companion

A React/TypeScript interface for mood entries, habits, journaling, goals, focus sessions and saved affirmations. An Express server provides optional Gemini affirmation generation, with explicitly labelled curated reflections when no key is configured or generation fails.

## Run locally

Requires Node.js 24 and npm. From the repository root:

```sh
cd aura
npm ci
npm run dev
```

Open http://localhost:3000. The server uses Vite middleware during development. Copy `.env.example` to `.env` inside `aura` to configure `PORT`, optional `GEMINI_API_KEY` and `GEMINI_MODEL`. Keep the key server-side. No key is needed for curated mode. The model default is inherited from the original project; provider availability and permissions must be checked against your account before enabling it.

## Build and check

```sh
npm run lint
npm test
npm run build
npm start
```

`npm start` serves the production `dist` build and API on one port. `GET /api/health` reports the configured affirmation mode. Tests run actual HTTP requests against a temporary local listener, covering curated content, provenance and request validation without contacting Gemini.

`POST /api/affirmation` accepts optional string fields `mood`, `category` and `customFocus` (up to 1,000 characters for focus). Responses include `text`, `subtitle`, `accentColor`, three `wellnessPoints`, `ritual` and `source` (`gemini` or `curated`). Generated JSON is validated before being returned. Invalid requests return 400; provider errors fall back to curated content with the correct source label.

## Data and limits

Personal entries are stored in browser local storage, with no accounts, server database or cross-device synchronization. Do not rely on local storage as a backup. Some initial UI content is example data. The app is a wellness/productivity prototype, not an evaluated health intervention. Live Gemini generation requires external credentials and is separate from the verified offline tests.

The earlier README referenced a Cloud Run deployment; it is not presented as a verified live demo here. Deployment configuration and its current availability require separate verification. No completed authentication, mood prediction or personalized coaching capability is claimed.
