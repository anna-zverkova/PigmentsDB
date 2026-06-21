import React from 'react';
import { MarkdownBody } from '../components/content/MarkdownBody';
import infoContent from '../content/info.json';

export const InfoData: React.FC = () => {
  const dataPage =
    (infoContent as { data?: { title?: string; bodyRich?: any; bodyMarkdown?: string; body?: string | string[] } }).data ?? {
      title: 'Data',
      bodyMarkdown:
        'This page will describe data sources, update cadence, and how pigment and paint records are maintained.',
    };
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-3xl font-bold text-neutral-900 mb-4">
        {dataPage.title}
      </h1>
      <MarkdownBody richText={dataPage.bodyRich} markdown={dataPage.bodyMarkdown} fallbackMarkdown={Array.isArray(dataPage.body) ? dataPage.body.join('\n\n') : dataPage.body} />
    </div>
  );
};
