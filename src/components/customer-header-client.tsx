"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export function CustomerHeaderClient({ slug, isLoggedIn }: { slug: string; isLoggedIn: boolean }) {
  const pathname = usePathname();

  const items = [
    { href: `/${slug}`, label: "Inicio" },
    { href: `/${slug}/agendar`, label: "Agendar" },
    { href: `/${slug}/agendamentos`, label: "Meus agendamentos" }
  ];

  if (!isLoggedIn) {
    items.push({ href: "/auth/login", label: "Entrar" });
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-3">
        <Link href={`/${slug}`} className="text-base font-semibold text-slate-900">
          {slug.replace(/-/g, " ")}
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
                <Link
                  href={item.href}
                  className={pathname === item.href ? "text-brand-700" : undefined}
                >
                  {item.label}
                </Link>
              </DropdownMenuItem>
            ))}
            {isLoggedIn && (
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  signOut({ callbackUrl: "/" });
                }}
              >
                Encerrar sessao
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
