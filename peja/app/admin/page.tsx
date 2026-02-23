import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { PAPER_ROWS } from "@/data/papers";

function countDistinct<T>(items: T[]): number {
  return new Set(items).size;
}

export default async function AdminPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in?redirect_url=/admin");
  }

  const totalPapers = PAPER_ROWS.length;
  const totalSubjects = countDistinct(PAPER_ROWS.map((paper) => paper.subject));
  const totalYears = countDistinct(PAPER_ROWS.map((paper) => paper.year));
  const formsCovered = countDistinct(PAPER_ROWS.map((paper) => paper.form));

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-8 md:px-10 md:py-12">
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-[0.22em] text-[var(--brand-ink)]">PEJA ADMIN</p>
          <h1
            className="mt-2 text-3xl font-semibold md:text-4xl"
            style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
          >
            Manage books, materials, and past papers
          </h1>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Authenticated with Clerk. Publish changes through `data/papers.ts` and re-deploy.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/upload"
            className="rounded-xl bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-ink)]"
          >
            Upload Learning Material
          </Link>
          <Link
            href="/api/admin/manifest"
            className="rounded-xl border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold hover:border-[var(--brand)]"
          >
            Admin API Preview
          </Link>
          <div className="rounded-full border border-[var(--line)] bg-white p-1">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      <section className="rise-in grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold tracking-wide text-[var(--muted)]">PAPERS</p>
          <p className="mt-2 text-3xl font-semibold">{totalPapers}</p>
        </article>
        <article className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold tracking-wide text-[var(--muted)]">SUBJECTS</p>
          <p className="mt-2 text-3xl font-semibold">{totalSubjects}</p>
        </article>
        <article className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold tracking-wide text-[var(--muted)]">YEARS</p>
          <p className="mt-2 text-3xl font-semibold">{totalYears}</p>
        </article>
        <article className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold tracking-wide text-[var(--muted)]">FORMS COVERED</p>
          <p className="mt-2 text-3xl font-semibold">{formsCovered}</p>
        </article>
      </section>

      <section className="rise-in mt-6 grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-[var(--line)] bg-[#f2fbf8] p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Quick Upload</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Open the upload form and submit material metadata with required fields:
            category, form, and year.
          </p>
          <Link
            href="/admin/upload"
            className="mt-4 inline-flex rounded-xl bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-ink)]"
          >
            Go to Upload Form
          </Link>
        </article>

        <article className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Upload Workflow</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-[var(--muted)]">
            <li>Upload files (books/materials/papers) to UploadThing.</li>
            <li>Copy each UploadThing `fileKey`.</li>
            <li>Register metadata in `data/papers.ts`.</li>
            <li>Deploy to publish updated manifest data.</li>
          </ol>
        </article>

        <article className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Mobile App Endpoint</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            In `peja1-5`, set your manifest URL to:
          </p>
          <code className="mt-3 block rounded-lg bg-[#edf3f8] px-3 py-2 text-xs leading-6 text-[#23303d]">
            EXPO_PUBLIC_MANIFEST_URL=https://your-domain.vercel.app/api/mobile/manifest
          </code>
        </article>
      </section>

      <section className="rise-in mt-6 rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Current Records</h2>
          <Link href="/api/mobile/manifest" className="text-sm font-semibold text-[var(--brand-ink)] hover:underline">
            View public manifest
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse text-sm">
            <thead>
              <tr className="bg-[#f7fafc] text-left text-xs uppercase tracking-wide text-[#607080]">
                <th className="border border-[var(--line)] px-3 py-2">ID</th>
                <th className="border border-[var(--line)] px-3 py-2">Form</th>
                <th className="border border-[var(--line)] px-3 py-2">Subject</th>
                <th className="border border-[var(--line)] px-3 py-2">Year</th>
                <th className="border border-[var(--line)] px-3 py-2">Title</th>
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
                  <td className="border border-[var(--line)] px-3 py-2">{paper.title}</td>
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
