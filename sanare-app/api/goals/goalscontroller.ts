import { Request, Response } from 'express';
import { GoalsService } from './goalsservice';

export class GoalsController {
  static async createGoal(req: Request, res: Response) {
    try {
      const { patientid, title, description, tasks } = req.body;
      if (!patientid || !title) {
        return res.status(400).json({ error: 'Missing required fields: patientid, title' });
      }
      const goal = await GoalsService.createGoal({ patientid, title, description, tasks });
      res.status(201).json(goal);
    } catch (error: any) {
      console.error('Failed to create goal:', error && error.stack ? error.stack : error);
      res.status(500).json({ error: 'Failed to create goal', details: error && error.message ? error.message : error });
    }
  }

  static async updateGoal(req: Request, res: Response) {
    try {
      const { goalid } = req.params;
      const { title, description, tasks } = req.body;
      if (!goalid) {
        return res.status(400).json({ error: 'Missing goalid' });
      }
      const updated = await GoalsService.updateGoal(goalid, { title, description, tasks });
      if (!updated) return res.status(404).json({ error: 'Goal not found' });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update goal', details: error });
    }
  }

  static async deleteTask(req: Request, res: Response) {
    try {
      const { taskid } = req.params;
      if (!taskid) return res.status(400).json({ error: 'Missing taskid' });
      const deleted = await GoalsService.deleteTask(taskid);
      if (!deleted) return res.status(404).json({ error: 'Task not found' });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete task', details: error });
    }
  }

  static async getGoalsForPatient(req: Request, res: Response) {
    try {
      const { patientid } = req.params;
      if (!patientid) return res.status(400).json({ error: 'Missing patientid' });
      const goals = await GoalsService.getGoalsForPatient(patientid);
      res.json({ goals });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch goals', details: error });
    }
  }

  static async toggleGoalComplete(req: Request, res: Response) {
    try {
      const { goalid } = req.params;
      const { iscomplete } = req.body;
      const goal = await GoalsService.toggleGoalComplete(goalid, iscomplete);
      res.json(goal);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update goal complete', details: error });
    }
  }

  static async toggleTaskComplete(req: Request, res: Response) {
    try {
      const { taskid } = req.params;
      const { iscompleted } = req.body;
      const task = await GoalsService.toggleTaskComplete(taskid, iscompleted);
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update task complete', details: error });
    }
  }

  static async createTask(req: Request, res: Response) {
    try {
      const { title, iscompleted } = req.body;
      const task = await GoalsService.createTask({ title, iscompleted });
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create task', details: error });
    }
  }
}
