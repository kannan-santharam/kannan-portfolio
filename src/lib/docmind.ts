import type { Region } from '../data/regionContent';

// Production DocMind unless a local build points elsewhere. Set
// VITE_DOCMIND_URL in .env.local (gitignored) to try a local DocMind.
const DOCMIND_URL: string = import.meta.env.VITE_DOCMIND_URL || 'https://docmind-rag-llm.vercel.app';

/** Origin postMessage traffic is checked against, in both directions. */
export const DOCMIND_ORIGIN = new URL(DOCMIND_URL).origin;

// DocMind picks its edition from geo-IP unless the parent tells it otherwise.
// Forward the region THIS page resolved (route, cookie, default) so the two
// never disagree. DocMind accepts `in` and `dubai` here.
const DOCMIND_REGION_PARAM: Record<Region, 'in' | 'dubai'> = {
  india: 'in',
  dubai: 'dubai'
};

export const buildDocMindUrl = (region: Region): string => {
  const url = new URL(DOCMIND_URL);
  url.searchParams.set('region', DOCMIND_REGION_PARAM[region]);
  url.searchParams.set('theme', 'dark');   // match this site, which is dark only
  return url.toString();
};
