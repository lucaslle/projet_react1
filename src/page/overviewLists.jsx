import React from 'react';
import { Link } from 'react-router-dom';
import { CrBadge, CrImage, CrProgress, CrSkeleton } from '@cristal/react';
import { euros } from '../dashboard/charts';
import { imageOf, ratingOf } from '../dashboard/productStats';
import { useSettings } from '../layout/settings';

const GOAL = 250000;

const Placeholder = () => (
    <li aria-hidden="true" className="product-row">
        <CrSkeleton shape="block" width="56px" height="56px" />
        <span className="grow">
            <CrSkeleton width="60%" />
            <CrSkeleton width="35%" />
        </span>
    </li>
);

/** Objectif du mois, produits à surveiller et produits les mieux notés. */
export function OverviewLists({ products, loading, revenue }) {
    const { settings } = useSettings();
    const low = products.filter((product) => product.quantity < settings.lowStock);
    const best = [...products].sort((a, b) => ratingOf(b) - ratingOf(a)).slice(0, 3);

    return (
        <div className="overview-grid">
            <section className="panel goal">
                <h2>Objectif du mois</h2>
                <p className="goal-figure">
                    {euros(revenue)} <span>sur {euros(GOAL)}</span>
                </p>
                <CrProgress label="Objectif de chiffre d’affaires atteint" value={Math.min(100, Math.round((revenue / GOAL) * 100))} showValue />
                <p className="muted">Le rythme actuel dépasse l’objectif : pensez à réapprovisionner les meilleures ventes.</p>
            </section>

            <section className="panel" aria-busy={loading ? 'true' : undefined}>
                <h2>Stock à surveiller</h2>
                <ul className="product-list">
                    {loading && [1, 2].map((key) => <Placeholder key={key} />)}
                    {!loading && !low.length && <li className="muted">Rien sous le seuil de {settings.lowStock} unités.</li>}
                    {low.map((product) => (
                        <li key={product.id} className="product-row">
                            <CrImage src={imageOf(product, 160, 160)} alt="" className="thumb" />
                            <span className="grow">
                                <Link to={`/stock/${product.id}`}>{product.name}</Link>
                                <span className="muted">{euros(product.price)}</span>
                            </span>
                            <CrBadge variant={product.quantity ? 'warning' : 'danger'}>{product.quantity ? `${product.quantity} restants` : 'Rupture'}</CrBadge>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="panel" aria-busy={loading ? 'true' : undefined}>
                <h2>Coups de cœur clients</h2>
                <ul className="product-list">
                    {loading && [1, 2, 3].map((key) => <Placeholder key={key} />)}
                    {best.map((product) => (
                        <li key={product.id} className="product-row">
                            <CrImage src={imageOf(product, 160, 160)} alt="" className="thumb" />
                            <span className="grow">
                                <Link to={`/stock/${product.id}`}>{product.name}</Link>
                                <span className="stars">
                                    <span aria-hidden="true">{'★'.repeat(Math.round(ratingOf(product)))}</span> {ratingOf(product).toLocaleString('fr-FR')} / 5
                                </span>
                            </span>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}
