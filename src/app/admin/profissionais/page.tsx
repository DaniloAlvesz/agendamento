import Link from "next/link";
import { prisma } from "@/server/db";
import { createProfessional } from "@/app/admin/profissionais/actions";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function ProfessionalsPage() {
  const professionals = await prisma.professionalProfile.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Profissionais</h1>
        <p className="text-sm text-slate-600">Crie e gerencie contas.</p>
      </header>

      <Card className="p-5">
        <form action={createProfessional} className="grid gap-3 md:grid-cols-2">
          <Input name="name" placeholder="Nome" required />
          <Input name="email" type="email" placeholder="Email" required />
          <Input name="password" type="password" placeholder="Senha" required />
          <Input name="slug" placeholder="slug" required />
          <Input name="phone" placeholder="WhatsApp" />
          <div className="md:col-span-2">
            <Button type="submit">Criar profissional</Button>
          </div>
        </form>
      </Card>

      <div className="grid gap-3">
        {professionals.map((pro) => (
          <Card key={pro.id} className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">{pro.name}</p>
                <p className="text-xs text-slate-500">{pro.user.email}</p>
              </div>
              <Link className="text-sm text-brand-700" href={`/admin/profissionais/${pro.id}`}>
                Ver detalhes
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
