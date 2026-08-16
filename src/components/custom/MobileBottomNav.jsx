import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import MagicImportModal from '../../dashboard/components/MagicImportModal';

export default function MobileBottomNav() {
  const location = useLocation();
  const path = location.pathname;

  const getLinkClasses = (matchPath) => {
    const isActive = path === matchPath || (matchPath !== '/' && path.startsWith(matchPath));
    return isActive
      ? "flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-4 py-1 active:scale-90 transition-transform duration-150"
      : "flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-variant/50 rounded-full px-4 py-1 active:scale-90 transition-transform duration-150";
  };

  const getIconStyle = (matchPath) => {
    const isActive = path === matchPath || (matchPath !== '/' && path.startsWith(matchPath));
    return isActive ? { fontVariationSettings: "'FILL' 1" } : {};
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center py-2 px-4 md:hidden bg-surface shadow-[0px_-2px_10px_rgba(0,0,0,0.05)] rounded-t-xl z-50">
      <Link to="/" className={getLinkClasses('/')}>
        <span className="material-symbols-outlined font-label-sm text-[14px]" style={getIconStyle('/')}>home</span>
        <span className="font-label-sm text-[12px] mt-1">Home</span>
      </Link>
      <Link to="/dashboard" className={getLinkClasses('/dashboard')}>
        <span className="material-symbols-outlined font-label-sm text-[14px]" style={getIconStyle('/dashboard')}>description</span>
        <span className="font-label-sm text-[12px] mt-1">Drafts</span>
      </Link>
      <MagicImportModal renderTrigger={(onClick) => (
        <button onClick={onClick} className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-variant/50 rounded-full px-4 py-1 active:scale-90 transition-transform duration-150">
          <span className="material-symbols-outlined font-label-sm text-[14px]">auto_fix_high</span>
          <span className="font-label-sm text-[12px] mt-1">AI Import</span>
        </button>
      )} />
      <Link className={getLinkClasses('/profile')} to="/profile">
        <span className="material-symbols-outlined font-label-sm text-[14px]" style={getIconStyle('/profile')}>person</span>
        <span className="font-label-sm text-[12px] mt-1">Profile</span>
      </Link>
    </nav>
  );
}
