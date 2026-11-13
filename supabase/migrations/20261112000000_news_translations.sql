alter table public.news_posts
  add column if not exists translations jsonb not null default '{}'::jsonb;

comment on column public.news_posts.translations is 'Localized news fields keyed by en, ko, ja, zh; each value may include manual boolean.';
