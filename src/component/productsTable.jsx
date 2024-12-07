import React, { useState } from 'react';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure
} from "@chakra-ui/react";
import BoutonDelete from "./boutonDelete";
import BoutonEdit from "./boutonEdit";
import BoutonView from "./boutonView";

const ProductsTable = ({ products, handleEdit, handleDelete }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedProduct, setSelectedProduct] = useState(null);

    const formatDateTime = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        return new Date(dateString).toLocaleString('fr-FR', options);
    };

    const handleRowClick = (product) => {
        setSelectedProduct(product);
        onOpen();
    };

    return (
        <>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th fontSize="xl">Nom</Th>
                        <Th isNumeric fontSize="xl">Quantité</Th>
                        <Th isNumeric fontSize="xl">Prix</Th>
                        <Th fontSize="xl">Date de création</Th>
                        <Th fontSize="xl">Dernière mise à jour</Th>
                        <Th fontSize="xl">Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {products.map((product) => (
                        <Tr
                            key={product.id}
                            onClick={() => handleRowClick(product)}
                            _hover={{ backgroundColor: 'gray.100', cursor: 'pointer' }}
                        >
                            <Td>{product.name}</Td>
                            <Td isNumeric>{product.quantity}</Td>
                            <Td isNumeric>{product.price}€</Td>
                            <Td>{formatDateTime(product.created_at)}</Td>
                            <Td>{formatDateTime(product.updated_at)}</Td>
                            <Td onClick={(e) => e.stopPropagation()}>
                                <BoutonEdit onEdit={() => handleEdit(product)} />
                                <BoutonDelete onDelete={() => handleDelete(product.id)} />
                                <BoutonView />
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>

            {selectedProduct && (
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Détails du Produit</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <p><strong>Nom:</strong> {selectedProduct.name}</p>
                            <p><strong>Quantité:</strong> {selectedProduct.quantity}</p>
                            <p><strong>Prix:</strong> {selectedProduct.price}€</p>
                            <p><strong>Date de création:</strong> {formatDateTime(selectedProduct.created_at)}</p>
                            <p><strong>Dernière mise à jour:</strong> {formatDateTime(selectedProduct.updated_at)}</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button color={"white"} mr={3} onClick={onClose} bg={"black"}
                                    _hover={{
                                        transform: "scale(1.05)",
                                        boxShadow: "lg",
                                    }}
                            >
                                Fermer
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </>
    );
};

export default ProductsTable;