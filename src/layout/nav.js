import { Boxes, ChartNoAxesCombined, House, ReceiptText, Settings } from 'lucide-react';

/** Pages de l'application, dans l'ordre du menu. */
export const PAGES = [
    { path: '/', label: 'Accueil', icon: House, group: 'Pilotage' },
    { path: '/ventes', label: 'Ventes', icon: ChartNoAxesCombined, group: 'Pilotage' },
    { path: '/stock', label: 'Stock', icon: Boxes, group: 'Catalogue' },
    { path: '/commandes', label: 'Commandes', icon: ReceiptText, group: 'Catalogue' },
    { path: '/parametres', label: 'Paramètres', icon: Settings, group: 'Compte' },
];

export const pageOf = (pathname) => PAGES.find((page) => page.path !== '/' && pathname.startsWith(page.path)) ?? PAGES[0];
