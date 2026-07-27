import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const root = process.cwd();
const siteUrl = 'https://www.xuancamhuonglamip.vn';
const fixedPages = ['/', '/giai-doan-1', '/giai-doan-2', '/gioi-thieu-d-park-group', '/tin-tuc'];

async function loadEnvFile() {
  try {
    const env = await readFile(resolve(root, '.env'), 'utf8');
    for (const line of env.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*["']?(.*?)["']?\s*$/);
      if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
    }
  } catch { /* CI supplies variables through GitHub Secrets. */ }
}

async function getPublishedPosts() {
  await loadEnvFile();
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  try {
    const response = await fetch(`${url}/rest/v1/news_posts?select=slug,updated_at&status=eq.published&order=published_at.desc`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!response.ok) throw new Error(`Supabase returned ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn(`Sitemap: cannot load published news (${error.message}). Continuing with fixed URLs.`);
    return [];
  }
}

const escapeXml = (value) => String(value).replace(/[<>&'\"]/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[char]);
const toUrl = (path) => `${siteUrl}${path === '/' ? '/' : path}`;
const posts = await getPublishedPosts();
const urls = [
  ...fixedPages.map((path) => ({ loc: toUrl(path), lastmod: null })),
  ...posts.map((post) => ({ loc: toUrl(`/tin-tuc/${post.slug}`), lastmod: post.updated_at })),
];
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(({ loc, lastmod }) => `  <url><loc>${escapeXml(loc)}</loc>${lastmod ? `<lastmod>${new Date(lastmod).toISOString().slice(0, 10)}</lastmod>` : ''}</url>`).join('\n')}\n</urlset>\n`;
const output = resolve(root, 'dist', 'sitemap.xml');
await mkdir(dirname(output), { recursive: true });
await writeFile(output, xml, 'utf8');
console.log(`Sitemap: wrote ${urls.length} URLs.`);
