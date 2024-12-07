import React from "react";
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
} from "@chakra-ui/react";

function ModalObj({
                      isOpen,
                      onClose,
                      currentProduct,
                      formData,
                      handleInputChange,
                      handleSubmit,
                  }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    {currentProduct ? "Modifier le produit" : "Ajouter un produit"}
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
                    <Button bg={'black'}
                            color={'white'}
                            mr={3}
                            _hover={{
                                transform: "scale(1.05)",
                                boxShadow: "lg",
                            }}
                            onClick={handleSubmit}>
                        {currentProduct ? "Modifier" : "Ajouter"}
                    </Button>
                    <Button onClick={onClose}>Annuler</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default ModalObj;
