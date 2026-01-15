import { prisma } from "@/server/db";

type WhatsappPayload = {
  to: string;
  message: string;
  professionalId?: string | null;
  bookingId?: string | null;
};

export async function sendWhatsapp(payload: WhatsappPayload) {
  console.info("[whatsapp]", payload.to, payload.message);
  await prisma.notificationLog.create({
    data: {
      professionalId: payload.professionalId ?? null,
      bookingId: payload.bookingId ?? null,
      channel: "WHATSAPP",
      status: "STUB",
      payload: { to: payload.to, message: payload.message }
    }
  });
}
