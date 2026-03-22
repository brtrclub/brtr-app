import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn, getInitials } from "@/lib/utils"

const avatarVariants = cva(
  "relative inline-flex items-center justify-center rounded-full font-semibold text-white overflow-hidden",
  {
    variants: {
      color: {
        amber: "bg-gradient-to-br from-[#d4a84b] to-[#b8922e]",
        copper: "bg-gradient-to-br from-[#c08050] to-[#a06830]",
        silver: "bg-gradient-to-br from-[#9a9aa0] to-[#7a7a80]",
      },
      size: {
        xs: "h-6 w-6 text-[10px]",
        sm: "h-8 w-8 text-xs",
        default: "h-10 w-10 text-sm",
        lg: "h-12 w-12 text-base",
        xl: "h-16 w-16 text-lg",
      },
    },
    defaultVariants: {
      color: "amber",
      size: "default",
    },
  }
)

export interface AvatarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color">,
    VariantProps<typeof avatarVariants> {
  name?: string
  src?: string
  status?: "online" | "busy" | "offline"
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, color, size, name, src, status, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ color, size, className }))}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={name || "Avatar"}
            className="h-full w-full object-cover"
          />
        ) : (
          <span>{name ? getInitials(name) : "?"}</span>
        )}
        {status && (
          <span
            className={cn(
              "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white",
              status === "online" && "bg-[var(--status-online)]",
              status === "busy" && "bg-[var(--status-busy)]",
              status === "offline" && "bg-[var(--status-offline)]"
            )}
          />
        )}
      </div>
    )
  }
)
Avatar.displayName = "Avatar"

interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number
  children: React.ReactNode
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, max = 4, children, ...props }, ref) => {
    const childArray = React.Children.toArray(children)
    const visibleChildren = max ? childArray.slice(0, max) : childArray
    const remaining = childArray.length - visibleChildren.length

    return (
      <div
        ref={ref}
        className={cn("flex -space-x-2", className)}
        {...props}
      >
        {visibleChildren}
        {remaining > 0 && (
          <div className="relative inline-flex items-center justify-center rounded-full bg-[var(--bg-elevated)] border-2 border-white h-10 w-10 text-sm font-medium text-[var(--text-2)]">
            +{remaining}
          </div>
        )}
      </div>
    )
  }
)
AvatarGroup.displayName = "AvatarGroup"

export { Avatar, AvatarGroup, avatarVariants }
