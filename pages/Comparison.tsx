import React, { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { BRAND_BY_ID, PAINT_BY_ID } from '../constants';
import { Button } from '../components/ui/Button';
import { X, Share2, Printer, Palette } from 'lucide-react';
import { useComparison } from '../App';
import { SwatchPreview } from '../components/SwatchPreview';

const parseIds = (search: string) => {
  const queryParams = new URLSearchParams(search);
  return queryParams.get('ids')?.split(',').map(id => id.trim()).filter(Boolean) || [];
};

const areSameIds = (left: string[], right: string[]) => (
  left.length === right.length && left.every((id, index) => id === right[index])
);

const buildSearch = (ids: string[]) => {
  if (ids.length === 0) return '';

  return `?ids=${ids.join(',')}`;
};

const buildShareUrl = (pathname: string, search: string) => `${window.location.href.split('#')[0]}#${pathname}${search}`;

export const Comparison: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedPaintIds, setSelection } = useComparison();
  const lastSyncedSearchRef = useRef<string | null>(null);
  const queryIds = useMemo(() => parseIds(location.search), [location.search]);
  const paintsToCompare = selectedPaintIds
    .map((id) => PAINT_BY_ID.get(id))
    .filter((paint): paint is NonNullable<typeof paint> => Boolean(paint));

  useLayoutEffect(() => {
    if (queryIds.length === 0) {
      if (lastSyncedSearchRef.current === null) {
        lastSyncedSearchRef.current = location.search;
      }
      return;
    }

    if (location.search === lastSyncedSearchRef.current) return;

    const sanitizedQueryIds = queryIds.filter((id) => PAINT_BY_ID.has(id));

    if (!areSameIds(selectedPaintIds, sanitizedQueryIds)) {
      setSelection(sanitizedQueryIds);
    }

    lastSyncedSearchRef.current = location.search;
  }, [queryIds, selectedPaintIds, setSelection]);

  useEffect(() => {
    const nextSearch = buildSearch(selectedPaintIds);
    if (location.search === nextSearch) return;

    lastSyncedSearchRef.current = nextSearch;
    navigate({ pathname: location.pathname, search: nextSearch }, { replace: true });
  }, [location.pathname, location.search, navigate, selectedPaintIds]);

  const handleShare = async () => {
    const shareUrl = buildShareUrl(location.pathname, buildSearch(selectedPaintIds));

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        return;
      }
    } catch {
      // Fall through to the prompt fallback below.
    }

    try {
      window.prompt('Copy this comparison link', shareUrl);
    } catch {
      // No-op if the environment blocks prompts.
    }
  };

  if (paintsToCompare.length === 0) {
      return (
          <div className="container mx-auto px-4 py-20 text-center">
              <h1 className="text-2xl font-bold mb-4">No paints selected</h1>
              <p className="text-neutral-500 mb-8">Go back to the paints or pigments page to add items to your comparison basket.</p>
              <Link to="/paints"><Button>Browse Paints</Button></Link>
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
        <div className="bg-white border-b border-neutral-200 py-8">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Compare Paints</h1>
                    <p className="text-neutral-500 text-sm mt-1">Comparing {paintsToCompare.length} items side-by-side</p>
                </div>
                <div className="flex gap-2">
                    <Link to={`/palette-builder${buildSearch(selectedPaintIds)}`}>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Palette size={16}/>
                          Palette Builder
                        </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="gap-2" onClick={handleShare}><Share2 size={16}/> Share</Button>
                    <Button variant="outline" size="sm" className="gap-2"><Printer size={16}/> Print</Button>
                </div>
            </div>
        </div>

        <div className="container mx-auto px-4 py-8 overflow-x-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 min-w-[800px]">
                {/* Column for each paint */}
                {paintsToCompare.map(paint => {
                    const brand = BRAND_BY_ID.get(paint.brandId);
                    const handleRemove = () => {
                      const nextIds = selectedPaintIds.filter((id) => id !== paint.id);
                      setSelection(nextIds);
                      navigate(`/compare${buildSearch(nextIds)}`, { replace: true });
                    };
                    
                    return (
                        <div key={paint.id} className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
                            {/* Header */}
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <SwatchPreview
                                    src={paint.swatchImage}
                                    alt={`${paint.name} swatch`}
                                    variant="card"
                                    className="absolute inset-0 w-full h-full object-cover"
                                    labelClassName="block text-[9px] leading-none"
                                />
                                <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.1)]"></div>
                                <button 
                                    onClick={handleRemove}
                                    className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full text-neutral-500 hover:text-red-500 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                            
                            <div className="p-5 border-b border-neutral-100">
                                <div className="text-sm font-medium text-neutral-500 mb-1">{brand?.name}</div>
                                <h2 className="text-lg font-bold text-neutral-900 leading-tight mb-2">{paint.name}</h2>
                                <Link to={`/paints/${paint.id}`} className="text-sm text-blue-600 hover:underline">View details</Link>
                            </div>

                            {/* Attributes Grid */}
                            <div className="divide-y divide-neutral-100 text-sm">
                                <div className="p-4 grid grid-cols-2 gap-2">
                                    <span className="text-neutral-500">Pigments</span>
                                    <div className="flex flex-wrap gap-1 justify-end text-right">
                                        {paint.pigmentCodes.map(code => (
                                            <span key={code} className="font-mono bg-neutral-100 px-1.5 rounded text-xs">{code}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-4 grid grid-cols-2 gap-2">
                                    <span className="text-neutral-500">Transparency</span>
                                    <span className="text-right font-medium">{paint.transparency}</span>
                                </div>
                                <div className="p-4 grid grid-cols-2 gap-2">
                                    <span className="text-neutral-500">Staining</span>
                                    <span className="text-right font-medium">{paint.staining}</span>
                                </div>
                                <div className="p-4 grid grid-cols-2 gap-2">
                                    <span className="text-neutral-500">Granulation</span>
                                    <span className="text-right font-medium">{paint.granulation}</span>
                                </div>
                                <div className="p-4 grid grid-cols-2 gap-2">
                                    <span className="text-neutral-500">Lightfastness</span>
                                    <span className="text-right font-medium">{paint.lightfastness}</span>
                                </div>
                                <div className="p-4 grid grid-cols-2 gap-2">
                                    <span className="text-neutral-500">Vegan</span>
                                    <span className="text-right font-medium">{paint.isVegan ? 'Yes' : 'No'}</span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    </div>
  );
};
