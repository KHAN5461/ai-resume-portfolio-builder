import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import MagicImportModal from '../../dashboard/components/MagicImportModal';
import { Plus, Save, Download } from 'lucide-react';

export default function MobileBottomNav() {
  const location = useLocation();
  const path = location.pathname;

  const getLinkClasses = (matchPath) => {
    const isActive = path === matchPath || (matchPath !== '/' && path.startsWith(matchPath));
    return isActive
      ? "flex flex-col items-center justify-center text-primary active:scale-90 transition-transform duration-150"
      : "flex flex-col items-center justify-center text-on-surface-variant hover:text-primary active:scale-90 transition-transform duration-150";
  };

  const getIconStyle = (matchPath) => {
    const isActive = path === matchPath || (matchPath !== '/' && path.startsWith(matchPath));
    return isActive ? { fontVariationSettings: "'FILL' 1" } : {};
  };

  // Determine FAB context
  let fabIcon = <Plus className="w-6 h-6" />;
  let fabLabel = "New";
  let fabAction = null; // Default behavior will open import modal if no custom action

  if (path.includes('/portfolio/')) {
    fabIcon = <Save className="w-5 h-5" />;
    fabLabel = "Save";
    fabAction = () => { /* Logic to trigger save goes here or via Redux/events */ };
  } else if (path.includes('/resume/')) {
    fabIcon = <Download className="w-5 h-5" />;
    fabLabel = "Export";
    fabAction = () => { /* Logic to trigger export */ };
  }

  return (
    <nav className="fixed bottom-4 left-4 right-4 md:hidden bg-surface/80 backdrop-blur-md shadow-lg border border-surface-variant rounded-full z-50 flex justify-between items-center px-6 py-3">
      <Link to="/" className={getLinkClasses('/')}>
        <span className="material-symbols-outlined text-[20px]" style={getIconStyle('/')}>home</span>
      </Link>
      
      <Link to="/dashboard" className={getLinkClasses('/dashboard')}>
        <span className="material-symbols-outlined text-[20px]" style={getIconStyle('/dashboard')}>description</span>
      </Link>

      <div className="relative -top-6">
        {fabAction ? (
          <button onClick={fabAction} className="flex items-center justify-center w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg active:scale-95 transition-transform">
            {fabIcon}
          </button>
        ) : (
          <MagicImportModal renderTrigger={(onClick) => (
            <button onClick={onClick} className="flex items-center justify-center w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg active:scale-95 transition-transform">
              {fabIcon}
            </button>
          )} />
        )}
      </div>

      <Link className={getLinkClasses('/profile')} to="/profile">
        <span className="material-symbols-outlined text-[20px]" style={getIconStyle('/profile')}>person</span>
      </Link>
    </nav>
  );
}
