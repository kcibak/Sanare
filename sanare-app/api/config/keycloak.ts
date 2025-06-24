import Keycloak from 'keycloak-connect';
import session from 'express-session';
import dotenv from 'dotenv';

dotenv.config();

const memoryStore = new session.MemoryStore();

// Use 'as any' on the whole config object to suppress all type errors
const keycloak = new Keycloak(
  { store: memoryStore },
  {
    realm: process.env.KEYCLOAK_REALM || 'sanare',
    'auth-server-url': process.env.KEYCLOAK_URL || 'http://localhost:8080',
    resource: process.env.KEYCLOAK_CLIENT_ID || 'sanare-app',
    'bearer-only': false,
    'ssl-required': 'external',
    'confidential-port': 0,
    credentials: {
      secret: process.env.KEYCLOAK_CLIENT_SECRET || '',
    },
  } as any
);

export { keycloak, memoryStore };
