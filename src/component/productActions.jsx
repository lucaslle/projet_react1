import React, { useState } from "react";
import { CrButton, CrDialog, CrMenu } from "@cristal/react";

function ProductActions({ product, animation, onView, onEdit, onDelete }) {
    const [confirming, setConfirming] = useState(false);

    const actions = {
        view: onView,
        edit: onEdit,
        delete: () => setConfirming(true),
    };

    return (
        <>
            <CrMenu
                label="Actions"
                accessibleLabel={`Actions pour ${product.name}`}
                animation={animation}
                onCrSelect={(event) => actions[event.detail]()}
            >
                <option value="view">Voir les détails</option>
                <option value="edit">Modifier</option>
                <option value="delete">Supprimer</option>
            </CrMenu>

            <CrDialog label={`Supprimer « ${product.name} » ?`} open={confirming} onCrClose={() => setConfirming(false)}>
                <p>Cette action est irréversible.</p>
                <CrButton slot="footer" variant="secondary" onClick={() => setConfirming(false)}>Annuler</CrButton>
                <CrButton
                    slot="footer"
                    onClick={() => {
                        setConfirming(false);
                        onDelete();
                    }}
                >
                    Supprimer
                </CrButton>
            </CrDialog>
        </>
    );
}

export default ProductActions;
