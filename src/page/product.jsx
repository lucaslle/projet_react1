import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CrBadge, CrButton, CrEmptyState, CrImage, CrRating, CrSkeleton, CrSparkline, CrTooltip } from '@cristal/react';
import { PackagePlus, Pencil } from 'lucide-react';
import { useProducts } from '../layout/products';
import { useSettings } from '../layout/settings';
import { useProductCrud } from '../layout/useProductCrud';
import { euros } from '../dashboard/charts';
import { imageOf, monthlyUnits, ordersOfProduct, ratingOf } from '../dashboard/productStats';
import ReorderDialog from '../component/reorderDialog';
import ModalObj from '../component/modal';
import { ProductTabs } from './productTabs';
import './product.css';

/** Fiche produit : photo, état du stock, ventes des 12 derniers mois, onglets détails / ventes / avis. */
function ProductPage() {
    const { id } = useParams();
    const { products, loading } = useProducts();
    const { settings } = useSettings();
    const { save, reorder } = useProductCrud();
    const [reordering, setReordering] = useState(false);
    const [form, setForm] = useState(null);
    const product = products.find((item) => String(item.id) === id);
    const orders = useMemo(() => (product ? ordersOfProduct(product) : []), [product]);
    const units = useMemo(() => monthlyUnits(orders), [orders]);

    if (loading && !product)
        return (
            <div className="product-hero" aria-busy="true">
                <CrSkeleton shape="block" height="360px" />
                <div className="product-info">
                    <CrSkeleton height="40px" width="60%" />
                    <CrSkeleton width="40%" />
                    <CrSkeleton height="120px" />
                </div>
                <span className="sr-only">Chargement du produit</span>
            </div>
        );

    if (!product)
        return (
            <CrEmptyState heading="Produit introuvable" illustration="search" className="panel">
                Ce produit a peut-être été supprimé du catalogue.
                <Link slot="actions" to="/stock">Retour au stock</Link>
            </CrEmptyState>
        );

    const status = product.quantity === 0 ? ['danger', 'Rupture de stock'] : product.quantity < settings.lowStock ? ['warning', `Stock faible : ${product.quantity}`] : ['success', `En stock : ${product.quantity}`];

    return (
        <>
            <div className="product-hero">
                <CrImage src={imageOf(product)} alt={`Photo d’illustration : ${product.name}`} className="product-photo" />
                <div className="product-info">
                    <CrBadge variant={status[0]}>{status[1]}</CrBadge>
                    <h1>{product.name}</h1>
                    <CrTooltip text="Prix TTC, livraison offerte dès 50 €">
                        <button type="button" className="price">{euros(product.price)}</button>
                    </CrTooltip>
                    <CrRating label="Note moyenne des clients" value={ratingOf(product)} readonly />
                    <div className="trend">
                        <span>
                            <strong>{units.reduce((total, value) => total + value, 0).toLocaleString('fr-FR')}</strong> unités vendues sur 12 mois
                        </span>
                        <CrSparkline label={`Ventes mensuelles de ${product.name}`} values={units} variant="area" className="trend-spark" />
                    </div>
                    <div className="product-actions">
                        <CrButton size="l" onClick={() => setReordering(true)}>
                            <PackagePlus slot="start" aria-hidden="true" />
                            Réapprovisionner
                        </CrButton>
                        <CrButton size="l" variant="secondary" onClick={() => setForm({ name: product.name, quantity: product.quantity, price: product.price })}>
                            <Pencil slot="start" aria-hidden="true" />
                            Modifier
                        </CrButton>
                    </div>
                </div>
            </div>

            <ProductTabs product={product} orders={orders} />

            <ReorderDialog product={reordering ? product : null} onClose={() => setReordering(false)} onOrder={reorder} />
            <ModalObj
                isOpen={!!form}
                onClose={() => setForm(null)}
                currentProduct={product}
                formData={form ?? {}}
                handleInputChange={(event) => setForm((current) => ({ ...current, [event.target.name]: ['quantity', 'price'].includes(event.target.name) ? Number(event.target.value) : event.target.value }))}
                handleSubmit={async () => (await save(form, product)) && setForm(null)}
            />
        </>
    );
}

export default ProductPage;
