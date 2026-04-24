import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getAllPlayers } from "@/services/api";
import { Skeleton } from "@/components/Skeleton";
import { AdSlot } from "@/components/AdSlot";
import { Trophy } from "lucide-react";

export const Route = createFileRoute("/stats")({
  head: () => ({
    meta: [
      { title: "IPL 2025 Statistics — Orange Cap, Purple Cap, Records" },
      { name: "description", content: "In-depth IPL 2025 stats: Orange Cap, Purple Cap, most sixes, dot balls and team records." },
    ],
  }),
  component: StatsPage,
});

function StatsPage() {
  const { data: players, isLoading } = useQuery({ queryKey: ["players"], queryFn: getAllPlayers });

  const orangeCap = [...(players ?? [])].sort((a, b) => b.stats.runs - a.stats.runs).slice(0, 5);
  const purpleCap = [...(players ?? [])].sort((a, b) => b.stats.wickets - a.stats.wickets).slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-4xl font-bold">Statistics</h1>
        <p className="text-sm text-muted-foreground mt-1">In-depth IPL 2025 statistics and records.</p>
      </div>

      {/* Highlight cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Highest Total", value: "263/5", sub: "SRH vs RCB" },
          { label: "Highest Score", value: "109* (54)", sub: "A. Sharma (SRH)" },
          { label: "Most Runs", value: "607", sub: "S. Gill (GT)" },
          { label: "Most Wickets", value: "20", sub: "J. Hazlewood" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border/60 gradient-card p-5">
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <div className="font-display text-2xl font-bold mt-1">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_1fr_320px] gap-6">
        {/* Orange Cap */}
        <div className="rounded-2xl border border-border/60 gradient-card p-5 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-5 w-5 text-accent" />
            <h3 className="font-bold">Orange Cap</h3>
            <span className="text-xs text-muted-foreground">Most Runs</span>
          </div>
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 mb-2" />)
            : orangeCap.map((p, i) => (
                <div key={p.id} className="flex items-center gap-3 py-2.5 border-b border-border/40 last:border-0">
                  <span className="text-sm font-bold text-muted-foreground w-5">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{p.shortName} <span className="text-muted-foreground text-xs">({p.teamId.toUpperCase()})</span></div>
                  </div>
                  <div className="text-right">
                    <div className="font-display font-bold text-accent">{p.stats.runs}</div>
                    <div className="text-[10px] text-muted-foreground">Runs</div>
                  </div>
                </div>
              ))}
        </div>

        {/* Purple Cap */}
        <div className="rounded-2xl border border-border/60 gradient-card p-5 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-5 w-5 text-secondary" />
            <h3 className="font-bold">Purple Cap</h3>
            <span className="text-xs text-muted-foreground">Most Wickets</span>
          </div>
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 mb-2" />)
            : purpleCap.map((p, i) => (
                <div key={p.id} className="flex items-center gap-3 py-2.5 border-b border-border/40 last:border-0">
                  <span className="text-sm font-bold text-muted-foreground w-5">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{p.shortName} <span className="text-muted-foreground text-xs">({p.teamId.toUpperCase()})</span></div>
                  </div>
                  <div className="text-right">
                    <div className="font-display font-bold text-secondary">{p.stats.wickets}</div>
                    <div className="text-[10px] text-muted-foreground">Wickets</div>
                  </div>
                </div>
              ))}
        </div>

        <AdSlot variant="sidebar" />
      </div>

      <div className="rounded-2xl border border-border/60 gradient-card p-5">
        <h3 className="font-bold mb-4">IPL 2025 Records</h3>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            ["Most Runs in a Match", "263/5", "SRH vs RCB"],
            ["Highest Successful Chase", "262/2", "GT vs DC"],
            ["Best Bowling Figures", "4/18", "J. Hazlewood (RCB)"],
            ["Most Runs in Powerplay", "92/0", "GT vs MI"],
            ["Most 6s in a Match", "22", "SRH vs PBKS"],
          ].map(([k, v, s]) => (
            <div key={k} className="text-center p-3 rounded-xl bg-muted/30">
              <div className="text-xs text-muted-foreground">{k}</div>
              <div className="font-display text-xl font-bold mt-1">{v}</div>
              <div className="text-[10px] text-muted-foreground mt-1">{s}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
