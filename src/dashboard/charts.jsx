import React, { useState } from "react";

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

/** Colonnes (une seule série) avec infobulle au survol et au focus. */
export function Columns({ items, label, format = euros }) {
    const [active, setActive] = useState(null);
    const max = Math.max(1, ...items.map((item) => item.value));
    const best = items.reduce((top, item, index) => (item.value > items[top].value ? index : top), 0);
    const step = Math.max(1, Math.ceil(items.length / 12));
    return (
        <figure className="chart" aria-label={`${label} : maximum ${format(items[best].value)} (${items[best].label})`} role="img">
            <div className="columns" onPointerLeave={() => setActive(null)}>
                {items.map((item, index) => (
                    <div key={item.label + index} className="column" onPointerEnter={() => setActive(index)} data-active={active === index ? '' : undefined}>
                        {active === index && (
                            <span className="tip" aria-hidden="true">
                                <strong>{item.label}</strong> {format(item.value)}
                                {item.count !== undefined && <> · {item.count} cmd</>}
                            </span>
                        )}
                        {index === best && active === null && <span className="cap">{format(item.value, true)}</span>}
                        <span className="bar" style={{ height: `${(item.value / max) * 100}%` }} />
                    </div>
                ))}
            </div>
            <div className="axis" aria-hidden="true">
                {items.map((item, index) => (
                    <span key={item.label + index}>{index % step === 0 ? item.label : ''}</span>
                ))}
            </div>
        </figure>
    );
}

/** Barres horizontales : libellé, barre et valeur à son bout. */
export function Bars({ items, format = euros, limit = 10 }) {
    const shown = items.slice(0, limit);
    const max = Math.max(1, ...shown.map((item) => item.value));
    const total = items.reduce((sum, item) => sum + item.value, 0);
    return (
        <ul className="bars">
            {shown.map((item) => (
                <li key={item.label} title={`${Math.round((item.value / total) * 100)} % du total`}>
                    <span className="bars-label">{item.label}</span>
                    <span className="bars-track">
                        <span className="bar" style={{ width: `${(item.value / max) * 100}%` }} />
                    </span>
                    <span className="bars-value">{format(item.value, true)}</span>
                </li>
            ))}
        </ul>
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
