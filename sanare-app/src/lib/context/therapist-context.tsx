import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Therapist {
  providerid: string;
  firstname: string;
  lastname: string;
  email: string;
}

interface TherapistContextType {
  therapist: Therapist | null;
  setTherapist: (therapist: Therapist | null) => void;
}

const TherapistContext = createContext<TherapistContextType | undefined>(undefined);

export const TherapistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [therapist, setTherapistState] = useState<Therapist | null>(null);

  // Load therapist from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('therapist');
    if (stored) {
      try {
        setTherapistState(JSON.parse(stored));
      } catch {}
    }
  }, []);

  // Save therapist to localStorage on change
  const setTherapist = (therapist: Therapist | null) => {
    setTherapistState(therapist);
    if (therapist) {
      localStorage.setItem('therapist', JSON.stringify(therapist));
    } else {
      localStorage.removeItem('therapist');
    }
  };

  return (
    <TherapistContext.Provider value={{ therapist, setTherapist }}>
      {children}
    </TherapistContext.Provider>
  );
};

export function useTherapist() {
  const context = useContext(TherapistContext);
  if (!context) {
    throw new Error('useTherapist must be used within a TherapistProvider');
  }
  return context;
}