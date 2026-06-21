import React from 'react';
import { useComparison } from '../App';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import { PAINT_BY_ID } from '../constants';
import { X, ArrowRight, Palette } from 'lucide-react';

export const ComparisonBar: React.FC = () => {
  const { selectedPaintIds, removePaint, clearSelection } = useComparison();
  const location = useLocation();
  const navigate = useNavigate();

  if (selectedPaintIds.length === 0) return null;

  const selectedPaints = selectedPaintIds
    .map((id) => PAINT_BY_ID.get(id))
    .filter((paint): paint is NonNullable<typeof paint> => Boolean(paint));

  const syncRoute = (ids: string[]) => {
    if (location.pathname !== '/compare' && location.pathname !== '/palette-builder') {
      return;
    }

    const search = ids.length > 0 ? `?ids=${ids.join(',')}` : '';
    navigate(`${location.pathname}${search}`, { replace: true });
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
      <div className="bg-white border border-neutral-200 shadow-xl rounded-2xl p-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {selectedPaints.map(paint => (
            <div key={paint.id} className="flex items-center gap-2 bg-neutral-100 pl-2 pr-1 py-1 rounded-full whitespace-nowrap">
              <div
                className="w-4 h-4 rounded-full border border-neutral-200"
                style={
                  paint.swatchImage
                    ? { backgroundImage: `url(${paint.swatchImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                    : { backgroundColor: paint.hex }
                }
              />
              <span className="text-xs font-medium text-neutral-700">{paint.name}</span>
              <button 
                onClick={() => {
                  const nextIds = selectedPaintIds.filter((id) => id !== paint.id);
                  removePaint(paint.id);
                  syncRoute(nextIds);
                }}
                className="hover:bg-neutral-200 p-0.5 rounded-full"
              >
                <X size={14} className="text-neutral-500" />
              </button>
            </div>
          ))}
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                clearSelection();
                syncRoute([]);
              }}
            >
                Clear
            </Button>
            <Link to={`/palette-builder?ids=${selectedPaintIds.join(',')}`}>
                <Button variant="outline" size="sm" className="gap-2">
                  <Palette size={16} />
                  Palette
                </Button>
            </Link>
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
