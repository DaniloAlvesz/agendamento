import { NextResponse } from "next/server";
import { z } from "zod";
import { getAvailableSlots } from "@/server/availability";

const schema = z.object({
  professionalId: z.string(),
  date: z.string(),
  serviceId: z.string()
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_DATA" }, { status: 400 });
  }

  const slots = await getAvailableSlots(parsed.data);
  return NextResponse.json({ slots });
}
