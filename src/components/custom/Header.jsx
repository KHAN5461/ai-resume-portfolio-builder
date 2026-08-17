import React from 'react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'
import { UserButton, useUser } from '../../auth.jsx'
import { Menu, Cloud, CloudOff, Loader2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import useHideOnScroll from '../../hooks/useHideOnScroll'
import { useSelector, useDispatch } from 'react-redux';
import { setDriveStatus, setDriveToken } from '../../store/syncSlice';
import { useGoogleLogin } from '@react-oauth/google';

function Header() {
    const { user, isSignedIn } = useUser();
    const isVisible = useHideOnScroll();
    const dispatch = useDispatch();
    const driveStatus = useSelector(state => state.sync.driveStatus); // 'disconnected', 'connecting', 'connected'

    const handleConnectDrive = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            dispatch(setDriveToken(tokenResponse.access_token));
            dispatch(setDriveStatus('connected'));
        },
        onError: (error) => {
            console.error("Drive connection failed", error);
            dispatch(setDriveStatus('disconnected'));
        },
        onNonOAuthError: () => {
            dispatch(setDriveStatus('disconnected'));
        },
        scope: 'https://www.googleapis.com/auth/drive.file',
    });

    const triggerDriveConnect = () => {
        dispatch(setDriveStatus('connecting'));
        handleConnectDrive();
    };

    return (
        <div className={`p-4 px-8 flex justify-between items-center bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 sticky top-0 z-50 shadow-sm transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
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
                    <div className="flex items-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon" className="rounded-full">
                                    <Menu className="w-5 h-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild><Link to="/dashboard">Dashboard</Link></DropdownMenuItem>
                                <DropdownMenuItem asChild><Link to="/profile">Profile</Link></DropdownMenuItem>
                                <DropdownMenuItem asChild><Link to="/settings">Settings</Link></DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="w-[1px] h-6 bg-outline-variant/50 mx-2 hidden md:block"></div>

                    {/* Drive Sync Status Indicator */}
                    <div className="hidden md:flex items-center" title={driveStatus === 'connected' ? 'Drive Connected (Synced)' : 'Drive Disconnected'}>
                        {driveStatus === 'disconnected' && (
                            <Button variant="ghost" size="sm" onClick={triggerDriveConnect} className="text-red-500 hover:text-red-600 hover:bg-red-50 flex gap-2">
                                <HardDrive className="w-4 h-4" />
                                <span className="text-xs">Connect Drive</span>
                            </Button>
                        )}
                        {driveStatus === 'connecting' && (
                            <div className="text-yellow-500 flex gap-2 items-center px-3">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="text-xs">Connecting...</span>
                            </div>
                        )}
                        {driveStatus === 'connected' && (
                            <div className="text-green-500 flex gap-2 items-center px-3">
                                <Cloud className="w-4 h-4" />
                                <span className="text-xs">Synced</span>
                            </div>
                        )}
                    </div>

                    <div className="w-[1px] h-6 bg-outline-variant/50 mx-2 hidden md:block"></div>
                    <div className="hover:scale-110 transition-transform duration-200">
                        <UserButton />
                    </div>
                </div> :
                <div>
                    <Link to={'/auth/sign-in'} className="hidden md:block">
                        <Button className="bg-stitch-primary hover:bg-stitch-primary/90 text-on-primary rounded-full px-6 py-5 text-[15px] font-medium shadow-[0_4px_14px_rgba(0,105,110,0.3)] hover:shadow-[0_6px_20px_rgba(0,105,110,0.4)] transition-all duration-300 hover:-translate-y-0.5">Get Started</Button>
                    </Link>
                    <div className="md:hidden">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon" className="rounded-full">
                                    <Menu className="w-5 h-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild><Link to="/auth/sign-in">Get Started</Link></DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            }
        </div>
    )
}

export default Header