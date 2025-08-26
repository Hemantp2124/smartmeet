import { cn } from "@/lib/utils/cn";

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: string;
}

export function ResponsiveGrid({
  children,
  className,
  columns = { xs: 1, sm: 2, lg: 3, xl: 4 },
  gap = "1rem",
}: ResponsiveGridProps) {
  const getGridTemplateColumns = () => {
    return {
      gridTemplateColumns: `repeat(${columns.xs || 1}, minmax(0, 1fr))`,
      "@media (min-width: 640px)": {
        gridTemplateColumns: `repeat(${columns.sm || columns.xs || 1}, minmax(0, 1fr))`,
      },
      "@media (min-width: 768px)": {
        gridTemplateColumns: `repeat(${columns.md || columns.sm || columns.xs || 1}, minmax(0, 1fr))`,
      },
      "@media (min-width: 1024px)": {
        gridTemplateColumns: `repeat(${columns.lg || columns.md || columns.sm || columns.xs || 1}, minmax(0, 1fr))`,
      },
      "@media (min-width: 1280px)": {
        gridTemplateColumns: `repeat(${columns.xl || columns.lg || columns.md || columns.sm || columns.xs || 1}, minmax(0, 1fr))`,
      },
    };
  };

  return (
    <div
      className={cn("grid w-full", className)}
      style={{
        ...getGridTemplateColumns(),
        gap,
      }}
    >
      {children}
    </div>
  );
}
