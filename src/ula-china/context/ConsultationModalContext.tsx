import React, { createContext, useContext, useState, ReactNode } from "react";

interface ConsultationModalContextType {
  isOpen: boolean;
  openConsultation: (options?: any) => void;
  closeConsultation: () => void;
  options: any;
}

const ConsultationModalContext = createContext<ConsultationModalContextType | undefined>(undefined);

export const ConsultationModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState({});

  const openConsultation = (opt?: any) => {
    setOptions(opt || {});
    setIsOpen(true);
  };

  const closeConsultation = () => setIsOpen(false);

  return (
    <ConsultationModalContext.Provider value={{ isOpen, openConsultation, closeConsultation, options }}>
      {children}
    </ConsultationModalContext.Provider>
  );
};

export const useConsultationModal = () => {
  const context = useContext(ConsultationModalContext);
  if (context === undefined) {
    // Fallback if provider is not used
    return {
      isOpen: false,
      openConsultation: () => {},
      closeConsultation: () => {},
      options: {},
    };
  }
  return context;
};
