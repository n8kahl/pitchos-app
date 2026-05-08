// Real podcast appearances by Scott Kelly (Black Dog VP). Pulled from
// public Apple Podcasts / Spotify / show pages. Each episode carries
// rubric-dimension and journey-stage metadata so it lives in the same
// library filter system as video clips and PDF resources.
//
// The viewer renders these via Apple Podcasts / Spotify embed iframes —
// no audio is hosted in this app.

import type { RubricCategory } from "@/lib/ai/anti-patterns";

export type PodcastProvider = "apple" | "spotify";

export interface PodcastEpisode {
  id: string;
  show: string;
  host: string;
  episodeTitle: string;
  publishedAt: string; // YYYY-MM
  durationMin: number;
  rubricDims: RubricCategory[];
  journeyStages: Array<1 | 2 | 3 | 4 | 5>;
  aiSummary: string;
  // Provider-specific embed.
  // For Apple: collectionId + episodeId from the podcasts.apple.com URL.
  // For Spotify: episode-id from open.spotify.com/episode/<id>.
  provider: PodcastProvider;
  appleCollectionId?: string;
  appleEpisodeId?: string;
  spotifyEpisodeId?: string;
  // Canonical link for "Listen on" badge.
  externalUrl: string;
}

export const PODCAST_EPISODES: PodcastEpisode[] = [
  {
    id: "bcfs-2025-10-find-pitch-investors",
    show: "The Business Credit and Financing Show",
    host: "Ty Crandall",
    episodeTitle: "Scott Kelly: How to Find and Pitch to Investors",
    publishedAt: "2025-10",
    durationMin: 34,
    rubricDims: ["founderMarketFit", "wedgeClarity", "tractionQuality"],
    journeyStages: [1, 2, 3, 4],
    aiSummary:
      "Scott on the founder-side discipline that compounds across every raise — clarity, evidence, and the wedge story that survives partner skepticism. Same operator framework that drives the PitchOS rubric.",
    provider: "apple",
    appleCollectionId: "962410056",
    appleEpisodeId: "1000732218573",
    externalUrl:
      "https://podcasts.apple.com/us/podcast/scott-kelly-how-to-find-and-pitch-to-investors/id962410056?i=1000732218573",
  },
  {
    id: "sfx-find-pitch-investors",
    show: "The San Francisco Experience",
    host: "James Herlihy",
    episodeTitle:
      "How to find and pitch investors for your startup · Talking with Black Dog VP CEO Scott Kelly",
    publishedAt: "2025-09",
    durationMin: 42,
    rubricDims: ["founderMarketFit", "deckQuality"],
    journeyStages: [1, 2, 3],
    aiSummary:
      "The Do's and Don'ts of approaching investors. Scott on the credentials line, the why-now sentence, and the single most common reason a partner closes the deck before slide three.",
    provider: "spotify",
    // Spotify creators URL doesn't expose a stable episode ID — fall back
    // to the canonical web link as the embed source.
    spotifyEpisodeId: "3brl1e",
    externalUrl:
      "https://creators.spotify.com/pod/profile/james-herlihy/episodes/How-to-find-and-pitch-investors-for-your-startup--The-Dos-and-Donts--Talking-with-Black-Dog-Venture-Partners-CEO-Scott-Kelly-e3brl1e",
  },
  {
    id: "bam-biztalk-80-funding-future",
    show: "BAM BizTalk",
    host: "Angel Garcia",
    episodeTitle:
      "Funding the Future · Scott Kelly on Resilience, AI, and Smart Startup Growth",
    publishedAt: "2025-12",
    durationMin: 48,
    rubricDims: ["whyNow", "defensibility", "tractionQuality"],
    journeyStages: [1, 2, 3, 4],
    aiSummary:
      "What founders need to know about raising capital, leveraging AI without becoming an AI-wrapper, and building companies that last across a vintage. Scott's structural why-now framework applied to the 2026 environment.",
    provider: "apple",
    // Substack-published, no Apple ID — externalUrl is the listen path.
    appleCollectionId: "0",
    appleEpisodeId: "0",
    externalUrl:
      "https://bambiztalk.substack.com/p/80-funding-the-future-scott-kelly",
  },
  {
    id: "tony-durso-investors-look-for",
    show: "Tony DUrso Show",
    host: "Tony D'Urso",
    episodeTitle: "What Investors Look for Before You Raise Capital",
    publishedAt: "2026-02",
    durationMin: 39,
    rubricDims: ["founderMarketFit", "tractionQuality", "marketSizingLogic"],
    journeyStages: [2, 3],
    aiSummary:
      "Scott on the diligence pattern partners apply before they say yes — the team line, the wedge, the bottom-up sizing math, and the metrics that survive small-n scrutiny.",
    provider: "apple",
    appleCollectionId: "0",
    appleEpisodeId: "0",
    externalUrl:
      "https://tonydurso.com/podcast/what-investors-look-for-before-you-raise-capital/",
  },
  // === Emerging Managers Podcast · Scott co-hosts with Tracy Hazzard ===
  // Apple collection 1808064463. Episode IDs pulled from podcasts.apple.com.
  {
    id: "emp-ross-fubini-early-stage-vc",
    show: "Emerging Managers Pod",
    host: "Scott Kelly · Tracy Hazzard",
    episodeTitle: "Winning in Early-Stage VC · Ross Fubini · XYZ Venture Capital",
    publishedAt: "2025-03",
    durationMin: 38,
    rubricDims: ["whyNow", "businessModel", "tractionQuality"],
    journeyStages: [4, 5],
    aiSummary:
      "Ross Fubini on the diligence discipline that decides early-stage outcomes — what the seed-to-A motion actually looks like inside a fund that takes meaningful concentration on small numbers of bets.",
    provider: "apple",
    appleCollectionId: "1808064463",
    appleEpisodeId: "1000756120172",
    externalUrl:
      "https://podcasts.apple.com/us/podcast/winning-in-early-stage-vc/id1808064463?i=1000756120172",
  },
  {
    id: "emp-alana-mann-vertical-ai",
    show: "Emerging Managers Pod",
    host: "Scott Kelly · Tracy Hazzard",
    episodeTitle: "Investing in Vertical AI · Alana Mann · Eleven Wall Ventures",
    publishedAt: "2025-04",
    durationMin: 41,
    rubricDims: ["defensibility", "businessModel", "wedgeClarity"],
    journeyStages: [3, 4, 5],
    aiSummary:
      "Alana Mann on the moats that hold up under real partner scrutiny in vertical AI — proprietary data, integration depth, and the difference between a wrapper company and a system-of-record bet.",
    provider: "apple",
    appleCollectionId: "1808064463",
    appleEpisodeId: "1000760441829",
    externalUrl:
      "https://podcasts.apple.com/us/podcast/investing-in-vertical-ai/id1808064463?i=1000760441829",
  },
  {
    id: "emp-jai-khanna-storytelling",
    show: "Emerging Managers Pod",
    host: "Scott Kelly · Tracy Hazzard",
    episodeTitle: "Sports Storytelling and Investing · Jai Khanna · Victory Ventures",
    publishedAt: "2025-04",
    durationMin: 36,
    rubricDims: ["founderMarketFit", "deckQuality", "gtmRepeatability"],
    journeyStages: [2, 3],
    aiSummary:
      "Jai Khanna on the founder narratives that survive the partner discount — operator-investor pattern recognition for stories that actually move IC, anchored in the sports and entertainment vertical.",
    provider: "apple",
    appleCollectionId: "1808064463",
    appleEpisodeId: "1000758827509",
    externalUrl:
      "https://podcasts.apple.com/us/podcast/sports-storytelling-and-investing/id1808064463?i=1000758827509",
  },
];

export function getEpisodeById(id: string): PodcastEpisode | undefined {
  return PODCAST_EPISODES.find((e) => e.id === id);
}
