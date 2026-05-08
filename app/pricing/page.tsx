import Link from "next/link";

const TIERS = [
  {
    name: "Free",
    price: "$0",
    tag: "Top of funnel",
    perks: [
      "All YouTube content",
      "50% of podcast catalog",
      "Monthly free workshop",
      "Founder Journey Rubric self-assessment",
      "Email newsletter",
    ],
    cta: "Sign up",
    href: "/library",
  },
  {
    name: "Insider",
    price: "$29",
    tag: "Mass-market base",
    perks: [
      "Full content unlocked",
      "Early-access podcast",
      "Monthly live Q&A with Scott",
      "Community forum access",
      "Downloadable rubric worksheets",
    ],
    cta: "Subscribe",
    href: "/library",
  },
  {
    name: "Founder Pro",
    price: "$99",
    tag: "Active fundraisers",
    perks: [
      "Insider · plus",
      "AI Coach (Scott-bot, RAG)",
      "4 courses per quarter",
      "Cohort group",
      "Investor-list access",
    ],
    cta: "Subscribe",
    href: "/coach",
  },
  {
    name: "PitchOS Premium",
    price: "$299",
    tag: "The deep-grade exam",
    perks: [
      "Founder Pro · plus",
      "Partner-grade memos",
      "Objection simulator + Q&A rehearsal",
      "4 deck analyses per month",
      "Counterfactual rewrites with score-lift estimates",
    ],
    cta: "Run PitchOS →",
    href: "/pitchos",
    featured: true,
  },
  {
    name: "Operator",
    price: "$99",
    tag: "Post-funding · anti-churn",
    perks: [
      "Investor-update templates",
      "Board prep curriculum",
      "Series A readiness path",
    ],
    cta: "Stay on after close",
    href: "/dashboard",
  },
  {
    name: "Fund Manager",
    price: "$499",
    tag: "Emerging fund GP · ARR ceiling",
    perks: [
      "Founder Pro + PitchOS fund-side",
      "Emerging Managers back catalog",
      "LP intro guides",
      "Cohort with other emerging GPs",
      "Multi-tenant fund workspace",
    ],
    cta: "Apply",
    href: "/coach",
  },
];

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-6xl px-8 py-10">
      <header className="mb-8 border-b border-border/40 pb-6">
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-brand-gold">
          06 · pricing & tiers
        </div>
        <h1 className="mt-2 font-serif text-3xl font-semibold sm:text-4xl leading-[1.05] tracking-tight text-foreground">
          A tier for every stage of the lifecycle.
        </h1>
        <p className="mt-3 max-w-2xl font-serif text-[15px] leading-relaxed text-muted-foreground">
          The platform follows you across the lifecycle — Free as you start
          out, Founder Pro through your raise, PitchOS Premium for the
          partner-grade memo, Operator post-funding, Fund Manager when you
          end up on the other side of the table.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TIERS.map((t) => (
          <article
            key={t.name}
            className={[
              "relative flex flex-col rounded-xl border p-6",
              t.featured
                ? "border-brand-gold/40 bg-gradient-to-b from-brand-gold/5 to-bg-card shadow-[0_12px_32px_rgba(245,200,66,0.06)]"
                : "border-border/60 bg-bg-card",
            ].join(" ")}
          >
            {t.featured && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-sm bg-brand-gold px-2.5 py-0.5 font-mono text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#0a1410]">
                most popular
              </div>
            )}
            <div className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
              {t.name}
            </div>
            <div className="mt-3 font-serif text-3xl font-semibold sm:text-4xl leading-none tracking-tight text-foreground">
              {t.price}
              <span className="ml-0.5 font-mono text-sm font-medium text-muted-foreground">
                /mo
              </span>
            </div>
            <div className="mb-5 mt-2 text-[12px] leading-snug text-muted-foreground">
              {t.tag}
            </div>
            <ul className="flex-1 text-[13px] leading-[1.5] text-foreground/85">
              {t.perks.map((p, i) => (
                <li
                  key={i}
                  className="relative border-b border-dashed border-border/60 py-2 pl-4 last:border-b-0"
                >
                  <span className="absolute left-0 top-3.5 h-1 w-1 rounded-full bg-brand-green" />
                  {p}
                </li>
              ))}
            </ul>
            <Link
              href={t.href}
              className={[
                "mt-5 rounded-md px-3 py-2.5 text-center text-xs font-semibold transition",
                t.featured
                  ? "bg-brand-gold text-[#0a1410] hover:bg-brand-gold-2"
                  : "border border-border/80 text-foreground hover:border-muted-foreground hover:bg-muted/40",
              ].join(" ")}
            >
              {t.cta}
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
