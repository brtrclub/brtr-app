import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--cta-gradient)] text-white shadow-[var(--cta-shadow)] border border-[var(--cta-border)] hover:shadow-[var(--cta-shadow-hover)] hover:brightness-110 hover:-translate-y-0.5",
        secondary:
          "bg-[var(--bg-white)] text-[var(--text-1)] border border-[var(--border-1)] hover:bg-[var(--bg-elevated)] hover:border-[var(--gold-border)]",
        ghost:
          "text-[var(--text-2)] hover:bg-[var(--gold-bg-light)] hover:text-[var(--text-1)]",
        outline:
          "border border-[var(--border-1)] bg-transparent text-[var(--text-1)] hover:bg-[var(--bg-elevated)] hover:border-[var(--gold-border)]",
        link: "text-[var(--copper)] underline-offset-4 hover:underline",
        destructive:
          "bg-red-500 text-white hover:bg-red-600",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
