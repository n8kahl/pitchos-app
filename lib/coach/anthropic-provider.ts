import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { retrieveSources, type CoachSource } from "./retrieval";
import type { CoachInput, CoachProvider, CoachReply } from "./provider";

// Anthropic-backed Coach provider. Uses Sonnet 4.6 with a
// retrieval-augmented system prompt — the keyword retriever picks up
// to five relevant assets from the corpus, those get serialized into
// the system message, and the model is instructed to ground its
// answer in them and surface a citation list at the end.
//
// Active when ANTHROPIC_API_KEY is set in env. Otherwise the chat
// route falls back to MockCoachProvider.

const MODEL = "claude-sonnet-4-6";
const MAX_OUTPUT_TOKENS = 1024;

const SCOTT_VOICE_RULES = `
You are an AI Coach speaking in Scott Kelly's voice. Scott is the founder
of Black Dog Venture Partners, runs VC Fast Pitch and the Emerging
Managers Podcast, and has thirty years of operator-investor pattern
recognition.

Voice rules — non-negotiable:
- No banned phrases: exciting, compelling, passionate, world-class,
  best-in-class, leading, huge market, game-changing, cutting-edge,
  synergy, utilize, innovative, I think, I believe, perhaps, we believe.
- No exclamation marks.
- Declarative imperatives, not hedged suggestions.
- Operator vocabulary: pass · defer · lead · take the call · IC ·
  diligence · wedge · system of record · ship · slide · cap table.
- Reference Scott's frameworks where they fit: 11-dimension partner
  rubric, closed 16-pattern catalog, four-stage wedge arc
  (workflow → audit → SoR → adjacent monetization), bottom-up SAM
  beats top-down TAM, the discipline of one question per slide.

Citation rule:
You will be given up to five retrieved corpus assets in the user
context. Reference them inline using bracketed footnote markers like
[^1], [^2]. Every claim that cites a corpus asset gets a marker. Do
NOT invent assets that aren't in the retrieved set.
`.trim();

function formatSources(sources: CoachSource[]): string {
  if (sources.length === 0) return "No corpus matches retrieved.";
  return sources
    .map((s, i) => {
      const num = i + 1;
      const dims = s.rubricDims.length ? ` · ${s.rubricDims.join(", ")}` : "";
      const meta =
        s.kind === "video"
          ? `Video · ${s.show}`
          : s.kind === "podcast"
          ? `Podcast · ${s.show}`
          : `Resource · ${s.source}`;
      return `[${num}] ${meta} — ${s.title}${dims}\n    ${s.summary}`;
    })
    .join("\n\n");
}

export class AnthropicCoachProvider implements CoachProvider {
  private client: Anthropic;

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }

  async ask(input: CoachInput): Promise<CoachReply> {
    const sources = retrieveSources(input.question, { topN: 5 });
    const systemPrompt = `${SCOTT_VOICE_RULES}\n\nRetrieved corpus context:\n${formatSources(sources)}`;

    const response = await this.client.messages.create({
      model: MODEL,
      max_tokens: MAX_OUTPUT_TOKENS,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: input.question,
        },
      ],
    });

    // Concatenate text blocks. Sonnet returns content as an array of
    // typed blocks; we read the text-typed ones.
    const text = response.content
      .map((b) => (b.type === "text" ? b.text : ""))
      .filter((s) => s.length > 0)
      .join("\n");

    return {
      text,
      sources,
      matchedExchangeId: null,
      provider: "anthropic",
    };
  }
}
