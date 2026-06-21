import React from 'react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';

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

function normalizeMarkdown(markdown: string | string[] | undefined): string {
  const source = Array.isArray(markdown) ? markdown.join('\n\n') : markdown ?? '';

  return source
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trimStart())
    .join('\n');
}

function hasRenderableRichText(content: unknown): boolean {
  return typeof content === 'object' && content !== null && (!Array.isArray(content) || content.length > 0);
}

type MarkdownBodyProps = {
  richText?: unknown;
  markdown?: string | string[];
  fallbackMarkdown?: string;
  className?: string;
};

export const MarkdownBody: React.FC<MarkdownBodyProps> = ({
  richText,
  markdown,
  fallbackMarkdown,
  className = 'text-neutral-600 leading-relaxed',
}) => {
  const markdownSource =
    typeof richText === 'string' && richText.trim().length > 0
      ? richText
      : normalizeMarkdown(markdown) || normalizeMarkdown(fallbackMarkdown);
  const normalizedMarkdown = normalizeMarkdown(markdownSource);

  return (
    <div className={className}>
      {hasRenderableRichText(richText) ? (
        <TinaMarkdown content={richText as any} components={markdownComponents} />
      ) : (
        <ReactMarkdown remarkPlugins={[remarkBreaks]} components={markdownComponents}>
          {normalizedMarkdown}
        </ReactMarkdown>
      )}
    </div>
  );
};
