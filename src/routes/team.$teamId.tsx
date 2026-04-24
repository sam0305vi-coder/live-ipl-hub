import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getTeamById, type Player } from "@/services/api";
import { TeamLogo } from "@/components/TeamLogo";
import { Skeleton } from "@/components/Skeleton";
import { ArrowLeft, Trophy, MapPin, User } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/team/$teamId")({
  loader: ({ context: { queryClient }, params }) =>
    queryClient.ensureQueryData({ queryKey: ["team", params.teamId], queryFn: () => getTeamById(params.teamId) }),
  head: ({ params }) => ({
    meta: [
      { title: `${params.teamId.toUpperCase()} — Squad, Stats & Info — IPL 2025` },
      { name: "description", content: `Full squad, stats and recent form for ${params.teamId.toUpperCase()} in IPL 2025.` },
    ],
  }),
  errorComponent: ({ error }) => {
    const router = useRouter();
    return (
      <div className="p-12 text-center">
        <p className="text-destructive">{error.message}</p>
        <button onClick={() => router.invalidate()} className="mt-4 rounded-md gradient-primary px-4 py-2 text-sm">Retry</button>
      </div>
    );
  },
  notFoundComponent: () => (
    <div className="p-12 text-center">
      <p>Team not found.</p>
      <Link to="/teams" className="mt-4 inline-block text-primary">Back to teams</Link>
    </div>
  ),
  component: TeamDetailPage,
});

function TeamDetailPage() {
  const { teamId } = Route.useParams();
  const { data: team, isLoading } = useQuery({ queryKey: ["team", teamId], queryFn: () => getTeamById(teamId) });
  const [tab, setTab] = useState<"Squad" | "Overview" | "Stats">("Squad");

  if (isLoading || !team) {
    return <div className="mx-auto max-w-7xl p-8 space-y-4"><Skeleton className="h-40" /><Skeleton className="h-96" /></div>;
  }

  const groups: Record<string, Player[]> = {
    "Wicket Keepers": team.squad.filter((p) => p.role === "Wicket Keeper"),
    "Batters": team.squad.filter((p) => p.role === "Batter"),
    "All Rounders": team.squad.filter((p) => p.role === "All Rounder"),
    "Bowlers": team.squad.filter((p) => p.role === "Bowler"),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-6 grid lg:grid-cols-[1fr_320px] gap-8">
      <div>
        <Link to="/teams" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to All Teams
        </Link>

        {/* Banner */}
        <div
          className="rounded-3xl p-6 sm:p-8 border border-border/60 shadow-card relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, oklch(${team.primaryColor} / 0.35), oklch(${team.primaryColor} / 0.05))` }}
        >
          <div className="flex items-center gap-5 flex-wrap">
            <TeamLogo shortName={team.shortName} color={team.primaryColor} size="xl" />
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold">{team.name}</h1>
              <div className="text-sm text-muted-foreground mt-1">{team.shortName} • Founded {team.founded}</div>
              <div className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold">
                <Trophy className="h-4 w-4 text-accent" />
                {team.titles > 0 ? `${team.titles} Titles (${team.titleYears})` : "0 Titles"}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex gap-2 border-b border-border">
          {(["Squad", "Overview", "Stats"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${tab === t ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "Squad" && (
          <div className="mt-6 space-y-6">
            {Object.entries(groups).map(([group, players]) => players.length > 0 && (
              <div key={group}>
                <h3 className="font-bold mb-3 flex items-center gap-2">{group} <span className="text-xs text-muted-foreground">({players.length})</span></h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {players.map((p) => (
                    <div key={p.id} className="flex items-center gap-3 rounded-xl border border-border/60 gradient-card p-3">
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <User className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-sm truncate">{p.name}</span>
                          {p.isCaptain && <span className="text-[9px] font-bold rounded px-1 py-0.5 text-accent-foreground" style={{ background: `oklch(${team.primaryColor})` }}>C</span>}
                          {p.isWk && <span className="text-[9px] font-bold rounded px-1 py-0.5 text-accent-foreground" style={{ background: `oklch(${team.primaryColor})` }}>WK</span>}
                        </div>
                        <div className="text-[11px] text-muted-foreground">{p.role}</div>
                        <div className="text-[10px] text-muted-foreground/80 mt-0.5">BAT: {p.batting} • Age: {p.age}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "Overview" && (
          <div className="mt-6 prose prose-invert max-w-none">
            <p className="text-muted-foreground">
              {team.name} ({team.shortName}) is one of the IPL franchises competing in the Tata IPL 2025 season.
              Captained by <strong className="text-foreground">{team.captain}</strong> and coached by <strong className="text-foreground">{team.coach}</strong>,
              the team plays its home matches at <strong className="text-foreground">{team.homeGround}</strong>.
            </p>
          </div>
        )}

        {tab === "Stats" && (
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              ["Matches", team.stats.matches], ["Won", team.stats.won], ["Lost", team.stats.lost],
              ["No Result", team.stats.nr], ["Win %", `${team.stats.winPct}%`], ["Titles", team.titles],
            ].map(([k, v]) => (
              <div key={k as string} className="rounded-xl border border-border/60 gradient-card p-4">
                <div className="text-xs text-muted-foreground">{k}</div>
                <div className="font-display text-2xl font-bold mt-1">{v}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <aside className="space-y-4">
        <div className="rounded-2xl border border-border/60 gradient-card p-5">
          <h4 className="font-semibold mb-3">Team Info</h4>
          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Full Name</dt><dd className="text-right font-medium">{team.name}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Captain</dt><dd className="text-right font-medium">{team.captain}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Coach</dt><dd className="text-right font-medium">{team.coach}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Owner</dt><dd className="text-right font-medium text-xs">{team.owner}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />Home</dt><dd className="text-right font-medium text-xs">{team.homeGround}</dd></div>
          </dl>
        </div>
        <div className="rounded-2xl border border-border/60 gradient-card p-5">
          <h4 className="font-semibold mb-3">Recent Form</h4>
          <div className="flex gap-2">
            {team.recentForm.map((r, i) => (
              <span key={i} className={`h-9 w-9 flex items-center justify-center rounded-md font-bold text-xs text-white ${r === "W" ? "bg-emerald-600" : "bg-destructive"}`}>{r}</span>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
