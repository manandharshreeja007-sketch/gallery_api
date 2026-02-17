// ============================================
// JSON-LD Structured Data Components
// ============================================

import React from "react";
import { SEO_DEFAULTS } from "@/lib/constants";

interface JsonLdProps {
  data: Record<string, unknown>;
}

function JsonLdScript({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Waifu Gallery",
    url: SEO_DEFAULTS.url,
    description: SEO_DEFAULTS.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SEO_DEFAULTS.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return <JsonLdScript data={data} />;
}

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Waifu Gallery",
    url: SEO_DEFAULTS.url,
    logo: `${SEO_DEFAULTS.url}/icons/iconTrasparent.png`,
    description: SEO_DEFAULTS.description,
    sameAs: [],
  };

  return <JsonLdScript data={data} />;
}

interface ImageGalleryJsonLdProps {
  categoryName: string;
  categoryDescription: string;
  categoryUrl: string;
}

export function ImageGalleryJsonLd({
  categoryName,
  categoryDescription,
  categoryUrl,
}: ImageGalleryJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: `${categoryName} Anime Images - Waifu Gallery`,
    description: categoryDescription,
    url: categoryUrl,
    provider: {
      "@type": "Organization",
      name: "Waifu Gallery",
      url: SEO_DEFAULTS.url,
    },
  };

  return <JsonLdScript data={data} />;
}

interface BreadcrumbJsonLdProps {
  items: Array<{ name: string; url: string }>;
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLdScript data={data} />;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQJsonLdProps {
  faqs: FAQItem[];
}

export function FAQJsonLd({ faqs }: FAQJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return <JsonLdScript data={data} />;
}
