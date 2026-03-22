import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-[var(--border-1)] bg-[var(--bg-white)] px-3 py-2 text-sm text-[var(--text-1)] placeholder:text-[var(--text-4)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:ring-offset-1 focus:border-[var(--gold-border)] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
