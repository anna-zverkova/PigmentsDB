import React from 'react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import infoContent from '../content/info.json';

export const InfoAbout: React.FC = () => {
  const about =
    (infoContent as { about?: { title?: string; bodyRich?: any; bodyMarkdown?: string; body?: string | string[] } }).about ?? {
      title: 'About TintMap',
      bodyMarkdown:
        'TintMap is a non-profit pigment atlas for watercolour artists. This page will be expanded with the project story, methodology, and data sources.',
    };
  const rich = about.bodyRich;
  const rawMarkdown =
    (typeof rich === 'string' && rich.trim().length > 0 ? rich : null) ??
    about.bodyMarkdown ??
    (Array.isArray(about.body) ? about.body.join('\n\n') : about.body) ??
    '';
  const markdown = rawMarkdown
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trimStart())
    .join('\n');
  const markdownComponents = {
    p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p className="mb-5 last:mb-0" {...props} />
    ),
    h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2 className="text-xl font-semibold text-neutral-900 mt-8 mb-3" {...props} />
    ),
    h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3 className="text-lg font-semibold text-neutral-900 mt-6 mb-2" {...props} />
    ),
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-3xl font-bold text-neutral-900 mb-4">
        {about.title}
      </h1>
      <div className="text-neutral-600 leading-relaxed">
        {rich && typeof rich === 'object' && (Array.isArray(rich) ? rich.length > 0 : true) ? (
          <TinaMarkdown content={rich} components={markdownComponents} />
        ) : (
          <ReactMarkdown remarkPlugins={[remarkBreaks]} components={markdownComponents}>
            {markdown}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
};
