interface Props {
  shortName: string;
  color?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const SIZES = {
  sm: "w-8 h-8 text-[10px]",
  md: "w-12 h-12 text-xs",
  lg: "w-16 h-16 text-sm",
  xl: "w-24 h-24 text-base",
};

export function TeamLogo({ shortName, color = "0.65 0.27 340", size = "md", className = "" }: Props) {
  return (
    <div
      className={`${SIZES[size]} ${className} flex items-center justify-center rounded-full font-bold font-display tracking-wider shrink-0`}
      style={{
        background: `radial-gradient(circle at 30% 30%, oklch(${color} / 0.95), oklch(${color} / 0.6))`,
        boxShadow: `0 4px 20px -4px oklch(${color} / 0.5), inset 0 1px 0 oklch(1 0 0 / 0.2)`,
        color: "white",
      }}
    >
      {shortName}
    </div>
  );
}
