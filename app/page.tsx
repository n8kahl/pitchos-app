import Link from "next/link";

// Black Dog · The Founder Platform · platform-shaped homepage
// Source: 15_proposed_homepage.html · 11_content_platform_strategy.md §4
//
// PitchOS lives at /pitchos as the premium tier inside the platform shell.

export default function HomePage() {
  return (
    <div className="relative">
      <Masthead />
      <Hero />
      <TaglineStrip />
      <ThreePillars />
      <ContentRail />
      <PitchOSCallout />
      <PricingLadder />
      <AboutScott />
      <SiteFooter />
    </div>
  );
}

function Masthead() {
  return (
    <header className="border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto grid max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-8 px-8 py-5">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-10 w-12 place-items-center rounded-md bg-black px-1">
            <BrandMark />
          </div>
          <div className="font-serif text-[13px] font-semibold leading-tight">
            <div>Black Dog</div>
            <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
              the founder platform
            </div>
          </div>
        </Link>

        <nav className="hidden justify-center gap-8 md:flex">
          <Link href="/library" className="text-sm text-foreground/80 transition hover:text-foreground">Library</Link>
          <Link href="/coach" className="text-sm text-foreground/80 transition hover:text-foreground">AI Coach</Link>
          <Link href="/pitchos" className="text-sm text-brand-gold transition hover:text-brand-gold-2">PitchOS</Link>
          <Link href="/#pricing" className="text-sm text-foreground/80 transition hover:text-foreground">Pricing</Link>
          <Link href="/#about" className="text-sm text-foreground/80 transition hover:text-foreground">About Scott</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/library"
            className="rounded-md border border-border/60 px-3.5 py-2 text-xs font-semibold text-foreground transition hover:border-muted-foreground hover:bg-muted/40"
          >
            Sign in
          </Link>
          <Link
            href="/pitchos"
            className="inline-flex items-center gap-1.5 rounded-md bg-brand-gold px-3.5 py-2 text-xs font-bold text-[#0a1410] transition hover:bg-brand-gold-2"
          >
            Run PitchOS →
          </Link>
        </div>
      </div>
    </header>
  );
}

function BrandMark() {
  // Wordmark fallback until brand/black-dog-vp-logo.png is dropped in
  return (
    <div className="font-serif text-[10px] font-bold leading-none tracking-tight text-brand-gold">
      BD
      <div className="mt-0.5 font-mono text-[6px] font-semibold tracking-[0.1em] text-brand-green">
        VP
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_500px_at_80%_0%,rgba(245,200,66,0.05),transparent_60%),radial-gradient(700px_400px_at_0%_100%,rgba(60,169,74,0.04),transparent_60%)]" />
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-end gap-16 px-8 py-24 lg:grid-cols-[1.7fr_1fr] lg:py-28">
        <div>
          <div className="mb-7 flex items-center gap-3 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-brand-gold">
            Black Dog · The Founder Platform
            <span className="h-px max-w-32 flex-1 bg-gradient-to-r from-brand-gold to-transparent" />
          </div>
          <h1 className="mb-7 font-serif text-6xl font-semibold leading-[1.0] tracking-tight text-foreground sm:text-7xl">
            Pitch. Score. <em className="font-semibold not-italic text-brand-gold">Fund.</em>
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
            <strong className="font-semibold text-foreground">30 years of operator-investor judgment</strong>{" "}
            — Scott Kelly&rsquo;s curriculum, AI Coach, and the partner-grade
            PitchOS scoring engine, in one platform built for founders raising
            seed and the funds investing in them.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/pitchos"
              className="inline-flex items-center gap-2 rounded-md bg-brand-gold px-5 py-3 text-sm font-bold text-[#0a1410] transition hover:bg-brand-gold-2"
            >
              Score your deck →
            </Link>
            <Link
              href="/library"
              className="inline-flex items-center gap-2 rounded-md border border-border/80 bg-transparent px-5 py-3 text-sm font-semibold text-foreground transition hover:border-muted-foreground hover:bg-muted/40"
            >
              Browse the library
            </Link>
            <Link
              href="/coach"
              className="inline-flex items-center gap-2 rounded-md border border-brand-green/40 bg-brand-green/5 px-5 py-3 text-sm font-semibold text-brand-green transition hover:border-brand-green hover:bg-brand-green/10"
            >
              Talk to the AI Coach
            </Link>
          </div>
        </div>

        <aside className="border-l-2 border-brand-gold pl-5 font-mono text-[11px] leading-[1.85] text-muted-foreground">
          <div className="mb-4">
            <div className="mb-1 font-serif text-sm font-semibold tracking-normal text-foreground">
              Scott Kelly
            </div>
            Founder &amp; CEO · Black Dog VP · 30 years operator-investor experience
          </div>
          <div className="mb-4">
            <div className="mb-1 font-serif text-sm font-semibold tracking-normal text-foreground">
              VC Fast Pitch · monthly
            </div>
            50+ episodes · 13,000 investor network
          </div>
          <div>
            <div className="mb-1 font-serif text-sm font-semibold tracking-normal text-foreground">
              Emerging Managers Pod
            </div>
            New funds outperforming the status quo
          </div>
        </aside>
      </div>
    </section>
  );
}

