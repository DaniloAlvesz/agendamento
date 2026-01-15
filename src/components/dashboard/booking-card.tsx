"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export type ProfessionalBooking = {
  id: string;
  startAt: string;
  endAt: string;
  serviceName: string;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string | null;
  notes: string | null;
};

export function ProfessionalBookingCard({ booking }: { booking: ProfessionalBooking }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold">{booking.serviceName}</h3>
            <p className="text-sm text-slate-600">
              {format(new Date(booking.startAt), "dd/MM/yyyy HH:mm")}
            </p>
            <p className="text-xs text-slate-500 break-words">
              {booking.customerName} • {booking.customerEmail || booking.customerPhone || "-"}
            </p>
          </div>
          <Button variant="outline" onClick={() => setOpen(true)}>
            Detalhes
          </Button>
        </div>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agendamento</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 text-sm text-slate-700">
            <p>Servico: {booking.serviceName}</p>
            <p>Cliente: {booking.customerName}</p>
            <p className="break-words">Email: {booking.customerEmail ?? "-"}</p>
            <p className="break-words">Telefone: {booking.customerPhone ?? "-"}</p>
            <p>
              Horario: {format(new Date(booking.startAt), "dd/MM/yyyy HH:mm")} -{" "}
              {format(new Date(booking.endAt), "HH:mm")}
            </p>
            <p>Observacoes: {booking.notes ?? "-"}</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
