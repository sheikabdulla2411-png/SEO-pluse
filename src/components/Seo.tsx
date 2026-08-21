import { useEffect } from 'react';

type Props = {
  title: string;
  description: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: object | object[];
  canonicalPath?: string;
};

export default function Seo({
  title,
  description,
  ogImage = 'https://images.pexels.com/photos/577195/pexels-photo-577195.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ogType = 'website',
  jsonLd,
  canonicalPath,
}: Props) {
  useEffect(() => {
    const fullTitle = title.includes('SEO Pulse') ? title : `${title} — SEO Pulse`;
    document.title = fullTitle;

    const ensureMeta = (attr: 'name' | 'property', key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    ensureMeta('name', 'description', description);
    ensureMeta('property', 'og:title', fullTitle);
    ensureMeta('property', 'og:description', description);
    ensureMeta('property', 'og:image', ogImage);
    ensureMeta('property', 'og:type', ogType);
    ensureMeta('name', 'twitter:card', 'summary_large_image');
    ensureMeta('name', 'twitter:title', fullTitle);
    ensureMeta('name', 'twitter:description', description);
    ensureMeta('name', 'twitter:image', ogImage);

    let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    const origin = window.location.origin;
    canonicalEl.setAttribute('href', canonicalPath ? `${origin}${canonicalPath}` : window.location.href);

    const existingScripts = document.querySelectorAll('script[data-json-ld]');
    existingScripts.forEach((s) => s.remove());

    if (jsonLd) {
      const script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-json-ld', 'true');
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      const scripts = document.querySelectorAll('script[data-json-ld]');
      scripts.forEach((s) => s.remove());
    };
  }, [title, description, ogImage, ogType, jsonLd, canonicalPath]);

  return null;
}
