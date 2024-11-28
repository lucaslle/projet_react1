import * as React from 'react'
import {ChakraProvider, Box, Text} from '@chakra-ui/react';
import Sidebar from './component/sidebar';

function App() {
    return (
        <ChakraProvider>
            <Box bg="blue.500">
                <Sidebar />
            </Box>
        </ChakraProvider>
    )
}

export default App;
