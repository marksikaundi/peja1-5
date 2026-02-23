export type FormLevel = 1 | 2 | 3 | 4 | 5;

export interface Paper {
  id: string;
  form: FormLevel;
  subject: string;
  year: number;
  title: string;
  pdfUrl: string;
  sizeBytes?: number;
  updatedAt: string;
}

export interface ManifestPayload {
  updatedAt: string;
  papers: Paper[];
}

export interface DownloadRecord {
  paperId: string;
  localUri: string;
  downloadedAt: string;
  sizeBytes?: number;
}

export type DownloadIndex = Record<string, DownloadRecord>;

export type ManifestSource = "remote" | "cache" | "seed";
