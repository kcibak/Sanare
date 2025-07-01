-- Create separate databases and users (run this in a PostgreSQL superuser session)
CREATE DATABASE sanare_app;

\connect sanare_app

-- Table: provider
CREATE TABLE IF NOT EXISTS provider (
    providerid VARCHAR(8) PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    createdat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: patient
CREATE TABLE IF NOT EXISTS patient (
   patientid VARCHAR(8) PRIMARY KEY,
   firstname VARCHAR(100) NOT NULL,
   lastname VARCHAR(100) NOT NULL,
   email VARCHAR(255) NOT NULL UNIQUE,
   dob DATE,
   providerid VARCHAR(8),
   password VARCHAR(255),  -- New password field, nullable
   createdat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
   CONSTRAINT fk_provider FOREIGN KEY (providerid) REFERENCES provider(providerid)
);

-- Table: notes
CREATE TABLE IF NOT EXISTS notes (
    noteid VARCHAR(8) PRIMARY KEY,
    patientid VARCHAR(8) NOT NULL,
    notecontent TEXT,
    notetitle TEXT,
    comments TEXT,
    sessiondate DATE NOT NULL,
    createdat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    isshared BOOLEAN NOT NULL DEFAULT FALSE,
    ack BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_patient FOREIGN KEY (patientid) REFERENCES patient(patientid)
);

-- Index: idx_notes_patientid
CREATE INDEX IF NOT EXISTS idx_notes_patientid ON notes(patientid);

CREATE TABLE IF NOT EXISTS journal (
    entryid VARCHAR(8) PRIMARY KEY,
    patientid VARCHAR(8) NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    createdat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_journal_patient FOREIGN KEY (patientid) REFERENCES patient(patientid)
);

CREATE INDEX IF NOT EXISTS idx_journal_patientid ON journal(patientid);

CREATE TABLE IF NOT EXISTS goals (
    goalid VARCHAR(8) PRIMARY KEY,
    patientid VARCHAR(8) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    iscomplete BOOLEAN NOT NULL DEFAULT FALSE,
    createdat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completedat TIMESTAMP,
    CONSTRAINT fk_goals_patient FOREIGN KEY (patientid) REFERENCES patient(patientid)
);

CREATE INDEX IF NOT EXISTS idx_goals_patientid ON goals(patientid);

CREATE TABLE IF NOT EXISTS tasks (
    taskid VARCHAR(8) PRIMARY KEY,
    goalid VARCHAR(8) NOT NULL,
    title TEXT NOT NULL,
    iscompleted BOOLEAN NOT NULL DEFAULT FALSE,
    createdat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tasks_goal FOREIGN KEY (goalid) REFERENCES goals(goalid) ON DELETE CASCADE
);