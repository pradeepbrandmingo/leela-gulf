import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const [total, deliverable, undeliverable, unknown] = await Promise.all([
      prisma.verification.count(),
      prisma.verification.count({ where: { status: "deliverable" } }),
      prisma.verification.count({ where: { status: "undeliverable" } }),
      prisma.verification.count({ where: { status: "unknown" } }),
    ]);

    return NextResponse.json({ success: true, data: { total, deliverable, undeliverable, unknown } });
  } catch (err) {
    console.error("[stats] error", (err as Error)?.message);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Could not load stats." } },
      { status: 500 }
    );
  }
}
