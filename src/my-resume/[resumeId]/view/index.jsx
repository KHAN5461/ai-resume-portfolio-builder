import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ResumePDF } from '@/pdf/ResumePDF';
import { useParams } from 'react-router-dom';
import GlobalApi from '@/service/GlobalApi';
import { setResumeData } from '@/store/resumeSlice';
import ResumePreview from '@/dashboard/resume/components/ResumePreview';
import { Share2, Download, Printer, Link2, X, Globe, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function ResumeViewPage() {
  const { resumeId } = useParams();
  const dispatch = useDispatch();
  const resumeData = useSelector((state) => state.resume.resumeData);
  const [loadingData, setLoadingData] = useState(!resumeData);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [customSlug, setCustomSlug] = useState('');
  const [viewMode, setViewMode] = useState('document'); // 'document' | 'portfolio'

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
    setIsShareModalOpen(true);
  };

  const copyLink = (link) => {
    navigator.clipboard.writeText(link);
    toast.success('Link copied to clipboard!');
  }

  const handleExportTxt = () => {
    if (!resumeData) return;
    let txt = `${resumeData.firstName || ''} ${resumeData.lastName || ''}\n`;
    txt += `${resumeData.jobTitle || ''}\n`;
    txt += `${resumeData.email || ''} | ${resumeData.phone || ''}\n\n`;
    if (resumeData.summery) {
      txt += `SUMMARY\n${resumeData.summery.replace(/<[^>]*>?/gm, '')}\n\n`;
    }
    if (resumeData.Experience && resumeData.Experience.length > 0) {
      txt += `EXPERIENCE\n`;
      resumeData.Experience.forEach(exp => {
        txt += `${exp.title} at ${exp.companyName}\n`;
        txt += `${exp.startDate} - ${exp.endDate || 'Present'}\n`;
        if (exp.workSummery) txt += `${exp.workSummery.replace(/<[^>]*>?/gm, '')}\n`;
        txt += `\n`;
      });
    }
    if (resumeData.education && resumeData.education.length > 0) {
      txt += `EDUCATION\n`;
      resumeData.education.forEach(edu => {
        txt += `${edu.degree} in ${edu.major}\n`;
        txt += `${edu.universityName}\n`;
        txt += `${edu.startDate} - ${edu.endDate}\n`;
        if (edu.description) txt += `${edu.description.replace(/<[^>]*>?/gm, '')}\n`;
        txt += `\n`;
      });
    }
    if (resumeData.skills && resumeData.skills.length > 0) {
      txt += `SKILLS\n`;
      resumeData.skills.forEach(skill => {
        txt += `- ${skill.name}\n`;
      });
    }

    const blob = new Blob([txt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${resumeData.firstName || 'Resume'}_ATS.txt`;
    a.click();
    toast.success('TXT file downloaded');
    setIsExportModalOpen(false);
  }

  const handleExportJson = () => {
    if (!resumeData) return;
    const json = JSON.stringify(resumeData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${resumeData.firstName || 'Resume'}_Data.json`;
    a.click();
    toast.success('JSON file downloaded');
    setIsExportModalOpen(false);
  }

  if (loadingData) return (
    <div className="min-h-screen bg-surface-container-low pb-20">
      <div className="fixed top-0 left-0 w-full z-50 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-outline-variant/30 h-[88px] flex items-center">
        <div className="max-w-5xl mx-auto px-6 w-full flex justify-between items-center">
            <div className="flex flex-col gap-2">
                <div className="w-48 h-6 bg-surface-variant/50 rounded animate-pulse"></div>
                <div className="w-64 h-4 bg-surface-variant/30 rounded animate-pulse"></div>
            </div>
            <div className="flex gap-4">
                <div className="w-24 h-10 bg-surface-variant/50 rounded-xl animate-pulse"></div>
                <div className="w-24 h-10 bg-surface-variant/50 rounded-xl animate-pulse"></div>
                <div className="w-32 h-10 bg-surface-variant/80 rounded-xl animate-pulse"></div>
            </div>
        </div>
      </div>
      <div className="max-w-[850px] mx-auto mt-32 bg-white shadow-xl rounded-sm overflow-hidden min-h-[1100px] border border-outline-variant/20 p-12">
        <div className="flex flex-col items-center gap-4 mb-12">
            <div className="w-64 h-8 bg-surface-variant/20 rounded animate-pulse"></div>
            <div className="w-48 h-4 bg-surface-variant/20 rounded animate-pulse"></div>
            <div className="flex gap-4">
                <div className="w-32 h-4 bg-surface-variant/20 rounded animate-pulse"></div>
                <div className="w-32 h-4 bg-surface-variant/20 rounded animate-pulse"></div>
            </div>
        </div>
        <div className="w-full h-px bg-surface-variant/20 mb-8"></div>
        <div className="space-y-6">
            <div className="w-32 h-6 bg-surface-variant/20 rounded animate-pulse mb-4"></div>
            <div className="w-full h-4 bg-surface-variant/20 rounded animate-pulse"></div>
            <div className="w-full h-4 bg-surface-variant/20 rounded animate-pulse"></div>
            <div className="w-3/4 h-4 bg-surface-variant/20 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-container-low pb-20">
      {/* Action Bar */}
      <div id="no-print" className="fixed top-0 left-0 w-full z-50 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm transition-all">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="font-headline-sm text-2xl font-bold text-on-surface flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-stitch-primary/10 flex items-center justify-center text-stitch-primary">
                <span className="material-symbols-outlined text-[18px]">check</span>
              </span>
              Your Document is Ready
            </h1>
            <p className="font-body-sm text-on-surface-variant mt-1 ml-10">You can now share or download your resume.</p>
          </div>

          {/* Mode Toggle */}
          <div className="flex bg-surface-variant/30 rounded-full p-1 gap-1 border border-outline-variant/20">
            <button 
              onClick={() => setViewMode('document')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-label-md transition-colors ${viewMode === 'document' ? 'bg-white text-stitch-primary shadow-sm' : 'text-on-surface-variant'}`}
            >
              <FileText className="w-4 h-4" /> Document
            </button>
            <button 
              onClick={() => setViewMode('portfolio')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-label-md transition-colors ${viewMode === 'portfolio' ? 'bg-white text-stitch-primary shadow-sm' : 'text-on-surface-variant'}`}
            >
              <Globe className="w-4 h-4" /> Portfolio
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleShare}
              className="group flex items-center gap-2 px-4 py-2.5 bg-surface border border-outline-variant/40 rounded-xl font-label-md hover:border-stitch-primary/40 hover:bg-surface-variant transition-all shadow-sm active:scale-95"
            >
              <Share2 className="w-4 h-4 group-hover:text-stitch-primary transition-colors" /> Share
            </button>
            
            <button 
              onClick={() => window.print()}
              className="group flex items-center gap-2 px-4 py-2.5 bg-surface border border-outline-variant/40 rounded-xl font-label-md hover:border-stitch-primary/40 hover:bg-surface-variant transition-all shadow-sm active:scale-95"
            >
              <Printer className="w-4 h-4 group-hover:text-stitch-primary transition-colors" /> Print Visual
            </button>

            {/* Export Button */}
            <button 
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-stitch-primary text-on-primary rounded-xl font-label-md hover:bg-stitch-primary/90 transition-all shadow-sm active:scale-95"
            >
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExportModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface-container-lowest w-full max-w-lg rounded-3xl p-8 shadow-2xl relative"
            >
              <button 
                  onClick={() => setIsExportModalOpen(false)}
                  className="absolute top-4 right-4 p-2 text-on-surface-variant hover:bg-surface-variant rounded-full transition-colors z-10"
              >
                  <X className="w-5 h-5" />
              </button>

              <h2 className="font-headline-sm font-bold text-on-surface mb-2">Export Options</h2>
              <p className="font-body-sm text-on-surface-variant mb-6">Choose a format to download your resume.</p>

              <div className="flex flex-col gap-4">
                <PDFDownloadLink
                  document={<ResumePDF resumeData={resumeData} settings={{ pageSize: 'A4', baseFontSize: 10, margins: 36 }} />}
                  fileName={`${resumeData?.firstName || 'Resume'}_ATS.pdf`}
                >
                  {({ loading }) => (
                    <button 
                        disabled={loading}
                        onClick={() => setIsExportModalOpen(false)}
                        className="w-full flex items-center justify-between p-4 bg-surface border border-outline-variant/40 rounded-xl hover:border-stitch-primary/40 hover:bg-stitch-primary/5 transition-all text-left"
                      >
                        <div>
                           <div className="font-label-md text-on-surface flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">picture_as_pdf</span> PDF Document</div>
                           <div className="font-body-sm text-on-surface-variant mt-1">Best for printing and sharing visually. ATS optimized.</div>
                        </div>
                        <Download className="w-5 h-5 text-stitch-primary" />
                    </button>
                  )}
                </PDFDownloadLink>

                <button 
                    onClick={handleExportTxt}
                    className="w-full flex items-center justify-between p-4 bg-surface border border-outline-variant/40 rounded-xl hover:border-stitch-primary/40 hover:bg-stitch-primary/5 transition-all text-left"
                >
                    <div>
                        <div className="font-label-md text-on-surface flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">description</span> Plain Text (.txt)</div>
                        <div className="font-body-sm text-on-surface-variant mt-1">100% ATS readable format without any styling.</div>
                    </div>
                    <Download className="w-5 h-5 text-stitch-primary" />
                </button>

                <button 
                    onClick={handleExportJson}
                    className="w-full flex items-center justify-between p-4 bg-surface border border-outline-variant/40 rounded-xl hover:border-stitch-primary/40 hover:bg-stitch-primary/5 transition-all text-left"
                >
                    <div>
                        <div className="font-label-md text-on-surface flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">data_object</span> JSON Resume</div>
                        <div className="font-body-sm text-on-surface-variant mt-1">Machine-readable JSON schema of your profile.</div>
                    </div>
                    <Download className="w-5 h-5 text-stitch-primary" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface-container-lowest w-full max-w-lg rounded-3xl p-8 shadow-2xl relative"
            >
              <button 
                  onClick={() => setIsShareModalOpen(false)}
                  className="absolute top-4 right-4 p-2 text-on-surface-variant hover:bg-surface-variant rounded-full transition-colors z-10"
              >
                  <X className="w-5 h-5" />
              </button>

              <h2 className="font-headline-sm font-bold text-on-surface mb-2">Share your Resume</h2>
              <p className="font-body-sm text-on-surface-variant mb-6">Claim a custom URL to make your resume easy to share.</p>

              <div className="mb-6">
                <label className="font-label-md text-on-surface block mb-2">Custom Slug</label>
                <div className="flex bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/30 focus-within:border-stitch-primary focus-within:ring-1 focus-within:ring-stitch-primary transition-all">
                  <div className="bg-surface-variant/50 px-4 py-3 text-on-surface-variant font-body-md border-r border-outline-variant/30 flex items-center">
                    sparkfolio.com/
                  </div>
                  <input 
                    type="text" 
                    placeholder="john-doe-2026"
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    className="flex-1 bg-transparent px-4 py-3 outline-none font-body-md text-on-surface"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button 
                  onClick={() => copyLink(`https://sparkfolio.com/${customSlug || resumeId}`)}
                  className="flex-1 bg-stitch-primary hover:bg-stitch-primary/90 text-white rounded-xl py-3 font-label-md flex items-center justify-center gap-2"
                >
                  <Link2 className="w-5 h-5" /> Copy Custom Link
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Visual Resume Canvas - Add top margin to account for fixed header */}
      {viewMode === 'document' ? (
        <div id="print-area" className="max-w-[850px] mx-auto mt-32 bg-white shadow-xl rounded-sm overflow-hidden min-h-[1100px] border border-outline-variant/20">
          <ResumePreview />
        </div>
      ) : (
        <div className="max-w-4xl mx-auto mt-32 p-8 bg-surface-container-lowest rounded-3xl shadow-lg border border-outline-variant/20 text-center">
            <h1 className="text-4xl font-headline-lg font-bold mb-4">{resumeData?.firstName} {resumeData?.lastName}</h1>
            <p className="text-xl text-on-surface-variant mb-12">{resumeData?.jobTitle}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {resumeData?.Experience?.map((exp, idx) => (
                    <div key={idx} className="bg-surface rounded-xl p-6 shadow-sm border border-outline-variant/30 text-left hover:-translate-y-1 transition-transform">
                        <h3 className="font-headline-md font-bold">{exp.title}</h3>
                        <p className="font-body-md text-stitch-primary mb-4">{exp.companyName}</p>
                        <div className="font-body-sm text-on-surface-variant" dangerouslySetInnerHTML={{__html: exp.workSummery}} />
                    </div>
                ))}
            </div>

            <div className="bg-surface-container-low p-8 rounded-2xl max-w-lg mx-auto">
                <h3 className="font-headline-md font-bold mb-4">Get In Touch</h3>
                <input placeholder="Your Name" className="w-full mb-4 p-3 rounded-xl border border-outline-variant/30" />
                <input placeholder="Your Email" className="w-full mb-4 p-3 rounded-xl border border-outline-variant/30" />
                <textarea placeholder="Message" className="w-full mb-4 p-3 rounded-xl border border-outline-variant/30 min-h-[100px]" />
                <button className="w-full bg-stitch-primary text-white py-3 rounded-xl font-bold">Send Message</button>
            </div>
        </div>
      )}
    </div>
  );
}