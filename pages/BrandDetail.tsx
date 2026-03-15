import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { BRANDS, PAINTS } from '../constants';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useComparison } from '../App';

export const BrandDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const brand = BRANDS.find(b => b.id === id);

  if (!brand) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Brand not found</h1>
        <Link to="/brands"><Button>Back to Brands</Button></Link>
      </div>
    );
  }

  const paints = PAINTS.filter(p => p.brandId === brand.id);
  const singlePigmentCount = paints.filter(p => p.pigmentCodes.length === 1 && p.pigmentCodes[0] !== '—').length;
  const country = brand.country || 'Unknown';
  const description = brand.description?.trim() || `${brand.name} is a watercolor paint brand based in ${country}.`;

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      <div className="bg-white border-b border-neutral-200 py-10">
        <div className="container mx-auto px-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-lg font-bold text-neutral-500">
              {brand.logo}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">{brand.name}</h1>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-neutral-600">
            <div><span className="font-medium text-neutral-800">Country:</span> {country}</div>
            <div><span className="font-medium text-neutral-800">Watercolors:</span> {paints.length}</div>
            <div><span className="font-medium text-neutral-800">Single Pigment Colors:</span> {singlePigmentCount}</div>
          </div>
          <p className="max-w-3xl text-neutral-600 leading-relaxed">{description}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card className="bg-white border-neutral-200 shadow-sm overflow-hidden">
          <PaintTable paints={paints} />
        </Card>
      </div>
    </div>
  );
};

const PaintTable: React.FC<{ paints: typeof PAINTS }> = ({ paints }) => {
  const { selectedPaintIds, togglePaint } = useComparison();

  if (paints.length === 0) {
    return <div className="p-8 text-center text-neutral-500">No paints found for this brand.</div>;
  }

  const headers = [
    'Color No.',
    'Paint Name',
    'Pigment(s)',
    'Series',
    'Colour',
    'Swatch',
    'Light',
    'Staining',
    'Staining vs Lifting',
    'Flow/Spread',
    'Granulation',
    'Transparency/Opacity',
    'Tinting Strength',
    'Performance',
    'Toxicity',
    'Vegan',
    'Collection',
    'Action'
  ];

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
          {paints.map(paint => {
            const isSelected = selectedPaintIds.includes(paint.id);
            return (
              <tr key={paint.id} className="group hover:bg-neutral-50/50 transition-colors">
                <td className="px-4 py-3 text-neutral-600 font-mono text-xs whitespace-nowrap">{paint.paintNumber || '—'}</td>
                <td className="px-4 py-3 text-neutral-900 font-medium min-w-[150px]">
                  <Link to={`/paints/${paint.id}`} className="hover:underline hover:text-blue-600">
                    {paint.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-neutral-600 whitespace-nowrap">{paint.pigmentCodes.join(', ')}</td>
                <td className="px-4 py-3 text-neutral-600 text-center whitespace-nowrap">{paint.series || '—'}</td>
                <td className="px-4 py-3 text-center">
                  <div
                    className="w-6 h-6 rounded-full border border-neutral-200 shadow-sm mx-auto"
                    style={
                      paint.swatchImage
                        ? { backgroundImage: `url(${paint.swatchImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                        : { backgroundColor: paint.hex }
                    }
                    title={paint.name}
                  />
                </td>
                <td className="px-4 py-3">
                  {paint.swatchImage ? (
                    <img src={paint.swatchImage} alt="Swatch" className="w-12 h-8 object-cover rounded border border-neutral-200" />
                  ) : (
                    <div className="w-12 h-8 rounded border border-neutral-200 bg-gradient-to-br from-neutral-100 to-neutral-200 mx-auto" />
                  )}
                </td>
                <td className="px-4 py-3 text-neutral-600 text-center whitespace-nowrap">{paint.lightfastness}</td>
                <td className="px-4 py-3 text-neutral-600 text-center whitespace-nowrap">{paint.staining}</td>
                <td className="px-4 py-3 text-neutral-600 text-center min-w-[120px]">{paint.stainingVsLifting || '—'}</td>
                <td className="px-4 py-3 text-neutral-600 text-center whitespace-nowrap">{paint.flow || '—'}</td>
                <td className="px-4 py-3 text-neutral-600 text-center whitespace-nowrap">{paint.granulation}</td>
                <td className="px-4 py-3 text-neutral-600 text-center whitespace-nowrap">{paint.transparency}</td>
                <td className="px-4 py-3 text-neutral-600 text-center whitespace-nowrap">{paint.tintingStrength || '—'}</td>
                <td className="px-4 py-3 text-neutral-600 text-center whitespace-nowrap">{paint.performance || '—'}</td>
                <td className="px-4 py-3 text-neutral-600 text-center whitespace-nowrap">{paint.toxicity || '—'}</td>
                <td className="px-4 py-3 text-neutral-600 text-center whitespace-nowrap">{paint.isVegan ? 'Yes' : 'No'}</td>
                <td className="px-4 py-3 text-neutral-600 min-w-[120px]">{paint.collection || '—'}</td>
                <td className="px-4 py-3 text-right sticky right-0 bg-white group-hover:bg-neutral-50 shadow-[inset_1px_0_0_rgba(0,0,0,0.05)] whitespace-nowrap">
                  <Button
                    size="sm"
                    variant={isSelected ? 'secondary' : 'outline'}
                    onClick={() => togglePaint(paint.id)}
                    className={isSelected ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                  >
                    {isSelected ? 'Added' : 'Compare'}
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
