import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PIGMENT_FAMILIES, PAINTS, PIGMENTS, BRANDS } from '../constants';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useComparison } from '../App';
import { Droplet, Sun, Layers, Grid } from 'lucide-react';
import { Paint, Pigment } from '../types';
import pigmentsContent from '../content/pigments.json';

export const PigmentFamily: React.FC = () => {
  const { family } = useParams<{ family: string }>();
  // Default to blue if no family provided or invalid
  const activeFamily = PIGMENT_FAMILIES.find(f => f.name.toLowerCase() === family?.toLowerCase()) || PIGMENT_FAMILIES[4];

  const pigmentsInFamily = PIGMENTS.filter(p => p.family === activeFamily.name);

  // In a real app, we'd fetch paints by pigment code. Here we filter mock data.
  const getPaintsForPigment = (code: string) => PAINTS.filter(p => p.pigmentCodes.includes(code));

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
            <Card className="p-4 bg-white border-neutral-200 shadow-sm mb-8 flex flex-wrap gap-4 text-sm text-neutral-500">
                <div className="flex items-center gap-2"><Sun size={16} /> Lightfastness</div>
                <div className="flex items-center gap-2"><Layers size={16} /> Transparency</div>
                <div className="flex items-center gap-2"><Droplet size={16} /> Staining</div>
                <div className="flex items-center gap-2"><Grid size={16} /> Granulation</div>
            </Card>

            {pigmentsInFamily.map(pigment => (
                <section key={pigment.code} id={pigment.code} className="scroll-mt-36">
                    <div className="flex items-baseline gap-4 mb-6 border-b border-neutral-200 pb-4">
                        <h2 className="text-3xl font-bold font-mono text-neutral-900">{pigment.code}</h2>
                        <h3 className="text-xl text-neutral-500 font-medium">{pigment.name}</h3>
                        {pigment.toxicity && <Badge variant="danger">{pigment.toxicity}</Badge>}
                    </div>
                    
                    {pigment.description && (
                        <p className="text-neutral-600 mb-6 max-w-3xl">{pigment.description}</p>
                    )}

                    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
                            <PaintTable paints={getPaintsForPigment(pigment.code)} />
                    </div>
                </section>
            ))}
        </div>
      </div>
    </div>
  );
};

const PaintTable: React.FC<{ paints: Paint[] }> = ({ paints }) => {
    const { selectedPaintIds, togglePaint } = useComparison();
    
    if (paints.length === 0) return <div className="p-8 text-center text-neutral-500">No paints found for this pigment in our database.</div>;

    const headers = [
      "Pigment(s)", "Paint Number", "Paint Name Hue", "Brand", "Series", 
      "Colour", "Swatch", "Light", "Staining Levels", "Staining vs Lifting", 
      "Flow/Spread", "Granulation", "Transparency/Opacity", "Tinting Strength", 
      "Performance", "Toxicity", "Vegan", "Collection", "Action"
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
                         const brand = BRANDS.find(b => b.id === paint.brandId);
                         const isSelected = selectedPaintIds.includes(paint.id);

                         return (
                            <tr key={paint.id} className="group hover:bg-neutral-50/50 transition-colors">
                                <td className="px-4 py-3 text-neutral-600 whitespace-nowrap">{paint.pigmentCodes.join(', ')}</td>
                                <td className="px-4 py-3 text-neutral-600 font-mono text-xs whitespace-nowrap">{paint.paintNumber || '—'}</td>
                                <td className="px-4 py-3 text-neutral-900 font-medium min-w-[150px]">
                                    <Link to={`/paints/${paint.id}`} className="hover:underline hover:text-blue-600">
                                        {paint.name}
                                    </Link>
                                </td>
                                <td className="px-4 py-3 text-neutral-600 whitespace-nowrap">{brand?.name || paint.brandId}</td>
                                <td className="px-4 py-3 text-neutral-600 text-center whitespace-nowrap">{paint.series || '—'}</td>
                                
                                {/* Colour (Hex Circle) */}
                                <td className="px-4 py-3 text-center">
                                    <div 
                                        className="w-6 h-6 rounded-full border border-neutral-200 shadow-sm mx-auto"
                                        style={{ backgroundColor: paint.hex }}
                                    />
                                </td>

                                {/* Swatch (Visual Image) */}
                                <td className="px-4 py-3">
                                  {paint.swatchImage ? (
                                    <img src={paint.swatchImage} alt="Swatch" className="w-12 h-8 object-cover rounded border border-neutral-200" />
                                  ) : (
                                    <div 
                                      className="w-12 h-8 rounded border border-neutral-200 bg-gradient-to-br from-neutral-100 to-neutral-200 mx-auto"
                                      title="No swatch image"
                                    />
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
