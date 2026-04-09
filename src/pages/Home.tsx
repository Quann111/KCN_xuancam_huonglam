import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, Users, Zap, ShieldCheck, Map, Clock, DollarSign, 
  ChevronLeft, ChevronRight, Droplets, Waves, Globe, Plane, 
  Ship, CheckCircle2, Phone, Mail, MapPin, Menu, X, ChevronUp, Search
} from 'lucide-react';

const sliderImages = [
  '/image/Toàn cảnh-12.png',
  '/image/Toàn cảnh-13.png',
];

const stats = [
  { label: 'Quy mô (GĐ1)', value: '102,85 ha', icon: Map, color: 'bg-blue-500' },
  { label: 'Vốn đầu tư', value: '1.467,5 tỷ VNĐ', icon: DollarSign, color: 'bg-pink-500' },
  { label: 'Thời hạn đến', value: 'Năm 2075', icon: Clock, color: 'bg-slate-700' },
  { label: 'Lao động dự kiến', value: '4.500 người', icon: Users, color: 'bg-orange-500' },
];

const navItems = [
  { name: 'VỊ TRÍ', id: 'vi-tri' },
  { name: 'HẠ TẦNG', id: 'ha-tang' },
  { name: 'QUY MÔ & NGÀNH NGHỀ', id: 'quy-mo' },
  { name: 'CHI PHÍ & ƯU ĐÃI', id: 'chi-phi-uu-dai' },
  { name: 'TIỆN ÍCH', id: 'tien-ich' },
  { name: 'QUY TRÌNH', id: 'quy-trinh' },
  { name: 'HỖ TRỢ', id: 'ho-tro' },
  { name: 'TIN TỨC', id: 'tin-tuc' },
  { name: 'TUYỂN DỤNG', id: 'tuyen-dung' },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-white">
      {/* Top Bar */}
      <div className="hidden lg:block border-b border-slate-100 py-3 bg-white">
        <div className="container mx-auto px-4 flex justify-end items-center gap-8 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-600" />
            <span>Số 34, ngõ 291, đường Lê Lợi, P. Hoàng Văn Thụ, TP. Bắc Giang</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-red-600" />
            <span>(+84) 989 151 510</span>
          </div>
          <button 
            onClick={() => scrollToSection('lien-he')}
            className="border border-cyan-500 text-cyan-500 px-6 py-1.5 rounded-full hover:bg-cyan-500 hover:text-white transition-colors uppercase tracking-wider"
          >
            LIÊN HỆ
          </button>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/image/fb11a904-0e59-47d1-abfa-e5b80a29d688.jpg" 
              alt="D-Park Group Logo" 
              className="h-16 md:h-20 lg:h-24 w-auto object-contain transition-transform hover:scale-105" 
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-[13px] font-bold tracking-wider text-slate-600 hover:text-cyan-500 transition-colors uppercase"
              >
                {item.name}
              </button>
            ))}
            <AnimatePresence>
              {isScrolled && (
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onClick={() => scrollToSection('lien-he')}
                  className="bg-cyan-500 text-white px-6 py-2 rounded-full text-[13px] font-bold hover:bg-cyan-600 transition-colors uppercase tracking-wider shadow-lg shadow-cyan-500/20"
                >
                  LIÊN HỆ
                </motion.button>
              )}
            </AnimatePresence>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2 text-slate-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-slate-100 overflow-hidden"
            >
              <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="text-left text-lg font-semibold py-3 border-b border-slate-50 flex justify-between items-center text-slate-600"
                  >
                    {item.name}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ))}
                <button
                  onClick={() => scrollToSection('lien-he')}
                  className="mt-4 bg-cyan-500 text-white w-full py-4 rounded-2xl font-bold text-lg shadow-lg shadow-cyan-500/20 uppercase tracking-wider"
                >
                  LIÊN HỆ NGAY
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentSlide}
              src={sliderImages[currentSlide]}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl text-white"
          >
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-block bg-cyan-500 text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6"
            >
              Dự án trọng điểm Bắc Giang
            </motion.span>
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-extrabold leading-tight mb-8 tracking-tight md:whitespace-nowrap">
              KCN Xuân Cẩm <span className="text-cyan-400">– Hương Lâm</span>
            </h1>
            <p className="text-base md:text-lg text-slate-200 mb-12 leading-relaxed font-light md:whitespace-nowrap">
              Tâm điểm kết nối – Kiến tạo thịnh vượng. Hạ tầng đồng bộ, hiện đại, thu hút đầu tư công nghệ cao.
            </p>
            <div className="flex flex-wrap gap-6">
              <button onClick={() => document.getElementById('quy-mo')?.scrollIntoView({ behavior: 'smooth' })} className="bg-white text-slate-900 px-10 py-5 rounded-2xl font-bold hover:bg-cyan-500 hover:text-white transition-all flex items-center gap-3 group text-lg shadow-xl shadow-black/20">
                Tìm hiểu dự án
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-12 right-12 z-20 flex gap-4">
          <button onClick={prevSlide} className="w-14 h-14 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={nextSlide} className="w-14 h-14 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-20 -mt-24 pb-24">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 p-8 md:p-12 border border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  <div className="flex items-start gap-6">
                    <div className={`w-16 h-16 ${stat.color} rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-current/20 group-hover:scale-110 transition-transform duration-500`}>
                      <stat.icon className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                      <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tầm nhìn & Sứ mệnh Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="text-cyan-600 font-black uppercase tracking-[0.2em] text-sm">Tầm nhìn & Sứ mệnh</span>
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight tracking-tighter">Kiến tạo hạ tầng <br /> <span className="text-cyan-500">vững bền, hiện đại</span></h2>
              </div>
              <div className="p-8 bg-white rounded-[40px] shadow-xl border border-slate-100">
                <p className="text-lg text-slate-600 leading-relaxed italic">
                  "Xây dựng hạ tầng kỹ thuật đồng bộ, hiện đại, thu hút đầu tư công nghệ cao tại Bắc Giang. Tâm điểm kết nối – Kiến tạo thịnh vượng."
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Chất lượng Nhật Bản</h4>
                    <p className="text-sm text-slate-500">Tư vấn bởi Nippon Koei</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 shrink-0">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Công nghệ cao</h4>
                    <p className="text-sm text-slate-500">Ưu tiên dự án thông minh</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-[40px] overflow-hidden shadow-2xl">
                <img src="https://picsum.photos/seed/vision/800/600" alt="Tầm nhìn dự án" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-cyan-500 rounded-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* VỊ TRÍ & GIAO THÔNG Section */}
      <section id="vi-tri" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-20 mb-20">
            <div className="lg:w-1/2">
              <div className="relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="relative z-10 rounded-[40px] overflow-hidden shadow-2xl border-8 border-white"
                >
                  <img 
                    src="https://picsum.photos/seed/map-location/800/600" 
                    alt="Vị trí dự án" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl" />
              </div>
            </div>
            <div className="lg:w-1/2 space-y-8">
              <span className="text-cyan-600 font-black uppercase tracking-[0.2em] text-sm">Vị trí chiến lược</span>
              <h2 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight tracking-tighter">
                Tâm điểm kết nối <br /> vùng kinh tế <span className="text-cyan-500">trọng điểm</span>
              </h2>
              <div className="space-y-6 text-lg text-slate-600 font-light leading-relaxed">
                <p>• Dự án tọa lạc tại <strong>xã Xuân Cẩm, huyện Hiệp Hòa, tỉnh Bắc Giang</strong>, trung tâm tam giác công nghiệp Đông Bắc Hà Nội: <strong>Thái Nguyên – Bắc Ninh – Bắc Giang</strong>.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-cyan-600 font-bold">50 km</div>
                    <div className="text-sm text-slate-500">Đến Trung tâm Hà Nội</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-cyan-600 font-bold">20 km</div>
                    <div className="text-sm text-slate-500">Đến TP. Bắc Ninh</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-cyan-600 font-bold">30 km</div>
                    <div className="text-sm text-slate-500">Đến TP. Bắc Giang</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-cyan-600 font-bold">65 km</div>
                    <div className="text-sm text-slate-500">Đến TP. Thái Nguyên</div>
                  </div>
                </div>
                <p>• Kết nối giao thông cực kỳ thuận tiện: Cách <strong>Cao tốc Hà Nội – Thái Nguyên 4km</strong> và cách <strong>Cao tốc Hà Nội – Lạng Sơn 20km</strong>.</p>
                <p>• Gần các "ông lớn" công nghệ: Cách <strong>Samsung Bắc Ninh 15km</strong> và <strong>Samsung Thái Nguyên 20km</strong>.</p>
              </div>
            </div>
          </div>

          {/* Giao thông cards merged here */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-slate-100">
            {[
              { title: 'Đường hàng không', value: '20km', desc: 'Đến Sân bay Quốc tế Nội Bài, thuận tiện vận chuyển hàng hóa quốc tế và chuyên gia.', icon: Plane, color: 'text-blue-500' },
              { title: 'Đường biển', value: '120km', desc: 'Đến Cảng Hải Phòng và Cảng Lạch Huyện qua QL5 và Cao tốc Hà Nội - Hải Phòng.', icon: Ship, color: 'text-cyan-500' },
              { title: 'Đường bộ', value: '4km', desc: 'Kết nối trực tiếp vào Cao tốc Hà Nội - Thái Nguyên (CT07) và các trục QL18, QL5.', icon: Map, color: 'text-slate-900' },
            ].map((item) => (
              <motion.div 
                key={item.title} 
                whileHover={{ y: -10 }}
                className="p-10 rounded-[40px] bg-slate-50 border border-slate-100 text-center shadow-xl shadow-slate-200/20"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <item.icon className={`w-8 h-8 ${item.color}`} />
                </div>
                <h4 className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-4">{item.title}</h4>
                <div className="text-5xl font-black mb-6 text-slate-900">{item.value}</div>
                <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HẠ TẦNG Section */}
      <section id="ha-tang" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <span className="text-cyan-600 font-black uppercase tracking-[0.2em] text-sm">Hạ tầng kỹ thuật</span>
            <h2 className="text-4xl md:text-6xl font-bold mt-4 tracking-tighter">Đồng bộ & Hiện đại</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Đường nội khu', en: 'Internal road', desc: 'Tuyến chính rộng 72m (6 làn xe + kênh điều hòa). Tuyến nội bộ tối thiểu 4 làn xe.', icon: Map, color: 'bg-blue-500' },
              { title: 'Cung cấp điện', en: 'Power supply', desc: 'Trạm biến áp 110/22 kV hiện đại. Điện áp cấp đến tận hàng rào nhà máy 22kV.', icon: Zap, color: 'bg-yellow-500' },
              { title: 'Cung cấp nước sạch', en: 'Provide clean water', desc: 'Hệ thống cấp nước công suất Giai đoạn 1 đạt 5.000 m3/ngày đêm.', icon: Droplets, color: 'bg-cyan-500' },
              { title: 'Xử lý nước thải', en: 'Wastewater treatment', desc: 'Hệ thống xử lý đạt tiêu chuẩn loại A QCVN 40:2011/BTNMT. Công suất 5.000 m3/ngày.', icon: Waves, color: 'bg-green-500' },
              { title: 'Phòng cháy chữa cháy', en: 'Fire protection', desc: 'Hệ thống trụ cứu hỏa bố trí thuận tiện dọc các trục đường giao thông.', icon: ShieldCheck, color: 'bg-red-500' },
              { title: 'Viễn thông', en: 'Telecommunications', desc: 'Hệ thống cáp quang, internet tốc độ cao sẵn sàng kết nối tới từng lô đất.', icon: Globe, color: 'bg-indigo-500' },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-8 rounded-[40px] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500"
              >
                <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-current/20 group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 mb-4">{item.en}</p>
                <p className="text-slate-500 leading-relaxed font-light">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* QUY MÔ & NGÀNH NGHỀ Section */}
      <section id="quy-mo" className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500 rounded-full translate-x-1/2 -translate-y-1/2 blur-[120px]" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row gap-20">
            <div className="lg:w-1/2 space-y-12">
              <div className="space-y-4">
                <span className="text-cyan-400 font-black uppercase tracking-[0.2em] text-sm">Quy mô & Ngành nghề</span>
                <h2 className="text-4xl md:text-6xl font-bold leading-tight tracking-tighter">Phát triển bền vững <br /> cùng <span className="text-cyan-400">Công nghệ cao</span></h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="p-8 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10">
                  <div className="text-4xl font-black text-cyan-400 mb-2">102,85 ha</div>
                  <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Tổng diện tích GĐ1</div>
                </div>
                <div className="p-8 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10">
                  <div className="text-4xl font-black text-cyan-400 mb-2">63,72 ha</div>
                  <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Đất công nghiệp</div>
                </div>
                <div className="p-8 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10">
                  <div className="text-4xl font-black text-cyan-400 mb-2">2,73 ha</div>
                  <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Đất dịch vụ</div>
                </div>
                <div className="p-8 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10">
                  <div className="text-4xl font-black text-cyan-400 mb-2">5,47 ha</div>
                  <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Đất hạ tầng kỹ thuật</div>
                </div>
              </div>
              <div className="space-y-6">
                <h4 className="text-2xl font-bold flex items-center gap-3">
                  <CheckCircle2 className="text-cyan-400 w-6 h-6" />
                  Ngành nghề khuyến khích đầu tư:
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-400 text-lg font-light">
                  <li>• Công nghệ hiện đại, công nghệ cao</li>
                  <li>• Chế biến trái cây & nông sản</li>
                  <li>• Dược phẩm, thiết bị y tế</li>
                  <li>• Công nghệ sinh học</li>
                  <li>• Sản xuất linh kiện điện tử</li>
                  <li>• Cơ khí chế tạo chính xác</li>
                </ul>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="rounded-[40px] overflow-hidden shadow-2xl border-4 border-white/10">
                <img 
                  src="https://picsum.photos/seed/industrial-layout/800/800" 
                  alt="Quy hoạch KCN" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CHI PHÍ & ƯU ĐÃI Section */}
      <section id="chi-phi-uu-dai" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <span className="text-cyan-600 font-black uppercase tracking-[0.2em] text-sm">Chi phí & Ưu đãi</span>
            <h2 className="text-4xl md:text-6xl font-bold mt-4 tracking-tighter">Cạnh tranh & Hấp dẫn</h2>
          </div>
          
          {/* Cost Part */}
          <div className="max-w-4xl mx-auto bg-slate-50 rounded-[40px] overflow-hidden border border-slate-100 shadow-xl mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-12 border-b md:border-b-0 md:border-r border-slate-200">
                <h4 className="text-xl font-bold text-slate-900 mb-8">Lương tối thiểu vùng</h4>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black text-cyan-600">160$</span>
                  <span className="text-slate-400 font-bold">/ tháng</span>
                </div>
                <p className="mt-6 text-slate-500 leading-relaxed">Áp dụng cho Vùng 3 theo quy định của Chính phủ Việt Nam, giúp tối ưu chi phí nhân công cho doanh nghiệp.</p>
              </div>
              <div className="p-12">
                <h4 className="text-xl font-bold text-slate-900 mb-8">Tổng vốn đầu tư hạ tầng</h4>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-900">1.467,5</span>
                  <span className="text-slate-400 font-bold">tỷ VNĐ</span>
                </div>
                <p className="mt-6 text-slate-500 leading-relaxed">Cam kết đầu tư hạ tầng chất lượng cao nhất với đơn vị tư vấn Nippon Koei (Nhật Bản).</p>
              </div>
            </div>
          </div>

          {/* Incentives Part */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="p-12 bg-white rounded-[40px] shadow-xl border border-slate-100 space-y-8">
              <div className="inline-block bg-cyan-500 text-white px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest">Dự án diện đặc biệt</div>
              <h3 className="text-3xl font-bold text-slate-900">Khuyến khích đầu tư</h3>
              <ul className="space-y-4 text-lg text-slate-600 font-light">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-cyan-500 shrink-0 mt-1" />
                  <span><strong>10%</strong> thuế suất áp dụng trong 15 năm</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-cyan-500 shrink-0 mt-1" />
                  <span><strong>Miễn 4 năm</strong> thuế TNDN (kể từ khi có thu nhập chịu thuế)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-cyan-500 shrink-0 mt-1" />
                  <span><strong>Giảm 50%</strong> trong 9 năm tiếp theo</span>
                </li>
              </ul>
            </div>
            <div className="p-12 bg-white rounded-[40px] shadow-xl border border-slate-100 space-y-8">
              <div className="inline-block bg-slate-700 text-white px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest">Dự án mức độ thông thường</div>
              <h3 className="text-3xl font-bold text-slate-900">Ưu đãi phổ thông</h3>
              <ul className="space-y-4 text-lg text-slate-600 font-light">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-slate-700 shrink-0 mt-1" />
                  <span><strong>Miễn 2 năm</strong> thuế TNDN</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-slate-700 shrink-0 mt-1" />
                  <span><strong>Giảm 50%</strong> trong 4 năm tiếp theo (thuế suất 20%)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-slate-700 shrink-0 mt-1" />
                  <span><strong>0%</strong> thuế nhập khẩu máy móc, trang thiết bị tạo tài sản cố định</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Additional Incentives */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm">
              <div className="text-cyan-500 font-bold text-xl mb-4">Thuế GTGT</div>
              <p className="text-slate-500 text-sm"><strong>0%</strong> áp dụng cho các dự án được cấp phép chế xuất.</p>
            </div>
            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm">
              <div className="text-cyan-500 font-bold text-xl mb-4">Thuế TNCN</div>
              <p className="text-slate-500 text-sm"><strong>Giảm 50%</strong> thuế TNCN cho các chuyên gia làm việc tại dự án khuyến khích đầu tư.</p>
            </div>
            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm">
              <div className="text-cyan-500 font-bold text-xl mb-4">Thủ tục đặc biệt</div>
              <p className="text-slate-500 text-sm">Ưu tiên rút ngắn thủ tục cho các dự án CNC, R&D, bán dẫn, chip điện tử.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TIỆN ÍCH Section */}
      <section id="tien-ich" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="rounded-[40px] overflow-hidden shadow-2xl">
                  <img src="https://picsum.photos/seed/utilities/800/600" alt="Tiện ích dự án" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-cyan-500 rounded-full blur-2xl opacity-20" />
              </div>
            </div>
            <div className="lg:w-1/2 space-y-12">
              <div className="space-y-4">
                <span className="text-cyan-600 font-black uppercase tracking-[0.2em] text-sm">Tiện ích đa dạng</span>
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight tracking-tighter">Môi trường sống & làm việc <br /> <span className="text-cyan-500">lý tưởng</span></h2>
                <p className="text-slate-500 text-lg font-light leading-relaxed">
                  Khu đô thị dịch vụ Xuân Cẩm - Hương Lâm được quy hoạch đồng bộ, đảm bảo cung cấp đầy đủ hạ tầng xã hội cần thiết cho chuyên gia và người lao động.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-8">
                {[
                  { title: 'Y tế', desc: 'Medical services', icon: ShieldCheck },
                  { title: 'Giáo dục', desc: 'Education system', icon: Users },
                  { title: 'Thương mại', desc: 'Commerce center', icon: Globe },
                  { title: 'Thể thao', desc: 'Sport & Culture', icon: Zap },
                ].map((item) => (
                  <div key={item.title} className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-cyan-500">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUY TRÌNH ĐẦU TƯ Section */}
      <section id="quy-trinh" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <span className="text-cyan-600 font-black uppercase tracking-[0.2em] text-sm">Quy trình thực hiện</span>
            <h2 className="text-4xl md:text-6xl font-bold mt-4 tracking-tighter">10 Bước đầu tư KCN</h2>
          </div>
          <div className="relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-0.5 bg-slate-100 hidden lg:block" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-12">
              {[
                { step: '01', title: 'Ký kết Hợp đồng nguyên tắc', desc: 'Thỏa thuận thuê lại đất giữa nhà đầu tư và chủ đầu tư hạ tầng.' },
                { step: '02', title: 'Đăng ký doanh nghiệp', desc: 'Xin cấp Giấy chứng nhận đăng ký doanh nghiệp tại địa phương.' },
                { step: '03', title: 'Đăng ký đầu tư', desc: 'Thực hiện thủ tục xin cấp Giấy chứng nhận đăng ký đầu tư (IRC).' },
                { step: '04', title: 'Ký Hợp đồng thuê đất', desc: 'Ký kết chính thức hợp đồng thuê lại đất sau khi có IRC.' },
                { step: '05', title: 'Cấp GCN Quyền sử dụng đất', desc: 'Hoàn tất thủ tục pháp lý về quyền sử dụng đất cho nhà đầu tư.' },
                { step: '06', title: 'Thủ tục Môi trường', desc: 'Lập và xin phê duyệt Báo cáo đánh giá tác động môi trường (ĐTM).' },
                { step: '07', title: 'Phê duyệt Quy hoạch', desc: 'Lập và xin phê duyệt quy hoạch chi tiết/tổng mặt bằng dự án.' },
                { step: '08', title: 'Thẩm duyệt PCCC', desc: 'Lập và xin thẩm duyệt thiết kế phòng cháy chữa cháy.' },
                { step: '09', title: 'Phê duyệt Thiết kế', desc: 'Lập và xin phê duyệt thiết kế kỹ thuật, bản vẽ thi công.' },
                { step: '10', title: 'Cấp Giấy phép xây dựng', desc: 'Xin cấp phép và bắt đầu triển khai thi công nhà máy.' },
              ].map((item, index) => (
                <div key={item.step} className={`flex items-center gap-8 ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                  <div className="w-16 h-16 rounded-full bg-cyan-500 text-white flex items-center justify-center font-black text-xl shrink-0 shadow-lg shadow-cyan-500/30 z-10">
                    {item.step}
                  </div>
                  <div className={`p-8 bg-slate-50 rounded-[32px] border border-slate-100 flex-grow hover:bg-white hover:shadow-xl transition-all ${index % 2 !== 0 ? 'lg:text-right' : ''}`}>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HỖ TRỢ Section */}
      <section id="ho-tro" className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="lg:w-1/3 space-y-6">
              <span className="text-cyan-400 font-black uppercase tracking-[0.2em] text-sm">Đồng hành cùng nhà đầu tư</span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter leading-tight">Hỗ trợ toàn diện từ Chủ đầu tư</h2>
              <p className="text-slate-400 font-light leading-relaxed">
                Chúng tôi cam kết hỗ trợ tối đa cho các nhà đầu tư từ khâu chuẩn bị đến khi đi vào hoạt động sản xuất kinh doanh ổn định.
              </p>
            </div>
            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { title: 'Thủ tục đầu tư', items: ['Chứng nhận đầu tư nhanh nhất', 'Hỗ trợ con dấu, mã số thuế'], icon: ShieldCheck },
                { title: 'Thành lập công ty', items: ['Tư vấn tuyển dụng lao động', 'Hỗ trợ nguồn nhân lực'], icon: Users },
                { title: 'Tài chính ngân hàng', items: ['Hỗ trợ vay vốn lưu động', 'Vay vốn sản xuất & thuê đất'], icon: DollarSign },
                { title: 'Dịch vụ thương mại', items: ['Nhà ở công nhân & chuyên gia', 'Văn phòng cho thuê', 'Trung tâm giải trí'], icon: Globe },
              ].map((group) => (
                <div key={group.title} className="p-8 bg-white/5 rounded-[40px] border border-white/10 hover:bg-white/10 transition-all">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400 mb-6">
                    <group.icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold mb-4">{group.title}</h4>
                  <ul className="space-y-3">
                    {group.items.map(item => (
                      <li key={item} className="flex items-center gap-3 text-slate-400 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TIN TỨC Section */}
      <section id="tin-tuc" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-16">
            <div className="space-y-4">
              <span className="text-cyan-600 font-black uppercase tracking-[0.2em] text-sm">Tin tức & Sự kiện</span>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">Cập nhật mới nhất</h2>
            </div>
            <button className="hidden md:flex items-center gap-2 text-cyan-600 font-bold hover:gap-4 transition-all">
              Xem tất cả tin tức <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Khởi công xây dựng hạ tầng kỹ thuật Giai đoạn 1', date: '15/03/2024', image: 'https://picsum.photos/seed/news1/800/600', category: 'Sự kiện' },
              { title: 'D-PARK GROUP ký kết hợp tác chiến lược cùng Nippon Koei', date: '10/02/2024', image: 'https://picsum.photos/seed/news2/800/600', category: 'Hợp tác' },
              { title: 'Bắc Giang dẫn đầu cả nước về tốc độ tăng trưởng GRDP', date: '05/01/2024', image: 'https://picsum.photos/seed/news3/800/600', category: 'Thị trường' },
            ].map((news, index) => (
              <motion.div
                key={news.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative h-64 rounded-[32px] overflow-hidden mb-6">
                  <img src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-900">
                    {news.category}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">{news.date}</div>
                  <h4 className="text-xl font-bold text-slate-900 group-hover:text-cyan-600 transition-colors leading-tight">
                    {news.title}
                  </h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TUYỂN DỤNG Section */}
      <section id="tuyen-dung" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="bg-cyan-500 rounded-[60px] p-12 lg:p-20 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-white rounded-full translate-x-1/3 translate-y-1/3 blur-[100px]" />
            </div>
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2 space-y-8">
                <span className="text-white/80 font-black uppercase tracking-[0.2em] text-sm">Cơ hội nghề nghiệp</span>
                <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter leading-tight">Gia nhập đội ngũ <br /> kiến tạo tương lai</h2>
                <p className="text-white/80 text-lg font-light leading-relaxed">
                  Chúng tôi luôn tìm kiếm những cộng sự tài năng, nhiệt huyết để cùng xây dựng những giá trị bền vững cho cộng đồng và khách hàng.
                </p>
                <button className="bg-white text-cyan-600 px-10 py-4 rounded-2xl font-bold hover:bg-slate-900 hover:text-white transition-all shadow-xl shadow-cyan-900/10">
                  Xem các vị trí đang tuyển
                </button>
              </div>
              <div className="lg:w-1/2 grid grid-cols-1 gap-4 w-full">
                {[
                  { pos: 'Kỹ sư hạ tầng kỹ thuật', type: 'Toàn thời gian', loc: 'Bắc Giang' },
                  { pos: 'Chuyên viên kinh doanh BĐS KCN', type: 'Toàn thời gian', loc: 'Hà Nội / Bắc Giang' },
                  { pos: 'Chuyên viên pháp lý dự án', type: 'Toàn thời gian', loc: 'Bắc Giang' },
                ].map((job) => (
                  <div key={job.pos} className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl flex justify-between items-center group hover:bg-white transition-all cursor-pointer">
                    <div className="space-y-1">
                      <h4 className="text-white font-bold text-lg group-hover:text-slate-900 transition-colors">{job.pos}</h4>
                      <div className="text-white/60 text-xs group-hover:text-slate-400 transition-colors uppercase tracking-widest font-bold">{job.type} • {job.loc}</div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:bg-cyan-500 transition-all">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIÊN HỆ Section */}
      <section id="lien-he" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-slate-900 rounded-[60px] overflow-hidden relative">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500 rounded-full -translate-x-1/2 -translate-y-1/2 blur-[120px]" />
            </div>
            <div className="relative z-10 p-12 lg:p-24 flex flex-col lg:flex-row gap-20">
              <div className="lg:w-1/2 space-y-12">
                <div className="space-y-4">
                  <span className="text-cyan-400 font-black uppercase tracking-[0.2em] text-sm">Liên hệ ngay</span>
                  <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tighter">Sẵn sàng đồng hành <br /> cùng <span className="text-cyan-400">thành công</span> của bạn</h2>
                </div>
                <div className="space-y-8">
                  <div className="flex items-center gap-6 group">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-all">
                      <Phone className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="text-slate-400 text-sm font-bold uppercase tracking-widest">Hotline tư vấn</div>
                      <div className="text-2xl font-bold text-white">(+84) 989 151 510 (Mr. Thắng)</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 group">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-all">
                      <Mail className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="text-slate-400 text-sm font-bold uppercase tracking-widest">Email hỗ trợ</div>
                      <div className="text-2xl font-bold text-white">qlda@d-park.com.vn</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 group">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-all">
                      <MapPin className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="text-slate-400 text-sm font-bold uppercase tracking-widest">Địa chỉ trụ sở</div>
                      <div className="text-xl font-bold text-white">Số 34, ngõ 291, đường Lê Lợi, P. Hoàng Văn Thụ, TP. Bắc Giang</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 bg-white/5 backdrop-blur-xl rounded-[40px] p-10 border border-white/10">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Họ và tên</label>
                      <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-cyan-500 transition-colors" placeholder="Nguyễn Văn A" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Số điện thoại</label>
                      <input type="tel" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-cyan-500 transition-colors" placeholder="090 123 4567" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Email</label>
                    <input type="email" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-cyan-500 transition-colors" placeholder="email@congty.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Nội dung tư vấn</label>
                    <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-cyan-500 transition-colors" placeholder="Tôi quan tâm đến mặt bằng sản xuất..." />
                  </div>
                  <button className="w-full bg-cyan-500 text-white py-5 rounded-2xl font-bold text-lg hover:bg-cyan-400 transition-all shadow-xl shadow-cyan-500/20">
                    Gửi yêu cầu tư vấn
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-300 py-16">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-6">
            <Link to="/" className="flex items-center">
              <img 
                src="/image/logo demo.png" 
                alt="D-Park Group Logo" 
                className="h-20 md:h-24 w-auto object-contain transition-transform hover:scale-105" 
              />
            </Link>
            <p className="text-sm leading-relaxed">
              Xây dựng hạ tầng kỹ thuật đồng bộ, hiện đại, thu hút đầu tư công nghệ cao tại Bắc Giang. Tâm điểm kết nối – Kiến tạo thịnh vượng.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Liên kết nhanh</h4>
            <ul className="space-y-4 text-sm">
              {navItems.map(item => (
                <li key={item.id}>
                  <button onClick={() => scrollToSection(item.id)} className="hover:text-cyan-500 transition-colors uppercase text-left">{item.name}</button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Lĩnh vực</h4>
            <ul className="space-y-4 text-sm">
              <li>Phát triển Khu công nghiệp</li>
              <li>Phát triển Khu đô thị</li>
              <li>Sản xuất kinh doanh</li>
              <li>Xây dựng hạ tầng</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Thông tin liên hệ</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin className="w-5 h-5 text-cyan-500 shrink-0" />
                <span>Số 34, ngõ 291, đường Lê Lợi, P. Hoàng Văn Thụ, TP. Bắc Giang</span>
              </li>
              <li className="flex gap-3">
                <Phone className="w-5 h-5 text-cyan-500 shrink-0" />
                <span>(+84) 989 151 510 (Mr. Thắng)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-500 font-bold">Email:</span>
                <span>qlda@d-park.com.vn</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-16 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} D-PARK GROUP. All rights reserved.
        </div>
      </footer>

      {/* Floating Info Button & Scroll to Top */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4 items-end">
        <AnimatePresence>
          {isScrolled && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              onClick={scrollToTop}
              className="w-12 h-12 bg-slate-900 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-cyan-500 transition-colors"
            >
              <ChevronUp className="w-6 h-6" />
            </motion.button>
          )}
        </AnimatePresence>

        <div className="relative group">
          <div className="absolute bottom-full right-0 mb-4 w-72 bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-500" />
              Thông tin nhanh
            </h4>
            <div className="space-y-4 text-sm">
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="font-bold text-slate-700 mb-1">Vị trí chiến lược</div>
                <p className="text-slate-500">Cách Nội Bài 20km, Hà Nội 50km.</p>
              </div>
              <div className="p-3 bg-cyan-50 rounded-xl">
                <div className="font-bold text-cyan-700 mb-1">Ưu đãi thuế</div>
                <p className="text-cyan-600">Miễn 2 năm, giảm 50% trong 4 năm. Ưu đãi 10% trong 15 năm cho CNC.</p>
              </div>
            </div>
          </div>
          <button className="w-14 h-14 bg-cyan-500 text-white rounded-full shadow-lg shadow-cyan-500/40 flex items-center justify-center hover:scale-110 transition-transform">
            <Zap className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
