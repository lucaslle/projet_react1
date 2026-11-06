import React from "react";
import { CrCard } from "@cristal/react";

const grid = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--cr-spacing-lg)', marginBottom: 'var(--cr-spacing-xl)' };
const value = { fontSize: '2rem', fontWeight: 600, margin: 0 };

function StockSummary({ products }) {
    const units = products.reduce((total, product) => total + Number(product.quantity), 0);
    const worth = products.reduce((total, product) => total + product.quantity * product.price, 0);

    const cards = [
        ['Produits', products.length],
        ['Unités en stock', units],
        ['Valeur du stock', worth.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })],
    ];

    return (
        <div style={grid}>
            {cards.map(([title, figure]) => (
                <CrCard key={title}>
                    <h2 slot="header" style={{ fontSize: '1rem', margin: 0 }}>{title}</h2>
                    <p style={value}>{figure}</p>
                </CrCard>
            ))}
        </div>
    );
}

export default StockSummary;
