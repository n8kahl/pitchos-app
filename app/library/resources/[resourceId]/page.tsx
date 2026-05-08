import Link from "next/link";
import { notFound } from "next/navigation";
import { LIBRARY_RESOURCES, getResourceById } from "@/lib/content/resources";
import { ResourceViewer } from "@/components/library/ResourceViewer";

type PageProps = {
  params: Promise<{ resourceId: string }>;
  searchParams: Promise<{ t?: string }>;
};

export function generateStaticParams() {
  return LIBRARY_RESOURCES.map((r) => ({ resourceId: r.id }));
}

export default async function ResourcePage({ params, searchParams }: PageProps) {
  const { resourceId } = await params;
  const { t } = await searchParams;
  const resource = getResourceById(resourceId);
  if (!resource) notFound();

  const filename = resource.fileUrl.split("/").pop() ?? "resource";
  const sizeLabel =
    resource.fileSizeKB && resource.fileSizeKB >= 1024
      ? `${(resource.fileSizeKB / 1024).toFixed(1)} MB`
      : resource.fileSizeKB
      ? `${resource.fileSizeKB} KB`
      : "";

  return (
    <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-10">
      {/* Breadcrumb */}
      <div className="mb-5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
        <Link href="/library" className="text-brand-gold hover:text-brand-gold-2">
          ← library
        </Link>
        <span className="mx-2 text-muted-foreground/60">/</span>
        <span>resources</span>
        <span className="mx-2 text-muted-foreground/60">/</span>
        <span className="text-foreground">{resource.source}</span>
      </div>

      <header className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-border/40 pb-6">
        <div className="min-w-0 flex-1">
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-brand-gold">
            {resource.kind === "pdf" ? "pdf · resource" : "infographic · resource"} ·{" "}
            {resource.source}
          </div>
          <h1 className="mt-2 font-serif text-3xl font-semibold sm:text-4xl leading-[1.05] tracking-tight text-foreground">
            {resource.title}
          </h1>
          <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            {resource.kind === "pdf"
              ? `${resource.pages ?? "?"} pages · ${sizeLabel}`
              : "single page · infographic"}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <a
            href={resource.fileUrl}
            download={filename}
            className="rounded-md border border-border/80 px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-foreground/85 transition hover:border-brand-gold/40 hover:text-foreground"
          >
            Download
          </a>
          <a
            href={resource.fileUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-md bg-brand-gold px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#0a1410] transition hover:bg-brand-gold-2"
          >
            Open in new tab →
          </a>
        </div>
      </header>

      <ResourceViewer resource={resource} initialT={t} />

      {/* Operator blurb */}
      <div className="mt-6 rounded-xl border border-brand-gold/20 bg-brand-gold/5 p-5">
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gold">
          ★ why this is in the corpus
        </div>
        <p className="mt-2 font-serif text-[15px] leading-[1.7] text-foreground/90">
          {resource.blurb}
        </p>
      </div>

      {/* Tags */}
      <section className="mt-8">
        <div className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          rubric dimensions covered
        </div>
        <div className="flex flex-wrap gap-2">
          {resource.rubricDims.map((d) => (
            <span
              key={d}
              className="rounded-md bg-brand-gold/10 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-brand-gold"
            >
              {d}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-4">
        <div className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          journey stages
        </div>
        <div className="flex flex-wrap gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-foreground/80">
          {resource.journeyStages.map((s) => (
            <span
              key={s}
              className="rounded-md border border-border/60 bg-card/40 px-2.5 py-1"
            >
              stage {s}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
