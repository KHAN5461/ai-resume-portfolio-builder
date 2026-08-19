import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SeoSettingsModal({ isOpen, onClose }) {
  const { portfolioId } = useParams();
  const dispatch = useDispatch();
  const portfolioData = useSelector((state) => state.portfolio.present.portfolios[portfolioId]);
  
  const seo = portfolioData?.siteConfig?.seo || {
      metaTitle: "Portfolio",
      metaDescription: "My professional portfolio",
      ogImage: ""
  };

  const handleUpdate = (field, value) => {
    dispatch({
        type: 'portfolio/updatePortfolioData',
        payload: {
            id: portfolioId,
            data: {
                ...portfolioData,
                siteConfig: {
                    ...portfolioData?.siteConfig,
                    seo: {
                        ...seo,
                        [field]: value
                    }
                }
            }
        }
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 text-stitch-primary">
                <Search className="w-5 h-5" />
                <h2 className="text-xl font-bold font-headline-md">SEO Settings</h2>
              </div>
              <button aria-label="Close SEO settings" onClick={onClose} className="p-2 hover:bg-surface-variant rounded-full text-on-surface-variant">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Meta Title</label>
                <input 
                  type="text" 
                  value={seo.metaTitle}
                  onChange={(e) => handleUpdate('metaTitle', e.target.value)}
                  placeholder="e.g. John Doe - Full Stack Developer"
                  className="w-full px-3 py-2 border border-outline-variant rounded-md bg-surface text-on-surface"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Meta Description</label>
                <textarea 
                  rows={3}
                  value={seo.metaDescription}
                  onChange={(e) => handleUpdate('metaDescription', e.target.value)}
                  placeholder="A short summary of who you are and what you do. This appears in search results."
                  className="w-full px-3 py-2 border border-outline-variant rounded-md bg-surface text-on-surface custom-scrollbar"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">OpenGraph (OG) Image URL</label>
                <input 
                  type="text" 
                  value={seo.ogImage}
                  onChange={(e) => handleUpdate('ogImage', e.target.value)}
                  placeholder="https://example.com/my-thumbnail.jpg"
                  className="w-full px-3 py-2 border border-outline-variant rounded-md bg-surface text-on-surface"
                />
                <p className="text-xs text-on-surface-variant mt-1">This image will appear when you share your portfolio link on LinkedIn, Twitter, iMessage, etc.</p>
              </div>
              
              {seo.ogImage && (
                  <div className="mt-4 border border-outline-variant/50 rounded-lg overflow-hidden">
                      <img src={seo.ogImage} alt="OG Preview" className="w-full h-32 object-cover bg-surface-container" />
                  </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button onClick={onClose} className="px-4 py-2 bg-stitch-primary text-white rounded-md font-medium">Done</button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
