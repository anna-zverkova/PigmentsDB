import React from 'react';
import { BRANDS, PAINTS } from '../constants';
import brandsContent from '../content/brands.json';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';

export const Brands: React.FC = () => {
    // Ensure brands are sorted alphabetically
    const sortedBrands = [...BRANDS].sort((a, b) => a.name.localeCompare(b.name));
    const brandHasPaints = new Set(PAINTS.map(p => p.brandId));
    const activeBrands = sortedBrands.filter(b => brandHasPaints.has(b.id));
    const comingSoonBrands = sortedBrands.filter(b => !brandHasPaints.has(b.id));

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-6 text-neutral-900">{brandsContent.title}</h1>
            <p className="text-lg text-neutral-600 mb-12 max-w-4xl leading-relaxed">
                {brandsContent.intro}
            </p>
            
            <div className="mb-6 text-sm text-neutral-600">
                <span className="inline-flex items-center gap-2 mr-4">
                    <span className="inline-block w-3 h-3 rounded-full bg-emerald-100 border border-emerald-200"></span>
                    Professional line
                </span>
                <span className="inline-flex items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full bg-amber-100 border border-amber-200"></span>
                    Student line
                </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {activeBrands.map((brand) => {
                    const isActive = brandHasPaints.has(brand.id);
                    const tintClass = brand.status === 'Student'
                        ? 'bg-amber-50/70 border-amber-100'
                        : 'bg-emerald-50/70 border-emerald-100';
                    const card = (
                        <Card className={`h-full p-6 flex flex-col items-center text-center transition-all duration-300 border-neutral-200 ${isActive ? 'hover:shadow-lg hover:border-brand' : 'opacity-50'} ${tintClass}`}>
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

            {comingSoonBrands.length > 0 && (
                <div className="mt-12">
                    <h2 className="text-xl font-semibold text-neutral-900 mb-6">Coming soon</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {comingSoonBrands.map((brand) => {
                            const card = (
                                <Card className="h-full p-6 flex flex-col items-center text-center border-neutral-200 opacity-50">
                                    <div className="w-20 h-20 mb-4 rounded-full bg-neutral-100 flex items-center justify-center text-xl font-bold text-neutral-400 border-4 border-white shadow-sm">
                                        {brand.logo}
                                    </div>
                                    <h3 className="text-lg font-semibold text-neutral-900">
                                        {brand.name}
                                    </h3>
                                    <span className="mt-2 text-xs text-neutral-500">Coming soon</span>
                                </Card>
                            );
                            return (
                                <div key={brand.id} className="block h-full">
                                    {card}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
