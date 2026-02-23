export type FormLevel = 1 | 2 | 3 | 4 | 5;

export interface PaperRow {
  id: string;
  form: FormLevel;
  subject: string;
  year: number;
  title: string;
  updatedAt: string;
  sizeBytes?: number;
  fileKey?: string;
  pdfUrl?: string;
}

export const PAPERS_UPDATED_AT = "2026-02-23T00:00:00.000Z";

export const PAPER_ROWS: PaperRow[] = [
  {
    id: "f1-math-2025-term1",
    form: 1,
    subject: "Mathematics",
    year: 2025,
    title: "Mathematics Form 1 End of Term 1",
    updatedAt: PAPERS_UPDATED_AT,
    fileKey: "REPLACE_WITH_UPLOADTHING_FILE_KEY_1",
  },
  {
    id: "f2-english-2024-final",
    form: 2,
    subject: "English Language",
    year: 2024,
    title: "English Form 2 Final",
    updatedAt: PAPERS_UPDATED_AT,
    fileKey: "REPLACE_WITH_UPLOADTHING_FILE_KEY_2",
  },
  {
    id: "f4-physics-2025-mock",
    form: 4,
    subject: "Physics",
    year: 2025,
    title: "Form 4 Physics Mock",
    updatedAt: PAPERS_UPDATED_AT,
    fileKey: "REPLACE_WITH_UPLOADTHING_FILE_KEY_3",
  },
];
