import React from 'react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import ReactMarkdown from 'react-markdown';
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
  const markdown = contact.bodyMarkdown ?? (Array.isArray(contact.body) ? contact.body.join('\n\n') : contact.body) ?? '';

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-3xl font-bold text-neutral-900 mb-4">
        {contact.title}
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
