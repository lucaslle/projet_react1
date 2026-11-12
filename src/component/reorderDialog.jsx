import React, { useState } from "react";
import { CrBox, CrButton, CrCardInput, CrDialog, CrInput, CrOtp, CrStep, CrStepper, CrTagInput, CrTextarea } from "@cristal/react";

const empty = { quantity: '10', note: '', notify: [], card: null, code: '' };

const cardComplete = (card) => card && card.number.length >= 13 && /^\d\d\/\d\d$/.test(card.expiry) && /^\d{3,4}$/.test(card.cvc);

/** Commande fournisseur en trois étapes ; à la fin, la quantité commandée s'ajoute au stock. */
function ReorderDialog({ product, onClose, onOrder }) {
    const [step, setStep] = useState(0);
    const [order, setOrder] = useState(empty);
    const [errors, setErrors] = useState({});
    const [sending, setSending] = useState(false);
    const set = (key) => (event) => {
        setOrder((current) => ({ ...current, [key]: event.detail }));
        setErrors((current) => ({ ...current, [key]: undefined }));
    };

    const close = () => {
        setStep(0);
        setOrder(empty);
        setErrors({});
        onClose();
    };

    const checks = [
        () => (Number(order.quantity) > 0 ? {} : { quantity: 'Saisissez une quantité supérieure à 0.' }),
        () => (cardComplete(order.card) ? {} : { card: 'Complétez le numéro, la date d\'expiration et le cryptogramme.' }),
        () => (order.code.length === 6 ? {} : { code: 'Saisissez les 6 chiffres du code.' }),
    ];

    const next = async () => {
        const found = checks[step]();
        setErrors(found);
        if (Object.keys(found).length) return;
        if (step < 2) return setStep(step + 1);
        setSending(true);
        await onOrder(product, Number(order.quantity));
        setSending(false);
        setStep(3);
    };

    return (
        <CrDialog label={product ? `Réapprovisionner « ${product.name} »` : 'Réapprovisionner'} open={Boolean(product)} onCrClose={close}>
            <CrStepper label="Commande fournisseur" variant="gauge" current={step}>
                <CrStep label="Commande">
                    <CrBox display="flex" direction="column" gap="lg">
                        <CrInput label="Quantité à commander" type="number" value={order.quantity} error={errors.quantity} onCrInput={set('quantity')} required />
                        <CrTextarea label="Note pour le fournisseur" hint="Facultatif" value={order.note} onCrInput={set('note')} />
                        <CrTagInput label="Prévenir à la livraison" hint="Adresses e-mail, validées avec Entrée" values={order.notify} onCrChange={set('notify')} />
                    </CrBox>
                </CrStep>
                <CrStep label="Paiement">
                    <CrCardInput label="Carte de paiement" variant="card" holder error={errors.card} onCrInput={set('card')} required />
                </CrStep>
                <CrStep label="Validation">
                    <CrOtp label="Code reçu par SMS" hint="Démonstration : n'importe quels 6 chiffres." error={errors.code} onCrInput={set('code')} onCrComplete={set('code')} />
                </CrStep>
            </CrStepper>
            {step === 3 && product && <p role="status">{order.quantity} unités commandées, ajoutées au stock de « {product.name} ».</p>}

            {step === 3 ? (
                <CrButton slot="footer" onClick={close}>Fermer</CrButton>
            ) : (
                <>
                    <CrButton slot="footer" variant="secondary" onClick={() => (step ? setStep(step - 1) : close())}>
                        {step ? 'Précédent' : 'Annuler'}
                    </CrButton>
                    <CrButton slot="footer" loading={sending} onClick={next}>
                        {step === 2 ? 'Commander' : 'Suivant'}
                    </CrButton>
                </>
            )}
        </CrDialog>
    );
}

export default ReorderDialog;
