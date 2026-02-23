import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const VALID_FORMS = new Set([1, 2, 3, 4, 5]);
const CURRENT_YEAR = new Date().getFullYear();

function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function validateYear(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isInteger(value)) {
    return null;
  }

  if (value < 1990 || value > CURRENT_YEAR + 1) {
    return null;
  }

  return value;
}

function validateForm(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isInteger(value)) {
    return null;
  }

  return VALID_FORMS.has(value) ? value : null;
}

function buildMaterialId(category: string, form: number, year: number, title: string): string {
  const source = title || category;
  const slug = source.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return `${year}-f${form}-${slug || "material"}`;
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      {
        error: "UNAUTHORIZED",
        message: "Sign in to submit learning materials.",
      },
      { status: 401 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: "INVALID_JSON",
        message: "Request body must be valid JSON.",
      },
      { status: 400 },
    );
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      {
        error: "INVALID_BODY",
        message: "Request body must be an object.",
      },
      { status: 400 },
    );
  }

  const input = body as Record<string, unknown>;

  const category = normalizeText(input.category);
  const title = normalizeText(input.title);
  const subject = normalizeText(input.subject);
  const fileKey = normalizeText(input.fileKey);
  const form = validateForm(input.form);
  const year = validateYear(input.year);

  if (!category) {
    return NextResponse.json(
      {
        error: "VALIDATION_ERROR",
        message: "Category is required.",
      },
      { status: 400 },
    );
  }

  if (!form) {
    return NextResponse.json(
      {
        error: "VALIDATION_ERROR",
        message: "Form must be between 1 and 5.",
      },
      { status: 400 },
    );
  }

  if (!year) {
    return NextResponse.json(
      {
        error: "VALIDATION_ERROR",
        message: `Year must be between 1990 and ${CURRENT_YEAR + 1}.`,
      },
      { status: 400 },
    );
  }

  const id = buildMaterialId(category, form, year, title);
  const createdAt = new Date().toISOString();

  return NextResponse.json(
    {
      message: "Material submission validated.",
      material: {
        id,
        title: title || `${category} Form ${form}`,
        category,
        form,
        year,
        subject: subject || null,
        fileKey: fileKey || null,
        createdAt,
      },
      nextStep:
        "Persist this record in your admin database or append it to `data/papers.ts` before deploying.",
    },
    { status: 200 },
  );
}
