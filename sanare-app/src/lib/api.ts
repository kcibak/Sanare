// DEMO MODE SWITCH
const USE_DEMO_DATA = true; // Set to true for Netlify demo, or use env var

// API URL
const API_URL = (import.meta as any).env.VITE_API_URL || '';
console.log('[Sanare] API_URL:', API_URL, 'DEMO_MODE:', USE_DEMO_DATA);

import demoPatients from '../demo_data/patient.json';
import demoProviders from '../demo_data/provider.json';
import demoGoals from '../demo_data/goals.json';
import demoNotes from '../demo_data/notes.json';
import demoJournal from '../demo_data/journal.json';
import demoTasks from '../demo_data/tasks.json';

// --- DEMO DATA LOCALSTORAGE HELPERS ---
function getDemoData(key: string, fallback: any) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {}
  return fallback;
}  
function setDemoData(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getPatientsData() {
  return getDemoData('demo_patients', demoPatients.patient || []);
}
function setPatientsData(data: any[]) {
  setDemoData('demo_patients', data);
}
function getProvidersData() {
  return getDemoData('demo_providers', demoProviders.provider || []);
}
function setProvidersData(data: any[]) {
  setDemoData('demo_providers', data);
}
function getGoalsData() {
  return getDemoData('demo_goals', demoGoals.goals || []);
}
function setGoalsData(data: any[]) {
  setDemoData('demo_goals', data);
}
function getNotesData() {
  return getDemoData('demo_notes', demoNotes.notes || []);
}
function setNotesData(data: any[]) {
  setDemoData('demo_notes', data);
}
function getJournalData() {
  return getDemoData('demo_journal', demoJournal.journal || []);
}
function setJournalData(data: any[]) {
  setDemoData('demo_journal', data);
}
function getTasksData() {
  return getDemoData('demo_tasks', demoTasks.tasks || []);
}
function setTasksData(data: any[]) {
  setDemoData('demo_tasks', data);
}

import type { Note, CreateNoteRequest, UpdateNoteRequest } from '../types/notes';


export async function getPatients(providerid: string) {
  if (USE_DEMO_DATA) {
    return getPatientsData().filter((p: any) => p.providerid === providerid);
  }
  try {
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
  if (USE_DEMO_DATA) {
    // In demo mode, add to localStorage and return
    const patients = getPatientsData();
    const newPatient = {
      patientid: Math.random().toString().slice(2, 10),
      firstname,
      lastname,
      providerid,
      email,
      dob,
      createdat: new Date().toISOString(),
    };
    setPatientsData([...patients, newPatient]);
    return newPatient;
  }
  try {
    if (!firstname || !lastname || !providerid || !email) {
      throw new Error('Missing required fields');
    }
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
  if (USE_DEMO_DATA) {
    return { therapists: getProvidersData() };
  }
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
  if (USE_DEMO_DATA) {
    const providers = getProvidersData();
    const newProvider = {
      providerid: Math.random().toString().slice(2, 10),
      firstname: firstName,
      lastname: lastName,
      password,
      createdat: new Date().toISOString(),
    };
    setProvidersData([...providers, newProvider]);
    return newProvider;
  }
  try {
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
  if (USE_DEMO_DATA) {
    const patients = getPatientsData();
    const idx = patients.findIndex((p: any) => p.patientid === patientid);
    if (idx === -1) throw new Error('Patient not found');
    const updated = { ...patients[idx], firstname, lastname };
    patients[idx] = updated;
    setPatientsData(patients);
    return updated;
  }
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
  if (USE_DEMO_DATA) {
    let patients = getPatientsData();
    patients = patients.filter((p: any) => p.patientid !== patientid);
    setPatientsData(patients);
    return { success: true };
  }
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
  if (USE_DEMO_DATA) {
    const providers = getProvidersData();
    const newProvider = {
      providerid: Math.random().toString().slice(2, 10),
      firstname,
      lastname,
      email,
      password,
      createdat: new Date().toISOString(),
    };
    setProvidersData([...providers, newProvider]);
    return newProvider;
  }
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
  if (USE_DEMO_DATA) {
    const provider = getProvidersData().find((p: any) => p.providerid === providerid && p.password === password);
    if (!provider) throw new Error('Invalid credentials');
    return provider;
  }
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
  if (USE_DEMO_DATA) {
    const patient = getPatientsData().find((p: any) => p.patientid === patientid && p.password === password);
    if (!patient) throw new Error('Invalid credentials');
    return patient;
  }
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
  if (USE_DEMO_DATA) {
    return getPatientsData().find((p: any) => p.patientid === patientid) || null;
  }
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
  if (USE_DEMO_DATA) {
    return getNotesData().filter((n: any) => n.patientid === patientid);
  }
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
  if (USE_DEMO_DATA) {
    const notes = getNotesData();
    const newNote = {
      noteid: Math.random().toString().slice(2, 10),
      patientid,
      sessiondate,
      notetitle: notetitle ?? null,
      notecontent: notecontent ?? null,
      createdat: new Date().toISOString(),
      updatedat: new Date().toISOString(),
      isactive: true,
      isshared: false,
      ack: false,
    };
    setNotesData([...notes, newNote]);
    return newNote;
  }
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
  if (USE_DEMO_DATA) {
    const notes = getNotesData();
    const idx = notes.findIndex((n: any) => n.noteid === noteid);
    if (idx === -1) throw new Error('Note not found');
    const note = notes[idx];
    const { comments, ...rest } = note;
    const updated = {
      ...rest,
      notetitle: notetitle ?? null,
      notecontent: notecontent ?? null,
      updatedat: new Date().toISOString(),
      isactive: true,
    };
    notes[idx] = updated;
    setNotesData(notes);
    return updated;
  }
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
  if (USE_DEMO_DATA) {
    let notes = getNotesData();
    notes = notes.filter((n: any) => n.noteid !== noteid);
    setNotesData(notes);
    return true;
  }
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
  if (USE_DEMO_DATA) {
    const notes = getNotesData();
    const idx = notes.findIndex((n: any) => n.noteid === noteid);
    if (idx === -1) throw new Error('Note not found');
    const note = notes[idx];
    const { comments, ...rest } = note;
    const updated = {
      ...rest,
      isshared,
      updatedat: new Date().toISOString(),
      isactive: true,
    };
    notes[idx] = updated;
    setNotesData(notes);
    return updated;
  }
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
  if (USE_DEMO_DATA) {
    const patients = getPatientsData();
    const idx = patients.findIndex((p: any) => p.patientid === patientid);
    if (idx === -1) throw new Error('Patient not found');
    const updated = { ...patients[idx], password };
    patients[idx] = updated;
    setPatientsData(patients);
    return updated;
  }
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
  if (USE_DEMO_DATA) {
    return getJournalData().filter((j: any) => j.patientid === patientid);
  }
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
  if (USE_DEMO_DATA) {
    const journal = getJournalData();
    const newEntry = {
      entryid: Math.random().toString().slice(2, 10),
      patientid,
      title,
      content,
      createdat: new Date().toISOString(),
      updatedat: new Date().toISOString(),
    };
    setJournalData([...journal, newEntry]);
    return newEntry;
  }
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
  if (USE_DEMO_DATA) {
    let journal = getJournalData();
    journal = journal.filter((j: any) => j.entryid !== entryid);
    setJournalData(journal);
    return true;
  }
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
  if (USE_DEMO_DATA) {
    return (demoNotes.notes || []).filter((n: any) => n.patientid === patientid && n.isshared);
  }
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
  if (USE_DEMO_DATA) {
    const note = (demoNotes.notes || []).find((n: any) => n.noteid === noteid);
    if (!note) throw new Error('Note not found');
    const { comments, ...rest } = note;
    return {
      ...rest,
      ack: !note.ack,
      updatedat: new Date().toISOString(),
      isactive: true,
    };
  }
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
  if (USE_DEMO_DATA) {
    const note = getNotesData().find((n: any) => n.noteid === noteid);
    if (!note) return [];
    if (!note.comments) return [];
    if (Array.isArray(note.comments)) return note.comments;
    try {
      return JSON.parse(note.comments);
    } catch {
      return [];
    }
  }
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
  if (USE_DEMO_DATA) {
    // Merge tasks into each goal for frontend compatibility
    const goals = getGoalsData().filter((g: any) => g.patientid === patientid);
    const allTasks = getTasksData();
    return goals.map((goal: any) => ({
      ...goal,
      tasks: allTasks.filter((t: any) => t.goalid === goal.goalid)
    }));
  }
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
  if (USE_DEMO_DATA) {
    const goals = getGoalsData();
    const idx = goals.findIndex((g: any) => g.goalid === goalid);
    if (idx === -1) throw new Error('Goal not found');
    const updated = { ...goals[idx], iscomplete };
    goals[idx] = updated;
    setGoalsData(goals);
    return updated;
  }
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
  if (USE_DEMO_DATA) {
    const tasks = getTasksData();
    const idx = tasks.findIndex((t: any) => t.taskid === taskid);
    if (idx === -1) throw new Error('Task not found');
    const updated = { ...tasks[idx], iscompleted };
    tasks[idx] = updated;
    setTasksData(tasks);
    return updated;
  }
  const response = await fetch(`/api/v1/tasks/${taskid}/complete`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ iscompleted }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to update task complete');
  return data;
}
