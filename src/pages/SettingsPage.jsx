import React from 'react';
import { Button } from "@/components/ui/button";
import { HardDrive, Cloud, Loader2, Database, Settings, Puzzle, ArrowLeft, Sun, Moon, Laptop, CheckCircle2 } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { useSelector, useDispatch } from 'react-redux';
import { setDriveStatus, setDriveToken } from '../store/syncSlice';
import { disconnectDrive } from '../service/DriveService';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState('general');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const driveStatus = useSelector(state => state.sync?.driveStatus || 'disconnected');
  const driveToken = useSelector(state => state.sync?.driveToken || null);

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

  const handleDisconnect = async () => {
    dispatch(setDriveStatus('disconnected'));
    if (driveToken) {
        await disconnectDrive(driveToken);
        dispatch(setDriveToken(null));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Settings</h1>
      </header>

      <div className="flex flex-1 max-w-6xl mx-auto w-full">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-2">
            <nav className="flex flex-col gap-1">
                <button 
                    onClick={() => setActiveTab('general')}
                    className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'general' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'}`}
                >
                    <Settings className="w-4 h-4" /> General & Theme
                </button>
                <button 
                    onClick={() => setActiveTab('integrations')}
                    className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'integrations' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'}`}
                >
                    <Puzzle className="w-4 h-4" /> Cloud & Storage
                </button>
            </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white dark:bg-slate-900 p-8">
            {activeTab === 'general' && (
                <div className="flex flex-col gap-6 max-w-2xl">
                    <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">General & Theme</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Customize your interface theme and visual preferences</p>
                    </div>

                    {/* Appearance Section */}
                    <section className="flex flex-col gap-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                            Appearance
                        </h3>

                        <div className="grid grid-cols-3 gap-3">
                            <button
                                onClick={() => setTheme('light')}
                                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                                    theme === 'light'
                                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs'
                                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                                }`}
                            >
                                <Sun className="w-5 h-5" />
                                <span className="text-xs">Light</span>
                            </button>

                            <button
                                onClick={() => setTheme('dark')}
                                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                                    theme === 'dark'
                                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs'
                                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                                }`}
                            >
                                <Moon className="w-5 h-5" />
                                <span className="text-xs">Dark</span>
                            </button>

                            <button
                                onClick={() => setTheme('system')}
                                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                                    theme === 'system'
                                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs'
                                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                                }`}
                            >
                                <Laptop className="w-5 h-5" />
                                <span className="text-xs">System</span>
                            </button>
                        </div>
                    </section>
                </div>
            )}

            {activeTab === 'integrations' && (
                <div className="flex flex-col gap-6 max-w-2xl">
                    <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Cloud & Storage</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage cloud database synchronization and backup destinations</p>
                    </div>
                    
                    {/* Firebase Cloud Sync */}
                    <section>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                            <Database className="w-4 h-4 text-indigo-500" /> Firebase Cloud Database
                        </h3>
                        
                        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-semibold text-sm text-slate-900 dark:text-white">Firestore Real-time Sync</h4>
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                            <CheckCircle2 className="w-3 h-3" /> CONNECTED
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                        Your resumes, portfolios, and account state automatically sync across devices with zero latency local caching and background Firestore cloud persistence.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Google Drive Section */}
                    <section>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                        <HardDrive className="w-4 h-4 text-slate-400" /> Google Drive Backup
                    </h3>
                    
                    <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div className="space-y-1">
                                <h4 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                                    Personal Google Drive
                                    {driveStatus === 'connected' && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                            ACTIVE
                                        </span>
                                    )}
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    Silently auto-save your portfolio and resume data directly to your personal Google Drive cloud.
                                </p>
                            </div>
                            
                            <div className="shrink-0 mt-2 sm:mt-0">
                                {driveStatus === 'disconnected' && (
                                    <Button onClick={triggerDriveConnect} className="bg-indigo-600 hover:bg-indigo-700 text-white flex gap-2 shadow-xs rounded-lg text-xs transition-colors w-full sm:w-auto">
                                        <HardDrive className="w-4 h-4" /> Connect Drive
                                    </Button>
                                )}
                                {driveStatus === 'connecting' && (
                                    <Button disabled className="flex gap-2 rounded-lg bg-indigo-100 text-indigo-700 opacity-80 text-xs w-full sm:w-auto">
                                        <Loader2 className="w-4 h-4 animate-spin" /> Connecting
                                    </Button>
                                )}
                                {driveStatus === 'connected' && (
                                    <Button variant="outline" onClick={handleDisconnect} className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 flex gap-2 rounded-lg text-xs transition-colors w-full sm:w-auto">
                                        <Cloud className="w-4 h-4" /> Disconnect
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
