import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setResumeData } from '@/store/resumeSlice';
import { Code, CheckCircle2, AlertCircle } from 'lucide-react';

export default function RawJsonEditor() {
  const resumeInfo = useSelector(state => state.resume.resumeData);
  const dispatch = useDispatch();
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState(null);
  const [syncStatus, setSyncStatus] = useState('synced'); // 'synced', 'typing', 'error'

  useEffect(() => {
    // When external state changes (like forms updating) and we are synced
    // update the local editor text to stay in sync.
    if (syncStatus === 'synced') {
      const currentJson = JSON.stringify(resumeInfo, null, 2);
      if (jsonText !== currentJson) {
         setJsonText(currentJson);
      }
    }
  }, [resumeInfo, syncStatus, jsonText]);

  useEffect(() => {
    if (syncStatus === 'typing') {
      const timer = setTimeout(() => {
        try {
          const parsed = JSON.parse(jsonText);
          
          // Only dispatch if it's actually different to avoid redundant renders
          if (JSON.stringify(parsed) !== JSON.stringify(resumeInfo)) {
              dispatch(setResumeData(parsed));
          }
          setError(null);
          setSyncStatus('synced');
        } catch (e) {
          setError(e.message);
          setSyncStatus('error');
        }
      }, 1000); // Auto-apply after 1 second of inactivity

      return () => clearTimeout(timer);
    }
  }, [jsonText, syncStatus, dispatch, resumeInfo]);

  const handleChange = (e) => {
    setJsonText(e.target.value);
    setSyncStatus('typing');
    setError(null);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold flex items-center gap-2 text-stitch-primary">
          <Code size={18} />
          Data Editor (Live Sync)
        </h3>
        
        <div className="flex items-center gap-2">
            {syncStatus === 'synced' && (
                <span className="flex items-center gap-1.5 text-[12px] font-bold text-green-500 bg-green-500/10 px-3 py-1.5 rounded-full transition-all">
                    <CheckCircle2 size={14} /> Synced
                </span>
            )}
            {syncStatus === 'typing' && (
                <span className="flex items-center gap-1.5 text-[12px] font-bold text-yellow-500 bg-yellow-500/10 px-3 py-1.5 rounded-full transition-all">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-ping" /> Editing
                </span>
            )}
            {syncStatus === 'error' && (
                <span className="flex items-center gap-1.5 text-[12px] font-bold text-red-500 bg-red-500/10 px-3 py-1.5 rounded-full transition-all">
                    <AlertCircle size={14} /> Invalid JSON
                </span>
            )}
        </div>
      </div>

      <p className="text-sm text-on-surface-variant">
        Edit the raw data directly. Changes are automatically synced to your forms and resume after 1 second.
      </p>

      <div className={`flex-1 relative border-2 rounded-xl overflow-hidden shadow-inner transition-colors duration-300 ${syncStatus === 'error' ? 'border-red-500/50 bg-red-950/20' : 'border-slate-700 bg-slate-900'}`}>
        <textarea
          value={jsonText}
          onChange={handleChange}
          className="w-full h-full p-4 font-mono text-sm bg-transparent text-green-400 outline-none resize-none custom-scrollbar"
          spellCheck="false"
        />
      </div>
      
      {error && (
        <div className="p-3 bg-red-500/10 text-red-500 rounded-lg text-sm font-mono break-words border border-red-500/20">
          Error: {error}
        </div>
      )}
    </div>
  );
}
