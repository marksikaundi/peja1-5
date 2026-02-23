import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { buildManifest } from "@/src/papers";

export const dynamic = "force-dynamic";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      {
        error: "UNAUTHORIZED",
        message: "Sign in to access admin manifest preview.",
      },
      { status: 401 },
    );
  }

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
