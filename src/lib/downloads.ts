import * as FileSystem from "expo-file-system/legacy";

import {
  DOWNLOAD_INDEX_PATH,
  PDF_DIRECTORY,
  ensureStoragePaths,
  readJsonFile,
  sanitizeFilename,
  writeJsonFile,
} from "@/src/lib/storage";
import type { DownloadIndex, DownloadRecord, Paper } from "@/src/types/papers";

export async function getDownloadIndex(): Promise<DownloadIndex> {
  const index = await readJsonFile<DownloadIndex>(DOWNLOAD_INDEX_PATH);
  return index ?? {};
}

async function persistDownloadIndex(index: DownloadIndex): Promise<void> {
  await writeJsonFile(DOWNLOAD_INDEX_PATH, index);
}

export async function downloadPaper(paper: Paper): Promise<DownloadRecord> {
  await ensureStoragePaths();
  const filename = `${sanitizeFilename(paper.id)}.pdf`;
  const targetPath = `${PDF_DIRECTORY}/${filename}`;

  const result = await FileSystem.downloadAsync(paper.pdfUrl, targetPath);
  if (result.status < 200 || result.status >= 300) {
    throw new Error(`Download failed with status ${result.status}`);
  }

  const info = await FileSystem.getInfoAsync(targetPath);
  const record: DownloadRecord = {
    paperId: paper.id,
    localUri: targetPath,
    downloadedAt: new Date().toISOString(),
    sizeBytes: info.exists ? info.size : undefined,
  };

  const index = await getDownloadIndex();
  index[paper.id] = record;
  await persistDownloadIndex(index);

  return record;
}

export async function removePaperDownload(paperId: string): Promise<void> {
  const index = await getDownloadIndex();
  const existing = index[paperId];

  if (existing) {
    const fileInfo = await FileSystem.getInfoAsync(existing.localUri);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(existing.localUri, { idempotent: true });
    }

    delete index[paperId];
    await persistDownloadIndex(index);
  }
}

export async function getDownloadRecord(
  paperId: string,
): Promise<DownloadRecord | null> {
  const index = await getDownloadIndex();
  const record = index[paperId];
  if (!record) {
    return null;
  }

  const info = await FileSystem.getInfoAsync(record.localUri);
  if (!info.exists) {
    delete index[paperId];
    await persistDownloadIndex(index);
    return null;
  }

  return record;
}
