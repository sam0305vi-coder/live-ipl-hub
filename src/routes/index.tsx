import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMatches, getNews } from "@/services/api";
import { TeamLogo } from "@/components/TeamLogo";
import { AdSlot } from "@/components/AdSlot";
import { Skeleton } from "@/components/Skeleton";
import { Radio, Calendar, ArrowRight, Trophy, Newspaper, Play } from "lucide-react";
import heroImg from "@/assets/hero-cricket.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IPL Live Score 2025 — Home" },
      { name: "description", content: "Live IPL scores, upcoming matches, points table and the latest cricket news in one place." },
    ],
  }),
  component: HomePage,
});

const TEAM_COLORS: Record<string, string> = {
  csk: "0.75 0.18 75", mi: "0.55 0.22 250", rcb: "0.55 0.24 25", kkr: "0.45 0.18 305",
  srh: "0.7 0.22 45", dc: "0.55 0.22 250", pbks: "0.6 0.24 20", rr: "0.65 0.24 340",
  gt: "0.4 0.12 240", lsg: "0.55 0.2 200",
};

function HomePage() {
  const { data: matches, isLoading: mLoading } = useQuery({ queryKey: ["matches"], queryFn: getMatches });
  const { data: news, isLoading: nLoading } = useQuery({ queryKey: ["news"], queryFn: getNews });

  const live = matches?.find((m) => m.status === "live");
  const upcoming = matches?.filter((m) => m.status === "upcoming").slice(0, 4) ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-6 lg:py-10 space-y-12">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border border-border/60 shadow-card">
        <img src={heroImg} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" width={1536} height={1024} />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
        <div className="relative grid lg:grid-cols-2 gap-8 p-6 sm:p-10 lg:p-14 min-h-[420px]">
          <div className="flex flex-col justify-center">
            <span className="text-xs font-bold tracking-[0.3em] text-primary uppercase mb-3">TATA IPL 2025</span>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight">
              Every Ball.
              <br />
              <span className="text-gradient">Every Moment.</span>
            </h1>
            <p className="mt-5 text-base text-muted-foreground max-w-md">
              Real-time IPL scores, ball-by-ball updates, player stats, match insights and more.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              {live && (
                <Link to="/live/$matchId" params={{ matchId: live.id }} className="inline-flex items-center gap-2 rounded-lg gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow hover:scale-[1.02] transition">
                  <Radio className="h-4 w-4" /> Live Score
                </Link>
              )}
              <Link to="/matches" className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/50 px-5 py-3 text-sm font-semibold hover:bg-card transition">
                <Calendar className="h-4 w-4" /> Schedule
              </Link>
            </div>
          </div>

          {live && (
            <div className="rounded-2xl bg-card/70 backdrop-blur border border-border/60 p-5 sm:p-6 self-center w-full">
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-live px-2 py-0.5 text-[10px] font-bold uppercase text-live-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-white live-pulse" /> LIVE
                </span>
                <span className="text-xs text-muted-foreground">Match {live.number}, TATA IPL 2025</span>
              </div>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                <div className="flex flex-col items-center gap-2 text-center">
                  <TeamLogo shortName={live.team1.short} color={TEAM_COLORS[live.team1.id]} size="lg" />
                  <div className="font-display text-2xl font-bold">{live.score1?.runs}/{live.score1?.wickets}</div>
                  <div className="text-xs text-muted-foreground">{live.score1?.overs} ov</div>
                </div>
                <div className="text-xs font-bold text-muted-foreground">VS</div>
                <div className="flex flex-col items-center gap-2 text-center">
                  <TeamLogo shortName={live.team2.short} color={TEAM_COLORS[live.team2.id]} size="lg" />
                  <div className="font-display text-2xl font-bold">{live.score2?.runs}/{live.score2?.wickets}</div>
                  <div className="text-xs text-muted-foreground">{live.score2?.overs} ov</div>
                </div>
              </div>
              <div className="mt-4 text-center text-sm font-semibold text-destructive">{live.result}</div>
              <Link to="/live/$matchId" params={{ matchId: live.id }} className="mt-4 flex items-center justify-center gap-2 rounded-lg gradient-primary py-2.5 text-sm font-semibold text-primary-foreground">
                <Radio className="h-4 w-4" /> Ball by Ball Commentary
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* MATCHES STRIP */}
      <section>
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-2xl font-bold">Live & Upcoming Matches</h2>
          <Link to="/matches" className="text-sm text-primary inline-flex items-center gap-1 hover:gap-2 transition-all">
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mLoading
            ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-44" />)
            : [live, ...upcoming].filter(Boolean).slice(0, 4).map((m) => m && (
                <Link key={m.id} to={m.status === "live" ? "/live/$matchId" : "/matches"} params={{ matchId: m.id }} className="group rounded-2xl border border-border/60 gradient-card p-4 hover:border-primary/50 transition shadow-card">
                  <div className="flex items-center justify-between mb-3">
                    {m.status === "live"
                      ? <span className="inline-flex items-center gap-1 rounded bg-live px-1.5 py-0.5 text-[10px] font-bold uppercase text-live-foreground"><span className="h-1 w-1 rounded-full bg-white live-pulse" />LIVE</span>
                      : <span className="rounded bg-secondary/30 px-1.5 py-0.5 text-[10px] font-bold uppercase text-secondary">UPCOMING</span>}
                    <span className="text-xs text-muted-foreground">Match {m.number}</span>
                  </div>
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                    <div className="flex flex-col items-center gap-1.5">
                      <TeamLogo shortName={m.team1.short} color={TEAM_COLORS[m.team1.id]} size="md" />
                      <span className="text-xs font-semibold">{m.team1.short}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">VS</span>
                    <div className="flex flex-col items-center gap-1.5">
                      <TeamLogo shortName={m.team2.short} color={TEAM_COLORS[m.team2.id]} size="md" />
                      <span className="text-xs font-semibold">{m.team2.short}</span>
                    </div>
                  </div>
                  <div className="mt-3 text-center">
                    {m.status === "live"
                      ? <div className="text-xs font-semibold text-destructive">{m.result}</div>
                      : <div className="text-xs text-muted-foreground">{m.date} • {m.time}</div>}
                  </div>
                </Link>
              ))}
        </div>
      </section>

      <AdSlot variant="banner" label="Sponsored — Premium Banner" />

      {/* NEWS + STORIES */}
      <section className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2"><Newspaper className="h-5 w-5 text-primary" /> Latest News</h2>
            <Link to="/news" className="text-sm text-primary inline-flex items-center gap-1 hover:gap-2 transition-all">View All <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {nLoading
              ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-48" />)
              : news?.slice(0, 4).map((n) => (
                  <Link key={n.id} to="/news" className="group rounded-2xl overflow-hidden border border-border/60 gradient-card hover:border-primary/40 transition">
                    <div className="aspect-video overflow-hidden">
                      <img src={n.image} alt={n.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition" />
                    </div>
                    <div className="p-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{n.category}</span>
                      <h3 className="mt-1 text-sm font-semibold leading-snug line-clamp-2">{n.title}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">{n.source} • {n.time}</p>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2"><Trophy className="h-5 w-5 text-accent" /> Featured</h2>
          <Link to="/points-table" className="block rounded-2xl border border-border/60 gradient-card p-5 hover:border-accent/50 transition">
            <div className="text-xs font-bold uppercase tracking-wider text-accent mb-1">Standings</div>
            <div className="text-lg font-bold">Points Table</div>
            <div className="text-xs text-muted-foreground mt-1">See full IPL 2025 standings</div>
          </Link>
          <Link to="/videos" className="block rounded-2xl border border-border/60 gradient-card p-5 hover:border-primary/50 transition">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-1"><Play className="h-3 w-3" /> Highlights</div>
            <div className="text-lg font-bold">Match Videos</div>
            <div className="text-xs text-muted-foreground mt-1">Sixes, wickets, top moments</div>
          </Link>
          <AdSlot variant="sidebar" />
        </div>
      </section>
    </div>
  );
}
