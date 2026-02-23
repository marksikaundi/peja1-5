import { NextResponse } from "next/server";

import { buildManifest } from "@/src/papers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const manifest = buildManifest();

    return NextResponse.json(
      {
        message: "Authenticated admin manifest preview",
        totalPapers: manifest.papers.length,
        updatedAt: manifest.updatedAt,
        papers: manifest.papers,
      },
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown manifest error";

    return NextResponse.json(
      {
        error: "MANIFEST_BUILD_FAILED",
        message,
      },
      { status: 500 },
    );
  }
}
