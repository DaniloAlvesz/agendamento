"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export type BlockItem = {
  id: string;
  startAt: string;
  endAt: string;
  reason: string | null;
};

export function BlocksManager({ blocks }: { blocks: BlockItem[] }) {
  const [items, setItems] = useState(blocks);
  const [loading, setLoading] = useState(false);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const payload = {
      startAt: String(form.get("startAt")),
      endAt: String(form.get("endAt")),
      reason: String(form.get("reason") || "")
    };

    const response = await fetch("/api/blocks/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const data = await response.json();
      setItems((prev) => [
        ...prev,
        { id: data.id, startAt: payload.startAt, endAt: payload.endAt, reason: payload.reason }
      ]);
      event.currentTarget.reset();
    }

    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <h2 className="text-lg font-semibold">Adicionar bloqueio</h2>
        <form onSubmit={handleCreate} className="mt-3 grid gap-3">
          <Input name="startAt" type="datetime-local" required />
          <Input name="endAt" type="datetime-local" required />
          <Textarea name="reason" placeholder="Motivo" />
          <Button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </form>
      </Card>

      <div className="grid gap-3">
        {items.map((block) => (
          <Card key={block.id} className="p-4">
            <p className="text-sm font-semibold">{block.startAt} - {block.endAt}</p>
            <p className="text-xs text-slate-500">{block.reason ?? ""}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
