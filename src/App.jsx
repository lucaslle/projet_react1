import * as React from 'react'
import {ChakraProvider, Box, Text} from '@chakra-ui/react';
import Sidebar from './component/sidebar';
import theme from './theme';

function App() {
    return (
        <ChakraProvider theme={theme}>
            <Box>
                <Sidebar />
            </Box>
        </ChakraProvider>
    )
}

export default App;
