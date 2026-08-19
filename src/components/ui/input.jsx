import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    (<motion.input
      type={type}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        "flex h-10 w-full rounded-lg border border-outline-variant/40 bg-surface-container-lowest px-3 py-2 font-body-sm text-sm text-on-surface ring-offset-surface file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-outline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900 disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-sm focus-visible:shadow-md",
        className
      )}
      ref={ref}
      {...props} />)
  );
})
Input.displayName = "Input"

export { Input }
