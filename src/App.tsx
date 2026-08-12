import { HelmetProvider } from 'react-helmet-async';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProjectPhase from './pages/ProjectPhase';
import AboutDpark from './pages/AboutDpark';

const NewsList = lazy(() => import('./pages/NewsList'));
const NewsDetail = lazy(() => import('./pages/NewsDetail'));
const AdminNews = lazy(() => import('./pages/AdminNews'));
const AdminNewsPreview = lazy(() => import('./pages/AdminNewsPreview'));
const LoadingPage = () => <main className="min-h-screen bg-white" aria-busy="true" />;

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Suspense fallback={<LoadingPage />}><Routes>
          <Route path="/" element={<Home />} />
          <Route path="/giai-doan-1" element={<ProjectPhase />} />
          <Route path="/giai-doan-2" element={<ProjectPhase />} />
          <Route path="/gioi-thieu-d-park-group" element={<AboutDpark />} />
          <Route path="/tin-tuc" element={<NewsList />} />
          <Route path="/tin-tuc/:slug" element={<NewsDetail />} />
          <Route path="/admin/tin-tuc" element={<AdminNews />} />
          <Route path="/admin/preview/:slug" element={<AdminNewsPreview />} />
        </Routes></Suspense>
      </BrowserRouter>
    </HelmetProvider>
  );
}
