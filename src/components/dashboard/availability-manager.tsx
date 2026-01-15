"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const week = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

export type AvailabilityRule = {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  breakStart: string | null;
  breakEnd: string | null;
  intervalMinutes: number;
};

export function AvailabilityManager({ rules }: { rules: AvailabilityRule[] }) {
  const [items, setItems] = useState(rules);
  const [loading, setLoading] = useState(false);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const payload = {
      dayOfWeek: Number(form.get("dayOfWeek")),
      startTime: String(form.get("startTime")),
      endTime: String(form.get("endTime")),
      breakStart: String(form.get("breakStart") || ""),
      breakEnd: String(form.get("breakEnd") || ""),
      intervalMinutes: Number(form.get("intervalMinutes"))
    };

    const response = await fetch("/api/availability/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const data = await response.json();
      setItems((prev) => [
        ...prev,
        {
          id: data.id,
          dayOfWeek: payload.dayOfWeek,
          startTime: payload.startTime,
          endTime: payload.endTime,
          breakStart: payload.breakStart || null,
          breakEnd: payload.breakEnd || null,
          intervalMinutes: payload.intervalMinutes
        }
      ]);
      event.currentTarget.reset();
    }

    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <h2 className="text-lg font-semibold">Adicionar regra</h2>
        <form onSubmit={handleCreate} className="mt-3 grid gap-3 md:grid-cols-2">
          <select name="dayOfWeek" className="input-base" required>
            {week.map((label, index) => (
              <option key={label} value={index}>
                {label}
              </option>
            ))}
          </select>
          <Input name="startTime" type="time" required />
          <Input name="endTime" type="time" required />
          <Input name="breakStart" type="time" />
          <Input name="breakEnd" type="time" />
          <Input name="intervalMinutes" type="number" defaultValue={15} required />
          <div className="md:col-span-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </Card>

      <div className="grid gap-3">
        {items.map((rule) => (
          <Card key={rule.id} className="p-4">
            <p className="text-sm font-semibold">
              {week[rule.dayOfWeek]}: {rule.startTime} - {rule.endTime}
            </p>
            <p className="text-xs text-slate-500">
              Intervalo {rule.intervalMinutes} min {rule.breakStart && rule.breakEnd ? `• Pausa ${rule.breakStart}-${rule.breakEnd}` : ""}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
