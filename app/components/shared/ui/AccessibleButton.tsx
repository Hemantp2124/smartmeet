import { Button, ButtonProps } from "@/app/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { forwardRef } from "react";

export const AccessibleButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background",
          "transition-colors duration-200",
          "disabled:opacity-50 disabled:pointer-events-none",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

AccessibleButton.displayName = "AccessibleButton";
