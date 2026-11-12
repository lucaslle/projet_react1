import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

export const API = 'http://localhost:3000/products';

const ProductsContext = createContext(null);

/** Produits de l'API, partagés par le menu (alertes), l'accueil, le stock et la fiche produit. */
export function ProductsProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const refresh = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(API, { headers: { 'Content-Type': 'application/json' }, credentials: 'include' });
            if (!response.ok) throw new Error(`Erreur ${response.status} lors de la récupération des produits`);
            setProducts(await response.json());
            setError('');
        } catch (cause) {
            setError(cause.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return <ProductsContext.Provider value={{ products, loading, error, refresh }}>{children}</ProductsContext.Provider>;
}

export const useProducts = () => useContext(ProductsContext);
