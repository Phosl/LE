"use client";

import { Document, Page, StyleSheet, Text, View, pdf } from "@react-pdf/renderer";
import { getCopy } from "@/lib/i18n";
import type { AddOnId, DossierSnapshot, Locale } from "@/lib/types";

const styles = StyleSheet.create({
  page: { padding: 54, backgroundColor: "#F6F4EF", color: "#17191F", fontFamily: "Helvetica", fontSize: 10 },
  cover: { padding: 54, backgroundColor: "#2437A5", color: "#FFFFFF", justifyContent: "space-between" },
  mark: { width: 64, height: 64, backgroundColor: "#FFFFFF", color: "#2437A5", fontFamily: "Times-Roman", fontSize: 27, textAlign: "center", paddingTop: 17 },
  overline: { fontSize: 7, letterSpacing: 2, textTransform: "uppercase", color: "#7A8090" },
  coverOverline: { fontSize: 7, letterSpacing: 2, textTransform: "uppercase", color: "#C4CCF2" },
  coverTitle: { marginTop: 28, maxWidth: 440, fontFamily: "Times-Roman", fontSize: 48, lineHeight: 1.02 },
  coverBottom: { borderTop: "1px solid #7784D1", paddingTop: 18, flexDirection: "row", justifyContent: "space-between" },
  coverRef: { fontSize: 18 },
  coverFine: { width: 220, color: "#C4CCF2", fontSize: 8, lineHeight: 1.5 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #CAC8C2", paddingBottom: 16 },
  miniMark: { width: 32, height: 32, backgroundColor: "#2437A5", color: "#FFFFFF", fontFamily: "Times-Roman", fontSize: 14, textAlign: "center", paddingTop: 8 },
  title: { marginTop: 45, marginBottom: 12, maxWidth: 460, fontFamily: "Times-Roman", fontSize: 34, lineHeight: 1.05 },
  intro: { maxWidth: 430, color: "#555A67", lineHeight: 1.6 },
  table: { marginTop: 42, borderTop: "1px solid #A7A6A1" },
  row: { flexDirection: "row", paddingVertical: 15, borderBottom: "1px solid #D6D3CC" },
  label: { width: "34%", color: "#777C87", fontSize: 7, letterSpacing: 1.3, textTransform: "uppercase" },
  value: { width: "66%", fontSize: 10, lineHeight: 1.5 },
  notice: { marginTop: "auto", padding: 18, backgroundColor: "#DCEAF5", color: "#2437A5", fontSize: 8, lineHeight: 1.55 },
});

const addOnCatalogue: Record<AddOnId, "memorySplice" | "dreamArchitecture" | "lifeArchive"> = {
  memory_splice: "memorySplice",
  dream_architecture: "dreamArchitecture",
  life_archive: "lifeArchive",
};

function DetailPage({ snapshot, locale }: { snapshot: DossierSnapshot; locale: Locale }) {
  const copy = getCopy(locale);
  const date = new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(new Date(snapshot.createdAt));
  const modules = snapshot.addOns.map((id) => copy.catalogue[addOnCatalogue[id]].name).join(" · ") || copy.enroll.none;
  const program = snapshot.program === "lucid_dream" ? copy.catalogue.lucidDream.name : copy.enroll.preservationOnly;
  const privateClient = locale === "it" ? "Cliente Privato" : "Private Client";
  const environment = snapshot.environment ? copy.enroll.environments[snapshot.environment] : "—";
  const tone = snapshot.tone ? copy.enroll.tones[snapshot.tone] : "—";
  const rows = [
    [locale === "it" ? "Cliente" : "Client", snapshot.displayName || privateClient],
    [locale === "it" ? "Riferimento" : "Reference", snapshot.clientId],
    [copy.enroll.programLabel, program],
    [copy.enroll.addOnsLabel, modules],
    [copy.enroll.spliceLabel, snapshot.spliceAnchor || "—"],
    [copy.enroll.environmentLabel, environment],
    [copy.enroll.toneLabel, tone],
    [copy.enroll.supportSummary, copy.enroll.supportModes[snapshot.supportMode].title],
    [locale === "it" ? "Data proposta" : "Proposal date", date],
  ];
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}><View style={styles.miniMark}><Text>LE</Text></View><Text style={styles.overline}>{locale === "it" ? "PROTOCOLLO DI CONTINUITÀ" : "CONTINUANCE PROTOCOL"}</Text></View>
      <Text style={styles.title}>{locale === "it" ? "La tua proposta Life Extension" : "Your Life Extension proposal"}</Text>
      <Text style={styles.intro}>{locale === "it" ? "Un riepilogo dimostrativo delle preferenze espresse in questa sessione privata." : "A specimen summary of the preferences expressed in this private session."}</Text>
      <View style={styles.table}>{rows.map(([label, value]) => <View style={styles.row} key={label}><Text style={styles.label}>{label}</Text><Text style={styles.value}>{value}</Text></View>)}</View>
      <Text style={styles.notice}>{copy.enroll.consent} {copy.footer.disclaimer}</Text>
    </Page>
  );
}

function DossierDocument({ snapshot }: { snapshot: DossierSnapshot }) {
  return (
    <Document title={`Life Extension ${snapshot.clientId}`} author="Life Extension Corporation — fictional specimen">
      <Page size="A4" style={styles.cover}>
        <View><View style={styles.mark}><Text>LE</Text></View><Text style={[styles.coverOverline, { marginTop: 28 }]}>LIFE EXTENSION CORPORATION / PRIVATE CLIENT SERVICES</Text><Text style={styles.coverTitle}>Life, part two.</Text></View>
        <View style={styles.coverBottom}><View><Text style={styles.coverOverline}>CLIENT REFERENCE</Text><Text style={styles.coverRef}>{snapshot.clientId}</Text></View><Text style={styles.coverFine}>SPECIMEN PROPOSAL / NON-BINDING FICTIONAL DOCUMENT / GENERATED LOCALLY / NO DATA TRANSMISSION</Text></View>
      </Page>
      <DetailPage snapshot={snapshot} locale="en" />
      <DetailPage snapshot={snapshot} locale="it" />
    </Document>
  );
}

export async function downloadDossier(snapshot: DossierSnapshot) {
  const blob = await pdf(<DossierDocument snapshot={snapshot} />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `life-extension-${snapshot.clientId}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
