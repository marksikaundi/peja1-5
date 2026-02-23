import { PAPER_ROWS, PAPERS_UPDATED_AT, type PaperRow } from "@/data/papers";

interface ManifestPaper {
  id: string;
  form: 1 | 2 | 3 | 4 | 5;
  subject: string;
  year: number;
  title: string;
  category?: string;
  pdfUrl: string;
  sizeBytes?: number;
  updatedAt: string;
}

interface ManifestPayload {
  updatedAt: string;
  papers: ManifestPaper[];
}

function isHttpUrl(value: string): boolean {
  return value.startsWith("https://") || value.startsWith("http://");
}

function buildUploadThingUrl(fileKey: string): string | null {
  const appId = process.env.UPLOADTHING_APP_ID?.trim();
  if (!appId) {
    return null;
  }

  return `https://${appId}.ufs.sh/f/${fileKey}`;
}

function resolvePdfUrl(row: PaperRow): string | null {
  if (row.pdfUrl && isHttpUrl(row.pdfUrl)) {
    return row.pdfUrl;
  }

  if (row.fileKey) {
    // Accept full URLs pasted as "fileKey" from dashboards or logs.
    if (isHttpUrl(row.fileKey)) {
      return row.fileKey;
    }

    return buildUploadThingUrl(row.fileKey);
  }

  return null;
}

export function buildManifest(): ManifestPayload {
  const papers: ManifestPaper[] = PAPER_ROWS.map((row) => {
    const pdfUrl = resolvePdfUrl(row);
    if (!pdfUrl) {
      throw new Error(
        `Missing pdfUrl for paper id=${row.id}. Set pdfUrl or fileKey + UPLOADTHING_APP_ID.`,
      );
    }

    return {
      id: row.id,
      form: row.form,
      subject: row.subject ?? "General",
      year: row.year,
      title: row.title,
      category: row.category,
      pdfUrl,
      sizeBytes: row.sizeBytes,
      updatedAt: row.updatedAt ?? row.createdAt ?? PAPERS_UPDATED_AT,
    };
  });

  return {
    updatedAt: PAPERS_UPDATED_AT,
    papers,
  };
}
