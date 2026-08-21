import { Link } from 'react-router-dom';
import { Activity, Mail, Linkedin, Globe, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-base-500/50 mt-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="max-w-sm">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-accent" strokeWidth={2.5} />
              <span className="font-display font-bold text-white">SEO Pulse</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Daily SEO & AI search insights from a solo practitioner. Built for the
              era of answer engines.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="font-display font-semibold text-sm text-white mb-1">Navigate</h4>
            <Link to="/" className="text-sm text-gray-400 hover:text-accent-light transition-colors">Home</Link>
            <Link to="/blog" className="text-sm text-gray-400 hover:text-accent-light transition-colors">Blog</Link>
            <Link to="/about" className="text-sm text-gray-400 hover:text-accent-light transition-colors">About</Link>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="font-display font-semibold text-sm text-white mb-1">Connect</h4>
            <a href="mailto:sheikabdulla2411@gmail.com" className="text-sm text-gray-400 hover:text-accent-light transition-colors flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" /> Email
            </a>
            <a href="https://www.linkedin.com/in/sheikabdulla-dev/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-accent-light transition-colors flex items-center gap-2">
              <Linkedin className="w-3.5 h-3.5" /> LinkedIn
            </a>
            <a href="https://sheik-dev-shine.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-accent-light transition-colors flex items-center gap-2">
              <Globe className="w-3.5 h-3.5" /> Portfolio
            </a>
            <a href="https://instagram.com/seowithsheik" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-accent-light transition-colors flex items-center gap-2">
              <Instagram className="w-3.5 h-3.5" /> Instagram
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-base-500/30 flex flex-col sm:flex-row justify-between gap-2">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} SEO Pulse. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Practitioner-written. Updated daily.
          </p>
        </div>
      </div>
    </footer>
  );
}
