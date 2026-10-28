import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { IconFor } from './icons.jsx';

const ToastContext = createContext(() => {});
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const nextId = useRef(0);
  const toast = useCallback((msg, type = 'default') => {
    const id = ++nextId.current;
    setItems((l) => [...l, { id, msg, type }]);
    setTimeout(() => setItems((l) => l.filter((t) => t.id !== id)), 4500);
  }, []);
  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div id="toast-region" className="toast-wrap" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} className={'toast ' + (t.type === 'success' ? 'success' : t.type === 'error' ? 'error' : '')}>
            <IconFor name={t.type === 'success' ? 'check' : t.type === 'error' ? 'alert' : 'info'} />
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
