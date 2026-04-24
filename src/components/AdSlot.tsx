interface Props {
  variant?: "banner" | "card" | "sidebar";
  label?: string;
}

export function AdSlot({ variant = "card", label = "Advertisement" }: Props) {
  const sizes = {
    banner: "h-24",
    card: "h-32",
    sidebar: "h-64",
  };
  return (
    <div
      className={`${sizes[variant]} w-full rounded-xl border border-dashed border-border/60 bg-muted/30 flex items-center justify-center text-xs uppercase tracking-widest text-muted-foreground/60`}
    >
      {label}
    </div>
  );
}
