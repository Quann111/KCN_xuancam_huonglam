import { ChangeEvent, FormEvent, KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Bold, Eye, Heading2, Heading3, ImagePlus, Italic, Link as LinkIcon, List, LogOut, Pencil, Plus, Quote, Redo2, Trash2, Undo2, Underline as UnderlineIcon, Upload, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import NewsContent from '../components/NewsContent';
import { formatNewsDate, generateSlug, normalizeSlug } from '../lib/news-utils';
import { NewsPost, NewsStatus, supabase, supabaseConfigMessage } from '../lib/supabase';

type StatusFilter = 'all' | NewsStatus;

type FormState = {
  title: string; slug: string; excerpt: string; content: string; category: string; cover_image_url: string;
  seo_title: string; seo_description: string; status: NewsStatus; published_at: string;
};

const emptyForm: FormState = { title: '', slug: '', excerpt: '', content: '', category: 'Sự kiện', cover_image_url: '', seo_title: '', seo_description: '', status: 'draft', published_at: '' };

export default function AdminNews() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signedIn, setSignedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editing, setEditing] = useState<NewsPost | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [titleWarning, setTitleWarning] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [dateFilter, setDateFilter] = useState('');
  const [editorTab, setEditorTab] = useState<'write' | 'preview'>('write');
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const client = supabase;

  const formTitle = useMemo(() => editing ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới', [editing]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (statusFilter !== 'all' && post.status !== statusFilter) return false;
      if (dateFilter) {
        const postDate = (post.published_at || post.created_at).slice(0, 10);
        if (postDate !== dateFilter) return false;
      }
      return true;
    });
  }, [posts, statusFilter, dateFilter]);

  const loadPosts = async () => {
    if (!client) return;
    const { data, error: requestError } = await client.from('news_posts').select('*').order('created_at', { ascending: false });
    if (requestError) setError(requestError.message);
    else setPosts((data ?? []) as NewsPost[]);
  };

  const openAdminWorkspace = async () => {
    if (!client) return;
    const { data, error: adminError } = await client.rpc('is_news_admin');
    const hasAccess = !adminError && data === true;
    setIsAdmin(hasAccess);
    if (hasAccess) await loadPosts();
  };

  useEffect(() => {
    if (!client) return;
    const init = async () => {
      const { data } = await client.auth.getSession();
      setSignedIn(Boolean(data.session));
      if (data.session) await openAdminWorkspace();
    };
    void init();
    const { data: listener } = client.auth.onAuthStateChange((_event, session) => {
      setSignedIn(Boolean(session));
      setIsAdmin(null);
      if (session) void openAdminWorkspace();
    });
    return () => listener.subscription.unsubscribe();
  }, [client]);

  if (!client) return <main className="min-h-screen bg-slate-100 flex items-center justify-center p-4"><section className="w-full max-w-md border border-amber-200 bg-white p-7 text-center shadow-sm"><h1 className="text-2xl font-bold text-slate-900">Chưa thể mở quản trị tin tức</h1><p className="mt-3 leading-7 text-slate-600">{supabaseConfigMessage}</p><p className="mt-3 text-sm text-slate-500">Sau khi cập nhật Secrets, hãy chạy lại GitHub Actions để deploy phiên bản mới.</p></section></main>;

  const setField = (field: keyof FormState, value: string) => setForm((current) => ({ ...current, [field]: value }));

  const pushHistory = useCallback((value: string) => {
    setUndoStack((prev) => [...prev, value]);
    setRedoStack([]);
  }, []);

  const handleContentChange = useCallback((value: string) => {
    setField('content', value);
    pushHistory(value);
  }, [pushHistory]);

  const undo = useCallback(() => {
    setUndoStack((prevStack) => {
      if (prevStack.length === 0) return prevStack;
      const newStack = [...prevStack];
      const lastValue = newStack.pop()!;
      setRedoStack((prevRedo) => [...prevRedo, form.content]);
      setForm((current) => ({ ...current, content: lastValue }));
      return newStack;
    });
  }, [form.content]);

  const redo = useCallback(() => {
    setRedoStack((prevStack) => {
      if (prevStack.length === 0) return prevStack;
      const newStack = [...prevStack];
      const lastValue = newStack.pop()!;
      setUndoStack((prevUndo) => [...prevUndo, form.content]);
      setForm((current) => ({ ...current, content: lastValue }));
      return newStack;
    });
  }, [form.content]);

  const applyFormat = useCallback((tag: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const text = ta.value;
    const selected = text.substring(start, end);
    let replacement = '';
    let newCursorPos = start;

    switch (tag) {
      case 'bold':
        replacement = `**${selected || 'text'}**`;
        newCursorPos = selected ? start + replacement.length : start + 2;
        break;
      case 'italic':
        replacement = `*${selected || 'text'}*`;
        newCursorPos = selected ? start + replacement.length : start + 1;
        break;
      case 'underline':
        replacement = `[u]${selected || 'text'}[/u]`;
        newCursorPos = selected ? start + replacement.length : start + 3;
        break;
      case 'h2': {
        const lineStart = text.lastIndexOf('\n', start - 1) + 1;
        const prefix = text.substring(lineStart, start);
        if (prefix.trim() === '' && start === end) {
          replacement = `## ${selected || 'text'}`;
          newCursorPos = lineStart + 3;
        } else {
          replacement = `\n## ${selected || 'text'}`;
          newCursorPos = start + 4;
        }
        break;
      }
      case 'h3': {
        const lineStart = text.lastIndexOf('\n', start - 1) + 1;
        const prefix = text.substring(lineStart, start);
        if (prefix.trim() === '' && start === end) {
          replacement = `### ${selected || 'text'}`;
          newCursorPos = lineStart + 4;
        } else {
          replacement = `\n### ${selected || 'text'}`;
          newCursorPos = start + 5;
        }
        break;
      }
      case 'quote': {
        const lineStart = text.lastIndexOf('\n', start - 1) + 1;
        const prefix = text.substring(lineStart, start);
        if (prefix.trim() === '' && start === end) {
          replacement = `> ${selected || 'text'}`;
          newCursorPos = lineStart + 2;
        } else {
          replacement = `\n> ${selected || 'text'}`;
          newCursorPos = start + 3;
        }
        break;
      }
      case 'ul': {
        const lineStart = text.lastIndexOf('\n', start - 1) + 1;
        const prefix = text.substring(lineStart, start);
        if (prefix.trim() === '' && start === end) {
          replacement = `- ${selected || 'text'}`;
          newCursorPos = lineStart + 2;
        } else {
          replacement = `\n- ${selected || 'text'}`;
          newCursorPos = start + 3;
        }
        break;
      }
      case 'link': {
        const url = window.prompt('Nhập URL:');
        if (!url) return;
        replacement = `[${selected || 'link text'}](${url})`;
        newCursorPos = start + replacement.length;
        break;
      }
      default:
        return;
    }

    const newText = text.substring(0, start) + replacement + text.substring(end);
    setField('content', newText);
    pushHistory(newText);
    ta.focus();
    setTimeout(() => {
      ta.selectionStart = newCursorPos;
      ta.selectionEnd = newCursorPos;
    }, 0);
  }, [pushHistory]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const mod = isMac ? e.metaKey : e.ctrlKey;
    if (mod && e.key === 'b') { e.preventDefault(); applyFormat('bold'); }
    else if (mod && e.key === 'i') { e.preventDefault(); applyFormat('italic'); }
    else if (mod && e.key === 'u') { e.preventDefault(); applyFormat('underline'); }
    else if (mod && !e.shiftKey && e.key === 'z') { e.preventDefault(); undo(); }
    else if (mod && e.key === 'y') { e.preventDefault(); redo(); }
    else if (mod && e.shiftKey && e.key === 'z') { e.preventDefault(); redo(); }
  }, [applyFormat, undo, redo]);

  const resetForm = () => { setForm(emptyForm); setEditing(null); setMessage(''); setError(''); setTitleWarning(''); setUndoStack([]); setRedoStack([]); setEditorTab('write'); };

  const checkDuplicateTitle = async (title: string) => {
    if (!title.trim()) { setTitleWarning(''); return; }
    const slug = generateSlug(title);
    const { data } = await client.from('news_posts').select('id, title').eq('slug', slug).maybeSingle();
    if (data && data.id !== editing?.id) {
      setTitleWarning(`Tiêu đề này đã tồn tại: "${data.title}"`);
    } else {
      setTitleWarning('');
    }
  };

  const signIn = async (event: FormEvent) => {
    event.preventDefault(); setError('');
    const { error: signInError } = await client.auth.signInWithPassword({ email, password });
    if (signInError) setError('Không thể đăng nhập. Vui lòng kiểm tra email và mật khẩu.');
  };

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>, inline = false) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(''); setMessage('');
    if (!file.type.startsWith('image/')) { setError('Vui lòng chọn tệp hình ảnh.'); return; }
    if (file.size > 8 * 1024 * 1024) { setError('Ảnh cần nhỏ hơn 8 MB.'); return; }
    const extension = file.name.split('.').pop() || 'jpg';
    const path = `${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await client.storage.from('news-images').upload(path, file, { cacheControl: '3600', upsert: false });
    if (uploadError) { setError(`Không thể tải ảnh lên: ${uploadError.message}`); return; }
    const { data } = client.storage.from('news-images').getPublicUrl(path);
    if (inline) {
      const ta = textareaRef.current;
      const imageMarkdown = `[image:${data.publicUrl}]`;
      if (ta) {
        const start = ta.selectionStart;
        const text = ta.value;
        const before = text.substring(0, start);
        const after = text.substring(ta.selectionEnd);
        const newText = `${before}${imageMarkdown}${after}`;
        setField('content', newText);
        pushHistory(newText);
        ta.focus();
        setTimeout(() => {
          const newPos = start + imageMarkdown.length;
          ta.selectionStart = newPos;
          ta.selectionEnd = newPos;
        }, 0);
      } else {
        setField('content', `${form.content}${form.content.trim() ? '\n\n' : ''}${imageMarkdown}`);
      }
    } else {
      setField('cover_image_url', data.publicUrl);
    }
    setMessage(inline ? 'Đã chèn ảnh vào nội dung.' : 'Đã tải ảnh đại diện lên.');
    event.target.value = '';
  };

  const savePost = async (event: FormEvent) => {
    event.preventDefault(); setError(''); setMessage('');
    const slug = normalizeSlug(form.slug || form.title);
    if (!form.title.trim() || !slug || !form.excerpt.trim() || !form.content.trim()) { setError('Vui lòng nhập tiêu đề, slug, mô tả ngắn và nội dung bài viết.'); return; }
    setSaving(true);
    const payload = {
      title: form.title.trim(), slug, excerpt: form.excerpt.trim(), content: form.content.trim(), category: form.category.trim() || 'Tin tức',
      cover_image_url: form.cover_image_url.trim() || null, seo_title: form.seo_title.trim() || null, seo_description: form.seo_description.trim() || null,
      status: form.status, published_at: form.status === 'published' ? (form.published_at ? new Date(form.published_at).toISOString() : (editing?.published_at ?? new Date().toISOString())) : null,
    };
    const request = editing ? client.from('news_posts').update(payload).eq('id', editing.id) : client.from('news_posts').insert(payload);
    const { error: saveError } = await request;
    setSaving(false);
    if (saveError) { setError(saveError.code === '23505' ? 'Slug SEO đã được dùng cho một bài viết khác.' : `Không thể lưu bài viết: ${saveError.message}`); return; }
    resetForm();
    setMessage(editing ? 'Đã cập nhật bài viết.' : 'Đã tạo bài viết.');
    await loadPosts();
  };

  const editPost = (post: NewsPost) => {
    setEditing(post);
    setForm({ title: post.title, slug: post.slug, excerpt: post.excerpt, content: post.content, category: post.category, cover_image_url: post.cover_image_url || '', seo_title: post.seo_title || '', seo_description: post.seo_description || '', status: post.status, published_at: post.published_at ? post.published_at.slice(0, 16) : '' });
    setError(''); setMessage('');
    setUndoStack([]); setRedoStack([]); setEditorTab('write');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deletePost = async (post: NewsPost) => {
    if (!window.confirm(`Xóa bài viết "${post.title}"?`)) return;
    setError(''); setMessage('');
    const { error: deleteError } = await client.from('news_posts').delete().eq('id', post.id);
    if (deleteError) { setError(`Không thể xóa bài viết: ${deleteError.message}`); return; }
    if (editing?.id === post.id) resetForm();
    setMessage('Đã xóa bài viết.');
    await loadPosts();
  };

  if (!signedIn) return <main className="min-h-screen bg-slate-100 flex items-center justify-center p-4"><form onSubmit={signIn} className="w-full max-w-md bg-white border border-slate-200 rounded-lg shadow-sm p-7"><img src={`${import.meta.env.BASE_URL}image/LOGO4.png`} alt="D-Park Group" className="h-12 w-auto mb-8" /><h1 className="text-2xl font-bold">Quản trị tin tức</h1><p className="mt-2 text-sm text-slate-600">Đăng nhập bằng tài khoản quản trị đã được cấp.</p>{error && <p className="mt-4 text-sm text-red-600">{error}</p>}<label className="block mt-6 text-sm font-semibold">Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full border border-slate-300 rounded-md px-3 py-2.5" /></label><label className="block mt-4 text-sm font-semibold">Mật khẩu<input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full border border-slate-300 rounded-md px-3 py-2.5" /></label><button className="mt-6 w-full py-3 rounded-md bg-cyan-600 hover:bg-cyan-700 text-white font-bold">Đăng nhập</button></form></main>;
  if (!signedIn) return <main className="min-h-screen bg-slate-100 flex items-center justify-center p-4"><form onSubmit={signIn} className="w-full max-w-md bg-white border border-slate-200 rounded-lg shadow-sm p-7"><img src={`${import.meta.env.BASE_URL}image/LOGO4.png`} alt="D-Park Group" className="h-12 w-auto mb-8" /><h1 className="text-2xl font-bold">Quản trị tin tức</h1><p className="mt-2 text-sm text-slate-600">Đăng nhập bằng tài khoản quản trị đã được cấp.</p>{error && <p className="mt-4 text-sm text-red-600">{error}</p>}<label className="block mt-6 text-sm font-semibold">Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full border border-slate-300 rounded-md px-3 py-2.5" /></label><label className="block mt-4 text-sm font-semibold">Mật khẩu<input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full border border-slate-300 rounded-md px-3 py-2.5" /></label><button className="mt-6 w-full py-3 rounded-md bg-cyan-600 hover:bg-cyan-700 text-white font-bold">Đăng nhập</button></form></main>;

  if (isAdmin === null) return <main className="min-h-screen bg-slate-100 flex items-center justify-center text-slate-600">Đang kiểm tra quyền quản trị...</main>;

  if (!isAdmin) return <main className="min-h-screen bg-slate-100 flex items-center justify-center p-4"><section className="max-w-md bg-white border border-slate-200 rounded-lg shadow-sm p-7 text-center"><h1 className="text-2xl font-bold">Chưa có quyền quản trị</h1><p className="mt-3 text-slate-600">Tài khoản này chưa được cấp quyền đăng tin.</p><button onClick={() => void client.auth.signOut()} className="mt-6 px-5 py-2.5 rounded-md bg-slate-900 text-white font-bold">Đăng xuất</button></section></main>;

  return <main className="min-h-screen bg-slate-100 text-slate-900"><header className="bg-slate-950 text-white"><div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between"><div><h1 className="text-xl font-bold">Quản trị tin tức</h1><p className="text-sm text-slate-300 mt-1">KCN Xuân Cẩm - Hương Lâm</p></div><button onClick={() => void client.auth.signOut()} className="inline-flex items-center gap-2 text-sm font-bold text-slate-200 hover:text-white"><LogOut className="w-4 h-4" />Đăng xuất</button></div></header>
    <div className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_420px] gap-8"><section className="order-2 xl:order-1"><div className="flex items-center justify-between mb-5"><h2 className="text-xl font-bold">Danh sách bài viết</h2><span className="text-sm text-slate-500">{filteredPosts.length} / {posts.length} bài</span></div>{message && <p className="mb-4 text-sm text-emerald-700">{message}</p>}{error && <p className="mb-4 text-sm text-red-600">{error}</p>}<div className="flex flex-wrap gap-3 mb-4"><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as StatusFilter)} className="border border-slate-300 rounded-md px-3 py-2 text-sm bg-white"><option value="all">Tất cả trạng thái</option><option value="published">Đã xuất bản</option><option value="draft">Bản nháp</option></select><input type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} className="border border-slate-300 rounded-md px-3 py-2 text-sm bg-white" title="Lọc theo ngày" />{dateFilter && <button onClick={() => setDateFilter('')} className="text-sm text-slate-500 hover:text-slate-700 font-semibold flex items-center gap-1"><X className="w-3.5 h-3.5" />Xoá ngày</button>}</div><div className="bg-white border border-slate-200 rounded-lg overflow-x-auto"><table className="w-full text-sm min-w-[720px]"><thead className="bg-slate-50 text-left text-slate-500"><tr><th className="p-4">Bài viết</th><th className="p-4">Trạng thái</th><th className="p-4">Ngày đăng</th><th className="p-4 text-right">Thao tác</th></tr></thead><tbody>{filteredPosts.map((post) => <tr key={post.id} className="border-t border-slate-100"><td className="p-4"><p className="font-bold">{post.title}</p><p className="mt-1 text-xs text-slate-500">/tin-tuc/{post.slug}</p></td><td className="p-4"><span className={`inline-flex px-2 py-1 rounded text-xs font-bold ${post.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{post.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}</span></td><td className="p-4 text-slate-600">{formatNewsDate(post.published_at)}</td><td className="p-4"><div className="flex justify-end gap-2"><Link to={`/admin/preview/${post.slug}`} target="_blank" title="Xem trước" className="p-2 text-slate-600 hover:bg-slate-100 rounded"><Eye className="w-4 h-4" /></Link><button title="Chỉnh sửa" onClick={() => editPost(post)} className="p-2 text-cyan-700 hover:bg-cyan-50 rounded"><Pencil className="w-4 h-4" /></button><button title="Xóa" onClick={() => void deletePost(post)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button></div></td></tr>)}{filteredPosts.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-slate-500">{posts.length === 0 ? 'Chưa có bài viết nào.' : 'Không có bài viết phù hợp bộ lọc.'}</td></tr>}</tbody></table></div></section>
      <aside className="order-1 xl:order-2"><form onSubmit={savePost} className="bg-white border border-slate-200 rounded-lg p-5 md:p-6 xl:sticky xl:top-5"><div className="flex justify-between items-center"><h2 className="font-bold text-lg">{formTitle}</h2>{editing ? <button type="button" title="Đóng biểu mẫu" onClick={resetForm} className="p-1 text-slate-500"><X className="w-5 h-5" /></button> : <Plus className="w-5 h-5 text-cyan-600" />}</div><div className="space-y-4 mt-5"><label className="block text-sm font-semibold">Tiêu đề<input required value={form.title} onChange={(event) => { const title = event.target.value; setForm((current) => ({ ...current, title, slug: generateSlug(title) })); checkDuplicateTitle(title); }} className="mt-1.5 w-full border border-slate-300 rounded-md px-3 py-2" />{titleWarning && <p className="mt-1 text-xs font-normal text-amber-600">{titleWarning}</p>}</label><label className="block text-sm font-semibold">Slug SEO<span className="mt-1.5 block w-full border border-slate-200 bg-slate-50 rounded-md px-3 py-2 text-sm text-slate-600">{form.slug || 'slug-bai-viet'}</span><span className="mt-1 block text-xs font-normal text-slate-500">xuancamhuonglamip.vn/tin-tuc/{form.slug || 'slug-bai-viet'}</span></label><label className="block text-sm font-semibold">Danh mục<select value={form.category} onChange={(event) => setField('category', event.target.value)} className="mt-1.5 w-full border border-slate-300 rounded-md px-3 py-2"><option value="Sự kiện">Sự kiện</option><option value="Hợp tác">Hợp tác</option><option value="Thị trường">Thị trường</option></select></label><label className="block text-sm font-semibold">Mô tả ngắn<textarea required rows={3} value={form.excerpt} onChange={(event) => setField('excerpt', event.target.value)} className="mt-1.5 w-full border border-slate-300 rounded-md px-3 py-2 resize-y" /></label><div><p className="text-sm font-semibold">Ảnh đại diện</p><div className="mt-1.5 flex gap-2"><input value={form.cover_image_url} onChange={(event) => setField('cover_image_url', event.target.value)} placeholder="Dán URL ảnh hoặc tải lên" className="min-w-0 flex-1 border border-slate-300 rounded-md px-3 py-2 text-sm" /><label title="Tải ảnh đại diện" className="cursor-pointer p-2.5 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200"><Upload className="w-4 h-4" /><input type="file" accept="image/*" onChange={(event) => void uploadImage(event)} className="sr-only" /></label></div>{form.cover_image_url && <img src={form.cover_image_url} alt="Xem trước ảnh đại diện" className="mt-3 w-full h-36 object-cover rounded-md" />}</div>
          <div>
            <div className="flex items-center justify-between mb-0">
              <label className="text-sm font-semibold">Nội dung bài viết</label>
              <div className="flex">
                <button type="button" onClick={() => setEditorTab('write')} className={`px-3 py-1.5 text-xs font-semibold rounded-l-md border border-slate-200 ${editorTab === 'write' ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>Viết</button>
                <button type="button" onClick={() => setEditorTab('preview')} className={`px-3 py-1.5 text-xs font-semibold rounded-r-md border border-slate-200 -ml-px ${editorTab === 'preview' ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>Xem trước</button>
              </div>
            </div>
            {editorTab === 'write' ? (
              <>
                <div className="flex flex-wrap gap-1 p-2 bg-slate-50 border border-slate-200 rounded-t-md">
                  <button type="button" title="Hoàn tác (Ctrl+Z)" onClick={undo} className="p-1.5 hover:bg-slate-200 rounded" disabled={undoStack.length === 0}><Undo2 className="w-4 h-4" /></button>
                  <button type="button" title="Làm lại (Ctrl+Y)" onClick={redo} className="p-1.5 hover:bg-slate-200 rounded" disabled={redoStack.length === 0}><Redo2 className="w-4 h-4" /></button>
                  <div className="w-px bg-slate-300 mx-1" />
                  <button type="button" title="In đậm (Ctrl+B)" onClick={() => applyFormat('bold')} className="p-1.5 hover:bg-slate-200 rounded"><Bold className="w-4 h-4" /></button>
                  <button type="button" title="In nghiêng (Ctrl+I)" onClick={() => applyFormat('italic')} className="p-1.5 hover:bg-slate-200 rounded"><Italic className="w-4 h-4" /></button>
                  <button type="button" title="Gạch chân (Ctrl+U)" onClick={() => applyFormat('underline')} className="p-1.5 hover:bg-slate-200 rounded"><UnderlineIcon className="w-4 h-4" /></button>
                  <div className="w-px bg-slate-300 mx-1" />
                  <button type="button" title="Tiêu đề 2" onClick={() => applyFormat('h2')} className="p-1.5 hover:bg-slate-200 rounded"><Heading2 className="w-4 h-4" /></button>
                  <button type="button" title="Tiêu đề 3" onClick={() => applyFormat('h3')} className="p-1.5 hover:bg-slate-200 rounded"><Heading3 className="w-4 h-4" /></button>
                  <div className="w-px bg-slate-300 mx-1" />
                  <button type="button" title="Trích dẫn" onClick={() => applyFormat('quote')} className="p-1.5 hover:bg-slate-200 rounded"><Quote className="w-4 h-4" /></button>
                  <button type="button" title="Danh sách" onClick={() => applyFormat('ul')} className="p-1.5 hover:bg-slate-200 rounded"><List className="w-4 h-4" /></button>
                  <div className="w-px bg-slate-300 mx-1" />
                  <button type="button" title="Chèn liên kết" onClick={() => applyFormat('link')} className="p-1.5 hover:bg-slate-200 rounded"><LinkIcon className="w-4 h-4" /></button>
                  <label title="Chèn ảnh vào nội dung" className="inline-flex cursor-pointer p-1.5 hover:bg-slate-200 rounded"><ImagePlus className="w-4 h-4" /><input type="file" accept="image/*" onChange={(event) => void uploadImage(event, true)} className="sr-only" /></label>
                </div>
                <textarea ref={textareaRef} required rows={10} value={form.content} onChange={(event) => handleContentChange(event.target.value)} onKeyDown={handleKeyDown} placeholder={'Viết nội dung theo từng đoạn.\n\nSử dụng thanh công cụ hoặc phím tắt để định dạng.\n\nẢnh trong bài sẽ được chèn tại vị trí con trỏ bằng nút bên dưới.'} className="w-full border border-slate-200 border-t-0 rounded-b-md px-3 py-2 resize-y" />
              </>
            ) : (
              <div className="border border-slate-200 rounded-md p-4 min-h-[300px] prose prose-sm max-w-none">
                {form.content ? <NewsContent content={form.content} /> : <p className="text-slate-400 italic">Chưa có nội dung.</p>}
              </div>
            )}
          </div>
          <label className="block text-sm font-semibold">SEO title
            <input value={form.seo_title} onChange={(event) => setField('seo_title', event.target.value)} className="mt-1.5 w-full border border-slate-300 rounded-md px-3 py-2" />
            {form.seo_title && <span className="mt-1 block text-xs font-normal" style={{ color: form.seo_title.length > 70 ? '#dc2626' : form.seo_title.length >= 50 && form.seo_title.length <= 60 ? '#16a34a' : '#ca8a04' }}>{form.seo_title.length} ký tự{form.seo_title.length > 70 ? ' (quá dài)' : form.seo_title.length >= 50 && form.seo_title.length <= 60 ? ' (tốt)' : form.seo_title.length < 50 ? ' (nên thêm)' : ''}</span>}
          </label>
          <label className="block text-sm font-semibold">SEO description
            <textarea rows={3} value={form.seo_description} onChange={(event) => setField('seo_description', event.target.value)} className="mt-1.5 w-full border border-slate-300 rounded-md px-3 py-2 resize-y" />
            {form.seo_description && <span className="mt-1 block text-xs font-normal" style={{ color: form.seo_description.length > 180 ? '#dc2626' : form.seo_description.length >= 140 && form.seo_description.length <= 160 ? '#16a34a' : '#ca8a04' }}>{form.seo_description.length} ký tự{form.seo_description.length > 180 ? ' (quá dài)' : form.seo_description.length >= 140 && form.seo_description.length <= 160 ? ' (tốt)' : form.seo_description.length < 140 ? ' (nên thêm)' : ''}</span>}
          </label>
          <label className="flex items-center justify-between gap-3 text-sm font-semibold">Xuất bản ngay<input type="checkbox" checked={form.status === 'published'} onChange={(event) => setForm((current) => ({ ...current, status: event.target.checked ? 'published' : 'draft' }))} className="h-5 w-5 accent-cyan-600" /></label><label className="block text-sm font-semibold">Ngày giờ đăng bài<input type="datetime-local" value={form.published_at} onChange={(event) => setField('published_at', event.target.value)} className="mt-1.5 w-full border border-slate-300 rounded-md px-3 py-2" /><span className="mt-1 block text-xs font-normal text-slate-500">{form.published_at ? new Date(form.published_at).toLocaleString('vi-VN') : 'Để trống sẽ lấy thời gian hiện tại'}</span></label><button disabled={saving} className="w-full py-3 rounded-md bg-cyan-600 hover:bg-cyan-700 disabled:opacity-60 text-white font-bold">{saving ? 'Đang lưu...' : editing ? 'Lưu thay đổi' : 'Tạo bài viết'}</button></div></form></aside>
    </div>
  </main>;
}
