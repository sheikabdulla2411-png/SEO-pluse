import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, type Post } from '@/lib/supabase';
import Seo from '@/components/Seo';
import ScrollReveal from '@/components/ScrollReveal';
import PostCard from '@/components/PostCard';
import Newsletter from '@/components/Newsletter';
import { ArrowRight, ShieldCheck, CalendarClock, Cpu } from 'lucide-react';

const valueProps = [
  {
    icon: ShieldCheck,
    title: '100% Practitioner-Written',
    description: 'Every article is based on real client work, real audits, and real results — not theory or rewritten tweets.',
  },
  {
    icon: CalendarClock,
    title: 'Updated Daily',
    description: 'SEO and AI search move fast. New insights published every day so you never fall behind the algorithm.',
  },
  {
    icon: Cpu,
    title: 'Built for AI Answer Engines',
    description: 'AEO-first content strategy. I do not just chase rankings — I optimize for AI Overviews, ChatGPT, and Perplexity.',
  },
];

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('published_date', { ascending: false })
        .limit(3);
      if (!error && data) setPosts(data);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SEO Pulse',
    url: window.location.origin,
    description: 'Daily SEO & AI search insights from a solo practitioner.',
  };

  return (
    <>
      <Seo
        title="SEO Pulse — Daily SEO & AI Search Insights"
        description="Daily SEO and AI search insights from a solo practitioner. Technical SEO, AEO, analytics, and strategies for the AI answer engine era."
        jsonLd={jsonLd}
        canonicalPath="/"
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Animated background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-[800px] h-[800px] rounded-full opacity-30 animate-glow-pulse"
            style={{
              background: 'radial-gradient(circle, rgba(0,112,255,0.4) 0%, transparent 60%)',
            }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto px-5 sm:px-6 pt-24 pb-20 sm:pt-32 sm:pb-28 text-center">
          <ScrollReveal>
            <span className="tag-chip mb-6">Daily SEO & AEO Insights</span>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-white tracking-tight mb-6 leading-[1.1]">
              Daily SEO & AI Search Insights
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
              Practitioner-written analysis on technical SEO, AI Overviews, and answer
              engine optimization. No fluff, no recycled content — just what's working
              right now.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <Link to="/blog" className="btn-primary text-base">
              Read Today's Post
              <ArrowRight className="w-4 h-4" />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-base-500/30 bg-base-800/50">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span>100% practitioner-written</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-base-500" />
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <CalendarClock className="w-4 h-4 text-accent" />
            <span>Updated daily</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-base-500" />
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Cpu className="w-4 h-4 text-accent" />
            <span>Built for AI answer engines</span>
          </div>
        </div>
      </section>

      {/* Latest posts */}
      <section className="max-w-6xl mx-auto px-5 sm:px-6 py-16 sm:py-20">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mb-2">
                Latest Posts
              </h2>
              <p className="text-gray-400">Fresh insights, published daily.</p>
            </div>
            <Link to="/blog" className="text-sm text-accent-light hover:text-accent transition-colors flex items-center gap-1 whitespace-nowrap">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-base-700 border border-base-500 rounded-lg overflow-hidden animate-pulse">
                <div className="aspect-[16/10] bg-base-600" />
                <div className="p-5 space-y-3">
                  <div className="h-4 w-20 bg-base-600 rounded" />
                  <div className="h-5 w-full bg-base-600 rounded" />
                  <div className="h-5 w-2/3 bg-base-600 rounded" />
                  <div className="h-3 w-full bg-base-600 rounded" />
                  <div className="h-3 w-1/2 bg-base-600 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <ScrollReveal key={post.id} delay={i * 100}>
                <PostCard post={post} eager={i === 0} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-12">No posts published yet. Check back soon.</p>
        )}
      </section>

      {/* Why this site */}
      <section className="max-w-6xl mx-auto px-5 sm:px-6 py-16 sm:py-20">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mb-2">
              Why This Site
            </h2>
            <p className="text-gray-400">Not another SEO news aggregator.</p>
          </div>
        </ScrollReveal>
        <div className="grid md:grid-cols-3 gap-6">
          {valueProps.map((prop, i) => (
            <ScrollReveal key={prop.title} delay={i * 100}>
              <div className="bg-base-700 border border-base-500 rounded-lg p-6 h-full card-hover">
                <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
                  <prop.icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-display font-semibold text-lg text-white mb-2">
                  {prop.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">{prop.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-6xl mx-auto px-5 sm:px-6 py-16 sm:py-20">
        <ScrollReveal>
          <Newsletter />
        </ScrollReveal>
      </section>
    </>
  );
}
