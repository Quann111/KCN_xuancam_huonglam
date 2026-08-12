import { useEffect, useState } from 'react';
import { CalendarDays, ChevronLeft, Eye } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import NewsContent from '../components/NewsContent';
import { formatNewsDate } from '../lib/news-utils';
import { ORGANIZATION_LOGO } from '../lib/site-seo';
import { NewsPost, supabase } from '../lib/supabase';

export default function AdminNewsPreview() {
  const { slug } = useParams();
  const [post, setPost] = useState<NewsPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPost = async () => {
      const client = supabase;
      if (!client) { setLoading(false); return; }
      const { data } = await client.from('news_posts').select('*').eq('slug', slug ?? '').maybeSingle();
      if (data) setPost(data as NewsPost);
      else setError('Không tìm thấy bài viết.');
      setLoading(false);
    };
    void loadPost();
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-slate-100 flex items-center justify-center text-slate-500">Đang tải...</div>;
  if (error) return <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center gap-4 text-slate-600"><p>{error}</p><Link to="/admin/tin-tuc" className="text-cyan-600 font-bold">Quay lại quản trị</Link></div>;
  if (!post) return null;

  const isDraft = post.status === 'draft';

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {isDraft && (
        <div className="bg-amber-500 text-white text-center py-2.5 text-sm font-bold flex items-center justify-center gap-2 sticky top-0 z-50">
          <Eye className="w-4 h-4" />
          Đang xem bản nháp — Bài viết chưa xuất bản
        </div>
      )}
      <header className="bg-slate-950 py-16 text-white md:py-24">
        <div className="container mx-auto max-w-4xl px-4">
          <Link to="/admin/tin-tuc" className="inline-flex items-center gap-2 text-sm font-bold text-cyan-400 hover:text-cyan-300">
            <ChevronLeft className="size-4" />
            Quay lại quản trị
          </Link>
          <p className="mt-9 text-sm font-bold uppercase tracking-[0.18em] text-cyan-400">{post.category}</p>
          <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">{post.title}</h1>
          <div className="mt-6 flex items-center gap-2 text-sm text-slate-300">
            <CalendarDays className="size-4" />
            {formatNewsDate(post.published_at)}
          </div>
        </div>
      </header>
      <div className="container mx-auto max-w-4xl px-4 py-12 md:py-16">
        {post.cover_image_url && (
          <img src={post.cover_image_url} alt={post.title} width="1200" height="675" className="mb-10 aspect-[16/9] w-full object-cover" />
        )}
        <p className="border-l-4 border-cyan-500 pl-5 text-lg font-medium leading-relaxed text-slate-700 md:text-xl">{post.excerpt}</p>
        <div className="mt-10">
          <NewsContent content={post.content} />
        </div>
      </div>
    </div>
  );
}
