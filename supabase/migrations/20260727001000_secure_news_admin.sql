create schema if not exists private;
revoke all on schema private from public;

create table if not exists public.news_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

revoke all on public.news_admins from anon, authenticated;
alter table public.news_admins enable row level security;

create or replace function private.is_news_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.news_admins
    where user_id = (select auth.uid())
  );
$$;

revoke all on function private.is_news_admin() from public;
grant usage on schema private to authenticated;
grant execute on function private.is_news_admin() to authenticated;

drop policy if exists "Authenticated users can read news" on public.news_posts;
drop policy if exists "Authenticated users can create news" on public.news_posts;
drop policy if exists "Authenticated users can update news" on public.news_posts;
drop policy if exists "Authenticated users can delete news" on public.news_posts;

create policy "News admins can read all news"
on public.news_posts for select to authenticated
using ((select private.is_news_admin()));

create policy "News admins can create news"
on public.news_posts for insert to authenticated
with check ((select private.is_news_admin()));

create policy "News admins can update news"
on public.news_posts for update to authenticated
using ((select private.is_news_admin()))
with check ((select private.is_news_admin()));

create policy "News admins can delete news"
on public.news_posts for delete to authenticated
using ((select private.is_news_admin()));

drop policy if exists "Public reads news images" on storage.objects;
drop policy if exists "Authenticated users read news images" on storage.objects;
drop policy if exists "Authenticated users upload news images" on storage.objects;
drop policy if exists "Authenticated users update news images" on storage.objects;
drop policy if exists "Authenticated users delete news images" on storage.objects;

create policy "News admins upload news images"
on storage.objects for insert to authenticated
with check (bucket_id = 'news-images' and (select private.is_news_admin()));

create policy "News admins update news images"
on storage.objects for update to authenticated
using (bucket_id = 'news-images' and (select private.is_news_admin()))
with check (bucket_id = 'news-images' and (select private.is_news_admin()));

create policy "News admins delete news images"
on storage.objects for delete to authenticated
using (bucket_id = 'news-images' and (select private.is_news_admin()));
