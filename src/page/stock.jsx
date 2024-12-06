import React, { useState, useEffect } from "react";
import {
    Button,
    Container,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    useDisclosure,
    IconButton,
    useToast,
    Flex,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import Header from "../component/header";
import ModalObj from "../component/modal";

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [currentProduct, setCurrentProduct] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const [formData, setFormData] = useState({
        name: "",
        quantity: 0,
        price: 0,
    });

    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const mockProducts = [
            {
                id: 1,
                name: "zololol",
                quantity: 10,
                price: 99.99,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
            {
                id: 2,
                name: "bloblob",
                quantity: 5,
                price: 49.99,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
        ];
        setProducts(mockProducts);
        setFilteredProducts(mockProducts);
    }, []);

    const handleSearch = (query) => {
        setSearchQuery(query.toLowerCase());
        const filtered = products.filter((product) =>
            product.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "quantity" || name === "price" ? Number(value) : value,
        }));
    };

    const handleAdd = () => {
        setCurrentProduct(null);
        setFormData({ name: "", quantity: 0, price: 0 });
        onOpen();
    };

    const handleEdit = (product) => {
        setCurrentProduct(product);
        setFormData({
            name: product.name,
            quantity: product.quantity,
            price: product.price,
        });
        onOpen();
    };

    const handleDelete = (id) => {
        const updatedProducts = products.filter((p) => p.id !== id);
        setProducts(updatedProducts);
        setFilteredProducts(updatedProducts);
        toast({
            title: "Produit supprimé",
            status: "success",
            duration: 3000,
        });
    };

    const handleSubmit = () => {
        if (currentProduct) {
            const updatedProducts = products.map((p) =>
                p.id === currentProduct.id
                    ? { ...currentProduct, ...formData, updated_at: new Date().toISOString() }
                    : p
            );
            setProducts(updatedProducts);
            setFilteredProducts(updatedProducts);
            toast({
                title: "Produit mis à jour",
                status: "success",
                duration: 3000,
            });
        } else {
            const newProduct = {
                id: products.length + 1,
                ...formData,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            const updatedProducts = [...products, newProduct];
            setProducts(updatedProducts);
            setFilteredProducts(updatedProducts);
            toast({
                title: "Produit ajouté",
                status: "success",
                duration: 3000,
            });
        }
        onClose();
    };

    return (
        <Container maxW="container.xl" py={5}>
            <Header searchQuery={searchQuery} onSearch={handleSearch} />

            <Flex justifyContent="flex-end" mb={5}>
                <Button
                    leftIcon={<AddIcon />}
                    background="black"
                    color="white"
                    border="none"
                    onClick={handleAdd}
                    boxShadow="lg"
                    _hover={{
                        transform: "scale(1.05)",
                        boxShadow: "lg",
                    }}
                    size="lg"
                    borderRadius="md"
                >
                    Ajouter un produit
                </Button>
            </Flex>

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
                    {filteredProducts.map((product) => (
                        <Tr key={product.id}>
                            <Td>{product.name}</Td>
                            <Td isNumeric>{product.quantity}</Td>
                            <Td isNumeric>{product.price}€</Td>
                            <Td>{new Date(product.created_at).toLocaleDateString()}</Td>
                            <Td>{new Date(product.updated_at).toLocaleDateString()}</Td>
                            <Td>
                                <IconButton
                                    aria-label="Edit"
                                    icon={<EditIcon />}
                                    mr={2}
                                    onClick={() => handleEdit(product)}
                                    background="black"
                                    color="white"
                                    _hover={{
                                        transform: "scale(1.05)",
                                        boxShadow: "lg",
                                    }}
                                    size="md" // change after
                                    borderRadius="md"
                                />
                                <IconButton
                                    aria-label="Delete"
                                    icon={<DeleteIcon />}
                                    onClick={() => handleDelete(product.id)}
                                    background="black"
                                    color="white"
                                    _hover={{
                                        transform: "scale(1.05)",
                                        boxShadow: "lg",
                                    }}
                                    size="md" // change after
                                    borderRadius="md"

                                />
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>

            <ModalObj
                isOpen={isOpen}
                onClose={onClose}
                currentProduct={currentProduct}
                formData={formData}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
            />
        </Container>
    );
};

export default ProductManagement;
