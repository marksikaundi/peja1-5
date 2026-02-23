import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-5 py-12 md:px-10">
      <section className="grid w-full gap-8 md:grid-cols-[1.15fr_1fr]">
        <article className="rounded-3xl border border-[var(--line)] bg-white/85 p-6 shadow-sm backdrop-blur md:p-10">
          <p className="mb-3 text-xs font-bold tracking-[0.22em] text-[var(--brand-ink)]">CREATE ACCESS</p>
          <h1
            className="text-3xl leading-tight font-semibold md:text-5xl"
            style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
          >
            Set up your admin account to manage UploadThing-backed content.
          </h1>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            Once registered and signed in, use `/admin` to prepare the manifest endpoint consumed
            by your mobile app.
          </p>
        </article>

        <div className="flex items-center justify-center">
          <SignUp
            path="/sign-up"
            routing="path"
            signInUrl="/sign-in"
            fallbackRedirectUrl="/admin"
          />
        </div>
      </section>
    </main>
  );
}
