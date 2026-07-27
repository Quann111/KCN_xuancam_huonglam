import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, MapPin, Menu, Phone, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../translations';

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

const languages = [
  { code: 'vi' as Language, label: 'VI' },
  { code: 'en' as Language, label: 'EN' },
  { code: 'ja' as Language, label: 'JA' },
  { code: 'zh' as Language, label: 'ZH' },
];

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('tin-tuc');

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
        <div className={`container mx-auto px-4 flex items-center justify-between gap-6 transition-all ${scrolled ? 'py-2' : 'py-4'}`}>
          <Link to="/" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-center shrink-0 cursor-pointer"><img src={`${import.meta.env.BASE_URL}image/LOGO4.png`} alt="D-Park Group" className={`w-auto object-contain transition-all ${scrolled ? 'h-8' : 'h-10'}`} /></Link>
          <nav className="hidden xl:flex items-center gap-4 2xl:gap-5">
            {navItems.filter((item) => item.id !== 'tin-tuc').map((item) => <button key={item.id} onClick={() => goToSection(item.id)} className={`text-[11px] 2xl:text-xs font-bold tracking-wide whitespace-nowrap ${activeSection === item.id ? 'text-cyan-600' : 'text-slate-600 hover:text-cyan-600'}`}>{t.nav[item.name as keyof typeof t.nav]}</button>)}
            <button onClick={() => goToSection('tin-tuc')} className={`text-[11px] 2xl:text-xs font-bold tracking-wide whitespace-nowrap ${activeSection === 'tin-tuc' ? 'text-cyan-600' : 'text-slate-600 hover:text-cyan-600'}`}>{t.nav.tinTuc}</button>
            <button onClick={() => goToSection('lien-he')} className="bg-cyan-500 text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-cyan-600">{t.nav.lienHe}</button>
            <div className="relative">
              <button onClick={() => setLanguageOpen((open) => !open)} className="flex items-center gap-1.5 px-2.5 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600"><span>{language.toUpperCase()}</span><ChevronDown className="w-3.5 h-3.5" /></button>
              {languageOpen && <div className="absolute right-0 top-full mt-2 w-24 bg-white border border-slate-100 shadow-xl rounded-lg overflow-hidden">{languages.map((item) => <button key={item.code} onClick={() => { setLanguage(item.code); setLanguageOpen(false); }} className="block w-full text-left px-3 py-2 text-xs font-semibold hover:bg-cyan-50">{item.label}</button>)}</div>}
            </div>
          </nav>
          <button aria-label="Mở menu" onClick={() => setMenuOpen((open) => !open)} className="xl:hidden p-2 text-slate-700">{menuOpen ? <X /> : <Menu />}</button>
        </div>
        {menuOpen && <nav className="xl:hidden border-t border-slate-100 bg-white px-4 py-3 flex flex-col">{navItems.filter((item) => item.id !== 'tin-tuc').map((item) => <button key={item.id} onClick={() => goToSection(item.id)} className={`py-3 text-left text-sm font-semibold border-b border-slate-100 flex justify-between ${activeSection === item.id ? 'text-cyan-600' : 'text-slate-700'}`}>{t.nav[item.name as keyof typeof t.nav]}<ChevronRight className="w-4 h-4" /></button>)}<button onClick={() => goToSection('tin-tuc')} className={`py-3 text-left text-sm font-bold border-b border-slate-100 ${activeSection === 'tin-tuc' ? 'text-cyan-600' : 'text-slate-700'}`}>{t.nav.tinTuc}</button><button onClick={() => goToSection('lien-he')} className="mt-3 bg-cyan-500 text-white py-3 rounded-lg text-sm font-bold">{t.nav.lienHe}</button></nav>}
      </header>
    </>
  );
}
