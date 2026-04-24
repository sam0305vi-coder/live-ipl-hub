import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Search, Bell, Radio } from "lucide-react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/matches", label: "Matches" },
  { to: "/teams", label: "Teams" },
  { to: "/points-table", label: "Points Table" },
  { to: "/stats", label: "Stats" },
  { to: "/players", label: "Players" },
  { to: "/news", label: "News" },
  { to: "/videos", label: "Videos" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary shadow-glow">
            <Radio className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="leading-none">
            <div className="font-display text-lg font-bold tracking-tight">IPL</div>
            <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary">Live Score</div>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="relative px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              activeProps={{ className: "text-foreground" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && (
                    <span className="absolute -bottom-0.5 left-3 right-3 h-0.5 rounded-full gradient-primary" />
                  )}
                </>
              )}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button className="hidden md:flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted transition">
            <Search className="h-4 w-4" />
          </button>
          <button className="hidden md:flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted transition">
            <Bell className="h-4 w-4" />
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            className="lg:hidden h-9 w-9 flex items-center justify-center rounded-md hover:bg-muted"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="lg:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl">
          <div className="px-4 py-3 grid grid-cols-2 gap-1">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                activeProps={{ className: "bg-muted text-foreground" }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
