import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Animal } from '@shared/schema';

interface ARContextType {
  isARActive: boolean;
  selectedModel: Animal | null;
  startAR: () => Promise<void>;
  stopAR: () => void;
  selectARModel: (model: Animal) => void;
}

const ARContext = createContext<ARContextType | undefined>(undefined);

export const ARProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isARActive, setIsARActive] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Animal | null>(null);

  const startAR = async () => {
    // This would normally interact with AR.js or similar library
    try {
      setIsARActive(true);
      return Promise.resolve();
    } catch (error) {
      console.error("Error starting AR:", error);
      return Promise.reject(error);
    }
  };

  const stopAR = () => {
    setIsARActive(false);
  };

  const selectARModel = (model: Animal) => {
    setSelectedModel(model);
    console.log(`Selected AR model: ${model.name}, URL: ${model.modelUrl}`);
    // In a real implementation, this would load the 3D model into the AR scene
  };

  const value = {
    isARActive,
    selectedModel,
    startAR,
    stopAR,
    selectARModel
  };

  return (
    <ARContext.Provider value={value}>
      {children}
    </ARContext.Provider>
  );
};

export const useAR = (): ARContextType => {
  const context = useContext(ARContext);
  if (context === undefined) {
    throw new Error('useAR must be used within an ARProvider');
  }
  return context;
};
