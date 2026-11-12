import React from "react";
import { CrBox, CrCheckbox, CrSelect } from "@cristal/react";

export const PRICE_RANGES = {
    all: () => true,
    low: (price) => price < 10,
    mid: (price) => price >= 10 && price <= 50,
    high: (price) => price > 50,
};

export const MENU_ANIMATIONS = {
    "anchor-pop": "Anchor Pop",
    "turn-over": "Turn Over",
    "card-deal": "Card Deal",
    "drum-roll": "Drum Roll",
    "outline-trace": "Outline Trace",
    "tile-build": "Tile Build",
    fade: "Fondu",
};

function StockFilters({ inStockOnly, onInStockChange, priceRange, onPriceRangeChange, menuAnimation, onMenuAnimationChange }) {
    return (
        <CrBox display="flex" align="flex-end" gap="xl" wrap style={{ marginBottom: 'var(--cr-spacing-xl)' }}>
            <CrSelect
                label="Prix"
                value={priceRange}
                onCrChange={(event) => onPriceRangeChange(event.detail)}
                animation={menuAnimation}
                style={{ width: 240 }}
            >
                <option value="all">Tous les prix</option>
                <option value="low">Moins de 10 €</option>
                <option value="mid">De 10 à 50 €</option>
                <option value="high">Plus de 50 €</option>
            </CrSelect>
            <CrSelect
                label="Animation des menus"
                value={menuAnimation}
                onCrChange={(event) => onMenuAnimationChange(event.detail)}
                animation={menuAnimation}
                style={{ width: 240 }}
            >
                {Object.entries(MENU_ANIMATIONS).map(([value, name]) => (
                    <option key={value} value={value}>{name}</option>
                ))}
            </CrSelect>
            <CrCheckbox
                label="En stock uniquement"
                checked={inStockOnly}
                onCrChange={(event) => onInStockChange(event.detail)}
            />
        </CrBox>
    );
}

export default StockFilters;
