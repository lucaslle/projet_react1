import { API, useProducts } from './products';
import { useToast } from './toasts';

const send = async (url, method, body) => {
    const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: body && JSON.stringify(body) });
    if (!response.ok) throw new Error(`Erreur ${response.status} de l’API`);
};

/** Ajout, modification, suppression et réapprovisionnement, avec notification et rechargement des produits. */
export function useProductCrud() {
    const { refresh } = useProducts();
    const toast = useToast();

    const run = async (action, success) => {
        try {
            await action();
            await refresh();
            toast({ title: success, status: 'success' });
            return true;
        } catch (error) {
            toast({ title: 'L’opération a échoué', description: error.message, status: 'error' });
            return false;
        }
    };

    return {
        save: (data, current) =>
            current
                ? run(() => send(`${API}/${current.id}`, 'PUT', data), `« ${data.name} » mis à jour.`)
                : run(() => send(API, 'POST', data), `« ${data.name} » ajouté au catalogue.`),
        remove: (product) => run(() => send(`${API}/${product.id}`, 'DELETE'), `« ${product.name} » supprimé.`),
        reorder: (product, ordered) =>
            run(() => send(`${API}/${product.id}`, 'PUT', { name: product.name, price: product.price, quantity: product.quantity + ordered }), `${ordered} × « ${product.name} » commandés : stock mis à jour.`),
    };
}
