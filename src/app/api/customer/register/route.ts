import { NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { z } from "zod";
import { hash } from "bcryptjs";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  password: z.string().min(6).optional().or(z.literal("")),
  professionalCode: z.string().min(2).optional().or(z.literal(""))
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = registerSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_DATA" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return NextResponse.json({ error: "EMAIL_IN_USE" }, { status: 409 });
  }

  const professional = parsed.data.professionalCode
    ? await prisma.professionalProfile.findUnique({ where: { slug: parsed.data.professionalCode } })
    : null;

  const passwordHash = parsed.data.password
    ? await hash(parsed.data.password, 10)
    : null;

  const user = await prisma.user.create({
    data: {
      email: parsed.data.email,
      role: "CUSTOMER",
      passwordHash,
      customerProfile: {
        create: {
          name: parsed.data.name,
          phone: parsed.data.phone,
          professionalId: professional?.id ?? null
        }
      }
    }
  });

  return NextResponse.json({ ok: true, userId: user.id });
}
