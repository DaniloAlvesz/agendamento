"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("PROFESSIONAL");

  async function handleCredentials(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");

    await signIn("credentials", {
      email,
      password,
      role,
      callbackUrl: role === "ADMIN" ? "/admin" : "/dashboard"
    });
    setLoading(false);
  }

  async function handleCustomerLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");

    await signIn("customer-password", {
      email,
      password,
      callbackUrl: "/"
    });
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">Entrar</h1>
        <p className="text-sm text-slate-600">Acesse sua conta profissional ou cliente.</p>
      </header>

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold">Profissional ou Admin</h2>
          <p className="text-sm text-slate-600">Use seu email e senha.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCredentials} className="space-y-3">
            <label className="label-base">Email</label>
            <Input name="email" type="email" placeholder="seu@email.com" required />
            <label className="label-base">Senha</label>
            <Input name="password" type="password" required />
            <label className="label-base">Perfil</label>
            <select
              name="role"
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="input-base"
            >
              <option value="PROFESSIONAL">Profissional</option>
              <option value="ADMIN">Admin</option>
            </select>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold">Cliente</h2>
          <p className="text-sm text-slate-600">Use email e senha.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCustomerLogin} className="space-y-3">
            <label className="label-base">Email</label>
            <Input name="email" type="email" placeholder="cliente@email.com" required />
            <label className="label-base">Senha</label>
            <Input name="password" type="password" required />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
          <div className="mt-3 text-sm text-slate-600">
            Ainda nao tem conta?{" "}
            <Link className="text-brand-700" href="/auth/register">
              Fazer cadastro
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold">Cliente via codigo</h2>
          <p className="text-sm text-slate-600">Receba um codigo por email.</p>
        </CardHeader>
        <CardContent>
          <Link className="text-sm text-brand-700" href="/auth/verificar">
            Solicitar codigo
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
