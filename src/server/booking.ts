import { addMinutes } from "date-fns";
import { prisma } from "@/server/db";
import { sendEmail } from "@/server/notifications/email";
import { sendWhatsapp } from "@/server/notifications/whatsapp";

export async function createBooking({
  professionalId,
  customerId,
  serviceId,
  startAt,
  notes
}: {
  professionalId: string;
  customerId: string;
  serviceId: string;
  startAt: Date;
  notes?: string | null;
}) {
  const booking = await prisma.$transaction(async (tx) => {
    const service = await tx.service.findUnique({
      where: { id: serviceId }
    });
    if (!service) throw new Error("SERVICE_NOT_FOUND");
    if (service.professionalId !== professionalId) {
      throw new Error("SERVICE_MISMATCH");
    }

    const endAt = addMinutes(startAt, service.durationMinutes);

    const conflict = await tx.booking.findFirst({
      where: {
        professionalId,
        status: "CONFIRMED",
        startAt: { lt: endAt },
        endAt: { gt: startAt }
      }
    });

    if (conflict) throw new Error("BOOKING_CONFLICT");

    const block = await tx.block.findFirst({
      where: {
        professionalId,
        startAt: { lt: endAt },
        endAt: { gt: startAt }
      }
    });

    if (block) throw new Error("BOOKING_BLOCKED");

    const booking = await tx.booking.create({
      data: {
        professionalId,
        customerId,
        serviceId,
        startAt,
        endAt,
        notes: notes ?? null,
        status: "CONFIRMED"
      },
      include: {
        customer: true,
        professional: true,
        service: true
      }
    });

    return booking;
  });

  const message = `Agendamento confirmado para ${booking.customer?.name ?? "cliente"} em ${booking.startAt.toISOString()}`;

  try {
    if (booking.customer?.email) {
      await sendEmail({
        to: booking.customer.email,
        subject: "Agendamento confirmado",
        html: `<p>${message}</p>`,
        professionalId,
        bookingId: booking.id
      });
    }

    if (booking.customer?.phone) {
      await sendWhatsapp({
        to: booking.customer.phone,
        message,
        professionalId,
        bookingId: booking.id
      });
    }
  } catch (error) {
    console.error("[booking:notify]", (error as Error).message);
  }

  return booking;
}

export async function cancelBooking({
  bookingId,
  professionalId
}: {
  bookingId: string;
  professionalId: string;
}) {
  return prisma.booking.update({
    where: { id: bookingId, professionalId },
    data: { status: "CANCELLED" }
  });
}

export async function updateBookingNotes({
  bookingId,
  professionalId,
  notes
}: {
  bookingId: string;
  professionalId: string;
  notes: string;
}) {
  return prisma.booking.update({
    where: { id: bookingId, professionalId },
    data: { notes }
  });
}
