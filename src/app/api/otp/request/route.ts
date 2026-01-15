import { NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { sendOtpEmail } from "@/server/notifications/email";
import { z } from "zod";

const requestSchema = z.object({
  email: z.string().email()
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = requestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_EMAIL" }, { status: 400 });
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.verificationCode.create({
    data: {
      email: parsed.data.email,
      code,
      expiresAt
    }
  });

  await sendOtpEmail(parsed.data.email, code);

  return NextResponse.json({ ok: true });
}
