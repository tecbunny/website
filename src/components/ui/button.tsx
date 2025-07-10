import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-50 disabled:pointer-events-none";
    
    let variantClasses = "";
    let sizeClasses = "";
    
    // Variant styles
    switch (variant) {
      case "default":
        variantClasses = "bg-purple-600 text-white hover:bg-purple-700";
        break;
      case "outline":
        variantClasses = "border border-purple-600 text-purple-600 bg-transparent hover:bg-purple-50";
        break;
      case "ghost":
        variantClasses = "text-purple-600 bg-transparent hover:bg-purple-50";
        break;
    }
    
    // Size styles
    switch (size) {
      case "sm":
        sizeClasses = "px-3 py-1.5 text-sm";
        break;
      case "md":
        sizeClasses = "px-4 py-2 text-base";
        break;
      case "lg":
        sizeClasses = "px-6 py-3 text-lg";
        break;
    }

    return (
      <button
        ref={ref}
        className={cn(baseClasses, variantClasses, sizeClasses, className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
