import * as React from "react";
import { cn } from "@/lib/utils";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive";
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-md border p-4 text-sm flex items-start gap-2",
      variant === "destructive"
        ? "border-red-300 bg-red-50 text-red-800"
        : "border-blue-200 bg-blue-50 text-blue-900",
      className
    )}
    {...props}
  />
));
Alert.displayName = "Alert";

export function AlertDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm", className)} {...props} />;
}
