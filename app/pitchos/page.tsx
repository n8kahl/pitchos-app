import { UploadDropzone } from "@/components/upload/UploadDropzone";

export default function PitchOSPage() {
  return (
    <main className="mx-auto max-w-6xl px-8 py-10">
      <header className="mb-8 border-b border-border/40 pb-6">
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-brand-gold">
          ★ pitchos premium · the deep-grade exam
        </div>
        <h1 className="mt-2 font-serif text-3xl font-semibold sm:text-4xl leading-[1.05] tracking-tight text-foreground">
          The partner memo your deck deserves —
          <span className="text-brand-gold"> before</span> you send it.
        </h1>
        <p className="mt-3 max-w-2xl font-serif text-[15px] leading-relaxed text-muted-foreground">
          Drop a seed-stage pitch deck. PitchOS scores it against the Black
          Dog VP rubric v1.3, surfaces the named anti-patterns Scott would
          flag, and returns a partner-voiced memo grounded in every slide
          quote.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_minmax(0,520px)]">
        <div className="space-y-7">
          <Capability
            num="01"
            title="11-dimension partner rubric"
            body="Founder-market fit weighted highest. Wedge clarity and traction quality tied second. Stage-aware overrides for pre-seed and Series A."
          />
          <Capability
            num="02"
            title="Closed 16-pattern catalog"
            body="Every detection anchors to a verbatim slide quote. No invented categories. Scott's two custom patterns layered on top."
          />
          <Capability
            num="03"
            title="Multi-agent disagreement surfaced"
            body="Partner / Coach / CFO / Market / Design / Risk run in parallel. Conflicts adjudicated and rendered explicitly in the memo."
          />
          <Capability
            num="04"
            title="Voice regression in CI"
            body="≥8 slide citations, signature open, decision close, zero banned phrases. Memos that fail twice are auto-rejected."
          />
        </div>

        <div className="flex flex-col items-stretch">
          <UploadDropzone />
          <div className="mt-4 rounded-md border border-border/60 bg-card/30 p-4 font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-muted-foreground">
            mock provider · returns deterministic Scott-voiced output on the
            MeshOps fixture · ~2 second analysis chain · live AI ships in
            phase 7
          </div>
        </div>
      </div>
    </main>
  );
}

function Capability({
  num,
  title,
  body,
}: {
  num: string;
  title: string;
  body: string;
}) {
  return (
    <div className="grid grid-cols-[44px_1fr] gap-4">
      <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-brand-gold">
        {num}
      </div>
      <div>
        <div className="font-serif text-[17px] font-semibold leading-snug text-foreground">
          {title}
        </div>
        <p className="mt-1.5 font-serif text-[14px] leading-[1.7] text-muted-foreground">
          {body}
        </p>
      </div>
    </div>
  );
}
