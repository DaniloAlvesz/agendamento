"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export function VerifyForm() {
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function requestCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "");

    const response = await fetch("/api/otp/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    if (!response.ok) {
      setError("Nao foi possivel enviar o codigo.");
    } else {
      setCodeSent(true);
    }

    setLoading(false);
  }

  async function handleVerify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "");
    const code = String(form.get("code") || "");

    await signIn("customer-otp", {
      email,
      code,
      callbackUrl: "/"
    });

    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">Verificar codigo</h1>
        <p className="text-sm text-slate-600">Receba um codigo rapido no seu email.</p>
      </header>

      <Card className="p-5">
        <form onSubmit={requestCode} className="space-y-3">
          <label className="label-base">Email</label>
          <Input name="email" type="email" required />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Enviando..." : "Enviar codigo"}
          </Button>
        </form>
      </Card>

      {codeSent && (
        <Card className="p-5">
          <form onSubmit={handleVerify} className="space-y-3">
            <label className="label-base">Email</label>
            <Input name="email" type="email" required />
            <label className="label-base">Codigo</label>
            <Input name="code" inputMode="numeric" required />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Confirmar"}
            </Button>
          </form>
        </Card>
      )}

      {error && <p className="text-center text-sm text-rose-600">{error}</p>}
    </div>
  );
}
