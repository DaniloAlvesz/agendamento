"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      password: String(form.get("password") || ""),
      professionalCode: String(form.get("professionalCode") || "")
    };

    const response = await fetch("/api/customer/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      setError("Nao foi possivel concluir o cadastro.");
      setLoading(false);
      return;
    }

    if (payload.password) {
      await signIn("customer-password", {
        email: payload.email,
        password: payload.password,
        callbackUrl: "/"
      });
    } else {
      window.location.href = "/auth/verificar";
    }

    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">Criar conta</h1>
        <p className="text-sm text-slate-600">Cadastre-se para agendar com sua profissional.</p>
      </header>

      <Card className="p-5">
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="label-base">Nome completo</label>
          <Input name="name" required />
          <label className="label-base">Email</label>
          <Input name="email" type="email" required />
          <label className="label-base">WhatsApp</label>
          <Input name="phone" inputMode="tel" required />
          <label className="label-base">Senha</label>
          <Input name="password" type="password" />
          <label className="label-base">Codigo da profissional</label>
          <Input name="professionalCode" placeholder="maria-nails" />

          {error && <p className="text-sm text-rose-600">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Salvando..." : "Criar conta"}
          </Button>
        </form>
      </Card>

      <div className="text-center text-sm text-slate-600">
        Ja tem conta?{" "}
        <Link className="text-brand-700" href="/auth/login">
          Fazer login
        </Link>
      </div>
    </div>
  );
}
