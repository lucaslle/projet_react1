import { ORDERS } from './fakeData';

const hash = (text) => [...text].reduce((total, char) => (total * 31 + char.charCodeAt(0)) >>> 0, 7);

/** Visuel du produit généré sur place (dégradé et initiale propres à chaque produit) : pas de dépendance réseau. */
export const imageOf = (product, width = 800, height = 600) => {
    const hue = hash(product.name) % 360;
    const initial = product.name.trim()[0]?.toUpperCase() ?? '?';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 800 600">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hue} 85% 62%)"/><stop offset="1" stop-color="hsl(${(hue + 70) % 360} 75% 38%)"/></linearGradient></defs>
<rect width="800" height="600" fill="url(#g)"/>
<circle cx="640" cy="120" r="220" fill="#fff" opacity=".14"/><circle cx="120" cy="520" r="260" fill="#000" opacity=".12"/>
<text x="400" y="380" text-anchor="middle" font-family="Sora, Inter, sans-serif" font-size="260" font-weight="800" fill="#fff" opacity=".92">${initial}</text></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

/** Note moyenne fictive, entre 3,5 et 5. */
export const ratingOf = (product) => 3.5 + (hash(product.name) % 4) / 2;

/** Commandes fictives qui correspondent au produit (même premier mot). */
export const ordersOfProduct = (product) => {
    const word = product.name.split(' ')[0].toLowerCase();
    return ORDERS.filter((order) => order.product.toLowerCase().startsWith(word));
};

/** Unités vendues par mois sur les 12 derniers mois, du plus ancien au plus récent. */
export const monthlyUnits = (orders) => {
    const now = new Date();
    return Array.from({ length: 12 }, (_, index) => {
        const month = new Date(now.getFullYear(), now.getMonth() - 11 + index, 1);
        return orders
            .filter((order) => order.date.getFullYear() === month.getFullYear() && order.date.getMonth() === month.getMonth())
            .reduce((total, order) => total + order.quantity, 0);
    });
};
