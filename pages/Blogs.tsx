import React from 'react';
import { ArrowRight, CalendarDays, Clock3, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
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

const blogData = blogsContent as {
  hero: { eyebrow: string; title: string; subtitle: string };
  featured: { title: string; articleId: string };
  articles: BlogArticle[];
};

export const Blogs: React.FC = () => {
  const featuredArticle = blogData.articles.find((article) => article.id === blogData.featured.articleId) ?? blogData.articles[0];
  const otherArticles = blogData.articles.filter((article) => article.id !== featuredArticle.id);

  return (
    <div className="pb-20">
      <section className="relative overflow-hidden border-b border-tint-ink/10 bg-gradient-to-br from-tint-paper via-white to-tint-gold/10 py-20 md:py-28">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-28 -left-20 w-[420px] h-[420px] bg-tint-ember/15 rounded-full blur-[90px] mix-blend-multiply"></div>
          <div className="absolute top-16 right-0 w-[340px] h-[340px] bg-tint-teal/15 rounded-full blur-[80px] mix-blend-multiply"></div>
          <div className="absolute inset-0 tm-grid opacity-35"></div>
          <div className="absolute inset-0 tm-noise opacity-35"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-tint-ink/10 bg-white/75 px-4 py-1.5 text-sm font-medium text-neutral-700 shadow-sm backdrop-blur-sm mb-6">
              <Sparkles size={14} className="text-tint-ember" />
              {blogData.hero.eyebrow}
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-tint-ink leading-[1.05] max-w-3xl">
              {blogData.hero.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg md:text-xl text-neutral-700 leading-relaxed">
              {blogData.hero.subtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-8">
          <Link to={`/blogs/${featuredArticle.id}`} className="block group h-full">
          <Card className="overflow-hidden border-tint-ink/10 bg-white/90 backdrop-blur-sm h-full transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
            <div className="p-8 md:p-10 space-y-6">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                    {blogData.featured.title}
                  </p>
                  <h2 className="mt-2 text-3xl md:text-4xl font-bold font-display text-tint-ink">
                    {featuredArticle.title}
                  </h2>
                </div>
                <Badge variant="secondary" className="bg-tint-ember/10 text-tint-ember border-tint-ember/20">
                  Featured
                </Badge>
              </div>

              <p className="max-w-2xl text-neutral-600 leading-relaxed text-lg">
                {featuredArticle.excerpt}
              </p>

              <div className="flex flex-wrap gap-3 text-sm text-neutral-500">
                <span className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1.5">
                  <CalendarDays size={14} />
                  {featuredArticle.date}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1.5">
                  <Clock3 size={14} />
                  {featuredArticle.readTime}
                </span>
                <Badge variant="outline" className="rounded-full">
                  {featuredArticle.category}
                </Badge>
              </div>

              <div className="pt-4">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-tint-ink hover:text-tint-ember transition-colors">
                  Read article <ArrowRight size={16} />
                </span>
              </div>
            </div>
          </Card>
          </Link>

          <Card className="border-tint-ink/10 bg-tint-ink text-white overflow-hidden">
            <div className="p-8 md:p-10 space-y-6">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">What this page is</p>
                <h3 className="text-2xl font-bold font-display">Short notes for curious painters.</h3>
                <p className="text-sm leading-relaxed text-white/75 max-w-sm">
                  TintMap Journal is where we collect small, useful essays about pigment behavior, brand research, and the work of keeping the atlas tidy.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-white/55">Focus</p>
                  <p className="mt-2 text-sm font-semibold">Pigment behavior, swatches, and brand updates</p>
                </div>
                <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-white/55">Style</p>
                  <p className="mt-2 text-sm font-semibold">Brief, practical, and easy to scan</p>
                </div>
              </div>

              <div className="rounded-2xl bg-white text-tint-ink p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Coming next</p>
                <h4 className="mt-2 text-xl font-bold font-display leading-tight">
                  Comparing swatches across paper, light, and scan settings
                </h4>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                  This post will explain why two swatches can tell different stories, even when they come from the same paint and the same brand.
                </p>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="rounded-xl bg-tint-paper px-3 py-2">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Paper</p>
                    <p className="mt-1 text-sm font-semibold">Surface texture</p>
                  </div>
                  <div className="rounded-xl bg-tint-paper px-3 py-2">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Light</p>
                    <p className="mt-1 text-sm font-semibold">Viewing conditions</p>
                  </div>
                  <div className="rounded-xl bg-tint-paper px-3 py-2">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Scan</p>
                    <p className="mt-1 text-sm font-semibold">Image consistency</p>
                  </div>
                </div>
                <Link
                  to="/info/about"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-tint-ink hover:text-tint-ember transition-colors"
                >
                  About TintMap <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20">
        <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">Articles</p>
            <h2 className="mt-2 text-2xl md:text-3xl font-bold font-display text-tint-ink">More from the journal</h2>
          </div>
          <p className="text-sm text-neutral-500 max-w-md">
            The page is intentionally lightweight for now, so we can add posts without adding complexity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {otherArticles.map((article, index) => (
            <Link key={article.id} to={`/blogs/${article.id}`} className="block group">
              <Card
                className={`h-full p-6 md:p-7 border-tint-ink/10 hover:shadow-md transition-all duration-300 hover:-translate-y-1 ${
                  index === 0 ? 'bg-white' : 'bg-white/90'
                }`}
              >
              <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                <Badge variant="secondary" className="bg-tint-gold/15 text-tint-ink border-tint-gold/30">
                  {article.category}
                </Badge>
                <div className="flex items-center gap-3 text-xs text-neutral-500">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays size={12} />
                    {article.date}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 size={12} />
                    {article.readTime}
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-tint-ink leading-snug">{article.title}</h3>
              <p className="mt-3 text-neutral-600 leading-relaxed">{article.excerpt}</p>

              <div className="mt-5">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-tint-ink/80 group-hover:text-tint-ember transition-colors">
                  Coming soon <ArrowRight size={15} />
                </span>
              </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};
