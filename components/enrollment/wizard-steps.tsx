import type {
  EnrollmentDraft,
  EnrollmentStep,
  EnvironmentId,
  ProgramId,
  SiteCopy,
  SupportMode,
  ToneId,
} from "@/lib/types";
import styles from "./wizard.module.css";

interface StepContentProps {
  step: EnrollmentStep;
  draft: EnrollmentDraft;
  copy: SiteCopy;
  error: string;
  update: (patch: Partial<EnrollmentDraft>) => void;
  changeProgram: (program: ProgramId) => void;
}

interface ChoiceProps {
  name: string;
  value: string;
  checked: boolean;
  title: string;
  body?: string;
  onChange: () => void;
}

function Choice({ name, value, checked, title, body, onChange }: ChoiceProps) {
  return (
    <label className={styles.choice} data-selected={checked}>
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} />
      <span className={styles.choiceMark} aria-hidden="true" />
      <span><strong>{title}</strong>{body && <small>{body}</small>}</span>
    </label>
  );
}

function StepHeader({ title, body }: { title: string; body: string }) {
  return <div className={styles.stepHeader}><h2>{title}</h2><p>{body}</p></div>;
}

function OptionGroup<T extends string>({
  label,
  name,
  values,
  labels,
  selected,
  onSelect,
}: {
  label: string;
  name: string;
  values: readonly T[];
  labels: Record<T, string>;
  selected: T | null;
  onSelect: (value: T) => void;
}) {
  return (
    <fieldset className={styles.fieldset}>
      <legend>{label}</legend>
      <div className={styles.compactChoices}>
        {values.map((value) => (
          <Choice key={value} name={name} value={value} title={labels[value]} checked={selected === value} onChange={() => onSelect(value)} />
        ))}
      </div>
    </fieldset>
  );
}

function Review({ draft, copy, update }: Pick<StepContentProps, "draft" | "copy" | "update">) {
  const program = draft.program === "lucid_dream" ? copy.catalogue.lucidDream.name : copy.enroll.preservationOnly;
  const modules = [
    ...(draft.program === "lucid_dream" ? [copy.catalogue.memorySplice.name, copy.catalogue.dreamArchitecture.name] : []),
    ...(draft.archiveEnabled ? [copy.catalogue.lifeArchive.name] : []),
  ];
  return (
    <div className={styles.review}>
      <StepHeader title={copy.enroll.reviewTitle} body={copy.enroll.reviewBody} />
      <div className={styles.dossierHeader}>
        <span>{draft.clientId}</span><span>{copy.enroll.specimen}</span>
      </div>
      <dl className={styles.summaryList}>
        <div><dt>{copy.enroll.programLabel}</dt><dd>{program}</dd></div>
        <div><dt>{copy.enroll.addOnsLabel}</dt><dd>{modules.length ? modules.join(" · ") : copy.enroll.none}</dd></div>
        {draft.spliceAnchor && <div><dt>{copy.enroll.spliceLabel}</dt><dd>{draft.spliceAnchor}</dd></div>}
        <div><dt>{copy.enroll.supportSummary}</dt><dd>{copy.enroll.supportModes[draft.supportMode].title}</dd></div>
      </dl>
      <label className={styles.consent}>
        <input type="checkbox" checked={draft.acknowledged} onChange={(event) => update({ acknowledged: event.target.checked })} />
        <span>{copy.enroll.consent}</span>
      </label>
    </div>
  );
}

export function StepContent({ step, draft, copy, error, update, changeProgram }: StepContentProps) {
  let content: React.ReactNode;

  if (step === "intro") {
    content = <><StepHeader title={copy.enroll.introTitle} body={copy.enroll.introBody} /><div className={styles.protocolStamp}><span>LE</span><p>{copy.enroll.privateNote}</p></div></>;
  } else if (step === "identity") {
    content = <><StepHeader title={copy.enroll.identityTitle} body={copy.enroll.identityBody} /><label className={styles.textField}><span>{copy.enroll.nameLabel} <em>{copy.common.optional}</em></span><input autoComplete="name" maxLength={80} value={draft.displayName} placeholder={copy.enroll.namePlaceholder} onChange={(event) => update({ displayName: event.target.value })} /></label></>;
  } else if (step === "preservation") {
    content = <><StepHeader title={copy.enroll.preservationTitle} body={copy.enroll.preservationBody} /><div className={styles.confirmedProtocol}><div><span aria-hidden="true">✓</span><strong>{copy.catalogue.suspension.name}</strong></div><p>−196 °C</p></div><p className={styles.machineNote}>{copy.enroll.preservationFact}</p></>;
  } else if (step === "lucid") {
    content = <><StepHeader title={copy.enroll.lucidTitle} body={copy.enroll.lucidBody} /><fieldset className={styles.fieldset}><legend className="sr-only">{copy.enroll.programLabel}</legend><div className={styles.choiceGrid}><Choice name="program" value="preservation" checked={draft.program === "preservation"} title={copy.enroll.preservationOnly} body={copy.enroll.preservationOnlyBody} onChange={() => changeProgram("preservation")} /><Choice name="program" value="lucid_dream" checked={draft.program === "lucid_dream"} title={copy.enroll.lucidOption} body={copy.enroll.lucidOptionBody} onChange={() => changeProgram("lucid_dream")} /></div></fieldset></>;
  } else if (step === "splice") {
    content = <><StepHeader title={copy.enroll.spliceTitle} body={copy.enroll.spliceBody} /><label className={styles.textField}><span>{copy.enroll.spliceLabel}</span><textarea maxLength={120} rows={3} value={draft.spliceAnchor} placeholder={copy.enroll.splicePlaceholder} onChange={(event) => update({ spliceAnchor: event.target.value })} /><small>{draft.spliceAnchor.length} / 120</small></label></>;
  } else if (step === "dream") {
    content = <><StepHeader title={copy.enroll.dreamTitle} body={copy.enroll.dreamBody} /><OptionGroup<EnvironmentId> label={copy.enroll.environmentLabel} name="environment" values={["coast", "city", "garden"]} labels={copy.enroll.environments} selected={draft.environment} onSelect={(environment) => update({ environment })} /><OptionGroup<ToneId> label={copy.enroll.toneLabel} name="tone" values={["serene", "vivid", "familiar"]} labels={copy.enroll.tones} selected={draft.tone} onSelect={(tone) => update({ tone })} /></>;
  } else if (step === "support") {
    content = <><StepHeader title={copy.enroll.supportTitle} body={copy.enroll.supportBody} /><fieldset className={styles.fieldset}><legend>{copy.enroll.supportLabel}</legend><div className={styles.choiceGrid}>{(["guided", "silent"] as SupportMode[]).map((mode) => <Choice key={mode} name="support" value={mode} checked={draft.supportMode === mode} title={copy.enroll.supportModes[mode].title} body={copy.enroll.supportModes[mode].body} onChange={() => update({ supportMode: mode })} />)}</div></fieldset><label className={styles.archiveToggle} data-selected={draft.archiveEnabled}><input type="checkbox" checked={draft.archiveEnabled} onChange={(event) => update({ archiveEnabled: event.target.checked })} /><span><strong>{copy.enroll.archiveLabel}</strong><small>{copy.enroll.archiveBody}</small></span></label></>;
  } else {
    content = <Review draft={draft} copy={copy} update={update} />;
  }

  return <div className={styles.stepContent}>{content}{error && <p className={styles.error} role="alert">{error}</p>}</div>;
}
