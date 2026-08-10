export const handleFormKeyDown = (e) => {
  if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'BUTTON') {
    e.preventDefault();
    
    const container = e.target.form || e.target.closest('.form-container') || document.body;
    
    const focusableElements = Array.from(
      container.querySelectorAll('input:not([type="hidden"]):not(:disabled), textarea:not(:disabled), select:not(:disabled), button:not(:disabled)')
    );
    
    const index = focusableElements.indexOf(e.target);
    
    if (index > -1 && index + 1 < focusableElements.length) {
      focusableElements[index + 1].focus();
    }
  }
};