function TaglineStrip() {
  const tags = [
    { label: "VC Fast Pitch", words: "Pitch. Connect. Fund.", audience: "founders + investors" },
    { label: "Black Dog CEO", words: "Fund. Scale. Exit.", audience: "operators" },
    { label: "PitchOS · this product", words: "Pitch. Score. Fund.", audience: "founders + funds", featured: true },
  ];
  return (
    <section className="border-b border-border/60 bg-bg-2/60">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-8 py-7 sm:grid-cols-3">
        {tags.map((t) => (
          <div key={t.label} className="text-center">
            <div className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {t.label}
            </div>
            <div
              className={[
                "mt-2 font-serif text-lg font-semibold tracking-tight",
                t.featured ? "text-brand-gold" : "text-foreground",
              ].join(" ")}
            >
              {t.words}
            </div>
            <div className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.06em] text-muted-foreground">
              {t.audience}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ThreePillars() {
  const pillars = [
    {
      num: "01",
      title: "Watch",
      titleEm: "the curriculum",
      desc: "Scott&rsquo;s VC Fast Pitch episodes, Emerging Managers podcast, and 30 years of pattern-matching across founder-market fit, wedge clarity, and what kills decks at IC. Tagged by rubric dimension so you can study what you need.",
      price: "Free + Insider $29/mo",
    },
    {
      num: "02",
      title: "Apply",
      titleEm: "with the AI Coach",
      desc: "Scott-bot — RAG over the full content corpus plus the partner voice profile. Three modes: discovery, structuring, sharpening. Every answer cites real Scott moments with deep links to the source clip.",
      price: "Founder Pro $99/mo",
    },
    {
      num: "03",
      title: "Score",
      titleEm: "with PitchOS",
      desc: "The deep-grade exam. Upload your deck, get a partner-voiced memo, named anti-patterns from the closed catalog, counterfactual rewrites with score-lift estimates, and the exact diligence list a real partner would build.",
      price: "PitchOS Premium $299/mo",
      featured: true,
    },
  ];
  return (
    <section className="border-b border-border/60 py-24">
      <div className="mx-auto max-w-6xl px-8">
        <SectionHead
          meta="01 · what the platform is"
          title="A graded path from "
          titleEm="content to capital"
        />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {pillars.map((p) => (
            <article
              key={p.num}
              className={[
                "relative flex flex-col overflow-hidden rounded-xl border p-8 transition-transform hover:-translate-y-0.5",
                p.featured
                  ? "border-brand-gold/40 bg-gradient-to-b from-brand-gold/5 to-bg-2"
                  : "border-border bg-gradient-to-b from-bg-card to-bg-2 hover:border-border/80",
              ].join(" ")}
            >
              {p.featured && (
                <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand-gold via-brand-green to-brand-gold" />
              )}
              <div className="mb-5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-brand-gold">
                {p.num}
              </div>
              <h3 className="mb-3 font-serif text-2xl font-semibold leading-tight tracking-tight">
                {p.title}{" "}
                <em className="font-medium not-italic text-brand-green">
                  {p.titleEm}
                </em>
              </h3>
              <p
                className="mb-7 flex-1 text-sm leading-[1.65] text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: p.desc }}
              />
              <div className="border-t border-dashed border-border pt-5 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                {p.price.split(" ").map((part, i) =>
                  /\$/.test(part) ? (
                    <b key={i} className="font-bold text-brand-gold">
                      {" "}
                      {part}
                    </b>
                  ) : (
                    <span key={i}>{i === 0 ? part : ` ${part}`}</span>
                  )
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContentRail() {
  const items = [
    {
      type: "VC Fast Pitch · Episode",
      title: "Why founder-market fit ",
      titleEm: "decides every memo",
      desc: "Scott breaks down three decks where the team won the deal before slide one — and three where it lost the deal at slide thirteen.",
      duration: "47 min",
      tag: "founderMarketFit",
    },
    {
      type: "Emerging Managers · Podcast",
      title: "How $20M funds beat ",
      titleEm: "tier-1 returns",
      desc: "Why deploying a small fund with discipline outperforms a large fund with momentum capital — and what new GPs can learn from operator-investors.",
      duration: "52 min",
      tag: "fundLP",
    },
    {
      type: "Smart Startup Growth · Article",
      title: "Anti-vanity ",
      titleEm: "metrics for seed decks",
      desc: "Five metrics partners discount on first read, and what to put in the deck instead. The math that earns a real second look.",
      duration: "12 min read",
      tag: "tractionQuality",
    },
  ];
  return (
    <section className="border-b border-border/60 bg-bg-2/40 py-24">
      <div className="mx-auto max-w-6xl px-8">
        <SectionHead
          meta="02 · current library"
          title="The content already exists. We&rsquo;re "
          titleEm="organizing it against the rubric."
          seeAll={{ href: "/library", label: "browse library →" }}
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((it, idx) => (
            <article key={idx} className="flex flex-col">
              <div
                className={[
                  "relative mb-5 aspect-[16/10] overflow-hidden rounded-md border border-border bg-gradient-to-br from-forest to-[#0c1812]",
                  idx === 0
                    ? "after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_30%_30%,rgba(60,169,74,0.12),transparent_60%)]"
                    : idx === 1
                    ? "after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_70%_30%,rgba(245,200,66,0.12),transparent_60%)]"
                    : "after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_50%_60%,rgba(187,201,181,0.10),transparent_60%)]",
                ].join(" ")}
              >
                <div className="absolute inset-x-3.5 bottom-3.5 z-10 flex items-end justify-between">
                  <span className="rounded-sm bg-black/60 px-2 py-1 font-mono text-[10px] font-semibold tracking-tight text-foreground">
                    {it.duration}
                  </span>
                  <div
                    className={[
                      "grid h-9 w-9 place-items-center rounded-full",
                      idx === 1 ? "bg-brand-green text-white" : "bg-brand-gold text-[#0a1410]",
                    ].join(" ")}
                  >
                    <PlayIcon />
                  </div>
                </div>
              </div>
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                {it.type}
              </div>
              <h3 className="mt-2 font-serif text-xl font-semibold leading-tight tracking-tight">
                {it.title}
                <em className="font-medium not-italic text-brand-gold">
                  {it.titleEm}
                </em>
              </h3>
              <p className="mt-2 text-sm leading-[1.65] text-muted-foreground">
                {it.desc}
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3.5 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                <span>tagged · {it.tag}</span>
                <span
                  className={[
                    "rounded-sm px-2 py-0.5 font-bold",
                    idx === 1
                      ? "bg-brand-green/10 text-brand-green"
                      : "bg-brand-gold/10 text-brand-gold",
                  ].join(" ")}
                >
                  rubric
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PitchOSCallout() {
  return (
    <section className="border-b border-border/60 py-24">
      <div className="mx-auto max-w-6xl px-8">
        <div className="relative grid grid-cols-1 items-center gap-14 overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-forest to-bg-3 px-12 py-14 lg:grid-cols-[1.4fr_1fr]">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand-gold via-brand-green to-brand-gold" />
          <div>
            <div className="mb-5 inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-brand-gold">
              <span>★</span>
              the premium tier
            </div>
            <h2 className="mb-5 font-serif text-4xl font-semibold leading-tight tracking-tight">
              PitchOS · the partner memo your deck deserves —{" "}
              <em className="font-medium not-italic text-brand-gold">
                before
              </em>{" "}
              you send it.
            </h2>
            <p className="mb-5 text-base leading-[1.7] text-muted-foreground">
              <strong className="font-semibold text-foreground">
                Not a generic AI deck grader.
              </strong>{" "}
              The 7-layer prompt architecture encodes Scott&rsquo;s judgment as
              software: closed 16-pattern anti-pattern catalog, partner-voice
              transfer with regression test, every claim cited to a slide
              quote, multi-agent disagreement surfaced explicitly.
            </p>
            <p className="text-base leading-[1.7] text-muted-foreground">
              The output reads like Scott wrote it. That&rsquo;s the bar.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/pitchos"
                className="inline-flex items-center gap-2 rounded-md bg-brand-gold px-5 py-3 text-sm font-bold text-[#0a1410] transition hover:bg-brand-gold-2"
              >
                Try PitchOS →
              </Link>
              <Link
                href="/#pricing"
                className="inline-flex items-center gap-2 rounded-md border border-border/80 px-5 py-3 text-sm font-semibold text-foreground transition hover:border-muted-foreground hover:bg-muted/40"
              >
                See plans
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 font-mono">
            <Stat n="11" l="rubric dimensions weighted to Scott" />
            <Stat n="16" l="named anti-patterns in the closed catalog" />
            <Stat n="9" l="LLM-call analysis chain · multi-agent" />
            <Stat n="≥8" l="slide citations enforced per memo" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div className="rounded-lg border border-brand-gold/20 bg-brand-gold/5 px-5 py-4">
      <div className="font-mono text-3xl font-bold leading-none tracking-tight text-brand-gold">
        {n}
      </div>
      <div className="mt-2 font-mono text-[10px] font-semibold uppercase leading-tight tracking-[0.06em] text-muted-foreground">
        {l}
      </div>
    </div>
  );
}

function PricingLadder() {
  const tiers = [
    {
      name: "Free",
      price: "$0",
      tag: "Top of funnel",
      perks: [
        "All YouTube content",
        "50% of podcast catalog",
        "Monthly free workshop",
        "Founder Journey Rubric self-assessment",
      ],
      cta: "Sign up",
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
      ],
      cta: "Subscribe",
    },
    {
      name: "Founder Pro",
      price: "$99",
      tag: "Active fundraisers",
      perks: [
        "Insider · plus",
        "AI Coach (Scott-bot, RAG)",
        "4 courses + cohort group",
        "Investor-list access",
      ],
      cta: "Subscribe",
    },
    {
      name: "PitchOS Premium",
      price: "$299",
      tag: "The deep-grade exam",
      perks: [
        "Founder Pro · plus",
        "Partner-grade memos",
        "Objection simulator + Q&A rehearsal",
        "4 deck analyses / month",
      ],
      cta: "Run PitchOS →",
      featured: true,
      ctaHref: "/pitchos",
    },
    {
      name: "Fund Manager",
      price: "$499",
      tag: "Emerging fund GP",
      perks: [
        "Founder Pro + PitchOS fund-side",
        "Emerging Managers back catalog",
        "LP intro guides",
        "Cohort with other emerging GPs",
      ],
      cta: "Apply",
    },
  ];
  return (
    <section id="pricing" className="border-b border-border/60 bg-bg-2/40 py-24">
      <div className="mx-auto max-w-6xl px-8">
        <SectionHead
          meta="03 · pricing"
          title="A tier for "
          titleEm="every stage of the lifecycle"
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {tiers.map((t) => (
            <article
              key={t.name}
              className={[
                "relative flex flex-col rounded-xl border p-6",
                t.featured
                  ? "border-brand-gold/40 bg-gradient-to-b from-brand-gold/5 to-bg-card shadow-[0_12px_32px_rgba(245,200,66,0.05)]"
                  : "border-border bg-bg-card",
              ].join(" ")}
            >
              {t.featured && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-sm bg-brand-gold px-2.5 py-0.5 font-mono text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#0a1410]">
                  most popular
                </div>
              )}
              <div className="mb-3.5 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                {t.name}
              </div>
              <div className="font-serif text-3xl font-semibold leading-none tracking-tight">
                {t.price}
                <span className="ml-0.5 font-mono text-xs font-medium text-muted-foreground">
                  /mo
                </span>
              </div>
              <div className="mb-4 mt-1.5 text-[11px] leading-[1.4] text-muted-foreground">
                {t.tag}
              </div>
              <ul className="flex-1 text-[12.5px] leading-[1.5] text-muted-foreground">
                {t.perks.map((p, i) => (
                  <li
                    key={i}
                    className="relative border-b border-dashed border-border py-2 pl-4 last:border-b-0"
                  >
                    <span className="absolute left-0 top-3.5 h-1 w-1 rounded-full bg-brand-green" />
                    {p}
                  </li>
                ))}
              </ul>
              <Link
                href={t.ctaHref ?? "/library"}
                className={[
                  "mt-4 rounded-md px-3 py-2 text-center text-xs font-semibold transition",
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
      </div>
    </section>
  );
}

function AboutScott() {
  return (
    <section id="about" className="border-b border-border/60 py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-8 lg:grid-cols-[1fr_1.4fr]">
        <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-b from-bg-card to-forest p-9">
          <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(245,200,66,0.15),transparent_70%)]" />
          <div className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-brand-gold">
            founder
          </div>
          <div className="mt-3 font-serif text-4xl font-semibold leading-[1.05] tracking-tight">
            Scott Kelly
          </div>
          <div className="mt-2 font-serif text-[13px] italic leading-[1.55] text-muted-foreground">
            Founder &amp; CEO · Black Dog Venture Partners
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3.5 font-mono">
            <Mini n="30+" l="years operator-investor" />
            <Mini n="13K" l="investor network" />
            <Mini n="40K" l="business partners" />
            <Mini n="50+" l="VC Fast Pitch episodes" />
          </div>
        </div>

        <div>
          <h2 className="mb-5 font-serif text-3xl font-semibold leading-[1.15] tracking-tight">
            The platform is built around{" "}
            <em className="font-medium not-italic text-brand-gold">
              one specific partner&rsquo;s judgment
            </em>{" "}
            — that&rsquo;s the wedge.
          </h2>
          <p className="mb-3.5 font-serif text-[15px] leading-[1.75] text-muted-foreground">
            <strong className="font-semibold text-foreground">
              Generic AI deck graders commoditize in 18 months.
            </strong>{" "}
            What doesn&rsquo;t commoditize is partner-specific judgment encoded
            as software, partner-voiced memos with regression tests, content
            corpus woven through every surface, and an AI Coach grounded in a
            real person&rsquo;s actual statements with deep links to source
            clips.
          </p>
          <p className="font-serif text-[15px] leading-[1.75] text-muted-foreground">
            Scott has been teaching this curriculum for ten years across VC
            Fast Pitch, the Emerging Managers Podcast, and Black Dog Venture
            Partners. The platform is the system that turns that curriculum
            into a graded path from zero to funded.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 font-mono text-[11px] font-semibold uppercase tracking-[0.06em]">
            <a
              href="https://www.linkedin.com/in/blackdogceo/"
              target="_blank"
              rel="noreferrer"
              className="text-brand-gold hover:underline"
            >
              LinkedIn
            </a>
            <span className="text-muted-foreground">·</span>
            <a
              href="https://www.youtube.com/@VCFastPitch"
              target="_blank"
              rel="noreferrer"
              className="text-brand-gold hover:underline"
            >
              VC Fast Pitch
            </a>
            <span className="text-muted-foreground">·</span>
            <a
              href="https://blackdogventurepartners.com/"
              target="_blank"
              rel="noreferrer"
              className="text-brand-gold hover:underline"
            >
              Black Dog VP
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Mini({ n, l }: { n: string; l: string }) {
  return (
    <div className="rounded-md border border-brand-gold/20 bg-brand-gold/5 px-3.5 py-3">
      <div className="font-mono text-xl font-bold leading-none tracking-tight text-brand-gold">
        {n}
      </div>
      <div className="mt-1.5 font-mono text-[9px] font-semibold uppercase leading-tight tracking-[0.08em] text-muted-foreground">
        {l}
      </div>
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="bg-bg-2 py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-8 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="font-serif text-base font-semibold">
            Black Dog · The Founder Platform
          </div>
          <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.06em] text-muted-foreground">
            Pitch · Score · Fund
          </div>
        </div>
        <FootCol
          title="Platform"
          links={[
            { href: "/library", label: "Content Library" },
            { href: "/coach", label: "AI Coach" },
            { href: "/pitchos", label: "PitchOS Premium" },
            { href: "/#pricing", label: "Pricing" },
          ]}
        />
        <FootCol
          title="Scott"
          links={[
            { href: "https://blackdogventurepartners.com/", label: "Black Dog VP", external: true },
            { href: "https://www.youtube.com/@VCFastPitch", label: "VC Fast Pitch", external: true },
            { href: "https://www.linkedin.com/in/blackdogceo/", label: "LinkedIn", external: true },
          ]}
        />
        <FootCol
          title="Build"
          links={[
            { href: "/#about", label: "About this prototype" },
            { href: "/pitchos", label: "Try the demo" },
          ]}
        />
      </div>
      <div className="mx-auto mt-12 max-w-6xl border-t border-border/60 px-8 pt-6 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
        prototype · prompt v0.2 · rubric v1.3 · profile v1.0
      </div>
    </footer>
  );
}

function FootCol({
  title,
  links,
}: {
  title: string;
  links: Array<{ href: string; label: string; external?: boolean }>;
}) {
  return (
    <div>
      <h4 className="mb-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
        {title}
      </h4>
      <ul className="space-y-2 text-[13px] text-foreground/80">
        {links.map((l) => (
          <li key={l.href + l.label}>
            {l.external ? (
              <a
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-brand-gold"
              >
                {l.label}
              </a>
            ) : (
              <Link href={l.href} className="transition hover:text-brand-gold">
                {l.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SectionHead({
  meta,
  title,
  titleEm,
  seeAll,
}: {
  meta: string;
  title: string;
  titleEm: string;
  seeAll?: { href: string; label: string };
}) {
  return (
    <div className="mb-12 flex flex-wrap items-end justify-between gap-8 border-b border-border/60 pb-5">
      <div>
        <div className="mb-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-brand-gold">
          {meta}
        </div>
        <h2 className="font-serif text-4xl font-semibold leading-tight tracking-tight">
          {title}
          <em className="font-medium not-italic text-brand-green">
            {titleEm}
          </em>
        </h2>
      </div>
      {seeAll && (
        <Link
          href={seeAll.href}
          className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-brand-gold hover:underline"
        >
          {seeAll.label}
        </Link>
      )}
    </div>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
