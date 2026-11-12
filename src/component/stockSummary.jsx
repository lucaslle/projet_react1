import React from "react";
import { CrGridLayout, CrTable, CrGridItem } from "@cristal/react";
import { useSettings } from "../layout/settings";

const value = { fontSize: '2rem', fontWeight: 600, margin: 0 };

const columns = [
    { key: 'name', label: 'Produit', width: 220 },
    { key: 'quantity', label: 'Quantité', width: 110, align: 'end' },
    { key: 'price', label: 'Prix', width: 110, align: 'end' },
    { key: 'status', label: 'Statut', width: 140, badges: { Rupture: 'danger', Faible: 'warning' } },
];

const euros = (amount) => amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });

function StockSummary({ products }) {
    const LOW_STOCK = useSettings().settings.lowStock;
    const units = products.reduce((total, product) => total + Number(product.quantity), 0);
    const worth = products.reduce((total, product) => total + product.quantity * product.price, 0);
    const low = products
        .filter((product) => product.quantity < LOW_STOCK)
        .map((product) => ({
            name: product.name,
            quantity: product.quantity,
            price: euros(product.price),
            status: product.quantity === 0 ? 'Rupture' : 'Faible',
        }));

    const figures = [
        ['produits', 'Produits', products.length],
        ['unites', 'Unités en stock', units],
        ['valeur', 'Valeur du stock', euros(worth)],
    ];

    return (
        <CrGridLayout label="Résumé du stock" storageKey="stock-dashboard" rowHeight={70} style={{ marginBottom: 'var(--cr-spacing-xl)' }}>
            {figures.map(([id, title, figure], index) => (
                <CrGridItem key={id} id={id} label={title} x={index * 4} y={0} w={4} h={2} minW={2}>
                    <p style={value}>{figure}</p>
                </CrGridItem>
            ))}
            <CrGridItem id="reappro" label="À réapprovisionner" x={0} y={2} w={12} h={4} minW={6} minH={3}>
                {low.length ? (
                    <CrTable label="Produits à réapprovisionner" columns={columns} rows={low} variant="striped" density="compact" storageKey="stock-reappro" />
                ) : (
                    <p>Aucun produit sous {LOW_STOCK} unités.</p>
                )}
            </CrGridItem>
        </CrGridLayout>
    );
}

export default StockSummary;
