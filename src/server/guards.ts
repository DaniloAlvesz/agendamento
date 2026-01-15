import { auth } from "@/server/auth";
import { prisma } from "@/server/db";

export async function requireSession() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export async function requireAdmin() {
  const session = await requireSession();
  if (session.user.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }
  return session;
}

export async function requireProfessional() {
  const session = await requireSession();
  if (session.user.role !== "PROFESSIONAL") {
    throw new Error("FORBIDDEN");
  }
  const professional = await prisma.professionalProfile.findUnique({
    where: { userId: session.user.id }
  });
  if (!professional) throw new Error("NO_PROFESSIONAL");
  return { session, professional };
}

export async function requireCustomer() {
  const session = await requireSession();
  if (session.user.role !== "CUSTOMER") {
    throw new Error("FORBIDDEN");
  }
  const customer = await prisma.customerProfile.findUnique({
    where: { userId: session.user.id }
  });
  if (!customer) throw new Error("NO_CUSTOMER");
  return { session, customer };
}
