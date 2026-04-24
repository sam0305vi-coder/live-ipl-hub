import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getTeams } from "@/services/api";
import { TeamLogo } from "@/components/TeamLogo";
import { Skeleton } from "@/components/Skeleton";
import { AdSlot } from "@/components/AdSlot";
import { Trophy } from "lucide-react";

export const Route = createFileRoute("/points-table")({
  head: () => ({
    meta: [
      { title: "IPL 2025 Points Table & Standings" },
      { name: "description", content: "Live IPL 2025 points table with NRR, recent form and playoff standings." },
    ],
  }),
  component: PointsPage,
});

function PointsPage() {
  const { data: teams, isLoading } = useQuery({ queryKey: ["teams"], queryFn: getTeams });

  // Synthesize standings from team stats
  const rows = (teams ?? [])
    .map((t) => {
      const p = 11;
      const w = Math.min(t.recentForm.filter((r) => r === "W").length + 4, p);
      const l = p - w;
      return { ...t, p, w, l, nr: 0, pts: w * 2, nrr: (Math.random() * 1.5 - 0.75).toFixed(3) };
    })
    .sort((a, b) => b.pts - a.pts || parseFloat(b.nrr) - parseFloat(a.nrr));

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8 grid lg:grid-cols-[1fr_320px] gap-8">
      <div>
        <h1 className="text-4xl font-bold">IPL 2025 Points Table</h1>
        <p className="text-sm text-muted-foreground mt-1">The race to the playoffs heats up. Latest standings.</p>

        <div className="mt-6 rounded-2xl border border-border/60 gradient-card overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase text-muted-foreground">
                  <th className="text-left p-3 w-10">#</th>
                  <th className="text-left p-3">Team</th>
                  <th className="text-center p-3">P</th>
                  <th className="text-center p-3">W</th>
                  <th className="text-center p-3">L</th>
                  <th className="text-center p-3 hidden sm:table-cell">NR</th>
                  <th className="text-center p-3 font-bold text-foreground">Pts</th>
                  <th className="text-center p-3">NRR</th>
                  <th className="text-left p-3 hidden md:table-cell">Last 5</th>
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array.from({ length: 10 }).map((_, i) => (
                      <tr key={i}><td colSpan={9} className="p-2"><Skeleton className="h-10" /></td></tr>
                    ))
                  : rows.map((r, idx) => (
                      <tr key={r.id} className="border-b border-border/40 hover:bg-muted/30 transition">
                        <td className="p-3 font-bold text-muted-foreground">{idx + 1}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <TeamLogo shortName={r.shortName} color={r.primaryColor} size="sm" />
                            <span className="font-semibold">{r.name}</span>
                          </div>
                        </td>
                        <td className="text-center p-3">{r.p}</td>
                        <td className="text-center p-3 font-semibold text-emerald-400">{r.w}</td>
                        <td className="text-center p-3 text-destructive">{r.l}</td>
                        <td className="text-center p-3 hidden sm:table-cell">{r.nr}</td>
                        <td className="text-center p-3 font-bold">{r.pts}</td>
                        <td className="text-center p-3 text-xs">{parseFloat(r.nrr) > 0 ? "+" : ""}{r.nrr}</td>
                        <td className="p-3 hidden md:table-cell">
                          <div className="flex gap-1">
                            {r.recentForm.map((f, i) => (
                              <span key={i} className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${f === "W" ? "bg-emerald-600" : "bg-destructive"}`}>{f}</span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 flex flex-wrap gap-4 text-xs text-muted-foreground border-t border-border/40">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Qualified for Playoffs</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-secondary" /> Playoff Stage</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-destructive" /> Out of Playoffs</span>
          </div>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="rounded-2xl border border-border/60 gradient-card p-5">
          <h4 className="font-semibold mb-3 flex items-center gap-2"><Trophy className="h-4 w-4 text-accent" /> Season Stats</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><div className="text-2xl font-bold font-display">8,523</div><div className="text-xs text-muted-foreground">Total Runs</div></div>
            <div><div className="text-2xl font-bold font-display">256</div><div className="text-xs text-muted-foreground">Total Wickets</div></div>
            <div><div className="text-2xl font-bold font-display">312</div><div className="text-xs text-muted-foreground">Total Sixes</div></div>
            <div><div className="text-2xl font-bold font-display">56</div><div className="text-xs text-muted-foreground">Matches Played</div></div>
          </div>
        </div>
        <AdSlot variant="sidebar" />
      </aside>
    </div>
  );
}
