import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CrAvatar, CrBadge, CrBreadcrumb, CrButton, CrIconButton, CrPopover, CrSearch, CrSegmented, CrSwitch, CrTooltip } from '@cristal/react';
import { Command, Menu } from 'lucide-react';
import { pageOf } from './nav';
import { useProducts } from './products';
import { useSettings } from './settings';

const STATUSES = [['online', 'En ligne'], ['away', 'Absent'], ['busy', 'Occupé']];

/** Barre du haut : fil d'Ariane, recherche, palette de commandes, alertes et profil. */
export function Topbar({ onMenu, onPalette }) {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { products } = useProducts();
    const { settings, update } = useSettings();
    const page = pageOf(pathname);
    const product = pathname.startsWith('/stock/') && products.find((item) => `/stock/${item.id}` === pathname);
    const low = products.filter((item) => item.quantity < settings.lowStock);

    return (
        <header className="topbar">
            <CrIconButton label="Ouvrir le menu" className="menu-button" onClick={onMenu}>
                <Menu aria-hidden="true" />
            </CrIconButton>
            <CrBreadcrumb className="crumbs">
                <Link to="/">Cristal</Link>
                {product ? <Link to="/stock">Stock</Link> : <span>{page.label}</span>}
                {product && <span>{product.name}</span>}
            </CrBreadcrumb>
            <CrSearch
                className="top-search"
                label="Rechercher"
                variant="expand"
                placeholderWords={['un produit', 'une référence', 'un fournisseur']}
                onCrSubmit={(event) => event.detail.trim() && navigate(`/stock?q=${encodeURIComponent(event.detail.trim())}`)}
            />
            <CrTooltip text="Palette de commandes (Ctrl+K)" placement="bottom">
                <CrButton variant="secondary" size="s" onClick={onPalette}>
                    <Command slot="start" aria-hidden="true" />
                    Commandes
                </CrButton>
            </CrTooltip>
            <CrPopover label={low.length ? `Alertes (${low.length})` : 'Alertes'}>
                <div className="pop">
                    <strong>Stock faible</strong>
                    {low.length ? (
                        <ul className="pop-list">
                            {low.map((item) => (
                                <li key={item.id}>
                                    <Link to={`/stock/${item.id}`}>{item.name}</Link>
                                    <CrBadge variant={item.quantity ? 'warning' : 'danger'}>{item.quantity ? `${item.quantity} restants` : 'Rupture'}</CrBadge>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Tout le stock est au-dessus du seuil.</p>
                    )}
                    <CrSwitch label="Recevoir les alertes par e-mail" checked={settings.notifications} onCrChange={(event) => update({ notifications: event.detail })} />
                </div>
            </CrPopover>
            <div className="profile">
                <CrAvatar name={`${settings.displayName} Laliche`} size="s" status={settings.status} />
                <CrPopover label={settings.displayName}>
                    <div className="pop">
                        <CrSegmented label="Statut" value={settings.status} onCrChange={(event) => update({ status: event.detail })} fit>
                            {STATUSES.map(([value, name]) => (
                                <option key={value} value={value}>
                                    {name}
                                </option>
                            ))}
                        </CrSegmented>
                        <CrSwitch label="Lignes compactes" checked={settings.compact} onCrChange={(event) => update({ compact: event.detail })} />
                        <Link to="/parametres">Tous les paramètres</Link>
                    </div>
                </CrPopover>
            </div>
        </header>
    );
}
