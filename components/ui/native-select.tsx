import * as React from "react"
import { ChevronDown } from "@/components/icons"

import { cn } from "@/lib/utils"

// A styled native <select>, so filters keep working without JavaScript.
const NativeSelect = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <div className="relative">
    <select
      ref={ref}
      className={cn(
        "flex h-10 w-full min-w-0 cursor-pointer appearance-none rounded-md border border-input bg-card py-2 pl-3 pr-9 text-sm shadow-sm transition-colors hover:border-foreground/40 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </select>
    <ChevronDown
      aria-hidden="true"
      className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
    />
  </div>
))
NativeSelect.displayName = "NativeSelect"

export { NativeSelect }
