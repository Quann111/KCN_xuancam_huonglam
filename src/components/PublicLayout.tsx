import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen flex flex-col overflow-x-clip bg-white text-slate-900"><Header /><main className="flex-1">{children}</main><Footer /></div>;
}
