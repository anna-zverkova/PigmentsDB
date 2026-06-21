import React, { createContext, lazy, Suspense, useContext, useState, ReactNode } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ComparisonContextType } from './types';

const Home = lazy(() => import('./pages/Home').then((module) => ({ default: module.Home })));
const PigmentFamily = lazy(() => import('./pages/PigmentFamily').then((module) => ({ default: module.PigmentFamily })));
const PaintsSearch = lazy(() => import('./pages/PaintsSearch').then((module) => ({ default: module.PaintsSearch })));
const PaintDetail = lazy(() => import('./pages/PaintDetail').then((module) => ({ default: module.PaintDetail })));
const Comparison = lazy(() => import('./pages/Comparison').then((module) => ({ default: module.Comparison })));
const PaletteBuilder = lazy(() => import('./pages/PaletteBuilder').then((module) => ({ default: module.PaletteBuilder })));
const Brands = lazy(() => import('./pages/Brands').then((module) => ({ default: module.Brands })));
const BrandDetail = lazy(() => import('./pages/BrandDetail').then((module) => ({ default: module.BrandDetail })));
const Blogs = lazy(() => import('./pages/Blogs').then((module) => ({ default: module.Blogs })));
const BlogPost = lazy(() => import('./pages/BlogPost').then((module) => ({ default: module.BlogPost })));
const InfoAbout = lazy(() => import('./pages/InfoAbout').then((module) => ({ default: module.InfoAbout })));
const InfoData = lazy(() => import('./pages/InfoData').then((module) => ({ default: module.InfoData })));
const InfoContact = lazy(() => import('./pages/InfoContact').then((module) => ({ default: module.InfoContact })));

// Context for Comparison Basket
const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};

const ComparisonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedPaintIds, setSelectedPaintIds] = useState<string[]>([]);

  const togglePaint = (id: string) => {
    setSelectedPaintIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(pId => pId !== id);
      }
      return [...prev, id];
    });
  };

  const removePaint = (id: string) => {
    setSelectedPaintIds(prev => prev.filter(pId => pId !== id));
  };

  const clearSelection = () => {
    setSelectedPaintIds([]);
  };

  const setSelection = (ids: string[]) => {
    setSelectedPaintIds(Array.from(new Set(ids.filter((id): id is string => Boolean(id)))));
  };

  return (
    <ComparisonContext.Provider value={{ selectedPaintIds, togglePaint, clearSelection, removePaint, setSelection }}>
      {children}
    </ComparisonContext.Provider>
  );
};

const App: React.FC = () => {
  return (
    <ComparisonProvider>
      <Router>
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center bg-tint-paper text-neutral-600">
              Loading TintMap...
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />

              {/* Redirect /pigments to default family or list */}
              <Route path="pigments" element={<Navigate to="/pigments/blue" replace />} />
              <Route path="pigments/:family" element={<PigmentFamily />} />

              <Route path="paints" element={<PaintsSearch />} />
              <Route path="paints/:id" element={<PaintDetail />} />

              <Route path="brands" element={<Brands />} />
              <Route path="brands/:id" element={<BrandDetail />} />
              <Route path="blogs" element={<Blogs />} />
              <Route path="blogs/:id" element={<BlogPost />} />

              <Route path="info/about" element={<InfoAbout />} />
              <Route path="info/data" element={<InfoData />} />
              <Route path="info/contact" element={<InfoContact />} />

              <Route path="compare" element={<Comparison />} />
              <Route path="palette-builder" element={<PaletteBuilder />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </ComparisonProvider>
  );
};

export default App;
