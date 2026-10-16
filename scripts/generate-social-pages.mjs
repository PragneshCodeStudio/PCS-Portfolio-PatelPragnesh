import { readFile, writeFile } from "node:fs/promises";

const outputDirectory = new URL("../dist/", import.meta.url);
const sourceHtml = await readFile(new URL("index.html", outputDirectory), "utf8");
const siteUrl = "https://www.patelpragnesh.com";

const websiteNode = {
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: `${siteUrl}/`,
  name: "Patel Pragnesh",
  description: "Portfolio of Patel Pragnesh, Web Designer and Frontend Developer.",
  inLanguage: "en",
};

const personNode = {
  "@type": "Person",
  "@id": `${siteUrl}/#person`,
  name: "Patel Pragnesh",
  url: `${siteUrl}/`,
  jobTitle: "Web Designer and Frontend Developer",
  description:
    "Web designer and frontend developer specializing in responsive websites, React, WordPress, WooCommerce, and interactive experiences.",
  sameAs: [
    "https://www.linkedin.com/in/pragneshpatel0707",
    "https://codepen.io/PRAGNESH-CODE-STUDIO/",
    "https://github.com/PragneshCodeStudio",
  ],
  knowsAbout: [
    "Web Design",
    "Frontend Development",
    "React",
    "WordPress",
    "WooCommerce",
    "GSAP",
    "Responsive Web Design",
  ],
};

const pages = [
  {
    slug: "about",
    title: "About Patel Pragnesh | Web Designer & Frontend Developer",
    description:
      "Learn about Patel Pragnesh, a web designer and frontend developer experienced in responsive websites, React, WordPress, WooCommerce, and GSAP.",
    pageType: "ProfilePage",
    pageName: "About Patel Pragnesh",
    relation: "mainEntity",
  },
  {
    slug: "projects",
    title: "Web Design & Frontend Projects | Patel Pragnesh",
    description:
      "Explore web design and frontend projects by Patel Pragnesh, including responsive React, WordPress, WooCommerce, and interactive website work.",
    pageType: "CollectionPage",
    pageName: "Web Design and Frontend Projects by Patel Pragnesh",
    relation: "creator",
  },
  {
    slug: "contact",
    title: "Contact Patel Pragnesh | Web Designer & Frontend Developer",
    description:
      "Contact Patel Pragnesh for frontend development, web design, React, WordPress, freelance projects, collaborations, and full-time opportunities.",
    pageType: "ContactPage",
    pageName: "Contact Patel Pragnesh",
    relation: "mainEntity",
  },
];

const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const replaceRequired = (html, pattern, replacement, label) => {
  if (!pattern.test(html)) {
    throw new Error(`Unable to generate SEO page: missing ${label}.`);
  }

  return html.replace(pattern, replacement);
};

const buildStructuredData = (page) => {
  const pageUrl = `${siteUrl}/${page.slug}`;
  const pageNode = {
    "@type": page.pageType,
    "@id": `${pageUrl}#page`,
    url: pageUrl,
    name: page.pageName,
    description: page.description,
    inLanguage: "en",
    isPartOf: { "@id": `${siteUrl}/#website` },
    [page.relation]: { "@id": `${siteUrl}/#person` },
  };
  const data = {
    "@context": "https://schema.org",
    "@graph": [websiteNode, personNode, pageNode],
  };
  const json = JSON.stringify(data, null, 2).replaceAll("<", "\\u003c");

  return `  <script id="seo-structured-data" type="application/ld+json">\n${json}\n  </script>`;
};

for (const page of pages) {
  const pageUrl = `${siteUrl}/${page.slug}`;
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description);
  let html = sourceHtml;

  html = replaceRequired(html, /<title>[\s\S]*?<\/title>/, `<title>${title}</title>`, "title");
  html = replaceRequired(
    html,
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${description}" />`,
    "meta description",
  );
  html = replaceRequired(
    html,
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${pageUrl}" />`,
    "canonical URL",
  );
  html = replaceRequired(
    html,
    /<meta property="og:title" content="[^"]*" \/>/,
    `<meta property="og:title" content="${title}" />`,
    "Open Graph title",
  );
  html = replaceRequired(
    html,
    /<meta property="og:description" content="[^"]*" \/>/,
    `<meta property="og:description" content="${description}" />`,
    "Open Graph description",
  );
  html = replaceRequired(
    html,
    /<meta property="og:url" content="[^"]*" \/>/,
    `<meta property="og:url" content="${pageUrl}" />`,
    "Open Graph URL",
  );
  html = replaceRequired(
    html,
    /<meta name="twitter:title" content="[^"]*" \/>/,
    `<meta name="twitter:title" content="${title}" />`,
    "Twitter title",
  );
  html = replaceRequired(
    html,
    /<meta name="twitter:description" content="[^"]*" \/>/,
    `<meta name="twitter:description" content="${description}" />`,
    "Twitter description",
  );
  html = replaceRequired(
    html,
    /  <script id="seo-structured-data" type="application\/ld\+json">[\s\S]*?<\/script>/,
    buildStructuredData(page),
    "structured data",
  );

  await writeFile(new URL(`${page.slug}.html`, outputDirectory), html);
}
let notFoundHtml = sourceHtml;
notFoundHtml = replaceRequired(
  notFoundHtml,
  /<title>[\s\S]*?<\/title>/,
  "<title>Page Not Found | Patel Pragnesh</title>",
  "404 title",
);
notFoundHtml = replaceRequired(
  notFoundHtml,
  /<meta name="description" content="[^"]*" \/>/,
  '<meta name="description" content="The requested page could not be found on the Patel Pragnesh portfolio." />',
  "404 description",
);
notFoundHtml = replaceRequired(
  notFoundHtml,
  /<meta name="robots" content="[^"]*" \/>/,
  '<meta name="robots" content="noindex, follow" />',
  "404 robots directive",
);
notFoundHtml = notFoundHtml
  .replace(/\s*<link rel="canonical" href="[^"]*" \/>/, "")
  .replace(/\s*<meta property="og:[^"]+"[^>]*\/>/g, "")
  .replace(/\s*<meta name="twitter:[^"]+"[^>]*\/>/g, "")
  .replace(/\s*<script id="seo-structured-data" type="application\/ld\+json">[\s\S]*?<\/script>/, "");

await writeFile(new URL("404.html", outputDirectory), notFoundHtml);