import { createFileRoute } from "@tanstack/react-router";

const HOST = "cricbuzz-cricket.p.rapidapi.com";

async function cb(path: string) {
  const key = process.env.RAPIDAPI_CRICBUZZ_KEY;
  if (!key) throw new Error("RAPIDAPI_CRICBUZZ_KEY not configured");
  const res = await fetch(`https://${HOST}${path}`, {
    headers: { "x-rapidapi-host": HOST, "x-rapidapi-key": key },
  });
  if (!res.ok) throw new Error(`Cricbuzz ${path} -> ${res.status}`);
  return res.json();
}

export const Route = createFileRoute("/api/live-matches")({
  server: {
    handlers: {
      GET: async (_ctx: any) => {
        try {
          const data = await cb("/matches/v1/live");
          const matches: any[] = [];
          for (const tm of data.typeMatches ?? []) {
            for (const sm of tm.seriesMatches ?? []) {
              const wrap = sm.seriesAdWrapper;
              if (!wrap) continue;
              for (const m of wrap.matches ?? []) {
                const info = m.matchInfo;
                const score = m.matchScore;
                matches.push({
                  id: String(info.matchId),
                  number: info.matchDesc,
                  status: info.state?.toLowerCase().includes("complete") ? "completed"
                    : info.state?.toLowerCase().includes("preview") || info.state?.toLowerCase().includes("upcoming") ? "upcoming"
                    : "live",
                  team1: { id: String(info.team1.teamId), short: info.team1.teamSName, name: info.team1.teamName },
                  team2: { id: String(info.team2.teamId), short: info.team2.teamSName, name: info.team2.teamName },
                  date: new Date(Number(info.startDate)).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
                  time: new Date(Number(info.startDate)).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
                  venue: info.venueInfo ? `${info.venueInfo.ground}, ${info.venueInfo.city}` : "",
                  result: info.status,
                  series: tm.matchType,
                  score1: score?.team1Score?.inngs1 ? { runs: score.team1Score.inngs1.runs ?? 0, wickets: score.team1Score.inngs1.wickets ?? 0, overs: String(score.team1Score.inngs1.overs ?? "0") } : undefined,
                  score2: score?.team2Score?.inngs1 ? { runs: score.team2Score.inngs1.runs ?? 0, wickets: score.team2Score.inngs1.wickets ?? 0, overs: String(score.team2Score.inngs1.overs ?? "0") } : undefined,
                });
              }
            }
          }
          return Response.json({ matches }, { headers: { "Cache-Control": "public, max-age=5" } });
        } catch (e: any) {
          return Response.json({ matches: [], error: e.message }, { status: 200 });
        }
      },
    },
  },
} as any);
