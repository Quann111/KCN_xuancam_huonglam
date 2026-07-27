const baseUrl = 'https://www.xuancamhuonglamip.vn';

export function generateSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/đ/g, 'd')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function normalizeSlug(value: string) {
  return generateSlug(value);
}

export function formatNewsDate(value: string | null) {
  if (!value) return 'Chưa xuất bản';

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value));
}

export function getAbsoluteNewsUrl(slug: string) {
  return `${baseUrl}/tin-tuc/${slug}`;
}

export interface ContentBlock {
  type: 'paragraph' | 'image';
  value: string;
}

// Image lines use [image:https://...] so they can be rendered without raw HTML.
export function parseNewsContent(content: string): ContentBlock[] {
  return content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const imageMatch = block.match(/^\[image:(https?:\/\/[^\s]+)\]$/i);
      return imageMatch
        ? { type: 'image' as const, value: imageMatch[1] }
        : { type: 'paragraph' as const, value: block };
    });
}
