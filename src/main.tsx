import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { LanguageProvider } from './contexts/LanguageContext.tsx';
import './index.css';

// Static SEO tags exist for crawlers that don't run JS; drop them so Helmet's per-route tags aren't duplicated.
document.head
  .querySelectorAll('link[rel="canonical"], meta[name="description"], meta[property^="og:"], meta[property^="article:"], meta[name^="twitter:"], script[type="application/ld+json"]')
  .forEach((element) => { if (!element.hasAttribute('data-rh')) element.remove(); });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
);
