import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/server/auth";
import { prisma } from "@/server/db";

const schema = z.object({
  bookingId: z.string()
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "CUSTOMER") {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_DATA" }, { status: 400 });
  }

  const customer = await prisma.customerProfile.findUnique({
    where: { userId: session.user.id }
  });
  if (!customer) {
    return NextResponse.json({ error: "NO_CUSTOMER" }, { status: 400 });
  }

  const booking = await prisma.booking.update({
    where: { id: parsed.data.bookingId, customerId: customer.id },
    data: { status: "CANCELLED" }
  });

  return NextResponse.json({ ok: true, bookingId: booking.id });
}
