import React from 'react';

interface SeoMetaProps {
  title?: string;
  description?: string;
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
}

export const SeoMeta: React.FC<SeoMetaProps> = ({
  title = 'Music-Band - Live Music Reimagined',
  description = 'Pridruži se ekskluzivni skupnosti glasbenih navdušencev. Prvi izvedi za koncerte, backstage vsebino in limitirane vstopnice.',
  ogImage = '/og-image.jpg',
  ogType = 'website',
  canonicalUrl = 'https://music-band.vercel.app'
}) => {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </>
  );
};
