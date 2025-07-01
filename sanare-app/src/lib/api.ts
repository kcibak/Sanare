// API URL
const API_URL = (import.meta as any).env.VITE_API_URL || '';
console.log('[Sanare] API_URL:', API_URL);

import type { Note, CreateNoteRequest, UpdateNoteRequest } from '../types/notes';

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

export async function createPatient(firstname: string, lastname: string, providerid: string, email?: string, dob?: string) {
  try {
    console.log('createPatient called with:', { firstname, lastname, providerid, email, dob });
    if (!firstname || !lastname || !providerid || !email) {
      console.error('Missing fields:', { firstname, lastname, providerid, email });
      throw new Error('Missing required fields');
    }
    // Always call backend for patient creation
    const response = await fetch('/api/v1/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstname, lastname, providerid, email, dob }),
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

export async function updatePatientName(patientid: string, firstname: string, lastname: string) {
  try {
    const response = await fetch(`/api/v1/patients/${patientid}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstname, lastname }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update patient name');
    }
    return data.patient;
  } catch (error) {
    console.error('Error in updatePatientName:', error);
    throw error;
  }
}

export async function deletePatient(patientid: string) {
  try {
    const response = await fetch(`/api/v1/patients/${patientid}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete patient');
    }
    return data;
  } catch (error) {
    console.error('Error in deletePatient:', error);
    throw error;
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

// Rudimentary provider login
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

// Rudimentary patient login
export async function loginPatient(patientid: string, password: string) {
  try {
    const response = await fetch(`/api/v1/patients/${patientid}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }
    if (data.patient && data.patient.password === password) {
      return data.patient;
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    console.error('Error in loginPatient:', error);
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

export async function createNote({ patientid, sessiondate, notetitle, notecontent }: CreateNoteRequest): Promise<Note> {
  try {
    const response = await fetch('/api/v1/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientid, sessiondate, notetitle, notecontent }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create note');
    }
    return data as Note;
  } catch (error) {
    console.error('Error in createNote:', error);
    throw error;
  }
}

export async function updateNote(noteid: string, notetitle: string, notecontent: string): Promise<Note> {
  try {
    const response = await fetch(`/api/v1/notes/${noteid}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notetitle, notecontent }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update note');
    }
    return data as Note;
  } catch (error) {
    console.error('Error in updateNote:', error);
    throw error;
  }
}

export async function deleteNote(noteid: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/v1/notes/${noteid}`, {
      method: 'DELETE',
    });
    if (response.status === 204) {
      return true;
    } else {
      let data;
      try { data = await response.json(); } catch {}
      throw new Error((data && data.error) || 'Failed to delete note');
    }
  } catch (error) {
    console.error('Error in deleteNote:', error);
    throw error;
  }
}

export async function updateNoteSharedStatus(noteid: string, isshared: boolean): Promise<Note> {
  try {
    const response = await fetch(`/api/v1/notes/${noteid}/shared`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isshared }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update shared status');
    }
    return data as Note;
  } catch (error) {
    console.error('Error in updateNoteSharedStatus:', error);
    throw error;
  }
}

export async function setPatientPassword(patientid: string, password: string) {
  try {
    const response = await fetch(`/api/v1/patients/${patientid}/password`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to set patient password');
    }
    return data.patient;
  } catch (error) {
    console.error('Error in setPatientPassword:', error);
    throw error;
  }
}

export async function getPatientJournalEntries(patientid: string) {
  try {
    const response = await fetch(`/api/v1/patients/${patientid}/journal`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch journal entries');
    }
    // Map backend fields to frontend shape if needed
    return (data || []).map((entry: any) => ({
      entryid: entry.entryid,
      date: entry.createdat,
      title: entry.title,
      content: entry.content,
      createdat: entry.createdat,
    }));
  } catch (error) {
    console.error('Error in getPatientJournalEntries:', error);
    return [];
  }
}

export async function createJournalEntry({ patientid, title, content }: { patientid: string; title: string; content?: string }) {
  try {
    const response = await fetch('/api/v1/journal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientid, title, content }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create journal entry');
    }
    return data;
  } catch (error) {
    console.error('Error in createJournalEntry:', error);
    throw error;
  }
}

export async function deleteJournalEntry(entryid: string) {
  try {
    const response = await fetch(`/api/v1/journal/${entryid}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      let data;
      try { data = await response.json(); } catch {}
      throw new Error((data && data.error) || 'Failed to delete journal entry');
    }
    return true;
  } catch (error) {
    console.error('Error in deleteJournalEntry:', error);
    throw error;
  }
}

export async function getSharedNotesForPatient(patientid: string) {
  try {
    const response = await fetch(`/api/v1/patients/${patientid}/notes?shared=true`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch shared notes');
    }
    return data.notes || [];
  } catch (error) {
    console.error('Error in getSharedNotesForPatient:', error);
    return [];
  }
}

export async function toggleNoteAcknowledged(noteid: string): Promise<Note> {
  const response = await fetch(`/api/v1/notes/${noteid}/acknowledged`, {
    method: 'PATCH',
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to toggle acknowledged');
  }
  return response.json();
}

export async function getNoteComments(noteid: string) {
  try {
    const response = await fetch(`/api/v1/notes/${noteid}/comments`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch comments');
    }
    return data.comments || [];
  } catch (error) {
    console.error('Error in getNoteComments:', error);
    return [];
  }
}

export async function addNoteComment(noteid: string, content: string, author: string = 'patient') {
  try {
    const response = await fetch(`/api/v1/notes/${noteid}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, author }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to add comment');
    }
    return data;
  } catch (error) {
    console.error('Error in addNoteComment:', error);
    throw error;
  }
}

export async function deleteNoteComment(noteid: string, commentIndex: number, author: string) {
  try {
    const response = await fetch(`/api/v1/notes/${noteid}/comments/${commentIndex}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author }),
    });
    if (!response.ok && response.status !== 204) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to delete comment');
    }
    return true;
  } catch (error) {
    console.error('Error in deleteNoteComment:', error);
    throw error;
  }
}

