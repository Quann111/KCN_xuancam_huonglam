import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const root = process.cwd();
const dist = resolve(root, 'dist');
const siteUrl = 'https://www.xuancamhuonglamip.vn';
const defaultImage = `${siteUrl}/image/AIComplex_1776166732689.avif`;
const pages = [
  { path: '/', title: 'Khu công nghiệp Xuân Cẩm - Hương Lâm | Giai đoạn 1 & 2 | D-Park Group', description: 'Khu công nghiệp Xuân Cẩm - Hương Lâm: thông tin giai đoạn 1, giai đoạn 2 và tư vấn đầu tư từ D-Park Group.', heading: 'Khu công nghiệp Xuân Cẩm - Hương Lâm', body: 'D-Park Group là đầu mối thông tin và tư vấn đầu tư cho giai đoạn 1 và giai đoạn 2.', links: [['/giai-doan-1', 'Tìm hiểu hạ tầng giai đoạn 1'], ['/giai-doan-2', 'Thông tin đầu tư giai đoạn 2']] },
  { path: '/giai-doan-1', title: 'Khu công nghiệp Xuân Cẩm - Hương Lâm Giai đoạn 1 | D-Park Group', description: 'Thông tin quy hoạch, hạ tầng kỹ thuật, vị trí và định hướng thu hút đầu tư tại Khu công nghiệp Xuân Cẩm - Hương Lâm giai đoạn 1.', heading: 'Khu công nghiệp Xuân Cẩm - Hương Lâm Giai đoạn 1', body: 'Thông tin quy hoạch, hạ tầng kỹ thuật và định hướng đầu tư được cập nhật bởi D-Park Group.', links: [['/', 'Khu công nghiệp Xuân Cẩm - Hương Lâm'], ['/gioi-thieu-d-park-group', 'Liên hệ D-Park Group']] },
  { path: '/giai-doan-2', title: 'Khu công nghiệp Xuân Cẩm - Hương Lâm Giai đoạn 2 | D-Park Group', description: 'Cập nhật thông tin đầu tư, quy hoạch, kết nối và định hướng phát triển Khu công nghiệp Xuân Cẩm - Hương Lâm giai đoạn 2.', heading: 'Khu công nghiệp Xuân Cẩm - Hương Lâm Giai đoạn 2', body: 'Thông tin đầu tư và định hướng phát triển mở rộng được cập nhật theo tài liệu được phép công bố.', links: [['/', 'Khu công nghiệp Xuân Cẩm - Hương Lâm'], ['/gioi-thieu-d-park-group', 'Liên hệ D-Park Group']] },
  { path: '/gioi-thieu-d-park-group', title: 'Giới thiệu D-Park Group | Đại diện KCN Xuân Cẩm - Hương Lâm', description: 'D-Park Group là đầu mối thông tin và tư vấn đầu tư cho Khu công nghiệp Xuân Cẩm - Hương Lâm giai đoạn 1 và giai đoạn 2.', heading: 'D-Park Group', body: 'D-Park Group cung cấp thông tin đã được xác thực và hỗ trợ tư vấn đầu tư cho dự án.', links: [['/giai-doan-1', 'Giai đoạn 1'], ['/giai-doan-2', 'Giai đoạn 2']] },
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
  const schema = { '@context': 'https://schema.org', '@type': 'WebPage', name: page.title, description: page.description, url: canonical, isPartOf: { '@type': 'WebSite', name: 'Khu công nghiệp Xuân Cẩm - Hương Lâm', url: siteUrl } };
  return `<!doctype html><html lang="vi"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="google-site-verification" content="p1K4sCKCP2tdr3F0ZLrmMcuJhNQn8RaUdbl-SMfTgGw"><title>${esc(page.title)}</title><meta name="description" content="${esc(page.description)}"><link rel="canonical" href="${canonical}"><meta property="og:type" content="website"><meta property="og:title" content="${esc(page.title)}"><meta property="og:description" content="${esc(page.description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${defaultImage}"><script type="application/ld+json">${JSON.stringify(schema)}</script>${css}</head><body><div id="root"><main><h1>${esc(page.heading)}</h1><p>${esc(page.body)}</p><nav>${page.links.map(([href, text]) => `<a href="${href}">${esc(text)}</a>`).join(' ')}</nav></main></div>${script}</body></html>`;
}
for (const page of pages) {
  const output = page.path === '/' ? resolve(dist, 'index.html') : resolve(dist, page.path.slice(1), 'index.html');
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, html(page), 'utf8');
}
console.log(`Pre-render: wrote ${pages.length} static SEO pages.`);
