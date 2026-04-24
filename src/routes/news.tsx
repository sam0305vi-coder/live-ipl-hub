import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getNews } from "@/services/api";
import { Skeleton } from "@/components/Skeleton";
import { AdSlot } from "@/components/AdSlot";
import { Flame } from "lucide-react";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "Latest IPL 2025 News & Updates" },
      { name: "description", content: "Stay updated with the latest IPL 2025 news, match reports, injury updates and analysis." },
    ],
  }),
  component: NewsPage,
});

function NewsPage() {
  const { data: news, isLoading } = useQuery({ queryKey: ["news"], queryFn: getNews });

  const top = news?.[0];
  const rest = news?.slice(1) ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8 grid lg:grid-cols-[1fr_320px] gap-8">
      <div>
        <h1 className="text-4xl font-bold">IPL News</h1>
        <p className="text-sm text-muted-foreground mt-1">Latest IPL 2025 news, insights and stories.</p>

        {isLoading ? <Skeleton className="h-96 mt-6" /> : top && (
          <a href="#" className="mt-6 block group rounded-2xl overflow-hidden border border-border/60 gradient-card shadow-card hover:border-primary/40 transition">
            <div className="aspect-[16/9] overflow-hidden">
              <img src={top.image} alt={top.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition" />
            </div>
            <div className="p-6">
              <span className="inline-block rounded bg-primary/20 text-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">Top Story</span>
              <h2 className="mt-3 font-display text-2xl sm:text-3xl font-bold leading-tight">{top.title}</h2>
              <p className="mt-3 text-muted-foreground">{top.excerpt}</p>
              <div className="mt-3 text-xs text-muted-foreground">{top.source} • {top.time}</div>
            </div>
          </a>
        )}

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64" />)
            : rest.map((n) => (
                <a key={n.id} href="#" className="group rounded-2xl overflow-hidden border border-border/60 gradient-card hover:border-primary/40 transition">
                  <div className="aspect-video overflow-hidden">
                    <img src={n.image} alt={n.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition" />
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{n.category}</span>
                    <h3 className="mt-1 text-sm font-semibold leading-snug line-clamp-2">{n.title}</h3>
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{n.excerpt}</p>
                    <div className="mt-2 text-[11px] text-muted-foreground">{n.source} • {n.time}</div>
                  </div>
                </a>
              ))}
        </div>
      </div>

      <aside className="space-y-4">
        <div className="rounded-2xl border border-border/60 gradient-card p-5">
          <h4 className="font-semibold mb-3 flex items-center gap-2"><Flame className="h-4 w-4 text-destructive" /> Trending News</h4>
          <div className="space-y-3">
            {(news ?? []).slice(0, 5).map((n, i) => (
              <a key={n.id} href="#" className="flex gap-3 group">
                <span className="font-display font-bold text-2xl text-muted-foreground/50 w-6 shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium leading-snug line-clamp-2 group-hover:text-primary">{n.title}</div>
                  <div className="text-[10px] text-muted-foreground mt-1">{n.time}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
        <AdSlot variant="sidebar" />
        <div className="rounded-2xl gradient-primary p-5 text-primary-foreground">
          <h4 className="font-bold">Never Miss an Update!</h4>
          <p className="text-xs mt-1 opacity-90">Get IPL news straight to your inbox.</p>
          <div className="mt-3 flex gap-2">
            <input placeholder="Your email" className="flex-1 px-3 py-2 rounded-md bg-white/20 placeholder:text-white/60 text-xs focus:outline-none" />
            <button className="px-3 py-2 rounded-md bg-white text-primary text-xs font-bold">Subscribe</button>
          </div>
        </div>
      </aside>
    </div>
  );
}
