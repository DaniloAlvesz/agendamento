"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export type CustomerBooking = {
  id: string;
  startAt: string;
  serviceName: string;
  notes: string | null;
  status: string;
};

export function CustomerBookingCard({ booking }: { booking: CustomerBooking }) {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState(booking.notes ?? "");
  const [loading, setLoading] = useState(false);

  async function updateBooking() {
    setLoading(true);
    await fetch("/api/booking/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId: booking.id, notes })
    });
    setLoading(false);
    setOpen(false);
  }

  async function cancelBooking() {
    setLoading(true);
    await fetch("/api/booking/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId: booking.id })
    });
    setLoading(false);
    setOpen(false);
  }

  return (
    <>
      <Card className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold">{booking.serviceName}</h3>
            <p className="text-sm text-slate-600">
              {format(new Date(booking.startAt), "dd/MM/yyyy HH:mm")}
            </p>
            <p className="text-xs text-slate-500">Status: {booking.status}</p>
          </div>
          <Button variant="outline" onClick={() => setOpen(true)}>
            Alterar
          </Button>
        </div>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar agendamento</DialogTitle>
          </DialogHeader>
          <label className="label-base">Observacoes</label>
          <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} />
          <div className="mt-4 flex gap-2">
            <Button onClick={updateBooking} disabled={loading} className="flex-1">
              Salvar
            </Button>
            <Button variant="destructive" onClick={cancelBooking} disabled={loading} className="flex-1">
              Cancelar agendamento
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
