import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { isLocale } from "@/lib/i18n";

export default async function RootPage() {
  const cookieStore = await cookies();
  const stored = cookieStore.get("le-locale")?.value;
  if (stored && isLocale(stored)) redirect(`/${stored}`);

  const headerStore = await headers();
  const acceptsItalian = headerStore.get("accept-language")?.toLowerCase().includes("it");
  redirect(acceptsItalian ? "/it" : "/en");
}
