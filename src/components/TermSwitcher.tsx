'use client';

import React from 'react';
import { TermType } from '@/lib/types';
import { CalendarDays } from 'lucide-react';

interface TermSwitcherProps {
  currentTerm: TermType;
  onTermChange: (term: TermType) => void;
}

export default function TermSwitcher({ currentTerm, onTermChange }: TermSwitcherProps) {
  return (
    <div className="inline-flex p-1.5 bg-slate-200/80 rounded-2xl shadow-inner border border-slate-300/50">
      <button
        onClick={() => onTermChange('term1')}
        className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
          currentTerm === 'term1'
            ? 'bg-nantech-600 text-white shadow-md shadow-nantech-600/30'
            : 'text-slate-700 hover:text-nantech-700 hover:bg-white/50'
        }`}
      >
        <CalendarDays className="w-4 h-4" />
        <span>ภาคเรียนที่ 1</span>
      </button>
      <button
        onClick={() => onTermChange('term2')}
        className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
          currentTerm === 'term2'
            ? 'bg-nantech-600 text-white shadow-md shadow-nantech-600/30'
            : 'text-slate-700 hover:text-nantech-700 hover:bg-white/50'
        }`}
      >
        <CalendarDays className="w-4 h-4" />
        <span>ภาคเรียนที่ 2</span>
      </button>
    </div>
  );
}
