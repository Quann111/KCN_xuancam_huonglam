import { FormEvent, useEffect, useState } from 'react';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import NewsContent from './NewsContent';
import { translateText, TranslationLanguage, LocalizedFields } from '../lib/translate';
import { JobPost, supabase, supabaseConfigMessage } from '../lib/supabase';

type JobForm = {
  title: string;
  location: string;
  employment_type: string;
  sort_order: string;
  status: JobPost['status'];
  description: string;
  translations: Record<TranslationLanguage, LocalizedFields>;
};

const languages: TranslationLanguage[] = ['en', 'ko', 'ja', 'zh'];
const emptyLocalizedFields = (): LocalizedFields => ({ title: '', excerpt: '', content: '', seo_title: '', seo_description: '' });
const emptyForm: JobForm = {
  title: '', location: '', employment_type: 'full_time', sort_order: '0', status: 'draft', description: '',
  translations: { en: emptyLocalizedFields(), ko: emptyLocalizedFields(), ja: emptyLocalizedFields(), zh: emptyLocalizedFields() },
};

export default function AdminJobs() {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [form, setForm] = useState<JobForm>(emptyForm);
  const [editing, setEditing] = useState<JobPost | null>(null);
  const [languageTab, setLanguageTab] = useState<TranslationLanguage | 'vi'>('vi');
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadJobs = async () => {
    if (!supabase) return;
    const { data, error: loadError } = await supabase.from('job_posts').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: true });
    if (loadError) setError(loadError.message);
    else setJobs((data ?? []) as JobPost[]);
  };

  useEffect(() => { void loadJobs(); }, []);

  if (!supabase) return <section className="mt-8 rounded-lg border border-amber-200 bg-white p-6 text-amber-800">{supabaseConfigMessage}</section>;

  const localizedFields = languageTab === 'vi'
    ? { title: form.title, excerpt: form.location, content: form.description }
    : { title: form.translations[languageTab].title, excerpt: form.translations[languageTab].excerpt, content: form.translations[languageTab].content };

  const setField = <K extends keyof JobForm>(field: K, value: JobForm[K]) => setForm((current) => ({ ...current, [field]: value }));
  const setLocalizedField = (field: 'title' | 'excerpt' | 'content', value: string) => {
    if (languageTab === 'vi') {
      setForm((current) => ({ ...current, [field === 'title' ? 'title' : field === 'excerpt' ? 'location' : 'description']: value }));
      return;
    }
    setForm((current) => ({
      ...current,
      translations: { ...current.translations, [languageTab]: { ...current.translations[languageTab], [field]: value, manual: true } },
    }));
  };

  const resetForm = () => { setForm(emptyForm); setEditing(null); setLanguageTab('vi'); setPreview(false); setMessage(''); setError(''); };

  const editJob = (job: JobPost) => {
    setEditing(job);
    setForm({
      title: job.title, location: job.location, employment_type: job.employment_type, sort_order: String(job.sort_order), status: job.status, description: job.description,
      translations: {
        en: { ...emptyLocalizedFields(), ...(job.translations?.en ?? {}) },
        ko: { ...emptyLocalizedFields(), ...(job.translations?.ko ?? {}) },
        ja: { ...emptyLocalizedFields(), ...(job.translations?.ja ?? {}) },
        zh: { ...emptyLocalizedFields(), ...(job.translations?.zh ?? {}) },
      },
    });
    setLanguageTab('vi'); setPreview(false); setError(''); setMessage(''); window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const translateAgain = async (language: TranslationLanguage) => {
    setError(''); setMessage('');
    try {
      const [title, location, description] = await Promise.all([
        translateText(form.title, language), translateText(form.location, language), translateText(form.description, language),
      ]);
      setForm((current) => ({ ...current, translations: { ...current.translations, [language]: { ...emptyLocalizedFields(), title, excerpt: location, content: description, manual: false } } }));
      setMessage(`Đã dịch lại nội dung sang ${language.toUpperCase()}.`);
    } catch {
      setError(`Không thể dịch lại ${language.toUpperCase()}. Vui lòng thử lại.`);
    }
  };

  const saveJob = async (event: FormEvent) => {
    event.preventDefault(); setError(''); setMessage('');
    if (!form.title.trim() || !form.description.trim()) { setError('Vui lòng nhập tiêu đề và mô tả công việc.'); return; }
    setSaving(true);
    const translations: Record<string, LocalizedFields> = { ...(editing?.translations ?? {}), ...form.translations };
    const translationErrors: string[] = [];
    for (const language of languages) {
      if (translations[language]?.manual) continue;
      try {
        const [title, location, description] = await Promise.all([
          translateText(form.title.trim(), language), translateText(form.location.trim(), language), translateText(form.description.trim(), language),
        ]);
        translations[language] = { ...emptyLocalizedFields(), title, excerpt: location, content: description, manual: false };
      } catch { translationErrors.push(language); }
    }
    const payload = { title: form.title.trim(), location: form.location.trim(), employment_type: form.employment_type.trim(), sort_order: Number(form.sort_order) || 0, status: form.status, description: form.description.trim(), translations };
    const request = editing ? supabase.from('job_posts').update(payload).eq('id', editing.id) : supabase.from('job_posts').insert(payload);
    const { error: saveError } = await request;
    setSaving(false);
    if (saveError) { setError(`Không thể lưu vị trí tuyển dụng: ${saveError.message}`); return; }
    resetForm(); await loadJobs();
    setMessage(`${editing ? 'Đã cập nhật vị trí tuyển dụng.' : 'Đã thêm vị trí tuyển dụng.'}${translationErrors.length ? ` Không dịch được: ${translationErrors.join(', ')}.` : ''}`);
  };

  const deleteJob = async (job: JobPost) => {
    if (!window.confirm(`Xoá vị trí tuyển dụng "${job.title}"?`)) return;
    setError(''); setMessage('');
    const { error: deleteError } = await supabase.from('job_posts').delete().eq('id', job.id);
    if (deleteError) { setError(`Không thể xoá vị trí tuyển dụng: ${deleteError.message}`); return; }
    if (editing?.id === job.id) resetForm();
    setMessage('Đã xoá vị trí tuyển dụng.'); await loadJobs();
  };

  return <section className="mt-10 border-t border-slate-300 pt-8">
    <div className="mb-5 flex items-center justify-between"><div><h2 className="text-2xl font-bold">Quản lý tuyển dụng</h2><p className="mt-1 text-sm text-slate-500">{jobs.length} vị trí, sắp xếp theo thứ tự hiển thị</p></div></div>
    {message && <p className="mb-4 text-sm text-emerald-700">{message}</p>}{error && <p className="mb-4 text-sm text-red-600">{error}</p>}
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_420px]">
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white"><table className="w-full min-w-[700px] text-sm"><thead className="bg-slate-50 text-left text-slate-500"><tr><th className="p-4">Vị trí tuyển dụng</th><th className="p-4">Địa điểm</th><th className="p-4">Trạng thái</th><th className="p-4">Thứ tự</th><th className="p-4 text-right">Thao tác</th></tr></thead><tbody>{jobs.map((job) => <tr key={job.id} className="border-t border-slate-100"><td className="p-4 font-bold">{job.title}<span className="mt-1 block text-xs font-normal text-slate-500">{job.employment_type}</span></td><td className="p-4 text-slate-600">{job.location || '—'}</td><td className="p-4"><span className={`rounded px-2 py-1 text-xs font-bold ${job.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{job.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}</span></td><td className="p-4">{job.sort_order}</td><td className="p-4"><div className="flex justify-end gap-2"><button title="Chỉnh sửa" onClick={() => editJob(job)} className="rounded p-2 text-cyan-700 hover:bg-cyan-50"><Pencil className="h-4 w-4" /></button><button title="Xoá" onClick={() => void deleteJob(job)} className="rounded p-2 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button></div></td></tr>)}{jobs.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-slate-500">Chưa có vị trí tuyển dụng nào.</td></tr>}</tbody></table></div>
      <form onSubmit={saveJob} className="rounded-lg border border-slate-200 bg-white p-5 md:p-6"><div className="flex items-center justify-between"><h3 className="text-lg font-bold">{editing ? 'Chỉnh sửa vị trí' : 'Thêm vị trí mới'}</h3>{editing ? <button type="button" title="Đóng biểu mẫu" onClick={resetForm} className="p-1 text-slate-500"><X className="h-5 w-5" /></button> : <Plus className="h-5 w-5 text-cyan-600" />}</div><div className="mt-5 space-y-4"><div className="flex gap-1 border-b border-slate-200" role="tablist"><button type="button" onClick={() => setLanguageTab('vi')} className={`border-b-2 px-3 py-2 text-sm font-bold ${languageTab === 'vi' ? 'border-cyan-600 text-cyan-700' : 'border-transparent text-slate-500'}`}>VI</button>{languages.map((language) => <button key={language} type="button" onClick={() => setLanguageTab(language)} className={`border-b-2 px-3 py-2 text-sm font-bold ${languageTab === language ? 'border-cyan-600 text-cyan-700' : 'border-transparent text-slate-500'}`}>{language.toUpperCase()}</button>)}</div>{languageTab !== 'vi' && <button type="button" onClick={() => void translateAgain(languageTab)} className="w-full rounded-md border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm font-semibold text-cyan-700 hover:bg-cyan-100">Dịch lại từ tiếng Việt</button>}
        <label className="block text-sm font-semibold">Tiêu đề<input required value={localizedFields.title} onChange={(event) => setLocalizedField('title', event.target.value)} className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2" /></label>
        <label className="block text-sm font-semibold">Địa điểm<input value={localizedFields.excerpt} onChange={(event) => setLocalizedField('excerpt', event.target.value)} className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2" /></label>
        {languageTab === 'vi' && <><label className="block text-sm font-semibold">Loại hình làm việc<input required value={form.employment_type} onChange={(event) => setField('employment_type', event.target.value)} placeholder="full_time" className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2" /></label><label className="block text-sm font-semibold">Thứ tự<input type="number" value={form.sort_order} onChange={(event) => setField('sort_order', event.target.value)} className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2" /></label></>}
        <label className="block text-sm font-semibold">Mô tả công việc<textarea required rows={10} value={localizedFields.content} onChange={(event) => setLocalizedField('content', event.target.value)} className="mt-1.5 w-full resize-y rounded-md border border-slate-300 px-3 py-2" placeholder="Nhập mô tả dạng Markdown..." /></label>
        {languageTab !== 'vi' && <div className="flex items-center gap-2 text-xs text-slate-500"><span className={`h-2 w-2 rounded-full ${form.translations[languageTab].manual ? 'bg-amber-500' : 'bg-emerald-500'}`} />{form.translations[languageTab].manual ? 'Đã sửa tay — giữ nguyên khi lưu' : 'Sẽ tự dịch khi lưu nếu chưa sửa tay'}</div>}
        {languageTab === 'vi' && <div><div className="mb-2 flex items-center justify-between"><span className="text-sm font-semibold">Xem trước Markdown</span><button type="button" onClick={() => setPreview((current) => !current)} className="text-xs font-semibold text-cyan-700">{preview ? 'Chỉnh sửa' : 'Xem trước'}</button></div>{preview && <div className="min-h-40 rounded-md border border-slate-200 p-4 prose prose-sm max-w-none"><NewsContent content={form.description || 'Chưa có mô tả.'} /></div>}</div>}
        {languageTab === 'vi' && <><label className="flex items-center justify-between gap-3 text-sm font-semibold">Trạng thái<select value={form.status} onChange={(event) => setField('status', event.target.value as JobPost['status'])} className="rounded-md border border-slate-300 px-3 py-2 font-normal"><option value="draft">Bản nháp</option><option value="published">Đã xuất bản</option></select></label><button disabled={saving} className="w-full rounded-md bg-cyan-600 py-3 font-bold text-white hover:bg-cyan-700 disabled:opacity-60">{saving ? 'Đang lưu...' : editing ? 'Lưu thay đổi' : 'Thêm vị trí tuyển dụng'}</button></>}
      </div></form>
    </div>
  </section>;
}
