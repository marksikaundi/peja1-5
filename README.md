# Zambia Past Papers App (Expo)

Offline-first mobile app for Zambian past papers (Form 1 to Form 5), built with Expo Router.

## MVP Scope

- Select Form (1-5)
- Select Subject
- Select Year
- View/Download PDF
- Save papers offline
- Search by subject
- No login/auth

## Current Architecture

- Frontend: Expo + React Native + TypeScript + Expo Router
- Metadata sync: JSON manifest fetched from `EXPO_PUBLIC_MANIFEST_URL`
- Offline metadata cache: local JSON in app document storage
- Offline PDF storage: `expo-file-system` download to local app directory
- Fallback model: `remote -> cache -> seed`

## UploadThing Integration Model

UploadThing stores the PDF files. The app reads a separate manifest endpoint that references UploadThing file URLs.

- `pdfUrl` in each paper should be a direct UploadThing file URL
- Manifest endpoint should return JSON payload (see schema below)

## Manifest Schema

```json
{
  "updatedAt": "2026-02-23T00:00:00.000Z",
  "papers": [
    {
      "id": "f4-math-2025-mock-1",
      "form": 4,
      "subject": "Mathematics",
      "year": 2025,
      "title": "Form 4 Mathematics Mock 1",
      "pdfUrl": "https://uploadthing-prod-files.../math-f4-2025.pdf",
      "sizeBytes": 245112,
      "updatedAt": "2026-02-23T00:00:00.000Z"
    }
  ]
}
```

The app also accepts wrapped responses:

- `{ "manifest": { ...schemaAbove } }`
- `{ "data": { ...schemaAbove } }`

## Environment Setup

1. Copy the example env file.
2. Set your live manifest URL.

```bash
cp .env.example .env.local
```

`.env.local`:

```bash
EXPO_PUBLIC_MANIFEST_URL=https://your-domain.com/api/papers-manifest
```

## Run Locally

```bash
npm install
npm start
```

## Important Notes

- Manifest request timeout is 8 seconds.
- If network fails or payload is invalid, app uses cached manifest.
- If no cache exists, app uses bundled seed data.
- Subject search runs on local cached data.

## Key Paths

- Manifest sync logic: `src/lib/manifest.ts`
- Offline PDF logic: `src/lib/downloads.ts`
- App state provider: `src/context/PapersContext.tsx`
- Screens: `app/`
