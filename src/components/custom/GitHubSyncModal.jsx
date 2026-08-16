import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Github } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { updateProfileData } from '@/store/profileSlice';
import { toast } from 'sonner';

export default function GitHubSyncModal({ renderTrigger }) {
    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    const handleSync = async () => {
        if (!username.trim()) return;
        setIsLoading(true);
        
        try {
            // Use Web Worker to prevent UI blocking during large JSON parse and sort
            const worker = new Worker(new URL('../../workers/githubWorker.js', import.meta.url), { type: 'module' });
            
            worker.onmessage = (e) => {
                const { success, repos, error } = e.data;
                if (success) {
                    dispatch(updateProfileData({ projects: repos }));
                    toast('Successfully synced GitHub repositories!');
                    setOpen(false);
                    setUsername('');
                } else {
                    toast(error || 'Failed to sync GitHub. Please try again.');
                }
                setIsLoading(false);
                worker.terminate();
            };

            worker.onerror = (error) => {
                toast('Failed to sync GitHub due to a worker error.');
                console.error('Worker error:', error);
                setIsLoading(false);
                worker.terminate();
            };

            worker.postMessage({ username: username.trim() });
        } catch (error) {
            toast('Failed to initialize Web Worker.');
            console.error(error);
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {renderTrigger ? (
                    renderTrigger(() => setOpen(true))
                ) : (
                    <Button variant="secondary" className="gap-2 border-primary border">
                        <Github className="w-4 h-4 text-primary" /> GitHub Sync
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Sync GitHub Profile</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-sm text-gray-500 mb-4">
                        Enter your GitHub username to automatically pull in your top repositories.
                    </p>
                    <Input 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="e.g. torvalds"
                    />
                </div>
                <div className="flex justify-end gap-3">
                    <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSync} disabled={isLoading || !username.trim()}>
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Sync'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
