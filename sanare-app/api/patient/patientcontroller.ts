import { Request, Response } from 'express';
import { PatientService } from './patientservice';
import { Patient, Note } from '../models';

export class PatientController {
  static async createPatient(req: Request, res: Response) {
    try {
      console.log('PatientController.createPatient body:', req.body);
      const { firstname, lastname, providerid, phone, email } = req.body;
      if (!firstname || !lastname || !providerid || !email) {
        console.error('Missing fields:', { firstname, lastname, providerid, email });
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const patient = await PatientService.createPatient({ firstname, lastname, providerid, phone, email });
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
}
