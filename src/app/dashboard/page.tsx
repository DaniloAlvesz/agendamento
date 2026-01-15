import { prisma } from "@/server/db";
import { requireProfessional } from "@/server/guards";
import { Card } from "@/components/ui/card";

export default async function DashboardPage() {
  const { professional } = await requireProfessional();

  const bookingsCount = await prisma.booking.count({
    where: { professionalId: professional.id, status: "CONFIRMED" }
  });

  const servicesCount = await prisma.service.count({
    where: { professionalId: professional.id }
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Visao geral</h1>
      <div className="grid gap-3 md:grid-cols-2">
        <Card className="p-5">
          <p className="text-sm text-slate-600">Agendamentos ativos</p>
          <p className="text-2xl font-semibold">{bookingsCount}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-slate-600">Servicos cadastrados</p>
          <p className="text-2xl font-semibold">{servicesCount}</p>
        </Card>
      </div>
    </div>
  );
}
