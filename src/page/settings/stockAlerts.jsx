import React from 'react';
import { CrSlider, CrSwitch, CrTagInput } from '@cristal/react';
import { useProducts } from '../../layout/products';
import { useSettings } from '../../layout/settings';

/** Seuil d'alerte (le compteur du menu suit en direct) et destinataires des alertes. */
export function StockAlerts() {
    const { settings, update } = useSettings();
    const { products } = useProducts();
    const low = products.filter((product) => product.quantity < settings.lowStock).length;

    return (
        <section className="panel" aria-labelledby="alerts">
            <h2 id="alerts">Alertes de stock</h2>
            <CrSlider label="Seuil de stock faible (unités)" min={1} max={20} value={settings.lowStock} onCrInput={(event) => update({ lowStock: event.detail })} />
            <p className="muted" aria-live="polite">
                {low} produit{low > 1 ? 's' : ''} sous ce seuil aujourd’hui.
            </p>
            <CrSwitch label="Recevoir les alertes par e-mail" checked={settings.notifications} onCrChange={(event) => update({ notifications: event.detail })} />
            <CrTagInput label="Destinataires des alertes" hint="Adresses e-mail, validées avec Entrée" values={settings.emails} disabled={!settings.notifications} onCrChange={(event) => update({ emails: event.detail })} />
        </section>
    );
}
