
import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import '@cristal/react/tokens.css';
import '@cristal/react/tokens-dark.css';
import './cristal-theme.css';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
);
