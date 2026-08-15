import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ActionCreators } from 'redux-undo';

export default function useUndoRedoKeyboard() {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check for Ctrl (Windows/Linux) or Cmd (Mac)
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const isModifier = isMac ? e.metaKey : e.ctrlKey;

      if (isModifier) {
        if (e.key.toLowerCase() === 'z') {
          if (e.shiftKey) {
            // Ctrl+Shift+Z or Cmd+Shift+Z (Redo)
            e.preventDefault();
            dispatch(ActionCreators.redo());
          } else {
            // Ctrl+Z or Cmd+Z (Undo)
            e.preventDefault();
            dispatch(ActionCreators.undo());
          }
        } else if (e.key.toLowerCase() === 'y') {
          // Ctrl+Y or Cmd+Y (Redo)
          e.preventDefault();
          dispatch(ActionCreators.redo());
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [dispatch]);
}
