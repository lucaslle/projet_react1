import React, { useState } from 'react';
import { CrDrawer } from '@cristal/react';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import { CommandMenu } from './commandMenu';
import { useSettings } from './settings';
import './shell.css';

/** Cadre de l'application : menu à gauche (dans un drawer sur petit écran), barre du haut, contenu. */
export function AppShell({ children }) {
    const [menu, setMenu] = useState(false);
    const [palette, setPalette] = useState(false);
    const { settings } = useSettings();

    return (
        <div className={`shell${settings.compact ? ' compact' : ''}`}>
            <aside className="side">
                <Sidebar />
            </aside>
            <CrDrawer label="Menu" placement="start" open={menu} onCrClose={() => setMenu(false)} className="side-drawer">
                <Sidebar onNavigate={() => setMenu(false)} />
            </CrDrawer>
            <div className="main">
                <Topbar onMenu={() => setMenu(true)} onPalette={() => setPalette(true)} />
                <main className="content">{children}</main>
            </div>
            <CommandMenu open={palette} onClose={() => setPalette(false)} />
        </div>
    );
}
