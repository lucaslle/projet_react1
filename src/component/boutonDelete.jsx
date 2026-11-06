import React, { useState } from "react";
import { DeleteIcon } from "@chakra-ui/icons";
import { IconButton, Tooltip } from "@chakra-ui/react";
import { CrButton, CrDialog } from "@cristal/react";

function BoutonDelete({ onDelete }) {
    const [isOpen, setIsOpen] = useState(false);

    const closeModal = () => setIsOpen(false);

    const handleDelete = () => {
        onDelete();
        closeModal();
    };

    return (
        <>
            <Tooltip label="Supprimer">
                <IconButton
                    mr={2}
                    aria-label="Supprimer"
                    icon={<DeleteIcon />}
                    onClick={() => setIsOpen(true)}
                    background="black"
                    color="white"
                    _hover={{
                        transform: "scale(1.05)",
                        boxShadow: "lg",
                    }}
                    size="md"
                    borderRadius="md"
                />
            </Tooltip>

            <CrDialog label="Confirmer la suppression" open={isOpen} onCrClose={closeModal}>
                <p>Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.</p>
                <CrButton slot="footer" variant="secondary" onClick={closeModal}>Annuler</CrButton>
                <CrButton slot="footer" onClick={handleDelete}>Supprimer</CrButton>
            </CrDialog>
        </>
    );
}

export default BoutonDelete;
