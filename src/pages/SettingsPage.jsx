import React from 'react';
import { Button } from "@/components/ui/button";
import { HardDrive, Cloud, Loader2, Database, Settings, Puzzle, ArrowLeft } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { useSelector, useDispatch } from 'react-redux';
import { setDriveStatus, setDriveToken } from '../store/syncSlice';
import { disconnectDrive } from '../service/DriveService';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState('integrations');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const driveStatus = useSelector(state => state.sync.driveStatus);
  const driveToken = useSelector(state => state.sync.driveToken);

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
                    <Settings className="w-4 h-4" /> General
                </button>
                <button 
                    onClick={() => setActiveTab('integrations')}
                    className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'integrations' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'}`}
                >
                    <Puzzle className="w-4 h-4" /> Integrations
                </button>
            </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white dark:bg-slate-900 p-8">
            {activeTab === 'general' && (
                <div className="flex flex-col gap-6 max-w-2xl">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">General Settings</h2>
                    <p className="text-sm text-slate-500">More settings coming soon.</p>
                </div>
            )}

            {activeTab === 'integrations' && (
                <div className="flex flex-col gap-6 max-w-2xl">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Integrations</h2>
                    
                    {/* Storage & Sync Section */}
                    <section>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                        <Database className="w-4 h-4" /> Storage & Sync
                    </h3>
                    
                    <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div className="flex flex-col gap-2">
                                <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    Google Drive Integration
                                    {driveStatus === 'connected' && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 border border-green-200">
                                            ACTIVE
                                        </span>
                                    )}
                                </h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Silently auto-save your portfolio and resume data directly to your personal Google Drive cloud.
                                </p>
                            </div>
                            
                            <div className="shrink-0 mt-2 sm:mt-0">
                                {driveStatus === 'disconnected' && (
                                    <Button onClick={triggerDriveConnect} className="bg-indigo-600 hover:bg-indigo-700 text-white flex gap-2 shadow-sm rounded-lg transition-colors w-full sm:w-auto">
                                        <HardDrive className="w-4 h-4" /> Connect Drive
                                    </Button>
                                )}
                                {driveStatus === 'connecting' && (
                                    <Button disabled className="flex gap-2 rounded-lg bg-indigo-100 text-indigo-700 opacity-80 w-full sm:w-auto">
                                        <Loader2 className="w-4 h-4 animate-spin" /> Connecting
                                    </Button>
                                )}
                                {driveStatus === 'connected' && (
                                    <Button variant="outline" onClick={handleDisconnect} className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 flex gap-2 rounded-lg transition-colors w-full sm:w-auto">
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
