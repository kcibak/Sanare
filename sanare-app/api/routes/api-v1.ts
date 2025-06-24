import { Router, Request, Response, NextFunction } from 'express';
import { keycloak } from '../middleware/keycloak';
import { KeycloakRequest } from '../types';
import { ProviderController } from '../provider/providercontroller';
import { PatientController } from '../patient/patientcontroller';
import authRoutes from './auth';

const router = Router();

// Helper to wrap async controllers and forward errors
function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Protected route using Keycloak
router.get('/me', keycloak.protect(), (req, res) => {
  const user = (req as KeycloakRequest).kauth?.grant?.access_token?.content || null;
  res.json({ message: 'Protected route', user });
});

// Provider creation (use /providers for clarity)
router.post('/providers', asyncHandler(ProviderController.createProvider));
// Patient creation
router.post('/patients', asyncHandler(PatientController.createPatient));
// Patient fetching by providerid
router.get('/patients', asyncHandler(PatientController.getPatients));
// Fetch single patient by patientid
router.get('/patients/:patientid', asyncHandler(PatientController.getPatient));
// Fetch all notes for a patient
router.get('/patients/:patientid/notes', asyncHandler(PatientController.getPatientNotes));

// Provider CRUD endpoints
router.get('/providers/:providerId', asyncHandler(ProviderController.getProvider));
router.patch('/providers/:providerId', asyncHandler(ProviderController.updateProvider));
router.delete('/providers/:providerId', asyncHandler(ProviderController.deleteProvider));

router.use('/auth', authRoutes);

export default router;
