import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const baseClasses = "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2";
  
  let variantClasses = "";
  
  switch (variant) {
    case "default":
      variantClasses = "border-transparent bg-purple-600 text-white shadow hover:bg-purple-700";
      break;
    case "secondary":
      variantClasses = "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200";
      break;
    case "destructive":
      variantClasses = "border-transparent bg-red-500 text-white shadow hover:bg-red-600";
      break;
    case "outline":
      variantClasses = "text-gray-900 border-gray-300";
      break;
    case "success":
      variantClasses = "border-transparent bg-green-100 text-green-800 hover:bg-green-200";
      break;
    case "warning":
      variantClasses = "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      break;
  }

  return (
    <div
      className={cn(baseClasses, variantClasses, className)}
      {...props}
    />
  )
}

export { Badge }
