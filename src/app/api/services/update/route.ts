import { NextResponse } from "next/server";
import { z } from "zod";
import { requireProfessional } from "@/server/guards";
import { prisma } from "@/server/db";

const schema = z.object({
  id: z.string(),
  name: z.string().min(2),
  description: z.string().optional().nullable(),
  durationMinutes: z.coerce.number().min(15),
  priceCents: z.coerce.number().min(0)
});

export async function POST(req: Request) {
  const { professional } = await requireProfessional();
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_DATA" }, { status: 400 });
  }

  const service = await prisma.service.update({
    where: { id: parsed.data.id, professionalId: professional.id },
    data: {
      name: parsed.data.name,
      description: parsed.data.description ?? null,
      durationMinutes: parsed.data.durationMinutes,
      priceCents: parsed.data.priceCents
    }
  });

  return NextResponse.json({ ok: true, id: service.id });
}
