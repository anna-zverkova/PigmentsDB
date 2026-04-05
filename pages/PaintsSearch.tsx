import React, { useState, useEffect } from 'react';
import { PAINTS, BRANDS, PIGMENT_FAMILIES, PIGMENTS } from '../constants';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Link } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search } from 'lucide-react';

export const PaintsSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFamilies, setSelectedFamilies] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedMixes, setSelectedMixes] = useState<string[]>([]);
  const [discontinuedOnly, setDiscontinuedOnly] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const selectedBrandIds = new Set(selectedBrands);
  const pigmentFamilyByCode = new Map(PIGMENTS.map(p => [p.code, p.family]));
  const mixLabel = (paint: any) => paint.pigmentMix || (paint.pigmentCodes.length <= 1 ? 'Single' : 'Multi');
  
  // Basic filtering logic mocking Algolia
  const visiblePaints = PAINTS.filter(paint => {
      const matchesSearch = paint.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            paint.pigmentCodes.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesFamily =
        selectedFamilies.length === 0 ||
        paint.pigmentCodes.some(code => {
          const family = pigmentFamilyByCode.get(code);
          return family ? selectedFamilies.includes(family) : false;
        });

      const matchesBrand =
        selectedBrands.length === 0 ||
        selectedBrandIds.has(paint.brandId);

      const matchesMix =
        selectedMixes.length === 0 ||
        selectedMixes.includes(mixLabel(paint));

      const matchesDiscontinued =
        !discontinuedOnly || !!paint.isDiscontinued;

      return matchesSearch && matchesFamily && matchesBrand && matchesMix && matchesDiscontinued;
  });

  return (
    <div className="min-h-screen bg-neutral-50">
        <div className="sticky top-16 z-20 bg-white border-b border-neutral-200 px-4 py-4 shadow-sm">
            <div className="container mx-auto flex gap-4 items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                    <input 
                        type="text" 
                        placeholder="Search paints by name or pigment code..." 
                        className="w-full h-11 pl-10 pr-4 rounded-lg border border-neutral-300 focus:border-neutral-500 outline-none text-base"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    className="md:hidden p-2 border border-neutral-300 rounded-lg"
                    onClick={() => setMobileFiltersOpen(true)}
                    aria-label="Open filters"
                >
                    <SlidersHorizontal size={20} />
                </button>
            </div>
        </div>

        {/* Mobile Filters Drawer */}
        {mobileFiltersOpen && (
            <div className="fixed inset-0 z-40 md:hidden">
                <div
                    className="absolute inset-0 bg-black/40"
                    onClick={() => setMobileFiltersOpen(false)}
                />
                <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-xl p-5 overflow-y-auto">
                    <div className="flex items-center justify-between mb-4">
                        <div className="font-semibold">Filters</div>
                        <button
                            className="text-sm text-neutral-600"
                            onClick={() => setMobileFiltersOpen(false)}
                        >
                            Close
                        </button>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <Filter size={16} /> Brand
                            </h3>
                            <div className="space-y-2">
                                {BRANDS.filter(b => PAINTS.some(p => p.brandId === b.id)).map(brand => (
                                    <label key={brand.id} className="flex items-center gap-2 text-sm cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                                            checked={selectedBrands.includes(brand.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) setSelectedBrands([...selectedBrands, brand.id]);
                                                else setSelectedBrands(selectedBrands.filter(b => b !== brand.id));
                                            }}
                                        />
                                        <span className="text-neutral-600 group-hover:text-neutral-900">{brand.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-3">Color Family</h3>
                            <div className="space-y-2">
                                {PIGMENT_FAMILIES.map(fam => (
                                    <label key={fam.name} className="flex items-center gap-2 text-sm cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                                            checked={selectedFamilies.includes(fam.name)}
                                            onChange={(e) => {
                                                if (e.target.checked) setSelectedFamilies([...selectedFamilies, fam.name]);
                                                else setSelectedFamilies(selectedFamilies.filter(f => f !== fam.name));
                                            }}
                                        />
                                        <div className={`w-3 h-3 rounded-full ${fam.color}`}></div>
                                        <span className="text-neutral-600 group-hover:text-neutral-900">{fam.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-3">Pigment Mix</h3>
                            <div className="space-y-2">
                                {['Single', 'Multi'].map(mix => (
                                    <label key={mix} className="flex items-center gap-2 text-sm cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                                            checked={selectedMixes.includes(mix)}
                                            onChange={(e) => {
                                                if (e.target.checked) setSelectedMixes([...selectedMixes, mix]);
                                                else setSelectedMixes(selectedMixes.filter(m => m !== mix));
                                            }}
                                        />
                                        <span className="text-neutral-600 group-hover:text-neutral-900">{mix}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-3">Discontinued</h3>
                            <label className="flex items-center gap-2 text-sm cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                                    checked={discontinuedOnly}
                                    onChange={(e) => setDiscontinuedOnly(e.target.checked)}
                                />
                                <span className="text-neutral-600 group-hover:text-neutral-900">Discontinued only</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        )}

        <div className="container mx-auto px-4 py-8 flex items-start gap-8">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden md:block w-64 shrink-0 space-y-8">
                <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Filter size={16} /> Brand
                    </h3>
                    <div className="space-y-2">
                        {BRANDS.filter(b => PAINTS.some(p => p.brandId === b.id)).map(brand => (
                            <label key={brand.id} className="flex items-center gap-2 text-sm cursor-pointer group">
                                <input 
                                    type="checkbox" 
                                    className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                                    checked={selectedBrands.includes(brand.id)}
                                    onChange={(e) => {
                                        if (e.target.checked) setSelectedBrands([...selectedBrands, brand.id]);
                                        else setSelectedBrands(selectedBrands.filter(b => b !== brand.id));
                                    }}
                                />
                                <span className="text-neutral-600 group-hover:text-neutral-900">{brand.name}</span>
                            </label>
                        ))}
                    </div>
                </div>

                 <div>
                    <h3 className="font-semibold mb-3">Color Family</h3>
                    <div className="space-y-2">
                        {PIGMENT_FAMILIES.map(fam => (
                            <label key={fam.name} className="flex items-center gap-2 text-sm cursor-pointer group">
                                <input 
                                    type="checkbox" 
                                    className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                                    checked={selectedFamilies.includes(fam.name)}
                                    onChange={(e) => {
                                        if (e.target.checked) setSelectedFamilies([...selectedFamilies, fam.name]);
                                        else setSelectedFamilies(selectedFamilies.filter(f => f !== fam.name));
                                    }}
                                />
                                <div className={`w-3 h-3 rounded-full ${fam.color}`}></div>
                                <span className="text-neutral-600 group-hover:text-neutral-900">{fam.name}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold mb-3">Pigment Mix</h3>
                    <div className="space-y-2">
                        {['Single', 'Multi'].map(mix => (
                            <label key={mix} className="flex items-center gap-2 text-sm cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                                    checked={selectedMixes.includes(mix)}
                                    onChange={(e) => {
                                        if (e.target.checked) setSelectedMixes([...selectedMixes, mix]);
                                        else setSelectedMixes(selectedMixes.filter(m => m !== mix));
                                    }}
                                />
                                <span className="text-neutral-600 group-hover:text-neutral-900">{mix}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold mb-3">Discontinued</h3>
                    <label className="flex items-center gap-2 text-sm cursor-pointer group">
                        <input
                            type="checkbox"
                            className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                            checked={discontinuedOnly}
                            onChange={(e) => setDiscontinuedOnly(e.target.checked)}
                        />
                        <span className="text-neutral-600 group-hover:text-neutral-900">Discontinued only</span>
                    </label>
                </div>
            </aside>

            {/* Results Grid */}
            <div className="flex-1">
                <div className="mb-4 text-sm text-neutral-500">
                    Showing {visiblePaints.length} results
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {visiblePaints.map(paint => {
                        const brand = BRANDS.find(b => b.id === paint.brandId);
                        return (
                            <Link key={paint.id} to={`/paints/${paint.id}`} className="group block h-full">
                                <Card className="h-full overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                                    <div className="aspect-square w-full relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                        {paint.swatchImage ? (
                                            <img
                                                src={paint.swatchImage}
                                                alt={`${paint.name} swatch`}
                                                className="absolute inset-0 w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="absolute inset-0" style={{ backgroundColor: paint.hex }} />
                                        )}
                                        {paint.isDiscontinued && (
                                            <div className="absolute top-2 left-2 bg-red-100 text-red-700 text-[10px] font-medium px-2 py-0.5 rounded-full border border-red-200">
                                                Discontinued
                                            </div>
                                        )}
                                        <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)]"></div>
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col">
                                        <div className="text-xs text-neutral-500 mb-1">{brand?.name}</div>
                                        <h3 className="font-medium text-neutral-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                                            {paint.name}
                                        </h3>
                                        <div className="text-xs text-neutral-500 mb-2">{paint.hue || '—'}</div>
                                        <div className="mt-auto flex flex-wrap gap-1">
                                            {paint.pigmentCodes.map(code => (
                                                <Badge key={code} variant="secondary" className="text-[10px] px-1.5 py-0">
                                                    {code}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    </div>
  );
};
