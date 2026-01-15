import Link from "next/link";
import { auth } from "@/server/auth";
import { prisma } from "@/server/db";
import { CustomerBookingCard } from "@/components/booking/customer-booking-card";
import { Button } from "@/components/ui/button";

export default async function CustomerBookings({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Meus agendamentos</h1>
        <p className="text-sm text-slate-600">Entre para visualizar seus horarios.</p>
        <Button asChild>
          <Link href="/auth/login">Entrar</Link>
        </Button>
      </div>
    );
  }

  const customer = await prisma.customerProfile.findUnique({
    where: { userId: session.user.id }
  });

  if (!customer) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Meus agendamentos</h1>
        <p className="text-sm text-slate-600">Nenhum cadastro encontrado.</p>
      </div>
    );
  }

  const bookings = await prisma.booking.findMany({
    where: { customerId: customer.id, professional: { slug } },
    include: { service: true },
    orderBy: { startAt: "asc" }
  });

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Meus agendamentos</h1>
        <p className="text-sm text-slate-600">
          Consulte ou altere observacoes e cancelamentos.
        </p>
      </header>

      {bookings.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-600">Voce ainda nao tem agendamentos.</p>
          <Button asChild className="mt-3">
            <Link href={`/${slug}/agendar`}>Agendar agora</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-3">
          {bookings.map((booking) => (
            <CustomerBookingCard
              key={booking.id}
              booking={{
                id: booking.id,
                startAt: booking.startAt.toISOString(),
                serviceName: booking.service.name,
                notes: booking.notes,
                status: booking.status
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
