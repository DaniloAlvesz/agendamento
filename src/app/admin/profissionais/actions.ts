"use server";

import { z } from "zod";
import { prisma } from "@/server/db";
import { requireAdmin } from "@/server/guards";
import { hash } from "bcryptjs";

const professionalCreateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  slug: z.string().min(2),
  phone: z.string().optional().nullable()
});

export async function createProfessional(formData: FormData) {
  await requireAdmin();
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    phone: String(formData.get("phone") ?? "")
  };

  const parsed = professionalCreateSchema.safeParse(raw);
  if (!parsed.success) throw new Error("INVALID_PROFESSIONAL");

  const passwordHash = await hash(parsed.data.password, 10);

  await prisma.user.create({
    data: {
      email: parsed.data.email,
      passwordHash,
      role: "PROFESSIONAL",
      professionalProfile: {
        create: {
          name: parsed.data.name,
          slug: parsed.data.slug,
          phone: parsed.data.phone ?? null
        }
      }
    }
  });
}
