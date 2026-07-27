import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const links = [
  { label: 'Vị trí', id: 'vi-tri' },
  { label: 'Hạ tầng', id: 'ha-tang' },
  { label: 'Quy mô', id: 'quy-mo' },
  { label: 'Tin tức', id: 'tin-tuc' },
];

export default function Footer() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const goToSection = (id: string) => location.pathname === '/' ? document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) : navigate({ pathname: '/', hash: id });

  return <footer className="bg-slate-900 py-16 text-slate-300">
    <div className="container mx-auto grid grid-cols-1 gap-10 px-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="space-y-5"><Link to="/" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="cursor-pointer"><img src={`${import.meta.env.BASE_URL}image/LOGO4.png`} alt="D-Park Group" width="200" height="60" className="h-16 w-auto brightness-110" /></Link><p className="text-sm leading-relaxed">{t.vision.quote}</p></div>
      <div><h2 className="mb-5 font-bold text-white">{t.footer.quickLinks}</h2><div className="flex flex-col items-start gap-3 text-sm">{links.map((link) => <button key={link.id} onClick={() => goToSection(link.id)} className="text-left hover:text-cyan-400">{link.label}</button>)}<Link to="/tin-tuc" className="hover:text-cyan-400">Tin tức & Sự kiện</Link><Link to="/giai-doan-1" className="hover:text-cyan-400">Giai đoạn 1</Link><Link to="/giai-doan-2" className="hover:text-cyan-400">Giai đoạn 2</Link><Link to="/gioi-thieu-d-park-group" className="hover:text-cyan-400">Giới thiệu D-Park Group</Link></div></div>
      <div><h2 className="mb-5 font-bold text-white">{t.footer.fields}</h2><ul className="space-y-3 text-sm"><li>{t.footer.field1}</li><li>{t.footer.field2}</li><li>{t.footer.field3}</li><li>{t.footer.field4}</li></ul></div>
      <div><h2 className="mb-5 font-bold text-white">{t.footer.contactInfo}</h2><ul className="space-y-4 text-sm"><li className="flex gap-3"><MapPin className="size-5 shrink-0 text-cyan-500" />{t.topBar.address}</li><li className="flex gap-3"><Phone className="size-5 shrink-0 text-cyan-500" />(+84) 989 151 510</li><li className="flex gap-3"><Mail className="size-5 shrink-0 text-cyan-500" />contact@dpark.vn</li></ul></div>
    </div>
    <div className="container mx-auto mt-14 border-t border-slate-800 px-4 pt-7 text-center text-xs text-slate-500">{t.footer.copyright}</div>
  </footer>;
}
