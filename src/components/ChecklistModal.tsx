import React, { useState } from 'react';
import { CheckCircle2, ShieldCheck, Filter, Search } from 'lucide-react';
import { VERIFICATION_TESTS } from '../data/addonInfo';

export const ChecklistModal: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Rendering', 'Geometry', 'Combat', 'Compatibility', 'Packaging'];

  const filteredTests = VERIFICATION_TESTS.filter(test => {
    const matchCategory = filterCategory === 'All' || test.category === filterCategory;
    const matchSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        test.detail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-5 shadow-xl flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-neutral-800 gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-neutral-200 text-sm md:text-base">
            Official 20-Point Verification Checklist
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950 border border-emerald-500/40 text-emerald-400">
            20 / 20 PASSED (100%)
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 text-xs">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                filterCategory === cat 
                  ? 'bg-neutral-200 text-neutral-900 font-bold' 
                  : 'bg-neutral-800/80 text-neutral-400 hover:bg-neutral-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search test..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-red-500"
          />
        </div>
      </div>

      {/* Checklist Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
        {filteredTests.map(test => (
          <div
            key={test.id}
            className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/80 hover:border-neutral-700 transition-all flex items-start gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-bold text-neutral-200">
                  TEST {test.id}: {test.title}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 font-mono">
                  {test.category}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 mb-1.5 leading-relaxed">
                {test.detail}
              </p>
              <div className="text-[10px] font-mono text-emerald-400/90 bg-neutral-900 px-2 py-1 rounded border border-neutral-800">
                <span className="text-neutral-500">Proof: </span>
                {test.proof}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
