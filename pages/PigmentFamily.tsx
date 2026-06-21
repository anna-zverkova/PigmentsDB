import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PIGMENT_FAMILIES, PAINTS, PIGMENTS, BRANDS } from '../constants';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useComparison } from '../App';
import { Droplet, Sun, Layers, Grid } from 'lucide-react';
import { Paint, Pigment } from '../types';
import pigmentsContent from '../content/pigments.json';
import { SwatchPreview } from '../components/SwatchPreview';

type FilterKey = 'lightfastness' | 'transparency' | 'staining' | 'granulation';
type FilterState = Record<FilterKey, string>;

const filterMeta = {
  lightfastness: { label: 'Lightfastness', icon: Sun },
  transparency: { label: 'Transparency', icon: Layers },
  staining: { label: 'Staining', icon: Droplet },
  granulation: { label: 'Granulation', icon: Grid },
} as const;

const transparencyOptions = ['Opaque', 'Semi-Opaque', 'Semi-Transparent', 'Transparent'];
const granulationOptions = ['None', 'Low', 'Medium', 'High'];
const stainingOptions = ['Non', 'Low', 'Medium', 'High'];

const normalizeLightfastness = (value?: string) => value?.trim() || '';

const normalizeGranulation = (value?: string) => {
  const normalized = value?.trim().toLowerCase();
  if (!normalized || normalized === '-' || normalized === '—') return '';
  if (normalized === 'none') return 'None';
  if (normalized === 'low') return 'Low';
  if (normalized === 'medium') return 'Medium';
  if (normalized === 'high') return 'High';
  return value?.trim() || '';
};

const normalizeTransparency = (value?: string) => {
  const normalized = value?.trim();
  return normalized && transparencyOptions.includes(normalized) ? normalized : '';
};

const normalizeStaining = (value?: string) => {
  const normalized = value?.trim().toLowerCase();
  if (!normalized || normalized === '-' || normalized === '—') return '';
  if (normalized.startsWith('non')) return 'Non';
  if (normalized.startsWith('low')) return 'Low';
  if (normalized.startsWith('med') || normalized.startsWith('mid') || normalized === 'stain' || normalized === 'staining') return 'Medium';
  if (normalized.startsWith('high')) return 'High';
  return '';
};

const compareLightfastness = (a: string, b: string) => {
  const score = (value: string) => {
    const normalized = value.trim().toUpperCase();
    if (normalized === 'UNKNOWN') return -4;
    if (normalized === 'N/A') return -3;
    if (normalized === 'NAN') return -2;
    if (normalized === '—' || normalized === '-') return -1;

    const fraction = normalized.match(/^(\d+)(?:\/(\d+))?$/);
    if (fraction) {
      const numerator = Number(fraction[1]);
      const denominator = fraction[2] ? Number(fraction[2]) : numerator;
      if (Number.isFinite(numerator) && Number.isFinite(denominator) && denominator !== 0) {
        return numerator / denominator;
      }
    }

    return 0;
  };

  const scoreA = score(a);
  const scoreB = score(b);

  if (scoreA !== scoreB) return scoreB - scoreA;
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
};

const FilterButton: React.FC<{
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  value: string;
  active: boolean;
  onClick: () => void;
}> = ({ icon: Icon, label, value, active, onClick }) => (
  <Button
    type="button"
    variant={active ? 'secondary' : 'outline'}
    size="sm"
    onClick={onClick}
    className="w-full justify-start gap-3 px-4 py-3 text-left"
  >
    <Icon size={16} />
    <span className="flex min-w-0 flex-col items-start leading-tight">
      <span className="font-medium">{label}</span>
      <span className="truncate text-[11px] text-neutral-500">{value || 'All'}</span>
    </span>
  </Button>
);

const FilterChip: React.FC<{
  label: string;
  active: boolean;
  onClick: () => void;
}> = ({ label, active, onClick }) => (
  <Button
    type="button"
    variant={active ? 'primary' : 'outline'}
    size="sm"
    onClick={onClick}
    className={active ? 'border-transparent' : ''}
  >
    {label}
  </Button>
);

