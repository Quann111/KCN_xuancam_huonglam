import { InlineSegment, ContentBlock, parseNewsContent, parseInline } from '../lib/news-utils';

function InlineRenderer({ segments }: { segments: InlineSegment[] }) {
  return (
    <>
      {segments.map((seg, i) => {
        const key = `${seg.type}-${i}`;
        switch (seg.type) {
          case 'bold':
            return <strong key={key} className="font-bold">{seg.value}</strong>;
          case 'italic':
            return <em key={key}>{seg.value}</em>;
          case 'underline':
            return <u key={key}>{seg.value}</u>;
          case 'link':
            return <a key={key} href={seg.href} target="_blank" rel="noopener noreferrer" className="text-cyan-600 underline hover:text-cyan-700">{seg.value}</a>;
          default:
            return <span key={key}>{seg.value}</span>;
        }
      })}
    </>
  );
}

function BlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'heading2':
      return <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900"><InlineRenderer segments={block.content} /></h2>;
    case 'heading3':
      return <h3 className="text-xl font-bold mt-6 mb-3 text-slate-900"><InlineRenderer segments={block.content} /></h3>;
    case 'quote':
      return (
        <blockquote className="border-l-4 border-cyan-500 pl-5 italic text-slate-600 my-4">
          <InlineRenderer segments={block.content} />
        </blockquote>
      );
    case 'unordered-list':
      return (
        <ul className="list-disc pl-6 space-y-1 my-4">
          {block.items.map((item, i) => (
            <li key={i}><InlineRenderer segments={item} /></li>
          ))}
        </ul>
      );
    case 'ordered-list':
      return (
        <ol className="list-decimal pl-6 space-y-1 my-4">
          {block.items.map((item, i) => (
            <li key={i}><InlineRenderer segments={item} /></li>
          ))}
        </ol>
      );
    case 'image':
      return (
        <figure className="my-6">
          <img
            src={block.url}
            alt={block.alt || 'Hình ảnh trong bài viết'}
            loading="lazy"
            className="w-full rounded-lg"
          />
          {block.caption && (
            <figcaption className="mt-2 text-center text-sm text-slate-500">{block.caption}</figcaption>
          )}
        </figure>
      );
    default:
      return (
        <p className="mb-4 whitespace-pre-line leading-relaxed">
          <InlineRenderer segments={block.content} />
        </p>
      );
  }
}

export interface NewsContentProps {
  content: string;
  className?: string;
}

export default function NewsContent({ content, className }: NewsContentProps) {
  const blocks = parseNewsContent(content);

  if (blocks.length === 0) {
    return <p className="text-slate-400 italic">Nội dung chưa được cập nhật.</p>;
  }

  return (
    <div className={className || 'space-y-2 leading-relaxed text-slate-700'}>
      {blocks.map((block, index) => (
        <div key={index}>
          <BlockRenderer block={block} />
        </div>
      ))}
    </div>
  );
}
