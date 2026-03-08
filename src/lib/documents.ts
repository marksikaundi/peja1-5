import { File } from "expo-file-system";
import { Linking, Platform } from "react-native";

import {
  APP_DIRECTORY,
  readJsonFile,
  writeJsonFile,
} from "@/src/lib/storage";

const RECENT_DOCUMENTS_PATH = `${APP_DIRECTORY}/recent-documents.json`;
const MAX_RECENT_DOCUMENTS = 8;

export interface RecentDocument {
  id: string;
  name: string;
  uri: string;
  openUri: string;
  mimeType: string;
  sizeBytes?: number;
  lastOpenedAt: string;
}

function createRecentDocument(file: File): RecentDocument {
  const uri = file.uri;
  const openUri =
    Platform.OS === "android" && file.contentUri ? file.contentUri : file.uri;

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: file.name || "Untitled document",
    uri,
    openUri,
    mimeType: file.type || "application/octet-stream",
    sizeBytes: file.size > 0 ? file.size : undefined,
    lastOpenedAt: new Date().toISOString(),
  };
}

function normalizeRecentDocuments(value: RecentDocument[] | null): RecentDocument[] {
  if (!value) {
    return [];
  }

  return value
    .filter((doc) => Boolean(doc?.uri && doc?.openUri && doc?.name))
    .slice(0, MAX_RECENT_DOCUMENTS);
}

async function persistRecentDocuments(documents: RecentDocument[]): Promise<void> {
  await writeJsonFile(RECENT_DOCUMENTS_PATH, documents.slice(0, MAX_RECENT_DOCUMENTS));
}

async function openWithFallback(uri: string, fallbackUri?: string): Promise<void> {
  try {
    await Linking.openURL(uri);
  } catch {
    if (fallbackUri && fallbackUri !== uri) {
      await Linking.openURL(fallbackUri);
      return;
    }

    throw new Error("Could not open document URI.");
  }
}

export async function loadRecentDocuments(): Promise<RecentDocument[]> {
  const existing = await readJsonFile<RecentDocument[]>(RECENT_DOCUMENTS_PATH);
  return normalizeRecentDocuments(existing);
}

export async function clearRecentDocuments(): Promise<void> {
  await persistRecentDocuments([]);
}

export async function recordRecentDocument(document: RecentDocument): Promise<RecentDocument[]> {
  const current = await loadRecentDocuments();
  const deduped = current.filter((item) => item.uri !== document.uri);
  const next = [document, ...deduped].slice(0, MAX_RECENT_DOCUMENTS);
  await persistRecentDocuments(next);
  return next;
}

export async function openRecentDocument(document: RecentDocument): Promise<RecentDocument[]> {
  await openWithFallback(document.openUri, document.uri);
  const refreshed: RecentDocument = {
    ...document,
    lastOpenedAt: new Date().toISOString(),
  };
  return recordRecentDocument(refreshed);
}

export async function pickDocument(): Promise<RecentDocument | null> {
  try {
    const selection = await File.pickFileAsync();
    const file = Array.isArray(selection) ? selection[0] : selection;

    if (!file) {
      return null;
    }

    return createRecentDocument(file);
  } catch (error) {
    if (error instanceof Error && error.message.toLowerCase().includes("cancel")) {
      return null;
    }

    throw error;
  }
}

export async function pickAndOpenDocument(): Promise<{
  opened: RecentDocument | null;
  recent: RecentDocument[];
}> {
  const picked = await pickDocument();
  if (!picked) {
    return {
      opened: null,
      recent: await loadRecentDocuments(),
    };
  }

  await openWithFallback(picked.openUri, picked.uri);
  const recent = await recordRecentDocument(picked);

  return {
    opened: picked,
    recent,
  };
}
