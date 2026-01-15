import { prisma } from "@/server/db";
import { requireProfessional } from "@/server/guards";
import { ProfessionalBookingCard } from "@/components/dashboard/booking-card";

export default async function AgendaPage() {
  const { professional } = await requireProfessional();

  const bookings = await prisma.booking.findMany({
    where: { professionalId: professional.id, status: "CONFIRMED" },
    include: { service: true, customer: { include: { user: true } } },
    orderBy: { startAt: "asc" }
  });

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Agenda</h1>
        <p className="text-sm text-slate-600">Visualize e acompanhe os agendamentos.</p>
      </header>

      <div className="grid gap-3">
        {bookings.map((booking) => (
          <ProfessionalBookingCard
            key={booking.id}
            booking={{
              id: booking.id,
              startAt: booking.startAt.toISOString(),
              endAt: booking.endAt.toISOString(),
              serviceName: booking.service.name,
              customerName: booking.customer.name,
              customerEmail: booking.customer.user.email,
              customerPhone: booking.customer.phone,
              notes: booking.notes
            }}
          />
        ))}
      </div>
    </div>
  );
}
