import { readFile, writeFile } from "node:fs/promises";

const outputDirectory = new URL("../dist/", import.meta.url);
const html = await readFile(new URL("index.html", outputDirectory), "utf8");
const homeUrlTag = '<meta property="og:url" content="https://www.patelpragnesh.com/" />';

if (!html.includes(homeUrlTag)) {
  throw new Error("Home page Open Graph URL is missing from the built HTML.");
}

for (const page of ["about", "projects", "contact"]) {
  const pageUrlTag = '<meta property="og:url" content="https://www.patelpragnesh.com/' + page + '" />';
  const pageHtml = html.replace(homeUrlTag, pageUrlTag);
  await writeFile(new URL(page + ".html", outputDirectory), pageHtml);
}
