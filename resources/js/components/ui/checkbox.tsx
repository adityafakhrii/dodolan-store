import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer inline-flex size-4.5 shrink-0 items-center justify-center rounded-[5px] border border-slate-300 bg-white text-white shadow-xs transition-all duration-150 outline-none cursor-pointer",
        "hover:border-emerald-500 hover:shadow-sm focus-visible:border-emerald-600 focus-visible:ring-2 focus-visible:ring-emerald-500/25",
        "data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 data-[state=checked]:text-white",
        "dark:border-slate-700 dark:bg-slate-900 dark:hover:border-emerald-500 dark:data-[state=checked]:bg-emerald-600 dark:data-[state=checked]:border-emerald-600",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-white"
      >
        <Check className="size-3.2 stroke-[3]" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
