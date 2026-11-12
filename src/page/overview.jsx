import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CrBackground, CrButton, CrEmptyState, CrProgressSteps } from '@cristal/react';
import { Plus } from 'lucide-react';
import { useProducts } from '../layout/products';
import { useSettings } from '../layout/settings';
import { CHANNELS, ordersOf, series, sum } from '../dashboard/fakeData';
import { OverviewKpis } from './overviewKpis';
import { OverviewLists } from './overviewLists';
import './overview.css';

const SYNC = ['Connexion à l’entrepôt', 'Lecture des stocks', 'Calcul des alertes', 'Tableau prêt'];

const greeting = () => (new Date().getHours() < 18 ? 'Bonjour' : 'Bonsoir');

/** Accueil : bandeau animé, chiffres clés avec tendances, objectif du mois et stock à surveiller. */
function OverviewPage() {
    const navigate = useNavigate();
    const { products, loading, error, refresh } = useProducts();
    const { settings } = useSettings();
    const [step, setStep] = useState(0);

    // Synchronisation de démonstration : une étape toutes les 0,9 s au chargement de l'accueil.
    useEffect(() => {
        if (step >= SYNC.length - 1) return undefined;
        const timer = setTimeout(() => setStep((current) => current + 1), 900);
        return () => clearTimeout(timer);
    }, [step]);

    const stats = useMemo(() => {
        const { current, previous } = ordersOf(30, CHANNELS);
        return { current, previous, daily: series(current, 30), revenue: sum(current) };
    }, []);

    return (
        <div className="overview">
            <CrBackground variant="aurora" className="hero">
                <div className="hero-inner">
                    <div>
                        <p className="hero-date">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                        <h1>
                            {greeting()} {settings.displayName}, <span>votre boutique brille.</span>
                        </h1>
                        <p className="hero-lead">
                            {stats.current.length.toLocaleString('fr-FR')} commandes ces 30 derniers jours. Tout est à jour, voici ce qui mérite votre attention.
                        </p>
                        <div className="hero-actions">
                            <CrButton size="l" onClick={() => navigate('/stock?nouveau=1')}>
                                <Plus slot="start" aria-hidden="true" />
                                Ajouter un produit
                            </CrButton>
                            <CrButton size="l" variant="secondary" onClick={() => navigate('/ventes')}>
                                Voir les ventes
                            </CrButton>
                        </div>
                    </div>
                    <div className="hero-sync">
                        <CrProgressSteps label="Synchronisation des stocks" steps={SYNC} current={step} />
                    </div>
                </div>
            </CrBackground>

            <OverviewKpis stats={stats} products={products} loading={loading} />

            {error ? (
                <CrEmptyState heading="Impossible de joindre l’entrepôt" illustration="error" className="panel">
                    {error}. Vérifiez que l’API tourne sur le port 3000.
                    <CrButton slot="actions" onClick={refresh}>
                        Réessayer
                    </CrButton>
                    <Link slot="actions" to="/parametres">
                        Paramètres
                    </Link>
                </CrEmptyState>
            ) : (
                <OverviewLists products={products} loading={loading} revenue={stats.revenue} />
            )}
        </div>
    );
}

export default OverviewPage;
