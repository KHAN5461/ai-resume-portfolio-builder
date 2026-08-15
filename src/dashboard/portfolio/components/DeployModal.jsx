import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import confetti from 'canvas-confetti';
import GlobalApi from '@/service/GlobalApi';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export const DeployModal = ({ isOpen, onOpenChange, portfolioId, portfolioData }) => {
  const [step, setStep] = useState(0); // 0 = idle, 1 = saving, 2 = building, 3 = success
  const [copied, setCopied] = useState(false);
  const liveUrl = `${window.location.origin}/p/${portfolioId}`;

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      startDeploySequence();
    }
  }, [isOpen]);

  const startDeploySequence = async () => {
    try {
      setStep(1); // Saving to cloud
      await GlobalApi.UpdatePortfolioDetail(portfolioId, { data: portfolioData });
      
      setStep(2); // Simulated checks
      setTimeout(() => {
          setStep(3); // Success
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#4f46e5', '#34d399', '#f8fafc'] });
      }, 1500);

    } catch (error) {
      toast.error("Failed to deploy portfolio.");
      onOpenChange(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(liveUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-surface-container-highest border border-outline-variant/30 rounded-2xl shadow-2xl sm:max-w-md p-6">
        
        {step < 3 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-6 text-center">
                <Loader2 className="w-12 h-12 text-stitch-primary animate-spin" />
                <div>
                    <h3 className="text-xl font-bold text-on-surface mb-2">Deploying your Portfolio</h3>
                    <p className="text-on-surface-variant text-sm">
                        {step === 1 ? 'Saving changes to cloud...' : 'Optimizing assets and building routes...'}
                    </p>
                </div>
            </div>
        ) : (
            <>
                <DialogHeader className="mb-6 text-center">
                <div className="w-16 h-16 bg-stitch-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-stitch-primary/20">
                    <span className="material-symbols-outlined text-stitch-primary text-3xl">public</span>
                </div>
                <DialogTitle className="text-2xl font-bold text-on-surface tracking-tight">Your Site is Live! 🎉</DialogTitle>
                <p className="text-sm text-on-surface-variant mt-2">Your beautiful portfolio is now live on the web.</p>
                </DialogHeader>

                <div className="flex flex-col gap-4">
                
                <a 
                    href={liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-stitch-primary hover:bg-stitch-primary/90 text-white rounded-xl font-semibold transition-all shadow-[0_0_20px_rgba(159,91,255,0.3)]"
                >
                    <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                    Visit Live Site
                </a>

                <button
                    onClick={() => {
                        import('@/lib/codeExporter').then(({ exportNextJsPortfolio }) => {
                            const toastId = toast.loading("Generating Next.js Boilerplate...");
                            exportNextJsPortfolio(portfolioData).then(() => {
                                toast.success("Code downloaded successfully!", { id: toastId });
                            }).catch(e => {
                                console.error(e);
                                toast.error("Failed to generate code.", { id: toastId });
                            });
                        });
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-surface-variant hover:bg-outline-variant/30 text-on-surface rounded-xl font-semibold transition-all border border-outline-variant/30"
                >
                    <span className="material-symbols-outlined text-[20px]">data_object</span>
                    Download Next.js Code
                </button>

                <div className="flex items-center gap-2 p-3 bg-surface border border-outline-variant/30 rounded-xl mt-2">
                    <span className="material-symbols-outlined text-on-surface-variant text-[18px]">link</span>
                    <input readOnly value={liveUrl} className="flex-1 bg-transparent text-sm text-on-surface outline-none" />
                    <button onClick={copyLink} className="px-3 py-1.5 bg-surface-variant hover:bg-outline-variant/30 text-on-surface rounded-lg text-xs font-medium transition-colors">
                    {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
                </div>
            </>
        )}
      </DialogContent>
    </Dialog>
  );
};
