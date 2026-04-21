import React, { createContext, useContext } from 'react';

type SiteKey = 'tieng-trung' | 'tieng-duc';

interface LandingSiteContextType {
  siteKey: SiteKey;
}

const LandingSiteContext = createContext<LandingSiteContextType | undefined>(undefined);

export const LandingSiteProvider: React.FC<{ 
  siteKey: SiteKey; 
  children: React.ReactNode 
}> = ({ siteKey, children }) => {
  return (
    <LandingSiteContext.Provider value={{ siteKey }}>
      {children}
    </LandingSiteContext.Provider>
  );
};

export const useSiteContext = () => {
  const context = useContext(LandingSiteContext);
  // Default to tieng-trung if not in a provider (legacy support)
  return context || { siteKey: 'tieng-trung' };
};
