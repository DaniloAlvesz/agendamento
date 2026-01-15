import { ReactNode } from "react";
import { AdminHeader } from "@/components/admin-header";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh]">
      <AdminHeader />
      <main className="mx-auto w-full max-w-5xl px-4 pt-3 pb-[calc(2.5rem+env(safe-area-inset-bottom))]">
        {children}
      </main>
    </div>
  );
}
