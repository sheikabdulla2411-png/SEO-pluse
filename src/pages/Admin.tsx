import { useEffect, useState } from 'react';
import { supabase, ADMIN_EMAIL, type Post, type Subscriber } from '@/lib/supabase';
import Seo from '@/components/Seo';
import { slugify, getExcerptFromContent, estimateReadTime, formatDateShort } from '@/lib/utils';
import {
  Lock, LogOut, Plus, Pencil, Trash2, X, Mail, Loader2,
  Check, AlertCircle, Eye, FileText, Users,
} from 'lucide-react';

const CATEGORIES = ['Technical SEO', 'AI Search', 'AEO', 'Analytics', 'Content SEO', 'Link Building'];

type EditPost = {
  id?: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  image_url: string;
  published_date: string;
  read_time: number;
};

const emptyPost: EditPost = {
  title: '',
  slug: '',
  category: CATEGORIES[0],
  excerpt: '',
  content: '',
  image_url: '',
  published_date: new Date().toISOString().slice(0, 10),
  read_time: 1,
};

export default function Admin() {
  const [session, setSession] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [posts, setPosts] = useState<Post[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [editingPost, setEditingPost] = useState<EditPost | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [tab, setTab] = useState<'posts' | 'subscribers'>('posts');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(!!data.session);
      if (data.session?.user?.email === ADMIN_EMAIL) {
        setIsAdmin(true);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(!!sess);
      setIsAdmin(sess?.user?.email === ADMIN_EMAIL);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    fetchPosts();
    fetchSubscribers();
  }, [isAdmin]);

  const fetchPosts = async () => {
    const { data } = await supabase.from('posts').select('*').order('published_date', { ascending: false });
    if (data) setPosts(data);
  };

  const fetchSubscribers = async () => {
    const { data } = await supabase.from('subscribers').select('*').order('subscribed_at', { ascending: false });
    if (data) setSubscribers(data);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      setLoginError('Not authorised.');
      setLoginLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      setLoginError(error.message || 'Invalid credentials.');
    }
    setLoginLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setEditingPost(null);
    setShowForm(false);
  };

  const handleEdit = (post: Post) => {
    setEditingPost({
      id: post.id,
      title: post.title,
      slug: post.slug,
      category: post.category,
      excerpt: post.excerpt || '',
      content: post.content || '',
      image_url: post.image_url || '',
      published_date: post.published_date,
      read_time: post.read_time || 1,
    });
    setShowForm(true);
    setSaveError('');
    setSaveSuccess('');
  };

  const handleNew = () => {
    setEditingPost({ ...emptyPost });
    setShowForm(true);
    setSaveError('');
    setSaveSuccess('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;
    setSaveLoading(true);
    setSaveError('');
    setSaveSuccess('');

    const slug = editingPost.slug || slugify(editingPost.title);
    if (!slug) {
      setSaveError('A title is required to generate a slug.');
      setSaveLoading(false);
      return;
    }

    const excerpt = editingPost.excerpt || getExcerptFromContent(editingPost.content);
    const read_time = editingPost.read_time || estimateReadTime(editingPost.content);

    const payload = {
      title: editingPost.title,
      slug,
      category: editingPost.category,
      excerpt: excerpt.slice(0, 160),
      content: editingPost.content,
      image_url: editingPost.image_url,
      published_date: editingPost.published_date,
      read_time,
    };

    if (editingPost.id) {
      const { error } = await supabase.from('posts').update(payload).eq('id', editingPost.id);
      if (error) {
        setSaveError(error.message);
        setSaveLoading(false);
        return;
      }
      setSaveSuccess('Post updated successfully.');
    } else {
      const { error } = await supabase.from('posts').insert(payload);
      if (error) {
        setSaveError(error.message);
        setSaveLoading(false);
        return;
      }
      setSaveSuccess('Post published successfully.');
    }

    setSaveLoading(false);
    setShowForm(false);
    setEditingPost(null);
    fetchPosts();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (!error) {
      setDeleteConfirm(null);
      fetchPosts();
    }
  };

  // Loading state
  if (session === null) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-accent animate-spin" />
      </div>
    );
  }

  // Logged in but not admin
  if (session && !isAdmin) {
    return (
      <>
        <Seo title="Admin — SEO Pulse" description="Admin access required." canonicalPath="/admin" />
        <div className="max-w-md mx-auto px-5 sm:px-6 pt-20 pb-20 text-center">
          <div className="w-14 h-14 rounded-full bg-error/10 border border-error/30 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-6 h-6 text-error" />
          </div>
          <h1 className="font-display font-bold text-2xl text-white mb-3">Not authorised</h1>
          <p className="text-gray-400 mb-8">You do not have permission to access this area.</p>
          <button onClick={handleLogout} className="btn-secondary">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </>
    );
  }

  // Login form
  if (!session) {
    return (
      <>
        <Seo title="Admin Login — SEO Pulse" description="Admin login for SEO Pulse." canonicalPath="/admin" />
        <div className="max-w-md mx-auto px-5 sm:px-6 pt-20 pb-20">
          <div className="bg-base-700 border border-base-500 rounded-hero p-8">
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-5 h-5 text-accent" />
              </div>
              <h1 className="font-display font-bold text-2xl text-white mb-1">Admin Login</h1>
              <p className="text-sm text-gray-500">Sign in to manage posts and subscribers.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@email.com"
                  className="input-field"
                  required
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field"
                  required
                  autoComplete="current-password"
                />
              </div>

              {loginError && (
                <p className="text-sm text-error flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> {loginError}
                </p>
              )}

              <button type="submit" disabled={loginLoading} className="btn-primary w-full">
                {loginLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-gray-600">
              No public sign-up. Admin access is restricted.
            </p>
          </div>
        </div>
      </>
    );
  }

  // Admin dashboard
  return (
    <>
      <Seo title="Admin Dashboard — SEO Pulse" description="Manage posts and subscribers." canonicalPath="/admin" />
      <div className="max-w-5xl mx-auto px-5 sm:px-6 pt-8 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-2xl text-white mb-1">Dashboard</h1>
            <p className="text-sm text-gray-500">Manage your blog posts and subscribers.</p>
          </div>
          <button onClick={handleLogout} className="btn-secondary text-sm">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-base-500">
          <button
            onClick={() => setTab('posts')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === 'posts'
                ? 'border-accent text-white'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            <FileText className="w-4 h-4" /> Posts
            <span className="text-xs bg-base-600 px-2 py-0.5 rounded-full">{posts.length}</span>
          </button>
          <button
            onClick={() => setTab('subscribers')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === 'subscribers'
                ? 'border-accent text-white'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            <Users className="w-4 h-4" /> Subscribers
            <span className="text-xs bg-base-600 px-2 py-0.5 rounded-full">{subscribers.length}</span>
          </button>
        </div>

        {/* Posts tab */}
        {tab === 'posts' && (
          <div>
            <div className="flex justify-end mb-4">
              <button onClick={handleNew} className="btn-primary text-sm">
                <Plus className="w-4 h-4" /> New Post
              </button>
            </div>

            {posts.length === 0 ? (
              <p className="text-gray-500 text-center py-12">No posts yet. Create your first post.</p>
            ) : (
              <div className="space-y-3">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between gap-4 bg-base-700 border border-base-500 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      {post.image_url && (
                        <img
                          src={post.image_url}
                          alt={post.title}
                          loading="lazy"
                          className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="min-w-0">
                        <h3 className="font-medium text-white text-sm truncate">{post.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                          <span className="category-badge !text-[10px] !px-2 !py-0.5">{post.category}</span>
                          <span>{formatDateShort(post.published_date)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-lg bg-base-600 border border-base-500 flex items-center justify-center text-gray-400 hover:text-accent hover:border-accent/50 transition-all"
                        aria-label="View post"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleEdit(post)}
                        className="w-9 h-9 rounded-lg bg-base-600 border border-base-500 flex items-center justify-center text-gray-400 hover:text-accent hover:border-accent/50 transition-all"
                        aria-label="Edit post"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(post.id)}
                        className="w-9 h-9 rounded-lg bg-base-600 border border-base-500 flex items-center justify-center text-gray-400 hover:text-error hover:border-error/50 transition-all"
                        aria-label="Delete post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Subscribers tab */}
        {tab === 'subscribers' && (
          <div>
            {subscribers.length === 0 ? (
              <p className="text-gray-500 text-center py-12">No subscribers yet.</p>
            ) : (
              <div className="bg-base-700 border border-base-500 rounded-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-base-500 bg-base-800/50">
                  <p className="text-sm text-gray-400">
                    {subscribers.length} subscriber{subscribers.length !== 1 ? 's' : ''} total
                  </p>
                </div>
                <div className="divide-y divide-base-500/50">
                  {subscribers.map((sub) => (
                    <div key={sub.id} className="flex items-center gap-3 px-4 py-3">
                      <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{sub.email}</span>
                      <span className="text-xs text-gray-600 ml-auto">
                        {formatDateShort(sub.subscribed_at.slice(0, 10))}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post form modal */}
      {showForm && editingPost && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center bg-black/60 backdrop-blur-sm overflow-y-auto p-4 sm:p-6">
          <div className="bg-base-700 border border-base-500 rounded-hero w-full max-w-2xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-base-500 sticky top-0 bg-base-700 rounded-t-hero z-10">
              <h2 className="font-display font-bold text-lg text-white">
                {editingPost.id ? 'Edit Post' : 'New Post'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingPost(null);
                }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-base-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Title</label>
                <input
                  type="text"
                  value={editingPost.title}
                  onChange={(e) => {
                    setEditingPost({ ...editingPost, title: e.target.value });
                    if (!editingPost.id) {
                      setEditingPost({ ...editingPost, title: e.target.value, slug: slugify(e.target.value) });
                    }
                  }}
                  className="input-field"
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Slug</label>
                  <input
                    type="text"
                    value={editingPost.slug}
                    onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Category</label>
                  <select
                    value={editingPost.category}
                    onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                    className="input-field"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  Excerpt <span className="text-gray-600">(max 160 chars, auto-generated if empty)</span>
                </label>
                <input
                  type="text"
                  value={editingPost.excerpt}
                  onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                  maxLength={160}
                  className="input-field"
                  placeholder="Auto-generated from content if left empty"
                />
                <p className="text-xs text-gray-600 mt-1">{editingPost.excerpt.length}/160</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Featured Image URL</label>
                <input
                  type="url"
                  value={editingPost.image_url}
                  onChange={(e) => setEditingPost({ ...editingPost, image_url: e.target.value })}
                  className="input-field"
                  placeholder="https://images.pexels.com/..."
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Published Date</label>
                  <input
                    type="date"
                    value={editingPost.published_date}
                    onChange={(e) => setEditingPost({ ...editingPost, published_date: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    Read Time (min) <span className="text-gray-600">(auto if 0)</span>
                  </label>
                  <input
                    type="number"
                    value={editingPost.read_time}
                    min={0}
                    onChange={(e) => setEditingPost({ ...editingPost, read_time: parseInt(e.target.value) || 0 })}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Content (Markdown)</label>
                <textarea
                  value={editingPost.content}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  rows={12}
                  className="input-field font-mono text-sm resize-y"
                  placeholder="# Your post title&#10;&#10;Write your content in markdown..."
                  required
                />
              </div>

              {saveError && (
                <p className="text-sm text-error flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> {saveError}
                </p>
              )}
              {saveSuccess && (
                <p className="text-sm text-success flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> {saveSuccess}
                </p>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingPost(null);
                  }}
                  className="btn-secondary text-sm"
                >
                  Cancel
                </button>
                <button type="submit" disabled={saveLoading} className="btn-primary text-sm">
                  {saveLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : editingPost.id ? 'Save Changes' : 'Publish Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-base-700 border border-base-500 rounded-hero p-6 max-w-sm w-full">
            <div className="w-12 h-12 rounded-full bg-error/10 border border-error/30 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-5 h-5 text-error" />
            </div>
            <h3 className="font-display font-semibold text-lg text-white text-center mb-2">Delete this post?</h3>
            <p className="text-sm text-gray-400 text-center mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="btn-secondary flex-1 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-3 bg-error text-white font-semibold text-sm rounded-lg border border-error hover:bg-error/90 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
