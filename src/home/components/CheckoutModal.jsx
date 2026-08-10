import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import confetti from 'canvas-confetti';

export const CheckoutModal = ({ isOpen, onOpenChange, plan }) => {
  const [status, setStatus] = useState('idle'); // idle, loading, success

  const handleCheckout = (e) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulate network request
    setTimeout(() => {
      setStatus('success');
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#10b981'],
        zIndex: 10000
      });
      // Auto close after 3 seconds of success
      setTimeout(() => {
        onOpenChange(false);
        setTimeout(() => setStatus('idle'), 300); // reset after fade out
      }, 3000);
    }, 1500);
  };

  const handleClose = (open) => {
    if (status === 'loading') return; // Prevent closing while processing
    if (!open) setStatus('idle'); // Reset on close
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl sm:max-w-md p-0 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-6 border-b border-slate-800 bg-slate-900/50">
          <h2 className="text-xl font-bold text-slate-50 flex items-center justify-between">
            <span>Upgrade to {plan === 'pro' ? 'Pro' : 'Enterprise'}</span>
            <span className="text-indigo-400">${plan === 'pro' ? '9' : '29'}<span className="text-sm text-slate-500 font-normal">/mo</span></span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">Secure payment powered by Stripe.</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-emerald-400 text-5xl">check_circle</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-50 mb-2">Payment Successful!</h3>
              <p className="text-slate-400 text-center">Your account has been upgraded. Welcome to the future of career building.</p>
            </div>
          ) : (
            <form onSubmit={handleCheckout} className="flex flex-col gap-4">
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="you@example.com"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Card Information</label>
                <div className="flex flex-col rounded-lg border border-slate-700 overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
                  <input 
                    type="text" 
                    required
                    placeholder="Card number"
                    className="w-full bg-slate-900 border-b border-slate-700 px-4 py-3 text-slate-100 outline-none" 
                  />
                  <div className="flex">
                    <input 
                      type="text" 
                      required
                      placeholder="MM / YY"
                      className="w-1/2 bg-slate-900 border-r border-slate-700 px-4 py-3 text-slate-100 outline-none" 
                    />
                    <input 
                      type="text" 
                      required
                      placeholder="CVC"
                      className="w-1/2 bg-slate-900 px-4 py-3 text-slate-100 outline-none" 
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={status === 'loading'}
                className="w-full mt-4 py-3 px-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                    Processing secure payment...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">lock</span>
                    Pay ${plan === 'pro' ? '9.00' : '29.00'}
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
