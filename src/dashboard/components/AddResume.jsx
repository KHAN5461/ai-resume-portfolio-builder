import { Loader2, Plus, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { v4 as uuidv4 } from 'uuid';
import GlobalApi from './../../../service/GlobalApi'
import { useUser } from '../../auth.jsx'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner';

function AddResume({ renderTrigger }) {
    const [openDialog, setOpenDialog] = useState(false);
    const [resumeTitle, setResumeTitle] = useState('');
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const navigation = useNavigate();

    const onCreate = async () => {
        if (!resumeTitle.trim()) {
            toast.error('Please enter a title for your resume');
            return;
        }
        setLoading(true);
        const uuid = uuidv4();
        const data = {
            data: {
                title: resumeTitle,
                resumeId: uuid,
                userEmail: user?.primaryEmailAddress?.emailAddress,
                userName: user?.fullName,
                themeColor: '#4f46e5'
            }
        };

        GlobalApi.CreateNewResume(data).then(resp => {
            if (resp) {
                setLoading(false);
                setOpenDialog(false);
                navigation('/dashboard/resume/' + resp.data.data.documentId + "/edit");
            }
        }, (error) => {
            console.error(error);
            toast.error('Failed to create resume');
            setLoading(false);
        });
    };

    return (
        <div>
            {renderTrigger ? (
                renderTrigger(() => setOpenDialog(true))
            ) : (
                <div 
                    className='p-8 items-center flex flex-col justify-center bg-white dark:bg-slate-900 rounded-xl h-[280px] hover:border-indigo-500/50 cursor-pointer border border-slate-200 dark:border-slate-800 shadow-xs group transition-all'
                    onClick={() => setOpenDialog(true)}
                >
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                        <Plus className="w-6 h-6 stroke-[2px]" />
                    </div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Create Blank Resume</span>
                </div>
            )}

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent 
                    onPointerDownOutside={(e) => e.preventDefault()}
                    onInteractOutside={(e) => e.preventDefault()}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl max-w-md p-6"
                >
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">Create New Resume</DialogTitle>
                        <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Enter a title or target role for your new resume
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                        <Input 
                            className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-500/20" 
                            placeholder="e.g. Senior Full Stack Engineer"
                            value={resumeTitle}
                            onChange={(e) => setResumeTitle(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') onCreate();
                            }}
                            autoFocus
                        />
                        <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/50 dark:border-indigo-800/50 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                <span className="text-xs text-indigo-900 dark:text-indigo-200 font-medium">Want AI to draft it for you?</span>
                            </div>
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    setOpenDialog(false);
                                    navigation('/dashboard/resume/new/ai');
                                }}
                                className="text-xs h-7 border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-lg"
                            >
                                Use AI Studio
                            </Button>
                        </div>
                        <div className='flex justify-end gap-2 pt-2'>
                            <Button 
                                onClick={() => setOpenDialog(false)} 
                                variant="ghost" 
                                className="text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs"
                            >
                                Cancel
                            </Button>
                            <Button 
                                disabled={!resumeTitle.trim() || loading}
                                onClick={onCreate}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                            >
                                {loading ? <Loader2 className='w-3.5 h-3.5 animate-spin mr-1.5' /> : null}
                                <span>Create Blank</span>
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default AddResume;