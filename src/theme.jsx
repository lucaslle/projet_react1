import { extendTheme } from '@chakra-ui/react';

// Mêmes polices que le reste de l'application (Inter pour le texte, Sora pour les titres).
const theme = extendTheme({
    fonts: {
        body: 'Inter, system-ui, sans-serif',
        heading: 'Sora, Inter, system-ui, sans-serif',
    },
    // Suit le thème Cristal (clair ou sombre) au lieu des couleurs claires de Chakra.
    styles: { global: { body: { bg: 'var(--page)', color: 'var(--cr-color-text)' } } },
});

export default theme;
