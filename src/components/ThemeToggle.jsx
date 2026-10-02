import React from 'react'
import { useTheme } from './ThemeProvider'
import { Moon, Sun, Laptop, Check } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ThemeToggle({ className = "" }) {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`w-9 h-9 rounded-full bg-surface-container border border-outline-variant/40 hover:border-outline focus:outline-none focus:ring-2 focus:ring-primary flex items-center justify-center text-on-surface-variant hover:text-foreground transition-all shadow-sm ${className}`}
          aria-label="Toggle theme"
          title={`Theme: ${theme}`}
        >
          {theme === 'dark' ? (
            <Moon className="w-4 h-4 text-sky-400 transition-transform duration-200 rotate-0" />
          ) : theme === 'light' ? (
            <Sun className="w-4 h-4 text-amber-500 transition-transform duration-200 rotate-0" />
          ) : (
            <Laptop className="w-4 h-4 text-primary transition-transform duration-200" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36 bg-popover border border-border shadow-xl rounded-xl p-1 z-50">
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className="flex items-center justify-between text-xs px-2.5 py-2 rounded-lg cursor-pointer hover:bg-muted font-medium text-foreground"
        >
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Light</span>
          </div>
          {theme === 'light' && <Check className="w-3.5 h-3.5 text-primary" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className="flex items-center justify-between text-xs px-2.5 py-2 rounded-lg cursor-pointer hover:bg-muted font-medium text-foreground"
        >
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-sky-400" />
            <span>Dark</span>
          </div>
          {theme === 'dark' && <Check className="w-3.5 h-3.5 text-primary" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className="flex items-center justify-between text-xs px-2.5 py-2 rounded-lg cursor-pointer hover:bg-muted font-medium text-foreground"
        >
          <div className="flex items-center gap-2">
            <Laptop className="w-4 h-4 text-muted-foreground" />
            <span>System</span>
          </div>
          {theme === 'system' && <Check className="w-3.5 h-3.5 text-primary" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ThemeToggle
