create table public.news_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  excerpt text not null,
  content text not null,
  cover_image_url text,
  category text not null default 'Tin tức',
  published_at timestamptz,
  status text not null default 'draft' check (status in ('draft', 'published')),
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index news_posts_publication_idx on public.news_posts (status, published_at desc);

create function public.set_news_posts_updated_at()
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

create trigger news_posts_updated_at
before update on public.news_posts
for each row execute function public.set_news_posts_updated_at();

grant select on public.news_posts to anon;
grant select, insert, update, delete on public.news_posts to authenticated;

alter table public.news_posts enable row level security;

create policy "Published news is visible publicly"
on public.news_posts for select to anon
using (status = 'published');

create policy "Authenticated users can read news"
on public.news_posts for select to authenticated
using (true);

create policy "Authenticated users can create news"
on public.news_posts for insert to authenticated
with check (true);

create policy "Authenticated users can update news"
on public.news_posts for update to authenticated
using (true) with check (true);

create policy "Authenticated users can delete news"
on public.news_posts for delete to authenticated
using (true);

insert into storage.buckets (id, name, public)
values ('news-images', 'news-images', true);

create policy "Public reads news images"
on storage.objects for select to anon
using (bucket_id = 'news-images');

create policy "Authenticated users read news images"
on storage.objects for select to authenticated
using (bucket_id = 'news-images');

create policy "Authenticated users upload news images"
on storage.objects for insert to authenticated
with check (bucket_id = 'news-images');

create policy "Authenticated users update news images"
on storage.objects for update to authenticated
using (bucket_id = 'news-images') with check (bucket_id = 'news-images');

create policy "Authenticated users delete news images"
on storage.objects for delete to authenticated
using (bucket_id = 'news-images');

insert into public.news_posts (
  title, slug, excerpt, content, cover_image_url, category,
  published_at, status, seo_title, seo_description
) values
(
  'Khởi công xây dựng hạ tầng kỹ thuật Giai đoạn 1',
  'khoi-cong-xay-dung-ha-tang-ky-thuat-giai-doan-1',
  'Dự án chính thức khởi công giai đoạn đầu, mở ra nền tảng hạ tầng đồng bộ cho các nhà đầu tư.',
  'KCN Xuân Cẩm - Hương Lâm chính thức triển khai xây dựng hạ tầng kỹ thuật giai đoạn 1. Dự án hướng tới hệ thống hạ tầng đồng bộ, hiện đại và sẵn sàng đáp ứng nhu cầu của các nhà đầu tư.\n\nCác hạng mục giao thông, cấp điện, cấp nước và xử lý nước thải được triển khai theo quy hoạch, tạo nền tảng phát triển bền vững cho khu công nghiệp.',
  'https://www.xuancamhuonglamip.vn/image/AIComplex_1776166944793.avif',
  'Sự kiện', '2024-03-15T00:00:00+07:00', 'published',
  'Khởi công xây dựng hạ tầng kỹ thuật Giai đoạn 1',
  'Thông tin khởi công xây dựng hạ tầng kỹ thuật Giai đoạn 1 tại KCN Xuân Cẩm - Hương Lâm.'
),
(
  'D-PARK GROUP ký kết hợp tác chiến lược cùng Nippon Koei',
  'd-park-group-ky-ket-hop-tac-chien-luoc-cung-nippon-koei',
  'Sự hợp tác hướng đến việc nâng cao chất lượng quy hoạch và hạ tầng khu công nghiệp.',
  'D-PARK GROUP và Nippon Koei triển khai hợp tác chiến lược nhằm nâng cao chất lượng tư vấn, quy hoạch và quản lý phát triển hạ tầng.\n\nSự đồng hành của đối tác giàu kinh nghiệm góp phần củng cố định hướng phát triển KCN Xuân Cẩm - Hương Lâm theo tiêu chuẩn hiện đại.',
  'https://www.xuancamhuonglamip.vn/image/AIComplex_1777917995188.avif',
  'Hợp tác', '2024-02-10T00:00:00+07:00', 'published',
  'D-PARK GROUP ký kết hợp tác chiến lược cùng Nippon Koei',
  'D-PARK GROUP ký kết hợp tác chiến lược với Nippon Koei.'
),
(
  'Bắc Giang dẫn đầu cả nước về tốc độ tăng trưởng GRDP',
  'bac-giang-dan-dau-ca-nuoc-ve-toc-do-tang-truong-grdp',
  'Môi trường đầu tư thuận lợi là động lực để Bắc Giang tiếp tục thu hút các dự án công nghệ cao.',
  'Với tốc độ tăng trưởng GRDP ấn tượng, Bắc Giang tiếp tục là điểm đến hấp dẫn đối với các nhà đầu tư trong và ngoài nước.\n\nKCN Xuân Cẩm - Hương Lâm sẵn sàng đón nhận các dự án phù hợp với định hướng công nghệ cao và phát triển bền vững.',
  'https://www.xuancamhuonglamip.vn/image/AIComplex_1777917938644.avif',
  'Thị trường', '2024-01-05T00:00:00+07:00', 'published',
  'Bắc Giang dẫn đầu cả nước về tốc độ tăng trưởng GRDP',
  'Cập nhật thông tin tăng trưởng kinh tế và môi trường đầu tư tại Bắc Giang.'
);
