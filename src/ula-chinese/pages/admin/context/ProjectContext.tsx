import React, { createContext, useContext, useState, useEffect } from 'react';

type ProjectType = 'tieng-trung' | 'tieng-duc';

interface ProjectContextType {
  activeProject: ProjectType;
  setActiveProject: (project: ProjectType) => void;
  activeCampaign: string | null;
  setActiveCampaign: (campaignTag: string | null) => void;
  isLoadingContext: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const PROJECT_STORAGE_KEY = 'ula_admin_active_project';
const CAMPAIGN_STORAGE_KEY = 'ula_admin_active_campaign';

export const ProjectProvider: React.FC<{ 
  children: React.ReactNode,
  defaultProject?: ProjectType 
}> = ({ children, defaultProject }) => {
  const [activeProject, setActiveProjectState] = useState<ProjectType>(defaultProject || 'tieng-trung');
  const [activeCampaign, setActiveCampaignState] = useState<string | null>(null);
  const [isLoadingContext, setIsLoadingContext] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    const storedProject = localStorage.getItem(PROJECT_STORAGE_KEY);
    
    if (storedProject === 'tieng-trung' || storedProject === 'tieng-duc') {
      // Nếu có defaultProject và nó khác với storedProject, ta ưu tiên defaultProject của module hiện tại
      if (defaultProject && storedProject !== defaultProject) {
        setActiveProjectState(defaultProject);
        localStorage.setItem(PROJECT_STORAGE_KEY, defaultProject);
      } else {
        setActiveProjectState(storedProject as ProjectType);
      }
    } else if (defaultProject) {
      localStorage.setItem(PROJECT_STORAGE_KEY, defaultProject);
    }
    
    const storedCampaign = localStorage.getItem(CAMPAIGN_STORAGE_KEY);
    setActiveCampaignState(storedCampaign);
    
    setIsLoadingContext(false);
  }, [defaultProject]);

  const setActiveProject = (project: ProjectType) => {
    setActiveProjectState(project);
    localStorage.setItem(PROJECT_STORAGE_KEY, project);
  };

  const setActiveCampaign = (campaignTag: string | null) => {
    setActiveCampaignState(campaignTag);
    if (campaignTag) {
      localStorage.setItem(CAMPAIGN_STORAGE_KEY, campaignTag);
    } else {
      localStorage.removeItem(CAMPAIGN_STORAGE_KEY);
    }
  };

  return (
    <ProjectContext.Provider value={{ 
      activeProject, 
      setActiveProject, 
      activeCampaign, 
      setActiveCampaign, 
      isLoadingContext 
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
