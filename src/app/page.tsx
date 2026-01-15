import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-[100dvh] px-4 py-10">
      <section className="mx-auto flex max-w-xl flex-col gap-4">
        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <h1 className="text-2xl font-semibold">Agendamento Nails</h1>
          <p className="mt-2 text-sm text-slate-600">
            Este sistema e acessado por link individual da profissional. Use o link recebido via WhatsApp ou Instagram.
          </p>
          <Link className="mt-4 inline-flex text-sm font-semibold text-brand-700" href="/maria-nails">
            Abrir exemplo: /maria-nails
          </Link>
        </div>
      </section>
    </main>
  );
}
