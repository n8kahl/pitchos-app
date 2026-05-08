// Investor lens simulator · the same deck scored through two archetypes,
// side-by-side. Static server-rendered — no toggle needed; showing both
// cards simultaneously is the "wait, same deck different read" moment.

type Lens = {
  key: string;
  name: string;
  dot: string;
  score: number;
  headline: string;
  cares: string;
  discounts: string;
  ask: string;
};

type Props = {
  baseScore: number;
  detectedAntiPatternKeys: string[];
  fullText: string;
};

function verdictLabel(score: number): { label: string; sub: string } {
  if (score >= 78) return { label: "Take the meeting", sub: "Strong yes" };
  if (score >= 65)
    return { label: "Take a 30-min call", sub: "Worth partner time" };
  if (score >= 50)
    return { label: "Not yet", sub: "Revisit at next round" };
  return { label: "Pass", sub: "Wrong archetype with this deck" };
}

function scoreColor(score: number): string {
  if (score >= 75) return "text-brand-green";
  if (score >= 60) return "text-brand-gold";
  return "text-signal-red";
}

function deriveLenses({
  baseScore,
  detectedAntiPatternKeys,
  fullText,
}: Props): Lens[] {
  const generalist: Lens = {
    key: "GENERALIST_SEED",
    name: "Generalist seed VC · $75M fund",
    dot: "bg-brand-green",
    score: baseScore,
    headline:
      baseScore >= 65
        ? "“Strong founder–market fit. Take the call.”"
        : baseScore >= 50
        ? "“Real ingredients — the wedge isn’t fully clear yet.”"
        : "“Polite pass at this stage. Revisit at Series A.”",
    cares:
      "Story clarity · problem urgency · founder–market fit · early traction shape · market sizing logic.",
    discounts:
      "Long-tail technical moat narratives. They aren’t equipped to evaluate them.",
    ask:
      baseScore >= 65
        ? "Likely 30-min call with the CEO. References on top customers."
        : "Polite pass. Will revisit at Series A.",
  };

  let aiScore = baseScore;
  const hasAI = /\b(ai|llm|gpt|model|machine learning)\b/i.test(fullText);
  const hasModelStory =
    /\b(eval|inference cost|fine[- ]tune|training data|rlhf|benchmark)\b/i.test(
      fullText
    );
  if (hasAI && !hasModelStory) aiScore -= 18;
  if (detectedAntiPatternKeys.includes("ai_wrapper_no_moat")) aiScore -= 25;
  if (/proprietary (data|model)|data moat/i.test(fullText)) aiScore += 8;
  aiScore = Math.max(20, Math.min(95, aiScore));

  const aiNative: Lens = {
    key: "AI_NATIVE_FUND",
    name: "AI-native fund · top decile",
    dot: "bg-brand-gold",
    score: aiScore,
    headline:
      aiScore >= 70
        ? "“There is a real model story here. Worth a deeper look.”"
        : aiScore >= 50
        ? "“Domain insight without a model story. Marginal interest.”"
        : "“Logistics SaaS with AI grafted on. Pass.”",
    cares:
      "Proprietary data advantage · model performance vs. open-weight baselines · developer-adoption velocity · infra-layer differentiation.",
    discounts:
      "Domain insight without a model story. They expect eval data and inference economics.",
    ask:
      aiScore >= 65
        ? "Will request a technical reference and eval data."
        : "Pass without follow-up. Wrong archetype entirely.",
  };

  return [generalist, aiNative];
}

export function InvestorLens(props: Props) {
  const lenses = deriveLenses(props);
  const delta = lenses[0].score - lenses[1].score;

  return (
    <div>
      <p className="mt-2 max-w-2xl font-prose text-[15px] leading-[1.7] text-muted-foreground">
        The same deck through two archetypes.{" "}
        {Math.abs(delta) >= 12 ? (
          <span className="text-foreground/85">
            Score swings{" "}
            <span className="font-mono text-brand-gold">
              {delta > 0 ? "+" : ""}
              {delta}
            </span>{" "}
            between them — pick the right partner before sending the deck.
          </span>
        ) : (
          <span className="text-foreground/85">
            Both archetypes converge here, which itself is signal.
          </span>
        )}
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {lenses.map((l) => {
          const v = verdictLabel(l.score);
          return (
            <article
              key={l.key}
              className="rounded-md border border-border bg-card/40 p-5 sm:p-6"
            >
              <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                <span
                  aria-hidden
                  className={[
                    "h-1.5 w-1.5 rounded-full",
                    l.dot,
                  ].join(" ")}
                />
                {l.name}
              </div>
              <h3 className="mt-3 font-prose text-[19px] font-semibold italic leading-snug text-foreground">
                {l.headline}
              </h3>
              <div className="mt-5 grid grid-cols-[auto_1fr] items-center gap-4 border-t border-border/60 pt-4">
                <div
                  className={[
                    "font-mono text-5xl font-bold tabular-nums",
                    scoreColor(l.score),
                  ].join(" ")}
                >
                  {l.score}
                </div>
                <div>
                  <div className="font-sans text-sm font-semibold text-foreground">
                    {v.label}
                  </div>
                  <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    {v.sub}
                  </div>
                </div>
              </div>
              <LensRow label="What they care about" body={l.cares} />
              <LensRow label="What they discount" body={l.discounts} />
              <LensRow label="Likely ask" body={l.ask} />
            </article>
          );
        })}
      </div>
    </div>
  );
}

function LensRow({ label, body }: { label: string; body: string }) {
  return (
    <div className="mt-4 border-t border-border/40 pt-3">
      <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gold">
        {label}
      </div>
      <p className="mt-1.5 font-prose text-[14px] leading-[1.6] text-foreground/85">
        {body}
      </p>
    </div>
  );
}
