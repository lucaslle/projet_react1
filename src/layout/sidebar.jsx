import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { CrAvatar, CrAvatarGroup, CrBadge, CrProgress } from '@cristal/react';
import { PAGES } from './nav';
import { Logo } from './logo';
import { useProducts } from './products';
import { useSettings } from './settings';
import { pendingOrders } from '../dashboard/fakeData';

const TEAM = ['Camille Martin', 'Hugo Bernard', 'Inès Dubois', 'Jules Moreau', 'Zoé Lefebvre'];

/** Menu principal : pages groupées, compteurs vivants, équipe connectée. */
export function Sidebar({ onNavigate }) {
    const { products } = useProducts();
    const { settings } = useSettings();
    const low = products.filter((product) => product.quantity < settings.lowStock).length;
    const counts = { '/stock': [low, 'danger', 'à réapprovisionner'], '/commandes': [pendingOrders, 'warning', 'en attente'] };
    const groups = [...new Set(PAGES.map((page) => page.group))];

    return (
        <div className="sidebar">
            <Link className="brand" to="/" onClick={onNavigate}>
                <Logo />
                <span>
                    Cristal <em>Commerce</em>
                </span>
            </Link>
            <nav aria-label="Menu principal">
                {groups.map((group) => (
                    <div key={group} className="nav-group">
                        <p className="nav-title">{group}</p>
                        {PAGES.filter((page) => page.group === group).map(({ path, label, icon: Icon }) => {
                            const [count, variant, meaning] = counts[path] ?? [];
                            return (
                                <NavLink key={path} to={path} end={path === '/'} className="nav-link" onClick={onNavigate}>
                                    <Icon aria-hidden="true" size={18} />
                                    {label}
                                    {count > 0 && (
                                        <CrBadge variant={variant} count={count} className="nav-count">
                                            <span className="sr-only">{meaning}</span>
                                        </CrBadge>
                                    )}
                                </NavLink>
                            );
                        })}
                    </div>
                ))}
            </nav>
            <div className="sidebar-foot">
                <p className="nav-title">Équipe en ligne</p>
                <CrAvatarGroup max={4}>
                    {TEAM.map((name, index) => (
                        <CrAvatar key={name} name={name} size="s" status={index < 3 ? 'online' : 'away'} />
                    ))}
                </CrAvatarGroup>
                <p className="storage-text" aria-hidden="true">Stockage : 72 % utilisé</p>
                <CrProgress label="Stockage : 72 % utilisé" value={72} className="storage" />
            </div>
        </div>
    );
}
