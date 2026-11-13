import React, { createContext, useContext, useLayoutEffect, useState } from 'react';
import { useColorMode } from '@chakra-ui/react';

const KEY = 'cristal-app-settings';

export const COLORS = [
    ['Améthyste', '#6d28d9'],
    ['Framboise', '#e11d48'],
    ['Émeraude', '#059669'],
    ['Océan', '#0369a1'],
    ['Ambre', '#f59e0b'],
    ['Encre', '#111827'],
];

const systemTheme = () => (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

const defaults = { theme: systemTheme(), color: COLORS[0][1], lowStock: 5, compact: false, notifications: true, sounds: false, displayName: 'Lucas', status: 'online', emails: ['achats@cristal.shop'] };

const load = () => {
    try {
        return { ...defaults, ...JSON.parse(localStorage.getItem(KEY) ?? '{}') };
    } catch {
        return defaults;
    }
};

/** Chakra (anciens composants) écrit aussi data-theme sur <html> : il suit le thème des réglages au lieu du sien. */
export const colorModeManager = { type: 'localStorage', ssr: false, get: () => load().theme, set: () => {} };

const SettingsContext = createContext(null);

/** Réglages de l'application, gardés dans le navigateur ; la couleur repeint tous les composants Cristal. */
export function SettingsProvider({ children }) {
    const [settings, setSettings] = useState(load);
    const { setColorMode } = useColorMode();

    // Avant l'affichage : pas d'éclair clair au chargement en thème sombre.
    useLayoutEffect(() => {
        document.documentElement.style.setProperty('--cr-color-primary', settings.color);
        setColorMode(settings.theme);
        try {
            localStorage.setItem(KEY, JSON.stringify(settings));
        } catch {
            // Stockage indisponible (navigation privée) : les réglages valent pour la session.
        }
    }, [settings, setColorMode]);

    const update = (patch) => setSettings((current) => ({ ...current, ...patch }));
    const reset = () => setSettings(defaults);
    return <SettingsContext.Provider value={{ settings, update, reset }}>{children}</SettingsContext.Provider>;
}

export const useSettings = () => useContext(SettingsContext);
