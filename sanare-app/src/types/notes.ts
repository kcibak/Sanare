export interface Note {
  noteid: string;
  patientid: string;
  notetitle?: string | null;
  notecontent: string | null;
  sessiondate: string; // ISO date string
  createdat: string; // ISO timestamp
  updatedat: string; // ISO timestamp
  isactive: boolean;
  isshared: boolean;
  ack: boolean;
}

export interface CreateNoteRequest {
  patientid: string;
  sessiondate: string;
  notetitle?: string;
  notecontent?: string;
}

export interface UpdateNoteRequest {
  notetitle?: string;
  notecontent?: string;
}
