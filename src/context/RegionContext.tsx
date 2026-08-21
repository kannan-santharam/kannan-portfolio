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

// TESTING: /ind is not a published/shared link yet, so it's the safe place
// to exercise the real geolocation cookie set by middleware.ts, falling back
// to 'india' when that cookie is absent (e.g. local dev). The root path
// stays hardcoded to 'dubai' during this testing phase — swap the two once
// geolocation is verified and /ind is ready to be shared as a fixed link.
const isIndPath = (): boolean => window.location.pathname.replace(/\/+$/, '') === '/ind';

export const RegionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [region] = useState<Region>(() => {
    if (isIndPath()) {
      const cookie = getCookie('region');
      if (isRegion(cookie)) return cookie;
      return 'india';
    }

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
