import { prisma } from "@/server/db";
import { requireProfessional } from "@/server/guards";
import { AvailabilityManager } from "@/components/dashboard/availability-manager";

export default async function AvailabilityPage() {
  const { professional } = await requireProfessional();
  const rules = await prisma.availabilityRule.findMany({
    where: { professionalId: professional.id },
    orderBy: { dayOfWeek: "asc" }
  });

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Disponibilidade</h1>
        <p className="text-sm text-slate-600">Configure seus dias e horarios de atendimento.</p>
      </header>
      <AvailabilityManager
        rules={rules.map((rule) => ({
          id: rule.id,
          dayOfWeek: rule.dayOfWeek,
          startTime: rule.startTime,
          endTime: rule.endTime,
          breakStart: rule.breakStart,
          breakEnd: rule.breakEnd,
          intervalMinutes: rule.intervalMinutes
        }))}
      />
    </div>
  );
}
