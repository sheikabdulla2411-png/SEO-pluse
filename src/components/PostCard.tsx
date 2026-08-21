import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import type { Post } from '@/lib/supabase';
import { formatDateShort } from '@/lib/utils';

type Props = {
  post: Post;
  featured?: boolean;
  eager?: boolean;
};

export default function PostCard({ post, featured = false, eager = false }: Props) {
  if (featured) {
    return (
      <Link
        to={`/blog/${post.slug}`}
        className="group block bg-base-700 border border-base-500 rounded-hero overflow-hidden card-hover"
      >
        <div className="grid md:grid-cols-2 gap-0">
          <div className="aspect-[16/10] md:aspect-auto overflow-hidden">
            <img
              src={post.image_url || ''}
              alt={post.title}
              loading={eager ? 'eager' : 'lazy'}
              fetchPriority={eager ? 'high' : 'auto'}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="p-6 sm:p-8 flex flex-col justify-center">
            <span className="category-badge mb-4">{post.category}</span>
            <h2 className="font-display font-bold text-2xl text-white mb-3 leading-tight group-hover:text-accent-light transition-colors">
              {post.title}
            </h2>
            <p className="text-gray-400 mb-4 line-clamp-2">{post.excerpt}</p>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>{formatDateShort(post.published_date)}</span>
              {post.read_time && (
                <>
                  <span className="w-1 h-1 rounded-full bg-gray-600" />
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {post.read_time} min read
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group block bg-base-700 border border-base-500 rounded-lg overflow-hidden card-hover"
    >
      <div className="aspect-[16/10] overflow-hidden">
        <img
          src={post.image_url || ''}
          alt={post.title}
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : 'auto'}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <span className="category-badge mb-3">{post.category}</span>
        <h3 className="font-display font-semibold text-lg text-white mb-2 leading-tight group-hover:text-accent-light transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">{post.excerpt}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{formatDateShort(post.published_date)}</span>
            {post.read_time && (
              <>
                <span className="w-1 h-1 rounded-full bg-gray-600" />
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {post.read_time} min
                </span>
              </>
            )}
          </div>
          <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-accent group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Link>
  );
}
