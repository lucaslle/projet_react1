import React, { useState } from 'react';
import { CrBadge, CrButton, CrDialog, CrInput, CrMenu, CrOtp, CrSwitch } from '@cristal/react';
import { useToast } from '../../layout/toasts';

const SESSIONS = [['Chrome sur Windows', 'Lyon', 'Session actuelle'], ['Safari sur iPhone', 'Paris', 'Il y a 2 h'], ['Firefox sur Linux', 'Lille', 'Il y a 3 jours']];

/** Mot de passe avec jauge, double authentification vérifiée par code, sessions ouvertes. */
export function Security() {
    const toast = useToast();
    const [twoFactor, setTwoFactor] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [sessions, setSessions] = useState(SESSIONS);

    const confirm = (code) => {
        setVerifying(false);
        setTwoFactor(true);
        toast({ title: 'Double authentification activée', description: `Code ${code.slice(0, 2)}•••• vérifié.`, status: 'success' });
    };

    return (
        <section className="panel" aria-labelledby="security">
            <h2 id="security">Sécurité</h2>
            <CrInput label="Nouveau mot de passe" type="password" autocomplete="new-password" strength />
            <CrSwitch
                label="Double authentification par SMS"
                checked={twoFactor}
                onCrChange={(event) => (event.detail ? setVerifying(true) : (setTwoFactor(false), toast({ title: 'Double authentification désactivée', status: 'warning' })))}
            />
            <h3 className="sub">Sessions ouvertes</h3>
            <ul className="sessions">
                {sessions.map(([device, city, when]) => (
                    <li key={device}>
                        <span>
                            <strong>{device}</strong>
                            <span className="muted">
                                {' '}
                                {city} · {when}
                            </span>
                        </span>
                        {when === 'Session actuelle' ? (
                            <CrBadge variant="success">Cet appareil</CrBadge>
                        ) : (
                            <CrMenu label="Actions" accessibleLabel={`Actions pour ${device}`} animation="anchor-pop" onCrSelect={() => (setSessions((list) => list.filter(([name]) => name !== device)), toast({ title: `${device} déconnecté.`, status: 'info' }))}>
                                <option value="logout">Déconnecter</option>
                            </CrMenu>
                        )}
                    </li>
                ))}
            </ul>
            <CrDialog label="Vérifier votre téléphone" open={verifying} onCrClose={() => setVerifying(false)}>
                <p>Saisissez le code à 6 chiffres envoyé au 06 •• •• •• 42 (démonstration : n’importe quels chiffres).</p>
                <CrOtp label="Code reçu par SMS" onCrComplete={(event) => confirm(event.detail)} />
                <CrButton slot="footer" variant="secondary" onClick={() => setVerifying(false)}>
                    Annuler
                </CrButton>
            </CrDialog>
        </section>
    );
}
