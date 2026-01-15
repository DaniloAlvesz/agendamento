const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
prisma.professionalProfile.findMany()
  .then((r) => console.log(r))
  .finally(() => prisma.$disconnect());
