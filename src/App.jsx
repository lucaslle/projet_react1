import * as React from 'react'
import {ChakraProvider,} from '@chakra-ui/react';
import Sidebar from './component/sidebar';
import ProductManagementPage from './component/stock';
import theme from './theme';

function App() {
    return (
        <ChakraProvider theme={theme}>
                <Sidebar/>
            <ProductManagementPage/>
        </ChakraProvider>
    )
}

export default App;
