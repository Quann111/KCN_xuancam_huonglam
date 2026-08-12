import { useEffect, useState } from 'react';
import { CalendarDays, ChevronLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import NewsContent from '../components/NewsContent';
import PublicLayout from '../components/PublicLayout';
import SeoHead from '../components/SeoHead';
import { formatNewsDate, getAbsoluteNewsUrl } from '../lib/news-utils';
import { ORGANIZATION_LOGO, ORGANIZATION_NAME } from '../lib/site-seo';
import { NewsPost, supabase } from '../lib/supabase';

export default function NewsDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState<NewsPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      const client = supabase;
      if (!client) { setLoading(false); return; }
      const { data } = await client.from('news_posts').select('*').eq('slug', slug ?? '').eq('status', 'published').maybeSingle();
      setPost(data as NewsPost | null);
      setLoading(false);
    };
    void loadPost();
  }, [slug]);

  if (loading) return <PublicLayout><div className="container mx-auto px-4 py-24 text-slate-500">Đang tải bài viết...</div></PublicLayout>;
  if (!post) return <PublicLayout><SeoHead title="Không tìm thấy bài viết | KCN Xuân Cẩm - Hương Lâm" description="Bài viết không tồn tại hoặc chưa được xuất bản." path="/tin-tuc" /><div className="container mx-auto px-4 py-24"><h1 className="text-3xl font-bold">Không tìm thấy bài viết</h1><p className="mt-3 text-slate-600">Bài viết có thể chưa được xuất bản hoặc đường dẫn không còn hợp lệ.</p><Link to="/tin-tuc" className="mt-7 inline-flex items-center gap-2 font-bold text-cyan-600"><ChevronLeft className="size-4" />Quay lại tin tức</Link></div></PublicLayout>;

  const title = post.seo_title || post.title;
  const description = post.seo_description || post.excerpt;
  const canonicalUrl = getAbsoluteNewsUrl(post.slug);
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    description,
    mainEntityOfPage: canonicalUrl,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    image: post.cover_image_url ? [post.cover_image_url] : undefined,
    author: { '@type': 'Organization', name: ORGANIZATION_NAME, url: 'https://www.xuancamhuonglamip.vn/gioi-thieu-d-park-group' },
    publisher: { '@type': 'Organization', name: ORGANIZATION_NAME, logo: { '@type': 'ImageObject', url: ORGANIZATION_LOGO } },
  };
  return <PublicLayout>
    <SeoHead title={`${title} | KCN Xuân Cẩm - Hương Lâm`} description={description} path={`/tin-tuc/${post.slug}`} image={post.cover_image_url || ORGANIZATION_LOGO} type="article">
      <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
    </SeoHead>
    <article><header className="bg-slate-950 py-16 text-white md:py-24"><div className="container mx-auto max-w-4xl px-4"><Link to="/tin-tuc" className="inline-flex items-center gap-2 text-sm font-bold text-cyan-400 hover:text-cyan-300"><ChevronLeft className="size-4" />Tất cả tin tức</Link><p className="mt-9 text-sm font-bold uppercase tracking-[0.18em] text-cyan-400">{post.category}</p><h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">{post.title}</h1><div className="mt-6 flex items-center gap-2 text-sm text-slate-300"><CalendarDays className="size-4" />{formatNewsDate(post.published_at)}</div></div></header>
      <div className="container mx-auto max-w-4xl px-4 py-12 md:py-16">{post.cover_image_url && <img src={post.cover_image_url} alt={post.title} width="1200" height="675" className="mb-10 aspect-[16/9] w-full object-cover" />}<p className="border-l-4 border-cyan-500 pl-5 text-lg font-medium leading-relaxed text-slate-700 md:text-xl">{post.excerpt}</p><div className="mt-10"><NewsContent content={post.content} /></div></div>
    </article>
  </PublicLayout>;
}
