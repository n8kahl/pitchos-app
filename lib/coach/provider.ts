import type { CoachSource } from "./retrieval";

// Provider interface for Coach Q&A. Mirrors lib/ai/provider.ts shape
// (one analyze() call, one returned report) but for the single-turn
// retrieval-augmented chat surface.
//
// Two implementations land alongside this:
//   MockCoachProvider · routes to the closest prebaked exchange via
//     keyword retrieval. Always available, no key needed.
//   AnthropicCoachProvider · streams real Sonnet 4.6 responses with
//     the retrieved sources injected into the system prompt. Active
//     when ANTHROPIC_API_KEY is set.

export type CoachMode = "discovery" | "structuring" | "sharpening";

export interface CoachInput {
  question: string;
  mode?: CoachMode;
  // Optional: stage of the asking founder for retrieval routing.
  stage?: 1 | 2 | 3 | 4 | 5;
}

export interface CoachReply {
  // The assistant message content. Plain text or lightly markdowned —
  // CitationCard handles the structured source list separately.
  text: string;
  // Sources injected into the system prompt for the model. Surfaced
  // to the user as citation chips. For mock, these are the matches
  // from retrieval. For Anthropic, retrieved before the call and
  // narrated in the response.
  sources: CoachSource[];
  // For mock provider: the prebaked exchange id we routed to. Lets
  // the rail keep using its existing exchange rendering when no key
  // is set. Anthropic responses leave this null.
  matchedExchangeId: string | null;
  provider: "mock" | "anthropic";
}

// Streaming events emitted by stream(). The route serializes each one
// as a single newline-delimited JSON object so the client can
// progressively render text as it arrives. `match` short-circuits the
// rest of the stream when the mock provider routes to a prebaked
// exchange — the client switches active exchange instead of building
// a live response.
export type CoachStreamEvent =
  | { type: "match"; matchedExchangeId: string }
  | { type: "sources"; sources: import("./retrieval").CoachSource[] }
  | { type: "text"; chunk: string }
  | { type: "done"; provider: "mock" | "anthropic" }
  | { type: "error"; message: string };

export interface CoachProvider {
  ask(input: CoachInput): Promise<CoachReply>;
  stream?(input: CoachInput): AsyncIterable<CoachStreamEvent>;
}
