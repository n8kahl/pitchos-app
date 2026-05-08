import Link from "next/link";
import { notFound } from "next/navigation";
import { LIBRARY_RESOURCES, getResourceById } from "@/lib/content/resources";
import { GeneratedPodcastView } from "@/components/library/GeneratedPodcastView";

type PageProps = {
  params: Promise<{ resourceId: string }>;
  searchParams: Promise<{ generate?: string }>;
};

export function generateStaticParams() {
  return LIBRARY_RESOURCES.map((r) => ({ resourceId: r.id }));
}

export default async function ResourcePodcastPage({
  params,
  searchParams,
}: PageProps) {
  const { resourceId } = await params;
  const { generate } = await searchParams;
  const resource = getResourceById(resourceId);
  if (!resource) notFound();

  return (
    <main className="mx-auto max-w-4xl px-5 py-8 sm:px-8 sm:py-10">
      {/* Breadcrumb */}
      <div className="mb-5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
        <Link href="/library" className="text-brand-gold hover:text-brand-gold-2">
          ← library
        </Link>
        <span className="mx-2 text-muted-foreground/60">/</span>
        <Link
          href={`/library/resources/${resource.id}`}
          className="hover:text-foreground"
        >
          {resource.title}
        </Link>
        <span className="mx-2 text-muted-foreground/60">/</span>
        <span className="text-foreground">podcast</span>
      </div>

      <GeneratedPodcastView
        resourceId={resource.id}
        resourceTitle={resource.title}
        resourceSource={resource.source}
        coverEyebrow={resource.coverEyebrow}
        coverTitle={resource.coverTitle}
        coverAccent={resource.coverAccent}
        blurb={resource.blurb}
        rubricDims={resource.rubricDims}
        autoGenerate={generate === "1"}
      />
    </main>
  );
}
