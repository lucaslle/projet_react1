import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Container,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    IconButton,
    useToast,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [currentProduct, setCurrentProduct] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const [formData, setFormData] = useState({
        name: '',
        quantity: 0,
        price: 0,
    });

    useEffect(() => {
        // Simuler le chargement des données
        const mockProducts = [
            {
                id: 1,
                name: "Product 1",
                quantity: 10,
                price: 99.99,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
        ];
        setProducts(mockProducts);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'quantity' || name === 'price' ? Number(value) : value
        }));
    };

    const handleAdd = () => {
        setCurrentProduct(null);
        setFormData({ name: '', quantity: 0, price: 0 });
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
        setProducts(products.filter(p => p.id !== id));
        toast({
            title: "Produit supprimé",
            status: "success",
            duration: 3000,
        });
    };

    const handleSubmit = () => {
        if (currentProduct) {
            const updatedProducts = products.map(p =>
                p.id === currentProduct.id
                    ? { ...currentProduct, ...formData, updated_at: new Date().toISOString() }
                    : p
            );
            setProducts(updatedProducts);
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
            setProducts([...products, newProduct]);
            toast({
                title: "Produit ajouté",
                status: "success",
                duration: 3000,
            });
        }
        onClose();
    };

    return (
        <Container maxW="container.xl" py={5} >
            <Flex justifyContent="space-between" alignItems="center" mb={5}>
                <Box fontSize="2xl" >Gestion des Produits</Box>
                <Button leftIcon={<AddIcon />} background={"black"} color={"white"}   onClick={handleAdd}>
                    Ajouter un produit
                </Button>
            </Flex>

            <Table variant="simple">
                <Thead >
                    <Tr >
                        <Th fontSize={"xl"}>Nom</Th>
                        <Th isNumeric fontSize={"xl"}>Quantité</Th>
                        <Th isNumeric fontSize={"xl"}>Prix</Th>
                        <Th fontSize={"xl"}>Date de création</Th>
                        <Th fontSize={"xl"}>Dernière mise à jour</Th>
                        <Th fontSize={"xl"}>Actions</Th>
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
                                <IconButton
                                    aria-label="Edit"
                                    icon={<EditIcon />}
                                    mr={2}
                                    onClick={() => handleEdit(product)}
                                    background={"black"}
                                    color={"white"}
                                />
                                <IconButton
                                    aria-label="Delete"
                                    icon={<DeleteIcon />}
                                    onClick={() => handleDelete(product.id)}
                                    background={"black"}
                                    color={"white"}
                                />
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        {currentProduct ? 'Modifier le produit' : 'Ajouter un produit'}
                    </ModalHeader>
                    <ModalBody>
                        <FormControl mb={3}>
                            <FormLabel>Nom</FormLabel>
                            <Input
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                        <FormControl mb={3}>
                            <FormLabel>Quantité</FormLabel>
                            <Input
                                name="quantity"
                                type="number"
                                value={formData.quantity}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                        <FormControl mb={3}>
                            <FormLabel>Prix</FormLabel>
                            <Input
                                name="price"
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                            {currentProduct ? 'Modifier' : 'Ajouter'}
                        </Button>
                        <Button onClick={onClose}>Annuler</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Container>
    );
};

export default ProductManagement;