// lib/dev-storage.ts

interface Therapist {
  therapist_id: string;
  first_name: string;
  last_name: string;
  password: string;
  email?: string;
  created_at?: string;
}
interface TherapistsMap {
  [therapistId: string]: Therapist[];
}

interface Patient {
  patient_id: string;
  first_name: string;
  last_name: string;
  age: number;
  pronouns: string;
  therapist_id: string;
  created_at?: string;
}

export const DevStorage = {
  // Store a therapist
  saveTherapist: (therapist: {
    therapist_id: string;
    first_name: string;
    last_name: string;
    password: string;
    email?: string;
  }) => {
    console.log('DevStorage - Saving therapist:', therapist);
    try {
      let therapists: TherapistsMap = {};
      try {
        therapists = JSON.parse(localStorage.getItem('therapists') || '{}');
      } catch (e) {
        console.error('DevStorage - Error parsing existing therapists:', e);
      }
      
      therapists[therapist.therapist_id] = [therapist]; // Now typed correctly
      localStorage.setItem('therapists', JSON.stringify(therapists));
      
      // Verify the save
      const saved = localStorage.getItem('therapists');
      console.log('DevStorage - Stored therapists after save:', saved);
      return true;
    } catch (error) {
      console.error('DevStorage - Error saving therapist:', error);
      return false;
    }
  },

  // Get a therapist by ID
  getTherapist: (id: string) => {
    console.log('DevStorage - Getting therapist with ID:', id);
    try {
      const therapists = JSON.parse(localStorage.getItem('therapists') || '{}');
      console.log('DevStorage - All stored therapists:', therapists);
      const therapist = therapists[id]?.[0]; // Get first item from array
      console.log('DevStorage - Found therapist:', therapist);
      return therapist;
    } catch (error) {
      console.error('DevStorage - Error getting therapist:', error);
      return null;
    }
  },

  // Get all patients for a therapist
  getPatientsByTherapist: (therapistId: string) => {
    console.log('DevStorage - Getting patients for therapist:', therapistId);
    try {
      const patientsMap = JSON.parse(localStorage.getItem('patients') || '{}');
      return patientsMap[therapistId] || [];
    } catch (error) {
      console.error('DevStorage - Error getting patients:', error);
      return [];
    }
  },

  // Get patient by ID
  getPatient: (patientId: string) => {
    console.log('DevStorage - Getting patient with ID:', patientId);
    try {
      const patientsMap = JSON.parse(localStorage.getItem('patients') || '{}');
      for (const therapistId in patientsMap) {
        const patient = patientsMap[therapistId].find(
          (p: Patient) => p.patient_id === patientId
        );
        if (patient) {
          console.log('DevStorage - Found patient:', patient);
          return patient;
        }
      }
      console.log('DevStorage - No patient found with ID:', patientId);
      return null;
    } catch (error) {
      console.error('DevStorage - Error getting patient:', error);
      return null;
    }
  },

  // Clear all stored data (useful for testing)
  clearStorage: () => {
    localStorage.removeItem('therapists');
    localStorage.removeItem('patients');
    localStorage.removeItem('currentTherapistId');
    localStorage.removeItem('currentPatientId');
    console.log('DevStorage - Cleared all storage');
  }
};