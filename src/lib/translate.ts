export type TranslationLanguage = 'en' | 'ko' | 'ja' | 'zh';

export type LocalizedFields = { title: string; excerpt: string; content: string; seo_title: string; seo_description: string; manual?: boolean };

const TERMS: Record<TranslationLanguage, Record<string, string>> = {
  en: { 'KCN Xuân Cẩm - Hương Lâm': 'Xuan Cam - Huong Lam Industrial Park', 'D-PARK GROUP': 'D-PARK GROUP', 'S-Dragon': 'S-Dragon', 'Bắc Giang': 'Bac Giang', 'Bắc Ninh': 'Bac Ninh', 'hạ tầng đồng bộ': 'integrated infrastructure' },
  ko: { 'KCN Xuân Cẩm - Hương Lâm': '쑤언껌 - 흐엉럼 산업단지', 'D-PARK GROUP': 'D-PARK GROUP', 'S-Dragon': 'S-Dragon', 'Bắc Giang': '박장', 'Bắc Ninh': '박닌', 'hạ tầng đồng bộ': '통합 인프라' },
  ja: { 'KCN Xuân Cẩm - Hương Lâm': 'スアンカム・フオンラム工業団地', 'D-PARK GROUP': 'D-PARK GROUP', 'S-Dragon': 'S-Dragon', 'Bắc Giang': 'バクザン', 'Bắc Ninh': 'バクニン', 'hạ tầng đồng bộ': '統合インフラ' },
  zh: { 'KCN Xuân Cẩm - Hương Lâm': '春锦-香林工业园区', 'D-PARK GROUP': 'D-PARK GROUP', 'S-Dragon': 'S-Dragon', 'Bắc Giang': '北江', 'Bắc Ninh': '北宁', 'hạ tầng đồng bộ': '一体化基础设施' },
};

// Whole [image:URL] tags, the "](url)" tail of markdown links, then bare URLs.
const PROTECTED_URL = /\[image:[^\]\n]*\]|\]\([^)\n]*\)|https?:\/\/[^\s)\]]+/g;

function mask(text: string, language: TranslationLanguage) {
  const tokens: string[] = [];
  const terms = TERMS[language];
  let value = text.replace(PROTECTED_URL, (match) => { const key = `§KEEP${tokens.length}§`; tokens.push(match); return key; });
  value = value.replace(/\*\*|\*|__|\[u\]|\[\/u\]/g, (match) => { const key = `§KEEP${tokens.length}§`; tokens.push(match); return key; });
  for (const [source, target] of Object.entries(terms)) value = value.split(source).join(`§KEEP${tokens.length}§`), tokens.push(target);
  return { value, tokens };
}

function unmask(text: string, tokens: string[]) {
  // The translator sometimes translates the label (KEEP → 保留 / キープ) or adds spaces; match on the number.
  return text.replace(/§\s*[^§\d\s]{0,12}\s*(\d+)\s*§/g, (_m, index) => tokens[Number(index)] ?? _m);
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function translateParagraph(paragraph: string, language: TranslationLanguage): Promise<string> {
  if (!paragraph.trim()) return paragraph;
  const { value, tokens } = mask(paragraph, language);
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=vi&tl=${language}&dt=t&q=${encodeURIComponent(value)}`;
  let response = await fetch(url);
  for (let attempt = 0; attempt < 5 && (response.status === 429 || response.status >= 500); attempt++) {
    await sleep(1000 * 2 ** attempt);
    response = await fetch(url);
  }
  if (!response.ok) throw new Error(`Translation request failed: ${response.status}`);
  const data = await response.json() as Array<Array<[string]>>;
  return unmask((data[0] ?? []).map((part) => part[0]).join(''), tokens);
}

export async function translateText(text: string, language: TranslationLanguage): Promise<string> {
  const out: string[] = [];
  for (const paragraph of text.split(/\n\n/)) {
    if (out.length) await sleep(150);
    out.push(await translateParagraph(paragraph, language));
  }
  return out.join('\n\n');
}

export async function translateFields(fields: Omit<LocalizedFields, 'manual'>, language: TranslationLanguage): Promise<LocalizedFields> {
  const title = await translateText(fields.title ?? '', language);
  const excerpt = await translateText(fields.excerpt ?? '', language);
  const content = await translateText(fields.content ?? '', language);
  const seo_title = await translateText(fields.seo_title ?? '', language);
  const seo_description = await translateText(fields.seo_description ?? '', language);
  return { title, excerpt, content, seo_title, seo_description };
}
