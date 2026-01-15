import { prisma } from "@/server/db";
import { requireProfessional } from "@/server/guards";
import { ServicesManager } from "@/components/dashboard/services-manager";

export default async function ServicesPage() {
  const { professional } = await requireProfessional();
  const services = await prisma.service.findMany({
    where: { professionalId: professional.id },
    orderBy: { createdAt: "asc" }
  });

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Servicos</h1>
        <p className="text-sm text-slate-600">Gerencie seus servicos e precos.</p>
      </header>
      <ServicesManager
        initialServices={services.map((service) => ({
          id: service.id,
          name: service.name,
          description: service.description,
          durationMinutes: service.durationMinutes,
          priceCents: service.priceCents
        }))}
      />
    </div>
  );
}
