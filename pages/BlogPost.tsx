import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Clock3, Sparkles } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import blogsContent from '../content/blogs.json';

type BlogArticle = {
  id: string;
  title: string;
  date: string;
  readTime: string;
  category: string;
  excerpt: string;
  highlight?: boolean;
};

type BlogContent = {
  kicker: string;
  intro: string;
  sections: { title: string; body: string }[];
  quote?: string;
  takeaways?: string[];
  next?: string;
};

const blogData = blogsContent as {
  hero: { eyebrow: string; title: string; subtitle: string };
  featured: { title: string; articleId: string };
  articles: BlogArticle[];
};

const articleContent: Record<string, BlogContent> = {
  'reading-pigment-codes': {
    kicker: 'Guide',
    intro:
      'Pigment codes are the fastest way to understand what is actually inside a paint. Once you get used to the shorthand, the brand names become much less important than the chemistry underneath.',
    sections: [
      {
        title: 'Start with the first letters',
        body:
          'PY, PB, PG, PR, PBr, and PV tell you the pigment family. That family often hints at the overall behavior of the paint: how it leans on the color wheel, how strongly it tints, and whether it tends to granulate.',
      },
      {
        title: 'Watch the numbers and suffixes',
        body:
          'The numbers point to the specific pigment. Extra suffixes such as hue, shade, or deep usually signal a mixture or a reformulated color rather than a single-pigment paint.',
      },
      {
        title: 'Use the code to compare brands',
        body:
          'A paint name can be identical across two brands while the pigment recipe is entirely different. The code is the more reliable comparison tool when you are trying to predict performance or consistency.',
      },
    ],
    quote:
      'If the name sells the paint, the pigment code explains it.',
    takeaways: [
      'The code is usually more useful than the marketing name.',
      'Hues are often mixtures, not direct matches to a single pigment.',
      'Same name does not always mean same behavior.',
    ],
    next: 'Next we can prototype a post on single-pigment versus mixed-pigment paints.',
  },
  'granulation-in-watercolour': {
    kicker: 'Materials',
    intro:
      'Granulation is one of those watercolor qualities that looks subtle in a swatch but dramatic in a wash. It gives the paint a textured, mineral feel that can make large passages feel alive.',
    sections: [
      {
        title: 'What granulation actually does',
        body:
          'Granulating pigments settle unevenly as water dries. The result is a visual texture that can read as stone, atmosphere, dust, or depth depending on how the paint is used.',
      },
      {
        title: 'Why it varies so much',
        body:
          'The pigment itself matters, but so do paper texture, pigment load, and how much water sits in the wash. A granulating color can look almost flat on one paper and beautifully mottled on another.',
      },
      {
        title: 'How to use it on purpose',
        body:
          'Rather than treating granulation as a flaw, you can use it as a compositional tool. It is especially effective in skies, stone, foliage, and quiet atmospheric transitions.',
      },
    ],
    quote:
      'Granulation is the paint choosing its own pattern.',
    takeaways: [
      'Granulation depends on both pigment and surface.',
      'Texture is often strongest in larger, wetter passages.',
      'The effect is useful, not accidental.',
    ],
    next: 'Next we can show a side-by-side article prototype with swatch examples and paper notes.',
  },
  'why-swatches-differ': {
    kicker: 'Process',
    intro:
      'Swatches are helpful, but they are not laboratory results. They sit somewhere between reference image and practical guide, which means they always need a little context.',
    sections: [
      {
        title: 'Paper changes everything',
        body:
          'Cold press, hot press, cotton content, absorbency, and surface sizing all affect how a paint spreads and dries. A swatch can never fully capture every paper condition at once.',
      },
      {
        title: 'Light and capture matter too',
        body:
          'Room lighting, camera white balance, scanning, and display calibration all shift what you see. Even a well-made swatch is still a viewing situation, not the paint itself.',
      },
      {
        title: 'Why TintMap keeps them anyway',
        body:
          'The point is not perfect certainty. The point is a useful visual cue that sits alongside pigment codes, transparency, staining, and other data so the user can make a better comparison.',
      },
    ],
    quote:
      'A swatch is a clue, not a verdict.',
    takeaways: [
      'Swatches are useful directional evidence.',
      'Paper and lighting can change the result a lot.',
      'The surrounding paint metadata matters just as much.',
    ],
    next: 'Next we can prototype a swatch-focused article with larger image blocks and notes.',
  },
  'mapping-white-nights': {
    kicker: 'Update',
    intro:
      'Keeping a paint database current is mostly careful linking: matching names, checking files, and making sure the right swatches land on the right rows.',
    sections: [
      {
        title: 'What changed',
        body:
          'A few more White Nights paints and swatches were added, then linked back into the brand and pigment pages so the records and images stay aligned.',
      },
      {
        title: 'Why this matters',
        body:
          'The database is only helpful if the visuals and the text agree. A mismatched swatch is worse than no swatch because it quietly misleads the reader.',
      },
      {
        title: 'How the workflow works',
        body:
          'Update the source data, verify the image paths, check the brand page, and then publish the change. The process is boring on purpose, because reliability is the feature.',
      },
    ],
    quote:
      'Good data work is usually invisible when it works well.',
    takeaways: [
      'Swatches need matching file names and paint rows.',
      'Brand pages should stay consistent with the source data.',
      'Small verification steps prevent misleading results.',
    ],
    next: 'Next we can turn this into a proper changelog-style blog post.',
  },
};

