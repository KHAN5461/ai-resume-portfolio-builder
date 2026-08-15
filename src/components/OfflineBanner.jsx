import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

export default function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const wasOffline = useRef(!navigator.onLine);
  const pendingQueueLength = useSelector(state => state.sync?.pendingQueueLength || 0);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline.current) {
        toast.success("All changes synced!");
        wasOffline.current = false;
      }
    };
    const handleOffline = () => {
      setIsOnline(false);
      wasOffline.current = true;
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 bg-error-container text-on-error-container px-4 py-2 rounded-full shadow-lg"
        >
          <span className="material-symbols-outlined text-[20px]">wifi_off</span>
          <span className="font-label-md">
            You are offline. {pendingQueueLength > 0 ? `${pendingQueueLength} changes queued.` : "Changes will be saved when you reconnect."}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
