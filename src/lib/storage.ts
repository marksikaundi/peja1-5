import * as FileSystem from "expo-file-system/legacy";

const APP_DIR_NAME = "zambia-past-papers";

export const APP_DIRECTORY = `${FileSystem.documentDirectory}${APP_DIR_NAME}`;
export const MANIFEST_CACHE_PATH = `${APP_DIRECTORY}/manifest-cache.json`;
export const DOWNLOAD_INDEX_PATH = `${APP_DIRECTORY}/downloads.json`;
export const PDF_DIRECTORY = `${APP_DIRECTORY}/pdfs`;

async function ensureDirectory(path: string): Promise<void> {
  const info = await FileSystem.getInfoAsync(path);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(path, { intermediates: true });
  }
}

export async function ensureStoragePaths(): Promise<void> {
  await ensureDirectory(APP_DIRECTORY);
  await ensureDirectory(PDF_DIRECTORY);
}

export async function readJsonFile<T>(path: string): Promise<T | null> {
  try {
    const info = await FileSystem.getInfoAsync(path);
    if (!info.exists) {
      return null;
    }

    const raw = await FileSystem.readAsStringAsync(path);
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function writeJsonFile<T>(path: string, value: T): Promise<void> {
  await ensureStoragePaths();
  await FileSystem.writeAsStringAsync(path, JSON.stringify(value));
}

export function sanitizeFilename(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase();
}
