create or replace function public.set_news_posts_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create policy "No direct access to news admin list"
on public.news_admins for select to authenticated
using (false);
