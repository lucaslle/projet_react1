import React, { useState, useRef } from "react";
import { DeleteIcon, Tooltip } from "@chakra-ui/icons";
import { IconButton, Button, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay } from "@chakra-ui/react";

function BoutonDelete({ onDelete }) {
    const [isOpen, setIsOpen] = useState(false);
    const cancelRef = useRef();

    const openModal = () => setIsOpen(true);
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
                    aria-label="Delete"
                    icon={<DeleteIcon />}
                    onClick={openModal}
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

            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={closeModal}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Confirmer la suppression
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={closeModal}>
                                Annuler
                            </Button>
                            <Button colorScheme="red" onClick={handleDelete} ml={3}>
                                Supprimer
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
}

export default BoutonDelete;