function getBlogContent(article: BlogArticle): BlogContent {
  return articleContent[article.id] ?? {
    kicker: article.category,
    intro: article.excerpt,
    sections: [
      {
        title: 'Prototype section',
        body:
          'This page is intentionally minimal for now. It gives us a concrete article layout to review before we start filling in every post with final copy and images.',
      },
      {
        title: 'Why this layout',
        body:
          'The goal is to keep the article page readable, image-friendly, and easy to extend as the blog grows.',
      },
    ],
    quote: 'A simple article template is the best place to start.',
    takeaways: ['Minimal structure now.', 'More detail later.', 'Easy to extend.'],
    next: 'This post can be expanded once the editorial style is settled.',
  };
}

export const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const article = blogData.articles.find((item) => item.id === id);

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Blog post not found</h1>
        <Link to="/blogs" className="inline-flex items-center gap-2 text-tint-ink font-semibold hover:text-tint-ember">
          <ArrowLeft size={16} />
          Back to Blogs
        </Link>
      </div>
    );
  }

  const content = getBlogContent(article);

  const relatedArticles = blogData.articles.filter((item) => item.id !== article.id).slice(0, 3);

  return (
    <div className="pb-20">
      <section className="relative overflow-hidden border-b border-tint-ink/10 bg-gradient-to-br from-tint-paper via-white to-tint-gold/10 py-16 md:py-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-20 w-[380px] h-[380px] bg-tint-ember/15 rounded-full blur-[90px] mix-blend-multiply"></div>
          <div className="absolute top-16 right-0 w-[320px] h-[320px] bg-tint-teal/15 rounded-full blur-[80px] mix-blend-multiply"></div>
          <div className="absolute inset-0 tm-grid opacity-35"></div>
          <div className="absolute inset-0 tm-noise opacity-35"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <Link to="/blogs" className="inline-flex items-center gap-2 text-sm font-semibold text-tint-ink/80 hover:text-tint-ember transition-colors">
            <ArrowLeft size={16} />
            Back to Blogs
          </Link>

          <div className="mt-6 max-w-4xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-tint-ink/10 bg-white/75 px-4 py-1.5 text-sm font-medium text-neutral-700 shadow-sm backdrop-blur-sm">
              <Sparkles size={14} className="text-tint-ember" />
              {content.kicker}
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-tint-ink leading-[1.05] max-w-3xl">
              {article.title}
            </h1>
            <p className="max-w-2xl text-lg md:text-xl text-neutral-700 leading-relaxed">
              {article.excerpt}
            </p>

            <div className="flex flex-wrap gap-3 text-sm text-neutral-500">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 border border-neutral-200 shadow-sm">
                <CalendarDays size={14} />
                {article.date}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 border border-neutral-200 shadow-sm">
                <Clock3 size={14} />
                {article.readTime}
              </span>
              <Badge variant="outline" className="rounded-full bg-white/80">
                {article.category}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.45fr] gap-8 items-start">
          <article className="space-y-8">
            <Card className="p-6 md:p-8 border-tint-ink/10 bg-white/95 backdrop-blur-sm shadow-sm">
              <p className="text-base md:text-lg leading-relaxed text-neutral-700">{content.intro}</p>
            </Card>

            <div className="space-y-6">
              {content.sections.map((section) => (
                <Card key={section.title} className="p-6 md:p-8 border-tint-ink/10 bg-white/90">
                  <h2 className="text-2xl font-bold font-display text-tint-ink">{section.title}</h2>
                  <p className="mt-4 text-neutral-600 leading-relaxed">{section.body}</p>
                </Card>
              ))}
            </div>

            {content.quote && (
              <Card className="p-6 md:p-8 border-tint-ember/20 bg-gradient-to-br from-tint-ember/10 via-white to-tint-teal/10">
                <p className="text-sm uppercase tracking-[0.24em] text-neutral-500">Key idea</p>
                <blockquote className="mt-3 text-2xl md:text-3xl font-bold font-display text-tint-ink leading-tight">
                  {content.quote}
                </blockquote>
              </Card>
            )}

            {content.takeaways && (
              <Card className="p-6 md:p-8 border-tint-ink/10 bg-tint-ink text-white">
                <p className="text-sm uppercase tracking-[0.24em] text-white/60">Takeaways</p>
                <ul className="mt-4 space-y-3">
                  {content.takeaways.map((item) => (
                    <li key={item} className="flex gap-3 text-white/90">
                      <span className="mt-2 h-2 w-2 rounded-full bg-tint-gold shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {content.next && (
              <Card className="p-6 md:p-8 border-tint-ink/10 bg-white/90">
                <p className="text-sm uppercase tracking-[0.24em] text-neutral-500">Coming next</p>
                <p className="mt-3 text-lg font-semibold text-tint-ink">{content.next}</p>
              </Card>
            )}
          </article>

          <aside className="space-y-6 sticky top-24">
            <Card className="p-6 border-tint-ink/10 bg-white/90">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">Article card</p>
              <h2 className="mt-2 text-2xl font-bold font-display text-tint-ink">{article.title}</h2>
              <p className="mt-3 text-neutral-600 leading-relaxed">{article.excerpt}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-tint-gold/15 text-tint-ink border-tint-gold/30">
                  {article.category}
                </Badge>
                <Badge variant="secondary" className="bg-tint-teal/15 text-tint-ink border-tint-teal/30">
                  Prototype
                </Badge>
              </div>
            </Card>

            <Card className="p-6 border-tint-ink/10 bg-gradient-to-br from-tint-paper to-white">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">Related</p>
              <div className="mt-4 space-y-4">
                {relatedArticles.map((related) => (
                  <Link key={related.id} to={`/blogs/${related.id}`} className="block group">
                    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md">
                      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                        <span>{related.category}</span>
                        <span>•</span>
                        <span>{related.readTime}</span>
                      </div>
                      <h3 className="mt-2 font-semibold text-tint-ink group-hover:text-tint-ember transition-colors">
                        {related.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          </aside>
        </div>
      </section>
    </div>
  );
};
