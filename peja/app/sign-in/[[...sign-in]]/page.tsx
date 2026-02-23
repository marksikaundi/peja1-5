import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-5 py-12 md:px-10">
      <section className="grid w-full gap-8 md:grid-cols-[1.15fr_1fr]">
        <article className="rounded-3xl border border-[var(--line)] bg-white/85 p-6 shadow-sm backdrop-blur md:p-10">
          <p className="mb-3 text-xs font-bold tracking-[0.22em] text-[var(--brand-ink)]">WELCOME BACK</p>
          <h1
            className="text-3xl leading-tight font-semibold md:text-5xl"
            style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
          >
            Secure access to upload books, papers, and materials.
          </h1>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            Admin actions are protected through Clerk authentication. After sign-in you can open
            `/admin` and manage data used by `peja1-5`.
          </p>
        </article>

        <div className="flex items-center justify-center">
          <SignIn
            path="/sign-in"
            routing="path"
            signUpUrl="/sign-up"
            fallbackRedirectUrl="/admin"
          />
        </div>
      </section>
    </main>
  );
}
