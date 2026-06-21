import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { PAINTS, BRANDS } from '../constants';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useComparison } from '../App';
import { SwatchPreview } from '../components/SwatchPreview';

export const PaintDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const paint = PAINTS.find(p => p.id === id);
  const brand = BRANDS.find(b => b.id === paint?.brandId);
  const { selectedPaintIds, togglePaint } = useComparison();

  if (!paint) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Paint not found</h1>
        <Link to="/paints"><Button>Back to Paints</Button></Link>
      </div>
    );
  }

  const isSelected = selectedPaintIds.includes(paint.id);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 items-start">
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl border border-neutral-200 overflow-hidden bg-white">
              <SwatchPreview
                src={paint.swatchImage}
                alt={`${paint.name} swatch`}
                variant="card"
                className="w-full h-full object-cover"
                labelClassName="block text-[10px] leading-none"
              />
            </div>
            <Button
              size="sm"
              variant={isSelected ? 'secondary' : 'outline'}
              onClick={() => togglePaint(paint.id)}
              className={isSelected ? 'bg-blue-50 text-blue-700 border-blue-200 w-full' : 'w-full'}
            >
              {isSelected ? 'Added to Compare' : 'Compare'}
            </Button>
          </div>

          <div className="space-y-4">
            <div className="text-sm text-neutral-500">{brand?.name || paint.brandId}</div>
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">{paint.name}</h1>
            <div className="flex flex-wrap gap-2">
              {paint.pigmentCodes.map(code => (
                <Badge key={code} variant="secondary">{code}</Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-neutral-600">
              <div><span className="font-medium text-neutral-800">Paint No.:</span> {paint.paintNumber || '—'}</div>
              <div><span className="font-medium text-neutral-800">Series:</span> {paint.series || '—'}</div>
              <div><span className="font-medium text-neutral-800">Hue:</span> {paint.hue || '—'}</div>
              <div><span className="font-medium text-neutral-800">Collection:</span> {paint.collection || '—'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <DetailRow label="Lightfastness" value={paint.lightfastness} />
            <DetailRow label="Transparency" value={paint.transparency} />
            <DetailRow label="Staining" value={paint.staining} />
            <DetailRow label="Granulation" value={paint.granulation} />
            <DetailRow label="Staining vs Lifting" value={paint.stainingVsLifting || '—'} />
            <DetailRow label="Flow/Spread" value={paint.flow || '—'} />
            <DetailRow label="Tinting Strength" value={paint.tintingStrength || '—'} />
            <DetailRow label="Performance" value={paint.performance || '—'} />
            <DetailRow label="Toxicity" value={paint.toxicity || '—'} />
            <DetailRow label="Vegan" value={paint.isVegan ? 'Yes' : 'No'} />
            <DetailRow label="Discontinued" value={paint.isDiscontinued ? 'Yes' : 'No'} />
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4 text-sm">
    <span className="text-neutral-500">{label}</span>
    <span className="font-medium text-neutral-900">{value}</span>
  </div>
);