type TaskInput = {
  id?: string;
  title: string;
  description?: string;
  completed?: boolean;
};

type CreateGoalInput = {
  patientid: string;
  title: string;
  description?: string;
  tasks?: TaskInput[];
};

type UpdateGoalInput = {
  title?: string;
  description?: string;
  tasks?: TaskInput[];
};

export async function createGoal({ patientid, title, description, tasks }: CreateGoalInput) {
  const response = await fetch('/api/v1/goals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ patientid, title, description, tasks }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to create goal');
  return data;
}

export async function updateGoal(goalid: string, { title, description, tasks }: UpdateGoalInput) {
  const response = await fetch(`/api/v1/goals/${goalid}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description, tasks }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to update goal');
  return data;
}

export async function deleteTask(taskid: string) {
  const response = await fetch(`/api/v1/tasks/${taskid}`, {
    method: 'DELETE',
  });
  if (response.status !== 204) {
    let data;
    try { data = await response.json(); } catch {}
    throw new Error((data && data.error) || 'Failed to delete task');
  }
  return true;
}

export async function getGoals(patientid: string) {
  try {
    const response = await fetch(`/api/v1/patients/${patientid}/goals`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch goals');
    return data.goals;
  } catch (error) {
    console.error('Error in getGoals:', error);
    return [];
  }
}

export async function toggleGoalComplete(goalid: string, iscomplete: boolean) {
  const response = await fetch(`/api/v1/goals/${goalid}/complete`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ iscomplete }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to update goal complete');
  return data;
}

export async function toggleTaskComplete(taskid: string, iscompleted: boolean) {
  const response = await fetch(`/api/v1/tasks/${taskid}/complete`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ iscompleted }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to update task complete');
  return data;
}