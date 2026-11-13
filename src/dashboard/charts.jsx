import React from "react";

export const euros = (value, compact) =>
    value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0, notation: compact ? 'compact' : 'standard' });

/** Chiffre clé, avec l'écart à la période précédente en texte et flèche (pas seulement en couleur). */
export function Kpi({ value, current, previous }) {
    const change = previous ? Math.round(((current - previous) / previous) * 100) : 0;
    const up = change >= 0;
    return (
        <div className="kpi">
            <p className="kpi-value">{value}</p>
            <p className={`kpi-change ${up ? 'up' : 'down'}`}>
                <span aria-hidden="true">{up ? '▲' : '▼'}</span> {up ? '+' : ''}{change} % <span className="muted">vs période précédente</span>
            </p>
        </div>
    );
}

const STATUS_TONE = { Payée: 'good', Expédiée: 'info', 'En attente': 'warning', Remboursée: 'critical' };

/** Dernières commandes, la plus récente en haut. */
export function Feed({ orders }) {
    return (
        <ol className="feed">
            {orders.map((order) => (
                <li key={order.id}>
                    <span className={`dot ${STATUS_TONE[order.status]}`} aria-hidden="true" />
                    <span className="feed-main">
                        <strong>{order.client}</strong> · {order.product}
                        <span className="muted"> {order.city}, {order.date.toLocaleDateString('fr-FR')} · {order.status}</span>
                    </span>
                    <span className="feed-amount">{euros(order.amount)}</span>
                </li>
            ))}
        </ol>
    );
}
