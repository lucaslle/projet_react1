import {EditIcon} from "@chakra-ui/icons";
import {IconButton} from "@chakra-ui/react";
import React from "react";

function BoutonEdit({ onEdit }){

    return (
            <IconButton
                aria-label="Edit"
                icon={<EditIcon />}
                mr={2}
                onClick={onEdit}
                background="black"
                color="white"
                _hover={{
                    transform: "scale(1.05)",
                    boxShadow: "lg",
                }}
                size="md" // change after
                borderRadius="md"
            />
        );
}

export default BoutonEdit;