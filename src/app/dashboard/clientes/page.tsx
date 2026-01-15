import { prisma } from "@/server/db";
import { requireProfessional } from "@/server/guards";
import { Card } from "@/components/ui/card";

export default async function ClientsPage() {
  const { professional } = await requireProfessional();
  const customers = await prisma.customerProfile.findMany({
    where: { professionalId: professional.id },
    include: { user: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Clientes</h1>
        <p className="text-sm text-slate-600">Lista de clientes associados a voce.</p>
      </header>

      <div className="grid gap-3">
        {customers.map((customer) => (
          <Card key={customer.id} className="p-4">
            <p className="text-sm font-semibold">{customer.name}</p>
            <p className="text-xs text-slate-500">{customer.user.email}</p>
            <p className="text-xs text-slate-500">{customer.phone ?? "-"}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
