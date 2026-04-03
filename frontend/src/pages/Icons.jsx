import React from 'react';

// Shared, minimal SVG icon components for the HackAuraa dashboards.
// Each icon accepts optional size (default 20) and className props.

const d = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
const wrap = (size, className, children, vb = '0 0 24 24') => (
    <svg width={size} height={size} viewBox={vb} className={className} style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>{children}</svg>
);

// ── General ──
export const IconCart = ({ size = 20, className }) => wrap(size, className, (
    <>
        <circle cx="9" cy="21" r="1" {...d} />
        <circle cx="20" cy="21" r="1" {...d} />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" {...d} />
    </>
));

export const IconSearch = ({ size = 20, className }) => wrap(size, className, (
    <>
        <circle cx="11" cy="11" r="8" {...d} />
        <line x1="21" y1="21" x2="16.65" y2="16.65" {...d} />
    </>
));

export const IconHeart = ({ size = 20, className }) => wrap(size, className, (
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" {...d} />
));

export const IconTag = ({ size = 20, className }) => wrap(size, className, (
    <>
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" {...d} />
        <line x1="7" y1="7" x2="7.01" y2="7" {...d} />
    </>
));

export const IconWheat = ({ size = 20, className }) => wrap(size, className, (
    <>
        <path d="M2 22 16 8" {...d} />
        <path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" {...d} />
        <path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" {...d} />
        <path d="M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" {...d} />
        <path d="M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z" {...d} />
        <path d="M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z" {...d} />
        <path d="M15.47 13.47 17 15l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z" {...d} />
        <path d="M19.47 9.47 21 11l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L13 11l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z" {...d} />
    </>
));

export const IconLeaf = ({ size = 20, className }) => wrap(size, className, (
    <>
        <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 20 2 20 2s-1.8 4-3.4 8.5" {...d} />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" {...d} />
    </>
));

export const IconSprout = ({ size = 20, className }) => wrap(size, className, (
    <>
        <path d="M7 20h10" {...d} />
        <path d="M10 20c5.5-2.5.8-6.4 3-10" {...d} />
        <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" {...d} />
        <path d="M14.5 9.4c-1.1.8-1.8 2.2-2.3 3.7 2 .4 3.5.4 4.8-.3 1.2-.6 2.3-1.9 3-4.2-2.8-.5-4.4 0-5.5.8z" {...d} />
    </>
));

// ── Farmer-specific ──
export const IconPackage = ({ size = 20, className }) => wrap(size, className, (
    <>
        <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" {...d} />
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" {...d} />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" {...d} />
        <line x1="12" y1="22.08" x2="12" y2="12" {...d} />
    </>
));

export const IconTrendingUp = ({ size = 20, className }) => wrap(size, className, (
    <>
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" {...d} />
        <polyline points="17 6 23 6 23 12" {...d} />
    </>
));

export const IconCalendar = ({ size = 20, className }) => wrap(size, className, (
    <>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" {...d} />
        <line x1="16" y1="2" x2="16" y2="6" {...d} />
        <line x1="8" y1="2" x2="8" y2="6" {...d} />
        <line x1="3" y1="10" x2="21" y2="10" {...d} />
    </>
));

export const IconUser = ({ size = 20, className }) => wrap(size, className, (
    <>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...d} />
        <circle cx="12" cy="7" r="4" {...d} />
    </>
));

export const IconEdit = ({ size = 20, className }) => wrap(size, className, (
    <>
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" {...d} />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" {...d} />
    </>
));

export const IconTrash = ({ size = 20, className }) => wrap(size, className, (
    <>
        <polyline points="3 6 5 6 21 6" {...d} />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" {...d} />
        <line x1="10" y1="11" x2="10" y2="17" {...d} />
        <line x1="14" y1="11" x2="14" y2="17" {...d} />
    </>
));

export const IconRocket = ({ size = 20, className }) => wrap(size, className, (
    <>
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" {...d} />
        <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" {...d} />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" {...d} />
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" {...d} />
    </>
));

export const IconPlus = ({ size = 20, className }) => wrap(size, className, (
    <>
        <line x1="12" y1="5" x2="12" y2="19" {...d} />
        <line x1="5" y1="12" x2="19" y2="12" {...d} />
    </>
));

export const IconX = ({ size = 20, className }) => wrap(size, className, (
    <>
        <line x1="18" y1="6" x2="6" y2="18" {...d} />
        <line x1="6" y1="6" x2="18" y2="18" {...d} />
    </>
));

// ── Payment ──
export const IconSmartphone = ({ size = 20, className }) => wrap(size, className, (
    <>
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" {...d} />
        <line x1="12" y1="18" x2="12.01" y2="18" {...d} />
    </>
));

export const IconBuilding = ({ size = 20, className }) => wrap(size, className, (
    <>
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2" {...d} />
        <path d="M9 22v-4h6v4" {...d} />
        <line x1="8" y1="6" x2="8.01" y2="6" {...d} />
        <line x1="16" y1="6" x2="16.01" y2="6" {...d} />
        <line x1="12" y1="6" x2="12.01" y2="6" {...d} />
        <line x1="8" y1="10" x2="8.01" y2="10" {...d} />
        <line x1="16" y1="10" x2="16.01" y2="10" {...d} />
        <line x1="12" y1="10" x2="12.01" y2="10" {...d} />
        <line x1="8" y1="14" x2="8.01" y2="14" {...d} />
        <line x1="16" y1="14" x2="16.01" y2="14" {...d} />
        <line x1="12" y1="14" x2="12.01" y2="14" {...d} />
    </>
));

export const IconBanknote = ({ size = 20, className }) => wrap(size, className, (
    <>
        <rect x="2" y="6" width="20" height="12" rx="2" {...d} />
        <circle cx="12" cy="12" r="2" {...d} />
        <path d="M6 12h.01M18 12h.01" {...d} />
    </>
));

export const IconTruck = ({ size = 20, className }) => wrap(size, className, (
    <>
        <path d="M1 3h15v13H1z" {...d} />
        <path d="M16 8h4l3 3v5h-7V8z" {...d} />
        <circle cx="5.5" cy="18.5" r="2.5" {...d} />
        <circle cx="18.5" cy="18.5" r="2.5" {...d} />
    </>
));