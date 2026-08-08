export const locales = ["en", "it"] as const;
export type Locale = (typeof locales)[number];

export const catalogueIds = [
  "suspension",
  "lucidDream",
  "memorySplice",
  "dreamArchitecture",
  "lifeArchive",
] as const;

export type CatalogueId = (typeof catalogueIds)[number];
export type ProgramId = "preservation" | "lucid_dream";
export type AddOnId = "memory_splice" | "dream_architecture" | "life_archive";
export type EnvironmentId = "coast" | "city" | "garden";
export type ToneId = "serene" | "vivid" | "familiar";
export type SupportMode = "guided" | "silent";

export type EnrollmentStep =
  | "intro"
  | "identity"
  | "preservation"
  | "lucid"
  | "splice"
  | "dream"
  | "support"
  | "review";

export interface EnrollmentDraft {
  version: 1;
  clientId: string;
  displayName: string;
  program: ProgramId;
  spliceAnchor: string;
  environment: EnvironmentId | null;
  tone: ToneId | null;
  supportMode: SupportMode;
  archiveEnabled: boolean;
  acknowledged: boolean;
  currentStep: EnrollmentStep;
}

export interface DossierSnapshot {
  clientId: string;
  displayName: string;
  program: ProgramId;
  addOns: AddOnId[];
  spliceAnchor: string | null;
  environment: EnvironmentId | null;
  tone: ToneId | null;
  supportMode: SupportMode;
  createdAt: string;
}

export interface CatalogueCopy {
  name: string;
  eyebrow: string;
  summary: string;
  detail: string;
}

export interface SiteCopy {
  brand: {
    corporation: string;
    strapline: string;
    system: string;
  };
  nav: {
    home: string;
    plans: string;
    how: string;
    about: string;
    faq: string;
    enroll: string;
    language: string;
    menu: string;
  };
  common: {
    learnMore: string;
    begin: string;
    explorePlans: string;
    included: string;
    canon: string;
    expanded: string;
    back: string;
    continue: string;
    reset: string;
    optional: string;
  };
  home: {
    eyebrow: string;
    title: string;
    intro: string;
    assurance: string;
    futureEyebrow: string;
    futureTitle: string;
    futureBody: string;
    processEyebrow: string;
    processTitle: string;
    process: Array<{ number: string; title: string; body: string }>;
    bennyEyebrow: string;
    bennyTitle: string;
    bennyBody: string;
    finalTitle: string;
    finalBody: string;
  };
  plans: {
    eyebrow: string;
    title: string;
    intro: string;
    coreTitle: string;
    modulesTitle: string;
    includedTitle: string;
    includedItems: Array<{ title: string; body: string }>;
    note: string;
  };
  catalogue: Record<CatalogueId, CatalogueCopy>;
  how: {
    eyebrow: string;
    title: string;
    intro: string;
    steps: Array<{ number: string; title: string; body: string }>;
    specs: Array<{ value: string; label: string }>;
    lucidEyebrow: string;
    lucidTitle: string;
    lucidBody: string;
  };
  about: {
    eyebrow: string;
    title: string;
    intro: string;
    storyTitle: string;
    storyBody: string[];
    principlesTitle: string;
    principles: Array<{ title: string; body: string }>;
  };
  faq: {
    eyebrow: string;
    title: string;
    intro: string;
    items: Array<{ question: string; answer: string }>;
  };
  enroll: {
    eyebrow: string;
    title: string;
    intro: string;
    privateNote: string;
    progress: string;
    steps: Record<EnrollmentStep, string>;
    introTitle: string;
    introBody: string;
    identityTitle: string;
    identityBody: string;
    nameLabel: string;
    namePlaceholder: string;
    preservationTitle: string;
    preservationBody: string;
    preservationFact: string;
    lucidTitle: string;
    lucidBody: string;
    preservationOnly: string;
    preservationOnlyBody: string;
    lucidOption: string;
    lucidOptionBody: string;
    spliceTitle: string;
    spliceBody: string;
    spliceLabel: string;
    splicePlaceholder: string;
    dreamTitle: string;
    dreamBody: string;
    environmentLabel: string;
    environments: Record<EnvironmentId, string>;
    toneLabel: string;
    tones: Record<ToneId, string>;
    supportTitle: string;
    supportBody: string;
    supportLabel: string;
    supportModes: Record<SupportMode, { title: string; body: string }>;
    archiveLabel: string;
    archiveBody: string;
    reviewTitle: string;
    reviewBody: string;
    programLabel: string;
    addOnsLabel: string;
    supportSummary: string;
    none: string;
    consent: string;
    download: string;
    downloading: string;
    downloaded: string;
    downloadError: string;
    requiredError: string;
    techOnline: string;
    specimen: string;
  };
  footer: {
    promise: string;
    disclaimer: string;
    privacy: string;
  };
}
