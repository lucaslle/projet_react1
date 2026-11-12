import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CrButton, CrEmptyState, CrIconButton, CrSearch, CrSegmented, CrSkeleton } from "@cristal/react";
import { RefreshCw } from "lucide-react";
import ModalObj from "../component/modal";
import BoutonAdd from "../component/boutonAdd";
import ProductsTable from "../component/productsTable";
import StockSummary from "../component/stockSummary";
import StockFilters, { PRICE_RANGES } from "../component/stockFilters";
import ReorderDialog from "../component/reorderDialog";
import { useProducts } from "../layout/products";
import { useSettings } from "../layout/settings";
import { useProductCrud } from "../layout/useProductCrud";

const empty = { name: "", quantity: 0, price: 0 };

const LEVELS = {
    all: () => true,
    ok: (product, low) => product.quantity >= low,
    low: (product, low) => product.quantity > 0 && product.quantity < low,
    out: (product) => product.quantity === 0,
};

const ProductManagement = () => {
    const { products, loading, refresh } = useProducts();
    const { settings } = useSettings();
    const { save, remove, reorder } = useProductCrud();
    const [params, setParams] = useSearchParams();
    const [current, setCurrent] = useState(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState(empty);
    const [level, setLevel] = useState("all");
    const [inStockOnly, setInStockOnly] = useState(false);
    const [priceRange, setPriceRange] = useState("all");
    const [menuAnimation, setMenuAnimation] = useState("anchor-pop");
    const [reordering, setReordering] = useState(null);
    const query = params.get("q") ?? "";

    const open = (product) => {
        setCurrent(product);
        setFormData(product ? { name: product.name, quantity: product.quantity, price: product.price } : empty);
        setEditing(true);
    };

    // « Ajouter un produit » depuis l'accueil ou la palette de commandes arrive avec ?nouveau=1.
    useEffect(() => {
        if (!params.has("nouveau")) return;
        open(null);
        params.delete("nouveau");
        setParams(params, { replace: true });
    }, [params, setParams]);

    const counts = useMemo(
        () => Object.fromEntries(Object.entries(LEVELS).map(([key, test]) => [key, products.filter((product) => test(product, settings.lowStock)).length])),
        [products, settings.lowStock]
    );

    const visible = products.filter((product) =>
        product.name?.toLowerCase().includes(query.toLowerCase()) &&
        LEVELS[level](product, settings.lowStock) &&
        (!inStockOnly || product.quantity > 0) &&
        PRICE_RANGES[priceRange](product.price)
    );

    const setQuery = (value) => {
        if (value) params.set("q", value);
        else params.delete("q");
        setParams(params, { replace: true });
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((previous) => ({ ...previous, [name]: name === "quantity" || name === "price" ? Number(value) : value }));
    };

    const clearFilters = () => {
        setQuery("");
        setLevel("all");
        setInStockOnly(false);
        setPriceRange("all");
    };

    return (
        <>
            <div className="page-head">
                <div>
                    <h1>Stock</h1>
                    <p>{products.length} produits suivis, seuil d’alerte à {settings.lowStock} unités.</p>
                </div>
                <div className="toolbar">
                    <CrSearch label="Rechercher un produit" value={query} placeholder="Nom du produit…" recent={["Écran", "Câble"]} noResults={!!query && !visible.length} onCrInput={(event) => setQuery(event.detail)} />
                    <CrIconButton label="Actualiser" size="l" variant="outline" loading={loading} onClick={refresh}>
                        <RefreshCw aria-hidden="true" />
                    </CrIconButton>
                    <BoutonAdd onAdd={() => open(null)} />
                </div>
            </div>

            <StockSummary products={products} />

            <CrSegmented label="Niveau de stock" value={level} onCrChange={(event) => setLevel(event.detail)} className="levels">
                <option value="all" data-count={counts.all}>Tous</option>
                <option value="ok" data-count={counts.ok}>Suffisant</option>
                <option value="low" data-count={counts.low}>Faible</option>
                <option value="out" data-count={counts.out}>Rupture</option>
            </CrSegmented>

            <StockFilters
                inStockOnly={inStockOnly}
                onInStockChange={setInStockOnly}
                priceRange={priceRange}
                menuAnimation={menuAnimation}
                onMenuAnimationChange={setMenuAnimation}
                onPriceRangeChange={setPriceRange}
            />

            {loading && !products.length ? (
                <div aria-busy="true" className="panel skeleton-table">
                    {[1, 2, 3, 4].map((row) => <CrSkeleton key={row} height="44px" />)}
                    <span className="sr-only">Chargement des produits</span>
                </div>
            ) : visible.length ? (
                <ProductsTable menuAnimation={menuAnimation} products={visible} handleEdit={open} handleDelete={remove} handleReorder={setReordering} compact={settings.compact} />
            ) : (
                <CrEmptyState heading="Aucun produit ne correspond" illustration="search" className="panel">
                    {query ? `Rien pour « ${query} » avec ces filtres.` : "Aucun produit avec ces filtres."} Élargissez la recherche ou ajoutez le produit.
                    <CrButton slot="actions" variant="secondary" onClick={clearFilters}>Effacer les filtres</CrButton>
                    <CrButton slot="actions" onClick={() => open(null)}>Ajouter un produit</CrButton>
                </CrEmptyState>
            )}

            <ReorderDialog product={reordering} onClose={() => setReordering(null)} onOrder={reorder} />

            <ModalObj
                isOpen={editing}
                onClose={() => setEditing(false)}
                currentProduct={current}
                formData={formData}
                handleInputChange={handleInputChange}
                handleSubmit={async () => (await save(formData, current)) && setEditing(false)}
            />
        </>
    );
};

export default ProductManagement;
