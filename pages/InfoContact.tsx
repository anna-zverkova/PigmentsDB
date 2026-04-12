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

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-3xl font-bold text-neutral-900 mb-4">
        {contact.title}
      </h1>
      <div className="prose prose-neutral max-w-none">
        {rich && typeof rich === 'object' && (Array.isArray(rich) ? rich.length > 0 : true) ? (
          <TinaMarkdown content={rich} />
        ) : (
          <ReactMarkdown remarkPlugins={[remarkBreaks]}>{markdown}</ReactMarkdown>
        )}
      </div>
    </div>
  );
};
