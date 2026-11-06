import {AddIcon} from "@chakra-ui/icons";
import {CrButton} from "@cristal/react";
import React from "react";

function BoutonAdd({ onAdd }){

    return (
        <CrButton size="l" onClick={onAdd}>
            <AddIcon slot="start" />
            Ajouter un produit
        </CrButton>
    );
}

export default BoutonAdd;
