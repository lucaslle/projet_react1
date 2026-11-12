import React, { useState } from 'react';
import { CrButton, CrDialog, CrSegmented, CrTabPanel } from '@cristal/react';
import { useSettings } from '../../layout/settings';
import { useToast } from '../../layout/toasts';
import { Appearance } from './appearance';
import { StockAlerts } from './stockAlerts';
import { Profile } from './profile';
import { Security } from './security';
import { Billing } from './billing';
import './settings.css';

/** Paramètres en trois onglets ; chaque réglage s'applique tout de suite et reste après rechargement. */
function SettingsPage() {
    const { reset } = useSettings();
    const toast = useToast();
    const [tab, setTab] = useState('general');
    const [confirming, setConfirming] = useState(false);

    return (
        <>
            <div className="page-head">
                <div>
                    <h1>Paramètres</h1>
                    <p>Les changements s’appliquent immédiatement à toute l’application.</p>
                </div>
                <CrButton variant="outline" onClick={() => setConfirming(true)}>
                    Réinitialiser
                </CrButton>
            </div>
            <CrSegmented label="Rubriques" variant="underline" value={tab} onCrChange={(event) => setTab(event.detail)}>
                <CrTabPanel label="Général" value="general">
                    <div className="settings-grid">
                        <Appearance />
                        <StockAlerts />
                        <Profile />
                    </div>
                </CrTabPanel>
                <CrTabPanel label="Sécurité" value="securite">
                    <div className="settings-grid">
                        <Security />
                    </div>
                </CrTabPanel>
                <CrTabPanel label="Abonnement" value="abonnement">
                    <Billing />
                </CrTabPanel>
            </CrSegmented>
            <CrDialog label="Réinitialiser les paramètres ?" open={confirming} onCrClose={() => setConfirming(false)}>
                <p>Couleur, seuil d’alerte, profil et densité reviennent à leurs valeurs d’origine.</p>
                <CrButton slot="footer" variant="secondary" onClick={() => setConfirming(false)}>
                    Annuler
                </CrButton>
                <CrButton slot="footer" onClick={() => (reset(), setConfirming(false), toast({ title: 'Paramètres réinitialisés', status: 'info' }))}>
                    Réinitialiser
                </CrButton>
            </CrDialog>
        </>
    );
}

export default SettingsPage;
