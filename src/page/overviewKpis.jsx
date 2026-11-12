import React from 'react';
import { CrBadge, CrSkeleton, CrSparkline } from '@cristal/react';
import { euros } from '../dashboard/charts';
import { sum } from '../dashboard/fakeData';

const change = (current, previous) => (previous ? Math.round(((current - previous) / previous) * 100) : 0);

function Kpi({ title, value, trend, values, label }) {
    return (
        <article className="kpi-card">
            <header>
                <h2>{title}</h2>
                {trend === undefined ? (
                    <CrBadge variant="primary">En direct</CrBadge>
                ) : (
                    <CrBadge variant={trend >= 0 ? 'success' : 'danger'}>
                        <span aria-hidden="true">{trend >= 0 ? '▲' : '▼'}</span> {trend >= 0 ? '+' : ''}
                        {trend} %<span className="sr-only"> par rapport aux 30 jours précédents</span>
                    </CrBadge>
                )}
            </header>
            <p className="kpi-number">{value}</p>
            {values && <CrSparkline label={label} values={values} variant="area" className="kpi-spark" />}
        </article>
    );
}

/** Quatre chiffres clés : trois tirés des commandes (avec leur courbe sur 30 jours), un tiré du stock réel. */
export function OverviewKpis({ stats, products, loading }) {
    const { current, previous, daily } = stats;
    const basket = (orders) => (orders.length ? sum(orders) / orders.length : 0);
    const worth = products.reduce((total, product) => total + product.quantity * product.price, 0);

    return (
        <section className="kpis" aria-label="Chiffres clés">
            <Kpi title="Chiffre d’affaires" value={euros(sum(current))} trend={change(sum(current), sum(previous))} values={daily.map((day) => Math.round(day.value))} label="Chiffre d’affaires par jour" />
            <Kpi title="Commandes" value={current.length.toLocaleString('fr-FR')} trend={change(current.length, previous.length)} values={daily.map((day) => day.count)} label="Commandes par jour" />
            <Kpi title="Panier moyen" value={euros(basket(current))} trend={change(basket(current), basket(previous))} />
            {loading ? (
                <article className="kpi-card" aria-busy="true">
                    <CrSkeleton width="50%" />
                    <CrSkeleton height="36px" width="70%" />
                    <span className="sr-only">Chargement de la valeur du stock</span>
                </article>
            ) : (
                <Kpi title="Valeur du stock" value={euros(worth)} />
            )}
        </section>
    );
}
