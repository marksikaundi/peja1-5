import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const featureCards = [
  {
    title: "Admin With Login",
    body: "Use Clerk-protected admin routes so only authenticated users can update content.",
  },
  {
    title: "UploadThing Storage",
    body: "Store PDFs in UploadThing and map file keys to public file URLs in one manifest.",
  },
  {
    title: "Mobile Endpoint",
    body: "`peja1-5` reads one stable URL: /api/mobile/manifest for low-data sync.",
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-8 md:px-10 md:py-12">
      <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div className="rounded-full border border-[var(--line)] bg-white/80 px-4 py-2 text-sm font-semibold text-[var(--brand-ink)] shadow-sm">
          PEJA BACKEND
        </div>

        <div className="flex items-center gap-2">
          <SignedOut>
            <Link
              href="/sign-in"
              className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold hover:border-[var(--brand)]"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-ink)]"
            >
              Create account
            </Link>
          </SignedOut>
          <SignedIn>
            <Link
              href="/admin"
              className="rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-ink)]"
            >
              Open admin
            </Link>
            <div className="rounded-full border border-[var(--line)] bg-white p-1">
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </div>
      </header>

      <section className="rise-in relative overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-sm md:p-10">
        <div className="pulse-soft pointer-events-none absolute -left-16 top-10 h-48 w-48 rounded-full bg-[var(--brand)]/15 blur-3xl" />
        <div className="pulse-soft pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[var(--accent)]/25 blur-2xl" />

        <div className="relative grid gap-10 md:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="mb-3 text-xs font-bold tracking-[0.22em] text-[var(--brand-ink)]">
              ZAMBIA PAST PAPERS STACK
            </p>
            <h1
              className="text-3xl leading-tight font-semibold md:text-5xl"
              style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
            >
              Beautiful admin experience with secure Clerk auth and a clean mobile manifest API.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted)]">
              Publish papers, books, and materials from one place. Keep UploadThing as storage,
              and expose only safe read endpoints to the mobile app.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/admin"
                className="rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[var(--brand-ink)]"
              >
                Enter Admin
              </Link>
              <Link
                href="/api/mobile/manifest"
                className="rounded-xl border border-[var(--line)] bg-white px-5 py-3 text-sm font-semibold hover:border-[var(--brand)]"
              >
                Open Mobile Manifest
              </Link>
            </div>
          </div>

          <aside className="rounded-2xl border border-[var(--line)] bg-[#f8fbfd] p-5">
            <p className="text-sm font-semibold text-[var(--brand-ink)]">Expo config (`peja1-5`)</p>
            <code className="mt-3 block rounded-lg bg-[#eef3f8] px-3 py-2 text-xs leading-6 text-[#23303d]">
              EXPO_PUBLIC_MANIFEST_URL=https://your-domain.vercel.app/api/mobile/manifest
            </code>
            <p className="mt-4 text-xs leading-6 text-[var(--muted)]">
              This endpoint is public and optimized for read-only mobile consumption.
            </p>
          </aside>
        </div>
      </section>

      <section className="rise-in mt-8 grid gap-4 md:grid-cols-3">
        {featureCards.map((item) => (
          <article key={item.title} className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm">
            <h2 className="mb-2 text-lg font-semibold">{item.title}</h2>
            <p className="text-sm leading-6 text-[var(--muted)]">{item.body}</p>
          </article>
        ))}
      </section>

      <footer className="mt-10 border-t border-[var(--line)] pt-5 text-xs text-[var(--muted)]">
        Peja Backend • Clerk Auth • UploadThing Storage • Vercel Ready
      </footer>
    </main>
  );
}
