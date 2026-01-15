import { NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { z } from "zod";

const verifySchema = z.object({
  email: z.string().email(),
  code: z.string().min(4).max(8)
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = verifySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_CODE" }, { status: 400 });
  }

  const record = await prisma.verificationCode.findFirst({
    where: {
      email: parsed.data.email,
      code: parsed.data.code,
      usedAt: null,
      expiresAt: { gt: new Date() }
    }
  });

  if (!record) {
    return NextResponse.json({ error: "INVALID_CODE" }, { status: 400 });
  }

  await prisma.verificationCode.update({
    where: { id: record.id },
    data: { usedAt: new Date() }
  });

  return NextResponse.json({ ok: true });
}
