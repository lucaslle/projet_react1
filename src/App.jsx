import * as React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './component/sidebar';
import ProductManagementPage from './page/stock';
import theme from './theme';
import AnotherPage from "./page/another";

function App() {
    return (
        <ChakraProvider theme={theme}>
            <Router>

                <Sidebar />
                <div style={{ width: '100%' }}>
                    <Routes>
                        <Route path="/stock" element={<ProductManagementPage />} />
                        <Route path="/another" element={<AnotherPage/>} />
                    </Routes>
                </div>
            </Router>
        </ChakraProvider>
    );
}

export default App;
