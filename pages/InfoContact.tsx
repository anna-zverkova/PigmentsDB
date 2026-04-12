import React from 'react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import infoContent from '../content/info.json';

export const InfoContact: React.FC = () => {
  const contact =
    (infoContent as { contact?: { title?: string; bodyRich?: any; bodyMarkdown?: string; body?: string | string[] } }).contact ??
    {
      title: 'Contact',
      bodyMarkdown:
        'This is a placeholder for contact details. Add a preferred email address or contact form link here.',
    };
  const rich = contact.bodyRich;
  const rawMarkdown =
    (typeof rich === 'string' && rich.trim().length > 0 ? rich : null) ??
    contact.bodyMarkdown ??
    (Array.isArray(contact.body) ? contact.body.join('\n\n') : contact.body) ??
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
        {contact.title}
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
