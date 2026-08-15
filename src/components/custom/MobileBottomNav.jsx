import React from 'react';
import { Link } from 'react-router-dom';
import MagicImportModal from '../../dashboard/components/MagicImportModal';

export default function MobileBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center py-2 px-4 md:hidden bg-surface shadow-[0px_-2px_10px_rgba(0,0,0,0.05)] rounded-t-xl z-50">
      <Link to="/" className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-variant/50 rounded-full px-4 py-1 active:scale-90 transition-transform duration-150">
        <span className="material-symbols-outlined font-label-sm text-[14px]">home</span>
        <span className="font-label-sm text-[12px] mt-1">Home</span>
      </Link>
      <Link to="/dashboard" className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-4 py-1 active:scale-90 transition-transform duration-150">
        <span className="material-symbols-outlined font-label-sm text-[14px]" style={{fontVariationSettings: "'FILL' 1"}}>description</span>
        <span className="font-label-sm text-[12px] mt-1">Drafts</span>
      </Link>
      <MagicImportModal renderTrigger={(onClick) => (
        <button onClick={onClick} className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-variant/50 rounded-full px-4 py-1 active:scale-90 transition-transform duration-150">
          <span className="material-symbols-outlined font-label-sm text-[14px]">auto_fix_high</span>
          <span className="font-label-sm text-[12px] mt-1">AI Import</span>
        </button>
      )} />
      <Link className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-variant/50 rounded-full px-4 py-1 active:scale-90 transition-transform duration-150" to="/profile">
        <span className="material-symbols-outlined font-label-sm text-[14px]">person</span>
        <span className="font-label-sm text-[12px] mt-1">Profile</span>
      </Link>
    </nav>
  );
}
