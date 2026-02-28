import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import { ComparisonBar } from './ComparisonBar';
import { Button } from './ui/Button';

export const Layout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Pigments', path: '/pigments' },
    { name: 'Brands', path: '/brands' },
    { name: 'Paints', path: '/paints' },
    { name: 'Admin', path: '/admin/index.html', external: true },
  ];

  const secondaryLinks = [
    { name: 'About', path: '#' },
    { name: 'Privacy', path: '#' },
    { name: 'Terms', path: '#' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-tint-paper text-tint-ink relative">
      <div className="pointer-events-none fixed inset-0 tm-grid opacity-40"></div>
      <div className="pointer-events-none fixed inset-0 tm-noise opacity-40"></div>
      <header className="sticky top-0 z-40 w-full border-b border-tint-ink/10 bg-tint-paper/70 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <div className="w-8 h-8 rounded-lg overflow-hidden shadow-sm bg-white/70 border border-tint-ink/10 flex items-center justify-center">
              <img src="/logo.svg" alt="TintMap logo" className="w-7 h-7" />
            </div>
            <span className="font-display">TintMap</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(link => {
              const isActive = !link.external && location.pathname.startsWith(link.path);
              const className = `text-sm font-medium transition-colors hover:text-tint-ink ${
                isActive ? 'text-tint-ink' : 'text-neutral-600'
              }`;

              return link.external ? (
                <a key={link.path} href={link.path} className={className}>
                  {link.name}
                </a>
              ) : (
                <Link key={link.path} to={link.path} className={className}>
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500" />
              <input
                type="search"
                placeholder="Search paints, pigments..."
                className="h-9 w-64 rounded-md border border-tint-ink/15 bg-white/70 pl-9 pr-4 text-sm outline-none focus:border-tint-ink/40 focus:ring-0"
              />
            </div>
            
            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-neutral-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-tint-ink/10 bg-tint-paper px-4 py-4 space-y-4 h-[calc(100vh-64px)] overflow-y-auto">
             <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500" />
              <input
                type="search"
                placeholder="Search..."
                className="h-10 w-full rounded-md border border-tint-ink/15 bg-white/70 pl-9 pr-4 text-sm outline-none"
              />
            </div>
            <nav className="flex flex-col space-y-1">
              <div className="px-2 py-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Menu</div>
              {navLinks.map(link => (
                link.external ? (
                  <a
                    key={link.path}
                    href={link.path}
                    className="text-base font-medium py-3 px-2 hover:bg-white/70 rounded-md block text-tint-ink"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link 
                    key={link.path} 
                    to={link.path}
                    className="text-base font-medium py-3 px-2 hover:bg-white/70 rounded-md block text-tint-ink"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                )
              ))}
              <div className="my-4 border-t border-tint-ink/10"></div>
              <div className="px-2 py-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Other</div>
              {secondaryLinks.map(link => (
                <Link
                    key={link.name}
                    to={link.path}
                    className="text-sm font-medium py-2 px-2 hover:bg-white/70 rounded-md block text-neutral-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    {link.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <ComparisonBar />

      <footer className="border-t border-tint-ink/10 py-12 bg-tint-paper">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-bold font-display">TintMap</h3>
            <p className="text-sm text-neutral-600">The pigment atlas for artist paints.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm">Explore</h4>
            <ul className="space-y-2 text-sm text-neutral-500">
              <li><Link to="/pigments" className="hover:text-neutral-900">Pigments</Link></li>
              <li><Link to="/brands" className="hover:text-neutral-900">Brands</Link></li>
            </ul>
          </div>
          <div>
             <h4 className="font-semibold mb-4 text-sm">Legal</h4>
            <ul className="space-y-2 text-sm text-neutral-500">
              {secondaryLinks.filter(l => l.name !== 'About').map(link => (
                <li key={link.name}><a href={link.path} className="hover:text-neutral-900">{link.name}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm">Newsletter</h4>
            <div className="flex gap-2">
                <input type="email" placeholder="Email" className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm" />
                <Button size="sm">Subscribe</Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
