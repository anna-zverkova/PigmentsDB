import React, { createContext, useContext, useState, ReactNode } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { PigmentFamily } from './pages/PigmentFamily';
import { PaintsSearch } from './pages/PaintsSearch';
import { Comparison } from './pages/Comparison';
import { Brands } from './pages/Brands';
import { ComparisonContextType } from './types';

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
      if (prev.length >= 4) {
        alert("You can only compare up to 4 paints at a time.");
        return prev;
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

  return (
    <ComparisonContext.Provider value={{ selectedPaintIds, togglePaint, clearSelection, removePaint }}>
      {children}
    </ComparisonContext.Provider>
  );
};

const App: React.FC = () => {
  return (
    <ComparisonProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            
            {/* Redirect /pigments to default family or list */}
            <Route path="pigments" element={<Navigate to="/pigments/blue" replace />} />
            <Route path="pigments/:family" element={<PigmentFamily />} />
            
            <Route path="paints" element={<PaintsSearch />} />
            <Route path="paints/:id" element={<div className="p-20 text-center">Paint Detail Page Placeholder</div>} />
            
            <Route path="brands" element={<Brands />} />
            <Route path="brands/:id" element={<div className="p-20 text-center">Brand Detail Page Placeholder</div>} />
            
            
            <Route path="compare" element={<Comparison />} />
          </Route>
        </Routes>
      </Router>
    </ComparisonProvider>
  );
};

export default App;
