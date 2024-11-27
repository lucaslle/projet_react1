import { Box, Button, Heading, Text } from '@chakra-ui/react';

function App() {
    return (
        <Box p={5}>
            <Heading as="h1" size="xl" mb={4}>
                Bienvenue dans Chakra UI !
            </Heading>
            <Text fontSize="lg" mb={4}>
                Chakra UI rend la création d'interfaces utilisateur très simple et agréable.
            </Text>
            <Button colorScheme="teal" size="md">
                Cliquez ici
            </Button>
        </Box>
    );
}

export default App;
