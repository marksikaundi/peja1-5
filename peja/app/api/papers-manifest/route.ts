import { NextResponse } from "next/server";

import { buildManifest } from "@/src/papers";

export const revalidate = 300;

export async function GET() {
  try {
    const manifest = buildManifest();

    return NextResponse.json(manifest, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        "Access-Control-Allow-Origin": "*",
      },
    });
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
