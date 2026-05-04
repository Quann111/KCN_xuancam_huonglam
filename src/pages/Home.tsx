import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, Users, Zap, ShieldCheck, Map, Clock, DollarSign, 
  ChevronRight, Droplets, Waves, Globe, Plane, 
  Ship, CheckCircle2, Phone, Mail, MapPin, Menu, X, ChevronUp
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../translations';
import { AnimatedNumber } from '../hooks/useCountUp';

const sliderImages = [
  `${import.meta.env.BASE_URL}image/Toàn cảnh-12.avif`,
  `${import.meta.env.BASE_URL}image/Toàn cảnh-13.avif`,
];

const navItems = [
  { name: 'viTri', id: 'vi-tri' },
  { name: 'haTang', id: 'ha-tang' },
  { name: 'quyMo', id: 'quy-mo' },
  { name: 'chiPhi', id: 'chi-phi-uu-dai' },
  { name: 'tienIch', id: 'tien-ich' },
  { name: 'quyTrinh', id: 'quy-trinh' },
  { name: 'hoTro', id: 'ho-tro' },
  { name: 'tinTuc', id: 'tin-tuc' },
  { name: 'tuyenDung', id: 'tuyen-dung' },
  { name: 'lienHe', id: 'lien-he' },
];

export default function Home() {
  const { language, setLanguage, t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  const stats = [
    { label: t.stats.scale, value: 102.85, suffix: ' ha', icon: Map, color: 'bg-blue-500' },
    { label: t.stats.investment, value: 1467.5, suffix: ' tỷ VNĐ', icon: DollarSign, color: 'bg-pink-500' },
    { label: t.stats.deadline, value: 2075, suffix: '', icon: Clock, color: 'bg-slate-700' },
    { label: t.stats.labor, value: 4500, suffix: ' người', icon: Users, color: 'bg-orange-500' },
  ];

  const languages = [
    { 
      code: 'vi' as Language, 
      name: 'Tiếng Việt', 
      flagUrl: 'https://songmainghiatrungip.vn/wp-content/plugins/sitepress-multilingual-cms/res/flags/vi.svg',
      flagCode: 'vi',
      href: '#'
    },
    { 
      code: 'ja' as Language, 
      name: 'Tiếng Nhật', 
      flagUrl: 'https://songmainghiatrungip.vn/wp-content/plugins/sitepress-multilingual-cms/res/flags/ja.svg',
      flagCode: 'jp',
      href: '#'
    },
    { 
      code: 'zh' as Language, 
      name: 'Tiếng Trung', 
      flagUrl: 'https://songmainghiatrungip.vn/wp-content/plugins/sitepress-multilingual-cms/res/flags/zh-hant.svg',
      flagCode: 'cn',
      href: '#'
    },
    { code: 'en' as Language, name: 'Tiếng Anh', flagUrl: 'https://songmainghiatrungip.vn/wp-content/plugins/sitepress-multilingual-cms/res/flags/en.svg', flagCode: 'us', href: '#' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const sections = ['vi-tri', 'ha-tang', 'quy-mo', 'chi-phi-uu-dai', 'tien-ich', 'quy-trinh', 'ho-tro', 'tin-tuc', 'tuyen-dung', 'lien-he'];
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    window.addEventListener('scroll', handleScroll);
    
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.lang-dropdown-container')) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
      observer.disconnect();
    };
  }, []);

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
      setActiveSection(id);
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
            <span>{t.topBar.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-red-600" />
            <span>(+84) 989 151 510</span>
          </div>
          <button 
            onClick={() => scrollToSection('lien-he')}
            className="border border-cyan-500 text-cyan-500 px-6 py-1.5 rounded-full hover:bg-cyan-500 hover:text-white transition-colors uppercase tracking-wider"
          >
            {t.nav.lienHe}
          </button>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className={`container mx-auto px-4 py-${isScrolled ? '2' : '4'} flex justify-between items-center transition-all duration-300 gap-12`}>

          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <img 
              src={`${import.meta.env.BASE_URL}image/LOGO3.png`} 
              alt="D-Park Group Logo" 
              className={`h-${isScrolled ? '8 md:h-10 lg:h-12' : '10 md:h-12 lg:h-14'} w-auto object-contain transition-all duration-300 hover:scale-${isScrolled ? '102' : '105'}`} 
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex lg:flex-nowrap items-center gap-4 xl:gap-6 pt-4">
            {navItems.slice(0, -1).map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  scrollToSection(item.id);
                  setActiveSection(item.id);
                }}
                className={`text-[11px] xl:text-[13px] font-bold tracking-wider transition-colors uppercase whitespace-nowrap ${activeSection === item.id ? 'text-cyan-500' : 'text-slate-600 hover:text-cyan-500'}`}
              >
                {t.nav[item.name as keyof typeof t.nav]}
              </button>
            ))}
            <AnimatePresence>
              {isScrolled && (
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onClick={() => {
                    scrollToSection('lien-he');
                    setActiveSection('lien-he');
                  }}
                  className={`px-6 py-2 rounded-full text-[13px] font-bold transition-colors uppercase tracking-wider shadow-lg whitespace-nowrap ${activeSection === 'lien-he' ? 'bg-cyan-500 text-white' : 'bg-cyan-500 text-white hover:bg-cyan-600'}`}
                  style={activeSection === 'lien-he' ? { boxShadow: '0 10px 15px -3px rgb(34 211 238 / 0.3)' } : {}}
                >
                  LIÊN HỆ
                </motion.button>
              )}
            </AnimatePresence>

            {/* Language Dropdown */}
            <div className="relative lang-dropdown-container">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg hover:border-cyan-500 hover:bg-cyan-50 transition-all"
              >
                <img 
                  src={`https://songmainghiatrungip.vn/wp-content/plugins/sitepress-multilingual-cms/res/flags/${language === 'vi' ? 'vi' : language === 'ja' ? 'ja' : language === 'zh' ? 'zh-hant' : 'en'}.svg`}
                  alt={language}
                  className="w-5 h-4 object-cover rounded-sm"
                  onError={(e) => {
                    const flagMap: Record<string, string> = {
                      'vi': 'vi',
                      'ja': 'jp',
                      'zh': 'zh-hant',
                      'en': 'en'
                    };
                    const flag = flagMap[language] || 'en';
                    e.currentTarget.src = `https://flagcdn.com/w40/${flag}.png`;
                  }}
                />
                <span className="text-xs font-bold text-slate-600 uppercase">{language.toUpperCase()}</span>
                <ChevronUp className={`w-3 h-3 text-slate-400 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isLangOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-slate-100 py-2 min-w-[160px] z-50">
                  {languages.map((lang) => (
                    <a
                      key={lang.code}
                      href={lang.href}
                      className={`flex items-center gap-3 px-4 py-3 hover:bg-cyan-50 transition-colors ${language === lang.code ? 'bg-cyan-50' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setLanguage(lang.code);
                        setIsLangOpen(false);
                      }}
                    >
                      <img 
                        src={lang.flagUrl}
                        alt={lang.name}
                        className="w-5 h-4 object-cover rounded-sm"
                        onError={(e) => {
                          e.currentTarget.src = `https://flagcdn.com/w40/${lang.flagCode}.png`;
                        }}
                      />
                      <span className="text-sm font-medium text-slate-700">{lang.name}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
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
                    {t.nav[item.name as keyof typeof t.nav]}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ))}
                <button
                  onClick={() => scrollToSection('lien-he')}
                  className="mt-4 bg-cyan-500 text-white w-full py-4 rounded-2xl font-bold text-lg shadow-lg shadow-cyan-500/20 uppercase tracking-wider"
                >
                  {t.common.contact} {t.nav.lienHe}
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
              {t.hero.badge}
            </motion.span>
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-extrabold leading-tight mb-8 tracking-tight md:whitespace-nowrap">
              {t.hero.titlePart1} <span className="text-cyan-400">{t.hero.titlePart2}</span>
            </h1>
            <p className="text-base md:text-lg text-slate-200 mb-12 leading-relaxed font-light md:whitespace-nowrap">
              {t.hero.description}
            </p>
            <div className="flex flex-wrap gap-6">
              <button onClick={() => scrollToSection('quy-mo')} className="bg-white text-slate-900 px-10 py-5 rounded-2xl font-bold hover:bg-cyan-500 hover:text-white transition-all flex items-center gap-3 group text-lg shadow-xl shadow-black/20">
                {t.hero.cta}
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
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
                      <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                        <AnimatedNumber end={stat.value} suffix={stat.suffix} duration={2000} delay={index * 0.1} />
                      </h3>
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
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <span className="text-cyan-600 font-black uppercase tracking-[0.2em] text-sm">{t.vision.label}</span>
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight tracking-tighter">{t.vision.title1} <br /> <span className="text-cyan-500">{t.vision.title2}</span></h2>
              </div>
              <div className="p-8 bg-white rounded-[40px] shadow-xl border border-slate-100">
                <p className="text-lg text-slate-600 leading-relaxed italic">
                  "{t.vision.quote}"
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{t.vision.qualityTitle}</h4>
                    <p className="text-sm text-slate-500">{t.vision.qualityDesc}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 shrink-0">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{t.vision.techTitle}</h4>
                    <p className="text-sm text-slate-500">{t.vision.techDesc}</p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="rounded-[40px] overflow-hidden shadow-2xl">
                <img src={`${import.meta.env.BASE_URL}image/AIComplex_1776166732689.avif`} alt="Tầm nhìn dự án" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-cyan-500 rounded-3xl -z-10" />
            </motion.div>
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
                    src={`${import.meta.env.BASE_URL}image/AIComplex_1776167182236.avif`} 
                    alt="Vị trí dự án" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl" />
              </div>
            </div>
            <div className="lg:w-1/2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-cyan-600 font-black uppercase tracking-[0.2em] text-sm">{t.location.label}</span>
                <h2 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight tracking-tighter">
                  {t.location.title1} <br />vùng kinh tế <span className="text-cyan-500">{t.location.titleHighlight}</span>
                </h2>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-6 text-lg text-slate-600 font-light leading-relaxed"
              >
                <p>• {t.location.description1}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-cyan-600 font-bold"><AnimatedNumber end={50} suffix=" km" duration={1500} delay={0.2} /> km</div>
                    <div className="text-sm text-slate-500">{t.location.distanceToHanoi}</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-cyan-600 font-bold"><AnimatedNumber end={20} suffix=" km" duration={1500} delay={0.3} /></div>
                    <div className="text-sm text-slate-500">{t.location.distanceToBacNinh}</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-cyan-600 font-bold"><AnimatedNumber end={30} suffix=" km" duration={1500} delay={0.4} /></div>
                    <div className="text-sm text-slate-500">{t.location.distanceToBacGiang}</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-cyan-600 font-bold"><AnimatedNumber end={65} suffix=" km" duration={1500} delay={0.5} /></div>
                    <div className="text-sm text-slate-500">{t.location.distanceToThaiNguyen}</div>
                  </div>
                </div>
                <p>• {t.location.highwayDesc}</p>
                <p>• {t.location.samsungDesc}</p>
              </motion.div>
            </div>
          </div>

          {/* Giao thông cards merged here */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-slate-100">
            {[
              { title: t.location.air, value: 20, desc: t.location.airDesc, icon: Plane, color: 'text-blue-500' },
              { title: t.location.sea, value: 120, desc: t.location.seaDesc, icon: Ship, color: 'text-cyan-500' },
              { title: t.location.road, value: 4, desc: t.location.roadDesc, icon: Map, color: 'text-slate-900' },
            ].map((item, index) => (
              <motion.div 
                key={item.title} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                whileHover={{ y: -10 }}
                className="p-10 rounded-[40px] bg-slate-50 border border-slate-100 text-center shadow-xl shadow-slate-200/20"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <item.icon className={`w-8 h-8 ${item.color}`} />
                </div>
                <h4 className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-4">{item.title}</h4>
                <div className="text-5xl font-black mb-6 text-slate-900"><AnimatedNumber end={item.value} suffix=" km" duration={1500} delay={0.2 + index * 0.1} /></div>
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
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-cyan-600 font-black uppercase tracking-[0.2em] text-sm"
            >
              {t.infrastructure.label}
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold mt-4 tracking-tighter"
            >
              {t.infrastructure.title}
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: t.infrastructure.roads, desc: t.infrastructure.roadsDesc, icon: Map, color: 'bg-blue-500' },
              { title: t.infrastructure.power, desc: t.infrastructure.powerDesc, icon: Zap, color: 'bg-yellow-500' },
              { title: t.infrastructure.water, desc: t.infrastructure.waterDesc, icon: Droplets, color: 'bg-cyan-500' },
              { title: t.infrastructure.wastewater, desc: t.infrastructure.wastewaterDesc, icon: Waves, color: 'bg-green-500' },
              { title: t.infrastructure.fire, desc: t.infrastructure.fireDesc, icon: ShieldCheck, color: 'bg-red-500' },
              { title: t.infrastructure.telecom, desc: t.infrastructure.telecomDesc, icon: Globe, color: 'bg-indigo-500' },
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
                <p className="text-slate-500 leading-relaxed font-light mt-2">{item.desc}</p>
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
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2 space-y-12"
            >
              <div className="space-y-4">
                <span className="text-cyan-400 font-black uppercase tracking-[0.2em] text-sm">{t.scale.label}</span>
                <h2 className="text-4xl md:text-6xl font-bold leading-tight tracking-tighter">{t.scale.title1} <br /> cùng <span className="text-cyan-400">{t.scale.title2}</span></h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  { value: 102.85, label: t.scale.totalArea },
                  { value: 63.72, label: t.scale.industrialLand },
                  { value: 2.73, label: t.scale.serviceLand },
                  { value: 5.47, label: t.scale.techLand },
                ].map((item, index) => (
                  <motion.div 
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-8 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10"
                  >
                    <div className="text-4xl font-black text-cyan-400 mb-2"><AnimatedNumber end={item.value} suffix=" ha" duration={1500} decimals={2} delay={0.2 + index * 0.1} /></div>
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">{item.label}</div>
                  </motion.div>
                ))}
              </div>
              <div className="space-y-6">
                <h4 className="text-2xl font-bold flex items-center gap-3">
                  <CheckCircle2 className="text-cyan-400 w-6 h-6" />
                  {t.scale.encouragedTitle}
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-400 text-lg font-light">
                  {t.scale.industries.map((industry, i) => (
                    <motion.li 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.05 }}
                    >• {industry}</motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2"
            >
              <div className="rounded-[40px] overflow-hidden shadow-2xl border-4 border-white/10">
                <img 
                  src={`${import.meta.env.BASE_URL}image/AIComplex_1777918636053.avif`} 
                  alt="Quy hoạch KCN" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CHI PHÍ & ƯU ĐÃI Section */}
      <section id="chi-phi-uu-dai" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-cyan-600 font-black uppercase tracking-[0.2em] text-sm"
            >
              {t.cost.label}
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold mt-4 tracking-tighter"
            >
              {t.cost.title}
            </motion.h2>
          </div>
          
          {/* Cost Part */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto bg-slate-50 rounded-[40px] overflow-hidden border border-slate-100 shadow-xl mb-16"
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="p-12 border-b md:border-b-0 md:border-r border-slate-200"
              >
                <h4 className="text-xl font-bold text-slate-900 mb-8">{t.cost.minWage}</h4>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black text-cyan-600"><AnimatedNumber end={160} prefix="$" duration={1500} delay={0.3} /></span>
                  <span className="text-slate-400 font-bold">{t.cost.perMonth}</span>
                </div>
                <p className="mt-6 text-slate-500 leading-relaxed">Áp dụng cho Vùng 3 theo quy định của Chính phủ Việt Nam, giúp tối ưu chi phí nhân công cho doanh nghiệp.</p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="p-12"
              >
                <h4 className="text-xl font-bold text-slate-900 mb-8">{t.cost.totalInvestment}</h4>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-900"><AnimatedNumber end={1467.5} suffix=" tỷ VNĐ" duration={1500} decimals={1} delay={0.4} /></span>
                </div>
                <p className="mt-6 text-slate-500 leading-relaxed">{t.cost.investmentDesc}</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Incentives Part */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {[
              { 
                badge: t.cost.specialProject, 
                title: t.cost.specialTitle, 
                items: [t.cost.special1, t.cost.special2, t.cost.special3],
                badgeColor: 'bg-cyan-500',
                textColor: 'text-cyan-500'
              },
              { 
                badge: t.cost.normalProject, 
                title: t.cost.normalTitle, 
                items: [t.cost.normal1, t.cost.normal2, t.cost.normal3],
                badgeColor: 'bg-slate-700',
                textColor: 'text-slate-700'
              }
            ].map((card, cardIndex) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + cardIndex * 0.1 }}
                className="p-12 bg-white rounded-[40px] shadow-xl border border-slate-100 space-y-8"
              >
                <div className={`inline-block ${card.badgeColor} text-white px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest`}>{card.badge}</div>
                <h3 className="text-3xl font-bold text-slate-900">{card.title}</h3>
                <ul className="space-y-4 text-lg text-slate-600 font-light">
                  {card.items.map((item, itemIndex) => (
                    <motion.li 
                      key={itemIndex}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + itemIndex * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className={`w-6 h-6 ${card.textColor} shrink-0 mt-1`} />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Additional Incentives */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[t.cost.vat, t.cost.pIT, t.cost.procedure].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm"
              >
                <div className="text-cyan-500 font-bold text-xl mb-4">{item}</div>
                <p className="text-slate-500 text-sm">
                  {index === 0 ? t.cost.vatDesc : index === 1 ? t.cost.pITDesc : t.cost.procedureDesc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TIỆN ÍCH Section */}
      <section id="tien-ich" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2"
            >
              <div className="relative">
                <div className="rounded-[40px] overflow-hidden shadow-2xl">
                  <img src={`${import.meta.env.BASE_URL}image/AIComplex_1776166944793.avif`} alt="Tiện ích dự án" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-cyan-500 rounded-full blur-2xl opacity-20" />
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2 space-y-12"
            >
              <div className="space-y-4">
                <span className="text-cyan-600 font-black uppercase tracking-[0.2em] text-sm">{t.amenities.label}</span>
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight tracking-tighter">{t.amenities.title1} <br /> <span className="text-cyan-500">{t.amenities.title2}</span></h2>
                <p className="text-slate-500 text-lg font-light leading-relaxed">
                  {t.amenities.description}
                </p>
              </div>
              <div className="grid grid-cols-4 gap-8">
                {[
                  { title: t.amenities.medical, icon: ShieldCheck },
                  { title: t.amenities.education, icon: Users },
                  { title: t.amenities.commerce, icon: Globe },
                  { title: t.amenities.sports, icon: Zap },
                ].map((item, index) => (
                  <motion.div 
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-3 text-center"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-cyan-500 mx-auto">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-slate-900">{item.title}</h4>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* QUY TRÌNH ĐẦU TƯ Section */}
      <section id="quy-trinh" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-cyan-600 font-black uppercase tracking-[0.2em] text-sm"
            >
              {t.process.label}
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold mt-4 tracking-tighter"
            >
              {t.process.title}
            </motion.h2>
          </div>
          <div className="relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-0.5 bg-slate-100 hidden lg:block" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-12">
              {t.process.steps.map((item, index) => (
                <motion.div 
                  key={item.title} 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center gap-8 ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
                >
                  <div className="w-16 h-16 rounded-full bg-cyan-500 text-white flex items-center justify-center font-black text-xl shrink-0 shadow-lg shadow-cyan-500/30 z-10">
                    <AnimatedNumber end={index + 1} duration={800} delay={0.1 + index * 0.05} />
                  </div>
                  <div className={`p-8 bg-slate-50 rounded-[32px] border border-slate-100 flex-grow hover:bg-white hover:shadow-xl transition-all ${index % 2 !== 0 ? 'lg:text-right' : ''}`}>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HỖ TRỢ Section */}
      <section id="ho-tro" className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/3 space-y-6"
            >
              <span className="text-cyan-400 font-black uppercase tracking-[0.2em] text-sm">{t.support.label}</span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter leading-tight">{t.support.title}</h2>
              <p className="text-slate-400 font-light leading-relaxed">
                {t.support.description}
              </p>
            </motion.div>
            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { title: t.support.investmentTitle, items: t.support.investmentItems, icon: ShieldCheck },
                { title: t.support.companyTitle, items: t.support.companyItems, icon: Users },
                { title: t.support.financeTitle, items: t.support.financeItems, icon: DollarSign },
                { title: t.support.serviceTitle, items: t.support.serviceItems, icon: Globe },
              ].map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-8 bg-white/5 rounded-[40px] border border-white/10 hover:bg-white/10 transition-all"
                >
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400 mb-6">
                    <card.icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold mb-4">{card.title}</h4>
                  <ul className="space-y-3">
                    {card.items.map((item, i) => (
                      <motion.li 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + i * 0.05 }}
                        className="flex items-center gap-3 text-slate-400 text-sm"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TIN TỨC Section */}
      <section id="tin-tuc" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <span className="text-cyan-600 font-black uppercase tracking-[0.2em] text-sm">{t.news.label}</span>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">{t.news.title}</h2>
            </motion.div>
            <button className="hidden md:flex items-center gap-2 text-cyan-600 font-bold hover:gap-4 transition-all">
              {t.common.viewAll} <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Khởi công xây dựng hạ tầng kỹ thuật Giai đoạn 1', date: '15/03/2024', image: `${import.meta.env.BASE_URL}image/AIComplex_1776166944793.avif`, category: t.news.categories.event },
              { title: 'D-PARK GROUP ký kết hợp tác chiến lược cùng Nippon Koei', date: '10/02/2024', image: `${import.meta.env.BASE_URL}image/AIComplex_1777917995188.avif`, category: t.news.categories.cooperation },
              { title: 'Bắc Giang dẫn đầu cả nước về tốc độ tăng trưởng GRDP', date: '05/01/2024', image: `${import.meta.env.BASE_URL}image/AIComplex_1777917938644.avif`, category: t.news.categories.market },
            ].map((news, index) => (
              <motion.div
                key={news.title}
                initial={{ opacity: 0, y: 30 }}
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
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-cyan-500 rounded-[60px] p-12 lg:p-20 relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-20">
              <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-white rounded-full translate-x-1/3 translate-y-1/3 blur-[100px]" />
            </div>
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="lg:w-1/2 space-y-8"
              >
                <span className="text-white/80 font-black uppercase tracking-[0.2em] text-sm">{t.recruitment.label}</span>
                <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter leading-tight">{t.recruitment.title1} <br /> {t.recruitment.title2}</h2>
                <p className="text-white/80 text-lg font-light leading-relaxed">
                  {t.recruitment.description}
                </p>
                <button className="bg-white text-cyan-600 px-10 py-4 rounded-2xl font-bold hover:bg-slate-900 hover:text-white transition-all shadow-xl shadow-cyan-900/10">
                  {t.recruitment.cta}
                </button>
              </motion.div>
              <div className="lg:w-1/2 grid grid-cols-1 gap-4 w-full">
                {[
                  { pos: 'Kỹ sư hạ tầng kỹ thuật', loc: 'Bắc Giang' },
                  { pos: 'Chuyên viên kinh doanh BĐS KCN', loc: 'Hà Nội / Bắc Giang' },
                  { pos: 'Chuyên viên pháp lý dự án', loc: 'Bắc Giang' },
                ].map((job, index) => (
                  <motion.div 
                    key={job.pos}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl flex justify-between items-center group hover:bg-white transition-all cursor-pointer"
                  >
                    <div className="space-y-1">
                      <h4 className="text-white font-bold text-lg group-hover:text-slate-900 transition-colors">{job.pos}</h4>
                      <div className="text-white/60 text-xs group-hover:text-slate-400 transition-colors uppercase tracking-widest font-bold">{t.recruitment.fullTime} • {job.loc}</div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:bg-cyan-500 transition-all">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
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
                  <span className="text-cyan-400 font-black uppercase tracking-[0.2em] text-sm">{t.contact.label}</span>
                  <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tighter">{t.contact.title1} <br /> cùng <span className="text-cyan-400">{t.contact.title2}</span></h2>
                </div>
                <div className="space-y-8">
                  <div className="flex items-center gap-6 group">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-all">
                      <Phone className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="text-slate-400 text-sm font-bold uppercase tracking-widest">{t.contact.hotline}</div>
                      <div className="text-2xl font-bold text-white">(+84) 989 151 510 (Mr. Thắng)</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 group">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-all">
                      <Mail className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="text-slate-400 text-sm font-bold uppercase tracking-widest">{t.contact.email}</div>
                      <div className="text-2xl font-bold text-white">qlda@d-park.com.vn</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 group">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-all">
                      <MapPin className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="text-slate-400 text-sm font-bold uppercase tracking-widest">{t.contact.address}</div>
                      <div className="text-xl font-bold text-white">{t.topBar.address}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 bg-white/5 backdrop-blur-xl rounded-[40px] p-10 border border-white/10">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t.contact.formName}</label>
                      <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-cyan-500 transition-colors" placeholder={t.contact.formNamePlaceholder} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t.contact.formPhone}</label>
                      <input type="tel" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-cyan-500 transition-colors" placeholder={t.contact.formPhonePlaceholder} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t.contact.formEmail}</label>
                    <input type="email" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-cyan-500 transition-colors" placeholder={t.contact.formEmailPlaceholder} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t.contact.formContent}</label>
                    <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-cyan-500 transition-colors" placeholder={t.contact.formContentPlaceholder} />
                  </div>
                  <button className="w-full bg-cyan-500 text-white py-5 rounded-2xl font-bold text-lg hover:bg-cyan-400 transition-all shadow-xl shadow-cyan-500/20">
                    {t.contact.formSubmit}
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
                src={`${import.meta.env.BASE_URL}image/LOGO3.png`} 
                alt="D-Park Group Logo" 
                className="h-14 md:h-16 lg:h-20 w-auto object-contain transition-transform hover:scale-105 brightness-110" 
              />
            </Link>
            <p className="text-sm leading-relaxed">
              {t.vision.quote}
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">{t.footer.quickLinks}</h4>
            <ul className="space-y-4 text-sm">
              {navItems.slice(0, -1).map(item => (
                <li key={item.id}>
                  <button onClick={() => scrollToSection(item.id)} className="hover:text-cyan-500 transition-colors uppercase text-left">{t.nav[item.name as keyof typeof t.nav]}</button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">{t.footer.fields}</h4>
            <ul className="space-y-4 text-sm">
              <li>{t.footer.field1}</li>
              <li>{t.footer.field2}</li>
              <li>{t.footer.field3}</li>
              <li>{t.footer.field4}</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">{t.footer.contactInfo}</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin className="w-5 h-5 text-cyan-500 shrink-0" />
                <span>{t.topBar.address}</span>
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
          {t.footer.copyright}
        </div>
      </footer>

      {/* Floating Info Button & Scroll to Top */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8 z-50 flex flex-col sm:flex-row gap-3 sm:gap-4 items-end sm:items-center">
        <AnimatePresence>
          {isScrolled && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              onClick={scrollToTop}
              className="w-11 h-11 sm:w-12 sm:h-12 bg-slate-900 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-cyan-500 transition-colors"
            >
              <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.button>
          )}
        </AnimatePresence>

        <div className="relative group">
          <div className="absolute bottom-full right-0 mb-4 w-64 sm:w-72 bg-white rounded-3xl shadow-2xl border border-slate-100 p-5 sm:p-6 opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <h4 className="font-bold text-slate-900 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500" />
              {t.floatingInfo.title}
            </h4>
            <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
              <div className="p-2 sm:p-3 bg-slate-50 rounded-xl">
                <div className="font-bold text-slate-700 mb-1">{t.floatingInfo.strategicLocation}</div>
                <p className="text-slate-500">{t.floatingInfo.strategicLocationDesc}</p>
              </div>
              <div className="p-2 sm:p-3 bg-cyan-50 rounded-xl">
                <div className="font-bold text-cyan-700 mb-1">{t.floatingInfo.taxIncentives}</div>
                <p className="text-cyan-600">{t.floatingInfo.taxIncentivesDesc}</p>
              </div>
            </div>
          </div>
          <button className="w-12 h-12 sm:w-14 sm:h-14 bg-cyan-500 text-white rounded-full shadow-lg shadow-cyan-500/40 flex items-center justify-center hover:scale-110 transition-transform">
            <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
