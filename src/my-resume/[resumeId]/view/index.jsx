import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ResumePDF } from '@/pdf/ResumePDF';
import { useParams } from 'react-router-dom';
import GlobalApi from '@/service/GlobalApi';
import { setResumeData } from '@/store/resumeSlice';
import ResumePreview from '@/dashboard/resume/components/ResumePreview';
import { Share2, Download, Printer } from 'lucide-react';
import { toast } from 'sonner';

export default function ResumeViewPage() {
  const { resumeId } = useParams();
  const dispatch = useDispatch();
  const resumeData = useSelector((state) => state.resume.resumeData);
  const [loadingData, setLoadingData] = useState(!resumeData);

  useEffect(() => {
    if (!resumeData && resumeId) {
      GlobalApi.GetResumeById(resumeId).then((resp) => {
        dispatch(setResumeData(resp.data.data));
        setLoadingData(false);
      }).catch((err) => {
        console.error(err);
        setLoadingData(false);
      });
    }
  }, [resumeId, resumeData]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  if (loadingData) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-surface-container-low pb-20">
      {/* Action Bar */}
      <div id="no-print" className="bg-surface-container-lowest border-b border-outline-variant/30 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="font-headline-sm text-2xl font-bold text-on-surface">Your Document is Ready</h1>
            <p className="font-body-sm text-on-surface-variant">You can now share or download your resume.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-surface border border-outline-variant/40 rounded-xl font-label-md hover:bg-surface-variant transition-colors"
            >
              <Share2 className="w-4 h-4" /> Share
            </button>
            
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 bg-surface border border-outline-variant/40 rounded-xl font-label-md hover:bg-surface-variant transition-colors"
            >
              <Printer className="w-4 h-4" /> Print Visual
            </button>

            <PDFDownloadLink
              document={<ResumePDF resumeData={resumeData} />}
              fileName={`${resumeData?.firstName || 'Resume'}_ATS.pdf`}
            >
              {({ loading }) => (
                <button 
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2 bg-stitch-primary text-on-primary rounded-xl font-label-md hover:bg-stitch-primary/90 transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4" /> 
                  {loading ? 'Preparing ATS...' : 'Download ATS PDF'}
                </button>
              )}
            </PDFDownloadLink>
          </div>
        </div>
      </div>

      {/* Visual Resume Canvas */}
      <div id="print-area" className="max-w-[850px] mx-auto mt-10 bg-white shadow-xl rounded-sm overflow-hidden min-h-[1100px] border border-outline-variant/20">
        <ResumePreview />
      </div>
    </div>
  );
}