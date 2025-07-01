import { Patient, Note } from '../models';

function generateRandomId(length = 8) {
  return Math.floor(Math.random() * Math.pow(10, length)).toString().padStart(length, '0');
}

export class PatientService {
  static async createPatient(data: {
    firstname: string;
    lastname: string;
    providerid: string;
    email: string;
    dob?: string;
  }) {
    const patientid = generateRandomId(8);
    return Patient.create({
      patientid,
      firstname: data.firstname,
      lastname: data.lastname,
      providerid: data.providerid,
      email: data.email,
      dob: data.dob,
      createdat: new Date(),
    });
  }

  static async updatePatient(patientid: string, updateData: {
    firstname?: string;
    lastname?: string;
    phone?: string;
    email?: string;
  }) {
    const patient = await Patient.findOne({ where: { patientid } });
    if (!patient) {
      return null;
    }
    await patient.update(updateData);
    return patient;
  }

  static async deletePatient(patientid: string) {
    // Delete all notes for this patient first
    await Note.destroy({ where: { patientid } });
    const patient = await Patient.findOne({ where: { patientid } });
    if (!patient) {
      return false;
    }
    await patient.destroy();
    return true;
  }

  static async setPatientPassword(patientid: string, password: string) {
    const patient = await Patient.findOne({ where: { patientid } });
    if (!patient) {
      return null;
    }
    await patient.update({ password });
    return patient;
  }
}
