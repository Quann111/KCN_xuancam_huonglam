import { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { ORGANIZATION_LOGO, ORGANIZATION_NAME, SITE_NAME, SITE_URL } from '../lib/site-seo';

interface SeoHeadProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: 'website' | 'article';
  children?: ReactNode;
}

export default function SeoHead({ title, description, path, image = `${SITE_URL}/image/AIComplex_1776166732689.avif`, type = 'website', children }: SeoHeadProps) {
  const url = `${SITE_URL}${path}`;
  return <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={url} />
    <meta property="og:type" content={type} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={url} />
    <meta property="og:site_name" content={SITE_NAME} />
    <meta property="og:image" content={image} />
    <meta property="og:image:alt" content={title} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={image} />
    <script type="application/ld+json">{JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      description,
      url,
      primaryImageOfPage: image,
      publisher: { '@type': 'Organization', name: ORGANIZATION_NAME, url: SITE_URL, logo: ORGANIZATION_LOGO },
    })}</script>
    {children}
  </Helmet>;
}
