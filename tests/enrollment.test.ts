import { describe, expect, it } from "vitest";
import {
  canContinue,
  createClientId,
  createInitialDraft,
  getEnrollmentSteps,
  parseStoredDraft,
  sanitizeProgramChange,
  toDossierSnapshot,
} from "@/lib/enrollment";

describe("enrollment contract", () => {
  it("creates a stable six-digit client reference", () => {
    expect(createClientId(30319)).toBe("LE-030319");
    expect(createClientId(1_234_567)).toBe("LE-234567");
  });

  it("adds dream steps only for Lucid Dream", () => {
    const quiet = createInitialDraft("LE-000001");
    expect(getEnrollmentSteps(quiet)).not.toContain("splice");
    const lucid = sanitizeProgramChange(quiet, "lucid_dream");
    expect(getEnrollmentSteps(lucid)).toEqual([
      "intro", "identity", "preservation", "lucid", "splice", "dream", "support", "review",
    ]);
  });

  it("clears dream-only data when returning to quiet suspension", () => {
    const draft = {
      ...createInitialDraft("LE-000002"),
      program: "lucid_dream" as const,
      spliceAnchor: "A summer morning",
      environment: "coast" as const,
      tone: "serene" as const,
    };
    const quiet = sanitizeProgramChange(draft, "preservation");
    expect(quiet.spliceAnchor).toBe("");
    expect(quiet.environment).toBeNull();
    expect(quiet.tone).toBeNull();
  });

  it("validates the conditional steps and final acknowledgement", () => {
    const draft = sanitizeProgramChange(createInitialDraft("LE-000003"), "lucid_dream");
    expect(canContinue(draft, "splice")).toBe(false);
    expect(canContinue({ ...draft, spliceAnchor: "The morning after" }, "splice")).toBe(true);
    expect(canContinue(draft, "dream")).toBe(false);
    expect(canContinue({ ...draft, environment: "city", tone: "familiar" }, "dream")).toBe(true);
    expect(canContinue(draft, "review")).toBe(false);
  });

  it("rejects corrupt stored sessions", () => {
    expect(parseStoredDraft("not-json")).toBeNull();
    expect(parseStoredDraft(JSON.stringify({ version: 2 }))).toBeNull();
  });

  it("derives the dossier without a second business model", () => {
    const draft = {
      ...sanitizeProgramChange(createInitialDraft("LE-000004"), "lucid_dream"),
      spliceAnchor: "A clear morning",
      environment: "garden" as const,
      tone: "vivid" as const,
      archiveEnabled: true,
    };
    const snapshot = toDossierSnapshot(draft, "2101-01-01T00:00:00.000Z");
    expect(snapshot.addOns).toEqual(["memory_splice", "dream_architecture", "life_archive"]);
    expect(snapshot.spliceAnchor).toBe("A clear morning");
  });
});
