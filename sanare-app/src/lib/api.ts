export async function getPatients(therapistId: string) {
  try {
    console.log('Fetching patients for therapist:', therapistId);

    // For localStorage therapists (those starting with 'T')
    if (therapistId.startsWith('T')) {
      const patients = JSON.parse(localStorage.getItem('patients') || '{}');
      return patients[therapistId] || [];
    }
    
    // For dummy therapist (101), use file system
    if (therapistId === '101') {
      const response = await fetch(`/api/patients?therapistId=${therapistId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch patients');
      }
      
      return data.patients || [];
    }

    return [];
  } catch (error) {
    console.error('Error in getPatients:', error);
    return [];
  }
}

export async function createPatient(firstName: string, lastName: string, therapistId: string) {
  try {
    if (!firstName || !lastName || !therapistId) {
      throw new Error('Missing required fields');
    }

    // For localStorage therapists (those starting with 'T')
    if (therapistId.startsWith('T')) {
      const patientId = `P${Date.now()}`;
      const newPatient = {
        patient_id: patientId,
        first_name: firstName,
        last_name: lastName,
        therapist_id: therapistId,
        created_at: new Date().toISOString()
      };

      // Get existing patients
      const patients = JSON.parse(localStorage.getItem('patients') || '{}');
      if (!patients[therapistId]) {
        patients[therapistId] = [];
      }
      
      // Add new patient
      patients[therapistId].push(newPatient);
      
      // Save back to localStorage
      localStorage.setItem('patients', JSON.stringify(patients));
      
      return { patientId };
    }
    
    // For dummy therapist (101), use file system
    if (therapistId === '101') {
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, therapistId }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create patient');
      }
      
      return data;
    }

    throw new Error('Invalid therapist ID');
  } catch (error) {
    console.error('Error in createPatient:', error);
    throw error;
  }
}

export async function getTherapists() {
  try {
    const response = await fetch('/api/therapists')
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch therapists')
    }
    
    return data
  } catch (error) {
    console.error('Error in getTherapists:', error)
    return { therapists: [] }
  }
}

export async function createTherapist(firstName: string, lastName: string, password: string) {
  try {
    // Validate input
    if (!firstName || !lastName || !password) {
      throw new Error('Missing required fields')
    }

    const response = await fetch('/api/therapists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName, lastName, password }),
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create therapist')
    }
    
    return data
  } catch (error) {
    console.error('Error in createTherapist:', error)
    throw error
  }
}

export async function deletePatient(patientId: string) {
  try {
    const response = await fetch(`/api/patients/${patientId}`, {
      method: 'DELETE',
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete patient')
    }
    
    return data
  } catch (error) {
    console.error('Error in deletePatient:', error)
    throw error
  }
} 