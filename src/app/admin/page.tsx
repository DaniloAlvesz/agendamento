import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function AdminPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <Card className="p-5">
        <p className="text-sm text-slate-600">Gerencie profissionais e configuracoes.</p>
        <Link className="text-sm text-brand-700" href="/admin/profissionais">
          Ir para profissionais
        </Link>
      </Card>
    </div>
  );
}
