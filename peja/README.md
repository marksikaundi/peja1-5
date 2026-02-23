# Peja Backend (Next.js + Vercel)

Backend + admin for Zambia Past Papers mobile app.

## Endpoints

- Public mobile manifest: `GET /api/mobile/manifest`
- Backward-compatible alias: `GET /api/papers-manifest`
- Admin manifest preview (login required): `GET /api/admin/manifest`

## Admin Authentication (Clerk-ready)

- Admin UI: `/admin`
- Sign-in placeholder route: `/sign-in`
- Middleware protects `/admin/*` and `/api/admin/*`
- Current gate checks for Clerk session cookies (`__session`, `__clerk_db_jwt`, `__client_uat`)

When you add Clerk components, render your real Clerk sign-in UI at `/sign-in`.

## UploadThing Storage Model

1. Files are uploaded/stored in UploadThing.
2. In `data/papers.ts`, set either:
- `fileKey` (recommended)
- `pdfUrl` (full URL)
3. If using `fileKey`, backend builds URL with:
- `https://<UPLOADTHING_APP_ID>.ufs.sh/f/<fileKey>`

## Environment Variables

Create `.env.local` in `peja/`:

```bash
UPLOADTHING_APP_ID=YOUR_UPLOADTHING_APP_ID
```

## Run Locally

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Use `peja/` as Vercel project root.
2. Set env var `UPLOADTHING_APP_ID` in Vercel.
3. Deploy.

## Connect Mobile App (`peja1-5`)

Set this in the Expo app `.env.local`:

```bash
EXPO_PUBLIC_MANIFEST_URL=https://<your-vercel-domain>/api/mobile/manifest
```

## Data Source File

- `data/papers.ts`
