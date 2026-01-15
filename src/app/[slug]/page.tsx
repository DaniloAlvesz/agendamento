import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/server/db";
import { auth } from "@/server/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function CustomerLanding({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug) notFound();
  const professional = await prisma.professionalProfile.findUnique({
    where: { slug },
    include: { services: { where: { active: true } } }
  });

  if (!professional) notFound();

  const session = await auth();
  const isLoggedIn = Boolean(session?.user?.id);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-white p-5 shadow-soft">
        <div className="space-y-3">
          <Badge>Agendamento premium</Badge>
          <h1 className="text-2xl font-semibold">{professional.name}</h1>
          <p className="text-sm text-slate-600">
            Agende seu horario de forma simples e segura. Atendimento em {professional.address ?? "endereco informado"}.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href={`/${slug}/agendar`}>Agendar agora</Link>
            </Button>
            {isLoggedIn && (
              <Button variant="outline" asChild>
                <Link href={`/${slug}/agendamentos`}>Meus agendamentos</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Servicos em destaque</h2>
        <div className="grid gap-3">
          {professional.services.map((service) => (
            <Card key={service.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold">{service.name}</h3>
                  <p className="text-sm text-slate-600">{service.description ?? ""}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">{service.durationMinutes} min</p>
                  <p className="text-sm font-semibold">R$ {(service.priceCents / 100).toFixed(2)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-base font-semibold">Ja e cliente?</h2>
        <p className="text-sm text-slate-600">Acesse seus agendamentos ou faca um novo.</p>
        <Button asChild className="mt-3">
          <Link href={`/${slug}/agendar`}>Ver agenda</Link>
        </Button>
      </section>
    </div>
  );
}
