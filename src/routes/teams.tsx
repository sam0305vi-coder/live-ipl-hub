import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getTeams } from "@/services/api";
import { TeamLogo } from "@/components/TeamLogo";
import { Skeleton } from "@/components/Skeleton";
import { Trophy, User } from "lucide-react";

export const Route = createFileRoute("/teams")({
  head: () => ({
    meta: [
      { title: "All IPL 2025 Teams & Squads" },
      { name: "description", content: "Browse all 10 IPL teams, squads, captains and coaches for IPL 2025." },
    ],
  }),
  component: TeamsPage,
});

function TeamsPage() {
  const { data: teams, isLoading } = useQuery({ queryKey: ["teams"], queryFn: getTeams });

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8">
      <h1 className="text-4xl font-bold">All Teams</h1>
      <p className="text-sm text-muted-foreground mt-1">Explore all IPL 2025 teams, squads and key players.</p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {isLoading
          ? Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-72" />)
          : teams?.map((t) => (
              <Link key={t.id} to="/team/$teamId" params={{ teamId: t.id }} className="group rounded-2xl border border-border/60 gradient-card p-5 shadow-card hover:border-primary/50 hover:-translate-y-1 transition">
                <div
                  className="rounded-xl p-5 mb-4"
                  style={{ background: `linear-gradient(135deg, oklch(${t.primaryColor} / 0.4), oklch(${t.primaryColor} / 0.1))` }}
                >
                  <TeamLogo shortName={t.shortName} color={t.primaryColor} size="xl" className="mx-auto" />
                </div>
                <h3 className="text-center font-bold leading-tight">{t.name}</h3>
                <div className="mt-2 text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <Trophy className="h-3 w-3 text-accent" />
                  {t.titles > 0 ? `${t.titles} Title${t.titles > 1 ? "s" : ""}` : "0 Titles"}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-muted-foreground border-t border-border/60 pt-3">
                  <div><div className="opacity-60">Captain</div><div className="text-foreground font-medium truncate flex items-center gap-1"><User className="h-3 w-3" />{t.captain.split(" ").slice(-1)[0]}</div></div>
                  <div><div className="opacity-60">Coach</div><div className="text-foreground font-medium truncate">{t.coach.split(" ").slice(-1)[0]}</div></div>
                </div>
                <div className="mt-4 text-center text-xs font-semibold text-primary group-hover:underline">View Squad →</div>
              </Link>
            ))}
      </div>
    </div>
  );
}
