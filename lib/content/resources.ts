// Library resources · PDFs and infographics from Scott's Startup Toolkit.
// The originals live in his Drive folder; copies are served from
// /public/resources/. Each resource carries the same rubric-dimension
// and journey-stage metadata as videos and podcasts so the library
// filters across all media types uniformly.

import type { RubricCategory } from "@/lib/ai/anti-patterns";

export type ResourceKind = "pdf" | "infographic";

export interface LibraryResource {
  id: string;
  kind: ResourceKind;
  title: string;
  source: string; // who originally produced it
  blurb: string; // operator-grade one-line description
  fileUrl: string; // path under /public
  pages?: number;
  fileSizeKB?: number;
  rubricDims: RubricCategory[];
  journeyStages: Array<1 | 2 | 3 | 4 | 5>;
  // Cover label shown on the resource card. The card uses an SVG/CSS
  // gradient cover with this label rendered over it — no external
  // imagery required.
  coverEyebrow: string;
  coverTitle: string;
  coverAccent: "gold" | "green" | "sage";
}

export const LIBRARY_RESOURCES: LibraryResource[] = [
  {
    id: "sequoia-pitch-deck-template",
    kind: "pdf",
    title: "Sequoia Pitch Deck Template",
    source: "Sequoia Capital",
    blurb:
      "The canonical seed-stage outline. Twelve slides Scott uses as the anchor reference when reviewing decks at VC Fast Pitch.",
    fileUrl: "/resources/sequoia-pitch-deck-template.pdf",
    pages: 12,
    fileSizeKB: 308,
    rubricDims: ["deckQuality", "wedgeClarity", "marketSizingLogic"],
    journeyStages: [2, 3],
    coverEyebrow: "PITCH DECK · TEMPLATE",
    coverTitle: "Sequoia",
    coverAccent: "gold",
  },
  {
    id: "ultimate-guide-vc-term-sheets",
    kind: "pdf",
    title: "The Ultimate Guide to VC Term Sheets",
    source: "Cooley GO",
    blurb:
      "Founder-side breakdown of every term sheet clause — liquidation preferences, anti-dilution, board composition, protective provisions.",
    fileUrl: "/resources/ultimate-guide-vc-term-sheets.pdf",
    pages: 56,
    fileSizeKB: 2702,
    rubricDims: ["businessModel", "riskSurface"],
    journeyStages: [4, 5],
    coverEyebrow: "TERM SHEETS · FOUNDER GUIDE",
    coverTitle: "Term Sheet Atlas",
    coverAccent: "green",
  },
  {
    id: "investor-update-template-fidelity",
    kind: "pdf",
    title: "Investor Update Template",
    source: "Fidelity Private Shares",
    blurb:
      "The monthly investor-update structure operators actually read. Scott's recommended cadence for keeping the cap table warm between rounds.",
    fileUrl: "/resources/investor-update-template-fidelity.pdf",
    pages: 8,
    fileSizeKB: 192,
    rubricDims: ["gtmRepeatability", "tractionQuality"],
    journeyStages: [3, 4, 5],
    coverEyebrow: "OPERATOR · MONTHLY CADENCE",
    coverTitle: "Investor Update",
    coverAccent: "sage",
  },
  {
    id: "fidelity-409a-valuation-guide",
    kind: "pdf",
    title: "409A Valuation Guide",
    source: "Fidelity Private Shares",
    blurb:
      "Why 409A timing changes how option grants land. The clean version of a topic founders learn about three months too late.",
    fileUrl: "/resources/fidelity-409a-valuation-guide.pdf",
    pages: 14,
    fileSizeKB: 624,
    rubricDims: ["riskSurface", "businessModel"],
    journeyStages: [3, 4],
    coverEyebrow: "EQUITY · VALUATION",
    coverTitle: "409A Guide",
    coverAccent: "green",
  },
  {
    id: "tca-term-sheet-definitions",
    kind: "pdf",
    title: "Term Sheet Definitions",
    source: "Tech Coast Angels",
    blurb:
      "Plain-language glossary of every term you will see across seed and Series A term sheets. Print and keep next to the doc when redlining.",
    fileUrl: "/resources/tca-term-sheet-definitions.pdf",
    pages: 22,
    fileSizeKB: 621,
    rubricDims: ["riskSurface"],
    journeyStages: [4, 5],
    coverEyebrow: "TERM SHEET · GLOSSARY",
    coverTitle: "Definitions",
    coverAccent: "sage",
  },
  {
    id: "12-slides-killer-pitch-deck",
    kind: "infographic",
    title: "The 12 Slides of a Killer Pitch Deck",
    source: "Black Dog VP",
    blurb:
      "Scott's slide-by-slide outline. The order, the question each slide answers, the discipline of one question per slide.",
    fileUrl: "/resources/12-slides-killer-pitch-deck.jpg",
    rubricDims: ["deckQuality"],
    journeyStages: [2, 3],
    coverEyebrow: "INFOGRAPHIC · BDVP",
    coverTitle: "12 Slides",
    coverAccent: "gold",
  },
  {
    id: "tam-sam-som-table",
    kind: "infographic",
    title: "TAM / SAM / SOM Worksheet",
    source: "Black Dog VP",
    blurb:
      "The bottom-up sizing table Scott uses on stage. ICP × buyer count × ACV. Three lines beat any TAM headline.",
    fileUrl: "/resources/tam-sam-som-table.jpg",
    rubricDims: ["marketSizingLogic"],
    journeyStages: [2, 3],
    coverEyebrow: "INFOGRAPHIC · WORKSHEET",
    coverTitle: "TAM / SAM / SOM",
    coverAccent: "green",
  },
  {
    id: "investor-update-graphic",
    kind: "infographic",
    title: "Investor Update Anatomy",
    source: "Black Dog VP",
    blurb:
      "Visual map of what each section of a monthly update communicates — and what to leave out.",
    fileUrl: "/resources/investor-update-graphic.jpg",
    rubricDims: ["gtmRepeatability"],
    journeyStages: [3, 4, 5],
    coverEyebrow: "INFOGRAPHIC · CADENCE",
    coverTitle: "Update Anatomy",
    coverAccent: "sage",
  },
];

export function getResourceById(id: string): LibraryResource | undefined {
  return LIBRARY_RESOURCES.find((r) => r.id === id);
}
