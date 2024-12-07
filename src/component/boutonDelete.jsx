import { DeleteIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import React from "react";

function BoutonDelete({ onDelete }) {
    return (
        <IconButton
            mr={2}
            aria-label="Delete"
            icon={<DeleteIcon />}
            onClick={onDelete}
            background="black"
            color="white"
            _hover={{
                transform: "scale(1.05)",
                boxShadow: "lg",
            }}
            size="md"
            borderRadius="md"
        />
    );
}

export default BoutonDelete;