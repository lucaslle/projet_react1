import React, { useState } from 'react';
import { CrBadge, CrButton, CrCard, CrCardInput, CrSegmented } from '@cristal/react';
import { useToast } from '../../layout/toasts';

const PLANS = [
    ['Essentiel', 19, ['1 boutique', '500 produits', 'Alertes par e-mail']],
    ['Pro', 49, ['3 boutiques', 'Produits illimités', 'Palette de commandes', 'Export CSV']],
    ['Entreprise', 129, ['Boutiques illimitées', 'API dédiée', 'Support prioritaire']],
];

/** Formule (mensuelle ou annuelle, -20 %), carte de paiement saisie sur la carte dessinée. */
export function Billing() {
    const toast = useToast();
    const [period, setPeriod] = useState('mois');
    const [plan, setPlan] = useState('Pro');
    const price = (monthly) => (period === 'an' ? Math.round(monthly * 12 * 0.8) : monthly);

    return (
        <section className="panel billing" aria-labelledby="billing">
            <div className="billing-head">
                <h2 id="billing">Abonnement</h2>
                <CrSegmented label="Facturation" value={period} onCrChange={(event) => setPeriod(event.detail)}>
                    <option value="mois">Mensuelle</option>
                    <option value="an">Annuelle −20 %</option>
                </CrSegmented>
            </div>
            <div className="plans">
                {PLANS.map(([name, monthly, features]) => (
                    <CrCard key={name} className={`plan${plan === name ? ' current' : ''}`}>
                        <h3 slot="header">
                            {name} {plan === name && <CrBadge variant="primary">Formule actuelle</CrBadge>}
                        </h3>
                        <p className="plan-price">
                            {price(monthly)} € <span>/ {period}</span>
                        </p>
                        <ul>
                            {features.map((feature) => (
                                <li key={feature}>{feature}</li>
                            ))}
                        </ul>
                        <CrButton slot="footer" variant={plan === name ? 'secondary' : 'primary'} disabled={plan === name} onClick={() => (setPlan(name), toast({ title: `Formule ${name} activée`, status: 'success' }))}>
                            {plan === name ? 'Choisie' : `Passer à ${name}`}
                        </CrButton>
                    </CrCard>
                ))}
            </div>
            <CrCardInput label="Carte de paiement" variant="card" holder hint="Carte de test : 4242 4242 4242 4242" />
        </section>
    );
}
