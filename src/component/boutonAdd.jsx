import {Button} from "@chakra-ui/react";
import {AddIcon} from "@chakra-ui/icons";
import React from "react";

function BoutonAdd({ onAdd }){

    return (
        <Button
            leftIcon={<AddIcon />}
            background="black"
            color="white"
            border="none"
            onClick={onAdd}
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
    );
}

export default BoutonAdd;