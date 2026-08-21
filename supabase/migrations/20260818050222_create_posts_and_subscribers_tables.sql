/*
# Create posts and subscribers tables for SEO Pulse blog

1. New Tables
- `posts`: Stores blog posts with title, slug, category, excerpt, markdown content, featured image, published date, and read time.
  - `id` (uuid, primary key, auto-generated)
  - `title` (text, not null) — post title
  - `slug` (text, unique, not null) — URL-friendly identifier used in /blog/[slug]
  - `category` (text, not null) — category tag (e.g. "Technical SEO", "AEO", "AI Search")
  - `excerpt` (text, max 160 chars) — short summary for cards and meta description
  - `content` (text, markdown) — full post body in markdown
  - `image_url` (text) — featured image URL
  - `published_date` (date, not null) — date the post was published
  - `read_time` (integer) — estimated read time in minutes
  - `created_at` (timestamptz, default now()) — record creation timestamp
- `subscribers`: Stores newsletter subscriber emails.
  - `id` (uuid, primary key, auto-generated)
  - `email` (text, unique, not null) — subscriber email address
  - `subscribed_at` (timestamptz, default now()) — subscription timestamp

2. Security
- `posts` table:
  - RLS enabled.
  - SELECT: public (anon + authenticated) — blog is publicly readable.
  - INSERT/UPDATE/DELETE: authenticated AND email must be sheikabdulla2411@gmail.com — only the single admin can manage posts.
- `subscribers` table:
  - RLS enabled.
  - INSERT: public (anon + authenticated) — anyone can subscribe to the newsletter.
  - SELECT: authenticated AND email must be sheikabdulla2411@gmail.com — only admin can view subscriber list.
  - No UPDATE or DELETE policies — subscribers are append-only from the public side.

3. Important Notes
- The email-based check in RLS policies ensures that even if another account is created (via Supabase API or otherwise), it cannot read subscribers or manage posts. Only sheikabdulla2411@gmail.com has those privileges.
- The `auth.jwt() ->> 'email'` expression reads the email from the signed JWT, which cannot be forged by the client.
- An index on `slug` ensures fast lookups for single post pages.
- An index on `published_date DESC` ensures efficient "newest first" queries for the blog listing and homepage.
*/

CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  category text NOT NULL,
  excerpt text CHECK (char_length(excerpt) <= 160),
  content text,
  image_url text,
  published_date date NOT NULL,
  read_time integer,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published_date ON posts(published_date DESC);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_posts" ON posts;
CREATE POLICY "public_read_posts"
ON posts FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_posts" ON posts;
CREATE POLICY "admin_insert_posts"
ON posts FOR INSERT
TO authenticated WITH CHECK (auth.jwt() ->> 'email' = 'sheikabdulla2411@gmail.com');

DROP POLICY IF EXISTS "admin_update_posts" ON posts;
CREATE POLICY "admin_update_posts"
ON posts FOR UPDATE
TO authenticated USING (auth.jwt() ->> 'email' = 'sheikabdulla2411@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'sheikabdulla2411@gmail.com');

DROP POLICY IF EXISTS "admin_delete_posts" ON posts;
CREATE POLICY "admin_delete_posts"
ON posts FOR DELETE
TO authenticated USING (auth.jwt() ->> 'email' = 'sheikabdulla2411@gmail.com');

CREATE TABLE IF NOT EXISTS subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  subscribed_at timestamptz DEFAULT now()
);

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_subscribers" ON subscribers;
CREATE POLICY "public_insert_subscribers"
ON subscribers FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_read_subscribers" ON subscribers;
CREATE POLICY "admin_read_subscribers"
ON subscribers FOR SELECT
TO authenticated USING (auth.jwt() ->> 'email' = 'sheikabdulla2411@gmail.com');