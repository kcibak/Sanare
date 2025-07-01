import { Journal } from '../models';
import { v4 as uuidv4 } from 'uuid';

export class JournalService {
  static async createJournalEntry({ patientid, title, content }: { patientid: string; title: string; content?: string }) {
    const entryid = uuidv4().slice(0, 8);
    return Journal.create({ entryid, patientid, title, content });
  }

  static async getJournalEntries(patientid: string) {
    return Journal.findAll({ where: { patientid }, order: [['createdat', 'DESC']] });
  }

  static async updateJournalEntry(entryid: string, data: { title?: string; content?: string }) {
    const entry = await Journal.findByPk(entryid);
    if (!entry) throw new Error('Journal entry not found');
    await entry.update({ ...data, updatedat: new Date() });
    return entry;
  }

  static async deleteJournalEntry(entryid: string) {
    const entry = await Journal.findByPk(entryid);
    if (!entry) throw new Error('Journal entry not found');
    await entry.destroy();
    return { success: true };
  }
}
