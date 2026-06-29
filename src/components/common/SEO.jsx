import { Helmet } from "react-helmet-async";

const SITE_NAME = "Ultra Stones";
const SITE_URL = "https://www.ultrastones.com";

function absoluteUrl(url) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${SITE_URL}${url.startsWith("/") ? url : `/${url}`}`;
}

export default function SEO({
  title,
  description,
  canonical,
  image,
  robotsIndex = true,
  robotsFollow = true,
  ogType = "website",
  schema,
}) {
  const finalTitle =
    title || `Luxury Granite, Marble & Quartz Countertops - ${SITE_NAME}`;

  const finalDescription =
    description ||
    "Explore premium granite, marble, quartzite, quartz, porcelain and natural stone surfaces by Ultra Stones.";

  const finalCanonical = canonical ? absoluteUrl(canonical) : SITE_URL;
  const finalImage = image ? absoluteUrl(image) : "";

  const robots = `${robotsIndex ? "index" : "noindex"}, ${
    robotsFollow ? "follow" : "nofollow"
  }`;

  const schemaList = Array.isArray(schema) ? schema : schema ? [schema] : [];

  return (
    <Helmet prioritizeSeoTags>
      <title>{finalTitle}</title>

      <meta name="description" content={finalDescription} />
      <meta name="robots" content={robots} />

      <link rel="canonical" href={finalCanonical} />

      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:url" content={finalCanonical} />

      {finalImage && <meta property="og:image" content={finalImage} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />

      {finalImage && <meta name="twitter:image" content={finalImage} />}

      {schemaList.map((schemaItem, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schemaItem)}
        </script>
      ))}
    </Helmet>
  );
}