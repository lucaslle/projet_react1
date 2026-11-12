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
import { Link } from "react-router-dom";
import ProductActions from "./productActions";
import { PackagePlus } from "lucide-react";
import { CrAccordion, CrAccordionItem, CrBox, CrButton, CrDrawer, CrIconButton } from "@cristal/react";

const ProductsTable = ({ products, handleEdit, handleDelete, handleReorder, menuAnimation, compact }) => {
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
            <Table variant="simple" size={compact ? "sm" : "md"}>
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
                            <Td><Link to={`/stock/${product.id}`} onClick={(e) => e.stopPropagation()} className="product-link">{product.name}</Link></Td>
                            <Td isNumeric>{product.quantity}</Td>
                            <Td isNumeric>{product.price}€</Td>
                            <Td>{formatDateTime(product.created_at)}</Td>
                            <Td>{formatDateTime(product.updated_at)}</Td>
                            <Td onClick={(e) => e.stopPropagation()}>
                                <CrBox display="flex" gap="sm" align="center">
                                <CrIconButton label={`Réapprovisionner ${product.name}`} tooltipPlacement="start" onClick={() => handleReorder(product)}>
                                    <PackagePlus aria-hidden="true" />
                                </CrIconButton>
                                <ProductActions
                                    product={product}
                                    animation={menuAnimation}
                                    onView={() => handleRowClick(product)}
                                    onEdit={() => handleEdit(product)}
                                    onDelete={() => handleDelete(product)}
                                />
                                </CrBox>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>

            <CrDrawer label="Détails du produit" open={isOpen} onCrClose={onClose}>
                {selectedProduct && (
                    <CrAccordion multiple animation="accent-bar">
                        <CrAccordionItem label="Stock et prix" open>
                            <dl>
                                <dt><strong>Nom</strong></dt>
                                <dd>{selectedProduct.name}</dd>
                                <dt><strong>Quantité</strong></dt>
                                <dd>{selectedProduct.quantity}</dd>
                                <dt><strong>Prix</strong></dt>
                                <dd>{selectedProduct.price}€</dd>
                            </dl>
                        </CrAccordionItem>
                        <CrAccordionItem label="Historique">
                            <dl>
                                <dt><strong>Date de création</strong></dt>
                                <dd>{formatDateTime(selectedProduct.created_at)}</dd>
                                <dt><strong>Dernière mise à jour</strong></dt>
                                <dd>{formatDateTime(selectedProduct.updated_at)}</dd>
                            </dl>
                        </CrAccordionItem>
                    </CrAccordion>
                )}
                <CrButton slot="footer" variant="secondary" onClick={() => { onClose(); handleReorder(selectedProduct); }}>Réapprovisionner</CrButton>
                <CrButton slot="footer" onClick={onClose}>Fermer</CrButton>
            </CrDrawer>
        </>
    );
};

export default ProductsTable;