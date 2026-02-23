export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-8 md:px-10 md:py-12">
      <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div className="rounded-full border border-[var(--line)] bg-white/80 px-4 py-2 text-sm font-semibold text-[var(--brand-ink)] shadow-sm">
          PEJA ADMIN
        </div>
        <nav className="flex items-center gap-3 text-sm font-medium text-[var(--muted)]">
          <a className="rounded-full border border-[var(--line)] bg-white px-4 py-2 hover:border-[var(--brand)]" href="/api/mobile/manifest">
            Mobile Manifest
          </a>
          <a className="rounded-full bg-[var(--brand)] px-4 py-2 text-white hover:bg-[var(--brand-ink)]" href="/admin">
            Admin Login
          </a>
        </nav>
      </header>

      <section className="relative overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-sm md:p-10">
        <div className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full bg-[var(--accent)]/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 left-10 h-48 w-48 rounded-full bg-[var(--brand)]/15 blur-3xl" />

        <div className="relative grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-end">
          <div>
            <p className="mb-3 text-xs font-bold tracking-[0.22em] text-[var(--brand-ink)]">
              ZAMBIA PAST PAPERS BACKEND
            </p>
            <h1
              className="text-3xl leading-tight font-semibold md:text-5xl"
              style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
            >
              Beautiful admin plus secure publishing flow for books and learning materials.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">
              Upload files to UploadThing, manage metadata from the admin area after login, and
              serve your mobile app through one stable endpoint.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                className="rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[var(--brand-ink)]"
                href="/admin"
              >
                Open Admin
              </a>
              <a
                className="rounded-xl border border-[var(--line)] bg-white px-5 py-3 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--brand)]"
                href="/api/mobile/manifest"
              >
                View Manifest JSON
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--line)] bg-[#fbfdfd] p-5">
            <p className="mb-2 text-sm font-semibold text-[var(--brand-ink)]">Use in `peja1-5` app</p>
            <code className="block rounded-lg bg-[#f0f4f8] px-3 py-2 text-xs leading-6 text-[#23303d]">
              EXPO_PUBLIC_MANIFEST_URL=https://your-domain.vercel.app/api/mobile/manifest
            </code>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold">Login-Gated Admin</h2>
          <p className="text-sm leading-6 text-[var(--muted)]">
            `/admin` requires a Clerk session cookie. Only signed-in users can access admin APIs.
          </p>
        </article>
        <article className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold">UploadThing Storage</h2>
          <p className="text-sm leading-6 text-[var(--muted)]">
            Keep files in UploadThing and map each `fileKey` to a public file URL automatically.
          </p>
        </article>
        <article className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold">Mobile Endpoint</h2>
          <p className="text-sm leading-6 text-[var(--muted)]">
            The app reads one endpoint only: <code>/api/mobile/manifest</code>.
          </p>
        </article>
      </section>

      <footer className="mt-10 border-t border-[var(--line)] pt-5 text-xs text-[var(--muted)]">
        Peja Backend • Vercel-ready • Offline-first mobile integration
      </footer>
    </main>
  );
}
