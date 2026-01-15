import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/server/db";
import { CustomerHeader } from "@/components/customer-header";

export default async function SlugLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slug) notFound();
  const professional = await prisma.professionalProfile.findUnique({
    where: { slug }
  });

  if (!professional) notFound();

  return (
    <div className="min-h-[100dvh]">
      <CustomerHeader slug={slug} />
      <main className="mx-auto w-full max-w-3xl px-4 pt-2 pb-[calc(2.5rem+env(safe-area-inset-bottom))]">
        {children}
      </main>
    </div>
  );
}
