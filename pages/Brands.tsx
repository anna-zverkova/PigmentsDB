import React from 'react';
import { BRANDS, PAINTS } from '../constants';
import brandsContent from '../content/brands.json';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';

export const Brands: React.FC = () => {
    // Ensure brands are sorted alphabetically
    const sortedBrands = [...BRANDS].sort((a, b) => a.name.localeCompare(b.name));
    const brandHasPaints = new Set(PAINTS.map(p => p.brandId));

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-6 text-neutral-900">{brandsContent.title}</h1>
            <p className="text-lg text-neutral-600 mb-12 max-w-4xl leading-relaxed">
                {brandsContent.intro}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {sortedBrands.map((brand) => {
                    const isActive = brandHasPaints.has(brand.id);
                    const card = (
                        <Card className={`h-full p-6 flex flex-col items-center text-center transition-all duration-300 border-neutral-200 ${isActive ? 'hover:shadow-lg hover:border-brand' : 'opacity-50'}`}>
                            {/* Logo Placeholder */}
                            <div className={`w-20 h-20 mb-4 rounded-full bg-neutral-100 flex items-center justify-center text-xl font-bold text-neutral-400 transition-colors duration-300 border-4 border-white shadow-sm ${isActive ? 'group-hover:bg-brand group-hover:text-white' : ''}`}>
                                {brand.logo}
                            </div>
                            <h3 className={`text-lg font-semibold text-neutral-900 transition-colors duration-300 ${isActive ? 'group-hover:text-brand' : ''}`}>
                                {brand.name}
                            </h3>
                            {!isActive && (
                                <span className="mt-2 text-xs text-neutral-500">Coming soon</span>
                            )}
                        </Card>
                    );

                    return isActive ? (
                        <Link key={brand.id} to={`/brands/${brand.id}`} className="block group h-full">
                            {card}
                        </Link>
                    ) : (
                        <div key={brand.id} className="block h-full">
                            {card}
                        </div>
                    );
                })}
            </div>
        </div>
    )
}
