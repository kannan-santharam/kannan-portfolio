import React, { createContext, useContext, useEffect, useState } from 'react';
import { REGION_CONTENT, type Region, type RegionProfile } from '../data/regionContent';

interface RegionContextType {
  region: Region;
  content: RegionProfile;
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

const getCookie = (name: string): string | undefined => {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  if (!match) return undefined;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return undefined;
  }
};

const isRegion = (value: string | undefined): value is Region => value === 'dubai' || value === 'india';

// Explicit region links, shared directly with recruiters: /ind is always
// India and /uae is always Dubai, regardless of geolocation. The root path
// defaults to Dubai, switching to India only when the geolocation cookie set
// by middleware.ts says so.
const PATH_REGION: Record<string, Region> = { '/ind': 'india', '/uae': 'dubai' };

const getPathRegion = (): Region | undefined => {
  const path = window.location.pathname.replace(/\/+$/, '');
  return PATH_REGION[path];
};

export const RegionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [region] = useState<Region>(() => {
    const pathRegion = getPathRegion();
    if (pathRegion) return pathRegion;

    const cookie = getCookie('region');
    if (isRegion(cookie)) return cookie;

    return 'dubai';
  });

  useEffect(() => {
    const { seo } = REGION_CONTENT[region];
    document.title = seo.title;

    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute('content', seo.description);

    const keywords = document.querySelector('meta[name="keywords"]');
    if (keywords) keywords.setAttribute('content', seo.keywords);
  }, [region]);

  return (
    <RegionContext.Provider value={{ region, content: REGION_CONTENT[region] }}>
      {children}
    </RegionContext.Provider>
  );
};

export const useRegion = () => {
  const context = useContext(RegionContext);
  if (!context) {
    throw new Error('useRegion must be used within a RegionProvider');
  }
  return context;
};
