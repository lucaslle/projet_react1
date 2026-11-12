import React, { useMemo, useState, useTransition } from 'react';
import { CrBadge, CrButton, CrDatePicker, CrEmptyState, CrLoader, CrPagination, CrSearch, CrSegmented, CrTable } from '@cristal/react';
import { ORDERS } from '../dashboard/fakeData';
import { euros } from '../dashboard/charts';
import { OrderDrawer } from './orderDrawer';
import './orders.css';

const PAGE = 25;
const STATUSES = ['En attente', 'Payée', 'Expédiée', 'Remboursée'];
const BADGES = { Payée: 'success', Expédiée: 'primary', 'En attente': 'warning', Remboursée: 'danger' };
const iso = (date) => date.toISOString().slice(0, 10);
const daysAgo = (days) => iso(new Date(Date.now() - days * 86400000));

const columns = [
    { key: 'id', label: 'Commande', width: 130, pinned: true },
    { key: 'date', label: 'Date', width: 120 },
    { key: 'client', label: 'Client', width: 170 },
    { key: 'city', label: 'Ville', width: 120 },
    { key: 'product', label: 'Produit', width: 200 },
    { key: 'channel', label: 'Canal', width: 120 },
    { key: 'amount', label: 'Montant', width: 120, align: 'end' },
    { key: 'status', label: 'Statut', width: 140, badges: BADGES },
];

/** Commandes : période, statut, recherche client, tableau paginé et traitement des commandes en attente. */
function OrdersPage() {
    const [from, setFrom] = useState(daysAgo(30));
    const [to, setTo] = useState(iso(new Date()));
    const [status, setStatus] = useState('all');
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const [shipped, setShipped] = useState({});
    const [opened, setOpened] = useState(null);
    const [pending, startTransition] = useTransition();

    // Les commandes traitées dans le drawer passent « Expédiée » sans toucher aux données d'origine.
    const all = useMemo(() => ORDERS.map((order) => (shipped[order.id] ? { ...order, status: 'Expédiée' } : order)), [shipped]);
    const inRange = useMemo(() => all.filter((order) => iso(order.date) >= from && iso(order.date) <= to && order.client.toLowerCase().includes(query.toLowerCase())), [all, from, to, query]);
    const filtered = status === 'all' ? inRange : inRange.filter((order) => order.status === status);
    const rows = filtered.slice((page - 1) * PAGE, page * PAGE).map((order) => ({ ...order, date: order.date.toLocaleDateString('fr-FR'), amount: euros(order.amount) }));
    const toProcess = inRange.filter((order) => order.status === 'En attente').slice(0, 6);
    const change = (setter) => (event) => startTransition(() => (setter(event.detail), setPage(1)));

    return (
        <>
            <div className="page-head">
                <div>
                    <h1>Commandes</h1>
                    <p>{inRange.length.toLocaleString('fr-FR')} commandes sur la période.</p>
                </div>
                <div className="toolbar">
                    <CrDatePicker label="Du" value={from} max={to} onCrChange={change(setFrom)} />
                    <CrDatePicker label="Au" value={to} min={from} max={iso(new Date())} onCrChange={change(setTo)} />
                    <CrSearch label="Client" placeholder="Nom du client…" value={query} onCrInput={change(setQuery)} />
                </div>
            </div>

            {toProcess.length > 0 && (
                <section className="panel to-process" aria-labelledby="to-process">
                    <h2 id="to-process">À traiter en priorité</h2>
                    <ul>
                        {toProcess.map((order) => (
                            <li key={order.id}>
                                <span>
                                    <strong>{order.id}</strong> · {order.client}
                                    <span className="muted"> {order.product}, {euros(order.amount)}</span>
                                </span>
                                <CrButton size="s" onClick={() => setOpened(order)}>
                                    Traiter <span className="sr-only">{order.id}</span>
                                </CrButton>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            <CrSegmented label="Statut" value={status} onCrChange={change(setStatus)} className="levels">
                <option value="all" data-count={inRange.length}>Toutes</option>
                {STATUSES.map((name) => (
                    <option key={name} value={name} data-count={inRange.filter((order) => order.status === name).length}>
                        {name}
                    </option>
                ))}
            </CrSegmented>

            <section className="panel orders-table" aria-busy={pending ? 'true' : undefined}>
                {pending && <CrLoader label="Filtrage des commandes" variant="search" className="orders-loader" />}
                {rows.length ? (
                    <>
                        <CrTable label={`${filtered.length.toLocaleString('fr-FR')} commandes`} columns={columns} rows={rows} density="compact" variant="striped" storageKey="commandes" />
                        <CrPagination page={page} total={Math.max(1, Math.ceil(filtered.length / PAGE))} onCrChange={(event) => setPage(event.detail)} className="pager" />
                    </>
                ) : (
                    <CrEmptyState heading="Aucune commande" illustration="inbox">
                        Aucune commande ne correspond à cette période et à ces filtres.
                        <CrButton slot="actions" variant="secondary" onClick={() => (setStatus('all'), setQuery(''), setFrom(daysAgo(365)))}>
                            Voir les 12 derniers mois
                        </CrButton>
                    </CrEmptyState>
                )}
                {status !== 'all' && <CrBadge variant={BADGES[status]} className="filter-badge">Filtre : {status}</CrBadge>}
            </section>

            <OrderDrawer order={opened} onClose={() => setOpened(null)} onShip={(order) => (setShipped((map) => ({ ...map, [order.id]: true })), setOpened(null))} />
        </>
    );
}

export default OrdersPage;
