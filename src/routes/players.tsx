import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getAllPlayers, getTeams } from "@/services/api";
import { Skeleton } from "@/components/Skeleton";
import { TeamLogo } from "@/components/TeamLogo";
import { useState, useMemo } from "react";
import { Search } from "lucide-react";

export const Route = createFileRoute("/players")({
  head: () => ({
    meta: [
      { title: "All IPL 2025 Players & Stats" },
      { name: "description", content: "Browse all IPL 2025 players with stats, teams, roles and performance." },
    ],
  }),
  component: PlayersPage,
});

const ROLES = ["All Players", "Batter", "Bowler", "All Rounder", "Wicket Keeper"] as const;

function PlayersPage() {
  const { data: players, isLoading } = useQuery({ queryKey: ["players"], queryFn: getAllPlayers });
  const { data: teams } = useQuery({ queryKey: ["teams"], queryFn: getTeams });
  const [role, setRole] = useState<typeof ROLES[number]>("All Players");
  const [search, setSearch] = useState("");

  const teamMap = useMemo(() => Object.fromEntries((teams ?? []).map((t) => [t.id, t])), [teams]);

  const filtered = (players ?? []).filter((p) => {
    if (role !== "All Players" && p.role !== role) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold">All Players</h1>
          <p className="text-sm text-muted-foreground mt-1">Explore all IPL 2025 players, stats and performance.</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border/60 gradient-card p-5 shadow-card">
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {ROLES.map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${role === r ? "gradient-primary text-primary-foreground" : "border border-border bg-card hover:bg-muted"}`}
              >
                {r}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search players..."
              className="pl-9 pr-3 py-2 bg-muted/50 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 w-full sm:w-64"
            />
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase text-muted-foreground">
                <th className="text-left p-3">Player</th>
                <th className="text-left p-3">Team</th>
                <th className="text-left p-3 hidden md:table-cell">Role</th>
                <th className="text-center p-3">M</th>
                <th className="text-center p-3">Runs</th>
                <th className="text-center p-3">Wkts</th>
                <th className="text-center p-3 hidden lg:table-cell">SR</th>
                <th className="text-center p-3 hidden lg:table-cell">Econ</th>
                <th className="text-center p-3 hidden sm:table-cell">Country</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => <tr key={i}><td colSpan={9} className="p-2"><Skeleton className="h-10" /></td></tr>)
                : filtered.map((p) => {
                    const team = teamMap[p.teamId];
                    return (
                      <tr key={p.id} className="border-b border-border/40 hover:bg-muted/30 transition">
                        <td className="p-3 font-semibold">{p.name}</td>
                        <td className="p-3">
                          {team && (
                            <Link to="/team/$teamId" params={{ teamId: p.teamId }} className="inline-flex items-center gap-2 hover:text-primary">
                              <TeamLogo shortName={team.shortName} color={team.primaryColor} size="sm" />
                              <span className="text-xs">{team.shortName}</span>
                            </Link>
                          )}
                        </td>
                        <td className="p-3 hidden md:table-cell text-muted-foreground">{p.role}</td>
                        <td className="text-center p-3">{p.stats.matches}</td>
                        <td className="text-center p-3 font-semibold">{p.stats.runs}</td>
                        <td className="text-center p-3 font-semibold">{p.stats.wickets}</td>
                        <td className="text-center p-3 hidden lg:table-cell">{p.stats.sr ?? "—"}</td>
                        <td className="text-center p-3 hidden lg:table-cell">{p.stats.econ ?? "—"}</td>
                        <td className="text-center p-3 hidden sm:table-cell text-xs text-muted-foreground">{p.country}</td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
