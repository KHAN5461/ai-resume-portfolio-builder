import * as React from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    (<motion.textarea
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        "flex min-h-[80px] w-full rounded-lg border border-outline-variant/40 bg-surface-container-lowest px-3 py-2 font-body-sm text-sm text-on-surface ring-offset-surface placeholder:text-outline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900 disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-sm focus-visible:shadow-md",
        className
      )}
      ref={ref}
      {...props} />)
  );
})
Textarea.displayName = "Textarea"

export { Textarea }
