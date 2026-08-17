import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HardDrive, Cloud, Loader2, Database } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { useSelector, useDispatch } from 'react-redux';
import { setDriveStatus, setDriveToken } from '../../store/syncSlice';
import { disconnectDrive } from '../../service/DriveService';
import { Settings, Puzzle } from 'lucide-react';

export default function SettingsDialog({ isOpen, onOpenChange }) {
  const [activeTab, setActiveTab] = React.useState('integrations');
  const dispatch = useDispatch();
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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] h-[500px] p-0 overflow-hidden bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl flex">
        
        {/* Sidebar Navigation */}
        <div className="w-48 bg-slate-50 dark:bg-slate-900/50 border-r border-slate-100 dark:border-slate-800 flex flex-col">
            <div className="p-6 pb-4">
                <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">Settings</DialogTitle>
                <DialogDescription className="sr-only">Settings Navigation</DialogDescription>
            </div>
            
            <nav className="flex flex-col gap-1 px-3">
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
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-950 overflow-y-auto">
            {activeTab === 'general' && (
                <div className="p-8 flex flex-col gap-6">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">General Settings</h2>
                    <p className="text-sm text-slate-500">More settings coming soon.</p>
                </div>
            )}

            {activeTab === 'integrations' && (
                <div className="p-8 flex flex-col gap-6">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Integrations</h2>
                    
                    {/* Storage & Sync Section */}
                    <section>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                        <Database className="w-4 h-4" /> Storage & Sync
                    </h3>
                    
                    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div className="flex flex-col gap-1 pr-4">
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
                            
                            <div className="mt-1 shrink-0">
                                {driveStatus === 'disconnected' && (
                                    <Button onClick={triggerDriveConnect} className="bg-indigo-600 hover:bg-indigo-700 text-white flex gap-2 shadow-sm rounded-lg transition-colors">
                                        <HardDrive className="w-4 h-4" /> Connect Drive
                                    </Button>
                                )}
                                {driveStatus === 'connecting' && (
                                    <Button disabled className="flex gap-2 rounded-lg bg-indigo-100 text-indigo-700 opacity-80">
                                        <Loader2 className="w-4 h-4 animate-spin" /> Connecting
                                    </Button>
                                )}
                                {driveStatus === 'connected' && (
                                    <Button variant="outline" onClick={handleDisconnect} className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 flex gap-2 rounded-lg transition-colors">
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
      </DialogContent>
    </Dialog>
  );
}
