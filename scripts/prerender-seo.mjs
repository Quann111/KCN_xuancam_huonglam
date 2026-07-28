import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const root = process.cwd();
const dist = resolve(root, 'dist');
const siteUrl = 'https://www.xuancamhuonglamip.vn';
const defaultImage = `${siteUrl}/image/AIComplex_1776166732689.avif`;
const logoImage = `${siteUrl}/image/LOGO4.png`;
const pages = [
  { path: '/', title: 'Khu Công nghiệp Xuân Cẩm - Hương Lâm - D-Park Group', description: 'Khu Công nghiệp Xuân Cẩm - Hương Lâm có quy mô 224,02 ha, giai đoạn 1: 102,85 ha, giai đoạn 2: 121,17 ha. Vị trí đắc địa ngay trung tâm huyện Hiệp Hòa, tỉnh Bắc Giang.', heading: 'Khu Công nghiệp Xuân Cẩm - Hương Lâm', body: 'D-Park Group là đầu mối thông tin và tư vấn đầu tư cho giai đoạn 1 và giai đoạn 2.', links: [['/giai-doan-1', 'Tìm hiểu hạ tầng giai đoạn 1'], ['/giai-doan-2', 'Thông tin đầu tư giai đoạn 2']], schema: { '@context': 'https://schema.org', '@type': 'Product', name: 'Khu Công nghiệp Xuân Cẩm - Hương Lâm', image: { '@type': 'ImageObject', url: defaultImage }, description: 'Khu Công nghiệp Xuân Cẩm - Hương Lâm có quy mô 224,02 ha, trong đó giai đoạn 1 có diện tích 102,85 ha. Dự án nằm ngay chân cầu Xuân Cẩm - Bắc Phú qua sông Cầu.', brand: { '@type': 'Organization', name: 'D-Park Group' }, offers: { '@type': 'Offer', url: siteUrl, priceCurrency: 'VND', availability: 'InStock' } }, extraSchemas: [{ '@context': 'https://schema.org', '@type': 'Article', mainEntityOfPage: { '@type': 'WebPage', '@id': siteUrl }, headline: 'Khu Công nghiệp Xuân Cẩm - Hương Lâm', image: { '@type': 'ImageObject', url: defaultImage }, datePublished: '2025-01-01T00:00:00+07:00', dateModified: '2026-07-28T00:00:00+07:00', author: { '@type': 'Organization', name: 'D-Park Group' }, publisher: { '@type': 'Organization', name: 'D-Park Group', logo: { '@type': 'ImageObject', url: logoImage } }, description: 'Khu Công nghiệp Xuân Cẩm - Hương Lâm có quy mô 224,02 ha, trong đó giai đoạn 1 có diện tích 102,85 ha.' }, { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, item: { '@id': siteUrl, name: 'Trang chủ' } }, { '@type': 'ListItem', position: 2, item: { '@id': siteUrl, name: 'Khu Công nghiệp Xuân Cẩm - Hương Lâm' } }] }, { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Khu Công nghiệp Xuân Cẩm - Hương Lâm', url: siteUrl, potentialAction: { '@type': 'SearchAction', target: `${siteUrl}/?s={search_term_string}`, 'query-input': 'required name=search_term_string' } }] },
  { path: '/giai-doan-1', title: 'Khu Công nghiệp Xuân Cẩm - Hương Lâm Giai đoạn 1 | D-Park Group', description: 'Thông tin quy hoạch, hạ tầng kỹ thuật, vị trí và định hướng thu hút đầu tư tại Khu Công nghiệp Xuân Cẩm - Hương Lâm giai đoạn 1.', heading: 'Khu Công nghiệp Xuân Cẩm - Hương Lâm Giai đoạn 1', body: 'Thông tin quy hoạch, hạ tầng kỹ thuật và định hướng đầu tư được cập nhật bởi D-Park Group.', links: [['/', 'Khu Công nghiệp Xuân Cẩm - Hương Lâm'], ['/gioi-thieu-d-park-group', 'Liên hệ D-Park Group']] },
  { path: '/giai-doan-2', title: 'Khu Công nghiệp Xuân Cẩm - Hương Lâm Giai đoạn 2 | D-Park Group', description: 'Cập nhật thông tin đầu tư, quy hoạch, kết nối và định hướng phát triển Khu Công nghiệp Xuân Cẩm - Hương Lâm giai đoạn 2.', heading: 'Khu Công nghiệp Xuân Cẩm - Hương Lâm Giai đoạn 2', body: 'Thông tin đầu tư và định hướng phát triển mở rộng được cập nhật theo tài liệu được phép công bố.', links: [['/', 'Khu Công nghiệp Xuân Cẩm - Hương Lâm'], ['/gioi-thieu-d-park-group', 'Liên hệ D-Park Group']] },
  { path: '/gioi-thieu-d-park-group', title: 'Giới thiệu D-Park Group | Đại diện KCN Xuân Cẩm - Hương Lâm', description: 'D-Park Group là đầu mối thông tin và tư vấn đầu tư cho Khu Công nghiệp Xuân Cẩm - Hương Lâm giai đoạn 1 và giai đoạn 2.', heading: 'D-Park Group', body: 'D-Park Group cung cấp thông tin đã được xác thực và hỗ trợ tư vấn đầu tư cho dự án.', links: [['/giai-doan-1', 'Giai đoạn 1'], ['/giai-doan-2', 'Giai đoạn 2']] },
  { path: '/tin-tuc', title: 'Tin tức & Sự kiện | KCN Xuân Cẩm - Hương Lâm', description: 'Cập nhật tin tức, sự kiện và hoạt động đầu tư mới nhất tại KCN Xuân Cẩm - Hương Lâm.', heading: 'Tin tức & Sự kiện', body: 'Cập nhật mới nhất về dự án, hạ tầng và hoạt động đầu tư tại KCN Xuân Cẩm - Hương Lâm.', links: [['/', 'Trang chủ']] },
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
<meta name="keywords" content="khu công nghiệp Xuân Cẩm, khu công nghiệp Hương Lâm, KCN Hiệp Hòa, KCN Bắc Giang, bất động sản công nghiệp, D-Park Group">
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
for (const page of pages) {
  // Bỏ qua trang chủ để không ghi đè index.html của React SPA
  if (page.path === '/') continue;
  const output = resolve(dist, page.path.slice(1), 'index.html');
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, html(page), 'utf8');
}
console.log(`Pre-render: wrote ${pages.length} static SEO pages.`);
