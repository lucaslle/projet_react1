import React, { useMemo, useRef, useState } from 'react';
import { CrBox, CrButton, CrChart, CrGridLayout, CrIconButton, CrSelect, CrTable, CrGridItem } from '@cristal/react';
import { Download } from 'lucide-react';
import { Feed, Kpi, euros } from '../dashboard/charts';
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

const EUROS = { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 };
const FILL = { height: '100%' };

/** Classement en barres horizontales, avec les 10 (ou limit) premières valeurs. */
const Ranking = ({ label, items, limit = 10 }) => (
    <CrChart label={label} hideLabel type="bar" labels={items.slice(0, limit).map((item) => item.label)} series={[{ name: 'Chiffre d\'affaires', values: items.slice(0, limit).map((item) => item.value) }]} format={EUROS} />
);

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

    const evolution = Number(days) > 90 ? 'Chiffre d\'affaires par mois' : 'Chiffre d\'affaires par jour';

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
                <CrGridItem id="evolution" label={evolution} x={0} y={2} w={8} h={5} minW={4} minH={3}>
                    <CrChart
                        label={evolution}
                        hideLabel
                        type={data.timeline.length > 31 ? 'area' : 'column'}
                        labels={data.timeline.map((point) => point.label)}
                        series={[{ name: 'Chiffre d\'affaires', values: data.timeline.map((point) => point.value) }]}
                        format={EUROS}
                        style={FILL}
                    />
                </CrGridItem>
                <CrGridItem id="categories" label="Ventes par catégorie" x={8} y={2} w={4} h={5} minW={3}>
                    <Ranking label="Ventes par catégorie" items={data.categories} />
                </CrGridItem>
                <CrGridItem id="produits" label="Top 10 produits" x={0} y={7} w={4} h={6} minW={3}>
                    <Ranking label="Top 10 produits" items={data.products} />
                </CrGridItem>
                <CrGridItem id="villes" label="Ventes par ville" x={4} y={7} w={4} h={6} minW={3}>
                    <Ranking label="Ventes par ville" items={data.cities} limit={12} />
                </CrGridItem>
                <CrGridItem id="canaux" label="Ventes par canal" x={8} y={7} w={4} h={5} minW={3} minH={4}>
                    <CrChart
                        label="Ventes par canal"
                        hideLabel
                        type="donut"
                        labels={data.channels.map((item) => item.label)}
                        series={[{ name: 'Chiffre d\'affaires', values: data.channels.map((item) => item.value) }]}
                        format={EUROS}
                        style={FILL}
                    />
                </CrGridItem>
                <CrGridItem id="flux" label="Dernières commandes" x={8} y={12} w={4} h={6} minW={3}>
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
