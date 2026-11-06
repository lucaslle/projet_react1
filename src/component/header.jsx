import React from 'react';
import { Box } from '@chakra-ui/react';
import { CrInput } from '@cristal/react';

function Header({ onSearch }) {
    return (
        <Box bg="black" p={4} boxShadow="lg" borderRadius="lg" marginBottom={10} w={'100%'}>
            <CrInput
                className="search-field"
                label="Rechercher un produit"
                type="search"
                placeholder="Nom du produit..."
                onCrInput={(event) => onSearch(event.detail)}
            />
        </Box>
    );
}

export default Header;
