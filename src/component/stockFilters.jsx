import React from "react";
import { CrCheckbox, CrSelect } from "@cristal/react";

export const PRICE_RANGES = {
    all: () => true,
    low: (price) => price < 10,
    mid: (price) => price >= 10 && price <= 50,
    high: (price) => price > 50,
};

function StockFilters({ inStockOnly, onInStockChange, priceRange, onPriceRangeChange }) {
    return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--cr-spacing-xl)', marginBottom: 'var(--cr-spacing-xl)' }}>
            <CrSelect
                label="Prix"
                value={priceRange}
                onCrChange={(event) => onPriceRangeChange(event.detail)}
                style={{ width: 240 }}
            >
                <option value="all">Tous les prix</option>
                <option value="low">Moins de 10 €</option>
                <option value="mid">De 10 à 50 €</option>
                <option value="high">Plus de 50 €</option>
            </CrSelect>
            <CrCheckbox
                label="En stock uniquement"
                checked={inStockOnly}
                onCrChange={(event) => onInStockChange(event.detail)}
            />
        </div>
    );
}

export default StockFilters;
