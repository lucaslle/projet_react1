import React, { useState, useEffect } from "react";
import {
    Container,
    useDisclosure,
    useToast,
    Flex,
} from "@chakra-ui/react";
import Header from "../component/header";
import ModalObj from "../component/modal";
import BoutonAdd from "../component/boutonAdd";
import ProductsTable from "../component/productsTable";

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

    const updateFilteredProducts = (updatedProducts) => {
        setFilteredProducts(
            updatedProducts.filter((product) =>
                product.name?.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:3000/products', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Détails de l\'erreur:', errorText);
                throw new Error('Erreur réseau lors de la récupération des produits');
            }

            const data = await response.json();
            setProducts(data);
            setFilteredProducts(data);
        } catch (error) {
            console.error('Erreur complète:', error);
            toast({
                title: 'Erreur lors de la récupération des produits',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    // Fetch initial des produits
    useEffect(() => {
        fetchProducts();
    }, []);

    // Mise à jour de la recherche
    const handleSearch = (query) => {
        setSearchQuery(query.toLowerCase());
        const filtered = products.filter((product) =>
            product.name?.toLowerCase().includes(query.toLowerCase())
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

    const handleDelete = async (id) => {
        try {
            await fetch(`http://localhost:3000/products/${id}`, { method: 'DELETE' });
            const updatedProducts = products.filter((p) => p.id !== id);
            setProducts(updatedProducts);
            updateFilteredProducts(updatedProducts);
            toast({
                title: 'Produit supprimé',
                status: 'success',
                duration: 3000,
            });
        } catch (error) {
            toast({
                title: 'Erreur lors de la suppression',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    console.log(products);

    const handleSubmit = async () => {
        try {
            if (currentProduct) {
                const response = await fetch(`http://localhost:3000/products/${currentProduct.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de la mise à jour du produit');
                }

                // Si l'API ne renvoie pas directement le produit mis à jour, on rafraîchit les données
                await fetchProducts();

                toast({
                    title: "Produit mis à jour avec succès",
                    status: "success",
                    duration: 3000,
                });
            } else {
                const response = await fetch('http://localhost:3000/products', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de l\'ajout du produit');
                }

                // Rafraîchir les produits après l'ajout
                await fetchProducts();

                toast({
                    title: "Produit ajouté avec succès",
                    status: "success",
                    duration: 3000,
                });
            }
            onClose();
        } catch (error) {
            toast({
                title: 'Erreur',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };



    return (
        <Container maxW="container.xl" py={5} ml={'20%'} mr={'5%'}>
            <Header searchQuery={searchQuery} onSearch={handleSearch} w={'25%'} />

            <Flex justifyContent="flex-start" mb={5} marginBottom={10}>
                <BoutonAdd onAdd={handleAdd} />
            </Flex>
            <ProductsTable
                products={filteredProducts}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />

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
