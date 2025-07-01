import { Note } from '../models';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

export class NoteService {
  static generateNoteId() {
    // Generate an 8-character random ID (similar to patient/provider)
    return uuidv4().replace(/-/g, '').slice(0, 8);
  }

  static async createNote({ patientid, notetitle, notecontent, sessiondate }: { patientid: string; notetitle?: string; notecontent?: string; sessiondate: string; }) {
    const noteid = this.generateNoteId();
    try {
      const note = await Note.create({
        noteid,
        patientid,
        notetitle: notetitle || null,
        notecontent: notecontent || null,
        sessiondate,
        createdat: new Date(),
        updatedat: new Date(),
        isshared: false, // Always private on creation
        ack: false,
      });
      return note;
    } catch (err) {
      console.error('Error creating note:', err);
      throw err;
    }
  }

  static async getNotesByPatient(patientid: string, sharedOnly = false) {
    const where: any = { patientid };
    if (sharedOnly) where.isshared = true;
    return Note.findAll({
      where,
      order: [['sessiondate', 'DESC']],
    });
  }

  static async getNoteById(noteid: string) {
    return Note.findOne({ where: { noteid } });
  }

  static async updateNote(noteid: string, notetitle: string, notecontent: string) {
    const note = await Note.findOne({ where: { noteid } });
    if (!note) return null;
    note.notetitle = notetitle;
    note.notecontent = notecontent;
    note.updatedat = new Date();
    await note.save();
    return note;
  }

  static async deleteNote(noteid: string) {
    const deleted = await Note.destroy({ where: { noteid } });
    return deleted > 0;
  }

  static async updateNoteSharedStatus(noteid: string, isshared: boolean) {
    const note = await Note.findOne({ where: { noteid } });
    if (!note) return null;
    note.isshared = isshared;
    await note.save();
    return note;
  }

  static async getComments(noteid: string) {
    const note = await Note.findOne({ where: { noteid } });
    if (!note) return null;
    let comments: { content: string; createdAt: string; author: string }[] = [];
    if (note.getDataValue('comments')) {
      try {
        comments = JSON.parse(note.getDataValue('comments'));
      } catch {
        comments = [];
      }
    }
    return comments;
  }

  static async addComment(noteid: string, content: string, author: string = 'patient') {
    try {
      const note = await Note.findOne({ where: { noteid } });
      if (!note) return null;
      let comments: { content: string; createdAt: string; author: string }[] = [];
      if (note.getDataValue('comments')) {
        try {
          comments = JSON.parse(note.getDataValue('comments'));
        } catch {
          comments = [];
        }
      }
      const newComment = { content, createdAt: new Date().toISOString(), author };
      comments.push(newComment);
      note.setDataValue('comments', JSON.stringify(comments));
      await note.save();
      return newComment;
    } catch (err) {
      console.error('Error saving comment:', err);
      throw err;
    }
  }

  static async toggleAcknowledged(noteid: string) {
    const note = await Note.findOne({ where: { noteid } });
    if (!note) return null;
    note.ack = !note.ack;
    await note.save();
    return note;
  }

  static async deleteComment(noteid: string, commentIndex: number, author: string) {
    const note = await Note.findOne({ where: { noteid } });
    if (!note) return null;
    let comments: { content: string; createdAt: string; author: string }[] = [];
    if (note.getDataValue('comments')) {
      try {
        comments = JSON.parse(note.getDataValue('comments'));
      } catch {
        comments = [];
      }
    }
    if (commentIndex < 0 || commentIndex >= comments.length) return null;
    // Only allow delete if author matches
    if (comments[commentIndex].author !== author) return null;
    comments.splice(commentIndex, 1);
    note.setDataValue('comments', JSON.stringify(comments));
    await note.save();
    return true;
  }
}
