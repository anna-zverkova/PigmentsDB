import React from 'react';

export const InfoAbout: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-3xl font-bold text-neutral-900 mb-4">About TintMap</h1>
      <p className="text-neutral-600 leading-relaxed">
        TintMap is a non-profit pigment atlas for watercolour artists. This page will be
        expanded with the project story, methodology, and data sources.
      </p>
    </div>
  );
};
