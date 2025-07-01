import { Request, Response } from 'express';
import { PatientService } from './patientservice';
import { Patient, Note } from '../models';

export class PatientController {
  static async createPatient(req: Request, res: Response) {
    try {
      console.log('PatientController.createPatient body:', req.body);
      const { firstname, lastname, providerid, email, dob } = req.body;
      if (!firstname || !lastname || !providerid || !email) {
        console.error('Missing fields:', { firstname, lastname, providerid, email });
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const patient = await PatientService.createPatient({ firstname, lastname, providerid, email, dob });
      res.status(201).json(patient);
    } catch (error) {
      console.error('Failed to create patient:', error);
      res.status(500).json({ error: 'Failed to create patient', details: error });
    }
  }

  static async getPatients(req: Request, res: Response) {
    const { providerid } = req.query;
    if (!providerid) {
      return res.status(400).json({ error: 'Missing providerid' });
    }
    try {
      const patients = await Patient.findAll({ where: { providerid } });
      res.json({ patients });
    } catch (error) {
      console.error('Failed to fetch patients:', error);
      res.status(500).json({ error: 'Failed to fetch patients', details: error });
    }
  }

  static async getPatient(req: Request, res: Response) {
    const { patientid } = req.params;
    if (!patientid) {
      return res.status(400).json({ error: 'Missing patientid' });
    }
    try {
      const patient = await Patient.findOne({ where: { patientid } });
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      res.json({ patient });
    } catch (error) {
      console.error('Failed to fetch patient:', error);
      res.status(500).json({ error: 'Failed to fetch patient', details: error });
    }
  }

  static async getPatientNotes(req: Request, res: Response) {
    const { patientid } = req.params;
    if (!patientid) {
      return res.status(400).json({ error: 'Missing patientid' });
    }
    try {
      const notes = await Note.findAll({ where: { patientid } });
      res.json({ notes });
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      res.status(500).json({ error: 'Failed to fetch notes', details: error });
    }
  }

  static async updatePatient(req: Request, res: Response) {
    try {
      const { patientid } = req.params;
      const { firstname, lastname, phone, email } = req.body;
      if (!patientid) {
        return res.status(400).json({ error: 'Missing patientid' });
      }
      if (!firstname && !lastname && !phone && !email) {
        return res.status(400).json({ error: 'At least one field must be provided for update' });
      }
      const updatedPatient = await PatientService.updatePatient(patientid, {
        firstname,
        lastname,
        phone,
        email
      });
      if (!updatedPatient) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      res.json({ patient: updatedPatient });
    } catch (error) {
      console.error('Failed to update patient:', error);
      res.status(500).json({ error: 'Failed to update patient', details: error });
    }
  }

  static async deletePatient(req: Request, res: Response) {
    try {
      const { patientid } = req.params;
      if (!patientid) {
        return res.status(400).json({ error: 'Missing patientid' });
      }
      const deleted = await PatientService.deletePatient(patientid);
      if (!deleted) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      res.json({ message: 'Patient deleted successfully' });
    } catch (error) {
      console.error('Failed to delete patient:', error);
      res.status(500).json({ error: 'Failed to delete patient', details: error });
    }
  }

  static async setPatientPassword(req: Request, res: Response) {
    try {
      const { patientid } = req.params;
      const { password } = req.body;
      if (!patientid || !password) {
        return res.status(400).json({ error: 'Missing patientid or password' });
      }
      const updatedPatient = await PatientService.setPatientPassword(patientid, password);
      if (!updatedPatient) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      res.json({ patient: updatedPatient });
    } catch (error) {
      console.error('Failed to set patient password:', error);
      res.status(500).json({ error: 'Failed to set patient password', details: error });
    }
  }
}
