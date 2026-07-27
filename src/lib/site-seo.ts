export const SITE_URL = 'https://www.xuancamhuonglamip.vn';
export const SITE_NAME = 'Khu công nghiệp Xuân Cẩm - Hương Lâm';
export const ORGANIZATION_NAME = 'D-Park Group';
export const ORGANIZATION_LOGO = `${SITE_URL}/image/LOGO4.png`;

type PhasePage = {
  path: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  overview: string;
  highlights: readonly (readonly [string, string])[];
  faqs: readonly { question: string; answer: string }[];
};

export const phasePages: Record<string, PhasePage> = {
  'giai-doan-1': {
    path: '/giai-doan-1',
    eyebrow: 'Giai đoạn 1',
    title: 'Khu công nghiệp Xuân Cẩm - Hương Lâm Giai đoạn 1 | D-Park Group',
    description: 'Thông tin quy hoạch, hạ tầng kỹ thuật, vị trí và định hướng thu hút đầu tư tại Khu công nghiệp Xuân Cẩm - Hương Lâm giai đoạn 1.',
    image: `${SITE_URL}/image/AIComplex_1777918636053.avif`,
    overview: 'Giai đoạn 1 là nền tảng phát triển hạ tầng kỹ thuật đồng bộ của Khu công nghiệp Xuân Cẩm - Hương Lâm, sẵn sàng phục vụ nhu cầu đầu tư sản xuất theo định hướng hiện đại và bền vững.',
    highlights: [
      ['Quy mô định hướng', '102,85 ha theo thông tin giới thiệu dự án hiện hành.'],
      ['Hạ tầng kỹ thuật', 'Giao thông nội khu, điện, nước, viễn thông và xử lý nước thải được triển khai đồng bộ theo quy hoạch.'],
      ['Định hướng đầu tư', 'Ưu tiên các dự án công nghệ cao, điện tử, cơ khí chính xác và công nghiệp hỗ trợ.'],
    ],
    faqs: [
      { question: 'Giai đoạn 1 có quy mô bao nhiêu?', answer: 'Thông tin giới thiệu hiện hành ghi nhận quy mô định hướng 102,85 ha. D-Park Group sẽ cập nhật số liệu chính thức khi có tài liệu được phê duyệt công khai.' },
      { question: 'Những ngành nghề nào được ưu tiên?', answer: 'Khu công nghiệp hướng tới các ngành công nghệ cao, điện tử, cơ khí chính xác, công nghiệp hỗ trợ và các lĩnh vực phù hợp với quy hoạch.' },
      { question: 'Làm thế nào để nhận tư vấn đầu tư?', answer: 'Doanh nghiệp có thể liên hệ D-Park Group để nhận thông tin vị trí, hạ tầng, quy trình và hồ sơ phù hợp với nhu cầu đầu tư.' },
    ],
  },
  'giai-doan-2': {
    path: '/giai-doan-2',
    eyebrow: 'Giai đoạn 2',
    title: 'Khu công nghiệp Xuân Cẩm - Hương Lâm Giai đoạn 2 | D-Park Group',
    description: 'Cập nhật thông tin đầu tư, quy hoạch, kết nối và định hướng phát triển Khu công nghiệp Xuân Cẩm - Hương Lâm giai đoạn 2.',
    image: `${SITE_URL}/image/AIComplex_1776167182236.avif`,
    overview: 'Giai đoạn 2 mở rộng định hướng phát triển của Khu công nghiệp Xuân Cẩm - Hương Lâm. D-Park Group là đầu mối cập nhật thông tin đầu tư theo tài liệu và tiến độ được phép công bố.',
    highlights: [
      ['Thông tin đầu tư', 'Các chỉ tiêu pháp lý, quy mô và tiến độ được cập nhật theo hồ sơ chính thức được D-Park Group công bố.'],
      ['Kết nối vùng', 'Định hướng tận dụng lợi thế kết nối khu vực để hỗ trợ hoạt động sản xuất, logistics và tiếp cận nguồn nhân lực.'],
      ['Dịch vụ đồng hành', 'Tư vấn thông tin dự án, kết nối nhu cầu đầu tư và hỗ trợ tìm hiểu hạ tầng phù hợp.'],
    ],
    faqs: [
      { question: 'Thông tin giai đoạn 2 được cập nhật ở đâu?', answer: 'Các thông tin mới nhất được D-Park Group đăng tải tại website và kênh liên hệ chính thức sau khi được xác thực.' },
      { question: 'Doanh nghiệp có thể đăng ký nhận thông tin sớm không?', answer: 'Có. Doanh nghiệp có thể gửi nhu cầu để D-Park Group tư vấn thông tin phù hợp với từng lĩnh vực đầu tư.' },
      { question: 'Giai đoạn 2 có những lợi thế nào?', answer: 'Giai đoạn 2 tiếp tục định hướng phát triển hạ tầng hiện đại, kết nối vùng và môi trường đầu tư phù hợp với doanh nghiệp sản xuất.' },
    ],
  },
};

export function getPhasePage(slug: string | undefined) {
  return slug ? phasePages[slug] ?? null : null;
}

export function absoluteUrl(path: string) {
  return `${SITE_URL}${path}`;
}
