import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EnrollmentWizard } from "@/components/enrollment/enrollment-wizard";
import { PageIntro } from "@/components/page-intro";
import { getCopy, isLocale } from "@/lib/i18n";
import { createLocalizedMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = getCopy(locale);
  return createLocalizedMetadata(locale, copy.nav.enroll, copy.enroll.intro, "/enroll");
}

export default async function EnrollmentPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = getCopy(locale);
  return (
    <>
      <PageIntro eyebrow={copy.enroll.eyebrow} title={copy.enroll.title} intro={copy.enroll.intro} />
      <EnrollmentWizard copy={copy} />
    </>
  );
}
