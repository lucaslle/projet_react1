import React, { useState } from 'react';
import { CrBackground, CrSegmented, CrSwitch, CrThemeToggle } from '@cristal/react';
import { COLORS, useSettings } from '../../layout/settings';

const BACKGROUNDS = [['aurora', 'Aurore'], ['gradient', 'Dégradé'], ['dots', 'Points'], ['grid', 'Grille']];

/** Couleur de l'interface (appliquée en direct à toute l'application), densité et aperçu des fonds animés. */
export function Appearance() {
    const { settings, update } = useSettings();
    const [background, setBackground] = useState('aurora');

    return (
        <section className="panel" aria-labelledby="appearance">
            <h2 id="appearance">Apparence</h2>
            <fieldset className="swatches">
                <legend>Couleur de l’interface</legend>
                {COLORS.map(([name, value]) => (
                    <label key={value} className="swatch">
                        <input type="radio" name="color" value={value} checked={settings.color === value} onChange={() => update({ color: value })} />
                        <span className="dot" style={{ background: value }} aria-hidden="true" />
                        {name}
                    </label>
                ))}
            </fieldset>
            <CrThemeToggle variant="label" theme={settings.theme} onCrChange={(event) => update({ theme: event.detail })} />
            <CrSwitch label="Lignes compactes dans les tableaux" checked={settings.compact} onCrChange={(event) => update({ compact: event.detail })} />
            <CrSegmented label="Fond animé de l’accueil" value={background} onCrChange={(event) => setBackground(event.detail)} variant="outline" fit>
                {BACKGROUNDS.map(([value, name]) => (
                    <option key={value} value={value}>
                        {name}
                    </option>
                ))}
            </CrSegmented>
            <CrBackground variant={background} className="bg-preview">
                <p>Aperçu du fond « {BACKGROUNDS.find(([value]) => value === background)[1]} » dans votre couleur.</p>
            </CrBackground>
        </section>
    );
}
