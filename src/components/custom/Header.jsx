import React from 'react'
import { Button } from '../ui/button'
import { Link, useLocation } from 'react-router-dom'
import { UserButton, useUser } from '../../auth.jsx'
import { Menu, FileText, Globe, Layers, Mail, MessageSquare, Upload } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import useHideOnScroll from '../../hooks/useHideOnScroll'
import ThemeToggle from '../ThemeToggle'

function Header() {
    const { isSignedIn } = useUser();
    const isVisible = useHideOnScroll();
    const location = useLocation();

    return (
        <header className={`p-3.5 px-6 md:px-10 flex justify-between items-center bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 shadow-sm transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
            <div className="flex items-center gap-8">
                <Link to={'/'} className="group flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-md group-hover:shadow-indigo-500/25 group-hover:scale-105 transition-all">
                        R
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-lg tracking-tight text-foreground flex items-center gap-1.5">
                            Resume<span className="text-sky-500">.ai</span>
                            <span className="text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.2 bg-sky-500/10 dark:bg-sky-400/20 text-sky-600 dark:text-sky-400 rounded">Hub</span>
                        </span>
                    </div>
                </Link>

                <nav className="hidden lg:flex items-center gap-1">
                    <Link 
                        to="/dashboard" 
                        className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${location.pathname === '/' || (location.pathname.startsWith('/dashboard') && !location.pathname.includes('portfolios') && !location.pathname.includes('cover-letters') && !location.pathname.includes('import')) ? 'text-primary bg-primary/10 font-semibold' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                    >
                        <FileText className="w-3.5 h-3.5" />
                        Resumes
                    </Link>
                    <Link 
                        to="/dashboard?tab=portfolios" 
                        className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${location.search.includes('portfolios') ? 'text-primary bg-primary/10 font-semibold' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                    >
                        <Globe className="w-3.5 h-3.5" />
                        Portfolios
                    </Link>
                    <Link 
                        to="/templates" 
                        className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${location.pathname.startsWith('/templates') ? 'text-primary bg-primary/10 font-semibold' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                    >
                        <Layers className="w-3.5 h-3.5" />
                        Templates
                    </Link>
                    <Link 
                        to="/dashboard/cover-letters" 
                        className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${location.pathname.includes('cover-letters') ? 'text-primary bg-primary/10 font-semibold' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                    >
                        <Mail className="w-3.5 h-3.5" />
                        Cover Letters
                    </Link>
                    <Link 
                        to="/interview" 
                        className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${location.pathname.startsWith('/interview') ? 'text-primary bg-primary/10 font-semibold' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                    >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Interview Coach
                    </Link>
                </nav>
            </div>

            <div className="flex items-center gap-3">
                <Link to="/dashboard/import" className="hidden sm:flex">
                    <Button variant="outline" size="sm" className="text-xs h-8 rounded-lg gap-1.5 text-muted-foreground hover:text-foreground">
                        <Upload className="w-3.5 h-3.5" />
                        Import
                    </Button>
                </Link>

                <div className="hidden md:flex items-center" title="Open Command Palette (Ctrl+K)">
                    <kbd className="inline-flex items-center gap-1 bg-muted/60 text-muted-foreground text-[10px] px-2 py-1 rounded font-mono border border-border">Ctrl+K</kbd>
                </div>

                <ThemeToggle />

                {/* Hamburger Menu on All Devices */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="rounded-xl w-9 h-9 text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors" 
                            title="Navigation Menu" 
                            aria-label="Navigation Menu"
                        >
                            <Menu className="w-5 h-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-popover border border-border shadow-xl rounded-xl p-1 z-50">
                        <DropdownMenuItem asChild>
                            <Link to="/dashboard" className="cursor-pointer flex items-center gap-2.5 py-2">
                                <FileText className="w-4 h-4 text-sky-500" />
                                <span className="font-medium text-xs">Resumes & Docs</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link to="/dashboard?tab=portfolios" className="cursor-pointer flex items-center gap-2.5 py-2">
                                <Globe className="w-4 h-4 text-indigo-500" />
                                <span className="font-medium text-xs">Portfolios</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link to="/dashboard/import" className="cursor-pointer flex items-center gap-2.5 py-2">
                                <Upload className="w-4 h-4 text-emerald-500" />
                                <span className="font-medium text-xs">Import Resume / CV</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link to="/templates" className="cursor-pointer flex items-center gap-2.5 py-2">
                                <Layers className="w-4 h-4 text-amber-500" />
                                <span className="font-medium text-xs">Template Gallery</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link to="/dashboard/cover-letters" className="cursor-pointer flex items-center gap-2.5 py-2">
                                <Mail className="w-4 h-4 text-purple-500" />
                                <span className="font-medium text-xs">Cover Letter Studio</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link to="/interview" className="cursor-pointer flex items-center gap-2.5 py-2">
                                <MessageSquare className="w-4 h-4 text-rose-500" />
                                <span className="font-medium text-xs">AI Mock Interview</span>
                            </Link>
                        </DropdownMenuItem>
                        
                        {isSignedIn ? (
                          <>
                            <div className="my-1 border-t border-border/50" />
                            <DropdownMenuItem asChild>
                                <Link to="/profile" className="cursor-pointer flex items-center gap-2.5 py-2">
                                    <span className="font-medium text-xs">Profile Settings</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link to="/settings" className="cursor-pointer flex items-center gap-2.5 py-2">
                                    <span className="font-medium text-xs">Account & API Keys</span>
                                </Link>
                            </DropdownMenuItem>
                          </>
                        ) : (
                          <>
                            <div className="my-1 border-t border-border/50" />
                            <DropdownMenuItem asChild>
                                <Link to="/auth/sign-in" className="cursor-pointer flex items-center gap-2.5 py-2 font-bold text-sky-600 dark:text-sky-400">
                                    <span className="text-xs">Sign In / Register</span>
                                </Link>
                            </DropdownMenuItem>
                          </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>

                {isSignedIn ? (
                    <div className='flex gap-2 items-center'>
                        <div className="hover:scale-105 transition-transform duration-200 ml-1">
                            <UserButton />
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Link to={'/auth/sign-in'}>
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5 py-2 text-xs font-semibold shadow-md transition-all duration-200">
                                Sign In
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </header>
    )
}

export default Header