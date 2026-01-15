import { notFound } from "next/navigation";
import { prisma } from "@/server/db";
import { Card } from "@/components/ui/card";

export default async function ProfessionalDetail({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const professional = await prisma.professionalProfile.findUnique({
    where: { id },
    include: { user: true, services: true }
  });

  if (!professional) notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{professional.name}</h1>
      <Card className="p-5 space-y-2">
        <p className="text-sm break-words"><strong>Email:</strong> {professional.user.email}</p>
        <p className="text-sm"><strong>Slug:</strong> {professional.slug}</p>
        <p className="text-sm"><strong>Telefone:</strong> {professional.phone ?? "-"}</p>
      </Card>
      <Card className="p-5">
        <h2 className="text-base font-semibold">Servicos</h2>
        <ul className="mt-2 space-y-1 text-sm text-slate-600">
          {professional.services.map((service) => (
            <li key={service.id}>{service.name}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
