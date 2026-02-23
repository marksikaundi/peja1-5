# Peja Backend (Next.js + Vercel)

Backend + admin for Zambia Past Papers mobile app (`peja1-5`).

## Endpoints

- Public mobile manifest: `GET /api/mobile/manifest`
- Alias (same payload): `GET /api/papers-manifest`
- Admin manifest preview (auth required): `GET /api/admin/manifest`

## Clerk Authentication (Implemented)

- Provider is mounted in `app/layout.tsx` via `ClerkProvider`
- Middleware uses `clerkMiddleware` to protect:
- `/admin/*`
- `/api/admin/*`
- Sign-in route: `/sign-in`
- Sign-up route: `/sign-up`

## UploadThing Storage Model

1. Files are uploaded/stored in UploadThing.
2. In `data/papers.ts`, set either:
- `fileKey` (recommended)
- `pdfUrl` (full URL)
3. If using `fileKey`, backend builds URL with:
- `https://<UPLOADTHING_APP_ID>.ufs.sh/f/<fileKey>`

## Environment Variables (`peja/.env.local`)

```bash
UPLOADTHING_APP_ID=YOUR_UPLOADTHING_APP_ID
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_or_test_xxx
CLERK_SECRET_KEY=sk_live_or_test_xxx
```

## Local Run

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Use `peja/` as Vercel project root.
2. Set env vars in Vercel:
- `UPLOADTHING_APP_ID`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
3. Deploy.

## Connect Mobile App (`peja1-5`)

Set this in Expo app `.env.local`:

```bash
EXPO_PUBLIC_MANIFEST_URL=https://<your-vercel-domain>/api/mobile/manifest
```

## Data Source File

- `data/papers.ts`
