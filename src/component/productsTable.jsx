// components/ProductsTable.jsx
import React from 'react';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
} from "@chakra-ui/react";
import BoutonDelete from "./boutonDelete";
import BoutonEdit from "./boutonEdit";
import BoutonView from "./boutonView";

const ProductsTable = ({ products, handleEdit, handleDelete }) => {
    return (
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
                    <Tr key={product.id}>
                        <Td>{product.name}</Td>
                        <Td isNumeric>{product.quantity}</Td>
                        <Td isNumeric>{product.price}€</Td>
                        <Td>{new Date(product.created_at).toLocaleDateString()}</Td>
                        <Td>{new Date(product.updated_at).toLocaleDateString()}</Td>
                        <Td>
                            <BoutonEdit onEdit={() => handleEdit(product)} />
                            <BoutonDelete onDelete={() => handleDelete(product.id)} />
                            <BoutonView />
                        </Td>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    );
};

export default ProductsTable;