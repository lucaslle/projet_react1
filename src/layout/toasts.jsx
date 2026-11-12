import React, { createContext, useCallback, useContext, useState } from 'react';
import { CrAlert, CrToaster } from '@cristal/react';

const ToastContext = createContext(() => {});

const VARIANTS = { success: 'success', error: 'danger', warning: 'warning', info: 'info' };

/** Notifications Cristal en bas à droite ; même signature que le toast de Chakra ({ title, description, status }). */
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const notify = useCallback(({ title, description, status = 'info', duration }) => {
        setToasts((list) => [...list, { id: `${Date.now()}-${Math.random()}`, title, description, variant: VARIANTS[status] ?? 'info', duration: duration ?? (status === 'error' ? 0 : 5000) }]);
    }, []);
    const remove = (id) => setToasts((list) => list.filter((toast) => toast.id !== id));

    return (
        <ToastContext.Provider value={notify}>
            {children}
            <CrToaster>
                {toasts.map((toast) => (
                    <CrAlert key={toast.id} heading={toast.description ? toast.title : undefined} variant={toast.variant} duration={toast.duration} onCrClose={() => remove(toast.id)}>
                        {toast.description ?? toast.title}
                    </CrAlert>
                ))}
            </CrToaster>
        </ToastContext.Provider>
    );
}

export const useToast = () => useContext(ToastContext);
