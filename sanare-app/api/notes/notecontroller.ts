import type { Request as ExpressRequest } from 'express';
import { Request, Response } from 'express';
import { NoteService } from './noteservice';

interface AuthUser {
  id: string;
  role: string;
}

interface AuthenticatedRequest extends ExpressRequest {
  user?: AuthUser;
}

export class NoteController {
  static async createNote(req: Request, res: Response) {
    try {
      const { patientid, notetitle, notecontent, sessiondate } = req.body;
      if (!patientid || !sessiondate) {
        return res.status(400).json({ error: 'Missing required fields: patientid, sessiondate' });
      }
      const note = await NoteService.createNote({ patientid, notetitle, notecontent, sessiondate });
      res.status(201).json(note);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create note', details: error });
    }
  }

  static async getPatientNotes(req: AuthenticatedRequest, res: Response) {
    try {
      const { patientid } = req.params;
      const sharedOnly = req.query.shared === 'true';
      // Security: Only allow access if user is the patient or their provider
      if (sharedOnly) {
        // If user is a patient, they can only access their own notes
        if (req.user?.role === 'patient' && req.user?.id !== patientid) {
          return res.status(403).json({ error: 'Forbidden' });
        }
      }
      if (!patientid) {
        return res.status(400).json({ error: 'Missing patientid' });
      }
      const notes = await NoteService.getNotesByPatient(patientid, sharedOnly);
      res.json({ notes });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch notes', details: error });
    }
  }

  static async updateNote(req: Request, res: Response) {
    try {
      const { noteid } = req.params;
      const { notetitle, notecontent } = req.body;
      if (!noteid || typeof notecontent !== 'string') {
        return res.status(400).json({ error: 'Missing required fields: noteid, notecontent' });
      }
      const note = await NoteService.updateNote(noteid, notetitle, notecontent);
      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }
      res.json(note);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update note', details: error });
    }
  }

  static async deleteNote(req: Request, res: Response) {
    try {
      const { noteid } = req.params;
      if (!noteid) {
        return res.status(400).json({ error: 'Missing noteid' });
      }
      const deleted = await NoteService.deleteNote(noteid);
      if (!deleted) {
        return res.status(404).json({ error: 'Note not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete note', details: error });
    }
  }

  static async updateNoteSharedStatus(req: Request, res: Response) {
    try {
      const { noteid } = req.params;
      const { isshared } = req.body;
      if (!noteid || typeof isshared !== 'boolean') {
        return res.status(400).json({ error: 'Missing required fields: noteid, isshared' });
      }
      const note = await NoteService.updateNoteSharedStatus(noteid, isshared);
      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }
      res.json(note);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update shared status', details: error });
    }
  }

  static async getNoteComments(req: Request, res: Response) {
    try {
      const { noteid } = req.params;
      if (!noteid) {
        return res.status(400).json({ error: 'Missing noteid' });
      }
      const comments = await NoteService.getComments(noteid);
      if (comments === null) {
        return res.status(404).json({ error: 'Note not found' });
      }
      res.json({ comments });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch comments', details: error });
    }
  }

  static async addNoteComment(req: Request, res: Response) {
    try {
      const { noteid } = req.params;
      const { content, author } = req.body;
      if (!noteid || typeof content !== 'string' || !content.trim()) {
        return res.status(400).json({ error: 'Missing or invalid fields: noteid, content' });
      }
      const comment = await NoteService.addComment(noteid, content, author || 'patient');
      if (!comment) {
        return res.status(404).json({ error: 'Note not found' });
      }
      res.status(201).json(comment);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add comment', details: error });
    }
  }

  static async toggleAcknowledged(req: Request, res: Response) {
    try {
      const { noteid } = req.params;
      if (!noteid) {
        return res.status(400).json({ error: 'Missing noteid' });
      }
      const note = await NoteService.toggleAcknowledged(noteid);
      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }
      res.json(note);
    } catch (error) {
      res.status(500).json({ error: 'Failed to toggle acknowledged', details: error });
    }
  }

  static async deleteNoteComment(req: Request, res: Response) {
    try {
      const { noteid, commentIndex } = req.params;
      const { author } = req.body;
      if (!noteid || typeof commentIndex === 'undefined' || typeof author !== 'string') {
        return res.status(400).json({ error: 'Missing required fields: noteid, commentIndex, author' });
      }
      const deleted = await NoteService.deleteComment(noteid, parseInt(commentIndex, 10), author);
      if (!deleted) {
        return res.status(404).json({ error: 'Comment not found or not allowed to delete' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete comment', details: error });
    }
  }
}
