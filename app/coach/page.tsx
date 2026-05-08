"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCoach } from "@/lib/state/coach";

// /coach is no longer a standalone page · the persistent rail at lg+
// IS the Coach surface. This route survives as a deep link target so
// that anything previously linking to /coach (chord nav, palette,
// external bookmarks) keeps working — it opens the rail and replaces
// the URL with the prior context (or Home if no prior).
export default function CoachRedirectPage() {
  const router = useRouter();
  const { open: openCoach } = useCoach();

  useEffect(() => {
    openCoach();
    router.replace("/");
  }, [router, openCoach]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-brand-gold to-brand-green text-[14px] font-bold text-[#0a1410]">
        S
      </div>
      <div className="mt-4 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-brand-gold">
        opening coach
      </div>
      <p className="mt-2 font-serif text-[15px] leading-snug text-muted-foreground">
        Scott now lives in the side rail · always reachable from any page.
      </p>
    </main>
  );
}
