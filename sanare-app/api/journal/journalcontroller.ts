import { Request, Response } from 'express';
import { JournalService } from './journalservice';

export class JournalController {
  static async createJournalEntry(req: Request, res: Response) {
    try {
      const { patientid, title, content } = req.body;
      const entry = await JournalService.createJournalEntry({ patientid, title, content });
      res.status(201).json(entry);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async getJournalEntries(req: Request, res: Response) {
    try {
      const { patientid } = req.params;
      const entries = await JournalService.getJournalEntries(patientid);
      res.json(entries);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async updateJournalEntry(req: Request, res: Response) {
    try {
      const { entryid } = req.params;
      const { title, content } = req.body;
      const entry = await JournalService.updateJournalEntry(entryid, { title, content });
      res.json(entry);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async deleteJournalEntry(req: Request, res: Response) {
    try {
      const { entryid } = req.params;
      const result = await JournalService.deleteJournalEntry(entryid);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
