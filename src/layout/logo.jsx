import React from 'react';

export const Logo = ({ size = 28 }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
        <path d="M16 2 6 12l10 18z" fill="#8b5cf6" />
        <path d="M16 2l10 10-10 18z" fill="#d946ef" />
        <path d="M6 12h20L16 30z" fill="#22d3ee" opacity="0.5" />
        <path d="M11 7h10l5 5H6z" fill="#fff" opacity="0.4" />
    </svg>
);
