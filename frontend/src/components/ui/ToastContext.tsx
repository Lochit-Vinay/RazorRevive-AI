import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextProps {
  toast: (type: ToastType, title: string, message?: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastType, title: string, message?: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const contextValue = {
    toast: addToast,
    success: (title: string, message?: string) => addToast('success', title, message),
    error: (title: string, message?: string) => addToast('error', title, message),
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-3 pointer-events-none">
        {toasts.map(t => (
          <div 
            key={t.id} 
            className="pointer-events-auto animate-in slide-in-from-bottom-5 fade-in duration-300 w-80 max-w-[90vw] bg-white dark:bg-gray-800 rounded-xl p-4 flex items-start shadow-2xl border border-gray-100 dark:border-gray-700"
          >
            <div className="flex-shrink-0 mr-3">
              {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400" />}
              {t.type === 'error' && <XCircle className="w-5 h-5 text-red-500 dark:text-red-400" />}
              {t.type === 'warning' && <AlertCircle className="w-5 h-5 text-orange-500 dark:text-orange-400" />}
              {t.type === 'info' && <Info className="w-5 h-5 text-blue-500 dark:text-blue-400" />}
            </div>
            <div className="flex-1 mr-2">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{t.title}</h4>
              {t.message && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t.message}</p>}
            </div>
            <button onClick={() => removeToast(t.id)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
