import React from 'react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'
import { UserButton, useUser } from '../../auth.jsx'

function Header() {
    const { user, isSignedIn } = useUser();
    return (
        <div className='p-4 px-8 flex justify-between items-center bg-[var(--color-paper)] border-b border-[var(--color-chalk)] sticky top-0 z-50'>
             <Link to={'/dashboard'}>
                {/* Fallback styling for logo text if svg doesn't load/match */}
                <div className="font-semibold text-[22px] tracking-tight text-[var(--color-carbon)] flex items-center gap-2">
                    <div className="w-8 h-8 bg-[var(--color-signal-blue)] rounded-[8px] flex items-center justify-center text-white font-bold text-lg">R</div>
                    Resume.ai
                </div>
            </Link>
            {isSignedIn ?
                <div className='flex gap-4 items-center'>
                    <Link to={'/dashboard'}>
                        <Button variant="outline" className="border-none text-[var(--color-ink)] hover:bg-[var(--color-mist)] rounded-[36px] px-[16px] font-medium text-[16px]">Dashboard</Button>
                    </Link>
                    <div className="w-[1px] h-6 bg-[var(--color-chalk)] mx-2"></div>
                    <UserButton />
                </div> :
                <Link to={'/auth/sign-in'}>
                    <Button className="bg-[var(--color-signal-blue)] hover:bg-[var(--color-deep-signal)] text-white rounded-[36px] px-[24px] py-[18px] text-[16px] font-medium transition-colors">Get Started</Button>
                </Link>
            }

        </div>
    )
}

export default Header