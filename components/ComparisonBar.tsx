import React from 'react';
import { useComparison } from '../App'; // We will define this hook in App.tsx
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';
import { PAINTS } from '../constants'; // Direct import for demo speed
import { X, ArrowRight } from 'lucide-react';

export const ComparisonBar: React.FC = () => {
  const { selectedPaintIds, removePaint, clearSelection } = useComparison();

  if (selectedPaintIds.length === 0) return null;

  const selectedPaints = PAINTS.filter(p => selectedPaintIds.includes(p.id));

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
      <div className="bg-white border border-neutral-200 shadow-xl rounded-2xl p-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {selectedPaints.map(paint => (
            <div key={paint.id} className="flex items-center gap-2 bg-neutral-100 pl-2 pr-1 py-1 rounded-full whitespace-nowrap">
              <div 
                className="w-4 h-4 rounded-full border border-neutral-200" 
                style={{ backgroundColor: paint.hex }}
              />
              <span className="text-xs font-medium text-neutral-700">{paint.name}</span>
              <button 
                onClick={() => removePaint(paint.id)}
                className="hover:bg-neutral-200 p-0.5 rounded-full"
              >
                <X size={14} className="text-neutral-500" />
              </button>
            </div>
          ))}
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
            <Button variant="ghost" size="sm" onClick={clearSelection}>
                Clear
            </Button>
            <Link to={`/compare?ids=${selectedPaintIds.join(',')}`}>
                <Button size="sm" className="gap-2">
                Compare <ArrowRight size={16} />
                </Button>
            </Link>
        </div>
      </div>
    </div>
  );
};
