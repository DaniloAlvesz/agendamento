import { prisma } from "@/server/db";
import { requireProfessional } from "@/server/guards";
import { Card } from "@/components/ui/card";

export default async function SettingsPage() {
  const { professional } = await requireProfessional();
  const profile = await prisma.professionalProfile.findUnique({
    where: { id: professional.id }
  });

  if (!profile) return null;

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Configuracoes</h1>
        <p className="text-sm text-slate-600">Revise seus dados basicos.</p>
      </header>
      <Card className="p-5 space-y-2">
        <p className="text-sm"><strong>Slug:</strong> {profile.slug}</p>
        <p className="text-sm"><strong>Nome:</strong> {profile.name}</p>
        <p className="text-sm"><strong>Telefone:</strong> {profile.phone ?? "-"}</p>
        <p className="text-sm"><strong>Fuso horario:</strong> {profile.timezone}</p>
      </Card>
    </div>
  );
}
