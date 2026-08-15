import React from 'react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'
import { UserButton, useUser } from '../../auth.jsx'

function Header() {
    const { user, isSignedIn } = useUser();
    return (
        <div className='p-4 px-8 flex justify-between items-center bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 sticky top-0 z-50 shadow-sm transition-all duration-300'>
             <Link to={'/dashboard'} className="group">
                <div className="font-semibold text-[22px] tracking-tight text-on-surface flex items-center gap-2 transition-transform duration-300 group-hover:scale-105">
                    <div className="w-8 h-8 bg-stitch-primary rounded-lg flex items-center justify-center text-on-primary font-bold text-lg shadow-md group-hover:shadow-lg transition-all duration-300">R</div>
                    Resume.ai
                </div>
            </Link>
            {isSignedIn ?
                <div className='flex gap-4 items-center'>
                    <div className="hidden md:flex items-center" title="Open Command Palette">
                        <kbd className="hidden md:inline-flex items-center gap-1 bg-surface-variant/50 text-on-surface-variant text-[10px] px-1.5 py-0.5 rounded font-mono border border-outline-variant/30">Ctrl+K</kbd>
                    </div>
                    <Link to={'/dashboard'}>
                        <Button variant="outline" className="border-outline-variant text-on-surface hover:bg-surface-variant rounded-full px-6 font-medium text-[15px] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">Dashboard</Button>
                    </Link>
                    <div className="w-[1px] h-6 bg-outline-variant/50 mx-2"></div>
                    <div className="hover:scale-110 transition-transform duration-200">
                        <UserButton />
                    </div>
                </div> :
                <Link to={'/auth/sign-in'}>
                    <Button className="bg-stitch-primary hover:bg-stitch-primary/90 text-on-primary rounded-full px-6 py-5 text-[15px] font-medium shadow-[0_4px_14px_rgba(0,105,110,0.3)] hover:shadow-[0_6px_20px_rgba(0,105,110,0.4)] transition-all duration-300 hover:-translate-y-0.5">Get Started</Button>
                </Link>
            }
        </div>
    )
}

export default Header