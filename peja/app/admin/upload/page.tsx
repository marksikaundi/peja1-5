"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const CATEGORY_OPTIONS = [
  "Past Paper",
  "Revision Notes",
  "Textbook",
  "Worksheet",
  "Scheme of Work",
  "Mock Exam",
] as const;

const FORM_OPTIONS = [1, 2, 3, 4, 5] as const;

interface ApiSuccess {
  message: string;
  material: {
    id: string;
    title: string;
    category: string;
    form: number;
    year: number;
    subject: string | null;
    fileKey: string | null;
    createdAt: string;
  };
  nextStep: string;
}

interface ApiError {
  error: string;
  message: string;
}

export default function UploadLearningMaterialPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>(CATEGORY_OPTIONS[0]);
  const [form, setForm] = useState<string>("1");
  const [year, setYear] = useState<string>(String(new Date().getFullYear()));
  const [subject, setSubject] = useState("");
  const [fileKey, setFileKey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<ApiSuccess | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return Boolean(category.trim() && form.trim() && year.trim());
  }, [category, form, year]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) {
      setErrorMessage("Category, Form, and Year are required.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessData(null);

    try {
      const response = await fetch("/api/admin/materials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          category,
          form: Number(form),
          year: Number(year),
          subject,
          fileKey,
        }),
      });

      const payload = (await response.json()) as ApiSuccess | ApiError;
      if (!response.ok) {
        setErrorMessage(payload.message ?? "Request failed.");
        return;
      }

      setSuccessData(payload as ApiSuccess);
      setTitle("");
      setCategory(CATEGORY_OPTIONS[0]);
      setForm("1");
      setYear(String(new Date().getFullYear()));
      setSubject("");
      setFileKey("");
    } catch {
      setErrorMessage("Unable to submit material right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 py-8 md:px-10 md:py-12">
      <header className="mb-8 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold tracking-[0.22em] text-[var(--brand-ink)]">LEARNING MATERIALS</p>
          <h1
            className="mt-2 text-3xl font-semibold md:text-4xl"
            style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
          >
            Upload Learning Material Metadata
          </h1>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Required fields: category, form, year. This endpoint validates input for admin workflows.
          </p>
        </div>

        <Link
          href="/admin"
          className="rounded-xl border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold hover:border-[var(--brand)]"
        >
          Back to Admin
        </Link>
      </header>

      <section className="rise-in rounded-3xl border border-[var(--line)] bg-white p-6 shadow-sm md:p-8">
        <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
          <label className="flex flex-col gap-2 text-sm font-semibold">
            Material Title (optional)
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Form 3 Biology Revision Pack"
              className="rounded-xl border border-[var(--line)] bg-[#fbfdfd] px-3 py-2 text-sm font-medium outline-none ring-[var(--brand)]/35 focus:ring"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-semibold">
            Category *
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="rounded-xl border border-[var(--line)] bg-[#fbfdfd] px-3 py-2 text-sm font-medium outline-none ring-[var(--brand)]/35 focus:ring"
              required
            >
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm font-semibold">
            Form *
            <select
              value={form}
              onChange={(event) => setForm(event.target.value)}
              className="rounded-xl border border-[var(--line)] bg-[#fbfdfd] px-3 py-2 text-sm font-medium outline-none ring-[var(--brand)]/35 focus:ring"
              required
            >
              {FORM_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  Form {option}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm font-semibold">
            Year *
            <input
              type="number"
              value={year}
              onChange={(event) => setYear(event.target.value)}
              min={1990}
              max={new Date().getFullYear() + 1}
              className="rounded-xl border border-[var(--line)] bg-[#fbfdfd] px-3 py-2 text-sm font-medium outline-none ring-[var(--brand)]/35 focus:ring"
              required
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-semibold">
            Subject (optional)
            <input
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="e.g. Mathematics"
              className="rounded-xl border border-[var(--line)] bg-[#fbfdfd] px-3 py-2 text-sm font-medium outline-none ring-[var(--brand)]/35 focus:ring"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-semibold">
            UploadThing File Key (optional)
            <input
              value={fileKey}
              onChange={(event) => setFileKey(event.target.value)}
              placeholder="Copy from UploadThing"
              className="rounded-xl border border-[var(--line)] bg-[#fbfdfd] px-3 py-2 text-sm font-medium outline-none ring-[var(--brand)]/35 focus:ring"
            />
          </label>

          <div className="md:col-span-2 mt-2 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[var(--brand-ink)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Material"}
            </button>

            <a
              href="https://uploadthing.com/dashboard"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-[var(--line)] bg-white px-5 py-3 text-sm font-semibold hover:border-[var(--brand)]"
            >
              Open UploadThing
            </a>
          </div>
        </form>
      </section>

      {errorMessage ? (
        <section className="mt-4 rounded-2xl border border-[#f1c3c3] bg-[#fff5f5] p-4 text-sm text-[#8d2525]">
          {errorMessage}
        </section>
      ) : null}

      {successData ? (
        <section className="rise-in mt-4 rounded-2xl border border-[#b8e4d4] bg-[#ecfbf4] p-5">
          <h2 className="text-lg font-semibold text-[#0c4f44]">Material accepted</h2>
          <p className="mt-2 text-sm text-[#275f58]">{successData.nextStep}</p>
          <code className="mt-3 block rounded-lg bg-white px-3 py-2 text-xs leading-6 text-[#1f3a37]">
            {JSON.stringify(successData.material, null, 2)}
          </code>
        </section>
      ) : null}
    </main>
  );
}
