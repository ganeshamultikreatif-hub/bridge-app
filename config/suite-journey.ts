/**
 * GOnline product journey — end-of-page “next tab” chain.
 * Bridge (this app) is the WA step.
 */

export type SuiteJourneyId =
  | "wa"
  | "seo"
  | "meta"
  | "website-revamp"
  | "ecosystem";

export interface SuiteJourneyStep {
  id: SuiteJourneyId;
  label: string;
  shortLabel: string;
  description: string;
  /** Soft-handoff route inside Bridge, or null when this app is current. */
  href: string | null;
  /** External destination when leaving Bridge. */
  externalUrl: string | null;
}

export const SUITE_JOURNEY_STEPS: SuiteJourneyStep[] = [
  {
    id: "wa",
    label: "WA",
    shortLabel: "WA",
    description: "Bridge · WhatsApp engagement",
    href: null,
    externalUrl: null,
  },
  {
    id: "seo",
    label: "SEO",
    shortLabel: "SEO",
    description: "Search & organic growth",
    href: "/seo",
    externalUrl: "https://seo.gonline.id/",
  },
  {
    id: "meta",
    label: "META",
    shortLabel: "META",
    description: "Meta ads & social",
    href: "/meta",
    externalUrl: "https://meta.gonline.id/",
  },
  {
    id: "website-revamp",
    label: "Website Revamp",
    shortLabel: "Web",
    description: "Site redesign & conversion",
    href: "/website-revamp",
    externalUrl: "https://web.gonline.id/",
  },
  {
    id: "ecosystem",
    label: "Ecosystem",
    shortLabel: "Eco",
    description: "Full GOnline suite hub",
    href: "/ecosystem",
    externalUrl: "https://gonline.id/",
  },
];

/** This Bridge app sits on the WA step. */
export const SUITE_JOURNEY_CURRENT_ID: SuiteJourneyId = "wa";

export function getSuiteJourneyCurrentIndex(): number {
  return SUITE_JOURNEY_STEPS.findIndex(
    (step) => step.id === SUITE_JOURNEY_CURRENT_ID,
  );
}

export function getSuiteJourneyNextStep(): SuiteJourneyStep | null {
  const index = getSuiteJourneyCurrentIndex();
  if (index < 0) return null;
  return SUITE_JOURNEY_STEPS[index + 1] ?? null;
}

/** Paths that already are suite handoffs — don't show the end-of-page strip. */
export const SUITE_HANDOFF_PATHS = new Set([
  "/scheduler",
  "/cms",
  "/seo",
  "/meta",
  "/website-revamp",
  "/ecosystem",
]);
