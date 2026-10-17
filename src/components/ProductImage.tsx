'use client';

import React from 'react';
import { Category } from '@/types/inventory';

interface ProductImageProps {
  category: Category;
  name: string;
  className?: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({ category, name, className = "h-11 w-11" }) => {
  const isBotox = category === 'Bo-tox' || name.toLowerCase().includes('botox');
  const isKeratin = category === 'Keratin' || name.toLowerCase().includes('keratin');
  const isSerum = category === 'Hair Care & Serums' || name.toLowerCase().includes('serum') || name.toLowerCase().includes('argan');
  const isBlonder = category === 'Smoothing & Blonder' || name.toLowerCase().includes('blonder');

  if (isBotox) {
    // Black Matte Pump Bottle (Botox Series)
    return (
      <div className={`${className} rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center p-1 shadow-sm shrink-0`}>
        <svg viewBox="0 0 40 50" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Pump Top */}
          <rect x="18" y="4" width="4" height="6" fill="#475569" />
          <path d="M12 7 H22 V10 H12 Z" fill="#334155" />
          {/* Bottle Neck */}
          <rect x="16" y="10" width="8" height="5" fill="#1e293b" />
          {/* Bottle Body */}
          <rect x="10" y="15" width="20" height="30" rx="3" fill="#0f172a" stroke="#334155" strokeWidth="1" />
          {/* Gold HBTX Label Accent */}
          <rect x="12" y="24" width="16" height="12" rx="1" fill="#e59d1a" fillOpacity="0.2" stroke="#e59d1a" strokeWidth="0.8" />
          <text x="20" y="32" textAnchor="middle" fill="#f59e0b" fontSize="5" fontWeight="bold" fontFamily="sans-serif">BOTOX</text>
        </svg>
      </div>
    );
  }

  if (isKeratin) {
    // White Bottle with Purple Label (Hi Pro Keratin Series)
    return (
      <div className={`${className} rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center p-1 shadow-sm shrink-0`}>
        <svg viewBox="0 0 40 50" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Pump Top */}
          <rect x="18" y="4" width="4" height="6" fill="#9333ea" />
          <path d="M12 7 H22 V10 H12 Z" fill="#7e22ce" />
          {/* Bottle Body */}
          <rect x="10" y="15" width="20" height="30" rx="3" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
          {/* Purple Label */}
          <rect x="12" y="22" width="16" height="15" rx="1" fill="#9333ea" />
          <text x="20" y="30" textAnchor="middle" fill="#ffffff" fontSize="4" fontWeight="bold" fontFamily="sans-serif">HI PRO</text>
          <text x="20" y="34" textAnchor="middle" fill="#e9d5ff" fontSize="3" fontWeight="bold" fontFamily="sans-serif">KERATIN</text>
        </svg>
      </div>
    );
  }

  if (isSerum) {
    // Golden Luxury Glass Bottle (Argan Oil Serum)
    return (
      <div className={`${className} rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center p-1 shadow-sm shrink-0`}>
        <svg viewBox="0 0 40 50" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Gold Dropper Cap */}
          <rect x="17" y="4" width="6" height="8" rx="1" fill="#d97706" />
          <rect x="15" y="12" width="10" height="3" fill="#b45309" />
          {/* Glass Bottle Body */}
          <rect x="12" y="15" width="16" height="28" rx="4" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.2" />
          {/* Golden Serum Liquid Level */}
          <rect x="13.5" y="22" width="13" height="19" rx="2" fill="#d97706" fillOpacity="0.4" />
          <text x="20" y="33" textAnchor="middle" fill="#78350f" fontSize="4" fontWeight="bold" fontFamily="sans-serif">ARGAN</text>
        </svg>
      </div>
    );
  }

  if (isBlonder) {
    // Light Blue Powder Tub (Blonder Lightener)
    return (
      <div className={`${className} rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center p-1 shadow-sm shrink-0`}>
        <svg viewBox="0 0 40 50" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Tub Lid */}
          <rect x="9" y="12" width="22" height="6" rx="2" fill="#0284c7" />
          {/* Tub Body */}
          <rect x="10" y="18" width="20" height="24" rx="2" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1.2" />
          {/* Blue Label */}
          <rect x="11.5" y="24" width="17" height="12" fill="#0369a1" />
          <text x="20" y="32" textAnchor="middle" fill="#ffffff" fontSize="4.5" fontWeight="bold" fontFamily="sans-serif">BLONDER</text>
        </svg>
      </div>
    );
  }

  // Default: White Shine Boost Bottle with Gold Cap (Nanoplastia Series)
  return (
    <div className={`${className} rounded-xl bg-amber-50/60 border border-amber-200 flex items-center justify-center p-1 shadow-sm shrink-0`}>
      <svg viewBox="0 0 40 50" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Gold Cap */}
        <rect x="16" y="5" width="8" height="8" rx="1" fill="#d97706" />
        {/* Bottle Body */}
        <rect x="10" y="13" width="20" height="32" rx="3" fill="#ffffff" stroke="#d97706" strokeWidth="1.2" />
        {/* HBTX Gold Label */}
        <text x="20" y="24" textAnchor="middle" fill="#b45309" fontSize="5" fontWeight="bold" fontFamily="sans-serif">HBTX</text>
        <rect x="12" y="27" width="16" height="12" rx="1" fill="#fef3c7" stroke="#f59e0b" strokeWidth="0.8" />
        <text x="20" y="34" textAnchor="middle" fill="#92400e" fontSize="3.5" fontWeight="bold" fontFamily="sans-serif">SHINE BOOST</text>
      </svg>
    </div>
  );
};
