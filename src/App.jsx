import * as React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import theme from './theme';
import { AppShell } from './layout/appShell';
import { ProductsProvider } from './layout/products';
import { SettingsProvider } from './layout/settings';
import { ToastProvider } from './layout/toasts';
import OverviewPage from './page/overview';
import SalesPage from './page/another';
import ProductManagementPage from './page/stock';
import ProductPage from './page/product';
import OrdersPage from './page/orders';
import SettingsPage from './page/settings';
import NotFoundPage from './page/notFound';

function App() {
    return (
        <ChakraProvider theme={theme}>
            <SettingsProvider>
                <ToastProvider>
                    <ProductsProvider>
                        <Router>
                            <AppShell>
                                <Routes>
                                    <Route path="/" element={<OverviewPage />} />
                                    <Route path="/ventes" element={<SalesPage />} />
                                    <Route path="/another" element={<Navigate to="/ventes" replace />} />
                                    <Route path="/stock" element={<ProductManagementPage />} />
                                    <Route path="/stock/:id" element={<ProductPage />} />
                                    <Route path="/commandes" element={<OrdersPage />} />
                                    <Route path="/parametres" element={<SettingsPage />} />
                                    <Route path="*" element={<NotFoundPage />} />
                                </Routes>
                            </AppShell>
                        </Router>
                    </ProductsProvider>
                </ToastProvider>
            </SettingsProvider>
        </ChakraProvider>
    );
}

export default App;
