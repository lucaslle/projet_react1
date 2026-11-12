// Données fictives, toujours les mêmes d'un chargement à l'autre (générateur pseudo-aléatoire à graine fixe).
const random = (() => {
    let seed = 20261110;
    return () => {
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
})();

const pick = (list) => list[Math.floor(random() * list.length)];
const weighted = (entries) => {
    let roll = random() * entries.reduce((sum, [, weight]) => sum + weight, 0);
    return entries.find(([, weight]) => (roll -= weight) < 0)[0];
};

const CATALOG = [
    ['Clavier mécanique', 'Périphériques', 89], ['Souris sans fil', 'Périphériques', 35], ['Tapis XXL', 'Périphériques', 19],
    ['Webcam HD', 'Périphériques', 59], ['Micro USB', 'Audio', 79], ['Casque Bluetooth', 'Audio', 129],
    ['Écouteurs sport', 'Audio', 49], ['Enceinte portable', 'Audio', 69], ['Écran 24 pouces', 'Écrans', 159],
    ['Écran 27 pouces', 'Écrans', 229], ['Écran incurvé 34', 'Écrans', 449], ['Bras d\'écran', 'Écrans', 45],
    ['Câble USB-C', 'Câbles', 9], ['Hub USB 7 ports', 'Câbles', 29], ['Câble HDMI 2 m', 'Câbles', 12],
    ['Station d\'accueil', 'Câbles', 139], ['Disque SSD 1 To', 'Stockage', 89], ['Clé USB 128 Go', 'Stockage', 15],
    ['Disque externe 4 To', 'Stockage', 119], ['Carte microSD', 'Stockage', 22], ['Chaise ergonomique', 'Bureau', 299],
    ['Bureau assis-debout', 'Bureau', 399], ['Lampe LED', 'Bureau', 39], ['Repose-pieds', 'Bureau', 29],
].map(([name, category, price]) => ({ name, category, price }));

const FIRST = ['Camille', 'Léa', 'Hugo', 'Lucas', 'Emma', 'Nathan', 'Chloé', 'Louis', 'Inès', 'Jules', 'Manon', 'Adam', 'Sarah', 'Tom', 'Zoé', 'Noah', 'Jade', 'Théo', 'Alice', 'Raphaël'];
const LAST = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau', 'Simon', 'Laurent', 'Lefebvre', 'Michel', 'Garcia', 'Roux', 'Fournier', 'Girard'];
const CITIES = [['Paris', 30], ['Lyon', 12], ['Marseille', 11], ['Toulouse', 9], ['Bordeaux', 8], ['Lille', 8], ['Nantes', 7], ['Strasbourg', 6], ['Rennes', 5], ['Montpellier', 5], ['Nice', 4], ['Grenoble', 3]];
export const CHANNELS = ['Site web', 'Application', 'Magasin', 'Marketplace'];
const STATUSES = [['Payée', 60], ['Expédiée', 22], ['En attente', 11], ['Remboursée', 7]];

const DAY = 86400000;
const today = new Date();
today.setHours(12, 0, 0, 0);

const clients = Array.from({ length: 1500 }, () => `${pick(FIRST)} ${pick(LAST)}`);

/** 8 000 commandes sur les 2 dernières années (la période précédente existe aussi pour « 12 mois »), plus nombreuses en fin d'année et en semaine. */
export const ORDERS = Array.from({ length: 8000 }, (_, index) => {
    let date;
    do date = new Date(today - Math.floor(random() * 730) * DAY);
    while ((date.getDay() % 6 === 0 && random() < 0.35) || (date.getMonth() < 8 && random() < 0.2));
    const product = pick(CATALOG);
    const quantity = weighted([[1, 60], [2, 25], [3, 10], [5, 5]]);
    return {
        id: `CMD-${String(10001 + index)}`,
        date,
        client: pick(clients),
        city: weighted(CITIES),
        product: product.name,
        category: product.category,
        quantity,
        amount: Math.round(product.price * quantity * (0.9 + random() * 0.2) * 100) / 100,
        status: weighted(STATUSES),
        channel: weighted([['Site web', 45], ['Application', 25], ['Magasin', 20], ['Marketplace', 10]]),
    };
}).sort((a, b) => b.date - a.date);

export const PERIODS = { '7': '7 derniers jours', '30': '30 derniers jours', '90': '90 derniers jours', '365': '12 derniers mois' };

/** Commandes de la période, et celles de la période précédente de même durée (pour comparer). */
export const ordersOf = (days, channels) => {
    const start = today - days * DAY;
    const kept = ORDERS.filter((order) => channels.includes(order.channel));
    return {
        current: kept.filter((order) => order.date > start),
        previous: kept.filter((order) => order.date <= start && order.date > start - days * DAY),
    };
};

export const sum = (orders) => orders.filter((order) => order.status !== 'Remboursée').reduce((total, order) => total + order.amount, 0);

export const groupBy = (orders, key) => {
    const totals = new Map();
    orders.forEach((order) => order.status !== 'Remboursée' && totals.set(order[key], (totals.get(order[key]) ?? 0) + order.amount));
    return [...totals].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
};

/** Une valeur par jour (days ≤ 90) ou par mois, de la plus ancienne à la plus récente. */
export const series = (orders, days) => {
    const monthly = days > 90;
    const buckets = new Map();
    const steps = monthly ? 12 : days;
    for (let step = steps - 1; step >= 0; step--) {
        const date = monthly ? new Date(today.getFullYear(), today.getMonth() - step, 1) : new Date(today - step * DAY);
        buckets.set(monthly ? `${date.getFullYear()}-${date.getMonth()}` : date.toDateString(), { date, value: 0, count: 0 });
    }
    orders.forEach((order) => {
        const bucket = buckets.get(monthly ? `${order.date.getFullYear()}-${order.date.getMonth()}` : order.date.toDateString());
        if (!bucket) return;
        bucket.count += 1;
        if (order.status !== 'Remboursée') bucket.value += order.amount;
    });
    const format = monthly ? { month: 'short' } : { day: 'numeric', month: 'short' };
    return [...buckets.values()].map(({ date, value, count }) => ({ label: date.toLocaleDateString('fr-FR', format), value, count }));
};

/** Commandes encore en attente sur les 30 derniers jours (compteur du menu). */
export const pendingOrders = ordersOf(30, CHANNELS).current.filter((order) => order.status === 'En attente').length;
