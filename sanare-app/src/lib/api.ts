const API_URL = (import.meta as any).env.VITE_API_URL || '';

export async function getPatients(providerid: string) {
  try {
    console.log('Fetching patients for provider:', providerid);
    const response = await fetch(`/api/v1/patients?providerid=${providerid}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch patients');
    }
    return data.patients || [];
  } catch (error) {
    console.error('Error in getPatients:', error);
    return [];
  }
}

export async function createPatient(firstname: string, lastname: string, providerid: string, phone?: string, email?: string) {
  try {
    console.log('createPatient called with:', { firstname, lastname, providerid, phone, email });
    if (!firstname || !lastname || !providerid || !email) {
      console.error('Missing fields:', { firstname, lastname, providerid, email });
      throw new Error('Missing required fields');
    }
    // Always call backend for patient creation
    const response = await fetch('/api/v1/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstname, lastname, providerid, phone, email }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create patient');
    }
    return data;
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

export async function createProvider(firstname: string, lastname: string, email: string, password: string) {
  try {
    if (!firstname || !lastname || !email || !password) {
      throw new Error('Missing required fields');
    }
    const response = await fetch('/api/v1/providers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstname, lastname, email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create provider');
    }
    return data;
  } catch (error) {
    console.error('Error in createProvider:', error);
    throw error;
  }
}

export async function loginProvider(providerid: string, password: string) {
  try {
    const response = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ providerid, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }
    return data.provider;
  } catch (error) {
    console.error('Error in loginProvider:', error);
    throw error;
  }
}

export async function getPatient(patientid: string) {
  try {
    const response = await fetch(`/api/v1/patients/${patientid}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch patient');
    }
    return data.patient;
  } catch (error) {
    console.error('Error in getPatient:', error);
    return null;
  }
}

export async function getPatientNotes(patientid: string) {
  try {
    const response = await fetch(`/api/v1/patients/${patientid}/notes`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch notes');
    }
    return data.notes || [];
  } catch (error) {
    console.error('Error in getPatientNotes:', error);
    return [];
  }
}