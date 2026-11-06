import React, {useRef} from "react";
import {CrButton, CrDialog, CrInput} from "@cristal/react";

const fields = {display: 'flex', flexDirection: 'column', gap: 'var(--cr-spacing-lg)'};

function ModalObj({
                      isOpen,
                      onClose,
                      currentProduct,
                      formData,
                      handleInputChange,
                      handleSubmit,
                  }) {
    const form = useRef(null);

    return (
        <CrDialog
            label={currentProduct ? "Modifier le produit" : "Ajouter un produit"}
            open={isOpen}
            onCrClose={onClose}
        >
            <form
                ref={form}
                style={fields}
                onSubmit={(event) => {
                    event.preventDefault();
                    handleSubmit();
                }}
            >
                <CrInput label="Nom" name="name" value={formData.name} onCrInput={handleInputChange} required/>
                <CrInput label="Quantité" name="quantity" type="number" value={String(formData.quantity)}
                         onCrInput={handleInputChange}/>
                <CrInput label="Prix" name="price" type="number" hint="En euros"
                         value={String(formData.price)} onCrInput={handleInputChange}/>
            </form>
            <CrButton slot="footer" variant="secondary" onClick={onClose}>Annuler</CrButton>
            <CrButton slot="footer" onClick={() => form.current.requestSubmit()}>
                {currentProduct ? "Modifier" : "Ajouter"}
            </CrButton>
        </CrDialog>
    );
}

export default ModalObj;
