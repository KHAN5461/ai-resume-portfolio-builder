import React, { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ResumePDF } from '@/pdf/ResumePDF';
import { generateDocx } from '@/lib/docxExport';
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

  const downloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(resumeInfo, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${resumeInfo?.firstName || 'Resume'}.json`);
    document.body.appendChild(downloadAnchorNode); 
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    triggerConfetti();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-surface-container-highest border border-outline-variant/30 rounded-2xl shadow-2xl sm:max-w-md p-6">
        <DialogHeader className="mb-6 text-center">
          <div className="w-16 h-16 bg-stitch-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-stitch-primary/20">
            <span className="material-symbols-outlined text-stitch-primary text-3xl">task_alt</span>
          </div>
          <DialogTitle className="text-2xl font-bold text-on-surface tracking-tight">Ready for Launch! 🚀</DialogTitle>
          <p className="text-sm text-on-surface-variant mt-2">Your ATS-optimized resume is compiled and ready to share.</p>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <PDFDownloadLink document={<ResumePDF resumeData={resumeInfo} />} fileName={`${resumeInfo?.firstName || 'Resume'}_ATS.pdf`}>
            {({ loading }) => (
              <button 
                onClick={!loading ? triggerConfetti : undefined}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-stitch-primary hover:bg-stitch-primary/90 text-white rounded-xl font-semibold transition-all shadow-[0_0_20px_rgba(159,91,255,0.3)] disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[20px]">{loading ? 'sync' : 'picture_as_pdf'}</span>
                {loading ? 'Compiling PDF...' : 'Download ATS PDF'}
              </button>
            )}
          </PDFDownloadLink>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => { downloadJSON(); }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-surface hover:bg-surface-variant border border-outline-variant/30 text-on-surface rounded-xl font-semibold transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[20px]">data_object</span>
              Export JSON
            </button>

            <button 
              onClick={async () => {
                  try {
                      await generateDocx(resumeInfo);
                      triggerConfetti();
                  } catch (e) {
                      console.error("Docx generation failed", e);
                  }
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-surface hover:bg-surface-variant border border-outline-variant/30 text-on-surface rounded-xl font-semibold transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[20px]">description</span>
              Export Word
            </button>
          </div>

          <div className="flex items-center gap-2 p-3 bg-surface border border-outline-variant/30 rounded-xl mt-2">
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">link</span>
            <input readOnly value={liveUrl} className="flex-1 bg-transparent text-sm text-on-surface outline-none" />
            <button onClick={copyLink} className="px-3 py-1.5 bg-surface-variant hover:bg-outline-variant/30 text-on-surface rounded-lg text-xs font-medium transition-colors">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
