"use client";

import { useEffect, useMemo, useReducer, useState } from "react";
import {
  STORAGE_KEY,
  canContinue,
  createInitialDraft,
  getEnrollmentSteps,
  parseStoredDraft,
  sanitizeProgramChange,
  toDossierSnapshot,
} from "@/lib/enrollment";
import type { EnrollmentDraft, ProgramId, SiteCopy } from "@/lib/types";
import { StepContent } from "./wizard-steps";
import styles from "./wizard.module.css";

type Action =
  | { type: "patch"; patch: Partial<EnrollmentDraft> }
  | { type: "replace"; draft: EnrollmentDraft }
  | { type: "program"; program: ProgramId };

function reducer(draft: EnrollmentDraft, action: Action): EnrollmentDraft {
  if (action.type === "replace") return action.draft;
  if (action.type === "program") return sanitizeProgramChange(draft, action.program);
  return { ...draft, ...action.patch };
}

function initializeDraft(): EnrollmentDraft {
  if (typeof window === "undefined") return createInitialDraft("LE-000000");
  const stored = parseStoredDraft(sessionStorage.getItem(STORAGE_KEY));
  const next = stored ?? createInitialDraft();
  if (!getEnrollmentSteps(next).includes(next.currentStep)) next.currentStep = "intro";
  return next;
}

export function EnrollmentWizard({ copy }: { copy: SiteCopy }) {
  const [draft, dispatch] = useReducer(reducer, undefined, initializeDraft);
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState("");
  const [downloadState, setDownloadState] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    queueMicrotask(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (hydrated) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [draft, hydrated]);

  const steps = useMemo(() => getEnrollmentSteps(draft), [draft]);
  const currentIndex = Math.max(0, steps.indexOf(draft.currentStep));
  const progress = ((currentIndex + 1) / steps.length) * 100;
  const isReview = draft.currentStep === "review";

  const update = (patch: Partial<EnrollmentDraft>) => {
    setError("");
    setDownloadState("idle");
    dispatch({ type: "patch", patch });
  };

  const changeProgram = (program: ProgramId) => {
    setError("");
    dispatch({ type: "program", program });
  };

  const move = (direction: -1 | 1) => {
    if (direction === 1 && !canContinue(draft, draft.currentStep)) {
      setError(copy.enroll.requiredError);
      return;
    }
    const target = steps[currentIndex + direction];
    if (target) update({ currentStep: target });
  };

  const reset = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    dispatch({ type: "replace", draft: createInitialDraft() });
    setDownloadState("idle");
    setError("");
  };

  const download = async () => {
    if (!canContinue(draft, "review")) {
      setError(copy.enroll.requiredError);
      return;
    }
    setDownloadState("loading");
    try {
      const { downloadDossier } = await import("./dossier-document");
      await downloadDossier(toDossierSnapshot(draft));
      setDownloadState("success");
    } catch {
      setDownloadState("error");
    }
  };

  if (!hydrated) {
    return <div className={styles.loading} aria-label="Loading private proposal"><span /><span /><span /></div>;
  }

  const statusMessage = downloadState === "success" ? copy.enroll.downloaded : downloadState === "error" ? copy.enroll.downloadError : "";

  return (
    <section className={styles.wizard} data-lucid={draft.program === "lucid_dream"} data-review={isReview}>
      <aside className={styles.sidebar}>
        <div className={styles.clientBlock}><span>CLIENT REFERENCE</span><strong>{draft.clientId}</strong></div>
        <div className={styles.progressLabel}><span>{copy.enroll.progress}</span><span>{currentIndex + 1}/{steps.length}</span></div>
        <div className={styles.progressTrack}><span style={{ width: `${progress}%` }} /></div>
        <ol className={styles.stepList}>
          {steps.map((step, index) => <li key={step} data-active={step === draft.currentStep} data-complete={index < currentIndex}><span>{String(index + 1).padStart(2, "0")}</span>{copy.enroll.steps[step]}</li>)}
        </ol>
        {draft.program === "lucid_dream" && <div className={styles.techStatus}><span className={styles.techDot} /><div><strong>{copy.enroll.techOnline}</strong><small>CHANNEL 30319 / STABLE</small></div></div>}
      </aside>

      <div className={styles.workspace}>
        <div className={styles.workspaceTop}><span>{copy.enroll.specimen}</span><button type="button" onClick={reset}>{copy.common.reset}</button></div>
        <StepContent step={draft.currentStep} draft={draft} copy={copy} error={error} update={update} changeProgram={changeProgram} />
        <div className={styles.navigation}>
          {currentIndex > 0 ? <button className="button-secondary" type="button" onClick={() => move(-1)}>{copy.common.back}</button> : <span />}
          {isReview ? <button className="button-primary" type="button" disabled={downloadState === "loading"} onClick={download}>{downloadState === "loading" ? copy.enroll.downloading : copy.enroll.download}</button> : <button className="button-primary" type="button" onClick={() => move(1)}>{copy.common.continue} <span aria-hidden="true">→</span></button>}
        </div>
        <p className={styles.downloadStatus} role="status" aria-live="polite">{statusMessage}</p>
      </div>
    </section>
  );
}
