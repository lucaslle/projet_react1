import React from 'react';
import { Box, VStack, Button, Icon } from '@chakra-ui/react';
import { FaTachometerAlt, FaBoxes, FaServicestack } from 'react-icons/fa';

function Sidebar() {
    return (
        <Box
            w="10%"
            h="100%"
            bg="rgba(0, 0, 0, 1)"
            color="white"
            p="5"
            position="fixed"
        >
            <VStack spacing="6" align="flex-start">
                <Box fontSize="3xl" fontWeight="bold">Menu</Box>
                <Button
                    as="a"
                    href="#Dashboard"
                    variant="ghost"
                    colorScheme="white"
                    leftIcon={<Icon as={FaTachometerAlt} />}
                    justifyContent="flex-start"
                    w="100%"
                >
                    Dashboard
                </Button>
                <Button
                    as="a"
                    href="#Stock"
                    variant="ghost"
                    colorScheme="white"
                    leftIcon={<Icon as={FaBoxes} />}
                    justifyContent="flex-start"
                    w="100%"
                >
                    Stock
                </Button>
                <Button
                    as="a"
                    href="#services"
                    variant="ghost"
                    colorScheme="white"
                    leftIcon={<Icon as={FaServicestack} />}
                    justifyContent="flex-start"
                    w="100%"
                >
                    Services
                </Button>
            </VStack>
        </Box>
    );
}

export default Sidebar;
