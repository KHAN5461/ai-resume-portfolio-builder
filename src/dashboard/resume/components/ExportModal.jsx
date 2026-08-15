import React, { useState, useMemo } from 'react';
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
import { mapResumeInfoToTemplateData, validateTemplateData } from '@/lib/templateDataMapper';

class PDFErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return <div className="text-red-500 text-sm p-4">PDF generation failed. <button onClick={() => this.setState({hasError: false})}>Retry</button></div>;
    }
    return this.props.children;
  }
}

export const ExportModal = ({ isOpen, onOpenChange, resumeInfo }) => {
  const [copied, setCopied] = useState(false);
  const [showWarnings, setShowWarnings] = useState(false);
  const liveUrl = `${window.location.origin}/my-resume/${resumeInfo?.documentId}/view`;

  const { valid, warnings } = useMemo(() => validateTemplateData(mapResumeInfoToTemplateData(resumeInfo)), [resumeInfo]);

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
          <PDFErrorBoundary>
            <PDFDownloadLink document={<ResumePDF resumeData={resumeInfo} />} fileName={`${resumeInfo?.firstName || 'Resume'}_ATS.pdf`}>
              {({ loading }) => (
                <button 
                  onClick={!loading && valid ? triggerConfetti : undefined}
                  disabled={loading || !valid}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-stitch-primary hover:bg-stitch-primary/90 text-white rounded-xl font-semibold transition-all shadow-[0_0_20px_rgba(159,91,255,0.3)] disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[20px]">{loading ? 'sync' : 'picture_as_pdf'}</span>
                  {loading ? 'Compiling PDF...' : 'Download ATS PDF'}
                </button>
              )}
            </PDFDownloadLink>
          </PDFErrorBoundary>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => { downloadJSON(); }}
              disabled={!valid}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-surface hover:bg-surface-variant border border-outline-variant/30 text-on-surface rounded-xl font-semibold transition-colors shadow-sm disabled:opacity-50"
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
              disabled={!valid}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-surface hover:bg-surface-variant border border-outline-variant/30 text-on-surface rounded-xl font-semibold transition-colors shadow-sm disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[20px]">description</span>
              Export Word
            </button>
          </div>

          {!valid && warnings?.length > 0 && (
            <div className="mt-2 text-sm">
              <button 
                onClick={() => setShowWarnings(!showWarnings)}
                className="text-red-500 font-medium flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">{showWarnings ? 'expand_less' : 'expand_more'}</span>
                {warnings.length} Validation Warning{warnings.length > 1 ? 's' : ''} (Export Disabled)
              </button>
              {showWarnings && (
                <ul className="list-disc pl-5 mt-2 text-red-400 text-xs space-y-1">
                  {warnings.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              )}
            </div>
          )}

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
