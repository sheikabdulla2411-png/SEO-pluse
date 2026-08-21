import { useEffect, useState, useMemo } from 'react';
import { supabase, type Post } from '@/lib/supabase';
import Seo from '@/components/Seo';
import ScrollReveal from '@/components/ScrollReveal';
import PostCard from '@/components/PostCard';

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('published_date', { ascending: false });
      if (!error && data) setPosts(data);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(posts.map((p) => p.category));
    return ['All', ...Array.from(cats).sort()];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (activeCategory === 'All') return posts;
    return posts.filter((p) => p.category === activeCategory);
  }, [posts, activeCategory]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'SEO Pulse Blog',
    url: `${window.location.origin}/blog`,
    description: 'Daily SEO and AI search insights, technical SEO guides, and AEO strategies.',
  };

  return (
    <>
      <Seo
        title="Blog — SEO Pulse"
        description="Browse all SEO Pulse articles on technical SEO, AI search, AEO, analytics, and more. Updated daily by a solo practitioner."
        jsonLd={jsonLd}
        canonicalPath="/blog"
      />

      <section className="max-w-6xl mx-auto px-5 sm:px-6 pt-12 pb-8">
        <ScrollReveal>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-white mb-3">
            The Blog
          </h1>
          <p className="text-gray-400 max-w-xl">
            Every article. Newest first. Filter by category to find exactly what you need.
          </p>
        </ScrollReveal>
      </section>

      {/* Category filter */}
      <section className="max-w-6xl mx-auto px-5 sm:px-6 mb-8">
        <ScrollReveal>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-accent text-white border border-accent'
                    : 'bg-base-700 text-gray-400 border border-base-500 hover:border-accent/50 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Posts grid */}
      <section className="max-w-6xl mx-auto px-5 sm:px-6 pb-16">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-base-700 border border-base-500 rounded-lg overflow-hidden animate-pulse">
                <div className="aspect-[16/10] bg-base-600" />
                <div className="p-5 space-y-3">
                  <div className="h-4 w-20 bg-base-600 rounded" />
                  <div className="h-5 w-full bg-base-600 rounded" />
                  <div className="h-3 w-full bg-base-600 rounded" />
                  <div className="h-3 w-1/2 bg-base-600 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post, i) => (
              <ScrollReveal key={post.id} delay={(i % 3) * 100}>
                <PostCard post={post} eager={i < 3} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500">
              {activeCategory === 'All'
                ? 'No posts published yet. Check back soon.'
                : `No posts in "${activeCategory}" yet.`}
            </p>
          </div>
        )}
      </section>
    </>
  );
}
