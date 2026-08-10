import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center bg-background text-on-background px-4"
    >
      <div className="bg-surface-container-low p-8 rounded-2xl shadow-sm text-center max-w-md w-full border border-outline-variant/30">
        <div className="w-24 h-24 bg-primary-container/30 text-stitch-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-[48px]">search_off</span>
        </div>
        <h1 className="font-headline-xl text-4xl font-bold mb-2">404</h1>
        <h2 className="font-headline-md text-xl font-medium mb-4">Page Not Found</h2>
        <p className="font-body-md text-on-surface-variant mb-8">
          The page you are looking for doesn't exist, has been moved, or is set to private.
        </p>
        <Link 
          to="/"
          className="inline-flex w-full justify-center items-center py-3 bg-stitch-primary text-on-primary rounded-xl font-label-md hover:bg-stitch-primary/90 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </motion.div>
  );
}
