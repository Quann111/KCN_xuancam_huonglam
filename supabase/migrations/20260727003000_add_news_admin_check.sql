create or replace function public.is_news_admin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select private.is_news_admin();
$$;

revoke all on function public.is_news_admin() from public;
grant execute on function public.is_news_admin() to authenticated;
