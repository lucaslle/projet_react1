import React, { useEffect, useState } from 'react';
import { CrAvatar, CrBadge, CrButton, CrCheckbox, CrDrawer, CrInput, CrProgressSteps, CrRadioGroup } from '@cristal/react';
import { useToast } from '../layout/toasts';
import { euros } from '../dashboard/charts';

const CHECKS = ['Articles vérifiés', 'Colis emballé', 'Étiquette imprimée'];

/** Traitement d'une commande en attente : préparation cochée étape par étape, transporteur, expédition. */
export function OrderDrawer({ order, onClose, onShip }) {
    const toast = useToast();
    const [done, setDone] = useState([]);
    const [carrier, setCarrier] = useState('colissimo');
    const [tracking, setTracking] = useState('');

    useEffect(() => {
        setDone([]);
        setTracking('');
    }, [order]);

    const ready = done.length === CHECKS.length;
    const toggle = (check, on) => setDone((list) => (on ? [...new Set([...list, check])] : list.filter((item) => item !== check)));
    const ship = () => {
        toast({ title: `${order.id} expédiée`, description: `${order.client} recevra un e-mail de suivi${tracking ? ` (${tracking})` : ''}.`, status: 'success' });
        onShip(order);
    };

    return (
        <CrDrawer label={order ? `Commande ${order.id}` : 'Commande'} open={!!order} onCrClose={onClose}>
            {order && (
                <div className="order-detail">
                    <div className="order-client">
                        <CrAvatar name={order.client} size="l" />
                        <div>
                            <strong>{order.client}</strong>
                            <span className="muted">
                                {order.city} · {order.channel}
                            </span>
                        </div>
                        <CrBadge variant="warning">En attente</CrBadge>
                    </div>
                    <p className="order-line">
                        {order.quantity} × {order.product} <strong>{euros(order.amount)}</strong>
                    </p>
                    <CrProgressSteps label="Avancement de la commande" steps={['Reçue', 'Préparation', 'Expédition', 'Livraison']} current={ready ? 2 : 1} />
                    <fieldset className="checks">
                        <legend>Préparation</legend>
                        {CHECKS.map((check) => (
                            <CrCheckbox key={check} label={check} checked={done.includes(check)} onCrChange={(event) => toggle(check, event.detail)} />
                        ))}
                    </fieldset>
                    <CrRadioGroup label="Transporteur" value={carrier} onCrChange={(event) => setCarrier(event.detail)}>
                        <option value="colissimo">Colissimo, 48 h</option>
                        <option value="chronopost">Chronopost, 24 h</option>
                        <option value="relais">Point relais, 3 à 5 jours</option>
                    </CrRadioGroup>
                    <CrInput label="Numéro de suivi" hint="Facultatif, envoyé au client" value={tracking} onCrInput={(event) => setTracking(event.detail)} />
                </div>
            )}
            <CrButton slot="footer" variant="secondary" onClick={onClose}>
                Plus tard
            </CrButton>
            <CrButton slot="footer" disabled={!ready} onClick={ship}>
                {ready ? 'Marquer expédiée' : `Préparation ${done.length}/${CHECKS.length}`}
            </CrButton>
        </CrDrawer>
    );
}
