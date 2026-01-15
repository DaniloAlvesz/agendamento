import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/server/auth";
import { prisma } from "@/server/db";
import { localTimeToUtcISO } from "@/server/availability";
import { createBooking } from "@/server/booking";

const schema = z.object({
  professionalId: z.string(),
  serviceId: z.string(),
  date: z.string(),
  time: z.string(),
  notes: z.string().optional().nullable()
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

  const professional = await prisma.professionalProfile.findUnique({
    where: { id: parsed.data.professionalId }
  });
  if (!professional) {
    return NextResponse.json({ error: "INVALID_PROFESSIONAL" }, { status: 404 });
  }

  const startAtIso = localTimeToUtcISO({
    date: parsed.data.date,
    time: parsed.data.time,
    timezone: professional.timezone
  });

  try {
    const booking = await createBooking({
      professionalId: parsed.data.professionalId,
      customerId: customer.id,
      serviceId: parsed.data.serviceId,
      startAt: new Date(startAtIso),
      notes: parsed.data.notes
    });

    return NextResponse.json({ bookingId: booking.id });
  } catch (error) {
    const message = (error as Error).message;
    if (message === "BOOKING_CONFLICT" || message === "BOOKING_BLOCKED") {
      return NextResponse.json({ error: message }, { status: 409 });
    }
    if (
      message === "SERVICE_NOT_FOUND" ||
      message === "SERVICE_MISMATCH"
    ) {
      return NextResponse.json({ error: message }, { status: 400 });
    }
    console.error("[booking:create]", message);
    return NextResponse.json({ error: "BOOKING_FAILED" }, { status: 500 });
  }
}
