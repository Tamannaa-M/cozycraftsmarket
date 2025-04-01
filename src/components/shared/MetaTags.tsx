
import { Helmet } from "react-helmet-async";

interface MetaTagsProps {
  title: string;
  description: string;
  keywords?: string;
  imageUrl?: string;
  canonical?: string;
  type?: "website" | "article" | "product";
  schema?: object;
}

const MetaTags = ({
  title,
  description,
  keywords,
  imageUrl = "/logo.png",
  canonical,
  type = "website",
  schema
}: MetaTagsProps) => {
  // Create the full title with brand name
  const fullTitle = `${title} | CozyMarket`;
  
  // Get the current URL
  const url = canonical || typeof window !== "undefined" ? window.location.href : "";
  
  // Convert schema to string if provided
  const schemaString = schema ? JSON.stringify(schema) : "";

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Canonical Link */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="CozyMarket" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      
      {/* JSON-LD Schema */}
      {schema && (
        <script type="application/ld+json">{schemaString}</script>
      )}
    </Helmet>
  );
};

export default MetaTags;
