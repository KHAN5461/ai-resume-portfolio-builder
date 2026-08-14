import React, { useCallback, useState } from 'react';

export default function ImageDropzone({ value, onChange, label }) {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const processFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onChange(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const onFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      {label && <label className="text-sm font-semibold mb-2 block">{label}</label>}
      
      <div 
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center transition-colors cursor-pointer relative overflow-hidden bg-surface
          ${isDragActive ? 'border-stitch-primary bg-primary-container/20' : 'border-outline-variant/50 hover:border-outline-variant'}
          ${value ? 'h-48' : 'h-32'}`}
      >
        <input 
          type="file" 
          accept="image/*" 
          onChange={onFileChange} 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
        />
        
        {value ? (
          <div className="absolute inset-0 w-full h-full p-2">
            <img src={value} alt="Preview" className="w-full h-full object-contain rounded-lg shadow-sm" />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg m-2">
              <span className="text-white font-label-md flex items-center gap-2">
                <span className="material-symbols-outlined">edit</span>
                Change Image
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center flex flex-col items-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-[32px] opacity-70">cloud_upload</span>
            <p className="font-label-md text-sm">Drag & drop or click to upload</p>
          </div>
        )}
      </div>
      {value && (
        <button 
          onClick={() => onChange(null)}
          className="text-xs text-red-500 font-medium mt-2 hover:underline focus:outline-none"
        >
          Remove Image
        </button>
      )}
    </div>
  );
}