export const PigmentFamily: React.FC = () => {
  const { family } = useParams<{ family: string }>();
  const [filters, setFilters] = useState<FilterState>({
    lightfastness: '',
    transparency: '',
    staining: '',
    granulation: '',
  });
  const [activeFilter, setActiveFilter] = useState<FilterKey | null>(null);

  // Default to blue if no family provided or invalid
  const activeFamily = PIGMENT_FAMILIES.find(f => f.name.toLowerCase() === family?.toLowerCase()) || PIGMENT_FAMILIES[4];

  const pigmentsInFamily = [...PIGMENTS.filter(p => p.family === activeFamily.name)]
    .sort((a, b) => a.code.localeCompare(b.code));

  const familyPaints = useMemo(
    () => PAINTS.filter((paint) => pigmentsInFamily.some((pigment) => paint.pigmentCodes.includes(pigment.code))),
    [pigmentsInFamily]
  );

  const lightfastnessOptions = useMemo(() => {
    const values = [...new Set(
      familyPaints
        .map((paint) => normalizeLightfastness(paint.lightfastness))
        .filter(Boolean)
    )];

    return values.sort(compareLightfastness);
  }, [familyPaints]);

  const hasActiveFilters = Object.values(filters).some(Boolean);

  const matchesFilters = (paint: Paint) => {
    const lightfastness = normalizeLightfastness(paint.lightfastness);
    const transparency = normalizeTransparency(paint.transparency);
    const staining = normalizeStaining(paint.staining);
    const granulation = normalizeGranulation(paint.granulation);

    if (filters.lightfastness && lightfastness !== filters.lightfastness) return false;
    if (filters.transparency && transparency !== filters.transparency) return false;
    if (filters.staining && staining !== filters.staining) return false;
    if (filters.granulation && granulation !== filters.granulation) return false;

    return true;
  };

  const filterConfig = {
    lightfastness: {
      label: filterMeta.lightfastness.label,
      icon: filterMeta.lightfastness.icon,
      value: filters.lightfastness,
      options: lightfastnessOptions,
    },
    transparency: {
      label: filterMeta.transparency.label,
      icon: filterMeta.transparency.icon,
      value: filters.transparency,
      options: transparencyOptions,
    },
    staining: {
      label: filterMeta.staining.label,
      icon: filterMeta.staining.icon,
      value: filters.staining,
      options: stainingOptions,
    },
    granulation: {
      label: filterMeta.granulation.label,
      icon: filterMeta.granulation.icon,
      value: filters.granulation,
      options: granulationOptions,
    },
  } as const;

  const setFilter = (key: FilterKey, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      lightfastness: '',
      transparency: '',
      staining: '',
      granulation: '',
    });
    setActiveFilter(null);
  };

  // In a real app, we'd fetch paints by pigment code. Here we filter mock data.
  const getPaintsForPigment = (code: string) => PAINTS.filter(p => p.pigmentCodes.includes(code)).filter(matchesFilters);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Sticky Family Nav */}
      <div className="sticky top-16 z-30 bg-white border-b border-neutral-200 overflow-x-auto no-scrollbar">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 py-3">
            {PIGMENT_FAMILIES.map(fam => (
              <Link 
                key={fam.name} 
                to={`/pigments/${fam.name.toLowerCase()}`}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors shrink-0 ${
                  fam.name === activeFamily.name 
                    ? 'bg-neutral-900 text-white' 
                    : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${fam.color}`} />
                {fam.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1800px] mx-auto px-4 py-8">
        <div className="space-y-12">
            <div className="space-y-3">
                <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">{pigmentsContent.title}</h1>
                <p className="text-neutral-600 max-w-3xl">{pigmentsContent.intro}</p>
            </div>
            {/* Pigment quick links */}
            <div className="flex flex-wrap gap-2">
              {pigmentsInFamily.map(pigment => (
                <button
                  key={pigment.code}
                  type="button"
                  onClick={() => {
                    const el = document.getElementById(pigment.code);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  title={pigment.name}
                  className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-xs font-medium text-neutral-700 hover:border-neutral-300 hover:text-neutral-900"
                >
                  <span className="font-mono text-[11px] text-neutral-600">{pigment.code}</span>
                  <span className="sr-only">{pigment.name}</span>
                </button>
              ))}
            </div>
            <Card className="mb-8 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="grid w-full gap-2 md:grid-cols-2 xl:grid-cols-4">
                    {(Object.entries(filterConfig) as Array<[FilterKey, typeof filterConfig[FilterKey]]>).map(([key, config]) => (
                      <FilterButton
                        key={key}
                        icon={config.icon}
                        label={config.label}
                        value={config.value}
                        active={activeFilter === key || Boolean(config.value)}
                        onClick={() => setActiveFilter((current) => (current === key ? null : key))}
                      />
                    ))}
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    disabled={!hasActiveFilters}
                    className="shrink-0 text-neutral-600"
                  >
                    Clear filters
                  </Button>
                </div>

                {activeFilter && (
                  <div className="mt-4 border-t border-neutral-200 pt-4">
                    <div className="mb-3 flex items-center gap-2 text-sm font-medium text-neutral-700">
                      {React.createElement(filterConfig[activeFilter].icon, { size: 16 })}
                      <span>{filterConfig[activeFilter].label}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <FilterChip
                        label="All"
                        active={!filterConfig[activeFilter].value}
                        onClick={() => setFilter(activeFilter, '')}
                      />
                      {filterConfig[activeFilter].options.map((option) => (
                        <FilterChip
                          key={option}
                          label={option}
                          active={filterConfig[activeFilter].value === option}
                          onClick={() => setFilter(activeFilter, option)}
                        />
                      ))}
                    </div>
                    <p className="mt-3 text-xs text-neutral-500">
                      Showing paints that match the selected {filterConfig[activeFilter].label.toLowerCase()} filter.
                    </p>
                  </div>
                )}
            </Card>

            {pigmentsInFamily.map(pigment => (
                (() => {
                  const paints = getPaintsForPigment(pigment.code);
                  if (hasActiveFilters && paints.length === 0) return null;

                  return (
                <section key={pigment.code} id={pigment.code} className="scroll-mt-36">
                    <div className="flex items-baseline gap-4 mb-6 border-b border-neutral-200 pb-4">
                        <h2 className="text-3xl font-bold font-mono text-neutral-900">{pigment.code}</h2>
                        <h3 className="text-xl text-neutral-500 font-medium">{pigment.name}</h3>
                        {pigment.toxicity && <Badge variant="danger">{pigment.toxicity}</Badge>}
                    </div>
                    
                    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
                            <PaintTable paints={paints} />
                    </div>
                </section>
                  );
                })()
            ))}

            {hasActiveFilters && !pigmentsInFamily.some((pigment) => getPaintsForPigment(pigment.code).length > 0) && (
              <Card className="p-8 text-center text-neutral-500">
                No paints match the current filters.
              </Card>
            )}
        </div>
      </div>
    </div>
  );
};

const PaintTable: React.FC<{ paints: Paint[] }> = ({ paints }) => {
    const { selectedPaintIds, togglePaint } = useComparison();
    
    if (paints.length === 0) return <div className="p-8 text-center text-neutral-500">No paints found for this pigment in our database.</div>;

    const headers = [
      "Pigment(s)", "Swatch", "Pigment Mix", "Paint Name", "Brand", "Colour",
      "Paint Number", "Hue", "Series", "Light", "Staining Levels",
      "Granulation", "Transparency/Opacity", "Performance", "Toxicity",
      "Vegan", "Collection", "Action"
    ];

    const mixLabel = (paint: Paint) => paint.pigmentMix || (paint.pigmentCodes.length <= 1 ? 'Single' : 'Multi');
    const sortedPaints = [...paints].sort((a, b) => {
        const aMix = mixLabel(a);
        const bMix = mixLabel(b);
        if (aMix !== bMix) return aMix === 'Single' ? -1 : 1;
        return a.name.localeCompare(b.name);
    });

    return (
        <div className="overflow-x-auto pb-4">
            <table className="w-full text-left text-sm">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      {headers.map((h, i) => (
                        <th key={h} className={`px-4 py-3 font-medium text-neutral-500 whitespace-nowrap ${i === headers.length - 1 ? 'sticky right-0 bg-neutral-50 shadow-[inset_1px_0_0_rgba(0,0,0,0.05)]' : ''}`}>
                          {h}
                        </th>
                      ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                    {sortedPaints.map(paint => {
                         const brand = BRANDS.find(b => b.id === paint.brandId);
                         const isSelected = selectedPaintIds.includes(paint.id);

                        return (
                            <tr key={paint.id} className="group hover:bg-neutral-50/50 transition-colors">
                                <td className="px-4 py-3 text-neutral-600 whitespace-nowrap">{paint.pigmentCodes.join(', ')}</td>
                                <td className="px-4 py-3">
                                  <SwatchPreview
                                    src={paint.swatchImage}
                                    alt={`${paint.name} swatch`}
                                    className="h-10 w-16 object-cover rounded border border-neutral-200 mx-auto"
                                    labelClassName="block text-[9px] leading-none"
                                  />
                                </td>
                                <td className="px-4 py-3 text-neutral-600 whitespace-nowrap">{mixLabel(paint)}</td>
                                <td className="px-4 py-3 text-neutral-900 font-medium min-w-[150px]">
                                    <Link to={`/paints/${paint.id}`} className="hover:underline hover:text-blue-600">
                                        {paint.name}
                                    </Link>
                                    {paint.isDiscontinued && (
                                        <span className="ml-2 inline-flex items-center rounded-full border border-red-200 bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-700">
                                            Discontinued
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-neutral-600 whitespace-nowrap">{brand?.name || paint.brandId}</td>

                                {/* Colour (Hex Circle) */}
                                <td className="px-4 py-3 text-center">
                                    <div
                                        className="w-6 h-6 rounded-full border border-neutral-200 shadow-sm mx-auto"
                                        style={{
                                          backgroundColor: paint.hex || '#E6D9C6',
                                          ...(paint.swatchImage
                                            ? {
                                                backgroundImage: `url(${paint.swatchImage})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center'
                                              }
                                            : {})
                                        }}
                                        title={paint.name}
                                    />
                                </td>

                                <td className="px-4 py-3 text-neutral-600 font-mono text-xs whitespace-nowrap">{paint.paintNumber || '—'}</td>
                                <td className="px-4 py-3 text-neutral-600 whitespace-nowrap">{paint.hue || '—'}</td>
                                <td className="px-4 py-3 text-neutral-600 text-center whitespace-nowrap">{paint.series || '—'}</td>
                                <td className="px-4 py-3 text-neutral-600 text-center whitespace-nowrap">{paint.lightfastness}</td>
                                <td className="px-4 py-3 text-neutral-600 text-center whitespace-nowrap">{paint.staining}</td>
                                <td className="px-4 py-3 text-neutral-600 text-center whitespace-nowrap">{paint.granulation}</td>
                                <td className="px-4 py-3 text-neutral-600 text-center whitespace-nowrap">{paint.transparency}</td>
                                <td className="px-4 py-3 text-neutral-600 text-center whitespace-nowrap">{paint.performance || '—'}</td>
                                <td className="px-4 py-3 text-neutral-600 text-center whitespace-nowrap">{paint.toxicity || '—'}</td>
                                <td className="px-4 py-3 text-neutral-600 text-center whitespace-nowrap">{paint.isVegan ? 'Yes' : 'No'}</td>
                                <td className="px-4 py-3 text-neutral-600 min-w-[120px]">{paint.collection || '—'}</td>

                                <td className="px-4 py-3 text-right sticky right-0 bg-white group-hover:bg-neutral-50 shadow-[inset_1px_0_0_rgba(0,0,0,0.05)] whitespace-nowrap">
                                    <Button 
                                        size="sm" 
                                        variant={isSelected ? "secondary" : "outline"}
                                        onClick={() => togglePaint(paint.id)}
                                        className={isSelected ? "bg-blue-50 text-blue-700 border-blue-200" : ""}
                                    >
                                        {isSelected ? "Added" : "Compare"}
                                    </Button>
                                </td>
                            </tr>
                         )
                    })}
                </tbody>
            </table>
        </div>
    )
}
