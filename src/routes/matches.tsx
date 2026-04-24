import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMatches } from "@/services/api";
import { TeamLogo } from "@/components/TeamLogo";
import { Skeleton } from "@/components/Skeleton";
import { AdSlot } from "@/components/AdSlot";
import { Calendar, Clock, MapPin, Bell, Radio } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/matches")({
  head: () => ({
    meta: [
      { title: "IPL 2025 Matches & Schedule" },
      { name: "description", content: "Full IPL 2025 match schedule with dates, venues, and live updates." },
    ],
  }),
  component: MatchesPage,
});

const TEAM_COLORS: Record<string, string> = { csk: "0.75 0.18 75", mi: "0.55 0.22 250", rcb: "0.55 0.24 25", kkr: "0.45 0.18 305", srh: "0.7 0.22 45", dc: "0.55 0.22 250", pbks: "0.6 0.24 20", rr: "0.65 0.24 340", gt: "0.4 0.12 240", lsg: "0.55 0.2 200" };

function MatchesPage() {
  const { data: matches, isLoading } = useQuery({ queryKey: ["matches"], queryFn: getMatches });
  const [filter, setFilter] = useState<"all" | "live" | "upcoming">("all");

  const filtered = matches?.filter((m) => filter === "all" || m.status === filter) ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8 grid lg:grid-cols-[1fr_320px] gap-8">
      <div>
        <h1 className="text-4xl font-bold">Matches</h1>
        <p className="text-sm text-muted-foreground mt-1">Live, upcoming and recent IPL 2025 matches.</p>

        <div className="mt-6 flex gap-2">
          {(["all", "live", "upcoming"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition ${
                filter === f ? "gradient-primary text-primary-foreground shadow-glow" : "border border-border bg-card hover:bg-muted"
              }`}
            >
              {f === "all" ? "All Matches" : f}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-32" />)
            : filtered.map((m) => (
                <div key={m.id} className="rounded-2xl border border-border/60 gradient-card p-4 sm:p-5 shadow-card hover:border-primary/40 transition">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="rounded bg-secondary/30 px-2 py-0.5 text-[10px] font-bold uppercase text-secondary">Match {m.number}</span>
                    {m.status === "live" && (
                      <span className="inline-flex items-center gap-1 rounded bg-live px-2 py-0.5 text-[10px] font-bold uppercase text-live-foreground">
                        <span className="h-1 w-1 rounded-full bg-white live-pulse" /> LIVE
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-[2fr_2fr] gap-4 items-center">
                    <div className="flex items-center justify-around gap-3">
                      <div className="flex flex-col items-center gap-2">
                        <TeamLogo shortName={m.team1.short} color={TEAM_COLORS[m.team1.id]} size="lg" />
                        <span className="text-sm font-semibold">{m.team1.short}</span>
                      </div>
                      <div className="text-xs font-bold text-muted-foreground">VS</div>
                      <div className="flex flex-col items-center gap-2">
                        <TeamLogo shortName={m.team2.short} color={TEAM_COLORS[m.team2.id]} size="lg" />
                        <span className="text-sm font-semibold">{m.team2.short}</span>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-4 w-4 text-primary" /> {m.date}</div>
                      <div className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4 text-primary" /> {m.time}</div>
                      <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4 text-primary" /> {m.venue}</div>
                      {m.status === "live" ? (
                        <Link to="/live/$matchId" params={{ matchId: m.id }} className="inline-flex items-center gap-2 rounded-lg gradient-primary px-4 py-2 text-xs font-semibold text-primary-foreground">
                          <Radio className="h-3 w-3" /> Watch Live
                        </Link>
                      ) : (
                        <button className="inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary">
                          <Bell className="h-3 w-3" /> Remind Me
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>

      <aside className="space-y-4">
        <div className="rounded-2xl gradient-hero p-6 shadow-glow">
          <div className="text-xs font-bold uppercase tracking-widest text-white/80">IPL 2025</div>
          <h3 className="mt-2 font-display text-3xl font-bold text-white leading-tight">THE BATTLE IS ON!</h3>
          <p className="mt-2 text-sm text-white/80">Every ball. Every moment.</p>
        </div>
        <AdSlot variant="sidebar" />
        <div className="rounded-2xl border border-border/60 gradient-card p-5">
          <h4 className="font-semibold">Match Alerts</h4>
          <p className="text-xs text-muted-foreground mt-1">Get notified for live matches & key moments.</p>
        </div>
      </aside>
    </div>
  );
}
