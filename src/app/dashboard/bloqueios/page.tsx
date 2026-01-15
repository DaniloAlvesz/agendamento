import { prisma } from "@/server/db";
import { requireProfessional } from "@/server/guards";
import { BlocksManager } from "@/components/dashboard/blocks-manager";

export default async function BlocksPage() {
  const { professional } = await requireProfessional();
  const blocks = await prisma.block.findMany({
    where: { professionalId: professional.id },
    orderBy: { startAt: "desc" }
  });

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Bloqueios</h1>
        <p className="text-sm text-slate-600">Reserve horarios para pausas ou eventos.</p>
      </header>
      <BlocksManager
        blocks={blocks.map((block) => ({
          id: block.id,
          startAt: block.startAt.toISOString(),
          endAt: block.endAt.toISOString(),
          reason: block.reason
        }))}
      />
    </div>
  );
}
