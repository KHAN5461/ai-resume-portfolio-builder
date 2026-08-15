import React, { useState, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Sparkles } from 'lucide-react';
import { transformResumeData } from '@/service/AITransformer';
import { useDispatch, useSelector } from 'react-redux';
import { importAIState } from '@/store/resumeSlice';
import { startLoading, stopLoading, selectIsLoading } from '@/store/loadingSlice';
import { toast } from 'sonner';

export default function MagicImportModal() {
    const [open, setOpen] = useState(false);
    const [rawText, setRawText] = useState('');
    
    const dispatch = useDispatch();
    const resumeInfo = useSelector(state => state.resume.present.resumeData);
    const isAILoading = useSelector(selectIsLoading('ai-generation'));

    const handleImport = async () => {
        if (!rawText.trim()) return;
        dispatch(startLoading('ai-generation'));
        try {
            const transformedJson = await transformResumeData(rawText);
            
            // 1. Dispatch to Redux SSoT
            dispatch(importAIState(transformedJson));
            
            // 2. Sync Bridge to existing Context
            if (transformedJson.resumeData) {
                // Map the new schema to the existing Context schema loosely
                // Assuming the new schema has camelCase matching the original context mostly.
                const newInfo = {
                    ...resumeInfo,
                    firstName: transformedJson.resumeData.personalInfo?.fullName?.split(' ')[0] || '',
                    lastName: transformedJson.resumeData.personalInfo?.fullName?.split(' ').slice(1).join(' ') || '',
                    jobTitle: transformedJson.resumeData.personalInfo?.targetTitle || '',
                    address: transformedJson.resumeData.personalInfo?.location || '',
                    phone: transformedJson.resumeData.personalInfo?.phone || '',
                    email: transformedJson.resumeData.personalInfo?.email || '',
                    summery: transformedJson.resumeData.professionalSummary || '',
                    Experience: transformedJson.resumeData.workExperience?.map(exp => ({
                        title: exp.role,
                        companyName: exp.company,
                        city: exp.location,
                        startDate: exp.startDate,
                        endDate: exp.endDate,
                        workSummery: exp.bullets?.join('\n') || ''
                    })) || [],
                    education: transformedJson.resumeData.education?.map(edu => ({
                        universityName: edu.institution,
                        degree: edu.degree,
                        major: edu.gpaOrHonors,
                        startDate: edu.startDate,
                        endDate: edu.endDate,
                        description: ''
                    })) || [],
                    skills: transformedJson.resumeData.skills?.languages?.map(s => ({ name: s, rating: 5 })) || []
                };
                // Dispatch directly to Redux
                dispatch({ type: 'resume/setResumeData', payload: newInfo });
            }
            
            toast('Successfully imported magic AI data!');
            setOpen(false);
            setRawText('');
        } catch (error) {
            toast('Failed to process data. Please try again.');
        } finally {
            dispatch(stopLoading('ai-generation'));
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary" className="gap-2 border-primary border">
                    <Sparkles className="w-4 h-4 text-primary" /> Magic Import
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>✨ Magic AI Import</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-sm text-gray-500 mb-4">
                        Paste your raw career notes, an old resume, or a brain-dump here. Our AI will automatically structure and professionalize it across all sections.
                    </p>
                    <Textarea 
                        value={rawText}
                        onChange={(e) => setRawText(e.target.value)}
                        placeholder="e.g. Worked at Google from 2020-2022 as Software Engineer. Built scalable microservices in Go..."
                        className="h-48"
                    />
                </div>
                <div className="flex justify-end gap-3">
                    <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleImport} disabled={isAILoading || !rawText.trim()}>
                        {isAILoading ? <Loader2 className="animate-spin" /> : 'Import to Profile'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
