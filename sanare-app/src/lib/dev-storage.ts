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
  password?: string; // Add password field for patients
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

  // Set patient password (for registration)
  setPatientPassword: (patientId: string, password: string) => {
    try {
      const patientsMap = JSON.parse(localStorage.getItem('patients') || '{}');
      let found = false;
      for (const therapistId in patientsMap) {
        const patientArr = patientsMap[therapistId];
        for (let i = 0; i < patientArr.length; i++) {
          if (patientArr[i].patient_id === patientId) {
            if (patientArr[i].password) {
              // Already registered
              return false;
            }
            patientArr[i].password = password;
            found = true;
            break;
          }
        }
        if (found) break;
      }
      if (found) {
        localStorage.setItem('patients', JSON.stringify(patientsMap));
        return true;
      }
      return false;
    } catch (error) {
      console.error('DevStorage - Error setting patient password:', error);
      return false;
    }
  },

  // Clear all stored data (useful for testing)
  clearStorage: () => {
    localStorage.removeItem('therapists');
    localStorage.removeItem('patients');
    localStorage.removeItem('currentTherapistId');
    localStorage.removeItem('currentPatientId');
    console.log('DevStorage - Cleared all storage');
  },

  // Add this function to initialize demo data for patients and therapists
  initializeStorage: () => {
    // Only initialize if not already present
    if (!localStorage.getItem('therapists')) {
      localStorage.setItem('therapists', JSON.stringify({
        '1001': [{
          therapist_id: '1001',
          first_name: 'Dr. Smith',
          last_name: 'Smith',
          password: 'Therapist123!',
          email: 'drsmith@example.com',
        }],
      }));
    }
    if (!localStorage.getItem('patients')) {
      localStorage.setItem('patients', JSON.stringify({
        '1001': [
          {
            patient_id: '1745013352290',
            first_name: 'Sarah',
            last_name: 'Johnson',
            age: 28,
            pronouns: 'she/her',
            therapist_id: '1001',
          },
        ],
      }));
    }
    console.log('DevStorage - Demo data initialized');
  },
};