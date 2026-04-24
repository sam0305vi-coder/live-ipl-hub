import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getVideos } from "@/services/api";
import { Skeleton } from "@/components/Skeleton";
import { Play } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/videos")({
  head: () => ({
    meta: [
      { title: "IPL 2025 Highlights & Match Videos" },
      { name: "description", content: "Watch IPL 2025 match highlights, top sixes, best wickets and player interviews." },
    ],
  }),
  component: VideosPage,
});

function VideosPage() {
  const { data: videos, isLoading } = useQuery({ queryKey: ["videos"], queryFn: getVideos });
  const [playing, setPlaying] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8">
      <h1 className="text-4xl font-bold">Videos</h1>
      <p className="text-sm text-muted-foreground mt-1">Highlights, top moments and exclusive clips. Embedded from YouTube.</p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64" />)
          : videos?.map((v) => (
              <div key={v.id} className="rounded-2xl overflow-hidden border border-border/60 gradient-card shadow-card group">
                <div className="aspect-video relative bg-black overflow-hidden">
                  {playing === v.id ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${v.youtubeId}?autoplay=1`}
                      title={v.title}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <button onClick={() => setPlaying(v.id)} className="block h-full w-full relative">
                      <img src={v.thumbnail} alt={v.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition" />
                      <span className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <span className="h-14 w-14 rounded-full gradient-primary flex items-center justify-center shadow-glow group-hover:scale-110 transition">
                          <Play className="h-6 w-6 text-primary-foreground ml-1" fill="currentColor" />
                        </span>
                      </span>
                      <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-mono text-white">{v.duration}</span>
                    </button>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold leading-snug line-clamp-2">{v.title}</h3>
                  <div className="mt-2 text-xs text-muted-foreground">{v.views} views</div>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
