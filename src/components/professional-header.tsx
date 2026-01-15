"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const items = [
  { href: "/dashboard", label: "Visao geral" },
  { href: "/dashboard/agenda", label: "Agenda" },
  { href: "/dashboard/servicos", label: "Servicos" },
  { href: "/dashboard/disponibilidade", label: "Disponibilidade" },
  { href: "/dashboard/bloqueios", label: "Bloqueios" },
  { href: "/dashboard/clientes", label: "Clientes" },
  { href: "/dashboard/configuracoes", label: "Configuracoes" }
];

export function ProfessionalHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/dashboard" className="text-base font-semibold text-slate-900">
          Painel profissional
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Abrir menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <Menu className="h-5 w-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {items.map((item) => (
              <DropdownMenuItem key={item.href} asChild>
                <Link href={item.href}>{item.label}</Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
