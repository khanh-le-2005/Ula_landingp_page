import React, { createContext, useContext } from 'react';

export type SiteKey = 'tieng-trung' | 'tieng-duc';

interface LandingSiteContextType {
  siteKey: SiteKey;
  campaignTag?: string;
}

const LandingSiteContext = createContext<LandingSiteContextType | undefined>(undefined);

export const LandingSiteProvider: React.FC<{ 
  siteKey: SiteKey; 
  campaignTag?: string | null;
  children: React.ReactNode 
}> = ({ siteKey, campaignTag, children }) => {
  // Đảm bảo campaignTag luôn là string hoặc undefined (không để null)
  const finalTag = campaignTag || undefined;

  return (
    <LandingSiteContext.Provider value={{ siteKey, campaignTag: finalTag }}>
      {children}
    </LandingSiteContext.Provider>
  );
};

export const useSiteContext = () => {
  const context = useContext(LandingSiteContext);
  // Default to tieng-trung if not in a provider (legacy support)
  return context || { siteKey: 'tieng-trung' as SiteKey, campaignTag: undefined };
};
