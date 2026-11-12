import React, { useMemo, useRef, useState } from 'react';
import { CrBox, CrButton, CrGridLayout, CrIconButton, CrSelect, CrTable, CrGridItem } from '@cristal/react';
import { Download } from 'lucide-react';
import { Bars, Columns, Feed, Kpi, euros } from '../dashboard/charts';
import { CHANNELS, ORDERS, PERIODS, groupBy, ordersOf, series, sum } from '../dashboard/fakeData';
import '../dashboard/dashboard.css';

const columns = [
    { key: 'id', label: 'Commande', width: 130, pinned: true },
    { key: 'date', label: 'Date', width: 120 },
    { key: 'client', label: 'Client', width: 170 },
    { key: 'city', label: 'Ville', width: 120 },
    { key: 'product', label: 'Produit', width: 190 },
    { key: 'category', label: 'Catégorie', width: 130 },
    { key: 'channel', label: 'Canal', width: 120 },
    { key: 'quantity', label: 'Qté', width: 80, align: 'end' },
    { key: 'amount', label: 'Montant', width: 110, align: 'end' },
    { key: 'status', label: 'Statut', width: 130, badges: { Payée: 'success', Expédiée: 'primary', 'En attente': 'warning', Remboursée: 'danger' } },
];

const download = (orders) => {
    const lines = [columns.map((column) => column.label), ...orders.map((order) => columns.map((column) => String(order[column.key]).replace(/;/g, ',')))];
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob(['﻿' + lines.map((line) => line.join(';')).join('\n')], { type: 'text/csv' }));
    link.download = 'commandes.csv';
    link.click();
    URL.revokeObjectURL(link.href);
};

function AnotherPage() {
    const dashboard = useRef(null);
    const [days, setDays] = useState('30');
    const [channels, setChannels] = useState(CHANNELS);

    const data = useMemo(() => {
        const { current, previous } = ordersOf(Number(days), channels);
        const clients = (orders) => new Set(orders.map((order) => order.client)).size;
        const basket = (orders) => (orders.length ? sum(orders) / orders.length : 0);
        return {
            current,
            kpis: [
                ['ca', 'Chiffre d\'affaires', euros(sum(current)), sum(current), sum(previous)],
                ['commandes', 'Commandes', current.length.toLocaleString('fr-FR'), current.length, previous.length],
                ['panier', 'Panier moyen', euros(basket(current)), basket(current), basket(previous)],
                ['clients', 'Clients uniques', clients(current).toLocaleString('fr-FR'), clients(current), clients(previous)],
            ],
            timeline: series(current, Number(days)),
            categories: groupBy(current, 'category'),
            channels: groupBy(current, 'channel'),
            products: groupBy(current, 'product'),
            cities: groupBy(current, 'city'),
            rows: current.map((order) => ({ ...order, date: order.date.toLocaleDateString('fr-FR'), amount: euros(order.amount) })),
        };
    }, [days, channels]);

    return (
        <div className="sales-page">
            <div className="page-head">
                <div>
                    <h1>Ventes</h1>
                    <p>{ORDERS.length.toLocaleString('fr-FR')} commandes fictives · {data.current.length.toLocaleString('fr-FR')} sur la période. Glissez et redimensionnez les cartes.</p>
                </div>
            </div>

            <CrBox display="flex" gap="lg" align="flex-end" wrap padding="lg 0">
                <CrSelect label="Période" value={days} onCrChange={(event) => setDays(event.detail)} style={{ width: 220 }}>
                    {Object.entries(PERIODS).map(([value, name]) => <option key={value} value={value}>{name}</option>)}
                </CrSelect>
                <CrSelect label="Canaux" multiple values={channels} onCrChange={(event) => setChannels(event.detail)} style={{ width: 280 }}>
                    {CHANNELS.map((channel) => <option key={channel} value={channel}>{channel}</option>)}
                </CrSelect>
                <CrButton variant="outline" onClick={() => dashboard.current?.reset()}>Réorganiser par défaut</CrButton>
            </CrBox>

            <CrGridLayout ref={dashboard} label="Tableau de bord des ventes" storageKey="ventes-dashboard" rowHeight={64}>
                {data.kpis.map(([id, title, value, current, previous], index) => (
                    <CrGridItem key={id} id={id} label={title} x={index * 3} y={0} w={3} h={2} minW={2}>
                        <Kpi value={value} current={current} previous={previous} />
                    </CrGridItem>
                ))}
                <CrGridItem id="evolution" label={Number(days) > 90 ? 'Chiffre d\'affaires par mois' : 'Chiffre d\'affaires par jour'} x={0} y={2} w={8} h={5} minW={4} minH={3}>
                    <Columns items={data.timeline} label="Chiffre d'affaires" />
                </CrGridItem>
                <CrGridItem id="categories" label="Ventes par catégorie" x={8} y={2} w={4} h={5} minW={3}>
                    <Bars items={data.categories} />
                </CrGridItem>
                <CrGridItem id="produits" label="Top 10 produits" x={0} y={7} w={4} h={6} minW={3}>
                    <Bars items={data.products} />
                </CrGridItem>
                <CrGridItem id="villes" label="Ventes par ville" x={4} y={7} w={4} h={6} minW={3}>
                    <Bars items={data.cities} limit={12} />
                </CrGridItem>
                <CrGridItem id="canaux" label="Ventes par canal" x={8} y={7} w={4} h={3} minW={3}>
                    <Bars items={data.channels} />
                </CrGridItem>
                <CrGridItem id="flux" label="Dernières commandes" x={8} y={10} w={4} h={6} minW={3}>
                    <Feed orders={data.current.slice(0, 15)} />
                </CrGridItem>
                <CrGridItem id="commandes-table" label="Toutes les commandes" x={0} y={13} w={8} h={9} minW={6} minH={4}>
                    <CrIconButton slot="actions" label="Exporter en CSV" size="xs" tooltipPlacement="start" onClick={() => download(data.current)}>
                        <Download aria-hidden="true" />
                    </CrIconButton>
                    <CrTable label={`${data.rows.length.toLocaleString('fr-FR')} commandes`} columns={columns} rows={data.rows} variant="striped" density="compact" storageKey="ventes-table" />
                </CrGridItem>
            </CrGridLayout>
        </div>
    );
}

export default AnotherPage;
