"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Status =
  | { kind: "idle" }
  | { kind: "uploading"; fileName: string }
  | { kind: "error"; message: string };

export function UploadDropzone() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [dragOver, setDragOver] = useState(false);

  const upload = useCallback(
    async (file: File) => {
      setStatus({ kind: "uploading", fileName: file.name });
      const body = new FormData();
      body.set("file", file);
      try {
        const res = await fetch("/api/decks/upload", { method: "POST", body });
        const json = (await res.json()) as
          | { deckId: string; projectId: string; runId: string; reused: boolean }
          | { error: string };
        if (!res.ok || "error" in json) {
          throw new Error("error" in json ? json.error : "Upload failed");
        }
        router.push(`/runs/${json.runId}`);
      } catch (err) {
        setStatus({
          kind: "error",
          message: err instanceof Error ? err.message : "Upload failed",
        });
      }
    },
    [router]
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) void upload(file);
    },
    [upload]
  );

  const isUploading = status.kind === "uploading";

  return (
    <div className="w-full max-w-xl">
      <label
        htmlFor="deck-upload-input"
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={[
          "group relative flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border border-dashed transition",
          dragOver
            ? "border-signal-cyan bg-signal-cyan/5"
            : "border-border bg-card/40 hover:border-signal-cyan/60 hover:bg-card/60",
          isUploading ? "pointer-events-none opacity-60" : "",
        ].join(" ")}
      >
        <input
          ref={inputRef}
          id="deck-upload-input"
          type="file"
          accept="application/pdf"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void upload(file);
          }}
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-signal-cyan border-t-transparent" />
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              uploading {status.fileName}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-center">
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              fill="none"
              className="h-10 w-10 stroke-signal-cyan/80 transition group-hover:stroke-signal-cyan"
              strokeWidth="1.5"
            >
              <path d="M12 16V4M12 4l-4 4M12 4l4 4" strokeLinecap="round" />
              <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" strokeLinecap="round" />
            </svg>
            <div>
              <div className="font-medium text-foreground">
                Drop a pitch deck PDF here
              </div>
              <div className="mt-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                or click to choose · max 25 MB · 40 pages
              </div>
            </div>
          </div>
        )}
      </label>

      {status.kind === "error" && (
        <div className="mt-4 rounded-md border border-signal-red/40 bg-signal-red/5 px-4 py-3 text-sm text-signal-red">
          {status.message}
        </div>
      )}
    </div>
  );
}
