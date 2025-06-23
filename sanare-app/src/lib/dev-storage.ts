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

  // Initialize with dummy therapist if not exists
  initDummyTherapist: () => {
    console.log('DevStorage - Initializing dummy therapist');
    try {
      const therapists = JSON.parse(localStorage.getItem('therapists') || '{}');
      if (!therapists['101']) {
        therapists['101'] = [{
          therapist_id: '101',
          first_name: 'Default',
          last_name: 'Therapist',
          password: 'therapy123',
          created_at: new Date().toISOString()
        }];
        localStorage.setItem('therapists', JSON.stringify(therapists));
        console.log('DevStorage - Dummy therapist initialized:', therapists['101']);
      } else {
        console.log('DevStorage - Dummy therapist already exists:', therapists['101']);
      }
    } catch (error) {
      console.error('DevStorage - Error initializing dummy therapist:', error);
    }
  },

  // Initialize with sample data
  initializeStorage: () => {
    console.log('DevStorage - Initializing sample data');
    
    // Initialize dummy therapist first
    DevStorage.initDummyTherapist();
    
    // Default patients for the dummy therapist
    const defaultPatients = [
      {
        patient_id: "1745013352290",
        first_name: "Sarah",
        last_name: "Johnson",
        age: 28,
        pronouns: "She/Her",
        therapist_id: "101",
        created_at: new Date().toISOString()
      },
      {
        patient_id: "1745013352291",
        first_name: "Michael",
        last_name: "Brown",
        age: 35,
        pronouns: "He/Him",
        therapist_id: "101",
        created_at: new Date().toISOString()
      }
    ];
    
    try {
      // Initialize patients by therapist if not already present
      if (!localStorage.getItem('patients')) {
        const patientsMap: Record<string, Patient[]> = {};
        patientsMap["101"] = defaultPatients; // Add to the dummy therapist
        localStorage.setItem('patients', JSON.stringify(patientsMap));
        console.log('DevStorage - Initialized patients:', patientsMap);
      }
    } catch (error) {
      console.error('DevStorage - Error initializing sample data:', error);
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