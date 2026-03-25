import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = 'Suraj Prakash — Full Stack Developer', 
  description = 'Portfolio of Suraj Prakash — Full Stack Developer specializing in MERN stack, React, Node.js, and modern web technologies. Building beautiful, responsive, and performant web applications.',
  keywords = 'Full Stack Developer, MERN Stack, React, Node.js, MongoDB, Express, Portfolio, Web Developer',
  image = '/og-image.png',
  url,
  type = 'website',
}) => {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://surajjha.dev';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullTitle = title.includes('Suraj') ? title : `${title} | Suraj Prakash`;

  return (
    <Helmet>
      {/* Primary */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Suraj Prakash" />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${image}`} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="Suraj Prakash Portfolio" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${image}`} />

      {/* Additional */}
      <meta name="robots" content="index, follow" />
      <meta name="theme-color" content="#6366f1" />
    </Helmet>
  );
};

export default SEO;
