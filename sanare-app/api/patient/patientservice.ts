import { Patient } from '../models';

function generateRandomId(length = 8) {
  return Math.floor(Math.random() * Math.pow(10, length)).toString().padStart(length, '0');
}

export class PatientService {
  static async createPatient(data: {
    firstname: string;
    lastname: string;
    providerid: string;
    phone?: string;
    email: string;
  }) {
    const patientid = generateRandomId(8);
    return Patient.create({
      patientid,
      firstname: data.firstname,
      lastname: data.lastname,
      providerid: data.providerid,
      phone: data.phone,
      email: data.email,
      createdat: new Date(),
    });
  }
}
