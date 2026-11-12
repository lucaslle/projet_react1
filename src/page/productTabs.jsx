import React, { useState } from 'react';
import { CrAccordion, CrAccordionItem, CrAvatar, CrBadge, CrButton, CrPagination, CrRating, CrSegmented, CrTabPanel, CrTable, CrTextarea } from '@cristal/react';
import { useToast } from '../layout/toasts';
import { euros } from '../dashboard/charts';

const PAGE = 10;

const columns = [
    { key: 'id', label: 'Commande', width: 130 },
    { key: 'date', label: 'Date', width: 120 },
    { key: 'client', label: 'Client', width: 170 },
    { key: 'quantity', label: 'Qté', width: 80, align: 'end' },
    { key: 'amount', label: 'Montant', width: 120, align: 'end' },
    { key: 'status', label: 'Statut', width: 140, badges: { Payée: 'success', Expédiée: 'primary', 'En attente': 'warning', Remboursée: 'danger' } },
];

const REVIEWS = [
    ['Camille Martin', 5, 'Parfait pour le télétravail, livré en 48 h.'],
    ['Hugo Bernard', 4, 'Très bon rapport qualité-prix, emballage soigné.'],
    ['Inès Dubois', 5, 'Deuxième achat, toujours aussi satisfaite.'],
];

/** Onglets de la fiche : aperçu (accordéon), ventes (tableau paginé), avis (liste et formulaire). */
export function ProductTabs({ product, orders }) {
    const toast = useToast();
    const [tab, setTab] = useState('apercu');
    const [page, setPage] = useState(1);
    const [stars, setStars] = useState(0);
    const [text, setText] = useState('');
    const rows = orders.slice((page - 1) * PAGE, page * PAGE).map((order) => ({ ...order, date: order.date.toLocaleDateString('fr-FR'), amount: euros(order.amount) }));

    const publish = () => {
        if (!stars) return toast({ title: 'Choisissez une note avant de publier.', status: 'warning' });
        toast({ title: 'Merci pour votre avis !', description: `${stars} étoile${stars > 1 ? 's' : ''} pour « ${product.name} ».`, status: 'success' });
        setStars(0);
        setText('');
    };

    return (
        <section className="panel product-tabs">
            <CrSegmented label="Sections de la fiche produit" variant="underline" value={tab} onCrChange={(event) => setTab(event.detail)}>
                <CrTabPanel label="Aperçu" value="apercu">
                    <CrAccordion animation="accent-bar" numbered>
                        <CrAccordionItem label="Caractéristiques" open>
                            Référence CR-{String(product.id).padStart(5, '0')}, garantie 2 ans, prix unitaire {euros(product.price)}.
                        </CrAccordionItem>
                        <CrAccordionItem label="Livraison">Expédition sous 24 h depuis l’entrepôt de Lyon, offerte dès 50 €.</CrAccordionItem>
                        <CrAccordionItem label="Retours">30 jours pour changer d’avis, retour gratuit en point relais.</CrAccordionItem>
                    </CrAccordion>
                </CrTabPanel>
                <CrTabPanel label={`Ventes (${orders.length})`} value="ventes">
                    <CrTable label={`Commandes de ${product.name}`} columns={columns} rows={rows} variant="striped" density="compact" storageKey="fiche-ventes" />
                    <CrPagination page={page} total={Math.max(1, Math.ceil(orders.length / PAGE))} onCrChange={(event) => setPage(event.detail)} className="pager" />
                </CrTabPanel>
                <CrTabPanel label={`Avis (${REVIEWS.length})`} value="avis">
                    <ul className="reviews">
                        {REVIEWS.map(([name, note, comment]) => (
                            <li key={name}>
                                <CrAvatar name={name} />
                                <div>
                                    <strong>{name}</strong> <CrBadge variant="success">Achat vérifié</CrBadge>
                                    <span className="stars">
                                        <span aria-hidden="true">{'★'.repeat(note)}</span> {note} / 5
                                    </span>
                                    <p>{comment}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="review-form">
                        <CrRating label="Votre note" value={stars} onCrChange={(event) => setStars(event.detail)} />
                        <CrTextarea label="Votre avis" placeholder="Qu’avez-vous pensé de ce produit ?" value={text} rows={2} onCrInput={(event) => setText(event.detail)} />
                        <CrButton onClick={publish}>Publier l’avis</CrButton>
                    </div>
                </CrTabPanel>
            </CrSegmented>
        </section>
    );
}
