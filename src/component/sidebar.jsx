import React from 'react';
import {
    Box,
    VStack,
    Button,
    Icon,
    Text,
    Flex,
} from '@chakra-ui/react';
import { FaChartLine, FaBoxOpen, FaTools } from 'react-icons/fa';

function Sidebar() {
    return (
        <Box
            as="nav"
            w={{ base: "25%", md: "20%", lg: "15%" }}
            h="100vh"
            bg="black"
            color="white"
            p="5"
            position="fixed"
            boxShadow="md"
        >
            <Flex
                mb="8"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
            >
                <Text fontSize="4xl" >
                    Menu
                </Text>
            </Flex>

            <VStack spacing="8" align="stretch" >
                <Button
                    padding={8}
                    as="a"
                    href="/another"
                    variant="ghost"
                    color={"white"}
                    leftIcon={<Icon as={FaChartLine} />}
                    justifyContent="flex-start"
                    fontSize="2xl"
                    w="100%"
                    _hover={{
                        bg: "white",
                        transform: "scale(1.05)",
                        color:"black"
                    }}
                >
                    Dashboard
                </Button>

                <Button
                    as="a"
                    padding={8}
                    href="/stock"
                    variant="ghost"
                    color={"white"}
                    leftIcon={<Icon as={FaBoxOpen} />}
                    justifyContent="flex-start"
                    w="100%"
                    fontSize="2xl"
                    _hover={{
                        bg: "white",
                        color: "black",
                        transform: "scale(1.05)",
                    }}
                >
                    Stock
                </Button>

                <Button
                    as="a"
                    padding={8}
                    href="#services"
                    variant="ghost"
                    color=  "white"
                    leftIcon={<Icon as={FaTools} />}
                    justifyContent="flex-start"
                    w="100%"
                    fontSize="2xl"
                    _hover={{
                        bg: "white",
                        color:"black",
                        transform: "scale(1.05)",
                    }}
                >
                    Services
                </Button>
            </VStack>
        </Box>
    );
}

export default Sidebar;
