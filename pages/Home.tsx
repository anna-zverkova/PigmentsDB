import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, BarChart2, BookOpen } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import homeContent from '../content/home.json';

export const Home: React.FC = () => {
  const { hero, cta, features, featured } = homeContent;
  const featureIcons = [Search, BarChart2, BookOpen];
  const featureIconClasses = ['text-tint-ember', 'text-tint-teal', 'text-tint-moss'];
  const featureBgClasses = ['bg-tint-ember/10', 'bg-tint-teal/10', 'bg-tint-gold/15'];

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="group cursor-pointer">
                        <div className="aspect-[4/5] bg-white p-3 rounded-2xl shadow-sm border border-tint-ink/10 flex flex-col items-center group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-1">
                            <div className={`w-full flex-1 rounded-xl mb-4 bg-neutral-100 relative overflow-hidden`}>
                                <div className="absolute inset-0 opacity-80" style={{background: `hsl(${45 + (i * 35)}, 60%, ${85 - (i * 5)}%)`}}></div>
                                {/* Mock Watercolor Texture Overlay */}
                                <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/watercolor.png')]"></div>
                            </div>
                            <div className="w-full text-left px-1">
                                <div className="h-4 bg-neutral-100 rounded-full w-3/4 mb-2"></div>
                                <div className="h-3 bg-neutral-50 rounded-full w-1/2"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
         </div>
      </section>
    </div>
  );
};
