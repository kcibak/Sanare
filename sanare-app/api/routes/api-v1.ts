import { Router, Request, Response, NextFunction } from 'express';
import { ProviderController } from '../provider/providercontroller';
import { PatientController } from '../patient/patientcontroller';
import { NoteController } from '../notes/notecontroller';
import { JournalController } from '../journal/journalcontroller';
import { GoalsController } from '../goals/goalscontroller';
import authRoutes from './auth';

const router = Router();

// Helper to wrap async controllers and forward errors
function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Provider creation (use /providers for clarity)
router.post('/providers', asyncHandler(ProviderController.createProvider));
// Patient creation
router.post('/patients', asyncHandler(PatientController.createPatient));
// Patient fetching by providerid
router.get('/patients', asyncHandler(PatientController.getPatients));
// Fetch single patient by patientid
router.get('/patients/:patientid', asyncHandler(PatientController.getPatient));
// Update patient name
router.patch('/patients/:patientid', asyncHandler(PatientController.updatePatient));
// Delete patient
router.delete('/patients/:patientid', asyncHandler(PatientController.deletePatient));
// Set patient password
router.patch('/patients/:patientid/password', asyncHandler(PatientController.setPatientPassword));

// Provider CRUD endpoints
router.get('/providers/:providerId', asyncHandler(ProviderController.getProvider));
router.patch('/providers/:providerId', asyncHandler(ProviderController.updateProvider));
router.delete('/providers/:providerId', asyncHandler(ProviderController.deleteProvider));

// Notes endpoints
router.post('/notes', asyncHandler(NoteController.createNote));
router.get('/patients/:patientid/notes', asyncHandler(NoteController.getPatientNotes));
router.put('/notes/:noteid', asyncHandler(NoteController.updateNote));
router.delete('/notes/:noteid', asyncHandler(NoteController.deleteNote));
router.patch('/notes/:noteid/shared', asyncHandler(NoteController.updateNoteSharedStatus));
router.patch('/notes/:noteid/acknowledged', asyncHandler(NoteController.toggleAcknowledged));
// Comments endpoints
router.get('/notes/:noteid/comments', asyncHandler(NoteController.getNoteComments));
router.post('/notes/:noteid/comments', asyncHandler(NoteController.addNoteComment));
router.delete('/notes/:noteid/comments/:commentIndex', asyncHandler(NoteController.deleteNoteComment));

// Journal endpoints
router.post('/journal', asyncHandler(JournalController.createJournalEntry));
router.get('/patients/:patientid/journal', asyncHandler(JournalController.getJournalEntries));
router.put('/journal/:entryid', asyncHandler(JournalController.updateJournalEntry));
router.delete('/journal/:entryid', asyncHandler(JournalController.deleteJournalEntry));

// Goals endpoints
router.post('/goals', asyncHandler(GoalsController.createGoal));
router.get('/patients/:patientid/goals', asyncHandler(GoalsController.getGoalsForPatient));
router.put('/goals/:goalid', asyncHandler(GoalsController.updateGoal));
router.delete('/tasks/:taskid', asyncHandler(GoalsController.deleteTask));
router.patch('/goals/:goalid/complete', asyncHandler(GoalsController.toggleGoalComplete));
router.patch('/tasks/:taskid/complete', asyncHandler(GoalsController.toggleTaskComplete));
router.post('/tasks', asyncHandler(GoalsController.createTask));

router.use('/auth', authRoutes);

export default router;
