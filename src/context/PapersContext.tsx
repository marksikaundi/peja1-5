import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

import {
  downloadPaper,
  getDownloadIndex,
  removePaperDownload,
} from "@/src/lib/downloads";
import { syncManifest } from "@/src/lib/manifest";
import type { DownloadIndex, ManifestSource, Paper } from "@/src/types/papers";

interface PapersContextValue {
  papers: Paper[];
  source: ManifestSource;
  lastUpdatedAt: string;
  loading: boolean;
  error: string | null;
  downloads: DownloadIndex;
  activeDownloadIds: string[];
  refreshManifest: () => Promise<void>;
  getPaperById: (paperId: string) => Paper | undefined;
  savePaperOffline: (paper: Paper) => Promise<void>;
  removeOfflinePaper: (paperId: string) => Promise<void>;
}

const PapersContext = createContext<PapersContextValue | null>(null);

export function PapersProvider({ children }: PropsWithChildren) {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [source, setSource] = useState<ManifestSource>("seed");
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [downloads, setDownloads] = useState<DownloadIndex>({});
  const [activeDownloads, setActiveDownloads] = useState<Record<string, boolean>>({});

  const loadDownloads = useCallback(async () => {
    const index = await getDownloadIndex();
    setDownloads(index);
  }, []);

  const refreshManifest = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await syncManifest();
      setPapers(result.manifest.papers);
      setSource(result.source);
      setLastUpdatedAt(result.manifest.updatedAt);
    } catch {
      setError("Failed to sync papers. Showing existing data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const run = async () => {
      await Promise.all([refreshManifest(), loadDownloads()]);
    };

    run();
  }, [loadDownloads, refreshManifest]);

  const savePaperOffline = useCallback(async (paper: Paper) => {
    setActiveDownloads((previous) => ({ ...previous, [paper.id]: true }));

    try {
      const record = await downloadPaper(paper);
      setDownloads((previous) => ({ ...previous, [paper.id]: record }));
    } finally {
      setActiveDownloads((previous) => {
        const next = { ...previous };
        delete next[paper.id];
        return next;
      });
    }
  }, []);

  const removeOfflinePaper = useCallback(async (paperId: string) => {
    await removePaperDownload(paperId);
    setDownloads((previous) => {
      const next = { ...previous };
      delete next[paperId];
      return next;
    });
  }, []);

  const getPaperById = useCallback(
    (paperId: string) => papers.find((paper) => paper.id === paperId),
    [papers],
  );

  const value = useMemo<PapersContextValue>(
    () => ({
      papers,
      source,
      lastUpdatedAt,
      loading,
      error,
      downloads,
      activeDownloadIds: Object.keys(activeDownloads),
      refreshManifest,
      getPaperById,
      savePaperOffline,
      removeOfflinePaper,
    }),
    [
      papers,
      source,
      lastUpdatedAt,
      loading,
      error,
      downloads,
      activeDownloads,
      refreshManifest,
      getPaperById,
      savePaperOffline,
      removeOfflinePaper,
    ],
  );

  return <PapersContext.Provider value={value}>{children}</PapersContext.Provider>;
}

export function usePapers(): PapersContextValue {
  const context = useContext(PapersContext);
  if (!context) {
    throw new Error("usePapers must be used inside PapersProvider");
  }

  return context;
}
