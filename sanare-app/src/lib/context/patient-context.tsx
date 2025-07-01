import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getPatient } from '@/lib/api';

interface Patient {
  id: string;
  firstname: string;
  lastname: string;
}

interface PatientContextType {
  patient: Patient | null;
  setPatient: (patient: Patient | null) => void;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export function PatientProvider({ children }: { children: ReactNode }) {
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const id = localStorage.getItem('currentPatientId');
      if (id) {
        // Fetch patient from backend
        getPatient(id).then((data) => {
          if (data) {
            setPatient({ id: data.patientid, firstname: data.firstname, lastname: data.lastname });
          }
        });
      }
    }
  }, []);

  return (
    <PatientContext.Provider value={{ patient, setPatient }}>
      {children}
    </PatientContext.Provider>
  );
}

export function usePatient() {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatient must be used within a PatientProvider');
  }
  return context;
}
