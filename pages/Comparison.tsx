import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { PAINTS, BRANDS } from '../constants';
import { Button } from '../components/ui/Button';
import { X, Share2, Printer } from 'lucide-react';
import { useComparison } from '../App';

export const Comparison: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const ids = queryParams.get('ids')?.split(',') || [];
  
  const paintsToCompare = PAINTS.filter(p => ids.includes(p.id));
  const { removePaint } = useComparison();

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
                    <Button variant="outline" size="sm" className="gap-2"><Share2 size={16}/> Share</Button>
                    <Button variant="outline" size="sm" className="gap-2"><Printer size={16}/> Print</Button>
                </div>
            </div>
        </div>

        <div className="container mx-auto px-4 py-8 overflow-x-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 min-w-[800px]">
                {/* Column for each paint */}
                {paintsToCompare.map(paint => {
                    const brand = BRANDS.find(b => b.id === paint.brandId);
                    
                    return (
                        <div key={paint.id} className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
                            {/* Header */}
                            <div className="relative aspect-[4/3]" style={{ backgroundColor: paint.hex }}>
                                <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.1)]"></div>
                                <button 
                                    onClick={() => removePaint(paint.id)} // Note: this removes from context but URL state needs manual update in a real app
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
