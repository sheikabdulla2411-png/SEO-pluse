import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Mail, Check, Loader2, AlertCircle } from 'lucide-react';

type Status = 'idle' | 'loading' | 'success' | 'error' | 'duplicate';

export default function Newsletter({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();

    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus('error');
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    const { error } = await supabase.from('subscribers').insert({ email: trimmed });

    if (error) {
      if (error.code === '23505') {
        setStatus('duplicate');
        setErrorMsg("You're already subscribed.");
      } else {
        setStatus('error');
        setErrorMsg('Something went wrong. Please try again.');
      }
      return;
    }

    setStatus('success');
    setEmail('');
  };

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status !== 'idle') setStatus('idle');
              }}
              placeholder="you@email.com"
              className="input-field pl-10"
              disabled={status === 'loading' || status === 'success'}
            />
          </div>
          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="btn-primary whitespace-nowrap"
          >
            {status === 'loading' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : status === 'success' ? (
              <>
                <Check className="w-4 h-4" /> Subscribed
              </>
            ) : (
              'Subscribe'
            )}
          </button>
        </div>
        {status === 'success' && (
          <p className="mt-2 text-sm text-success flex items-center gap-1.5">
            <Check className="w-4 h-4" /> You're subscribed. Watch your inbox for daily insights.
          </p>
        )}
        {status === 'duplicate' && (
          <p className="mt-2 text-sm text-warning flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" /> {errorMsg}
          </p>
        )}
        {status === 'error' && (
          <p className="mt-2 text-sm text-error flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" /> {errorMsg}
          </p>
        )}
      </form>
    );
  }

  return (
    <div className="bg-base-700 border border-base-500 rounded-hero p-8 sm:p-12">
      <div className="max-w-xl mx-auto text-center">
        <h3 className="font-display font-bold text-2xl text-white mb-3">
          Get daily SEO & AI search insights
        </h3>
        <p className="text-gray-400 mb-6">
          One email per day. No fluff. Just what's working in SEO right now —
          straight from a practitioner's desk.
        </p>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status !== 'idle') setStatus('idle');
                }}
                placeholder="you@email.com"
                className="input-field pl-10"
                disabled={status === 'loading' || status === 'success'}
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className="btn-primary whitespace-nowrap"
            >
              {status === 'loading' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : status === 'success' ? (
                <>
                  <Check className="w-4 h-4" /> Subscribed
                </>
              ) : (
                'Subscribe Free'
              )}
            </button>
          </div>
        </form>
        {status === 'success' && (
          <p className="mt-4 text-sm text-success flex items-center justify-center gap-1.5">
            <Check className="w-4 h-4" /> You're subscribed. Watch your inbox for daily insights.
          </p>
        )}
        {status === 'duplicate' && (
          <p className="mt-4 text-sm text-warning flex items-center justify-center gap-1.5">
            <AlertCircle className="w-4 h-4" /> {errorMsg}
          </p>
        )}
        {status === 'error' && (
          <p className="mt-4 text-sm text-error flex items-center justify-center gap-1.5">
            <AlertCircle className="w-4 h-4" /> {errorMsg}
          </p>
        )}
        <p className="mt-4 text-xs text-gray-500">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}
