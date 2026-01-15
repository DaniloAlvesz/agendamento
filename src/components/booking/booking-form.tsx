"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Service = {
  id: string;
  name: string;
  durationMinutes: number;
  priceCents: number;
};

export function BookingForm({
  professionalId,
  slug,
  services,
  whatsapp
}: {
  professionalId: string;
  slug: string;
  services: Service[];
  whatsapp: string | null;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedService = useMemo(
    () => services.find((service) => service.id === serviceId),
    [services, serviceId]
  );

  useEffect(() => {
    if (!serviceId || !date) return;
    setLoadingSlots(true);
    setSlots([]);
    setError(null);
    fetch("/api/booking/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ professionalId, date, serviceId })
    })
      .then((response) => response.json())
      .then((data) => {
        setSlots(data.slots ?? []);
      })
      .catch(() => setError("Nao foi possivel carregar horarios."))
      .finally(() => setLoadingSlots(false));
  }, [serviceId, date, professionalId]);

  async function handleBooking() {
    if (!session?.user) {
      router.push("/auth/login");
      return;
    }
    setSubmitting(true);
    setError(null);
    const response = await fetch("/api/booking/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ professionalId, serviceId, date, time, notes })
    });

    if (response.ok) {
      const data = await response.json();
      router.push(`/${slug}/sucesso?bookingId=${data.bookingId}`);
    } else {
      const data = await response.json().catch(() => ({}));
      if (response.status === 409) {
        setError("Esse horario acabou de ser reservado. Escolha outro horario.");
      } else if (data?.error === "NO_CUSTOMER") {
        setError("Complete seu cadastro para agendar.");
      } else {
        setError("Nao foi possivel concluir o agendamento.");
      }
    }

    setSubmitting(false);
  }

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span className={step >= 1 ? "font-semibold text-slate-900" : ""}>1. Servico</span>
        <span>•</span>
        <span className={step >= 2 ? "font-semibold text-slate-900" : ""}>2. Data e horario</span>
        <span>•</span>
        <span className={step >= 3 ? "font-semibold text-slate-900" : ""}>3. Confirmar</span>
      </div>

      <Card className="p-5">
        <h2 className="text-lg font-semibold">Escolha o servico</h2>
        {services.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">Nenhum servico disponivel.</p>
        ) : (
          <div className="mt-4 grid gap-3">
            {services.map((service) => (
              <button
                key={service.id}
                type="button"
                className={`rounded-2xl border px-4 py-3 text-left transition ${
                  serviceId === service.id
                    ? "border-brand-500 bg-brand-50"
                    : "border-slate-200 bg-white"
                }`}
                onClick={() => {
                  setServiceId(service.id);
                  setStep(2);
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">{service.name}</p>
                    <p className="text-xs text-slate-600">{service.durationMinutes} min</p>
                  </div>
                  <p className="text-sm font-semibold">R$ {(service.priceCents / 100).toFixed(2)}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-5">
        <h2 className="text-lg font-semibold">Data e horario</h2>
        <div className="mt-3 space-y-3">
          <label className="label-base">Selecione a data</label>
          <Input
            type="date"
            value={date}
            onChange={(event) => {
              setDate(event.target.value);
              setStep(2);
              setTime("");
            }}
            min={minDate}
          />
        </div>
        <div className="mt-4">
          {loadingSlots ? (
            <p className="text-sm text-slate-500">Carregando horarios...</p>
          ) : slots.length === 0 && date ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              Sem horarios disponiveis para este servico.
              {whatsapp && (
                <div className="mt-3">
                  <Button asChild variant="outline">
                    <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer">
                      Falar com a profissional no WhatsApp
                    </a>
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {slots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  className={`h-11 rounded-xl border text-sm font-medium ${
                    time === slot
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-slate-200 bg-white text-slate-700"
                  }`}
                  onClick={() => {
                    setTime(slot);
                    setStep(3);
                  }}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="text-lg font-semibold">Seus dados</h2>
        <p className="text-sm text-slate-600">
          Revise as informacoes e confirme o agendamento.
        </p>
        <div className="mt-3 space-y-2 text-sm text-slate-700">
          <p>Servico: {selectedService?.name ?? "-"}</p>
          <p>Data: {date || "-"}</p>
          <p>Horario: {time || "-"}</p>
        </div>
        <div className="mt-3">
          <label className="label-base">Observacoes</label>
          <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} />
        </div>
        {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
        <Button
          className="mt-4 w-full"
          disabled={!serviceId || !date || !time || submitting}
          onClick={handleBooking}
        >
          {submitting ? "Confirmando..." : "Confirmar agendamento"}
        </Button>
      </Card>
    </div>
  );
}
