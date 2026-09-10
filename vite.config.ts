import { readFileSync, writeFileSync } from 'node:fs';
import { defineConfig, type Plugin } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';

type Seo = { title: string; description: string; keywords: string };

/**
 * Static per-region metadata.
 *
 * The app is a single bundle served at both `/` and `/ind`, and RegionContext
 * only rewrites the title and meta tags after JS runs. Crawlers and link
 * previews (LinkedIn, WhatsApp, Slack) read the HTML as served, so `/ind` used
 * to advertise the Dubai copy. This stamps each region's metadata into its own
 * static HTML at build time: `/` keeps index.html, `/ind` gets ind.html, both
 * referencing the same hashed assets. Strings come from src/data/seo.json,
 * which regionContent.ts also imports, so the two can never disagree.
 */
const regionHtml = (): Plugin => {
  const seo = JSON.parse(readFileSync('src/data/seo.json', 'utf8')) as Record<string, Seo>;
  const stamp = (html: string, s: Seo) =>
    html
      .replace(/<title>[\s\S]*?<\/title>/, `<title>${s.title}</title>`)
      .replace(/(<meta name="description" content=")[\s\S]*?(")/, `$1${s.description}$2`)
      .replace(/(<meta name="keywords" content=")[\s\S]*?(")/, `$1${s.keywords}$2`);

  return {
    name: 'region-html',
    transformIndexHtml: (html) => stamp(html, seo.dubai),
    closeBundle() {
      const built = readFileSync('dist/index.html', 'utf8');
      writeFileSync('dist/ind.html', stamp(built, seo.india));
    }
  };
};

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    regionHtml()
  ]
});
