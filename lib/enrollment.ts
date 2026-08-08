import { z } from "zod";
import type {
  AddOnId,
  DossierSnapshot,
  EnrollmentDraft,
  EnrollmentStep,
} from "@/lib/types";

export const STORAGE_KEY = "le-enrollment-v1";

export const enrollmentSchema = z.object({
  version: z.literal(1),
  clientId: z.string().regex(/^LE-\d{6}$/),
  displayName: z.string().max(80),
  program: z.enum(["preservation", "lucid_dream"]),
  spliceAnchor: z.string().max(120),
  environment: z.enum(["coast", "city", "garden"]).nullable(),
  tone: z.enum(["serene", "vivid", "familiar"]).nullable(),
  supportMode: z.enum(["guided", "silent"]),
  archiveEnabled: z.boolean(),
  acknowledged: z.boolean(),
  currentStep: z.enum([
    "intro",
    "identity",
    "preservation",
    "lucid",
    "splice",
    "dream",
    "support",
    "review",
  ]),
});

export function createClientId(randomValue?: number): string {
  const value = randomValue ?? globalThis.crypto?.getRandomValues(new Uint32Array(1))[0] ?? Date.now();
  return `LE-${String(value % 1_000_000).padStart(6, "0")}`;
}

export function createInitialDraft(clientId = createClientId()): EnrollmentDraft {
  return {
    version: 1,
    clientId,
    displayName: "",
    program: "preservation",
    spliceAnchor: "",
    environment: null,
    tone: null,
    supportMode: "guided",
    archiveEnabled: false,
    acknowledged: false,
    currentStep: "intro",
  };
}

export function parseStoredDraft(value: string | null): EnrollmentDraft | null {
  if (!value) return null;
  try {
    return enrollmentSchema.parse(JSON.parse(value));
  } catch {
    return null;
  }
}

export function getEnrollmentSteps(draft: EnrollmentDraft): EnrollmentStep[] {
  const base: EnrollmentStep[] = ["intro", "identity", "preservation", "lucid"];
  if (draft.program === "lucid_dream") base.push("splice", "dream");
  base.push("support", "review");
  return base;
}

export function sanitizeProgramChange(
  draft: EnrollmentDraft,
  program: EnrollmentDraft["program"],
): EnrollmentDraft {
  if (program === "lucid_dream") return { ...draft, program };
  return {
    ...draft,
    program,
    spliceAnchor: "",
    environment: null,
    tone: null,
  };
}

export function canContinue(draft: EnrollmentDraft, step: EnrollmentStep): boolean {
  if (step === "splice") return draft.spliceAnchor.trim().length > 0;
  if (step === "dream") return draft.environment !== null && draft.tone !== null;
  if (step === "review") return draft.acknowledged;
  return true;
}

export function toDossierSnapshot(
  draft: EnrollmentDraft,
  createdAt = new Date().toISOString(),
): DossierSnapshot {
  const addOns: AddOnId[] = [];
  if (draft.program === "lucid_dream") {
    addOns.push("memory_splice", "dream_architecture");
  }
  if (draft.archiveEnabled) addOns.push("life_archive");

  return {
    clientId: draft.clientId,
    displayName: draft.displayName.trim(),
    program: draft.program,
    addOns,
    spliceAnchor: draft.program === "lucid_dream" ? draft.spliceAnchor.trim() : null,
    environment: draft.program === "lucid_dream" ? draft.environment : null,
    tone: draft.program === "lucid_dream" ? draft.tone : null,
    supportMode: draft.supportMode,
    createdAt,
  };
}
