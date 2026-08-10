import React, { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ResumePDF } from '@/pdf/ResumePDF';
import confetti from 'canvas-confetti';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export const ExportModal = ({ isOpen, onOpenChange, resumeInfo }) => {
  const [copied, setCopied] = useState(false);
  const liveUrl = `${window.location.origin}/my-resume/${resumeInfo?.documentId}/view`;

  const triggerConfetti = () => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#4f46e5', '#34d399', '#f8fafc'] });
  };

  const copyLink = () => {
    navigator.clipboard.writeText(liveUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl sm:max-w-md p-6">
        <DialogHeader className="mb-6 text-center">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
            <span className="material-symbols-outlined text-emerald-400 text-3xl">task_alt</span>
          </div>
          <DialogTitle className="text-2xl font-bold text-slate-50 tracking-tight">Ready for Launch! 🚀</DialogTitle>
          <p className="text-sm text-slate-400 mt-2">Your ATS-optimized resume is compiled and ready to share.</p>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <PDFDownloadLink document={<ResumePDF resumeData={resumeInfo} />} fileName={`${resumeInfo?.firstName || 'Resume'}_ATS.pdf`}>
            {({ loading }) => (
              <button 
                onClick={!loading ? triggerConfetti : undefined}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[20px]">{loading ? 'sync' : 'picture_as_pdf'}</span>
                {loading ? 'Compiling PDF...' : 'Download ATS PDF'}
              </button>
            )}
          </PDFDownloadLink>

          <div className="flex items-center gap-2 p-3 bg-slate-900 rounded-xl border border-slate-800">
            <span className="material-symbols-outlined text-slate-500 text-[18px]">link</span>
            <input readOnly value={liveUrl} className="flex-1 bg-transparent text-sm text-slate-300 outline-none" />
            <button onClick={copyLink} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
