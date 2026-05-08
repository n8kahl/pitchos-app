"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function EnterPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const res = await fetch("/api/auth/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (res.ok) {
      router.push(params.get("next") ?? "/dashboard");
      router.refresh();
    } else {
      setError(true);
      setPassword("");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-brand-gold">
            Black Dog VP
          </div>
          <h1 className="mt-3 font-prose text-3xl font-semibold tracking-tight text-foreground">
            PitchOS
          </h1>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            Partner platform · private access
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoFocus
              required
              className={[
                "w-full rounded-md border bg-card/60 px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition",
                error
                  ? "border-signal-red/60 focus:border-signal-red"
                  : "border-border focus:border-brand-gold/60",
              ].join(" ")}
            />
            {error && (
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-signal-red">
                Incorrect password
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full rounded-md bg-brand-gold/10 border border-brand-gold/30 px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-brand-gold transition hover:bg-brand-gold/20 disabled:opacity-40"
          >
            {loading ? "Verifying…" : "Enter"}
          </button>
        </form>
      </div>
    </main>
  );
}
