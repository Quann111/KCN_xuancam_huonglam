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
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export function getAbsoluteNewsUrl(slug: string) {
  return `${baseUrl}/tin-tuc/${slug}`;
}

// --- Inline parsing ---

export type InlineSegment =
  | { type: 'text'; value: string }
  | { type: 'bold'; value: string }
  | { type: 'italic'; value: string }
  | { type: 'underline'; value: string }
  | { type: 'link'; value: string; href: string };

const INLINE_RE = /(\*\*(.+?)\*\*|\*(.+?)\*|__(.+?)__|\[u\](.+?)\[\/u\]|\[([^\]]+)\]\(([^)]+)\))/g;

function isValidUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}

export function parseInline(text: string): InlineSegment[] {
  const segments: InlineSegment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  INLINE_RE.lastIndex = 0;
  while ((match = INLINE_RE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', value: text.slice(lastIndex, match.index) });
    }
    if (match[2] !== undefined) {
      segments.push({ type: 'bold', value: match[2] });
    } else if (match[3] !== undefined) {
      segments.push({ type: 'italic', value: match[3] });
    } else if (match[4] !== undefined) {
      segments.push({ type: 'underline', value: match[4] });
    } else if (match[5] !== undefined) {
      segments.push({ type: 'underline', value: match[5] });
    } else if (match[6] !== undefined && match[7] !== undefined) {
      if (isValidUrl(match[7])) {
        segments.push({ type: 'link', value: match[6], href: match[7] });
      } else {
        segments.push({ type: 'text', value: match[0] });
      }
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    segments.push({ type: 'text', value: text.slice(lastIndex) });
  }
  return segments;
}

// --- Block parsing ---

export type ContentBlock =
  | { type: 'paragraph'; content: InlineSegment[] }
  | { type: 'heading2'; content: InlineSegment[] }
  | { type: 'heading3'; content: InlineSegment[] }
  | { type: 'quote'; content: InlineSegment[] }
  | { type: 'unordered-list'; items: InlineSegment[][] }
  | { type: 'ordered-list'; items: InlineSegment[][] }
  | { type: 'image'; url: string; alt: string; caption?: string };

const IMAGE_OLD_RE = /^\[image:(https?:\/\/[^\s]+)\]$/i;
const IMAGE_NEW_RE = /^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)$/;
const ORDERED_RE = /^\d+\.\s/;

function isSpecialLine(trimmed: string): boolean {
  return (
    trimmed.startsWith('## ') ||
    trimmed.startsWith('### ') ||
    trimmed.startsWith('> ') ||
    trimmed.startsWith('- ') ||
    ORDERED_RE.test(trimmed) ||
    IMAGE_OLD_RE.test(trimmed) ||
    IMAGE_NEW_RE.test(trimmed)
  );
}

export function parseNewsContent(content: string): ContentBlock[] {
  const lines = content.split('\n');
  const blocks: ContentBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const trimmed = lines[i].trim();

    if (trimmed === '') { i++; continue; }

    // Legacy image [image:URL]
    const oldImg = trimmed.match(IMAGE_OLD_RE);
    if (oldImg && isValidUrl(oldImg[1])) {
      blocks.push({ type: 'image', url: oldImg[1], alt: '' });
      i++;
      continue;
    }

    // New image ![alt](URL "caption")
    const newImg = trimmed.match(IMAGE_NEW_RE);
    if (newImg && isValidUrl(newImg[2])) {
      blocks.push({ type: 'image', url: newImg[2], alt: newImg[1] || '', caption: newImg[3] || undefined });
      i++;
      continue;
    }

    // Heading 2
    if (trimmed.startsWith('## ')) {
      blocks.push({ type: 'heading2', content: parseInline(trimmed.slice(3)) });
      i++;
      continue;
    }

    // Heading 3
    if (trimmed.startsWith('### ')) {
      blocks.push({ type: 'heading3', content: parseInline(trimmed.slice(4)) });
      i++;
      continue;
    }

    // Quote — collect consecutive > lines
    if (trimmed.startsWith('> ')) {
      const quoteContent: InlineSegment[] = [];
      while (i < lines.length && lines[i].trim().startsWith('> ')) {
        const qLine = lines[i].trim().slice(2);
        if (quoteContent.length > 0) quoteContent.push({ type: 'text', value: '\n' });
        quoteContent.push(...parseInline(qLine));
        i++;
      }
      blocks.push({ type: 'quote', content: quoteContent });
      continue;
    }

    // Unordered list — collect consecutive - lines
    if (trimmed.startsWith('- ')) {
      const items: InlineSegment[][] = [];
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        items.push(parseInline(lines[i].trim().slice(2)));
        i++;
      }
      blocks.push({ type: 'unordered-list', items });
      continue;
    }

    // Ordered list — collect consecutive N. lines
    if (ORDERED_RE.test(trimmed)) {
      const items: InlineSegment[][] = [];
      while (i < lines.length && ORDERED_RE.test(lines[i].trim())) {
        items.push(parseInline(lines[i].trim().replace(/^\d+\.\s/, '')));
        i++;
      }
      blocks.push({ type: 'ordered-list', items });
      continue;
    }

    // Paragraph — collect consecutive plain lines
    const paraLines: string[] = [];
    while (i < lines.length && lines[i].trim() !== '' && !isSpecialLine(lines[i].trim())) {
      paraLines.push(lines[i].trim());
      i++;
    }
    if (paraLines.length > 0) {
      blocks.push({ type: 'paragraph', content: parseInline(paraLines.join('\n')) });
    }
  }

  return blocks;
}
