import { keycloak, memoryStore } from '../config/keycloak';
import session from 'express-session';
import { Request, Response, NextFunction } from 'express';

// Keycloak session middleware
const keycloakSession = session({
  secret: 'sanare-session-secret',
  resave: false,
  saveUninitialized: true,
  store: memoryStore,
});

export { keycloakSession, keycloak };
