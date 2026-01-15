import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function SuccessPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ bookingId?: string }>;
}) {
  const { slug } = await params;
  const { bookingId } = await searchParams;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Agendamento confirmado</h1>
      <p className="text-sm text-slate-600">
        Seu agendamento foi registrado com sucesso. Codigo: {bookingId ?? "-"}
      </p>
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href={`/${slug}/agendamentos`}>Ver meus agendamentos</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={`/${slug}/agendar`}>Novo agendamento</Link>
        </Button>
      </div>
    </div>
  );
}
