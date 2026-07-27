import { ArrowRight, CheckCircle2, MapPin } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import SeoHead from '../components/SeoHead';
import { absoluteUrl, getPhasePage, ORGANIZATION_NAME, SITE_NAME } from '../lib/site-seo';

export default function ProjectPhase() {
  const { phase } = useParams<{ phase: 'giai-doan-1' | 'giai-doan-2' }>();
  const page = getPhasePage(phase);

  if (!page) return <Navigate to="/" replace />;

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: absoluteUrl('/') },
      { '@type': 'ListItem', position: 2, name: page.eyebrow, item: absoluteUrl(page.path) },
    ],
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
  const imageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl: page.image,
    name: `${SITE_NAME} ${page.eyebrow}`,
    description: page.description,
  };

  return <PublicLayout>
    <SeoHead title={page.title} description={page.description} path={page.path} image={page.image}>
      <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(imageSchema)}</script>
    </SeoHead>

    <section className="bg-slate-950 py-16 text-white md:py-24">
      <div className="container mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[1fr_0.85fr] lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-400">{page.eyebrow}</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">{SITE_NAME} {page.eyebrow}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">{page.overview}</p>
          <Link to="/#lien-he" className="mt-8 inline-flex items-center gap-2 bg-cyan-500 px-5 py-3 font-bold text-slate-950 transition-colors hover:bg-cyan-400">
            Nhận tư vấn đầu tư <ArrowRight className="size-4" />
          </Link>
        </div>
        <img src={page.image} alt={`Hình ảnh ${SITE_NAME} ${page.eyebrow}`} width="960" height="640" className="aspect-[3/2] w-full object-cover" />
      </div>
    </section>

    <section className="py-16 md:py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-700">Thông tin định hướng</p>
        <h2 className="mt-3 text-3xl font-bold text-slate-900">Quy hoạch, hạ tầng và cơ hội đầu tư</h2>
        <div className="mt-9 grid gap-5 md:grid-cols-3">
          {page.highlights.map(([title, content]) => <article key={title} className="border border-slate-200 p-6">
            <CheckCircle2 className="size-6 text-cyan-600" />
            <h3 className="mt-5 text-xl font-bold text-slate-900">{title}</h3>
            <p className="mt-3 leading-7 text-slate-600">{content}</p>
          </article>)}
        </div>
      </div>
    </section>

    <section className="bg-slate-50 py-16 md:py-20">
      <div className="container mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-2">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-700">Vị trí và kết nối</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">Kết nối theo quy hoạch dự án</h2>
          <p className="mt-5 leading-8 text-slate-600">Thông tin vị trí, kết nối giao thông, logistics và quỹ đất được D-Park Group cập nhật theo hồ sơ được phép công bố. Đội ngũ tư vấn sẽ cung cấp tài liệu phù hợp với nhu cầu khảo sát của từng nhà đầu tư.</p>
          <div className="mt-6 flex items-start gap-3 text-slate-700"><MapPin className="mt-1 size-5 shrink-0 text-cyan-600" /><span>Khu vực Xuân Cẩm - Hương Lâm theo hồ sơ dự án được phép công bố.</span></div>
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-700">Dịch vụ D-Park Group</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">Đồng hành từ tìm hiểu đến triển khai</h2>
          <ul className="mt-5 space-y-4 leading-7 text-slate-600">
            <li>Tiếp nhận nhu cầu, cung cấp thông tin dự án đã được xác thực.</li>
            <li>Hỗ trợ kết nối khảo sát, hồ sơ quy hoạch và phương án hạ tầng phù hợp.</li>
            <li>Tư vấn quy trình đầu tư theo quy định và phạm vi dịch vụ được phê duyệt.</li>
          </ul>
          <Link to="/gioi-thieu-d-park-group" className="mt-7 inline-flex items-center gap-2 font-bold text-cyan-700 hover:text-cyan-600">Tìm hiểu về {ORGANIZATION_NAME} <ArrowRight className="size-4" /></Link>
        </div>
      </div>
    </section>

    <section className="py-16 md:py-20">
      <div className="container mx-auto max-w-4xl px-4">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-700">Câu hỏi thường gặp</p>
        <h2 className="mt-3 text-3xl font-bold text-slate-900">Thông tin cần biết về {page.eyebrow.toLowerCase()}</h2>
        <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
          {page.faqs.map((faq) => <details key={faq.question} className="group py-5">
            <summary className="cursor-pointer list-none pr-8 text-lg font-bold text-slate-900">{faq.question}</summary>
            <p className="mt-3 leading-7 text-slate-600">{faq.answer}</p>
          </details>)}
        </div>
      </div>
    </section>
  </PublicLayout>;
}
