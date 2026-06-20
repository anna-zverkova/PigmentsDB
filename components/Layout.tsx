import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { ComparisonBar } from './ComparisonBar';
import { Button } from './ui/Button';

const NEWSLETTER_SCRIPT_URL =
  import.meta.env.VITE_NEWSLETTER_SCRIPT_URL ||
  'https://script.google.com/macros/s/AKfycbzclSm-PknF686Ritm5-IDpijScb0a9rpa7BwUif4nOTQbpl4zjmoklGgwgDr_jZzOUvA/exec';

export const Layout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [newsletterMessage, setNewsletterMessage] = useState(
    'Subscribe for occasional updates about new pigments and data changes.'
  );
  const location = useLocation();

  const navLinks = [
    { name: 'Pigments', path: '/pigments' },
    { name: 'Brands', path: '/brands' },
    { name: 'Paints', path: '/paints' },
    { name: 'Blogs', path: '/blogs' },
  ];

  const secondaryLinks = [
    { name: 'About', path: '/info/about' },
    { name: 'Data', path: '/info/data' },
    { name: 'Contact', path: '/info/contact' },
  ];

  const handleNewsletterInputChange = (value: string) => {
    setNewsletterEmail(value);
    if (newsletterStatus !== 'idle') {
      setNewsletterStatus('idle');
      setNewsletterMessage('Subscribe for occasional updates about new pigments and data changes.');
    }
  };

  const handleNewsletterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email = newsletterEmail.trim();
    if (!email) return;

    setNewsletterStatus('submitting');
    setNewsletterMessage('Submitting your email...');

    try {
      await fetch(NEWSLETTER_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({ email }),
      });

      setNewsletterStatus('success');
      setNewsletterEmail('');
      setNewsletterMessage('Thanks, you are subscribed.');
    } catch (error) {
      setNewsletterStatus('error');
      setNewsletterMessage('We could not reach the newsletter service. Please try again.');
    }
  };

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
             <div className="px-2 py-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Menu</div>
            <nav className="flex flex-col space-y-1">
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
              <li><Link to="/blogs" className="hover:text-neutral-900">Blogs</Link></li>
            </ul>
          </div>
          <div>
             <h4 className="font-semibold mb-4 text-sm">Info</h4>
            <ul className="space-y-2 text-sm text-neutral-500">
              {secondaryLinks.map(link => (
                <li key={link.name}><Link to={link.path} className="hover:text-neutral-900">{link.name}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm">Newsletter</h4>
            <form
              className="space-y-2"
              onSubmit={handleNewsletterSubmit}
            >
              <div className="flex gap-2">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={newsletterEmail}
                  onChange={(event) => handleNewsletterInputChange(event.target.value)}
                  required
                  className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm"
                />
                <Button type="submit" size="sm" disabled={newsletterStatus === 'submitting'}>
                  {newsletterStatus === 'submitting' ? 'Sending...' : newsletterStatus === 'success' ? 'Subscribed' : 'Subscribe'}
                </Button>
              </div>
              <p className={`text-xs ${newsletterStatus === 'error' ? 'text-red-600' : 'text-neutral-500'}`}>
                {newsletterMessage}
              </p>
            </form>
          </div>
        </div>
      </footer>
    </div>
  );
};
