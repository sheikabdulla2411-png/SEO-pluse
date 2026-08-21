import Seo from '@/components/Seo';
import ScrollReveal from '@/components/ScrollReveal';
import { Mail, Linkedin, Globe, Instagram, Award, TrendingUp, Wrench, Target, Eye } from 'lucide-react';

const credentials = [
  {
    title: 'Google Digital Marketing Certification',
    description: 'Verified expertise in Google Ads, Display, Video, Shopping, and measurement.',
  },
  {
    title: 'GA4 Certification',
    description: 'Certified in Google Analytics 4 setup, event tracking, and reporting.',
  },
];

const proofOfWork = [
  'Grew blog indexed pages from 4 to 7 in Google Search Console',
  'Successfully requested manual indexing for key pages via GSC',
  'Ran full Screaming Frog + PageSpeed Insights audits identifying 30+ issues',
  'Achieved AI Overview appearance for target query within 30 days',
];

const tools = [
  'GSC', 'GA4', 'Screaming Frog', 'Ahrefs', 'Schema Markup',
  'Technical SEO', 'AEO', 'PageSpeed Insights', 'Google Tag Manager',
];

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Sheik Abdulla',
  jobTitle: 'SEO Executive · Technical SEO & AEO',
  email: 'sheikabdulla2411@gmail.com',
  url: window.location.origin + '/about',
  sameAs: [
    'https://www.linkedin.com/in/sheikabdulla-dev/',
    'https://sheik-dev-shine.netlify.app/',
    'https://instagram.com/seowithsheik',
  ],
};

export default function About() {
  return (
    <>
      <Seo
        title="About — SEO Pulse"
        description="Sheik Abdulla — SEO Executive specializing in Technical SEO & AEO. Learn about the practitioner behind SEO Pulse, their credentials, and proof of work."
        jsonLd={personJsonLd}
        canonicalPath="/about"
      />

      {/* Profile header */}
      <section className="max-w-3xl mx-auto px-5 sm:px-6 pt-12 pb-8 text-center">
        <ScrollReveal>
          <div className="inline-block mb-6">
            <img
              src="/new_bccc-removebg-preview.png"
              alt="Sheik Abdulla — SEO Executive"
              loading="eager"
              fetchPriority="high"
              width={112}
              height={112}
              className="w-28 h-28 rounded-full object-cover border-2 border-accent/30 shadow-lg shadow-accent/10"
            />
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-white mb-2">
            Sheik Abdulla
          </h1>
          <p className="text-accent-light font-medium mb-6">
            SEO Executive · Technical SEO & AEO
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="mailto:sheikabdulla2411@gmail.com"
              className="w-10 h-10 rounded-lg bg-base-700 border border-base-500 flex items-center justify-center text-gray-400 hover:text-accent hover:border-accent/50 transition-all"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/sheikabdulla-dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-lg bg-base-700 border border-base-500 flex items-center justify-center text-gray-400 hover:text-accent hover:border-accent/50 transition-all"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://sheik-dev-shine.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-lg bg-base-700 border border-base-500 flex items-center justify-center text-gray-400 hover:text-accent hover:border-accent/50 transition-all"
              aria-label="Portfolio"
            >
              <Globe className="w-4 h-4" />
            </a>
            <a
              href="https://instagram.com/seowithsheik"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-lg bg-base-700 border border-base-500 flex items-center justify-center text-gray-400 hover:text-accent hover:border-accent/50 transition-all"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </ScrollReveal>
      </section>

      {/* Mission */}
      <section className="max-w-3xl mx-auto px-5 sm:px-6 py-10">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-accent" />
            </div>
            <h2 className="font-display font-bold text-2xl text-white">Mission</h2>
          </div>
          <p className="text-gray-400 leading-relaxed text-lg">
            To bridge the gap between traditional SEO and the AI search era. I help
            websites get found not just in Google's blue links, but in AI Overviews,
            ChatGPT responses, and the next generation of answer engines. Every insight
            published here is tested on real sites before it reaches you.
          </p>
        </ScrollReveal>
      </section>

      {/* About the Author */}
      <section className="max-w-3xl mx-auto px-5 sm:px-6 py-10">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
              <Eye className="w-5 h-5 text-accent" />
            </div>
            <h2 className="font-display font-bold text-2xl text-white">About the Author</h2>
          </div>
          <div className="space-y-4 text-gray-400 leading-relaxed">
            <p>
              I am an SEO Executive with a unique dual background in both search engine
              optimization and software development. This combination lets me approach
              SEO from both the marketing side and the technical side — I do not just
              write meta tags, I understand the code, the crawl budget, and the rendering
              pipeline behind them.
            </p>
            <p>
              My software development experience means I can read and write code, build
              custom SEO tools, automate audits, and implement technical fixes that most
              SEOs have to outsource to developers. From schema markup to server-side
              rendering to Core Web Vitals optimization, I handle the full stack of
              technical SEO.
            </p>
            <p>
              I started SEO Pulse because the SEO industry is full of recycled advice and
              theoretical strategies. This site is my commitment to publishing only what
              I have personally tested and verified through real client work.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* Credentials */}
      <section className="max-w-3xl mx-auto px-5 sm:px-6 py-10">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
              <Award className="w-5 h-5 text-accent" />
            </div>
            <h2 className="font-display font-bold text-2xl text-white">Credentials</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {credentials.map((cred) => (
              <div key={cred.title} className="bg-base-700 border border-base-500 rounded-lg p-5 card-hover">
                <h3 className="font-display font-semibold text-white mb-2">{cred.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{cred.description}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Proof of Work */}
      <section className="max-w-3xl mx-auto px-5 sm:px-6 py-10">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <h2 className="font-display font-bold text-2xl text-white">Proof of Work</h2>
          </div>
          <div className="space-y-3">
            {proofOfWork.map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-base-700 border border-base-500 rounded-lg p-4">
                <div className="w-6 h-6 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-accent text-xs font-bold">{i + 1}</span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Tools & Skills */}
      <section className="max-w-3xl mx-auto px-5 sm:px-6 py-10 pb-16">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-accent" />
            </div>
            <h2 className="font-display font-bold text-2xl text-white">Tools & Skills</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {tools.map((tool) => (
              <span key={tool} className="tag-chip">
                {tool}
              </span>
            ))}
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
