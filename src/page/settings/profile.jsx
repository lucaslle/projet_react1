import React, { useState } from 'react';
import { CrAvatar, CrDatePicker, CrFileUpload, CrInput, CrSelect, CrTextarea } from '@cristal/react';
import { useSettings } from '../../layout/settings';

/** Profil : nom affiché partout, photo (aperçu immédiat), fuseau, date de clôture, signature des e-mails. */
export function Profile() {
    const { settings, update } = useSettings();
    const [photo, setPhoto] = useState(null);

    return (
        <section className="panel" aria-labelledby="profile">
            <h2 id="profile">Profil</h2>
            <div className="profile-row">
                <CrAvatar name={`${settings.displayName} Laliche`} src={photo ?? undefined} size="l" status={settings.status} />
                <CrInput label="Nom affiché" value={settings.displayName} required onCrInput={(event) => event.detail.trim() && update({ displayName: event.detail.trim() })} />
            </div>
            <CrFileUpload label="Photo de profil" hint="JPG ou PNG, aperçu immédiat." accept="image/*" onCrChange={(event) => setPhoto(event.detail[0] ? URL.createObjectURL(event.detail[0]) : null)} />
            <div className="two">
                <CrSelect label="Fuseau horaire" value="paris">
                    <option value="paris">Europe/Paris</option>
                    <option value="montreal">America/Montreal</option>
                    <option value="dakar">Africa/Dakar</option>
                </CrSelect>
                <CrDatePicker label="Clôture de l’exercice" value={`${new Date().getFullYear()}-12-31`} />
            </div>
            <CrTextarea label="Signature des e-mails" value={`L’équipe Cristal Commerce\n${settings.displayName}`} rows={2} />
        </section>
    );
}
