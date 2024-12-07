import {ViewIcon} from "@chakra-ui/icons";
import {IconButton} from "@chakra-ui/react";
import React from "react";

function BoutonView({ onView }){

    return (
        <IconButton
            aria-label="View"
            icon={<ViewIcon />}
            // onClick={}
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

export default BoutonView;