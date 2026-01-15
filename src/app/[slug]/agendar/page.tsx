import { notFound } from "next/navigation";
import { prisma } from "@/server/db";
import { BookingForm } from "@/components/booking/booking-form";

export default async function BookingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug) notFound();
  const professional = await prisma.professionalProfile.findUnique({
    where: { slug },
    include: { services: { where: { active: true } } }
  });

  if (!professional) notFound();

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Agendar horario</h1>
        <p className="text-sm text-slate-600">
          Escolha o servico e o melhor horario para voce.
        </p>
      </header>
      <BookingForm
        professionalId={professional.id}
        slug={professional.slug}
        services={professional.services}
        whatsapp={professional.phone}
      />
    </div>
  );
}
