import { extendTheme } from '@chakra-ui/react';

// Mêmes polices que le reste de l'application (Inter pour le texte, Sora pour les titres).
const theme = extendTheme({
    fonts: {
        body: 'Inter, system-ui, sans-serif',
        heading: 'Sora, Inter, system-ui, sans-serif',
    },
    styles: { global: { body: { bg: '#f6f4fb' } } },
});

export default theme;
