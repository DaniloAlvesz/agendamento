import { prisma } from "@/server/db";

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  professionalId?: string | null;
  bookingId?: string | null;
};

export async function sendEmail(payload: EmailPayload) {
  if (process.env.RESEND_API_KEY) {
    // Placeholder for Resend integration.
    // We keep a stub to avoid runtime dependency issues.
  } else {
    console.info("[email]", payload.subject, payload.to);
  }

  await prisma.notificationLog.create({
    data: {
      professionalId: payload.professionalId ?? null,
      bookingId: payload.bookingId ?? null,
      channel: "EMAIL",
      status: "SENT",
      payload: { to: payload.to, subject: payload.subject }
    }
  });
}

export async function sendOtpEmail(email: string, code: string) {
  const html = `<p>Seu codigo de acesso: <strong>${code}</strong></p>`;
  if (!process.env.RESEND_API_KEY) {
    console.info(`[otp] codigo para ${email}: ${code}`);
  }
  await sendEmail({ to: email, subject: "Seu codigo de acesso", html });
}
