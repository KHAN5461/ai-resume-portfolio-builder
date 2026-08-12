import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setResumeData } from '@/store/resumeSlice';
import { toast } from 'sonner';
import { Save, Code } from 'lucide-react';

export default function RawJsonEditor() {
  const resumeInfo = useSelector(state => state.resume.resumeData);
  const dispatch = useDispatch();
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only update local state if it's currently valid (to avoid cursor jumping while typing)
    if (!error) {
      setJsonText(JSON.stringify(resumeInfo, null, 2));
    }
  }, [resumeInfo]);

  const handleApply = () => {
    try {
      const parsed = JSON.parse(jsonText);
      dispatch(setResumeData(parsed));
      setError(null);
      toast.success("JSON applied successfully");
    } catch (e) {
      setError(e.message);
      toast.error("Invalid JSON format");
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold flex items-center gap-2 text-stitch-primary">
          <Code size={18} />
          Raw JSON (Dev Mode)
        </h3>
        <button
          onClick={handleApply}
          className="flex items-center gap-2 bg-stitch-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-stitch-primary/90 transition-colors"
        >
          <Save size={16} />
          Apply JSON
        </button>
      </div>

      <p className="text-sm text-on-surface-variant">
        Paste a complete JSON payload to instantly update the entire resume state.
      </p>

      <div className="flex-1 relative border rounded-xl overflow-hidden shadow-inner bg-slate-900 border-slate-700">
        <textarea
          value={jsonText}
          onChange={(e) => {
            setJsonText(e.target.value);
            setError(null);
          }}
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
