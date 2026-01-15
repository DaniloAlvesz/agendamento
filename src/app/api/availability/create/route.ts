import { NextResponse } from "next/server";
import { z } from "zod";
import { requireProfessional } from "@/server/guards";
import { prisma } from "@/server/db";

const schema = z.object({
  dayOfWeek: z.coerce.number().min(0).max(6),
  startTime: z.string(),
  endTime: z.string(),
  breakStart: z.string().optional().nullable(),
  breakEnd: z.string().optional().nullable(),
  intervalMinutes: z.coerce.number().min(5).max(60)
});

export async function POST(req: Request) {
  const { professional } = await requireProfessional();
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_DATA" }, { status: 400 });
  }

  const rule = await prisma.availabilityRule.create({
    data: {
      professionalId: professional.id,
      dayOfWeek: parsed.data.dayOfWeek,
      startTime: parsed.data.startTime,
      endTime: parsed.data.endTime,
      breakStart: parsed.data.breakStart ?? null,
      breakEnd: parsed.data.breakEnd ?? null,
      intervalMinutes: parsed.data.intervalMinutes
    }
  });

  return NextResponse.json({ ok: true, id: rule.id });
}
