import { seedManifest } from "@/src/data/seedManifest";
import {
  MANIFEST_CACHE_PATH,
  readJsonFile,
  writeJsonFile,
} from "@/src/lib/storage";
import type { ManifestPayload, ManifestSource, Paper } from "@/src/types/papers";

const MANIFEST_URL = process.env.EXPO_PUBLIC_MANIFEST_URL;

function isValidFormLevel(value: unknown): value is Paper["form"] {
  return value === 1 || value === 2 || value === 3 || value === 4 || value === 5;
}

function normalizePaper(value: unknown): Paper | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const item = value as Record<string, unknown>;
  if (
    typeof item.id !== "string" ||
    !isValidFormLevel(item.form) ||
    typeof item.subject !== "string" ||
    typeof item.year !== "number" ||
    typeof item.title !== "string" ||
    typeof item.pdfUrl !== "string" ||
    typeof item.updatedAt !== "string"
  ) {
    return null;
  }

  return {
    id: item.id,
    form: item.form,
    subject: item.subject,
    year: item.year,
    title: item.title,
    pdfUrl: item.pdfUrl,
    sizeBytes: typeof item.sizeBytes === "number" ? item.sizeBytes : undefined,
    updatedAt: item.updatedAt,
  };
}

function normalizeManifest(value: unknown): ManifestPayload | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const payload = value as Record<string, unknown>;
  if (!Array.isArray(payload.papers) || typeof payload.updatedAt !== "string") {
    return null;
  }

  const papers = payload.papers
    .map((paper) => normalizePaper(paper))
    .filter((paper): paper is Paper => paper !== null);

  if (!papers.length) {
    return null;
  }

  return {
    updatedAt: payload.updatedAt,
    papers,
  };
}

async function fetchRemoteManifest(): Promise<ManifestPayload | null> {
  if (!MANIFEST_URL) {
    return null;
  }

  const response = await fetch(MANIFEST_URL);
  if (!response.ok) {
    return null;
  }

  const json = (await response.json()) as unknown;
  return normalizeManifest(json);
}

export async function syncManifest(): Promise<{
  manifest: ManifestPayload;
  source: ManifestSource;
}> {
  try {
    const remoteManifest = await fetchRemoteManifest();
    if (remoteManifest) {
      await writeJsonFile(MANIFEST_CACHE_PATH, remoteManifest);
      return { manifest: remoteManifest, source: "remote" };
    }
  } catch {
    // Fallback to cache/seed when network fails.
  }

  const cachedManifest = await readJsonFile<ManifestPayload>(MANIFEST_CACHE_PATH);
  const validCachedManifest = normalizeManifest(cachedManifest);
  if (validCachedManifest) {
    return { manifest: validCachedManifest, source: "cache" };
  }

  return { manifest: seedManifest, source: "seed" };
}

export function listSubjectsByForm(papers: Paper[], form: Paper["form"]): string[] {
  const subjects = papers
    .filter((paper) => paper.form === form)
    .map((paper) => paper.subject);

  return [...new Set(subjects)].sort((a, b) => a.localeCompare(b));
}

export function listYearsByFormSubject(
  papers: Paper[],
  form: Paper["form"],
  subject: string,
): number[] {
  const years = papers
    .filter((paper) => paper.form === form && paper.subject === subject)
    .map((paper) => paper.year);

  return [...new Set(years)].sort((a, b) => b - a);
}

export function listPapersByFormSubjectYear(
  papers: Paper[],
  form: Paper["form"],
  subject: string,
  year: number,
): Paper[] {
  return papers
    .filter(
      (paper) => paper.form === form && paper.subject === subject && paper.year === year,
    )
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function searchPapersBySubject(papers: Paper[], term: string): Paper[] {
  const normalized = term.trim().toLowerCase();
  if (!normalized) {
    return [];
  }

  return papers
    .filter((paper) => paper.subject.toLowerCase().includes(normalized))
    .sort((a, b) => {
      if (a.subject !== b.subject) {
        return a.subject.localeCompare(b.subject);
      }

      if (a.form !== b.form) {
        return a.form - b.form;
      }

      return b.year - a.year;
    });
}
