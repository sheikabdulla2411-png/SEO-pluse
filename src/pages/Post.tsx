import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { supabase, type Post } from '@/lib/supabase';
import Seo from '@/components/Seo';
import ScrollReveal from '@/components/ScrollReveal';
import ReadingProgress from '@/components/ReadingProgress';
import PostCard from '@/components/PostCard';
import { formatDate, extractHeadings, extractFAQ, extractKeyTakeaway, slugify } from '@/lib/utils';
import DirectAnswerBox from '@/components/DirectAnswerBox';
import { Clock, Calendar, ArrowLeft, ArrowRight, Share2, ChevronRight } from 'lucide-react';

export default function Post() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [related, setRelated] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeHeading, setActiveHeading] = useState<string>('');
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setPost(null);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (!error && data) {
        setPost(data);
        const { data: relatedData } = await supabase
          .from('posts')
          .select('*')
          .eq('category', data.category)
          .neq('id', data.id)
          .order('published_date', { ascending: false })
          .limit(2);
        if (relatedData && relatedData.length > 0) {
          setRelated(relatedData);
        } else {
          const { data: fallback } = await supabase
            .from('posts')
            .select('*')
            .neq('id', data.id)
            .order('published_date', { ascending: false })
            .limit(2);
          setRelated(fallback || []);
        }
      }
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  // Scroll spy for TOC
  useEffect(() => {
    if (!post || !post.content) return;
    const headings = extractHeadings(post.content);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -70% 0px' }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [post]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-5 sm:px-6 pt-12 pb-20">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-24 bg-base-600 rounded" />
          <div className="h-10 w-full bg-base-600 rounded" />
          <div className="h-10 w-2/3 bg-base-600 rounded" />
          <div className="aspect-[16/9] bg-base-600 rounded-hero" />
          <div className="space-y-3 pt-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-4 w-full bg-base-600 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-5 sm:px-6 pt-20 pb-20 text-center">
        <h1 className="font-display font-bold text-2xl text-white mb-4">Post not found</h1>
        <p className="text-gray-400 mb-8">The article you're looking for doesn't exist or has been removed.</p>
        <Link to="/blog" className="btn-primary">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
      </div>
    );
  }

  const headings = extractHeadings(post.content || '');
  const faqs = extractFAQ(post.content || '');
  const shareUrl = encodeURIComponent(`${window.location.origin}/blog/${post.slug}`);
  const shareText = encodeURIComponent(post.title);

  const keyTakeaway = extractKeyTakeaway(post.content || '');

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || '',
    image: post.image_url || '',
    datePublished: post.published_date,
    dateModified: post.created_at,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${window.location.origin}/blog/${post.slug}`,
    },
    author: {
      '@type': 'Person',
      name: 'Sheik Abdulla',
      jobTitle: 'SEO & Digital Marketing Specialist',
      url: 'https://seopulse-sheik.netlify.app/about',
      sameAs: [
        'https://www.linkedin.com/in/sheikabdulla-dev/',
        'https://github.com/sheikabdulla',
      ],
    },
    publisher: {
      '@type': 'Organization',
      name: 'SEO Pulse',
      url: 'https://seopulse-sheik.netlify.app',
      logo: {
        '@type': 'ImageObject',
        url: `${window.location.origin}/favicon.svg`,
      },
    },
  };

  const faqJsonLd =
    faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.answer,
            },
          })),
        }
      : undefined;

  const jsonLd = faqJsonLd ? [articleJsonLd, faqJsonLd] : articleJsonLd;

  return (
    <>
      <ReadingProgress />
      <Seo
        title={post.title}
        description={post.excerpt || post.title}
        ogImage={post.image_url || ''}
        ogType="article"
        jsonLd={jsonLd}
        canonicalPath={`/blog/${post.slug}`}
      />

      {/* Breadcrumb */}
      <div className="max-w-3xl mx-auto px-5 sm:px-6 pt-8">
        <nav className="flex items-center gap-1.5 text-xs text-gray-500">
          <Link to="/" className="hover:text-accent-light transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/blog" className="hover:text-accent-light transition-colors">Blog</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-400 truncate max-w-[200px]">{post.category}</span>
        </nav>
      </div>

      {/* Header */}
      <article className="max-w-3xl mx-auto px-5 sm:px-6 pt-6">
        <ScrollReveal>
          <span className="category-badge mb-4">{post.category}</span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-white mb-4 leading-tight tracking-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> {formatDate(post.published_date)}
            </span>
            {post.read_time && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> {post.read_time} min read
              </span>
            )}
          </div>
        </ScrollReveal>

        {/* Featured image */}
        <ScrollReveal>
          <div className="aspect-[16/9] rounded-hero overflow-hidden border border-base-500 mb-8">
            <img
              src={post.image_url || ''}
              alt={post.title}
              loading="eager"
              fetchPriority="high"
              className="w-full h-full object-cover"
            />
          </div>
        </ScrollReveal>

        {/* Share button */}
        <div className="flex items-center gap-3 mb-8">
          <a
            href={`https://wa.me/?text=${shareText}%20${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-sm"
          >
            <Share2 className="w-4 h-4" /> Share to WhatsApp
          </a>
        </div>

        {/* Content with TOC */}
        <div className="grid lg:grid-cols-[1fr_220px] gap-8">
          <div ref={contentRef} className="min-w-0">
            <div className="prose-custom">
              <DirectAnswerBox text={keyTakeaway} />
              <ReactMarkdown
                components={{
                  h2: ({ children }) => {
                    const text = String(children);
                    return <h2 id={slugify(text)}>{children}</h2>;
                  },
                  h3: ({ children }) => {
                    const text = String(children);
                    return <h3 id={slugify(text)}>{children}</h3>;
                  },
                }}
              >
                {post.content || ''}
              </ReactMarkdown>
            </div>

            {/* FAQ section */}
            {faqs.length > 0 && (
              <div className="mt-12 pt-8 border-t border-base-500">
                <h2 className="font-display font-bold text-2xl text-white mb-6">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {faqs.map((faq, i) => (
                    <div key={i} className="bg-base-700 border border-base-500 rounded-lg p-5">
                      <h3 className="font-display font-semibold text-white mb-2">{faq.question}</h3>
                      <p className="text-sm text-gray-400 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Back to blog */}
            <div className="mt-12 pt-8 border-t border-base-500">
              <Link to="/blog" className="text-sm text-accent-light hover:text-accent transition-colors flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Back to all posts
              </Link>
            </div>
          </div>

          {/* Sticky TOC */}
          {headings.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Table of Contents
                </h4>
                <nav className="space-y-1">
                  {headings.map((h) => (
                    <a
                      key={h.id}
                      href={`#${h.id}`}
                      className={`block text-sm transition-colors ${
                        h.level === 3 ? 'pl-4' : ''
                      } ${
                        activeHeading === h.id
                          ? 'text-accent-light font-medium'
                          : 'text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      {h.text}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}
        </div>
      </article>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="max-w-6xl mx-auto px-5 sm:px-6 mt-16 pb-8">
          <ScrollReveal>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-2xl text-white">Continue Reading</h2>
              <Link to="/blog" className="text-sm text-accent-light hover:text-accent transition-colors flex items-center gap-1">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-6">
            {related.map((p, i) => (
              <ScrollReveal key={p.id} delay={i * 100}>
                <PostCard post={p} />
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
