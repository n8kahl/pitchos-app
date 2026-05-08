// Q&A rehearsal · partner-voiced questions a real investor will ask,
// each anchored to a detected objection (or a generic high-leverage prompt).
// Click a question to see why a partner asks it and what a strong answer
// must contain. Native <details>/<summary> · server component.

type Objection = {
  antiPatternKey: string | null;
  title: string;
  objection: string;
  whyItMatters: string;
  howToAddress: string;
  evidenceRequired: string[];
};

type QaQuestion = {
  q: string;
  why: string;
  mustInclude: string[];
  tag: string;
};

type Props = {
  objections: Objection[];
};

const GENERIC_QUESTIONS: QaQuestion[] = [
  {
    q: "What customer would never buy this — and why not?",
    why: "Tests whether the founder has a real ICP rather than a mythical “everyone.” Specific exclusions are how partners price discipline.",
    mustInclude: [
      "A specific named segment to exclude (e.g. “enterprise telcos”)",
      "A structural reason for excluding it (e.g. “procurement cycle is longer than our runway”)",
    ],
    tag: "leverage",
  },
  {
    q: "Three years from now, what is the single line on your team page you most want to be true?",
    why: "Reveals whether the founder is building a company or shipping a product. Generic answers (“great team”) signal the latter.",
    mustInclude: [
      "A specific role and function (e.g. “VP Sales who came from a vertical incumbent”)",
      "A named candidate source (advisor network, prior team, sector-specific community)",
    ],
    tag: "leverage",
  },
  {
    q: "What does this round buy you that a smaller round would not?",
    why: "Tests round-sizing logic and milestone discipline. Most decks oversize without naming the milestone the smaller round wouldn't reach.",
    mustInclude: [
      "A specific milestone the smaller round wouldn't hit (e.g. “10 paying customers vs. 4”)",
      "A defensible reason that milestone is the right next-gate (Series A readiness, profitability inflection, etc.)",
    ],
    tag: "leverage",
  },
];

export function QARehearsal({ objections }: Props) {
  const objectionQuestions: QaQuestion[] = objections.slice(0, 5).map((o) => ({
    q: o.objection,
    why: o.whyItMatters,
    mustInclude: [o.howToAddress, ...o.evidenceRequired],
    tag: o.antiPatternKey ?? "objection",
  }));

  const questions = [...objectionQuestions, ...GENERIC_QUESTIONS];

  return (
    <div>
      <p className="mt-2 max-w-2xl font-prose text-[15px] leading-[1.7] text-muted-foreground">
        {questions.length} questions a partner will ask in the room. Click any
        to see why it gets asked and what a strong answer must contain.
      </p>

      <ol className="mt-5 space-y-3">
        {questions.map((q, i) => (
          <li key={i}>
            <details className="group rounded-md border border-border bg-card/40 transition open:border-brand-gold/40 [&::-webkit-details-marker]:hidden">
              <summary className="grid cursor-pointer list-none grid-cols-[42px_1fr_auto] items-start gap-3 px-5 py-4 marker:hidden sm:px-6">
                <span className="font-mono text-[11px] font-bold tabular-nums text-brand-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    {q.tag.replace(/_/g, " ")}
                  </div>
                  <div className="mt-1 font-prose text-[15.5px] font-semibold italic leading-snug text-foreground">
                    “{q.q}”
                  </div>
                </div>
                <span
                  aria-hidden
                  className="font-mono text-[14px] text-muted-foreground transition group-open:rotate-180"
                >
                  ▾
                </span>
              </summary>
              <div className="border-t border-border/40 px-5 pb-5 pt-4 sm:px-6">
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gold">
                  why a partner asks this
                </div>
                <p className="mt-1.5 max-w-2xl font-prose text-[14px] leading-[1.7] text-foreground/85">
                  {q.why}
                </p>

                <div className="mt-4 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-green">
                  what a strong answer must include
                </div>
                <ul className="mt-1.5 space-y-1.5 max-w-2xl text-[14px] leading-snug text-foreground/85">
                  {q.mustInclude.map((m, j) => (
                    <li key={j} className="pl-4 -indent-4">
                      · {m}
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          </li>
        ))}
      </ol>
    </div>
  );
}
