import { Label } from "@/app/components/ui/label";
import { cn } from "@/lib/utils/cn";

interface FormFieldProps {
  label?: string;
  error?: string | false;
  description?: string;
  htmlFor?: string;
  className?: string;
  children: React.ReactNode;
  required?: boolean;
}

export function FormField({
  label,
  error,
  description,
  htmlFor,
  className,
  children,
  required = false,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2 w-full", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <Label htmlFor={htmlFor} className={error ? "text-destructive" : ""}>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
          {error && (
            <span className="text-sm font-medium text-destructive">
              {error}
            </span>
          )}
        </div>
      )}
      {children}
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
