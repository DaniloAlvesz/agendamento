import { auth } from "@/server/auth";
import { CustomerHeaderClient } from "@/components/customer-header-client";

export async function CustomerHeader({ slug }: { slug: string }) {
  const session = await auth();
  const isLoggedIn = Boolean(session?.user?.id);
  return <CustomerHeaderClient slug={slug} isLoggedIn={isLoggedIn} />;
}
