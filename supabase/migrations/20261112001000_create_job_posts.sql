create table if not exists public.job_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  location text not null default '',
  employment_type text not null default 'full_time',
  description text not null default '',
  sort_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  translations jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.job_posts enable row level security;

create policy "job posts published are public" on public.job_posts
  for select to anon using (status = 'published');
create policy "job posts admins manage" on public.job_posts
  for all to authenticated using (private.is_news_admin()) with check (private.is_news_admin());

create or replace function public.touch_job_posts_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;
drop trigger if exists job_posts_updated_at on public.job_posts;
create trigger job_posts_updated_at before update on public.job_posts
for each row execute function public.touch_job_posts_updated_at();

insert into public.job_posts (title, location, employment_type, description, sort_order, status)
values
 ('Kỹ sư hạ tầng kỹ thuật', 'Bắc Giang', 'full_time', 'Phụ trách theo dõi, phối hợp triển khai và nghiệm thu các hạng mục hạ tầng kỹ thuật trong khu công nghiệp.', 1, 'published'),
 ('Chuyên viên kinh doanh BĐS KCN', 'Hà Nội / Bắc Giang', 'full_time', 'Phát triển khách hàng, tư vấn mặt bằng và đồng hành cùng doanh nghiệp trong quá trình khảo sát đầu tư.', 2, 'published'),
 ('Chuyên viên pháp lý dự án', 'Bắc Giang', 'full_time', 'Theo dõi hồ sơ pháp lý dự án, phối hợp với các đơn vị tư vấn và cập nhật tiến độ thủ tục.', 3, 'published')
on conflict do nothing;
