import React, { useState } from 'react';
import { Box, Input, InputGroup, InputLeftElement, Icon } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

function Header({ onSearch }) {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        onSearch(query);
    };

    return (
        <Box bg="black" p={4} boxShadow="lg" borderRadius="lg" marginBottom={10} >
            <InputGroup>
                <InputLeftElement pointerEvents="none">
                    <Icon as={SearchIcon} color="gray.500" />
                </InputLeftElement>
                <Input
                    placeholder="Rechercher un produit..."
                    value={searchQuery}
                    onChange={handleSearch}
                    bg="white"
                />
            </InputGroup>
        </Box>
    );
}

export default Header;
