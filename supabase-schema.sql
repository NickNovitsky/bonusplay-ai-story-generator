-- Supabase DB Schema for BonusPlay

-- Table to store generated books
create table books (
  id uuid primary key default gen_random_uuid(),
  title text,
  idea text,
  gpt_output json,
  cover_image_url text,
  description text,
  text text,
  pdf_url text,
  image_urls json,
  is_paid boolean default false,
  user_email text,
  created_at timestamp default now()
);

-- Table to store preview usage logs
create table usage_logs (
  id uuid default gen_random_uuid() primary key,
  ip text,
  action text,
  score numeric,
  timestamp timestamp default now()
);

-- Table to store abuse flag data
create table abuse_flags (
  id uuid default gen_random_uuid() primary key,
  ip text unique,
  flag_count integer default 1,
  last_flagged timestamp default now(),
  blocked boolean default false
);

-- Table to store referrals
create table referrals (
  id uuid default gen_random_uuid() primary key,
  ref_code text,
  referred_email text,
  paid boolean default false,
  created_at timestamp default now()
);
