import { NextResponse } from "next/server";
import { z } from "zod";
import { requireProfessional } from "@/server/guards";
import { prisma } from "@/server/db";

const schema = z.object({
  startAt: z.string(),
  endAt: z.string(),
  reason: z.string().optional().nullable()
});

export async function POST(req: Request) {
  const { professional } = await requireProfessional();
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_DATA" }, { status: 400 });
  }

  const block = await prisma.block.create({
    data: {
      professionalId: professional.id,
      startAt: new Date(parsed.data.startAt),
      endAt: new Date(parsed.data.endAt),
      reason: parsed.data.reason ?? null
    }
  });

  return NextResponse.json({ ok: true, id: block.id });
}
