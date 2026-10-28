import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, MapPin, Menu, Phone, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { languageOptions } from '../translations';

const flagSrc = (flag: string) => `${import.meta.env.BASE_URL}image/flags/${flag}.svg`;

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
];


export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('tin-tuc');
  const languageRef = useRef<HTMLDivElement>(null);
  const current = languageOptions.find((item) => item.code === language) ?? languageOptions[0];

  useEffect(() => {
    if (!languageOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!languageRef.current?.contains(e.target as Node)) setLanguageOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [languageOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (location.pathname !== '/') return;
    const ids = navItems.map((i) => i.id);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [location.pathname]);

  const goToSection = (id: string) => {
    setMenuOpen(false);
    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    navigate({ pathname: '/', hash: id });
  };

  return (
    <>
      <div className="hidden lg:block border-b border-slate-100 py-3 bg-white">
        <div className="container mx-auto px-4 flex justify-end items-center gap-8 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-red-600" /><span>{t.topBar.address}</span></div>
          <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-red-600" /><span>(+84) 989 151 510</span></div>
          <button onClick={() => goToSection('lien-he')} className="border border-cyan-500 text-cyan-600 px-5 py-1.5 rounded-full hover:bg-cyan-500 hover:text-white transition-colors uppercase tracking-wider">{t.nav.lienHe}</button>
        </div>
      </div>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className={`container mx-auto px-4 flex items-center justify-between gap-3 sm:gap-6 transition-all ${scrolled ? 'py-2' : 'py-4'}`}>
          <Link to="/" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-center min-w-0 shrink cursor-pointer"><img src={`${import.meta.env.BASE_URL}image/LOGO4.png`} alt="D-Park Group" className={`w-auto max-w-full object-contain transition-all ${scrolled ? 'h-7 sm:h-8' : 'h-8 sm:h-10'}`} /></Link>
          <nav className="hidden xl:flex items-center gap-4 2xl:gap-5">
            {navItems.filter((item) => item.id !== 'tin-tuc').map((item) => <button key={item.id} onClick={() => goToSection(item.id)} className={`text-[11px] 2xl:text-xs font-bold tracking-wide whitespace-nowrap ${activeSection === item.id ? 'text-cyan-600' : 'text-slate-600 hover:text-cyan-600'}`}>{t.nav[item.name as keyof typeof t.nav]}</button>)}
            <button onClick={() => goToSection('tin-tuc')} className={`text-[11px] 2xl:text-xs font-bold tracking-wide whitespace-nowrap ${activeSection === 'tin-tuc' ? 'text-cyan-600' : 'text-slate-600 hover:text-cyan-600'}`}>{t.nav.tinTuc}</button>
            <button onClick={() => goToSection('lien-he')} className="bg-cyan-500 text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-cyan-600">{t.nav.lienHe}</button>
            <div ref={languageRef} className="relative">
              <button onClick={() => setLanguageOpen((open) => !open)} aria-label="Language" className="flex items-center gap-1.5 px-2.5 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:border-cyan-500"><img src={flagSrc(current.flag)} alt="" className="w-5 h-3.5 object-cover rounded-sm shadow-sm" /><span>{current.label}</span><ChevronDown className={`w-3.5 h-3.5 transition-transform ${languageOpen ? 'rotate-180' : ''}`} /></button>
              {languageOpen && <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-slate-100 shadow-xl rounded-lg overflow-hidden py-1">{languageOptions.map((item) => <button key={item.code} onClick={() => { setLanguage(item.code); setLanguageOpen(false); }} className={`flex items-center gap-3 w-full text-left px-3 py-2 text-sm font-semibold hover:bg-cyan-50 ${language === item.code ? 'bg-cyan-50 text-cyan-700' : 'text-slate-700'}`}><img src={flagSrc(item.flag)} alt="" className="w-6 h-4 object-cover rounded-sm shadow-sm" /><span>{item.name}</span></button>)}</div>}
            </div>
          </nav>
          <div className="xl:hidden flex shrink-0 items-center gap-1 sm:gap-2"><button onClick={() => setMenuOpen(true)} aria-label="Language" className="flex items-center gap-1.5 px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600"><img src={flagSrc(current.flag)} alt="" className="w-5 h-3.5 object-cover rounded-sm shadow-sm" /><span>{current.label}</span></button><button aria-label="Menu" onClick={() => setMenuOpen((open) => !open)} className="p-2 text-slate-700">{menuOpen ? <X /> : <Menu />}</button></div>
        </div>
        {menuOpen && <nav className="xl:hidden border-t border-slate-100 bg-white px-4 py-3 flex flex-col max-h-[calc(100vh-72px)] overflow-y-auto"><div className="grid grid-cols-5 gap-2 pb-3 border-b border-slate-100">{languageOptions.map((item) => <button key={item.code} onClick={() => { setLanguage(item.code); setMenuOpen(false); }} aria-label={item.name} className={`flex flex-col items-center gap-1 py-2 rounded-lg border text-[11px] font-bold ${language === item.code ? 'border-cyan-500 bg-cyan-50 text-cyan-700' : 'border-slate-200 text-slate-600'}`}><img src={flagSrc(item.flag)} alt="" className="w-7 h-5 object-cover rounded-sm shadow-sm" /><span>{item.label}</span></button>)}</div>{navItems.filter((item) => item.id !== 'tin-tuc').map((item) => <button key={item.id} onClick={() => goToSection(item.id)} className={`py-3 text-left text-sm font-semibold border-b border-slate-100 flex justify-between ${activeSection === item.id ? 'text-cyan-600' : 'text-slate-700'}`}>{t.nav[item.name as keyof typeof t.nav]}<ChevronRight className="w-4 h-4" /></button>)}<button onClick={() => goToSection('tin-tuc')} className={`py-3 text-left text-sm font-bold border-b border-slate-100 ${activeSection === 'tin-tuc' ? 'text-cyan-600' : 'text-slate-700'}`}>{t.nav.tinTuc}</button><button onClick={() => goToSection('lien-he')} className="mt-3 bg-cyan-500 text-white py-3 rounded-lg text-sm font-bold">{t.nav.lienHe}</button></nav>}
      </header>
    </>
  );
}
