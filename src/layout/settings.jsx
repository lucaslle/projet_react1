import React, { createContext, useContext, useEffect, useState } from 'react';

const KEY = 'cristal-app-settings';

export const COLORS = [
    ['Améthyste', '#6d28d9'],
    ['Framboise', '#e11d48'],
    ['Émeraude', '#059669'],
    ['Océan', '#0369a1'],
    ['Ambre', '#f59e0b'],
    ['Encre', '#111827'],
];

const defaults = { color: COLORS[0][1], lowStock: 5, compact: false, notifications: true, sounds: false, displayName: 'Lucas', status: 'online', emails: ['achats@cristal.shop'] };

const load = () => {
    try {
        return { ...defaults, ...JSON.parse(localStorage.getItem(KEY) ?? '{}') };
    } catch {
        return defaults;
    }
};

const SettingsContext = createContext(null);

/** Réglages de l'application, gardés dans le navigateur ; la couleur repeint tous les composants Cristal. */
export function SettingsProvider({ children }) {
    const [settings, setSettings] = useState(load);

    useEffect(() => {
        document.documentElement.style.setProperty('--cr-color-primary', settings.color);
        try {
            localStorage.setItem(KEY, JSON.stringify(settings));
        } catch {
            // Stockage indisponible (navigation privée) : les réglages valent pour la session.
        }
    }, [settings]);

    const update = (patch) => setSettings((current) => ({ ...current, ...patch }));
    const reset = () => setSettings(defaults);
    return <SettingsContext.Provider value={{ settings, update, reset }}>{children}</SettingsContext.Provider>;
}

export const useSettings = () => useContext(SettingsContext);
