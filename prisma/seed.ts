import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("Admin123!", 10);
  const professionalPassword = await bcrypt.hash("Profissional123!", 10);
  const customerPassword = await bcrypt.hash("Cliente123!", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@local.dev" },
    update: {},
    create: {
      email: "admin@local.dev",
      passwordHash: adminPassword,
      role: "ADMIN"
    }
  });

  const professionalUser = await prisma.user.upsert({
    where: { email: "maria@local.dev" },
    update: {},
    create: {
      email: "maria@local.dev",
      passwordHash: professionalPassword,
      role: "PROFESSIONAL",
      professionalProfile: {
        create: {
          name: "Maria Nails",
          slug: "maria-nails",
          phone: "5581999999999",
          timezone: "America/Recife",
          address: "Rua das Flores, 123"
        }
      }
    }
  });

  const professional = await prisma.professionalProfile.findUnique({
    where: { userId: professionalUser.id }
  });

  if (professional) {
    await prisma.service.createMany({
      data: [
        {
          professionalId: professional.id,
          name: "Esmaltacao Gel",
          description: "Acabamento premium com duracao de 3 semanas",
          durationMinutes: 90,
          priceCents: 15000
        },
        {
          professionalId: professional.id,
          name: "Manicure Simples",
          description: "Corte e esmaltação",
          durationMinutes: 45,
          priceCents: 7000
        }
      ],
      skipDuplicates: true
    });

    const existingRule = await prisma.availabilityRule.findFirst({
      where: { professionalId: professional.id }
    });

    if (!existingRule) {
      await prisma.availabilityRule.createMany({
        data: [
          {
            professionalId: professional.id,
            dayOfWeek: 1,
            startTime: "09:00",
            endTime: "18:00",
            breakStart: "12:00",
            breakEnd: "13:00",
            intervalMinutes: 15
          },
          {
            professionalId: professional.id,
            dayOfWeek: 2,
            startTime: "09:00",
            endTime: "18:00",
            breakStart: "12:00",
            breakEnd: "13:00",
            intervalMinutes: 15
          },
          {
            professionalId: professional.id,
            dayOfWeek: 3,
            startTime: "09:00",
            endTime: "18:00",
            breakStart: "12:00",
            breakEnd: "13:00",
            intervalMinutes: 15
          },
          {
            professionalId: professional.id,
            dayOfWeek: 4,
            startTime: "09:00",
            endTime: "18:00",
            breakStart: "12:00",
            breakEnd: "13:00",
            intervalMinutes: 15
          },
          {
            professionalId: professional.id,
            dayOfWeek: 5,
            startTime: "09:00",
            endTime: "16:00",
            breakStart: "12:00",
            breakEnd: "13:00",
            intervalMinutes: 15
          }
        ]
      });
    }
  }

  const customerUser = await prisma.user.upsert({
    where: { email: "cliente@local.dev" },
    update: {},
    create: {
      email: "cliente@local.dev",
      passwordHash: customerPassword,
      role: "CUSTOMER",
      customerProfile: {
        create: {
          name: "Cliente Teste",
          phone: "5581998887777",
          professionalId: professional?.id ?? null
        }
      }
    }
  });

  console.log("Seed concluido", { admin: admin.email, professional: professionalUser.email, customer: customerUser.email });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
