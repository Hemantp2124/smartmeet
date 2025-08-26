import { cn } from "@/lib/utils/cn";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export function PageContainer({
  children,
  className,
  as: Component = "div",
}: PageContainerProps) {
  return (
    <Component
      className={cn(
        "container mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full",
        className
      )}
    >
      {children}
    </Component>
  );
}
