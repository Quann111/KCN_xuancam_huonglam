import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const root = process.cwd();
const dist = resolve(root, 'dist');
const siteUrl = 'https://www.xuancamhuonglamip.vn';
const defaultImage = `${siteUrl}/image/AIComplex_1776166732689.avif`;
const logoImage = `${siteUrl}/image/LOGO4.png`;

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
  if (!url || !key) {
    console.warn('Pre-render: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not set. Skipping news prerender.');
    return [];
  }
  try {
    const response = await fetch(`${url}/rest/v1/news_posts?select=id,slug,title,seo_title,excerpt,seo_description,cover_image_url,published_at,updated_at&status=eq.published&order=published_at.desc`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!response.ok) throw new Error(`Supabase returned ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn(`Pre-render: cannot load published news (${error.message}). Skipping news prerender.`);
    return [];
  }
}

const pages = [
  { path: '/', title: 'Khu Công nghiệp Xuân Cẩm - Hương Lâm, Bắc Ninh', description: 'Khu Công nghiệp Xuân Cẩm - Hương Lâm tại xã Xuân Cẩm, tỉnh Bắc Ninh, quy mô 224,02 ha. Cập nhật vị trí, quy hoạch, hạ tầng và thông tin đầu tư.', heading: 'Khu Công nghiệp Xuân Cẩm - Hương Lâm', body: 'D-Park Group là đầu mối thông tin và tư vấn đầu tư cho giai đoạn 1 và giai đoạn 2.', links: [['/giai-doan-1', 'Tìm hiểu hạ tầng giai đoạn 1'], ['/giai-doan-2', 'Thông tin đầu tư giai đoạn 2']], schema: { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Khu Công nghiệp Xuân Cẩm - Hương Lâm, Bắc Ninh', description: 'Khu Công nghiệp Xuân Cẩm - Hương Lâm tại xã Xuân Cẩm, tỉnh Bắc Ninh, quy mô 224,02 ha.', url: siteUrl, isPartOf: { '@type': 'WebSite', name: 'Khu Công nghiệp Xuân Cẩm - Hương Lâm', url: siteUrl } }, extraSchemas: [{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, item: { '@id': siteUrl, name: 'Trang chủ' } }, { '@type': 'ListItem', position: 2, item: { '@id': siteUrl, name: 'Khu Công nghiệp Xuân Cẩm - Hương Lâm' } }] }, { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Khu Công nghiệp Xuân Cẩm - Hương Lâm', url: siteUrl, potentialAction: { '@type': 'SearchAction', target: `${siteUrl}/?s={search_term_string}`, 'query-input': 'required name=search_term_string' } }] },
  { path: '/giai-doan-1', title: 'Khu Công nghiệp Xuân Cẩm - Hương Lâm GĐ1, Bắc Ninh', description: 'KCN Xuân Cẩm - Hương Lâm giai đoạn 1 có quy mô 102,85 ha. Xem vị trí, quy hoạch, pháp lý, hạ tầng, ngành nghề và tiến độ đầu tư mới nhất.', heading: 'Khu Công nghiệp Xuân Cẩm - Hương Lâm Giai đoạn 1', body: 'Thông tin quy hoạch, hạ tầng kỹ thuật và định hướng đầu tư được cập nhật bởi D-Park Group.', links: [['/', 'Khu Công nghiệp Xuân Cẩm - Hương Lâm'], ['/gioi-thieu-d-park-group', 'Liên hệ D-Park Group']] },
  { path: '/giai-doan-2', title: 'Khu Công nghiệp Xuân Cẩm - Hương Lâm GĐ2, Bắc Ninh', description: 'Cập nhật Khu Công nghiệp Xuân Cẩm - Hương Lâm giai đoạn 2 tại Bắc Ninh: quy mô, vị trí, quy hoạch, tiến độ và cơ hội đầu tư cho doanh nghiệp.', heading: 'Khu Công nghiệp Xuân Cẩm - Hương Lâm Giai đoạn 2', body: 'Thông tin đầu tư và định hướng phát triển mở rộng được cập nhật theo tài liệu được phép công bố.', links: [['/', 'Khu Công nghiệp Xuân Cẩm - Hương Lâm'], ['/gioi-thieu-d-park-group', 'Liên hệ D-Park Group']] },
  { path: '/gioi-thieu-d-park-group', title: 'D-Park Group | Tư vấn KCN Xuân Cẩm - Hương Lâm', description: 'D-Park Group cung cấp thông tin và hỗ trợ doanh nghiệp tìm hiểu quy hoạch, hạ tầng, quỹ đất và cơ hội đầu tư tại KCN Xuân Cẩm - Hương Lâm.', heading: 'D-Park Group', body: 'D-Park Group cung cấp thông tin đã được xác thực và hỗ trợ tư vấn đầu tư cho dự án.', links: [['/giai-doan-1', 'Giai đoạn 1'], ['/giai-doan-2', 'Giai đoạn 2']] },
  { path: '/tin-tuc', title: 'Tin tức KCN Xuân Cẩm - Hương Lâm mới nhất', description: 'Cập nhật tiến độ, quy hoạch, hạ tầng, pháp lý và hoạt động đầu tư mới nhất tại Khu Công nghiệp Xuân Cẩm - Hương Lâm, tỉnh Bắc Ninh.', heading: 'Tin tức & Sự kiện', body: 'Cập nhật mới nhất về dự án, hạ tầng và hoạt động đầu tư tại KCN Xuân Cẩm - Hương Lâm.', links: [['/', 'Trang chủ']] },
];

async function findManifest(directory) {
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const itemPath = resolve(directory, item.name);
    if (item.isFile() && item.name === 'manifest.json') return itemPath;
    if (item.isDirectory()) { const found = await findManifest(itemPath); if (found) return found; }
  }
  return null;
}
const manifestPath = await findManifest(dist);
if (!manifestPath) throw new Error('Pre-render: Vite manifest was not found.');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const entry = Object.values(manifest).find((asset) => asset.isEntry);
if (!entry) throw new Error('Pre-render: Vite entry asset was not found.');
const assetUrl = (file) => `/${file}`;
const css = (entry.css ?? []).map((file) => `<link rel="stylesheet" href="${assetUrl(file)}">`).join('');
const script = `<script type="module" src="${assetUrl(entry.file)}"></script>`;
const esc = (value) => value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
function html(page) {
  const canonical = `${siteUrl}${page.path}`;
  const schema = page.schema || { '@context': 'https://schema.org', '@type': 'WebPage', name: page.title, description: page.description, url: canonical, isPartOf: { '@type': 'WebSite', name: 'Khu Công nghiệp Xuân Cẩm - Hương Lâm', url: siteUrl } };
  const extraSchemas = page.extraSchemas || [];
  const allSchemas = [JSON.stringify(schema), ...extraSchemas.map((s) => JSON.stringify(s))].map((s) => `<script type="application/ld+json">${s}</script>`).join('');
  return `<!doctype html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="google-site-verification" content="_h896_oIHVoPK2yvKw4Fj7LPiDjWKiEQgaKTB2oPCPk">
<meta name="robots" content="index, follow, max-snippet:-1, max-video-preview:-1, max-image-preview:large">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
<link rel="canonical" href="${canonical}">
<meta property="og:locale" content="vi_VN">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:site_name" content="D-Park Group">
<meta property="og:image" content="${defaultImage}">
<meta property="og:image:secure_url" content="${defaultImage}">
<meta property="og:image:alt" content="${esc(page.heading)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(page.title)}">
<meta name="twitter:description" content="${esc(page.description)}">
<meta name="twitter:image" content="${defaultImage}">
${allSchemas}
${css}
</head>
<body>
<div id="root">
<main>
<h1>${esc(page.heading)}</h1>
<p>${esc(page.body)}</p>
<nav>${page.links.map(([href, text]) => `<a href="${href}">${esc(text)}</a>`).join(' ')}</nav>
</main>
</div>
${script}
</body>
</html>`;
}

function newsHtml(post) {
  const path = `/tin-tuc/${post.slug}`;
  const canonical = `${siteUrl}${path}`;
  const title = post.seo_title || post.title;
  const description = post.seo_description || post.excerpt || '';
  const image = post.cover_image_url || defaultImage;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    description,
    mainEntityOfPage: canonical,
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    image: post.cover_image_url ? [post.cover_image_url] : [defaultImage],
    author: { '@type': 'Organization', name: 'D-Park Group', url: `${siteUrl}/gioi-thieu-d-park-group` },
    publisher: { '@type': 'Organization', name: 'D-Park Group', logo: { '@type': 'ImageObject', url: logoImage } },
  };
  return `<!doctype html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="index, follow, max-snippet:-1, max-video-preview:-1, max-image-preview:large">
<title>${esc(title)} | KCN Xuân Cẩm - Hương Lâm</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
<meta property="og:locale" content="vi_VN">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(title)} | KCN Xuân Cẩm - Hương Lâm">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:site_name" content="D-Park Group">
<meta property="og:image" content="${image}">
<meta property="og:image:secure_url" content="${image}">
<meta property="og:image:alt" content="${esc(title)}">
<meta property="article:published_time" content="${post.published_at}">
${post.updated_at ? `<meta property="article:modified_time" content="${post.updated_at}">` : ''}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)} | KCN Xuân Cẩm - Hương Lâm">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${image}">
<script type="application/ld+json">${JSON.stringify(schema)}</script>
${css}
</head>
<body>
<div id="root">
<main>
<h1>${esc(title)}</h1>
<p>${esc(description)}</p>
</main>
</div>
${script}
</body>
</html>`;
}

// Pre-render static pages
for (const page of pages) {
  if (page.path === '/') continue;
  const output = resolve(dist, page.path.slice(1), 'index.html');
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, html(page), 'utf8');
}

// Pre-render news article pages
const posts = await getPublishedPosts();
let newsCount = 0;
for (const post of posts) {
  const output = resolve(dist, 'tin-tuc', post.slug, 'index.html');
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, newsHtml(post), 'utf8');
  newsCount++;
}

console.log(`Pre-render: wrote ${pages.length} static SEO pages + ${newsCount} news articles.`);
