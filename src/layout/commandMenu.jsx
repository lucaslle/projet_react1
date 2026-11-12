import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CrCommandPalette } from '@cristal/react';
import { PAGES } from './nav';
import { useProducts } from './products';
import { COLORS, useSettings } from './settings';

/** Ctrl+K : aller à une page ou un produit, ajouter un produit, changer la couleur ou la densité. */
export function CommandMenu({ open, onClose }) {
    const navigate = useNavigate();
    const { products } = useProducts();
    const { settings, update } = useSettings();

    const run = (value) => {
        const [kind, arg] = value.split(':');
        if (kind === 'page') navigate(arg);
        if (kind === 'product') navigate(`/stock/${arg}`);
        if (kind === 'new') navigate('/stock?nouveau=1');
        if (kind === 'color') update({ color: arg });
        if (kind === 'compact') update({ compact: !settings.compact });
    };

    return (
        <CrCommandPalette label="Palette de commandes" placeholder="Que voulez-vous faire ?" open={open} onCrSelect={(event) => run(event.detail)} onCrClose={onClose}>
            {PAGES.map((page) => (
                <option key={page.path} value={`page:${page.path}`} data-group="Aller à">
                    {page.label}
                </option>
            ))}
            {products.map((product) => (
                <option key={product.id} value={`product:${product.id}`} data-group="Produits">
                    {product.name}
                </option>
            ))}
            <option value="new" data-group="Actions">
                Ajouter un produit
            </option>
            <option value="compact" data-group="Actions">
                {settings.compact ? 'Lignes normales' : 'Lignes compactes'}
            </option>
            {COLORS.map(([name, value]) => (
                <option key={value} value={`color:${value}`} data-group="Couleur de l'interface">
                    {name}
                </option>
            ))}
        </CrCommandPalette>
    );
}
