import React from 'react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import ReactMarkdown from 'react-markdown';
import infoContent from '../content/info.json';

export const InfoAbout: React.FC = () => {
  const about =
    (infoContent as { about?: { title?: string; bodyRich?: any; bodyMarkdown?: string; body?: string | string[] } }).about ?? {
      title: 'About TintMap',
      bodyMarkdown:
        'TintMap is a non-profit pigment atlas for watercolour artists. This page will be expanded with the project story, methodology, and data sources.',
    };
  const rich = about.bodyRich;
  const markdown = about.bodyMarkdown ?? (Array.isArray(about.body) ? about.body.join('\n\n') : about.body) ?? '';

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-3xl font-bold text-neutral-900 mb-4">
        {about.title}
      </h1>
      <div className="prose prose-neutral max-w-none">
        {rich && Array.isArray(rich) && rich.length > 0 ? (
          <TinaMarkdown content={rich} />
        ) : (
          <ReactMarkdown>{markdown}</ReactMarkdown>
        )}
      </div>
    </div>
  );
};
