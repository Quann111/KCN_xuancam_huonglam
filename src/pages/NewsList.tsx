import { useEffect, useState } from 'react';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import SeoHead from '../components/SeoHead';
import { formatNewsDate } from '../lib/news-utils';
import { NewsPost, supabase, supabaseConfigMessage } from '../lib/supabase';

export default function NewsList() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => { const client = supabase; if (!client) { setError(supabaseConfigMessage); setLoading(false); return; } void (async () => { const { data, error: requestError } = await client.from('news_posts').select('*').eq('status', 'published').order('published_at', { ascending: false }); if (requestError) setError('Chưa thể tải danh sách tin tức. Vui lòng thử lại sau.'); else setPosts((data ?? []) as NewsPost[]); setLoading(false); })(); }, []);
  return <PublicLayout><SeoHead title="Tin tức & Sự kiện | KCN Xuân Cẩm - Hương Lâm" description="Cập nhật tin tức, sự kiện và hoạt động đầu tư mới nhất tại KCN Xuân Cẩm - Hương Lâm." path="/tin-tuc" />
    <section className="bg-slate-950 py-20 text-white md:py-28"><div className="container mx-auto px-4"><p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">Tin tức & Sự kiện</p><h1 className="mt-4 text-4xl font-bold md:text-6xl">Cập nhật mới nhất</h1><p className="mt-5 max-w-2xl leading-relaxed text-slate-300">Thông tin về dự án, hạ tầng, hoạt động đầu tư và các sự kiện nổi bật tại KCN Xuân Cẩm - Hương Lâm.</p></div></section>
    <section className="py-16 md:py-20"><div className="container mx-auto px-4">{loading && <p className="text-slate-500">Đang tải tin tức...</p>}{error && <p className="text-red-600">{error}</p>}{!loading && !error && posts.length === 0 && <p className="text-slate-500">Chưa có bài viết nào được xuất bản.</p>}<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">{posts.map((post) => <article key={post.id} className="group overflow-hidden border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-lg"><Link to={`/tin-tuc/${post.slug}`} target="_blank" rel="noopener noreferrer" className="block" aria-label={`Đọc ${post.title}`}><div className="aspect-[16/10] bg-slate-100">{post.cover_image_url ? <img src={post.cover_image_url} alt={post.title} width="800" height="500" loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" /> : <div className="flex size-full items-center justify-center text-slate-400">Tin tức</div>}</div><div className="p-6"><div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide"><span className="text-cyan-600">{post.category}</span><span className="flex items-center gap-1 text-slate-400"><CalendarDays className="size-3.5" />{formatNewsDate(post.published_at)}</span></div><h2 className="mt-4 text-xl font-bold leading-snug transition-colors group-hover:text-cyan-600">{post.title}</h2><p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">{post.excerpt}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-cyan-600">Xem chi tiết <ArrowRight className="size-4" /></span></div></Link></article>)}</div></div></section>
  </PublicLayout>;
}
