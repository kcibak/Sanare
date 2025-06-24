import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { sequelize } from './config/database';
import routes from './routes';
import { keycloakSession, keycloak } from './middleware/keycloak';

// Load environment variables
dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(keycloakSession);
app.use(keycloak.middleware());

app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({ message: 'hello from sanare backend!' });
});

// Test DB connection
sequelize.authenticate()
  .then(() => console.log('Database connected'))
  .catch((err) => console.error('Database connection error:', err));

// Ensure DB tables exist in dev mode (optional, safe for dev)
if (process.env.NODE_ENV !== 'production') {
  sequelize.sync()
    .then(() => console.log('Database synced (dev mode, no alter)'))
    .catch((err) => console.error('Database sync error:', err));
}

export default app;
