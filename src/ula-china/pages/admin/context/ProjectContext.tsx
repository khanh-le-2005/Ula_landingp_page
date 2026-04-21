import React, { createContext, useContext, useState, useEffect } from 'react';

type ProjectType = 'tieng-trung' | 'tieng-duc';

interface ProjectContextType {
  activeProject: ProjectType;
  setActiveProject: (project: ProjectType) => void;
  isLoadingContext: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const PROJECT_STORAGE_KEY = 'ula_admin_active_project';

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeProject, setActiveProjectState] = useState<ProjectType>('tieng-trung');
  const [isLoadingContext, setIsLoadingContext] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(PROJECT_STORAGE_KEY);
    if (stored === 'tieng-trung' || stored === 'tieng-duc') {
      setActiveProjectState(stored as ProjectType);
    }
    setIsLoadingContext(false);
  }, []);

  const setActiveProject = (project: ProjectType) => {
    setActiveProjectState(project);
    localStorage.setItem(PROJECT_STORAGE_KEY, project);
    
    // Optional: Refresh the page or broadcast change if needed
    // window.location.reload(); 
  };

  return (
    <ProjectContext.Provider value={{ activeProject, setActiveProject, isLoadingContext }}>
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
