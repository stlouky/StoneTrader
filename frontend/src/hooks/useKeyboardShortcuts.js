import { useEffect } from 'react';

export function useKeyboardShortcuts(shortcuts) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const keys = [];
      if (event.ctrlKey) keys.push('Ctrl');
      if (event.altKey) keys.push('Alt');
      if (event.shiftKey) keys.push('Shift');
      if (event.key.length === 1) {
        keys.push(event.key.toUpperCase());
      } else {
        keys.push(event.key);
      }
      
      const combination = keys.join('+');
      
      if (shortcuts[combination]) {
        event.preventDefault();
        shortcuts[combination]();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}
