import React, { useState, useMemo } from 'react';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    useDisclosure,
    Flex,
    Box,
    Icon
} from "@chakra-ui/react";
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import BoutonDelete from "./boutonDelete";
import BoutonEdit from "./boutonEdit";
import { CrButton, CrDrawer } from "@cristal/react";

const ProductsTable = ({ products, handleEdit, handleDelete }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

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

    const handleSort = (key) => {
        setSortConfig(prevConfig => {
            if (prevConfig.key === key) {
                if (prevConfig.direction === null) return { key, direction: 'asc' };
                if (prevConfig.direction === 'asc') return { key, direction: 'desc' };
                if (prevConfig.direction === 'desc') return { key: null, direction: null };
            }

            return { key, direction: 'asc' };
        });
    };

    const sortedProducts = useMemo(() => {
        if (!sortConfig.key) return products;

        return [...products].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }, [products, sortConfig]);

    const SortableHeader = ({ children, sortKey }) => (
        <Th
            fontSize="xl"
            onClick={() => handleSort(sortKey)}
            cursor="pointer"
            userSelect="none"
            position="relative"
        >
            <Flex alignItems="center">
                {children}
                <Box ml={2} position="absolute" right={0}>
                    {sortConfig.key === sortKey && (
                        sortConfig.direction === 'asc' ? (
                            <Icon as={ChevronUpIcon} color="blue.500" w={5} h={5} />
                        ) : (
                            <Icon as={ChevronDownIcon} color="blue.500" w={5} h={5} />
                        )
                    )}
                </Box>
            </Flex>
        </Th>
    );

    return (
        <>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <SortableHeader sortKey="name">Nom</SortableHeader>
                        <SortableHeader sortKey="quantity">Quantité</SortableHeader>
                        <SortableHeader sortKey="price">Prix</SortableHeader>
                        <SortableHeader sortKey="created_at">Date de création</SortableHeader>
                        <SortableHeader sortKey="updated_at">Dernière mise à jour</SortableHeader>
                        <Th fontSize="xl">Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {sortedProducts.map((product) => (
                        <Tr
                            key={product.id}
                            onClick={() => handleRowClick(product)}
                            _hover={{ backgroundColor: 'whitesmoke', cursor: 'pointer' }}
                        >
                            <Td>{product.name}</Td>
                            <Td isNumeric>{product.quantity}</Td>
                            <Td isNumeric>{product.price}€</Td>
                            <Td>{formatDateTime(product.created_at)}</Td>
                            <Td>{formatDateTime(product.updated_at)}</Td>
                            <Td onClick={(e) => e.stopPropagation()}>
                                <BoutonEdit onEdit={() => handleEdit(product)} />
                                <BoutonDelete onDelete={() => handleDelete(product.id)} />
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>

            <CrDrawer label="Détails du produit" open={isOpen} onCrClose={onClose}>
                {selectedProduct && (
                    <dl>
                        <dt><strong>Nom</strong></dt>
                        <dd>{selectedProduct.name}</dd>
                        <dt><strong>Quantité</strong></dt>
                        <dd>{selectedProduct.quantity}</dd>
                        <dt><strong>Prix</strong></dt>
                        <dd>{selectedProduct.price}€</dd>
                        <dt><strong>Date de création</strong></dt>
                        <dd>{formatDateTime(selectedProduct.created_at)}</dd>
                        <dt><strong>Dernière mise à jour</strong></dt>
                        <dd>{formatDateTime(selectedProduct.updated_at)}</dd>
                    </dl>
                )}
                <CrButton slot="footer" onClick={onClose}>Fermer</CrButton>
            </CrDrawer>
        </>
    );
};

export default ProductsTable;