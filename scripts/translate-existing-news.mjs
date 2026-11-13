import { createClient } from '@supabase/supabase-js';
import { translateFields } from '../src/lib/translate.ts';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.log('translate:news skipped: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing'); process.exit(0); }
const client = createClient(url, key);
const { data, error } = await client.from('news_posts').select('*');
if (error) throw error;
for (const post of data ?? []) {
  const translations = { ...(post.translations ?? {}) };
  for (const lang of ['en', 'ko', 'ja', 'zh']) {
    if (translations[lang]?.manual) continue;
    try { translations[lang] = await translateFields({ title: post.title, excerpt: post.excerpt, content: post.content, seo_title: post.seo_title ?? '', seo_description: post.seo_description ?? '' }, lang); }
    catch (err) { console.error(`failed ${post.id}/${lang}:`, err.message); }
  }
  const result = await client.from('news_posts').update({ translations }).eq('id', post.id);
  if (result.error) console.error(`failed to save ${post.id}:`, result.error.message); else console.log(`translated ${post.id}`);
}

const { data: jobs, error: jobsError } = await client.from('job_posts').select('*');
if (jobsError) { console.error('translate:jobs skipped:', jobsError.message); process.exit(0); }
for (const job of jobs ?? []) {
  const translations = { ...(job.translations ?? {}) };
  for (const lang of ['en', 'ko', 'ja', 'zh']) {
    if (translations[lang]?.manual) continue;
    try {
      const translated = await translateFields({ title: job.title, excerpt: job.location, content: job.description, seo_title: '', seo_description: '' }, lang);
      translations[lang] = { ...translated, location: translated.excerpt };
    } catch (err) { console.error(`failed job ${job.id}/${lang}:`, err.message); }
  }
  const result = await client.from('job_posts').update({ translations }).eq('id', job.id);
  if (result.error) console.error(`failed job save ${job.id}:`, result.error.message); else console.log(`translated job ${job.id}`);
}
