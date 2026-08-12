import { ArrowRight, Building2, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import SeoHead from '../components/SeoHead';
import { absoluteUrl, ORGANIZATION_LOGO, ORGANIZATION_NAME, SITE_NAME } from '../lib/site-seo';

export default function AboutDpark() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: ORGANIZATION_NAME,
    url: absoluteUrl('/gioi-thieu-d-park-group'),
    logo: ORGANIZATION_LOGO,
    email: 'contact@dpark.vn',
    telephone: '+84989151510',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+84989151510',
      contactType: 'investment consultation',
      availableLanguage: ['Vietnamese', 'English'],
    },
  };

  return <PublicLayout>
    <SeoHead
      title="D-Park Group | Tư vấn KCN Xuân Cẩm - Hương Lâm"
      description="D-Park Group cung cấp thông tin và hỗ trợ doanh nghiệp tìm hiểu quy hoạch, hạ tầng, quỹ đất và cơ hội đầu tư tại KCN Xuân Cẩm - Hương Lâm."
      path="/gioi-thieu-d-park-group"
      image={ORGANIZATION_LOGO}
    >
      <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
    </SeoHead>
    <section className="bg-slate-950 py-16 text-white md:py-24">
      <div className="container mx-auto max-w-5xl px-4">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-400">Đơn vị đại diện</p>
        <h1 className="mt-4 text-4xl font-bold md:text-5xl">D-Park Group</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">D-Park Group là đầu mối cung cấp thông tin và hỗ trợ tư vấn cho nhà đầu tư quan tâm tới {SITE_NAME}, bao gồm giai đoạn 1 và giai đoạn 2.</p>
      </div>
    </section>
    <section className="py-16 md:py-20"><div className="container mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-2">
      <div><p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-700">Vai trò</p><h2 className="mt-3 text-3xl font-bold text-slate-900">Thông tin rõ ràng, tư vấn đúng phạm vi</h2><p className="mt-5 leading-8 text-slate-600">Mọi số liệu, tài liệu pháp lý, quy hoạch và tiến độ chỉ được cung cấp theo nội dung đã được phê duyệt. D-Park Group kết nối nhà đầu tư với nguồn thông tin phù hợp cho từng giai đoạn tìm hiểu, khảo sát và triển khai.</p></div>
      <div className="grid gap-4"><div className="border border-slate-200 p-5"><Building2 className="size-6 text-cyan-600" /><h3 className="mt-4 font-bold text-slate-900">KCN Xuân Cẩm - Hương Lâm</h3><p className="mt-2 leading-7 text-slate-600">Đầu mối thông tin cho giai đoạn 1 và giai đoạn 2.</p></div><div className="border border-slate-200 p-5"><Phone className="size-6 text-cyan-600" /><a href="tel:+84989151510" className="mt-4 block font-bold text-slate-900">(+84) 989 151 510</a><p className="mt-2 text-slate-600">Tư vấn đầu tư và kết nối khảo sát.</p></div><div className="border border-slate-200 p-5"><Mail className="size-6 text-cyan-600" /><a href="mailto:contact@dpark.vn" className="mt-4 block font-bold text-slate-900">contact@dpark.vn</a><p className="mt-2 text-slate-600">Kênh tiếp nhận thông tin chính thức.</p></div></div>
    </div></section>
    <section className="bg-slate-50 py-16 md:py-20"><div className="container mx-auto max-w-6xl px-4"><p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-700">Tìm hiểu dự án</p><h2 className="mt-3 text-3xl font-bold text-slate-900">Thông tin theo từng giai đoạn</h2><div className="mt-8 grid gap-5 md:grid-cols-2"><Link to="/giai-doan-1" className="border border-slate-200 bg-white p-6 transition-colors hover:border-cyan-500"><h3 className="text-xl font-bold text-slate-900">Giai đoạn 1</h3><p className="mt-3 text-slate-600">Quy hoạch, hạ tầng và định hướng đầu tư.</p><span className="mt-5 inline-flex items-center gap-2 font-bold text-cyan-700">Xem thông tin <ArrowRight className="size-4" /></span></Link><Link to="/giai-doan-2" className="border border-slate-200 bg-white p-6 transition-colors hover:border-cyan-500"><h3 className="text-xl font-bold text-slate-900">Giai đoạn 2</h3><p className="mt-3 text-slate-600">Thông tin đầu tư và định hướng phát triển mở rộng.</p><span className="mt-5 inline-flex items-center gap-2 font-bold text-cyan-700">Xem thông tin <ArrowRight className="size-4" /></span></Link></div></div></section>
  </PublicLayout>;
}
