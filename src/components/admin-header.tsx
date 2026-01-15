import Link from "next/link";

export function AdminHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/admin" className="text-base font-semibold text-slate-900">
          Admin
        </Link>
        <nav className="flex items-center gap-3 text-sm text-slate-600">
          <Link href="/admin/profissionais">Profissionais</Link>
        </nav>
      </div>
    </header>
  );
}
