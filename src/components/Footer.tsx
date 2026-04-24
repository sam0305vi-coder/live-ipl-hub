export function Footer() {
  return (
    <footer className="border-t border-border/50 mt-20 py-8">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div>© 2025 IPL Live Score. Scores & stats only — no live streaming.</div>
          <div className="flex gap-4">
            <span>About</span>
            <span>Privacy</span>
            <span>Contact</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
