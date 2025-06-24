-- Create separate databases for app data and Keycloak
CREATE DATABASE sanare_app;
CREATE DATABASE keycloak;

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
    phone VARCHAR(20), -- Optional phone number field
    providerid VARCHAR(8),
    createdat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_provider FOREIGN KEY (providerid) REFERENCES provider(providerid)
);