import Link from "next/link";
import { cookies } from "next/headers";

import { PAPER_ROWS } from "@/data/papers";
import { hasClerkSessionFromCookieLookup } from "@/src/auth";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const isLoggedIn = hasClerkSessionFromCookieLookup(
    (name) => cookieStore.get(name)?.value,
  );

  if (!isLoggedIn) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-5 py-12 md:px-8">
        <section className="rounded-3xl border border-[var(--line)] bg-white p-6 shadow-sm md:p-10">
          <p className="mb-3 text-xs font-bold tracking-[0.22em] text-[var(--brand-ink)]">ADMIN ACCESS</p>
          <h1 className="text-3xl font-semibold" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
            Login required to manage uploads and materials
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            This route expects an active Clerk session cookie. Sign in first, then return to
            `/admin`.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/sign-in"
              className="rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-ink)]"
            >
              Go to Sign In
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

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-8 md:px-10 md:py-12">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold tracking-[0.22em] text-[var(--brand-ink)]">PEJA ADMIN</p>
          <h1 className="text-3xl font-semibold" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
            Manage books and materials
          </h1>
        </div>
        <Link
          href="/api/admin/manifest"
          className="rounded-xl border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold hover:border-[var(--brand)]"
        >
          Check Admin API
        </Link>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Upload Workflow</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-[var(--muted)]">
            <li>Upload PDF to UploadThing.</li>
            <li>Copy `fileKey` from UploadThing dashboard.</li>
            <li>Add or update the entry in `data/papers.ts`.</li>
            <li>Re-deploy to publish the new manifest.</li>
          </ol>
        </article>

        <article className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Mobile Connection</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Set this in `peja1-5`:</p>
          <code className="mt-2 block rounded-lg bg-[#f0f4f8] px-3 py-2 text-xs leading-6 text-[#23303d]">
            EXPO_PUBLIC_MANIFEST_URL=https://your-domain.vercel.app/api/mobile/manifest
          </code>
        </article>
      </section>

      <section className="mt-6 rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">Current Paper Records</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead>
              <tr className="bg-[#f7fafc] text-left text-xs uppercase tracking-wide text-[#607080]">
                <th className="border border-[var(--line)] px-3 py-2">ID</th>
                <th className="border border-[var(--line)] px-3 py-2">Form</th>
                <th className="border border-[var(--line)] px-3 py-2">Subject</th>
                <th className="border border-[var(--line)] px-3 py-2">Year</th>
                <th className="border border-[var(--line)] px-3 py-2">File Key</th>
              </tr>
            </thead>
            <tbody>
              {PAPER_ROWS.map((paper) => (
                <tr key={paper.id}>
                  <td className="border border-[var(--line)] px-3 py-2">{paper.id}</td>
                  <td className="border border-[var(--line)] px-3 py-2">{paper.form}</td>
                  <td className="border border-[var(--line)] px-3 py-2">{paper.subject}</td>
                  <td className="border border-[var(--line)] px-3 py-2">{paper.year}</td>
                  <td className="border border-[var(--line)] px-3 py-2">{paper.fileKey ?? "--"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
