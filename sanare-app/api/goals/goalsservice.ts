import * as models from '../models/index';
import { v4 as uuidv4 } from 'uuid';

interface TaskInput {
  id?: string;
  title: string;
  description?: string;
  completed?: boolean;
}

interface CreateGoalInput {
  patientid: string;
  title: string;
  description?: string;
  tasks?: TaskInput[];
}

interface UpdateGoalInput {
  title?: string;
  description?: string;
  tasks?: TaskInput[];
}

export class GoalsService {
  static async createGoal({ patientid, title, description, tasks }: CreateGoalInput) {
    const goalid = uuidv4().slice(0, 8);
    const goalData = {
      goalid,
      patientid,
      title,
      description,
      iscomplete: false,
    };
    try {
      const goal = await models.Goal.create(goalData);
      let createdTasks: any[] = [];
      if (tasks && tasks.length > 0) {
        createdTasks = await Promise.all(
          tasks.map(async (task) => {
            const taskid = uuidv4().slice(0, 8);
            return await models.Task.create({
              taskid,
              goalid,
              title: task.title,
              iscompleted: !!task.completed,
            });
          })
        );
      }
      return {
        ...goal.toJSON(),
        tasks: createdTasks.map((t) => t.toJSON()),
      };
    } catch (error) {
      console.error('Sequelize Goal.create error:', error);
      throw error;
    }
  }

  static async updateGoal(goalid: string, { title, description, tasks }: UpdateGoalInput) {
    const goal = await models.Goal.findByPk(goalid);
    if (!goal) return null;
    if (title !== undefined) goal.title = title;
    if (description !== undefined) goal.description = description;
    await goal.save();
    await models.Task.destroy({ where: { goalid } });
    let updatedTasks: any[] = [];
    if (tasks && tasks.length > 0) {
      updatedTasks = await Promise.all(
        tasks.map(async (task) => {
          const taskid = uuidv4().slice(0, 8);
          return await models.Task.create({
            taskid,
            goalid,
            title: task.title,
            iscompleted: !!task.completed,
          });
        })
      );
    }
    // If no tasks, goal can be checked off manually
    if (!tasks || tasks.length === 0) {
      // iscomplete is toggled by user, not here
    } else {
      // If all tasks complete, mark goal complete
      const allComplete = updatedTasks.length > 0 && updatedTasks.every((t) => t.iscompleted);
      goal.iscomplete = allComplete;
      await goal.save();
    }
    return {
      ...goal.toJSON(),
      tasks: updatedTasks.map((t) => t.toJSON()),
    };
  }

  static async toggleGoalComplete(goalid: string, iscomplete: boolean) {
    const goal = await models.Goal.findByPk(goalid);
    if (!goal) return null;
    goal.iscomplete = iscomplete;
    await goal.save();
    return goal.toJSON();
  }

  static async toggleTaskComplete(taskid: string, iscompleted: boolean) {
    const task = await models.Task.findByPk(taskid);
    if (!task) return null;
    task.iscompleted = iscompleted;
    await task.save();
    // If this task is part of a goal, check if all tasks are complete
    if (task.goalid) {
      const tasks = await models.Task.findAll({ where: { goalid: task.goalid } });
      if (tasks.length > 0) {
        const allComplete = tasks.every((t) => t.iscompleted);
        const goal = await models.Goal.findByPk(task.goalid);
        if (goal) {
          goal.iscomplete = allComplete;
          await goal.save();
        }
      }
    }
    return task.toJSON();
  }

  static async createTask({ title, iscompleted }: { title: string; iscompleted?: boolean }) {
    const taskid = uuidv4().slice(0, 8);
    const task = await models.Task.create({ taskid, title, iscompleted: !!iscompleted });
    return task.toJSON();
  }

  static async deleteTask(taskid: string) {
    const deleted = await models.Task.destroy({ where: { taskid } });
    return !!deleted;
  }

  static async getGoalsForPatient(patientid: string) {
    try {
      const goals = await models.Goal.findAll({
        where: { patientid },
        include: [{ model: models.Task, as: 'tasks' }],
        order: [['createdat', 'DESC']],
      });
      return goals.map((goal) => {
        const g = goal.toJSON();
        g.tasks = (g.tasks || []).map((t: any) => t);
        return g;
      });
    } catch (error) {
      console.error('Error fetching goals for patient:', error);
      throw error;
    }
  }
}
