"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export type ServiceItem = {
  id: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  priceCents: number;
};

export function ServicesManager({ initialServices }: { initialServices: ServiceItem[] }) {
  const [services, setServices] = useState(initialServices);
  const [loading, setLoading] = useState(false);

  async function createService(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      description: String(form.get("description") || ""),
      durationMinutes: Number(form.get("durationMinutes")),
      priceCents: Math.round(Number(form.get("price") || 0) * 100)
    };

    const response = await fetch("/api/services/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const data = await response.json();
      setServices((prev) => [
        ...prev,
        {
          id: data.id,
          name: payload.name,
          description: payload.description,
          durationMinutes: payload.durationMinutes,
          priceCents: payload.priceCents
        }
      ]);
      event.currentTarget.reset();
    }

    setLoading(false);
  }

  async function updateService(serviceId: string, payload: ServiceItem) {
    setLoading(true);
    const response = await fetch("/api/services/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: serviceId,
        name: payload.name,
        description: payload.description,
        durationMinutes: payload.durationMinutes,
        priceCents: payload.priceCents
      })
    });

    if (response.ok) {
      setServices((prev) => prev.map((service) => (service.id === serviceId ? payload : service)));
    }
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <h2 className="text-lg font-semibold">Novo servico</h2>
        <form onSubmit={createService} className="mt-3 grid gap-3 md:grid-cols-2">
          <Input name="name" placeholder="Nome do servico" required />
          <Input name="durationMinutes" type="number" min={15} placeholder="Duracao (min)" required />
          <Input name="price" type="number" min={0} step="0.01" placeholder="Preco" required />
          <Input name="description" placeholder="Descricao" />
          <div className="md:col-span-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Adicionar servico"}
            </Button>
          </div>
        </form>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} onSave={updateService} />
        ))}
      </div>
    </div>
  );
}

function ServiceCard({
  service,
  onSave
}: {
  service: ServiceItem;
  onSave: (id: string, payload: ServiceItem) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<ServiceItem>(service);

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">{service.name}</h3>
          <p className="text-xs text-slate-500">{service.durationMinutes} min</p>
          <p className="text-xs text-slate-500">R$ {(service.priceCents / 100).toFixed(2)}</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Editar</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar servico</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <label className="label-base">Nome</label>
              <Input
                value={draft.name}
                onChange={(event) => setDraft({ ...draft, name: event.target.value })}
              />
              <label className="label-base">Duracao (min)</label>
              <Input
                type="number"
                value={draft.durationMinutes}
                onChange={(event) =>
                  setDraft({ ...draft, durationMinutes: Number(event.target.value) })
                }
              />
              <label className="label-base">Preco</label>
              <Input
                type="number"
                step="0.01"
                value={(draft.priceCents / 100).toFixed(2)}
                onChange={(event) =>
                  setDraft({ ...draft, priceCents: Math.round(Number(event.target.value) * 100) })
                }
              />
              <label className="label-base">Descricao</label>
              <Textarea
                value={draft.description ?? ""}
                onChange={(event) => setDraft({ ...draft, description: event.target.value })}
              />
              <Button
                onClick={() => {
                  onSave(service.id, draft);
                  setOpen(false);
                }}
              >
                Salvar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
}
