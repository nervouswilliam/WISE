import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Wisely';
const SITE_URL = 'https://www.wisely.id';
const DEFAULT_IMAGE = `${SITE_URL}/logo.jpeg`;

// Per-page title/description/canonical - index.html's static tags are only the
// fallback seen before this mounts (first paint, or a crawler that doesn't run JS).
// path is route-relative, e.g. "/signup". noIndex is for pages that technically render
// at a public URL but shouldn't be indexed (auth-gated app pages, error pages).
function SEO({ title, description, path = '', noIndex = false }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - Smart Inventory Management`;
  const url = `${SITE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={DEFAULT_IMAGE} />
      <meta property="og:type" content="website" />

      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={DEFAULT_IMAGE} />
    </Helmet>
  );
}

export default SEO;
