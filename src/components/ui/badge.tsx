import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--gold-bg)] text-[var(--gold-text)] border border-[var(--gold-border)]",
        secondary:
          "bg-[var(--bg-elevated)] text-[var(--text-2)] border border-[var(--border-1)]",
        copper:
          "bg-[var(--copper-bg)] text-[var(--copper-text)] border border-[var(--copper-border)]",
        silver:
          "bg-[var(--silver-bg)] text-[var(--silver-text)] border border-transparent",
        success:
          "bg-green-50 text-green-700 border border-green-200",
        warning:
          "bg-amber-50 text-amber-700 border border-amber-200",
        destructive:
          "bg-red-50 text-red-700 border border-red-200",
        outline:
          "bg-transparent text-[var(--text-2)] border border-[var(--border-1)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
