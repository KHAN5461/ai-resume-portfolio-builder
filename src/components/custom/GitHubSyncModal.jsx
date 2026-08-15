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
            const response = await fetch(`https://api.github.com/users/${username.trim()}/repos?sort=updated&per_page=100`);
            if (!response.ok) {
                throw new Error('Failed to fetch repositories. Please check the username.');
            }
            const repos = await response.json();
            
            // Filter out forks, sort by stargazers_count (descending), take top 6
            const topRepos = repos
                .filter(repo => !repo.fork)
                .sort((a, b) => b.stargazers_count - a.stargazers_count)
                .slice(0, 6);

            const parsedRepos = topRepos.map(repo => ({
                name: repo.name,
                role: "Creator",
                startDate: "",
                endDate: "",
                highlights: [repo.description || ""],
                technologies: repo.language ? [repo.language] : []
            }));

            dispatch(updateProfileData({ projects: parsedRepos }));
            
            toast('Successfully synced GitHub repositories!');
            setOpen(false);
            setUsername('');
        } catch (error) {
            toast(error.message || 'Failed to sync GitHub. Please try again.');
        } finally {
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
