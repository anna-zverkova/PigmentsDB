import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, BarChart2, BookOpen, Palette } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import homeContent from '../content/home.json';
import { BRAND_BY_ID, PAINTS, PAINT_BY_ID } from '../constants';
import { Paint } from '../types';
import { SwatchPreview } from '../components/SwatchPreview';

export const Home: React.FC = () => {
  const { hero, cta, features, featured } = homeContent;
  const featureIcons = [Search, BarChart2, BookOpen, Palette];
  const featureIconClasses = ['text-tint-ember', 'text-tint-teal', 'text-tint-moss', 'text-tint-ink'];
  const featureBgClasses = ['bg-tint-ember/10', 'bg-tint-teal/10', 'bg-tint-gold/15', 'bg-tint-ink/10'];
  const featuredItems = featured?.items ?? [];
  const featuredPaints = useMemo(
    () =>
      featuredItems
        .map((item: { paintId: string }) => PAINT_BY_ID.get(item.paintId))
        .filter(Boolean) as Paint[],
    [featuredItems]
  );
  const resolvedFeaturedPaints = useMemo(
    () => (featuredPaints.length > 0 ? featuredPaints : PAINTS.filter(p => p.isFeatured).slice(0, 5)),
    [featuredPaints]
  );

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section with Watercolor Design */}
      <section className="relative py-28 md:py-40 overflow-hidden bg-tint-paper">
        {/* Map-inspired background layers */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <div className="absolute inset-0 tm-grid opacity-50"></div>
          <div className="absolute inset-0 tm-noise opacity-40"></div>
          <div className="absolute -top-32 -left-32 w-[620px] h-[620px] bg-tint-gold/20 rounded-[40%] blur-[90px] mix-blend-multiply opacity-80 animate-pulse" style={{animationDuration: '10s'}}></div>
          <div className="absolute -bottom-48 -right-20 w-[720px] h-[620px] bg-tint-teal/20 rounded-[45%] blur-[110px] mix-blend-multiply opacity-70"></div>
          <div className="absolute top-12 right-10 w-[420px] h-[420px] bg-tint-ember/15 rounded-full blur-[90px] mix-blend-multiply opacity-70"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-tint-ink/10 text-sm font-medium text-neutral-700 mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-tint-ember animate-pulse"></span>
            {hero.badge}
          </div>

          <h1 className="text-5xl md:text-7xl font-bold font-display tracking-tight mb-8 text-tint-ink leading-[1.1]">
            {hero.titleLead} <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-tint-ember via-tint-gold to-tint-teal">
              {hero.titleAccent}
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-neutral-700 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            {hero.subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Link to={cta.primaryHref}>
              <Button size="lg" className="w-full sm:w-auto text-base px-8 h-12 shadow-xl shadow-neutral-300/50 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300">
                {cta.primaryText}
              </Button>
            </Link>
             <Link to={cta.secondaryHref}>
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 bg-white/50 backdrop-blur-md border-tint-ink/20 hover:bg-white/80 text-tint-ink">
                {cta.secondaryText}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = featureIcons[index] || Search;
            const iconClass = featureIconClasses[index] || 'text-watercolor-rose';
            const bgClass = featureBgClasses[index] || 'bg-blue-50';
            const linkClass = featureIconClasses[index] || 'text-watercolor-rose';
            return (
              <Card
                key={feature.title}
                className="p-8 hover:shadow-lg transition-all duration-300 border-neutral-100 bg-white/80 backdrop-blur-sm hover:-translate-y-1"
              >
                <div className={`w-14 h-14 ${bgClass} rounded-2xl flex items-center justify-center text-blue-600 mb-6`}>
                  <Icon size={28} className={iconClass} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-neutral-900">{feature.title}</h3>
                <p className="text-neutral-600 mb-6 leading-relaxed">{feature.description}</p>
                <Link
                  to={feature.href}
                  className={`text-sm font-semibold ${linkClass} flex items-center gap-2 hover:gap-3 transition-all`}
                >
                  {feature.ctaText} <ArrowRight size={16} />
                </Link>
              </Card>
            );
          })}
        </div>
      </section>
      
      {/* Featured Swatches Mockup */}
      <section className="py-24 border-t border-tint-ink/10 bg-gradient-to-b from-tint-paper to-white">
         <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold font-display mb-4 text-tint-ink">{featured.title}</h2>
            <p className="text-neutral-600 mb-12 max-w-xl mx-auto">{featured.subtitle}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {resolvedFeaturedPaints.map((paint) => {
                  const brand = BRAND_BY_ID.get(paint.brandId);
                  return (
                    <Link key={paint.id} to={`/paints/${paint.id}`} className="group block text-left">
                      <Card className="h-full overflow-hidden hover:shadow-md transition-all duration-300 group-hover:-translate-y-1">
                        <div className="aspect-[4/5] bg-white p-3 border-b border-tint-ink/10">
                          <div className="w-full h-full rounded-xl bg-neutral-100 relative overflow-hidden">
                            <SwatchPreview
                              src={paint.swatchImage}
                              alt={`${paint.name} swatch`}
                              variant="card"
                              className="absolute inset-0 w-full h-full object-cover"
                              labelClassName="block text-[9px] leading-none"
                            />
                            <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/watercolor.png')]"></div>
                          </div>
                        </div>
                        <div className="p-4 space-y-2">
                          <div className="text-xs text-neutral-500">{brand?.name}</div>
                          <div className="font-semibold text-neutral-900 leading-tight">{paint.name}</div>
                          <div className="flex flex-wrap gap-1">
                            {paint.pigmentCodes.map(code => (
                              <Badge key={code} variant="secondary" className="text-[10px] px-1.5 py-0">
                                {code}
                              </Badge>
                            ))}
                          </div>
                          <div className="text-xs text-neutral-600 space-y-1">
                            {paint.paintNumber && paint.paintNumber !== '–' && (
                              <div>Paint No.: {paint.paintNumber}</div>
                            )}
                            {paint.hue && paint.hue !== '–' && <div>Hue: {paint.hue}</div>}
                            {paint.transparency && <div>Transparency: {paint.transparency}</div>}
                            {paint.granulation && <div>Granulation: {paint.granulation}</div>}
                            {paint.lightfastness && <div>Lightfastness: {paint.lightfastness}</div>}
                            {paint.staining && <div>Staining: {paint.staining}</div>}
                          </div>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
            </div>
         </div>
      </section>
    </div>
  );
};
