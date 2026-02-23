import Link from "next/link";

export default function SignInPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-5 py-12 md:px-8">
      <section className="rounded-3xl border border-[var(--line)] bg-white p-6 shadow-sm md:p-10">
        <p className="mb-3 text-xs font-bold tracking-[0.22em] text-[var(--brand-ink)]">CLERK SIGN-IN</p>
        <h1 className="text-3xl font-semibold" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
          Connect Clerk sign-in here
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          Add Clerk UI for this route (for example, the Clerk SignIn component or your custom
          form). Once authenticated,
          Clerk will set session cookies and `/admin` becomes accessible.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/admin"
            className="rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-ink)]"
          >
            Retry Admin
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-[var(--line)] bg-white px-5 py-3 text-sm font-semibold"
          >
            Back Home
          </Link>
        </div>
      </section>
    </main>
  );
}
