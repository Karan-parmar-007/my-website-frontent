import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-[#64ffda] focus-visible:ring-[#64ffda]/20 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        // Fix autofill background and text
        "autofill:!bg-[#0a192f] autofill:!text-[#ccd6f6] [&:-webkit-autofill]:!bg-[#0a192f] [&:-webkit-autofill]:!text-[#ccd6f6] [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_#0a192f]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
