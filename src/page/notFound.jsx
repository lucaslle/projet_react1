import React from 'react';
import { Link } from 'react-router-dom';
import { CrEmptyState } from '@cristal/react';

function NotFoundPage() {
    return (
        <CrEmptyState heading="Page introuvable" illustration="error" className="panel">
            Cette adresse ne mène nulle part. Utilisez le menu, ou Ctrl+K pour aller directement à une page.
            <Link slot="actions" to="/">
                Retour à l’accueil
            </Link>
        </CrEmptyState>
    );
}

export default NotFoundPage;
